import { useState } from "react";
import { ToolPageLayout } from "../tool-page-layout";
import { FileUploadZone } from "@/components/file-upload-zone";
import { ProcessingFile } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type Position = "bottom-center" | "bottom-left" | "bottom-right" | "top-center" | "top-left" | "top-right";
type Format = "number" | "page-of-total" | "number-with-text";

export default function AddPageNumbersPage() {
  const [file, setFile] = useState<ProcessingFile | null>(null);
  const [processing, setProcessing] = useState(false);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [format, setFormat] = useState<Format>("number");
  const [prefix, setPrefix] = useState("Page ");
  const [fontSize, setFontSize] = useState("12");
  const [startNumber, setStartNumber] = useState("1");
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

  const getCoordinates = (position: Position, pageWidth: number, pageHeight: number, textWidth: number, fontSize: number) => {
    const margin = 30;
    const positions = {
      "bottom-center": { x: (pageWidth - textWidth) / 2, y: margin },
      "bottom-left": { x: margin, y: margin },
      "bottom-right": { x: pageWidth - textWidth - margin, y: margin },
      "top-center": { x: (pageWidth - textWidth) / 2, y: pageHeight - fontSize - margin },
      "top-left": { x: margin, y: pageHeight - fontSize - margin },
      "top-right": { x: pageWidth - textWidth - margin, y: pageHeight - fontSize - margin },
    };
    return positions[position];
  };

  const formatPageNumber = (pageNum: number, totalPages: number, format: Format, prefix: string) => {
    switch (format) {
      case "number":
        return `${pageNum}`;
      case "page-of-total":
        return `${pageNum} of ${totalPages}`;
      case "number-with-text":
        return `${prefix}${pageNum}`;
      default:
        return `${pageNum}`;
    }
  };

  const handleAddPageNumbers = async () => {
    if (!file) {
      toast({
        title: "Missing file",
        description: "Please select a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    try {
      const arrayBuffer = await file.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const totalPages = pages.length;
      const size = parseInt(fontSize);
      const start = parseInt(startNumber);

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNum = index + start;
        const text = formatPageNumber(pageNum, totalPages, format, prefix);
        const textWidth = font.widthOfTextAtSize(text, size);
        const coords = getCoordinates(position, width, height, textWidth, size);
        
        page.drawText(text, {
          x: coords.x,
          y: coords.y,
          size: size,
          font: font,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const numberedName = file.name.replace(".pdf", "-numbered.pdf");
      saveAs(blob, numberedName);

      toast({
        title: "Success!",
        description: "Page numbers added successfully.",
      });

      setFile(null);
    } catch (error) {
      console.error("Error adding page numbers:", error);
      toast({
        title: "Error",
        description: "Failed to add page numbers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      toolId="add-page-numbers"
      title="Add Page Numbers"
      description="Add page numbers to PDF documents"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position-select" className="mb-2 block">
                    Position
                  </Label>
                  <Select value={position} onValueChange={(value) => setPosition(value as Position)}>
                    <SelectTrigger id="position-select">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-center">Bottom Center</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="top-center">Top Center</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="format-select" className="mb-2 block">
                    Format
                  </Label>
                  <Select value={format} onValueChange={(value) => setFormat(value as Format)}>
                    <SelectTrigger id="format-select">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="number">Number only (1, 2, 3...)</SelectItem>
                      <SelectItem value="page-of-total">Page of Total (1 of 10)</SelectItem>
                      <SelectItem value="number-with-text">Number with prefix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {format === "number-with-text" && (
                <div>
                  <Label htmlFor="prefix" className="mb-2 block">
                    Prefix Text
                  </Label>
                  <Input
                    id="prefix"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="Page "
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="font-size" className="mb-2 block">
                    Font Size
                  </Label>
                  <Input
                    id="font-size"
                    type="number"
                    min="8"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="start-number" className="mb-2 block">
                    Start Number
                  </Label>
                  <Input
                    id="start-number"
                    type="number"
                    min="1"
                    value={startNumber}
                    onChange={(e) => setStartNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddPageNumbers}
                  disabled={processing}
                  className="flex-1"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Add Page Numbers
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setFile(null)}
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
