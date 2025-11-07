'use client';

import { useEffect, useState } from 'react';
import CourseCard from '@/components/CourseCard';
import ShareButton from '@/components/ShareButton';
import { Course } from '@/lib/types';
import { getAllCourses } from '@/lib/courseData';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      const allCourses = await getAllCourses();
      setCourses(allCourses);
      setLoading(false);
    }
    loadCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🇯🇵 Japanese Learn
              </h1>
              <p className="text-lg font-medium text-blue-600 mb-1">
                Learn to earn, you deserve a better life
              </p>
              <p className="text-sm text-gray-600">
                Comprehensive Japanese vocabulary for Chinese-speaking students
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <ShareButton
                title="Japanese Learn - Learn to earn, you deserve a better life"
                description="Comprehensive Japanese vocabulary courses for Chinese-speaking students with audio and flashcards"
              />
              <a
                href="https://discord.gg/9KSTNCD6u"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Discord"
              >
                💬 Discord
              </a>
              <a
                href="https://t.me/takadanobabajapanesebeginers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors"
                title="Telegram"
              >
                📱 Telegram
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {courses.length}
            </div>
            <div className="text-gray-600">Courses Available</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {courses.reduce((sum, course) => sum + course.vocabularyList.length, 0)}
            </div>
            <div className="text-gray-600">Total Vocabulary Words</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              🎵
            </div>
            <div className="text-gray-600">Audio & Flashcards</div>
          </div>
        </div>

        {/* Course listing */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Select a Course
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">No courses available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.courseNumber} course={course} />
              ))}
            </div>
          )}
        </div>

        {/* Features section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            What You'll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <span className="text-3xl mr-4">📚</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Progressive Vocabulary
                </h3>
                <p className="text-gray-600 text-sm">
                  11 courses from Hiragana/Katakana basics to intermediate vocabulary with 600+ words
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-3xl mr-4">🎵</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Audio Pronunciation
                </h3>
                <p className="text-gray-600 text-sm">
                  High-quality TTS audio with native Japanese pronunciation for every word
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-3xl mr-4">🎴</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Interactive Flashcards
                </h3>
                <p className="text-gray-600 text-sm">
                  AI-enhanced flashcards with mnemonics and additional examples
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-3xl mr-4">📱</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Mobile Friendly
                </h3>
                <p className="text-gray-600 text-sm">
                  Study anywhere, anytime on your phone, tablet, or computer
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-4">
              Join our learning community:
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a
                href="https://discord.gg/9KSTNCD6u"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Discord
              </a>
              <a
                href="https://t.me/takadanobabajapanesebeginers"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                Telegram
              </a>
              <a
                href="https://line.me/R/ti/g/jcjwLGnaFK"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                LINE
              </a>
              <a
                href="https://x.com/TonyIronTokyo"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                X (Twitter)
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
