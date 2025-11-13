import { Link } from "wouter";
import { PDFTool } from "@shared/schema";
import { Card } from "./ui/card";
import { Star } from "lucide-react";
import * as Icons from "lucide-react";
import { toggleFavorite, isFavorite } from "@/lib/storage";
import { useState } from "react";
import { Button } from "./ui/button";

interface ToolCardProps {
  tool: PDFTool;
  onFavoriteChange?: () => void;
}

export function ToolCard({ tool, onFavoriteChange }: ToolCardProps) {
  const [favorited, setFavorited] = useState(isFavorite(tool.id));

  const IconComponent = Icons[tool.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool.id);
    setFavorited(!favorited);
    onFavoriteChange?.();
  };

  return (
    <Link href={tool.path} data-testid={`link-tool-${tool.id}`}>
      <Card className="h-full p-6 hover-elevate active-elevate-2 transition-all duration-200 cursor-pointer relative group" data-testid={`card-tool-${tool.id}`}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleFavoriteClick}
          data-testid={`button-favorite-${tool.id}`}
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={`h-4 w-4 ${favorited ? "fill-primary text-primary" : ""}`} />
        </Button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            {IconComponent && <IconComponent className="w-8 h-8 text-primary" />}
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-1" data-testid={`text-tool-name-${tool.id}`}>
              {tool.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {tool.description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
