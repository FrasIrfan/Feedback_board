'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Status } from '@/lib/types';
import { STATUS_OPTIONS, STATUS_INDICATOR, STATUS_LABEL } from '@/lib/indicators';

const MENU_ITEM_HEIGHT = 36;
const MENU_GAP = 4;

interface StatusDropdownProps {
  issueId: number;
  instanceId?: string;
  value: Status;
  onChange: (status: Status) => void;
  disabled?: boolean;
  usePortal?: boolean;
  menuPlacement?: 'top' | 'bottom';
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
}

export default function StatusDropdown({
  issueId,
  instanceId = 'card',
  value,
  onChange,
  disabled,
  usePortal = false,
  menuPlacement = 'bottom',
}: StatusDropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const fieldId = `${instanceId}-status-${issueId}`;

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = STATUS_OPTIONS.length * MENU_ITEM_HEIGHT;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = menuPlacement === 'top' || spaceBelow < menuHeight + MENU_GAP;

    setMenuPosition({
      top: openUpward ? rect.top - menuHeight - MENU_GAP : rect.bottom + MENU_GAP,
      left: rect.left,
      width: rect.width,
    });
  }, [menuPlacement]);

  useEffect(() => {
    if (!open) return;

    if (usePortal) {
      updateMenuPosition();
      window.addEventListener('resize', updateMenuPosition);
      window.addEventListener('scroll', updateMenuPosition, true);
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape, true);
      if (usePortal) {
        window.removeEventListener('resize', updateMenuPosition);
        window.removeEventListener('scroll', updateMenuPosition, true);
      }
    };
  }, [open, usePortal, updateMenuPosition]);

  const handleSelect = (status: Status) => {
    onChange(status);
    setOpen(false);
  };

  const indicator = STATUS_INDICATOR[value];
  const label = STATUS_LABEL[value];

  const menuList = (
    <ul
      ref={menuRef}
      id={`${fieldId}-list`}
      role="listbox"
      aria-labelledby={`${fieldId}-label`}
      className={
        usePortal
          ? 'fixed z-[100] border border-frame-ink bg-canvas'
          : 'absolute right-0 z-[60] mt-1 min-w-full border border-frame-ink bg-canvas'
      }
      style={
        usePortal && menuPosition
          ? {
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }
          : undefined
      }
    >
      {STATUS_OPTIONS.map(({ value: optionValue, label: optionLabel, indicator: optionIndicator }) => (
        <li key={optionValue} role="presentation">
          <button
            type="button"
            role="option"
            aria-selected={value === optionValue}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(optionValue);
            }}
            className={`flex w-full items-center gap-1.5 px-2 py-1.5 text-left ${
              value === optionValue ? 'bg-tint-steel' : 'bg-canvas'
            }`}
          >
            <span className={`indicator-dot ${optionIndicator}`} aria-hidden="true" />
            <span className="type-ui-label text-[11px]">{optionLabel}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <span className="type-ui-label mb-1 block" id={`${fieldId}-label`}>
        Status
      </span>
      <button
        ref={triggerRef}
        type="button"
        id={`${fieldId}-trigger`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${fieldId}-list`}
        aria-labelledby={`${fieldId}-label ${fieldId}-trigger`}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="flex items-center gap-1.5 border border-frame-ink bg-canvas px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={`indicator-dot ${indicator}`} aria-hidden="true" />
        <span className="type-ui-label text-[11px]">{label}</span>
        <span className="type-ui-label text-[11px]" aria-hidden="true">
          {open ? '▴' : '▾'}
        </span>
      </button>

      {open && (usePortal ? createPortal(menuList, document.body) : menuList)}
    </div>
  );
}
