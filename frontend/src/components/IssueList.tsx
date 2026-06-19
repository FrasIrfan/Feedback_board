'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Issue, Status } from '@/lib/types';
import { getIssues, updateIssueStatus, ApiClientError } from '@/lib/api';
import IssueCard from './IssueCard';
import IssueModal from './IssueModal';

export default function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIssues();
      setIssues(data);
    } catch {
      setError('Failed to load issues. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleStatusChange = async (id: number, status: Status) => {
    const previous = [...issues];
    setIssues((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    setSelectedIssue((prev) => (prev?.id === id ? { ...prev, status } : prev));

    try {
      await updateIssueStatus(id, { status });
    } catch (err) {
      setIssues(previous);
      setSelectedIssue((prev) => {
        if (!prev || prev.id !== id) return prev;
        const original = previous.find((i) => i.id === id);
        return original ?? prev;
      });
      if (err instanceof ApiClientError) {
        setError(
          typeof err.body === 'object' && err.body
            ? Object.values(err.body as Record<string, string[]>).flat().join(', ')
            : 'Failed to update status',
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="hairline-border animate-pulse">
            <div className="ribbon-card-title h-10 bg-canvas" />
            <div className="ribbon-card-body bg-tint-steel">
              <div className="mb-3 h-4 w-3/4 bg-tint-sky" />
              <div className="mb-2 h-3 w-full bg-tint-sky" />
              <div className="h-3 w-5/6 bg-tint-sky" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="ex-empty-state-card">
        <p className="type-body mb-4">{error}</p>
        <button type="button" onClick={fetchIssues} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="ex-empty-state-card bg-tint-sky">
        <p className="type-body">No issues yet. Create one to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {issues.map((issue) => (
          <IssueCard
            key={issue.id}
            issue={issue}
            onOpen={setSelectedIssue}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}
