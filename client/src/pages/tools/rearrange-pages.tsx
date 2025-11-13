import { useState } from "react";
import { ToolPageLayout } from "../tool-page-layout";
import { FileUploadZone } from "@/components/file-upload-zone";
import { ProcessingFile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Download, Loader2, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PageItem {
  originalIndex: number;
  displayNumber: number;
}

export default function RearrangePagesPage() {
  const [file, setFile] = useState<ProcessingFile | null>(null);
  const [processing, setProcessing] = useState(false);
  const [pages, setPages] = useState<PageItem[]>([]);
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
        const totalPages = pdfDoc.getPageCount();
        
        const pageItems: PageItem[] = [];
        for (let i = 0; i < totalPages; i++) {
          pageItems.push({
            originalIndex: i,
            displayNumber: i + 1,
          });
        }
        setPages(pageItems);
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

  const movePage = (index: number, direction: "up" | "down") => {
    const newPages = [...pages];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newPages.length) return;
    
    [newPages[index], newPages[targetIndex]] = [newPages[targetIndex], newPages[index]];
    setPages(newPages);
  };

  const removePage = (index: number) => {
    if (pages.length <= 1) {
      toast({
        title: "Cannot remove",
        description: "You must keep at least one page in the PDF.",
        variant: "destructive",
      });
      return;
    }
    setPages(pages.filter((_, i) => i !== index));
  };

  const handleRearrangePages = async () => {
    if (!file) {
      toast({
        title: "Missing file",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (pages.length === 0) {
      toast({
        title: "No pages",
        description: "The PDF must have at least one page.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const arrayBuffer = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdfDoc = await PDFDocument.create();

      const pageIndices = pages.map((page) => page.originalIndex);
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
      
      copiedPages.forEach((page) => {
        newPdfDoc.addPage(page);
      });

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const rearrangedName = file.name.replace(".pdf", "-rearranged.pdf");
      saveAs(blob, rearrangedName);

      toast({
        title: "Success!",
        description: "Pages rearranged successfully.",
      });

      setFile(null);
      setPages([]);
    } catch (error) {
      console.error("Error rearranging pages:", error);
      toast({
        title: "Error",
        description: "Failed to rearrange pages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      toolId="rearrange-pages"
      title="Rearrange PDF Pages"
      description="Reorder pages inside PDF files"
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
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {pages.length} pages
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-3">Reorder pages by dragging or using arrows:</p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {pages.map((page, index) => (
                    <div
                      key={`${page.originalIndex}-${index}`}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <Badge variant="outline" className="min-w-16">
                        Page {page.displayNumber}
                      </Badge>
                      <div className="flex-1 text-sm text-muted-foreground">
                        Position: {index + 1}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => movePage(index, "up")}
                          disabled={index === 0 || processing}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => movePage(index, "down")}
                          disabled={index === pages.length - 1 || processing}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removePage(index)}
                          disabled={processing}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleRearrangePages}
                  disabled={processing}
                  className="flex-1"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Save Rearranged PDF
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setFile(null);
                    setPages([]);
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
