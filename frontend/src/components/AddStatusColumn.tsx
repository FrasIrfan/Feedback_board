'use client';

import { useState } from 'react';

interface AddStatusColumnProps {
  onAdd: (title: string) => void;
}

export default function AddStatusColumn({ onAdd }: AddStatusColumnProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <div className="flex w-80 shrink-0 flex-col">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="type-button flex min-h-11 items-center gap-2 border border-dashed border-frame-ink bg-frame-ink px-3 py-3 text-[11px] text-on-primary"
        >
          <span aria-hidden="true">+</span>
          New status
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-80 shrink-0 flex-col border border-frame-ink bg-frame-ink">
      <div className="p-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Column name..."
          className="text-input mb-2 text-[11px]"
          autoFocus
          onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setOpen(false); }}
        />
        <div className="flex gap-2">
          <button type="button" onClick={handleAdd} className="btn-primary flex-1 text-[11px]">
            Add
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn-secondary text-[11px]">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
