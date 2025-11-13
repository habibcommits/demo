import { useState } from "react";
import { ToolPageLayout } from "../tool-page-layout";
import { FileUploadZone } from "@/components/file-upload-zone";
import { ProcessingFile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import { saveAs } from "file-saver";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PDFToImagesPage() {
  const [file, setFile] = useState<ProcessingFile | null>(null);
  const [processing, setProcessing] = useState(false);
  const [format, setFormat] = useState<"png" | "jpg">("png");
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

  const handleConvert = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const arrayBuffer = await file.file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });
        
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
          }, format === "png" ? "image/png" : "image/jpeg", 0.95);
        });

        saveAs(blob, `page-${pageNum}.${format}`);
      }

      toast({
        title: "Success!",
        description: `Converted ${numPages} pages to ${format.toUpperCase()}.`,
      });

      setFile(null);
    } catch (error) {
      console.error("Error converting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to convert PDF to images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      toolId="pdf-to-images"
      title="PDF to Images"
      description="Convert PDF pages to JPG or PNG images"
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
                <Label className="mb-3 block">Output Format</Label>
                <RadioGroup value={format} onValueChange={(v) => setFormat(v as "png" | "jpg")}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="png" id="png" data-testid="radio-png" />
                    <Label htmlFor="png">PNG (Lossless, larger file size)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="jpg" id="jpg" data-testid="radio-jpg" />
                    <Label htmlFor="jpg">JPG (Compressed, smaller file size)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleConvert}
                  disabled={processing}
                  className="flex-1"
                  data-testid="button-convert"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Convert to {format.toUpperCase()}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setFile(null)}
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
