'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { CardData, ColumnData, CommentData, Priority } from '@/lib/types';
import { createIssue, updateIssue, deleteCard, getComments, createComment, ApiClientError } from '@/lib/api';
import { PRIORITY_INDICATOR, PRIORITY_LABEL } from '@/lib/indicators';

interface CreateIssueFormProps {
  columns: ColumnData[];
  editingCard: CardData | null;
  preselectedColumn?: number | null;
  onSave: () => void;
  onDelete: (cardId: number) => void;
  onClose: () => void;
  onError: (msg: string) => void;
}

export default function CreateIssueForm({ columns, editingCard, preselectedColumn, onSave, onDelete, onClose, onError }: CreateIssueFormProps) {
  const [title, setTitle] = useState(editingCard?.title ?? '');
  const [description, setDescription] = useState(editingCard?.description ?? '');
  const [priority, setPriority] = useState<Priority>(editingCard?.priority ?? 'medium');
  const [columnId, setColumnId] = useState(editingCard?.column ?? preselectedColumn ?? columns[0]?.id ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [createMore, setCreateMore] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!editingCard) return;
    getComments(editingCard.id).then(setComments).catch(() => {});
  }, [editingCard]);

  useEffect(() => {
    document.body.classList.add('modal-open');
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const selectedColumn = columns.find((col) => col.id === columnId);
  const bodyColor = selectedColumn?.color ?? editingCard?.color;

  const handleSubmit = async () => {
    if (!title.trim()) { setTitleError(true); return; }
    if (!columnId || submitting) return;
    setSubmitting(true);
    try {
      if (editingCard && editingCard.issue_id) {
        await updateIssue(editingCard.issue_id, { title: title.trim(), description: description.trim(), priority, column: columnId });
      } else {
        await createIssue({ title: title.trim(), description: description.trim(), priority, column: columnId });
      }
      if (!createMore) onClose();
      else {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setColumnId(columns[0]?.id ?? 0);
        titleRef.current?.focus();
      }
      onSave();
    } catch (err) {
      if (err instanceof ApiClientError && err.body) {
        const msgs = Object.values(err.body as Record<string, string[]>).flat();
        onError(msgs.join(', ') || 'Failed to save task');
      } else {
        onError('Failed to save task');
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async () => {
    if (!editingCard) return;
    try {
      await deleteCard(editingCard.id);
      onDelete(editingCard.id);
      onClose();
    } catch {
      onError('Failed to delete task');
    }
  };

  const handleAddComment = async () => {
    if (!editingCard || !commentBody.trim()) return;
    try {
      await createComment(editingCard.id, commentBody.trim());
      setCommentBody('');
      const updated = await getComments(editingCard.id);
      setComments(updated);
    } catch {
      onError('Failed to add comment');
    }
  };

  return createPortal(
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose} role="presentation">
      <div className="ex-modal-card max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" aria-label={editingCard ? 'Edit task' : 'Create task'} onClick={(e) => e.stopPropagation()}>
        <div className="ribbon-card-title flex items-start justify-between gap-3 border-frame-ink bg-frame-ink text-on-primary">
          <h2 className="type-heading-1 min-w-0 flex-1 break-words uppercase">
            {editingCard ? 'Edit Task' : 'New Task'}
          </h2>
          <div className="flex items-center gap-2">
            {editingCard && editingCard.issue_key && (
              <span className="type-caption border border-frame-ink px-1.5 py-0.5">{editingCard.issue_key}</span>
            )}
            <button type="button" onClick={onClose} className="btn-secondary px-3 py-1 text-[12px]" aria-label="Close">Close</button>
          </div>
        </div>
        <div className="ribbon-card-body border-frame-ink" style={{ backgroundColor: bodyColor }}>
          <div className="mb-3">
            <label className="type-ui-label mb-1 block">Title</label>
            <textarea ref={titleRef} value={title} onChange={(e) => { setTitle(e.target.value); setTitleError(false); }} maxLength={200} rows={1} className={`text-input resize-none text-[16px] ${titleError ? 'border-primary' : ''}`} placeholder="What needs to be done?" />
            <div className="flex items-center justify-between gap-2">
              {titleError && <p className="type-caption text-primary">Title is required</p>}
              <p className={`type-caption ml-auto ${titleError ? 'text-primary' : 'text-ink/50'}`}>{title.length}/200</p>
            </div>
          </div>
          <div className="mb-3">
            <label className="type-ui-label mb-1 block">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="text-input resize-y text-[16px]" placeholder="Optional description..." />
          </div>
          <div className="mb-3">
            <label className="type-ui-label mb-1 block">Priority</label>
            <div className="flex gap-2">
              {(Object.entries(PRIORITY_LABEL) as [Priority, string][]).map(([val, label]) => (
                <button key={val} type="button" onClick={() => setPriority(val)} className={`flex items-center gap-1.5 border border-frame-ink px-2 py-1 text-[12px] ${priority === val ? 'bg-tint-steel' : 'bg-canvas'}`}>
                  <span className={`indicator-dot ${PRIORITY_INDICATOR[val]}`} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <label className="type-ui-label mb-1 block">Status</label>
            <select value={columnId} onChange={(e) => setColumnId(Number(e.target.value))} className="text-input text-[14px]">
              {columns.map((col) => (
                <option key={col.id} value={col.id} style={{ backgroundColor: col.color }}>{col.title}</option>
              ))}
            </select>
          </div>
          {editingCard && (
            <div className="mb-3 flex gap-3 type-caption text-ink/60">
              <span>Created: {new Date(editingCard.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>Updated: {new Date(editingCard.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-primary flex-1 text-[12px]">{submitting ? 'Saving...' : 'Save'}</button>
            {!editingCard && (
              <label className="flex cursor-pointer items-center gap-1 type-caption">
                <input type="checkbox" checked={createMore} onChange={(e) => setCreateMore(e.target.checked)} className="sr-only" />
                <span className={`inline-block h-3 w-3 border border-frame-ink ${createMore ? 'bg-ink' : 'bg-canvas'}`} />
                Create more
              </label>
            )}
          </div>
          {editingCard && (
            <>
              <div className="mb-3 mt-4 border-t border-frame-ink pt-3">
                <h3 className="type-heading-3 mb-2">Feedback ({comments.length})</h3>
                {comments.length > 0 ? (
                  <div className="mb-3 max-h-40 space-y-2 overflow-y-auto">
                    {comments.map((c) => (
                      <div key={c.id} className="hairline-border bg-canvas p-2">
                        <p className="type-body-sm">{c.body}</p>
                        <p className="type-caption mt-1 text-ink/50">{new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="type-body-sm mb-3 text-ink/50">No feedback yet.</p>
                )}
                <div className="flex gap-2">
                  <input value={commentBody} onChange={(e) => setCommentBody(e.target.value)} placeholder="Add feedback..." className="text-input flex-1 text-[11px]" onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }} />
                  <button type="button" onClick={handleAddComment} disabled={!commentBody.trim()} className="btn-secondary text-[11px]">Send</button>
                </div>
              </div>
              <div className="border-t border-frame-ink pt-3">
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-2">
                    <p className="type-body-sm flex-1 text-primary">Delete this task?</p>
                    <button type="button" onClick={handleDelete} className="btn-primary bg-primary text-on-primary text-[11px]">Confirm</button>
                    <button type="button" onClick={() => setShowDeleteConfirm(false)} className="btn-secondary text-[11px]">Cancel</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setShowDeleteConfirm(true)} className="btn-primary bg-primary text-on-primary text-[12px]">Delete task</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
