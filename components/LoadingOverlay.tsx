'use client';

import { IconLoader2 } from '@tabler/icons-react';

const LoadingOverlay = () => {
  return (
    <div className="loading-wrapper">
      <div className="loading-shadow-wrapper bg-white">
        <div className="loading-shadow">
          <IconLoader2 className="loading-animation w-12 h-12 text-[#663820]" />
          <h2 className="loading-title font-serif">Uploading Your Book…</h2>
          <div className="loading-progress">
            <div className="loading-progress-item">
              <span className="loading-progress-status" />
              <span className="text-[var(--text-secondary)]">
                Processing your file
              </span>
            </div>
            <div className="loading-progress-item">
              <span className="loading-progress-status" />
              <span className="text-[var(--text-secondary)]">
                This may take a moment
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
