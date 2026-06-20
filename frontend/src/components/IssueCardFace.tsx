import type { CardData } from '@/lib/types';
import { PRIORITY_LABEL } from '@/lib/indicators';

interface IssueCardFaceProps {
  card: CardData;
}

export default function IssueCardFace({ card }: IssueCardFaceProps) {
  const isDone = card.column_title.toLowerCase().includes('done');
  const description = card.description.trim();

  return (
    <article className="cursor-pointer border border-frame-ink bg-canvas text-ink transition-colors group-hover:border-yellow-sticker group-focus:border-yellow-sticker">
      <div className="ribbon-card-title flex items-center gap-2 border-frame-ink bg-frame-ink py-1.5 text-on-primary">
        <span className="type-caption text-on-primary">
          {new Date(card.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          })}
        </span>
        {card.priority && (
          <span className={`type-caption ml-auto border border-frame-ink px-1.5 py-0.5 font-bold ${card.priority === 'high' ? 'bg-primary text-on-primary' : 'bg-yellow-sticker text-ink'}`}>
            {PRIORITY_LABEL[card.priority]}
          </span>
        )}
      </div>
      <div
        className={`ribbon-card-body ${isDone ? 'opacity-80' : ''}`}
        style={{ backgroundColor: card.color || undefined }}
      >
        <h3 className="type-heading-3 mb-3 line-clamp-2 text-ink">{card.title}</h3>
        {description && (
          <p className="type-body-sm line-clamp-2 text-ink">
            {description}
          </p>
        )}
        {card.updated_at && (
          <p className="type-caption mt-3 border-t border-frame-ink pt-2 text-ink">
            Updated {new Date(card.updated_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
            })}
          </p>
        )}
      </div>
    </article>
  );
}
