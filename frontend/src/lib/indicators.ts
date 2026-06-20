import type { Priority } from './types';

export const PRIORITY_INDICATOR: Record<Priority, string> = {
  low: 'bg-link',
  medium: 'bg-yellow-sticker',
  high: 'bg-primary',
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const PRIORITY_OPTIONS: { value: Priority; label: string; indicator: string }[] = [
  { value: 'low', label: PRIORITY_LABEL.low, indicator: PRIORITY_INDICATOR.low },
  { value: 'medium', label: PRIORITY_LABEL.medium, indicator: PRIORITY_INDICATOR.medium },
  { value: 'high', label: PRIORITY_LABEL.high, indicator: PRIORITY_INDICATOR.high },
];

export function priorityBadgeTextClass(priority: Priority): string {
  return priority === 'high' ? 'text-on-primary' : 'text-ink';
}
