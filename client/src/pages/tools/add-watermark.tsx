import { useState } from "react";
import { ToolPageLayout } from "../tool-page-layout";
import { FileUploadZone } from "@/components/file-upload-zone";
import { ProcessingFile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function AddWatermarkPage() {
  const [file, setFile] = useState<ProcessingFile | null>(null);
  const [processing, setProcessing] = useState(false);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState([0.3]);
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

  const handleAddWatermark = async () => {
    if (!file || !watermarkText) {
      toast({
        title: "Missing information",
        description: "Please provide watermark text.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const arrayBuffer = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        
        page.drawText(watermarkText, {
          x: width / 2 - (watermarkText.length * 20) / 2,
          y: height / 2,
          size: 60,
          color: rgb(0.5, 0.5, 0.5),
          opacity: opacity[0],
          rotate: { type: "degrees", angle: 45 },
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const watermarkedName = file.name.replace(".pdf", "-watermarked.pdf");
      saveAs(blob, watermarkedName);

      toast({
        title: "Success!",
        description: "Watermark added successfully.",
      });

      setFile(null);
    } catch (error) {
      console.error("Error adding watermark:", error);
      toast({
        title: "Error",
        description: "Failed to add watermark. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      toolId="add-watermark"
      title="Add Watermark"
      description="Add text watermarks to PDF files"
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
                <Label htmlFor="watermark-text" className="mb-2 block">
                  Watermark Text
                </Label>
                <Input
                  id="watermark-text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Enter watermark text"
                  data-testid="input-watermark-text"
                />
              </div>

              <div>
                <Label htmlFor="opacity-slider" className="mb-2 block">
                  Opacity: {(opacity[0] * 100).toFixed(0)}%
                </Label>
                <Slider
                  id="opacity-slider"
                  value={opacity}
                  onValueChange={setOpacity}
                  min={0.1}
                  max={1}
                  step={0.1}
                  data-testid="slider-opacity"
                  aria-label="Watermark opacity"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAddWatermark}
                  disabled={processing || !watermarkText}
                  className="flex-1"
                  data-testid="button-add-watermark"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Add Watermark
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
