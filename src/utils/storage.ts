import { PublishedDesign } from '../types/card';

const LOCAL_STORAGE_KEY = 'wishcraft_user_designs';
const FAVORITES_KEY = 'wishcraft_favorite_templates';

export function generateId(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 30);
}

// Local draft saving
export function getLocalDesigns(): PublishedDesign[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalDesign(design: PublishedDesign) {
  try {
    const designs = getLocalDesigns();
    const index = designs.findIndex((d) => d.id === design.id);
    if (index >= 0) {
      designs[index] = design;
    } else {
      designs.unshift(design);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(designs));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

// API: Save / Publish to Persistent Server
export async function publishDesignToServer(design: PublishedDesign): Promise<PublishedDesign> {
  // Always update local cache first
  saveLocalDesign(design);

  try {
    const res = await fetch('/api/designs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(design),
    });
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (err) {
    console.warn('Network call failed, falling back to local copy:', err);
  }

  return design;
}

// API: Fetch single design from server
export async function fetchDesignById(id: string): Promise<PublishedDesign | null> {
  try {
    const res = await fetch(`/api/designs/${encodeURIComponent(id)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
    }
  } catch (err) {
    console.warn('Error fetching design from server:', err);
  }

  // Fallback to local storage if server unreachable or offline
  const localList = getLocalDesigns();
  const found = localList.find(
    (d) => d.id === id || d.slug === id || id.endsWith(`-${d.id}`)
  );
  return found || null;
}

// API: Delete design
export async function deleteDesign(id: string): Promise<boolean> {
  // Delete from local
  try {
    const list = getLocalDesigns().filter((d) => d.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch {}

  // Delete from server
  try {
    const res = await fetch(`/api/designs/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Favorites helper
export function getFavoriteTemplateIds(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteTemplate(id: string): boolean {
  try {
    const favs = getFavoriteTemplateIds();
    const idx = favs.indexOf(id);
    let next: string[];
    let isFav = false;
    if (idx >= 0) {
      next = favs.filter((f) => f !== id);
    } else {
      next = [...favs, id];
      isFav = true;
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    return isFav;
  } catch {
    return false;
  }
}
