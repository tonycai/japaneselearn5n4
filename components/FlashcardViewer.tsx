'use client';

import { useState, useEffect } from 'react';
import { FlashcardItem } from '@/lib/types';
import Image from 'next/image';

interface FlashcardViewerProps {
  flashcards: FlashcardItem[];
  courseNumber: number;
}

export default function FlashcardViewer({ flashcards, courseNumber }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);

  const currentCard = flashcards[currentIndex];

  // Generate image paths
  const courseId = courseNumber.toString().padStart(2, '0');
  const cardId = (currentIndex + 1).toString().padStart(3, '0');
  const frontImagePath = `/flashcard-images/course-${courseId}-flashcards/${cardId}_front.png`;
  const backImagePath = `/flashcard-images/course-${courseId}-flashcards/${cardId}_back.png`;

  // Reset flip state and image error when changing cards
  useEffect(() => {
    setImageError(false);
  }, [currentIndex]);

  // Preload adjacent card images for smooth transitions
  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = (currentIndex + 1) % flashcards.length;
      const prevIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;

      [nextIndex, prevIndex].forEach((index) => {
        const cardId = (index + 1).toString().padStart(3, '0');
        const frontPath = `/flashcard-images/course-${courseId}-flashcards/${cardId}_front.png`;
        const backPath = `/flashcard-images/course-${courseId}-flashcards/${cardId}_back.png`;

        // Preload front and back images
        const frontImg = new window.Image();
        frontImg.src = frontPath;
        const backImg = new window.Image();
        backImg.src = backPath;
      });
    };

    preloadImages();
  }, [currentIndex, courseId, flashcards.length]);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (flashcards.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-100 rounded-lg">
        <p className="text-gray-600">No flashcards available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4 text-center text-gray-600">
        Card {currentIndex + 1} of {flashcards.length}
      </div>

      {imageError ? (
        // Fallback to text-based display if images fail to load
        <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-800 mb-4">Images not available for this card</p>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-3xl font-bold mb-2">{currentCard.japanese}</h2>
            <p className="text-xl text-gray-600 mb-4">{currentCard.romaji}</p>
            <p className="text-2xl text-blue-600">{currentCard.translation}</p>
          </div>
        </div>
      ) : (
        <div
          className="relative cursor-pointer"
          onClick={handleFlip}
          style={{ width: '100%', maxWidth: '800px', aspectRatio: '1/1', maxHeight: '800px', margin: '0 auto' }}
        >
          {/* Simple toggle between front and back - no flip animation */}
          <div className="relative w-full h-full rounded-xl shadow-2xl overflow-hidden bg-white">
            <Image
              src={isFlipped ? backImagePath : frontImagePath}
              alt={`Flashcard ${currentIndex + 1} - ${isFlipped ? 'Back' : 'Front'}`}
              fill
              className="object-contain"
              onError={() => setImageError(true)}
              priority
              key={`${currentIndex}-${isFlipped ? 'back' : 'front'}`}
            />
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {isFlipped ? 'Click to see front' : 'Click to see back'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={handlePrevious}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          Previous
        </button>

        <button
          onClick={handleFlip}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Flip Card
        </button>

        <button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center"
        >
          Next
          <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
