'use client';

import type { Issue, Status } from '@/lib/types';
import { PRIORITY_INDICATOR, PRIORITY_LABEL, priorityBadgeTextClass } from '@/lib/indicators';
import StatusDropdown from './StatusDropdown';

const PRIORITY_TINT: Record<string, string> = {
  high: 'bg-tint-salmon',
  medium: 'bg-tint-peach',
  low: 'bg-tint-sage',
};

interface IssueCardProps {
  issue: Issue;
  onStatusChange: (id: number, status: Status) => void;
  onOpen: (issue: Issue) => void;
}

export default function IssueCard({ issue, onStatusChange, onOpen }: IssueCardProps) {
  const handleStatusChange = (status: Status) => {
    onStatusChange(issue.id, status);
  };

  const bodyTint = PRIORITY_TINT[issue.priority] ?? 'bg-tint-steel';
  const priorityIndicator = PRIORITY_INDICATOR[issue.priority];

  const handleOpen = () => onOpen(issue);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpen();
        }
      }}
      className="hairline-border cursor-pointer"
      aria-label={`View issue: ${issue.title}`}
    >
      <div className="ribbon-card-title flex items-start justify-between gap-3">
        <h3 className="type-heading-3">{issue.title}</h3>
        <span
          className={`type-ui-label shrink-0 border border-frame-ink px-2 py-1 ${priorityIndicator} ${priorityBadgeTextClass(issue.priority)}`}
        >
          {PRIORITY_LABEL[issue.priority]}
        </span>
      </div>

      <div className={`ribbon-card-body ${bodyTint}`}>
        <p className="type-body-lg line-clamp-3">{issue.description}</p>

        <div
          className="mt-4 flex flex-col gap-3 border-t border-frame-ink pt-3 sm:flex-row sm:items-start sm:justify-between"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <time className="type-caption" dateTime={issue.created_at}>
            {new Date(issue.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </time>
          <StatusDropdown issueId={issue.id} value={issue.status} onChange={handleStatusChange} />
        </div>
      </div>
    </article>
  );
}
