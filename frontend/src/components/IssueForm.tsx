'use client';

import { useState, useEffect, useRef } from 'react';
import type { Priority, ApiError } from '@/lib/types';
import { createIssue, ApiClientError } from '@/lib/api';
import { PRIORITY_OPTIONS } from '@/lib/indicators';

interface IssueFormProps {
  onCreated: () => void;
  onError: (msg: string) => void;
}

export default function IssueForm({ onCreated, onError }: IssueFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ApiError>({});
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const validate = (): boolean => {
    const e: ApiError = {};
    if (!title.trim()) e.title = ['Title is required'];
    else if (title.length > 200) e.title = ['Title must be 200 characters or fewer'];
    if (!description.trim()) e.description = ['Description is required'];
    else if (description.trim().length < 10) {
      e.description = ['Description must be at least 10 characters'];
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createIssue({ title: title.trim(), description: description.trim(), priority });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setErrors({});
      onCreated();
    } catch (err) {
      if (err instanceof ApiClientError && err.body) {
        setErrors(err.body as ApiError);
      } else {
        onError('Failed to create issue. Is the server running?');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hairline-border bg-surface p-4 sm:p-6">
      <div className="ribbon-card-title mb-4 border-b-0">
        <h2 className="type-heading-3">Submit New Issue</h2>
      </div>

      <div className="cta-block-red mb-4 type-body">
        Describe the technical issue clearly. Our team will track it from open to done.
      </div>

      <div className="mb-4">
        <label htmlFor="title" className="type-ui-label mb-1 block">
          Title
        </label>
        <input
          ref={titleRef}
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className={`text-input ${errors.title ? 'border-primary' : ''}`}
          placeholder="What needs to be done?"
        />
        {errors.title && <p className="type-body-sm mt-1 text-primary">{errors.title[0]}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="type-ui-label mb-1 block">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`text-input resize-y ${errors.description ? 'border-primary' : ''}`}
          placeholder="Describe the issue in detail..."
        />
        {errors.description && (
          <p className="type-body-sm mt-1 text-primary">{errors.description[0]}</p>
        )}
      </div>

      <fieldset className="mb-5 border-0 p-0">
        <legend className="type-ui-label mb-2 block">Priority</legend>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_OPTIONS.map(({ value, label, indicator }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-2 border border-frame-ink px-3 py-2 ${
                priority === value ? 'bg-tint-steel' : 'bg-canvas'
              }`}
            >
              <input
                type="radio"
                name="priority"
                value={value}
                checked={priority === value}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="sr-only"
              />
              <span className={`indicator-dot ${indicator}`} aria-hidden="true" />
              <span className="type-ui-label">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? 'Submitting...' : 'Create Issue'}
      </button>
    </form>
  );
}
