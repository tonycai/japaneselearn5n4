'use client';

import { useMemo } from 'react';

interface VocabularyProgressBarProps {
  currentIndex: number;
  totalWords: number;
  className?: string;
}

export default function VocabularyProgressBar({
  currentIndex,
  totalWords,
  className = '',
}: VocabularyProgressBarProps) {
  // Calculate progress percentage
  const progress = useMemo(() => {
    if (totalWords === 0) return 0;
    // If currentIndex is -1 (not started), show 0%
    if (currentIndex < 0) return 0;
    // Calculate percentage: (current + 1) / total * 100
    return ((currentIndex + 1) / totalWords) * 100;
  }, [currentIndex, totalWords]);

  return (
    <div className={`w-full ${className}`}>
      {/* Compact progress bar - no text, minimal height */}
      <div className="w-full bg-gray-200 h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Animated shine effect */}
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
}
