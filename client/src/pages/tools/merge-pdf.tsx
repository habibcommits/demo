import { useState } from "react";
import { ToolPageLayout } from "../tool-page-layout";
import { FileUploadZone } from "@/components/file-upload-zone";
import { FileList } from "@/components/file-list";
import { ProcessingFile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function MergePDFPage() {
  const [files, setFiles] = useState<ProcessingFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = (newFiles: File[]) => {
    const processingFiles: ProcessingFile[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setFiles((prev) => [...prev, ...processingFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({
        title: "Need more files",
        description: "Please upload at least 2 PDF files to merge.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, "merged.pdf");

      toast({
        title: "Success!",
        description: "PDF files merged successfully.",
      });

      setFiles([]);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      toast({
        title: "Error",
        description: "Failed to merge PDF files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      toolId="merge-pdf"
      title="Merge PDF"
      description="Combine multiple PDF files into a single document"
    >
      <div className="space-y-6">
        <FileUploadZone
          onFilesSelected={handleFilesSelected}
          multiple
          title="Drop PDF files here"
          description="or click to select multiple files"
          disabled={processing}
        />

        <FileList files={files} onRemove={handleRemoveFile} />

        {files.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleMerge}
              disabled={processing || files.length < 2}
              size="lg"
              data-testid="button-merge"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Merging...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Merge PDFs ({files.length} files)
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
