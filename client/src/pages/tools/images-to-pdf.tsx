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

export default function ImagesToPDFPage() {
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

  const handleConvert = async () => {
    if (files.length === 0) {
      toast({
        title: "No files",
        description: "Please upload at least one image file.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.file.arrayBuffer();
        let image;

        if (file.type === "image/png") {
          image = await pdfDoc.embedPng(arrayBuffer);
        } else if (file.type === "image/jpeg" || file.type === "image/jpg") {
          image = await pdfDoc.embedJpg(arrayBuffer);
        } else {
          continue; // Skip unsupported formats
        }

        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, "images.pdf");

      toast({
        title: "Success!",
        description: `Converted ${files.length} images to PDF.`,
      });

      setFiles([]);
    } catch (error) {
      console.error("Error converting images:", error);
      toast({
        title: "Error",
        description: "Failed to convert images to PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      toolId="images-to-pdf"
      title="Images to PDF"
      description="Convert JPG, PNG, and other images to PDF"
    >
      <div className="space-y-6">
        <FileUploadZone
          onFilesSelected={handleFilesSelected}
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpg", ".jpeg"],
            "image/webp": [".webp"],
          }}
          multiple
          title="Drop image files here"
          description="Supports PNG, JPG, JPEG, WEBP"
          disabled={processing}
        />

        <FileList files={files} onRemove={handleRemoveFile} />

        {files.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleConvert}
              disabled={processing}
              size="lg"
              data-testid="button-convert"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Convert to PDF ({files.length} images)
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
}
