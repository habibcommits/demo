import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  title?: string;
  description?: string;
}

export function FileUploadZone({
  onFilesSelected,
  accept = { "application/pdf": [".pdf"] },
  multiple = false,
  maxSize = 50 * 1024 * 1024, // 50MB default
  disabled = false,
  title = "Drop files here",
  description = "or click to browse",
}: FileUploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize,
    disabled,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200",
        "hover-elevate active-elevate-2",
        isDragActive && !isDragReject && "border-primary bg-primary/5",
        isDragReject && "border-destructive bg-destructive/5",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      data-testid="zone-file-upload"
    >
      <input {...getInputProps()} data-testid="input-file" />
      
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <Upload className="w-12 h-12 text-primary" data-testid="icon-upload" />
        ) : (
          <File className="w-12 h-12 text-muted-foreground" data-testid="icon-file" />
        )}
        
        <div>
          <p className="text-lg font-medium mb-1" data-testid="text-upload-title">
            {isDragActive ? "Drop files here" : title}
          </p>
          <p className="text-sm text-muted-foreground" data-testid="text-upload-description">{description}</p>
          {maxSize && (
            <p className="text-xs text-muted-foreground mt-2" data-testid="text-max-size">
              Max file size: {(maxSize / 1024 / 1024).toFixed(0)}MB
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
