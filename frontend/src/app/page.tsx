'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import IssueForm from '@/components/IssueForm';
import IssueList from '@/components/IssueList';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const btnRef = useRef<HTMLButtonElement>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'error') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleCreated = useCallback(() => {
    setShowForm(false);
    setRefreshKey((k) => k + 1);
    showToast('Issue created', 'success');
  }, [showToast]);

  const handleError = useCallback((msg: string) => {
    showToast(msg, 'error');
  }, [showToast]);

  useEffect(() => {
    if (!showForm) btnRef.current?.focus();
  }, [showForm]);

  return (
    <div className="page-frame">
      <div className="page-canvas">
        <header className="top-banner flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="type-heading-2">Task Feedback Board</p>
            <p className="type-body-sm mt-1 text-on-primary/90">
              Submit technical issues. Track progress. Get it done.
            </p>
          </div>
          <div>
            <button
              ref={btnRef}
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className={showForm ? 'btn-secondary bg-canvas text-ink' : 'btn-yellow'}
            >
              {showForm ? 'Cancel' : 'New Issue'}
            </button>
          </div>
        </header>

        <section className="section-eyebrow bg-tint-olive">
          <h1 className="type-display uppercase text-ink">Open Issues</h1>
        </section>

        {showForm && (
          <section className="border-b border-frame-ink px-4 py-6 sm:px-6">
            <IssueForm onCreated={handleCreated} onError={handleError} />
          </section>
        )}

        <section className="px-4 py-8 sm:px-6">
          <IssueList key={refreshKey} />
        </section>

        <footer className="footer-band type-body-sm text-center">
          <p>Task Feedback Board — track team issues online.</p>
          <p className="type-caption mt-2 text-ink">
            Best viewed with browser versions 3.0 and higher.
          </p>
        </footer>
      </div>

      {toast && (
        <div
          className={`ex-toast type-body-sm fixed bottom-6 left-1/2 z-50 -translate-x-1/2 ${
            toastType === 'success' ? 'border-frame-ink' : 'border-primary bg-tint-salmon'
          }`}
          role="status"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
