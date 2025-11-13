import { useState } from "react";
import { ToolPageLayout } from "../tool-page-layout";
import { FileUploadZone } from "@/components/file-upload-zone";
import { ProcessingFile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Download, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function ProtectPDFPage() {
  const [file, setFile] = useState<ProcessingFile | null>(null);
  const [processing, setProcessing] = useState(false);
  const [watermarkText, setWatermarkText] = useState("PROTECTED");
  const { toast } = useToast();
  const [showDisclaimer, setShowDisclaimer] = useState(true);

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

  const handleProtect = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const arrayBuffer = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      // Add metadata
      pdfDoc.setTitle(file.name);
      pdfDoc.setSubject(`Protected document - Created ${new Date().toLocaleDateString()}`);
      pdfDoc.setKeywords(['protected', 'confidential']);
      pdfDoc.setProducer('PDF Tools - Protection Indicators');
      pdfDoc.setAuthor('PDF Tools');
      
      // Add watermark to all pages
      const { rgb } = await import('pdf-lib');
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 2 - (watermarkText.length * 6),
          y: height - 30,
          size: 18,
          color: rgb(0.7, 0.1, 0.1),
          opacity: 0.4,
        });
      });
      
      const pdfBytes = await pdfDoc.save();
      
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const protectedName = file.name.replace(".pdf", "-marked.pdf");
      saveAs(blob, protectedName);

      toast({
        title: "Protection Indicators Applied!",
        description: `PDF marked with "${watermarkText}" watermark and metadata.`,
      });

      setFile(null);
    } catch (error) {
      console.error("Error protecting PDF:", error);
      toast({
        title: "Error",
        description: "Failed to add protection indicators. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      toolId="protect-pdf"
      title="Protect PDF"
      description="Add protection indicators and metadata to PDF files"
    >
      <div className="space-y-6">
        {showDisclaimer && (
          <Card className="p-4 border-primary/50 bg-primary/5" data-testid="card-disclaimer">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">About This Tool</p>
                <p className="text-xs text-muted-foreground">
                  This tool adds visible watermarks and metadata to mark PDFs as protected or confidential.
                  It does NOT provide password encryption. For true encryption, please use desktop PDF software
                  like Adobe Acrobat or similar tools that support AES encryption.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                onClick={() => setShowDisclaimer(false)}
                data-testid="button-dismiss-disclaimer"
                aria-label="Dismiss disclaimer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}
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
                  data-testid="input-watermark"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This text will appear as a watermark on every page
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleProtect}
                  disabled={processing || !watermarkText}
                  className="flex-1"
                  data-testid="button-apply-protection"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Apply Protection Indicators
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
