'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  DndContext, DragOverlay, PointerSensor, closestCorners, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent, type DragOverEvent,
} from '@dnd-kit/core';

import type { BoardData, ColumnData, CardData } from '@/lib/types';
import { getBoard, updateCard, createColumn, updateColumn } from '@/lib/api';
import Column from './Column';
import AddStatusColumn from './AddStatusColumn';
import CreateIssueForm from './CreateIssueForm';
import BoardSkeleton from './BoardSkeleton';
import Toast from './Toast';
import IssueCardFace from './IssueCardFace';

export default function BoardPage() {
  const [board, setBoard] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const [preselectedColumn, setPreselectedColumn] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const boardRef = useRef<BoardData | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  useEffect(() => { boardRef.current = board; }, [board]);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'error') => {
    setToast({ msg, type });
  }, []);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBoard();
      setBoard(data);
    } catch {
      setError('Failed to load board. Is the server running?');
    }
    setLoading(false);
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadBoard(); }, [loadBoard]);

  const handleNewIssue = useCallback((columnId: number) => {
    setEditingCard(null);
    setPreselectedColumn(columnId);
    setIssueModalOpen(true);
  }, []);

  const handleCardClick = useCallback((card: CardData) => {
    setEditingCard(card);
    setPreselectedColumn(null);
    setIssueModalOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    loadBoard();
    showToast('Task saved', 'success');
  }, [loadBoard, showToast]);

  const handleDelete = useCallback(() => {
    loadBoard();
    showToast('Task deleted', 'success');
  }, [loadBoard, showToast]);

  const handleAddColumn = useCallback(async (title: string) => {
    try {
      await createColumn({ title });
      await loadBoard();
      showToast('Column added', 'success');
    } catch {
      showToast('Failed to add column');
    }
  }, [loadBoard, showToast]);

  const handleEditColumn = useCallback(async (id: number, data: { title?: string; color?: string }) => {
    try {
      await updateColumn(id, data);
      await loadBoard();
    } catch {
      showToast('Failed to update column');
    }
  }, [loadBoard, showToast]);

  const findColumn = useCallback((id: string) => {
    const colId = Number(id.replace('column-', ''));
    return boardRef.current?.columns.find((c) => c.id === colId) ?? null;
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const cardId = Number(event.active.id.toString().replace('card-', ''));
    const currentBoard = boardRef.current;
    if (!currentBoard) return;
    for (const col of currentBoard.columns) {
      const card = col.cards.find((c) => c.id === cardId);
      if (card) { setActiveCard(card); return; }
    }
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    const currentBoard = boardRef.current;
    if (!over || !currentBoard) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    if (activeId === overId) return;

    const activeCardId = Number(activeId.replace('card-', ''));
    const isOverColumn = overId.startsWith('column-');
    const overColumn = isOverColumn ? findColumn(overId) : null;
    const overCardId = isOverColumn ? null : Number(overId.replace('card-', ''));
    const overCardColumn = overCardId
      ? currentBoard.columns.find((c) => c.cards.some((crd) => crd.id === overCardId))
      : overColumn;

    if (!overCardColumn) return;

    setBoard((prev) => {
      if (!prev) return prev;
      const newCols = prev.columns.map((c) => ({ ...c, cards: [...c.cards] }));
      const sourceCol = newCols.find((c) => c.cards.some((crd) => crd.id === activeCardId));
      const targetCol = overCardColumn ? newCols.find((c) => c.id === overCardColumn.id) : null;
      if (!sourceCol || !targetCol || sourceCol.id === targetCol.id) return prev;

      const cardIdx = sourceCol.cards.findIndex((c) => c.id === activeCardId);
      const [movedCard] = sourceCol.cards.splice(cardIdx, 1);
      movedCard.column = targetCol.id;
      movedCard.column_title = targetCol.title;
      movedCard.color = targetCol.color;

      if (overCardId) {
        const overIdx = targetCol.cards.findIndex((c) => c.id === overCardId);
        targetCol.cards.splice(overIdx, 0, movedCard);
      } else {
        targetCol.cards.push(movedCard);
      }

      return { ...prev, columns: newCols };
    });
  }, [findColumn]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    const currentBoard = boardRef.current;
    if (!over || !currentBoard) return;

    const activeId = Number(active.id.toString().replace('card-', ''));
    const sourceCol = currentBoard.columns.find((c) => c.cards.some((crd) => crd.id === activeId));
    if (!sourceCol) return;

    let targetCol: ColumnData | null = null;
    let targetPosition = 0;

    const overId = over.id.toString();
    if (overId.startsWith('column-')) {
      targetCol = findColumn(overId);
      targetPosition = targetCol ? targetCol.cards.length - 1 : 0;
    } else {
      const overCardId = Number(overId.replace('card-', ''));
      for (const col of currentBoard.columns) {
        const idx = col.cards.findIndex((c) => c.id === overCardId);
        if (idx >= 0) { targetCol = col; targetPosition = idx; break; }
      }
    }

    if (!targetCol) return;
    const sameColumn = sourceCol.id === targetCol.id;

    if (sameColumn) {
      const cards = sourceCol.cards;
      const oldIdx = cards.findIndex((c) => c.id === activeId);
      const newIdx = cards.findIndex((c) => c.id === Number(overId.replace('card-', '')));
      if (oldIdx === newIdx) return;
      try {
        await updateCard(activeId, { position: newIdx, column: targetCol.id });
      } catch { showToast('Failed to reorder card'); loadBoard(); }
      return;
    }

    const card = currentBoard.columns.flatMap((c) => c.cards).find((c) => c.id === activeId);
    if (!card) return;
    try {
      await updateCard(activeId, { column: targetCol.id, position: targetPosition, color: targetCol.color });
      showToast('Card moved', 'success');
    } catch {
      showToast('Failed to move card');
      loadBoard();
    }
  }, [findColumn, loadBoard, showToast]);

  if (loading) return <BoardSkeleton />;
  if (error) return (
    <div className="ex-empty-state-card">
      <p className="type-body mb-4">{error}</p>
      <button type="button" onClick={loadBoard} className="btn-primary">Retry</button>
    </div>
  );
  if (!board) return null;

  return (
    <div className="page-frame">
      <div className="page-canvas">
        <header className="top-banner flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="type-heading-1 truncate">{board.title}</p>
            <p className="type-body-sm mt-1 text-on-primary">Track tasks across columns</p>
          </div>
          <button type="button" onClick={() => handleNewIssue(board.columns[0]?.id ?? 0)} className="btn-yellow self-start sm:self-auto">
            + New Task
          </button>
        </header>
        <div className="board-workspace">
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <div className="flex min-h-full gap-4">
              {board.columns.map((col) => (
                <Column key={col.id} column={col} onCardClick={handleCardClick} onNewIssue={handleNewIssue} onEditColumn={handleEditColumn} />
              ))}
              <AddStatusColumn onAdd={handleAddColumn} />
            </div>
            <DragOverlay>
              {activeCard ? (
                <div className="w-72 rotate-3 scale-105 opacity-90">
                  <IssueCardFace card={activeCard} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
        <footer className="footer-band type-body-sm text-center">
          <p>{board.title} — track team tasks online.</p>
        </footer>
      </div>
      {issueModalOpen && board && (
        <CreateIssueForm
          columns={board.columns}
          editingCard={editingCard}
          preselectedColumn={preselectedColumn}
          onSave={handleSave}
          onDelete={handleDelete}
          onError={(msg) => showToast(msg, 'error')}
          onClose={() => { setIssueModalOpen(false); setEditingCard(null); setPreselectedColumn(null); }}
        />
      )}
      {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
}
