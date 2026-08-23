export interface Mp4Recording {
  quality: string;
  url: string;
  size?: number;
}

export interface ClassPdf {
  name: string;
  url: string;
  type?: 'pdf' | 'dpp' | 'notes' | 'short-notes' | 'solution' | 'cheat-sheet';
  size?: string;
}

export interface ClassItem {
  _id?: string;
  id?: string;
  title: string;
  teacherName?: string;
  startDate?: string;
  endDate?: string;
  isLive?: boolean;
  streamStatus?: 'live' | 'ended' | 'upcoming' | string;
  class_link?: string;
  mp4Recordings?: Mp4Recording[];
  classPdf?: ClassPdf[];
  dpp?: ClassPdf[];
  shortNotes?: ClassPdf[];
  classNotes?: ClassPdf[];
}

export interface ClassTopic {
  topicName: string;
  classes: ClassItem[];
}

export interface PdfItem {
  id?: string;
  title: string;
  teacherName?: string;
  uploadPdf: string;
  date?: string;
}

export interface PdfTopic {
  topicName: string;
  pdfs: PdfItem[];
}

export interface FacultyDetails {
  name: string;
  imageUrl?: string;
  designation?: string;
  experience?: string;
  reach?: string;
  bio?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TimeTableItem {
  topic: string;
  time: string;
}

export interface BatchCourse {
  id: string;
  title: string;
  short_description?: string;
  description?: string[];
  courseHighlights?: string[];
  price?: number;
  discountPrice?: number;
  banner?: string;
  bannerSquare?: string;
  thumbnail?: string;
  isLive?: boolean;
  isRecorded?: boolean;
  status?: 'active' | 'inactive' | string;
  validity?: string;
  priority?: number;
  facultyDetails?: FacultyDetails;
  faqs?: FaqItem[];
  timeTable?: TimeTableItem[];
  category?: 'all' | 'ssc' | 'railway' | 'maths' | 'english' | 'reasoning' | 'gs' | 'defence' | 'state';
}

export type ThemeMode = 'dark' | 'light' | 'cosmic-dark' | 'cyber-light';
export type ActiveTab = 'overview' | 'videos' | 'notes' | 'timetable' | 'handwritten-notes';

export interface StudentStickyNote {
  id: string;
  batchId?: string;
  title: string;
  content: string;
  color: 'yellow' | 'cyan' | 'pink' | 'green' | 'slate';
  inkColor?: 'red' | 'blue' | 'black' | 'green';
  createdAt: string;
  tag?: string;
}
