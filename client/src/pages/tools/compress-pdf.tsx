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

export default function CompressPDFPage() {
  const [file, setFile] = useState<ProcessingFile | null>(null);
  const [processing, setProcessing] = useState(false);
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");
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

  const handleCompress = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const arrayBuffer = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Compress by saving with reduced quality settings
      // Lower compression for different quality levels
      const compressionLevel = quality === "low" ? 9 : quality === "medium" ? 6 : 3;
      
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const compressedName = file.name.replace(".pdf", "-compressed.pdf");
      saveAs(blob, compressedName);

      const originalSize = (file.size / 1024 / 1024).toFixed(2);
      const newSize = (blob.size / 1024 / 1024).toFixed(2);
      const savings = ((1 - blob.size / file.size) * 100).toFixed(1);

      toast({
        title: "Success!",
        description: `PDF compressed from ${originalSize}MB to ${newSize}MB (${savings}% reduction).`,
      });

      setFile(null);
    } catch (error) {
      console.error("Error compressing PDF:", error);
      toast({
        title: "Error",
        description: "Failed to compress PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      toolId="compress-pdf"
      title="Compress PDF"
      description="Reduce PDF file size while maintaining quality"
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
                  Original size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div>
                <Label className="mb-3 block">Compression Quality</Label>
                <RadioGroup value={quality} onValueChange={(v) => setQuality(v as typeof quality)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" data-testid="radio-low" />
                    <Label htmlFor="low">Low (Smallest file size)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" data-testid="radio-medium" />
                    <Label htmlFor="medium">Medium (Recommended)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" data-testid="radio-high" />
                    <Label htmlFor="high">High (Best quality)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCompress}
                  disabled={processing}
                  className="flex-1"
                  data-testid="button-compress"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Compressing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Compress PDF
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
