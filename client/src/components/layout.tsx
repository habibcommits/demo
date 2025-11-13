import { Link } from "wouter";
import { ThemeToggle } from "./theme-toggle";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export function Layout({ children, showSearch = false, onSearch }: LayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2 transition-all cursor-pointer">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                <path d="M14 2v6h6"/>
                <path d="M12 18v-6"/>
                <path d="m9 15 3 3 3-3"/>
              </svg>
              <span className="font-semibold text-lg hidden sm:inline">PDF Tools</span>
            </div>
          </Link>

          {showSearch && (
            <div className="flex-1 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      <footer className="border-t py-8 mt-16" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2" data-testid="text-privacy-notice">All processing happens in your browser. Your files never leave your device.</p>
            <p data-testid="text-copyright">&copy; {new Date().getFullYear()} PDF Tools. No login required.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
