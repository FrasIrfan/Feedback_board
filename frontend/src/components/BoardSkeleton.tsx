export default function BoardSkeleton() {
  return (
    <div className="page-frame">
      <div className="page-canvas">
        <header className="top-banner">
          <div className="h-6 w-56 animate-pulse bg-canvas" />
          <div className="mt-2 h-4 w-40 animate-pulse bg-tint-steel" />
        </header>
        <div className="board-workspace flex gap-4 overflow-x-auto">
          {[1, 2, 3, 4].map((col) => (
            <div key={col} className="flex w-80 shrink-0 flex-col border border-frame-ink bg-frame-ink">
              <div className="h-11 w-full border-b border-frame-ink bg-tint-periwinkle" />
              <div className="flex-1 bg-tint-steel/20 p-4">
                {[1, 2, 3].map((card) => (
                  <div key={card} className="mb-3 animate-pulse">
                    <div className="hairline-border h-8 w-full bg-canvas" />
                    <div className="hairline-border border-t-0 bg-tint-sky p-3">
                      <div className="mb-2 h-3 w-3/4 bg-tint-periwinkle" />
                      <div className="h-3 w-1/2 bg-tint-periwinkle" />
                    </div>
                  </div>
                ))}
                <div className="mt-3 h-7 w-full animate-pulse bg-yellow-sticker" />
              </div>
            </div>
          ))}
        </div>
        <footer className="footer-band type-body-sm text-center">
          Loading board...
        </footer>
      </div>
    </div>
  );
}
