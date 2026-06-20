'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { ColumnData, CardData } from '@/lib/types';
import CardTile from './CardTile';
import ColorPicker from './ColorPicker';

interface ColumnProps {
  column: ColumnData;
  onCardClick: (card: CardData) => void;
  onNewIssue: (columnId: number) => void;
  onEditColumn: (id: number, data: { title?: string; color?: string }) => void;
}

export default function Column({ column, onCardClick, onNewIssue, onEditColumn }: ColumnProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [editColor, setEditColor] = useState(column.color);

  const { setNodeRef, isOver } = useDroppable({ id: `column-${column.id}` });

  const cardIds = column.cards.map((c) => `card-${c.id}`);

  const handleSaveEdit = () => {
    if ((editTitle.trim() && editTitle !== column.title) || editColor !== column.color) {
      onEditColumn(column.id, { title: editTitle.trim(), color: editColor });
    }
    setEditing(false);
  };

  return (
    <div
      className={`flex h-full w-80 shrink-0 flex-col border border-frame-ink bg-frame-ink transition-all ${
        isOver ? 'border-yellow-sticker bg-tint-steel/30' : ''
      }`}
    >
      <div
        className="flex min-h-11 items-center gap-2 border-b border-ink px-3 py-2"
        style={{ backgroundColor: column.color, border: '1px solid #000' }}
      >
        <span
          className="inline-block h-3 w-3 shrink-0 rounded-none border border-ink"
          style={{ backgroundColor: column.color }}
        />
        {editing ? (
          <div className="flex flex-1 flex-col gap-1">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-input w-full text-[11px]"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') setEditing(false); }}
            />
            <ColorPicker value={editColor} onChange={setEditColor} />
            <div className="flex gap-2">
              <button type="button" onClick={handleSaveEdit} className="btn-primary flex-1 text-[11px]">
                Save
              </button>
              <button type="button" onClick={() => { setEditTitle(column.title); setEditColor(column.color); setEditing(false); }} className="btn-secondary text-[11px]">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="type-heading-3 flex-1 truncate text-ink">{column.title}</h2>
            <span className="type-caption border border-frame-ink bg-canvas px-1.5 py-0.5 text-ink">
              {column.cards.length}
            </span>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="type-caption border border-frame-ink bg-canvas px-1.5 py-0.5 text-ink"
              aria-label={`Edit ${column.title}`}
            >
              Edit
            </button>
          </>
        )}
      </div>
      <div
        ref={setNodeRef}
        className="flex min-h-80 flex-1 flex-col border-t border-frame-ink bg-tint-steel/20 p-3"
      >
        <div className="flex-1">
          <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
            {column.cards.length > 0 ? (
              column.cards.map((card) => (
                <CardTile key={card.id} card={card} onClick={onCardClick} />
              ))
            ) : (
              <div className="ex-empty-state-card mb-3 border-frame-ink bg-frame-ink text-on-primary">
                <p className="type-body-sm">No tasks yet</p>
                <p className="type-caption mt-1 text-on-primary">Drop cards here</p>
              </div>
            )}
          </SortableContext>
        </div>
        <button
          type="button"
          onClick={() => onNewIssue(column.id)}
          className="btn-yellow mt-3 w-full text-[12px]"
        >
          + New Task
        </button>
      </div>
    </div>
  );
}
