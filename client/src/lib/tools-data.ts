import { PDFTool } from "@shared/schema";

// Comprehensive list of all PDF tools matching PDF24
export const ALL_TOOLS: PDFTool[] = [
  // Most popular tools
  {
    id: "merge-pdf",
    name: "Merge PDF",
    description: "Combine multiple PDF files into a single document",
    icon: "FilePlus2",
    category: ["all", "organize-pdf"],
    path: "/tool/merge-pdf",
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    description: "Split PDF files into multiple documents",
    icon: "FileX2",
    category: ["all", "organize-pdf"],
    path: "/tool/split-pdf",
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    description: "Reduce PDF file size while maintaining quality",
    icon: "Minimize2",
    category: ["all", "optimize-pdf"],
    path: "/tool/compress-pdf",
  },
  {
    id: "images-to-pdf",
    name: "Images to PDF",
    description: "Convert JPG, PNG, and other images to PDF",
    icon: "Image",
    category: ["all", "convert-to-pdf"],
    path: "/tool/images-to-pdf",
  },
  {
    id: "pdf-to-images",
    name: "PDF to Images",
    description: "Convert PDF pages to JPG or PNG images",
    icon: "ImageDown",
    category: ["all", "convert-from-pdf"],
    path: "/tool/pdf-to-images",
  },
  
  // Organize PDF tools
  {
    id: "rotate-pdf",
    name: "Rotate PDF Pages",
    description: "Rotate pages in PDF files to correct orientation",
    icon: "RotateCw",
    category: ["all", "organize-pdf"],
    path: "/tool/rotate-pdf",
  },
  {
    id: "remove-pages",
    name: "Remove PDF Pages",
    description: "Delete unwanted pages from PDF files",
    icon: "FileX",
    category: ["all", "organize-pdf"],
    path: "/tool/remove-pages",
  },
  {
    id: "extract-pages",
    name: "Extract PDF Pages",
    description: "Extract specific pages from PDF files",
    icon: "FileOutput",
    category: ["all", "organize-pdf"],
    path: "/tool/extract-pages",
  },
  {
    id: "rearrange-pages",
    name: "Rearrange PDF Pages",
    description: "Reorder pages inside PDF files",
    icon: "ArrowUpDown",
    category: ["all", "organize-pdf"],
    path: "/tool/rearrange-pages",
  },
  
  // Edit PDF tools
  {
    id: "add-watermark",
    name: "Add Watermark",
    description: "Add text or image watermarks to PDF files",
    icon: "Type",
    category: ["all", "edit-pdf"],
    path: "/tool/add-watermark",
  },
  {
    id: "add-page-numbers",
    name: "Add Page Numbers",
    description: "Add page numbers to PDF documents",
    icon: "Hash",
    category: ["all", "edit-pdf"],
    path: "/tool/add-page-numbers",
  },
  
  // Security tools
  {
    id: "protect-pdf",
    name: "Protect PDF",
    description: "Password protect and set permissions on PDF files",
    icon: "Lock",
    category: ["all", "edit-pdf"],
    path: "/tool/protect-pdf",
  },
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    description: "Remove password protection from PDF files",
    icon: "LockOpen",
    category: ["all", "edit-pdf"],
    path: "/tool/unlock-pdf",
  },
  
  // Convert to PDF
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert JPG images to PDF documents",
    icon: "FileImage",
    category: ["all", "convert-to-pdf"],
    path: "/tool/jpg-to-pdf",
  },
  {
    id: "png-to-pdf",
    name: "PNG to PDF",
    description: "Convert PNG images to PDF documents",
    icon: "FileImage",
    category: ["all", "convert-to-pdf"],
    path: "/tool/png-to-pdf",
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Microsoft Word documents to PDF",
    icon: "FileText",
    category: ["all", "convert-to-pdf"],
    path: "/tool/word-to-pdf",
  },
  
  // Convert from PDF
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    description: "Convert PDF pages to JPG images",
    icon: "FileImage",
    category: ["all", "convert-from-pdf"],
    path: "/tool/pdf-to-jpg",
  },
  {
    id: "pdf-to-png",
    name: "PDF to PNG",
    description: "Convert PDF pages to PNG images",
    icon: "FileImage",
    category: ["all", "convert-from-pdf"],
    path: "/tool/pdf-to-png",
  },
  
  // Image conversion
  {
    id: "webp-to-jpg",
    name: "WEBP to JPG",
    description: "Convert WEBP images to JPG format",
    icon: "Image",
    category: ["all", "convert-images"],
    path: "/tool/webp-to-jpg",
  },
  {
    id: "webp-to-png",
    name: "WEBP to PNG",
    description: "Convert WEBP images to PNG format",
    icon: "Image",
    category: ["all", "convert-images"],
    path: "/tool/webp-to-png",
  },
];

// Category labels for navigation
export const CATEGORY_LABELS: Record<string, string> = {
  all: "All Tools",
  favorites: "Favorites",
  recent: "Recently Used",
  "convert-to-pdf": "Convert to PDF",
  "convert-from-pdf": "Convert from PDF",
  "edit-pdf": "Edit PDF",
  "organize-pdf": "Organize PDF",
  "optimize-pdf": "Optimize PDF",
  "convert-images": "Convert Images",
};
