import { Course, FlashcardCourse, AudioFile } from './types';

// Get all available courses
export async function getAllCourses(): Promise<Course[]> {
  const courses: Course[] = [];

  // Include course 0 (Kana) and courses 1-10
  for (let i = 0; i <= 10; i++) {
    const courseNumber = i.toString().padStart(2, '0');
    try {
      const response = await fetch(`/data/course-${courseNumber}.json`);
      if (response.ok) {
        const course = await response.json();
        courses.push(course);
      }
    } catch (error) {
      console.error(`Failed to load course ${courseNumber}:`, error);
    }
  }

  return courses;
}

// Get a specific course by number
export async function getCourse(courseNumber: number): Promise<Course | null> {
  const courseId = courseNumber.toString().padStart(2, '0');
  try {
    const response = await fetch(`/data/course-${courseId}.json`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(`Failed to load course ${courseNumber}:`, error);
  }
  return null;
}

// Get flashcard data for a specific course
export async function getFlashcards(courseNumber: number): Promise<FlashcardCourse | null> {
  const courseId = courseNumber.toString().padStart(2, '0');
  try {
    const response = await fetch(`/flashcards/course-${courseId}-flashcards.json`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(`Failed to load flashcards for course ${courseNumber}:`, error);
  }
  return null;
}

// Get audio file paths for a course
export function getAudioFiles(courseNumber: number): AudioFile {
  const courseId = courseNumber.toString().padStart(2, '0');

  // Map of courses to their audio file parts (based on existing files)
  const audioMap: Record<number, string[]> = {
    0: ['g-Course-00.wav'], // Hiragana and Katakana (Kana)
    1: ['g-Course-01.wav'],
    2: ['g-Course-02-part1.wav', 'g-Course-02-part2.wav', 'g-Course-02-part3.wav', 'g-Course-02-part4.wav'],
    3: ['g-Course-03-part1.wav', 'g-Course-03-part2.wav', 'g-Course-03-part3.wav'],
    4: ['g-Course-04-part1.wav', 'g-Course-04-part2.wav', 'g-Course-04-part3.wav'],
    5: ['g-Course-05-part1.wav', 'g-Course-05-part2.wav', 'g-Course-05-part3.wav'],
    6: ['g-Course-06-part1.wav', 'g-Course-06-part2.wav', 'g-Course-06-part3.wav'],
    7: ['g-Course-07-part1.wav', 'g-Course-07-part2.wav', 'g-Course-07-part3.wav'],
    8: ['g-Course-08-part1.wav', 'g-Course-08-part2.wav', 'g-Course-08-part3.wav'],
    9: ['g-Course-09-part1.wav', 'g-Course-09-part2.wav', 'g-Course-09-part3.wav'],
    10: ['g-Course-10-part1.wav', 'g-Course-10-part2.wav', 'g-Course-10-part3.wav', 'g-Course-10-part4.wav'],
  };

  const parts = audioMap[courseNumber] || [];

  return {
    courseNumber,
    parts: parts.map(file => `/audio/${file}`)
  };
}

// Get course descriptions
export function getCourseDescription(courseNumber: number): string {
  const descriptions: Record<number, string> = {
    0: 'Hiragana and Katakana - The ABCs of Japanese',
    1: 'Personal pronouns and nationalities',
    2: 'Common objects and demonstratives',
    3: 'Places and locations',
    4: 'Home and family',
    5: 'Time expressions and activities',
    6: 'Transportation and dates',
    7: 'Food and daily activities',
    8: 'Giving/receiving and communication',
    9: 'Food preferences and adjectives',
    10: 'Seasons, weather, and descriptions',
  };

  return descriptions[courseNumber] || 'Japanese vocabulary';
}

// Calculate which vocabulary item should be highlighted based on audio playback
export function calculateCurrentVocabularyIndex(
  courseNumber: number,
  currentTrack: number,
  currentTime: number,
  totalVocabularyItems: number,
  audioPartsCount: number
): number {
  if (audioPartsCount === 0 || totalVocabularyItems === 0) return -1;

  // Estimate items per audio part
  const itemsPerPart = Math.ceil(totalVocabularyItems / audioPartsCount);

  // Estimate time per item (assuming average 10 seconds per vocabulary item)
  const estimatedTimePerItem = 10;

  // Calculate base index from current track
  const baseIndex = currentTrack * itemsPerPart;

  // Calculate offset within current track based on time
  const itemOffset = Math.floor(currentTime / estimatedTimePerItem);

  // Calculate final index
  const vocabularyIndex = baseIndex + itemOffset;

  // Ensure index is within bounds
  return Math.min(vocabularyIndex, totalVocabularyItems - 1);
}

// Calculate which track and time position corresponds to a vocabulary item index
export function calculateAudioPositionFromVocabIndex(
  vocabularyIndex: number,
  totalVocabularyItems: number,
  audioPartsCount: number
): { track: number; time: number } {
  if (audioPartsCount === 0 || totalVocabularyItems === 0) {
    return { track: 0, time: 0 };
  }

  // Estimate items per audio part
  const itemsPerPart = Math.ceil(totalVocabularyItems / audioPartsCount);

  // Estimate time per item (assuming average 10 seconds per vocabulary item)
  const estimatedTimePerItem = 10;

  // Calculate which track this vocabulary index belongs to
  const track = Math.floor(vocabularyIndex / itemsPerPart);

  // Calculate the offset within that track
  const itemOffsetInTrack = vocabularyIndex % itemsPerPart;

  // Calculate the time position within the track
  const time = itemOffsetInTrack * estimatedTimePerItem;

  return {
    track: Math.min(track, audioPartsCount - 1),
    time: Math.max(0, time)
  };
}
