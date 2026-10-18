import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hasAccessToMaterial,
  calculateSubjectProgress,
  filterMaterials,
  createActionLog,
  formatLKR,
  updateMaterialInList,
  updateSubjectInList,
  deleteSubjectFromList,
  validateSubjectData
} from './courseLogic.ts';
import type { CourseMaterial, UserAccount } from '../types/index.ts';

const mockMaterialFree: CourseMaterial = {
  id: 'mat-1',
  subjectId: 'engineering-tech',
  medium: 'sinhala',
  title: 'යාන්ත්‍ර විද්‍යාව මූලධර්ම',
  description: 'Mechanics fundamentals note',
  moduleName: 'Mechanical Technology',
  unitNumber: 1,
  type: 'lecture_note',
  price: 0,
  currency: 'LKR',
  fileFormat: 'PDF',
  fileSize: '3.4 MB',
  downloadCount: 120,
  totalPages: 38,
  sampleContent: 'Engineering concepts test',
  publishedDate: '2026-01-10',
  instructorName: 'Eng. K. Perera'
};

const mockMaterialPaid: CourseMaterial = {
  id: 'mat-2',
  subjectId: 'engineering-tech',
  medium: 'english',
  title: 'Electrical & Electronic Tech Advanced Note',
  description: 'Detailed circuits and semiconductor analysis',
  moduleName: 'Electrical Technology',
  unitNumber: 2,
  type: 'lecture_note',
  price: 750,
  currency: 'LKR',
  fileFormat: 'PDF',
  fileSize: '5.1 MB',
  downloadCount: 85,
  totalPages: 45,
  sampleContent: 'Semiconductor diode and transistor theory',
  publishedDate: '2026-02-15',
  instructorName: 'Dr. N. Fernando'
};

const mockStudent: UserAccount = {
  id: 'stu-1',
  name: 'Kasun Wickramasinghe',
  email: 'kasun@example.com',
  role: 'student',
  enrolledSubjects: ['engineering-tech', 'science-for-tech'],
  purchasedMaterialIds: ['mat-2'],
  downloadHistory: [],
  completedMaterialIds: ['mat-1'],
  walletBalance: 1500,
  createdAt: '2026-01-01'
};

const mockInstructor: UserAccount = {
  id: 'inst-1',
  name: 'Eng. K. Perera',
  email: 'perera@example.com',
  role: 'instructor',
  enrolledSubjects: [],
  purchasedMaterialIds: [],
  downloadHistory: [],
  completedMaterialIds: [],
  walletBalance: 0,
  createdAt: '2025-01-01'
};

test('hasAccessToMaterial allows free material to any logged-in student', () => {
  assert.equal(hasAccessToMaterial(mockStudent, mockMaterialFree), true);
});

test('hasAccessToMaterial blocks unpurchased paid material for student', () => {
  const unpurchased: CourseMaterial = { ...mockMaterialPaid, id: 'mat-unpurchased' };
  assert.equal(hasAccessToMaterial(mockStudent, unpurchased), false);
});

test('hasAccessToMaterial allows purchased paid material for student', () => {
  assert.equal(hasAccessToMaterial(mockStudent, mockMaterialPaid), true);
});

test('hasAccessToMaterial gives instructor master access to all materials', () => {
  const unpurchased: CourseMaterial = { ...mockMaterialPaid, id: 'mat-unpurchased' };
  assert.equal(hasAccessToMaterial(mockInstructor, unpurchased), true);
});

test('calculateSubjectProgress returns accurate counts and percentage', () => {
  const materials = [mockMaterialFree, mockMaterialPaid];
  const progress = calculateSubjectProgress(materials, ['mat-1']);
  assert.equal(progress.total, 2);
  assert.equal(progress.completed, 1);
  assert.equal(progress.percentage, 50);
});

test('calculateSubjectProgress filters by medium', () => {
  const materials = [mockMaterialFree, mockMaterialPaid];
  const sinhalaProg = calculateSubjectProgress(materials, ['mat-1'], undefined, 'sinhala');
  assert.equal(sinhalaProg.total, 1);
  assert.equal(sinhalaProg.completed, 1);
  assert.equal(sinhalaProg.percentage, 100);

  const englishProg = calculateSubjectProgress(materials, [], undefined, 'english');
  assert.equal(englishProg.total, 1);
  assert.equal(englishProg.completed, 0);
  assert.equal(englishProg.percentage, 0);
});

test('filterMaterials filters accurately by medium and search query', () => {
  const materials = [mockMaterialFree, mockMaterialPaid];
  
  const sinhalaOnly = filterMaterials(materials, { medium: 'sinhala' });
  assert.equal(sinhalaOnly.length, 1);
  assert.equal(sinhalaOnly[0].id, 'mat-1');

  const englishOnly = filterMaterials(materials, { medium: 'english' });
  assert.equal(englishOnly.length, 1);
  assert.equal(englishOnly[0].id, 'mat-2');

  const searched = filterMaterials(materials, { searchQuery: 'circuits' });
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 'mat-2');
});

test('formatLKR handles 0 and positive numbers cleanly', () => {
  assert.equal(formatLKR(0), 'Free');
  assert.equal(formatLKR(750), 'LKR 750');
});

test('createActionLog outputs required audit trail attributes', () => {
  const log = createActionLog(mockStudent, 'DOWNLOAD_RESOURCE', 'Downloaded Mechanics note');
  assert.equal(log.userId, 'stu-1');
  assert.equal(log.actionType, 'DOWNLOAD_RESOURCE');
  assert.ok(log.timestamp);
});

test('updateMaterialInList replaces the matching material immutably', () => {
  const list = [mockMaterialFree, mockMaterialPaid];
  const updated = { ...mockMaterialFree, title: 'Updated Mechanics Note', price: 500 };
  const result = updateMaterialInList(list, updated);
  assert.equal(result.length, 2);
  assert.equal(result[0].title, 'Updated Mechanics Note');
  assert.equal(result[0].price, 500);
  assert.equal(list[0].title, 'යාන්ත්‍ර විද්‍යාව මූලධර්ම'); // Original unchanged
});

test('updateSubjectInList and deleteSubjectFromList update subjects collection correctly', () => {
  const subjects = [
    {
      id: 'engineering-tech',
      name: 'Engineering Tech',
      nameSi: 'ඉංජිනේරු',
      code: 'ET-41',
      description: 'Desc',
      descriptionSi: 'විස්තරය',
      badgeColor: 'border-blue-200',
      topics: []
    }
  ];

  const updatedSub = { ...subjects[0], name: 'Engineering Technology Advanced' };
  const updatedList = updateSubjectInList(subjects, updatedSub);
  assert.equal(updatedList[0].name, 'Engineering Technology Advanced');

  const emptyList = deleteSubjectFromList(updatedList, 'engineering-tech');
  assert.equal(emptyList.length, 0);
});

test('validateSubjectData detects missing required fields', () => {
  const invalid = validateSubjectData({ name: '', code: '' });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.length >= 2);

  const valid = validateSubjectData({ name: 'Robotics', nameSi: 'රොබෝ තාක්ෂණය', code: 'ROB-01' });
  assert.equal(valid.valid, true);
  assert.equal(valid.errors.length, 0);
});

