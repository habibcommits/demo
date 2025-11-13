import { useState } from "react";
import { ToolPageLayout } from "../tool-page-layout";
import { FileUploadZone } from "@/components/file-upload-zone";
import { ProcessingFile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Download, Loader2, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument, degrees } from "pdf-lib";
import { saveAs } from "file-saver";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RotatePDFPage() {
  const [file, setFile] = useState<ProcessingFile | null>(null);
  const [processing, setProcessing] = useState(false);
  const [angle, setAngle] = useState<90 | 180 | 270>(90);
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

  const handleRotate = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const arrayBuffer = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        page.setRotation(degrees(angle));
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const rotatedName = file.name.replace(".pdf", "-rotated.pdf");
      saveAs(blob, rotatedName);

      toast({
        title: "Success!",
        description: `PDF rotated ${angle}° clockwise.`,
      });

      setFile(null);
    } catch (error) {
      console.error("Error rotating PDF:", error);
      toast({
        title: "Error",
        description: "Failed to rotate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      toolId="rotate-pdf"
      title="Rotate PDF Pages"
      description="Rotate pages in PDF files to correct orientation"
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
                <Label className="mb-3 block">Rotation Angle</Label>
                <RadioGroup value={String(angle)} onValueChange={(v) => setAngle(Number(v) as 90 | 180 | 270)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="90" id="90" data-testid="radio-90" />
                    <Label htmlFor="90" className="flex items-center gap-2">
                      <RotateCw className="w-4 h-4" />
                      90° Clockwise
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="180" id="180" data-testid="radio-180" />
                    <Label htmlFor="180" className="flex items-center gap-2">
                      <RotateCw className="w-4 h-4" />
                      180° (Upside down)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="270" id="270" data-testid="radio-270" />
                    <Label htmlFor="270" className="flex items-center gap-2">
                      <RotateCw className="w-4 h-4" />
                      270° (90° Counter-clockwise)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleRotate}
                  disabled={processing}
                  className="flex-1"
                  data-testid="button-rotate"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Rotating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Rotate PDF
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
