import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";
import { addToRecentlyUsed } from "@/lib/storage";

interface ToolPageLayoutProps {
  toolId: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function ToolPageLayout({ toolId, title, description, children }: ToolPageLayoutProps) {
  useEffect(() => {
    addToRecentlyUsed(toolId);
  }, [toolId]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" data-testid="link-back">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </Button>
          </Link>
        </div>

        {/* Tool Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2" data-testid="text-tool-title">
            {title}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        {/* Tool Content */}
        {children}
      </div>
    </Layout>
  );
}
