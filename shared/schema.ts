import { z } from "zod";

// Tool categories matching PDF24 structure
export type ToolCategory = 
  | "favorites"
  | "recent"
  | "all"
  | "convert-to-pdf"
  | "convert-from-pdf"
  | "edit-pdf"
  | "organize-pdf"
  | "optimize-pdf"
  | "convert-images";

// Individual PDF tool definition
export interface PDFTool {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide-react icon name
  category: ToolCategory[];
  path: string;
}

// File with metadata for processing
export interface ProcessingFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string; // base64 or blob URL for preview
}

// User preferences stored in localStorage
export interface UserPreferences {
  favorites: string[]; // tool IDs
  recentlyUsed: string[]; // tool IDs with timestamps
  theme: "light" | "dark";
}

// Tool processing options
export interface MergePDFOptions {
  files: ProcessingFile[];
}

export interface SplitPDFOptions {
  file: ProcessingFile;
  mode: "pages" | "size";
  pages?: number[]; // specific page numbers
  pageRanges?: string; // e.g., "1-3, 5, 7-9"
}

export interface CompressPDFOptions {
  file: ProcessingFile;
  quality: "low" | "medium" | "high";
}

export interface RotatePDFOptions {
  file: ProcessingFile;
  pages: number[]; // which pages to rotate
  angle: 90 | 180 | 270;
}

export interface WatermarkOptions {
  file: ProcessingFile;
  text: string;
  opacity: number; // 0-1
  position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
  fontSize: number;
}

export interface ProtectPDFOptions {
  file: ProcessingFile;
  password: string;
  permissions: {
    printing: boolean;
    modifying: boolean;
    copying: boolean;
  };
}

export interface ImageToPDFOptions {
  files: ProcessingFile[];
  pageSize: "A4" | "Letter" | "auto";
  orientation: "portrait" | "landscape";
}

export interface PDFToImageOptions {
  file: ProcessingFile;
  format: "png" | "jpg";
  quality: number; // 0-100 for jpg
  dpi: number; // 72, 150, 300
  pages: "all" | number[];
}

// Validation schemas
export const userPreferencesSchema = z.object({
  favorites: z.array(z.string()),
  recentlyUsed: z.array(z.string()),
  theme: z.enum(["light", "dark"]),
});

// Local storage keys
export const STORAGE_KEYS = {
  PREFERENCES: "pdf-tools-preferences",
  RECENT_TOOLS: "pdf-tools-recent",
  FAVORITES: "pdf-tools-favorites",
} as const;
