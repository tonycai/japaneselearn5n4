import { VocabularyItem as VocabType } from '@/lib/types';
import { forwardRef } from 'react';

interface VocabularyItemProps {
  item: VocabType;
  showDetails?: boolean;
  isHighlighted?: boolean;
  onClick?: () => void;
}

const VocabularyItem = forwardRef<HTMLDivElement, VocabularyItemProps>(
  ({ item, showDetails = true, isHighlighted = false, onClick }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`rounded-lg shadow-md p-5 border-l-4 transition-all duration-300 ${
          isHighlighted
            ? 'bg-yellow-100 border-yellow-500 shadow-xl scale-105 ring-4 ring-yellow-300'
            : 'bg-white border-blue-500 hover:shadow-lg hover:scale-[1.02]'
        } ${onClick ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className={`text-3xl font-bold mb-2 ${
              isHighlighted ? 'text-yellow-900' : 'text-gray-800'
            }`}>
              {item.japanese}
            </h3>
            <p className={`text-sm mb-1 ${
              isHighlighted ? 'text-yellow-700' : 'text-gray-500'
            }`}>{item.romaji}</p>
          </div>
          <div className="ml-4 text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              isHighlighted
                ? 'bg-yellow-500 text-yellow-900'
                : 'bg-red-100 text-red-800'
            }`}>
              {item.translation}
            </span>
          </div>
        </div>

        {showDetails && (
          <>
            {item.explanation && (
              <div className={`mb-3 p-3 rounded-md ${
                isHighlighted ? 'bg-yellow-200' : 'bg-blue-50'
              }`}>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">说明：</span>
                  {item.explanation}
                </p>
              </div>
            )}

            <div className={`mb-2 p-3 rounded-md border-l-2 ${
              isHighlighted
                ? 'bg-yellow-200 border-yellow-600'
                : 'bg-green-50 border-green-400'
            }`}>
              <p className={`text-sm font-semibold mb-1 ${
                isHighlighted ? 'text-yellow-900' : 'text-gray-600'
              }`}>例句：</p>
              <p className={`text-lg ${
                isHighlighted ? 'text-yellow-900' : 'text-gray-800'
              }`}>{item.exampleSentence}</p>
            </div>
          </>
        )}
      </div>
    );
  }
);

VocabularyItem.displayName = 'VocabularyItem';

export default VocabularyItem;
