import { ProcessingFile } from "@shared/schema";
import { Button } from "./ui/button";
import { X, File } from "lucide-react";
import { Card } from "./ui/card";

interface FileListProps {
  files: ProcessingFile[];
  onRemove: (id: string) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  if (files.length === 0) return null;

  return (
    <div className="space-y-2" data-testid="file-list">
      {files.map((file) => (
        <Card key={file.id} className="p-4" data-testid={`file-item-${file.id}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <File className="w-5 h-5 text-muted-foreground flex-shrink-0" data-testid={`icon-file-${file.id}`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate" data-testid={`text-filename-${file.id}`}>
                  {file.name}
                </p>
                <p className="text-sm text-muted-foreground" data-testid={`text-filesize-${file.id}`}>
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(file.id)}
              data-testid={`button-remove-file-${file.id}`}
              aria-label={`Remove ${file.name}`}
            >
              <X className="w-4 h-4" data-testid={`icon-remove-${file.id}`} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
