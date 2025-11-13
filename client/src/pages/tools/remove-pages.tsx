import { useState } from "react";
import { ToolPageLayout } from "../tool-page-layout";
import { FileUploadZone } from "@/components/file-upload-zone";
import { ProcessingFile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function RemovePagesPage() {
  const [file, setFile] = useState<ProcessingFile | null>(null);
  const [processing, setProcessing] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pagesToRemove, setPagesToRemove] = useState<string>("");
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const handleFileSelected = async (newFiles: File[]) => {
    if (newFiles.length > 0) {
      const file = newFiles[0];
      const processingFile: ProcessingFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      };
      setFile(processingFile);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setTotalPages(pdfDoc.getPageCount());
      } catch (error) {
        console.error("Error loading PDF:", error);
        toast({
          title: "Error",
          description: "Failed to load PDF file.",
          variant: "destructive",
        });
      }
    }
  };

  const parsePageNumbers = (input: string): number[] => {
    const pages: number[] = [];
    const parts = input.split(",").map((p) => p.trim());

    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((n) => parseInt(n.trim()));
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= totalPages) {
              pages.push(i);
            }
          }
        }
      } else {
        const pageNum = parseInt(part);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
          pages.push(pageNum);
        }
      }
    }

    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const handlePagesInputChange = (value: string) => {
    setPagesToRemove(value);
    const parsed = parsePageNumbers(value);
    setSelectedPages(new Set(parsed));
  };

  const handleRemovePages = async () => {
    if (!file) {
      toast({
        title: "Missing file",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPages.size === 0) {
      toast({
        title: "No pages selected",
        description: "Please specify which pages to remove.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPages.size >= totalPages) {
      toast({
        title: "Cannot remove all pages",
        description: "You must keep at least one page in the PDF.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const arrayBuffer = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdfDoc = await PDFDocument.create();

      const totalPageCount = pdfDoc.getPageCount();
      const pagesToKeep: number[] = [];

      for (let i = 1; i <= totalPageCount; i++) {
        if (!selectedPages.has(i)) {
          pagesToKeep.push(i - 1);
        }
      }

      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pagesToKeep);
      copiedPages.forEach((page) => {
        newPdfDoc.addPage(page);
      });

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const removedName = file.name.replace(".pdf", "-removed-pages.pdf");
      saveAs(blob, removedName);

      toast({
        title: "Success!",
        description: `Removed ${selectedPages.size} page(s) successfully.`,
      });

      setFile(null);
      setPagesToRemove("");
      setSelectedPages(new Set());
      setTotalPages(0);
    } catch (error) {
      console.error("Error removing pages:", error);
      toast({
        title: "Error",
        description: "Failed to remove pages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      toolId="remove-pages"
      title="Remove PDF Pages"
      description="Delete unwanted pages from PDF files"
    >
      <div className="space-y-6">
        {!file ? (
          <FileUploadZone
            onFilesSelected={handleFileSelected}
            multiple={false}
            title="Drop PDF file here"
            description="or click to select a file"
          />
        ) : (
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <p className="font-medium mb-1">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {totalPages} pages
                </p>
              </div>

              <div>
                <Label htmlFor="pages-to-remove" className="mb-2 block">
                  Pages to Remove
                </Label>
                <Input
                  id="pages-to-remove"
                  value={pagesToRemove}
                  onChange={(e) => handlePagesInputChange(e.target.value)}
                  placeholder="e.g., 1, 3, 5-7, 10"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Enter page numbers separated by commas. Use hyphens for ranges (e.g., 1-3).
                </p>
              </div>

              {selectedPages.size > 0 && (
                <div>
                  <Label className="mb-2 block">
                    Selected Pages ({selectedPages.size})
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(selectedPages)
                      .sort((a, b) => a - b)
                      .map((page) => (
                        <Badge key={page} variant="destructive">
                          Page {page}
                        </Badge>
                      ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {totalPages - selectedPages.size} page(s) will remain
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleRemovePages}
                  disabled={processing || selectedPages.size === 0}
                  variant="destructive"
                  className="flex-1"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove Pages
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setFile(null);
                    setPagesToRemove("");
                    setSelectedPages(new Set());
                    setTotalPages(0);
                  }}
                  variant="outline"
                  disabled={processing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
}
