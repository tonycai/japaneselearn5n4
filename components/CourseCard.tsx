import Link from 'next/link';
import { Course } from '@/lib/types';
import { getCourseDescription } from '@/lib/courseData';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const description = getCourseDescription(course.courseNumber);

  return (
    <Link
      href={`/course/${course.courseNumber}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-2 border-gray-100 hover:border-blue-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Course {course.courseNumber === 0 ? 'あ' : course.courseNumber}
          </h2>
          <p className="text-gray-600 text-sm mb-3">{description}</p>
        </div>
        <div className="ml-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
          {course.vocabularyList.length} words
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📚</span>
          <span className="text-gray-500 text-sm">Japanese Vocabulary</span>
        </div>
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  );
}
