import { useState } from "react";
import { ToolPageLayout } from "../tool-page-layout";
import { FileUploadZone } from "@/components/file-upload-zone";
import { ProcessingFile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

export default function SplitPDFPage() {
  const [file, setFile] = useState<ProcessingFile | null>(null);
  const [processing, setProcessing] = useState(false);
  const [mode, setMode] = useState<"single" | "range">("single");
  const [pageInput, setPageInput] = useState("");
  const { toast } = useToast();

  const handleFileSelected = (newFiles: File[]) => {
    if (newFiles.length > 0) {
      const file = newFiles[0];
      setFile({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

  const handleSplit = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const arrayBuffer = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();

      if (mode === "single") {
        // Split into individual pages
        for (let i = 0; i < pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(copiedPage);
          
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          saveAs(blob, `page-${i + 1}.pdf`);
        }
      } else {
        // Split by page ranges
        const ranges = pageInput.split(",").map(r => r.trim());
        
        for (let idx = 0; idx < ranges.length; idx++) {
          const range = ranges[idx];
          const newPdf = await PDFDocument.create();
          
          if (range.includes("-")) {
            const [start, end] = range.split("-").map(n => parseInt(n.trim()) - 1);
            const pages = await newPdf.copyPages(pdfDoc, Array.from({ length: end - start + 1 }, (_, i) => start + i));
            pages.forEach(page => newPdf.addPage(page));
          } else {
            const pageNum = parseInt(range) - 1;
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageNum]);
            newPdf.addPage(copiedPage);
          }
          
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          saveAs(blob, `split-${idx + 1}.pdf`);
        }
      }

      toast({
        title: "Success!",
        description: "PDF split successfully.",
      });

      setFile(null);
      setPageInput("");
    } catch (error) {
      console.error("Error splitting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to split PDF. Please check your page ranges.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      toolId="split-pdf"
      title="Split PDF"
      description="Split PDF files into multiple documents"
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
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div>
                <Label className="mb-3 block">Split Mode</Label>
                <RadioGroup value={mode} onValueChange={(v) => setMode(v as "single" | "range")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="single" data-testid="radio-single" />
                    <Label htmlFor="single">Split into individual pages</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="range" id="range" data-testid="radio-range" />
                    <Label htmlFor="range">Split by page ranges</Label>
                  </div>
                </RadioGroup>
              </div>

              {mode === "range" && (
                <div>
                  <Label htmlFor="page-ranges" className="mb-2 block">
                    Page Ranges
                  </Label>
                  <Input
                    id="page-ranges"
                    placeholder="e.g., 1-3, 5, 7-9"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    data-testid="input-page-ranges"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter page ranges separated by commas
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleSplit}
                  disabled={processing || (mode === "range" && !pageInput)}
                  className="flex-1"
                  data-testid="button-split"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Splitting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Split PDF
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setPageInput("");
                  }}
                  data-testid="button-clear"
                >
                  Clear
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ToolPageLayout>
  );
}
