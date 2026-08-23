import { BatchCourse, ClassTopic, PdfTopic } from '../types';
import { INITIAL_BATCHES, generateSampleClassesForBatch, generateSamplePdfsForBatch } from '../data/mockBatches';

const API_TIMEOUT = 6000;

async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), API_TIMEOUT);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

function normalizeCategory(rawCat: any, fallbackCat?: string): any {
  if (!rawCat) return fallbackCat || 'ssc';
  if (typeof rawCat === 'string') return rawCat;
  if (typeof rawCat === 'object' && rawCat !== null) {
    if (typeof rawCat.name === 'string') return rawCat.name;
    if (typeof rawCat.slug === 'string') return rawCat.slug;
    if (typeof rawCat.title === 'string') return rawCat.title;
    if (typeof rawCat.id === 'string') return rawCat.id;
    if (Array.isArray(rawCat) && rawCat.length > 0) return normalizeCategory(rawCat[0], fallbackCat);
  }
  return fallbackCat || 'ssc';
}

export async function fetchAllBatches(): Promise<BatchCourse[]> {
  try {
    // Try internal server proxy first
    const res = await fetchWithTimeout('/api/proxy/courses');
    if (res.ok) {
      const json = await res.json();
      if (json.state === 200 && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.map((c: any) => {
          const matchingFallback = INITIAL_BATCHES.find(fb => fb.id === c.id || fb.title === c.title);
          return {
            ...matchingFallback,
            ...c,
            category: normalizeCategory(c.category, matchingFallback?.category)
          };
        });
      }
    }
  } catch (err) {
    console.warn('Proxy courses unavailable, attempting direct fallback...', err);
  }

  return INITIAL_BATCHES;
}

// Alias for backward compatibility
export const fetchAllCourses = fetchAllBatches;

export async function fetchBatchDetail(id: string): Promise<BatchCourse> {
  try {
    const res = await fetchWithTimeout(`/api/proxy/courses/${id}`);
    if (res.ok) {
      const json = await res.json();
      if (json.state === 200 && json.data) {
        const fallback = INITIAL_BATCHES.find(b => b.id === id);
        return {
          ...fallback,
          ...json.data,
          category: normalizeCategory(json.data.category, fallback?.category)
        };
      }
    }
  } catch (err) {
    console.warn('Using fallback batch detail for ID:', id);
  }

  const fallback = INITIAL_BATCHES.find(b => b.id === id) || INITIAL_BATCHES[0];
  return fallback;
}

export async function fetchBatchClasses(id: string, batch?: BatchCourse): Promise<ClassTopic[]> {
  try {
    const res = await fetchWithTimeout(`/api/proxy/courses/${id}/classes`);
    if (res.ok) {
      const json = await res.json();
      if (json.state === 200 && json.data?.classes && json.data.classes.length > 0) {
        return json.data.classes;
      }
    }
  } catch (err) {
    console.warn('Using enriched lecture topics for ID:', id);
  }

  const currentBatch = batch || INITIAL_BATCHES.find(b => b.id === id) || INITIAL_BATCHES[0];
  return generateSampleClassesForBatch(currentBatch);
}

export async function fetchBatchPdfs(id: string, batch?: BatchCourse): Promise<PdfTopic[]> {
  try {
    const res = await fetchWithTimeout(`/api/proxy/courses/${id}/pdfs`);
    if (res.ok) {
      const json = await res.json();
      if (json.state === 200 && json.data?.topics && json.data.topics.length > 0) {
        return json.data.topics;
      }
    }
  } catch (err) {
    console.warn('Using structured notes topics for ID:', id);
  }

  const currentBatch = batch || INITIAL_BATCHES.find(b => b.id === id) || INITIAL_BATCHES[0];
  return generateSamplePdfsForBatch(currentBatch);
}
