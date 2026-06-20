'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}

export default function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`ex-toast type-body-sm fixed bottom-6 left-1/2 z-50 -translate-x-1/2 ${
        type === 'error' ? 'border-primary bg-tint-salmon' : ''
      }`}
      role="status"
    >
      {message}
    </div>
  );
}
