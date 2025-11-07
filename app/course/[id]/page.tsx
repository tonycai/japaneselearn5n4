'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AudioPlayer from '@/components/AudioPlayer';
import VocabularyItem from '@/components/VocabularyItem';
import FlashcardViewer from '@/components/FlashcardViewer';
import ShareButton from '@/components/ShareButton';
import VocabularyProgressBar from '@/components/VocabularyProgressBar';
import { Course, FlashcardCourse } from '@/lib/types';
import { getCourse, getFlashcards, getAudioFiles, getCourseDescription } from '@/lib/courseData';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();

  // Safely parse course ID
  const courseId = useMemo(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const parsed = parseInt(id || '0', 10);
    return isNaN(parsed) ? 0 : parsed;
  }, [params.id]);

  const [course, setCourse] = useState<Course | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'flashcards'>('vocabulary');
  const [currentVocabIndex, setCurrentVocabIndex] = useState<number>(-1);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [manualMode, setManualMode] = useState(false);

  // Refs for vocabulary items
  const vocabularyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const manualModeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize audioFiles and description to prevent recreation on every render
  const audioFiles = useMemo(() => {
    if (courseId < 0 || courseId > 10) return { courseNumber: 0, parts: [] };
    return getAudioFiles(courseId);
  }, [courseId]);

  const description = useMemo(() => {
    if (courseId < 0 || courseId > 10) return '';
    return getCourseDescription(courseId);
  }, [courseId]);

  // Helper to enable manual mode temporarily (auto-resumes after 3 seconds when audio plays)
  const enableManualModeTemporarily = useCallback(() => {
    // Clear any existing timer
    if (manualModeTimerRef.current) {
      clearTimeout(manualModeTimerRef.current);
    }

    setManualMode(true);

    // Auto-resume to auto mode after 3 seconds if audio is playing
    manualModeTimerRef.current = setTimeout(() => {
      setManualMode(false);
      manualModeTimerRef.current = null;
    }, 3000);
  }, []);

  // Handle audio playback updates - MUST be before early returns to follow Rules of Hooks
  const handlePlaybackUpdate = useCallback(
    (currentTrack: number, currentTime: number, duration: number, isPlaying: boolean) => {
      setIsAudioPlaying(isPlaying);
    },
    []
  );

  // Handle manual vocabulary item click - only scroll and highlight, don't affect audio
  const handleVocabularyClick = useCallback(
    (index: number) => {
      if (!course) return;

      // Enter manual mode temporarily and highlight clicked word
      enableManualModeTemporarily();
      setCurrentVocabIndex(index);

      // Scroll to the clicked item
      const element = vocabularyRefs.current[index];
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    },
    [course, enableManualModeTemporarily]
  );

  // Navigate to previous word
  const handlePreviousWord = useCallback(() => {
    if (!course || currentVocabIndex <= 0) return;

    const newIndex = currentVocabIndex - 1;
    enableManualModeTemporarily();
    setCurrentVocabIndex(newIndex);

    const element = vocabularyRefs.current[newIndex];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [course, currentVocabIndex, enableManualModeTemporarily]);

  // Navigate to next word
  const handleNextWord = useCallback(() => {
    if (!course || currentVocabIndex >= course.vocabularyList.length - 1) return;

    const newIndex = currentVocabIndex + 1;
    enableManualModeTemporarily();
    setCurrentVocabIndex(newIndex);

    const element = vocabularyRefs.current[newIndex];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [course, currentVocabIndex, enableManualModeTemporarily]);

  // Toggle between manual and auto mode
  const toggleManualMode = useCallback(() => {
    // Clear any pending auto-resume timer
    if (manualModeTimerRef.current) {
      clearTimeout(manualModeTimerRef.current);
      manualModeTimerRef.current = null;
    }
    setManualMode(prev => !prev);
  }, []);

  useEffect(() => {
    async function loadCourseData() {
      if (isNaN(courseId) || courseId < 0 || courseId > 10) {
        router.push('/');
        return;
      }

      const [courseData, flashcardData] = await Promise.all([
        getCourse(courseId),
        getFlashcards(courseId),
      ]);

      setCourse(courseData);
      setFlashcards(flashcardData);
      setLoading(false);
    }

    loadCourseData();
  }, [courseId, router]);

  // Auto-scroll timer - advance to next word every 10 seconds (or 2.3 seconds for kana course) when in auto mode
  useEffect(() => {
    // Clear any existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    // Only start interval if audio is playing, in vocabulary tab, not in manual mode, and have a course
    if (isAudioPlaying && activeTab === 'vocabulary' && !manualMode && course) {
      // Start from first word if not set
      if (currentVocabIndex === -1) {
        setCurrentVocabIndex(0);
        const element = vocabularyRefs.current[0];
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }

      // Special timing for kana course: 2.3 seconds per character
      // Regular courses: 10 seconds per word
      const intervalTime = courseId === 0 ? 2300 : 10000;

      // Set interval to advance
      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentVocabIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;

          // Stop if we've reached the last word
          if (nextIndex >= course.vocabularyList.length) {
            if (autoScrollIntervalRef.current) {
              clearInterval(autoScrollIntervalRef.current);
              autoScrollIntervalRef.current = null;
            }
            return prevIndex;
          }

          // Scroll to the next vocabulary item
          const element = vocabularyRefs.current[nextIndex];
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }

          return nextIndex;
        });
      }, intervalTime);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [isAudioPlaying, activeTab, manualMode, course, currentVocabIndex, courseId]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (manualModeTimerRef.current) {
        clearTimeout(manualModeTimerRef.current);
      }
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Course not found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Home
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {/* Auto/Manual Mode button hidden */}
              {/* <button
                onClick={toggleManualMode}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  manualMode
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {manualMode ? '🎯 Manual Mode' : '🤖 Auto Mode'}
              </button> */}
              <ShareButton
                title={`${course.courseTitle} - Japanese Learning Course`}
                description={`Learn ${course.vocabularyList.length} Japanese vocabulary words in Course ${courseId}`}
              />
              <div className="text-right">
                <h1 className="text-2xl font-bold text-gray-900">
                  Course {courseId}
                </h1>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Audio player - positioned below header */}
      {audioFiles.parts.length > 0 && (
        <div className="sticky top-[72px] z-[5] bg-gradient-to-br from-blue-50 via-white to-purple-50 py-4 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AudioPlayer
              audioFiles={audioFiles.parts}
              title={`Course ${courseId} Audio`}
              onPlaybackUpdate={handlePlaybackUpdate}
            />
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Course info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {course.courseTitle}
              </h2>
              <p className="text-gray-600">
                {course.vocabularyList.length} vocabulary words
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                Course {courseId}
              </div>
              {audioFiles.parts.length > 0 && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                  🎵 {audioFiles.parts.length} Audio {audioFiles.parts.length === 1 ? 'File' : 'Parts'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('vocabulary')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'vocabulary'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📚 Vocabulary List
              </button>
              {flashcards && (
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'flashcards'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🎴 Flashcards
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'vocabulary' ? (
          <div className="space-y-4">
            {course.vocabularyList.map((item, index) => (
              <VocabularyItem
                key={item.id}
                ref={(el) => {
                  vocabularyRefs.current[index] = el;
                }}
                item={item}
                showDetails={true}
                isHighlighted={currentVocabIndex === index}
                onClick={() => handleVocabularyClick(index)}
              />
            ))}
          </div>
        ) : flashcards ? (
          <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Interactive Flashcards
            </h2>
            <FlashcardViewer flashcards={flashcards.vocabularyList} courseNumber={courseId} />
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">Flashcards not available for this course</p>
          </div>
        )}
      </main>

      {/* Footer - Fixed to bottom */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-20">
        {/* Progress bar at top of footer */}
        {activeTab === 'vocabulary' && (
          <VocabularyProgressBar
            currentIndex={currentVocabIndex}
            totalWords={course?.vocabularyList.length || 0}
          />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Previous Course Button */}
            <Link
              href={`/course/${courseId - 1}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                courseId <= 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
              <span className="hidden sm:inline">Previous Course</span>
              <span className="sm:hidden">Prev</span>
            </Link>

            {/* Back to all courses link */}
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors text-center">
              ← Back to all courses
            </Link>

            {/* Next Course Button */}
            <Link
              href={`/course/${courseId + 1}`}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                courseId >= 10
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <span className="hidden sm:inline">Next Course</span>
              <span className="sm:hidden">Next</span>
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
