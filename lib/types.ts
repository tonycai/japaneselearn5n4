// Course vocabulary item from the JSON data
export interface VocabularyItem {
  id: number;
  japanese: string;
  romaji: string;
  translation: string;
  explanation?: string;
  exampleSentence: string;
}

// Course data structure
export interface Course {
  courseTitle: string;
  courseNumber: number;
  targetAudience: string;
  vocabularyList: VocabularyItem[];
}

// Enhanced flashcard with AI-generated content
export interface FlashcardItem extends VocabularyItem {
  mnemonic: string;
  additionalExamples: string[];
}

// Flashcard course data
export interface FlashcardCourse {
  courseTitle: string;
  courseNumber: number;
  targetAudience: string;
  vocabularyList: FlashcardItem[];
}

// Audio file mapping
export interface AudioFile {
  courseNumber: number;
  parts: string[]; // Array of file paths (e.g., ["g-Course-01.wav"] or ["g-Course-02-part1.wav", "g-Course-02-part2.wav"])
}
