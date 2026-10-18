import type {
  CourseMaterial,
  Subject,
  UserAccount,
  SubjectId,
  Medium,
  ActionLog,
  ActionType,
  DownloadRecord
} from '../types/index.ts';

/**
 * Check if the user has access to view or download a material.
 * Free materials (price <= 0) are accessible to all logged-in students.
 * Instructors have access to all materials.
 * Paid materials require the material ID in user's purchasedMaterialIds.
 */
export function hasAccessToMaterial(user: UserAccount | null, material: CourseMaterial): boolean {
  if (!user) return false;
  if (user.role === 'instructor') return true;
  if (material.price <= 0) return true;
  return user.purchasedMaterialIds.includes(material.id);
}

/**
 * Calculate progress for a subject based on completed materials.
 */
export function calculateSubjectProgress(
  materials: CourseMaterial[],
  completedIds: string[],
  subjectId?: SubjectId,
  medium?: Medium
): { total: number; completed: number; percentage: number } {
  let filtered = materials;
  if (subjectId) {
    filtered = filtered.filter(m => m.subjectId === subjectId);
  }
  if (medium) {
    filtered = filtered.filter(m => m.medium === medium);
  }

  const total = filtered.length;
  if (total === 0) {
    return { total: 0, completed: 0, percentage: 0 };
  }

  const completedSet = new Set(completedIds);
  const completed = filtered.filter(m => completedSet.has(m.id)).length;
  const percentage = Math.round((completed / total) * 100);

  return { total, completed, percentage };
}

/**
 * Filter course materials by multiple criteria
 */
export function filterMaterials(
  materials: CourseMaterial[],
  options: {
    subjectId?: string | 'all';
    medium?: Medium | 'all';
    searchQuery?: string;
    typeFilter?: string | 'all';
    maxPrice?: number;
    onlyPurchased?: boolean;
    user?: UserAccount | null;
  }
): CourseMaterial[] {
  const {
    subjectId = 'all',
    medium = 'all',
    searchQuery = '',
    typeFilter = 'all',
    onlyPurchased = false,
    user = null
  } = options;

  const query = searchQuery.trim().toLowerCase();

  return materials.filter(material => {
    if (subjectId !== 'all' && material.subjectId !== subjectId) {
      return false;
    }
    if (medium !== 'all' && material.medium !== medium) {
      return false;
    }
    if (typeFilter !== 'all' && material.type !== typeFilter) {
      return false;
    }
    if (onlyPurchased) {
      if (!user) return false;
      const isPurchased = user.purchasedMaterialIds.includes(material.id);
      if (!isPurchased && material.price > 0) return false;
    }
    if (query) {
      const matchTitle = material.title.toLowerCase().includes(query);
      const matchTitleSi = material.titleSi ? material.titleSi.toLowerCase().includes(query) : false;
      const matchModule = material.moduleName.toLowerCase().includes(query);
      const matchDesc = material.description.toLowerCase().includes(query);
      const matchInstructor = material.instructorName.toLowerCase().includes(query);
      if (!matchTitle && !matchTitleSi && !matchModule && !matchDesc && !matchInstructor) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Create a new action log entry
 */
export function createActionLog(
  user: UserAccount,
  actionType: ActionType,
  details: string,
  metadata?: Record<string, any>
): ActionLog {
  return {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    actionType,
    details,
    timestamp: new Date().toISOString(),
    ipAddress: '192.168.1.' + Math.floor(Math.random() * 200 + 10),
    metadata
  };
}

/**
 * Handle resource download record creation
 */
export function createDownloadRecord(
  material: CourseMaterial
): DownloadRecord {
  return {
    materialId: material.id,
    downloadedAt: new Date().toISOString(),
    fileName: `${material.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${material.fileFormat.toLowerCase()}`,
    fileSize: material.fileSize,
    subjectId: material.subjectId,
    medium: material.medium
  };
}

/**
 * Format currency in Sri Lankan Rupees (LKR)
 */
export function formatLKR(amount: number): string {
  if (amount <= 0) return 'Free';
  return `LKR ${amount.toLocaleString()}`;
}

/**
 * Generate a realistic text/markdown document payload for real student download
 */
export function generateMaterialFileBlob(material: CourseMaterial, studentName: string): { blob: Blob; fileName: string } {
  const content = `================================================================================
EDUNEXUS LANKA | COURSE MATERIAL RESOURCE
Subject: ${material.subjectId.toUpperCase()} (${material.medium.toUpperCase()} MEDIUM)
Unit: Unit ${material.unitNumber} - ${material.moduleName}
Title: ${material.title} ${material.titleSi ? `(${material.titleSi})` : ''}
Instructor: ${material.instructorName}
Published: ${material.publishedDate}
Licensed to Student: ${studentName}
Downloaded: ${new Date().toLocaleString()}
Format: ${material.fileFormat} | Total Pages: ${material.totalPages}
================================================================================

1. OVERVIEW & LEARNING OBJECTIVES
${material.description}

2. CORE STUDY NOTES & THEORETICAL FRAMEWORK
${material.sampleContent}

3. PRACTICE QUESTIONS & SELF-ASSESSMENT
Question 1: Explain the fundamental governing equations and engineering principles relevant to this unit.
Question 2: In Sri Lankan industry applications, describe standard safety precautions and material choices.
Question 3: Work through the past paper questions (2018-2025) associated with this topic.

--------------------------------------------------------------------------------
(c) EduNexus Lanka. All rights reserved. Registered student copy.
--------------------------------------------------------------------------------
`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const fileName = `${material.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_EduNexus.${material.fileFormat === 'PDF' ? 'txt' : material.fileFormat.toLowerCase()}`;
  return { blob, fileName };
}

/**
 * Update an existing material in the materials array immutably
 */
export function updateMaterialInList(materials: CourseMaterial[], updated: CourseMaterial): CourseMaterial[] {
  return materials.map(m => m.id === updated.id ? updated : m);
}

/**
 * Update an existing subject in the subjects array immutably
 */
export function updateSubjectInList(subjects: Subject[], updated: Subject): Subject[] {
  return subjects.map(s => s.id === updated.id ? updated : s);
}

/**
 * Delete a subject from the subjects array
 */
export function deleteSubjectFromList(subjects: Subject[], subjectId: string): Subject[] {
  return subjects.filter(s => s.id !== subjectId);
}

/**
 * Validate new or edited subject input
 */
export function validateSubjectData(subject: Partial<Subject>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!subject.name || subject.name.trim().length === 0) {
    errors.push('Subject Name in English is required.');
  }
  if (!subject.nameSi || subject.nameSi.trim().length === 0) {
    errors.push('Subject Name in Sinhala is required.');
  }
  if (!subject.code || subject.code.trim().length === 0) {
    errors.push('Subject Code (e.g. ET-41) is required.');
  }
  return { valid: errors.length === 0, errors };
}

