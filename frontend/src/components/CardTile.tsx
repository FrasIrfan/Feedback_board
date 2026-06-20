'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CardData } from '@/lib/types';
import IssueCardFace from './IssueCardFace';

interface CardTileProps {
  card: CardData;
  onClick: (card: CardData) => void;
}

export default function CardTile({ card, onClick }: CardTileProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `card-${card.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => { if (!isDragging) onClick(card); }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isDragging) {
          e.preventDefault();
          onClick(card);
        }
      }}
      className="group mb-3 focus:outline-none last:mb-0"
    >
      <IssueCardFace card={card} />
    </div>
  );
}
