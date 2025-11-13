import { useState, useMemo } from "react";
import { Layout } from "@/components/layout";
import { ToolCard } from "@/components/tool-card";
import { ALL_TOOLS, CATEGORY_LABELS } from "@/lib/tools-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFavorites, getRecentlyUsed } from "@/lib/storage";
import { ToolCategory } from "@shared/schema";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(getFavorites());
  const [recentTools] = useState<string[]>(getRecentlyUsed());
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleFavoriteChange = () => {
    setFavorites(getFavorites());
  };

  const filteredTools = useMemo(() => {
    let tools = ALL_TOOLS;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (activeTab === "favorites") {
      tools = tools.filter((tool) => favorites.includes(tool.id));
    } else if (activeTab === "recent") {
      const recentToolsSet = new Set(recentTools);
      tools = tools
        .filter((tool) => recentToolsSet.has(tool.id))
        .sort((a, b) => recentTools.indexOf(a.id) - recentTools.indexOf(b.id));
    } else if (activeTab !== "all") {
      tools = tools.filter((tool) => tool.category.includes(activeTab as ToolCategory));
    }

    return tools;
  }, [searchQuery, activeTab, favorites, recentTools]);

  return (
    <Layout showSearch onSearch={setSearchQuery}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4" data-testid="text-hero-title">
            All PDF Tools in One Place
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fast, secure, client-side processing. No login required.
            <br />
            Your files never leave your browser.
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8" data-testid="tabs-categories">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex w-full sm:w-auto min-w-full sm:min-w-0" data-testid="tabs-list">
              <TabsTrigger value="all" data-testid="tab-trigger-all">
                All Tools
              </TabsTrigger>
              <TabsTrigger value="favorites" data-testid="tab-trigger-favorites">
                Favorites
              </TabsTrigger>
              <TabsTrigger value="recent" data-testid="tab-trigger-recent">
                Recent
              </TabsTrigger>
              <TabsTrigger value="convert-to-pdf" data-testid="tab-trigger-convert-to-pdf">
                To PDF
              </TabsTrigger>
              <TabsTrigger value="convert-from-pdf" data-testid="tab-trigger-convert-from-pdf">
                From PDF
              </TabsTrigger>
              <TabsTrigger value="organize-pdf" data-testid="tab-trigger-organize-pdf">
                Organize
              </TabsTrigger>
              <TabsTrigger value="edit-pdf" data-testid="tab-trigger-edit-pdf">
                Edit
              </TabsTrigger>
              <TabsTrigger value="convert-images" data-testid="tab-trigger-convert-images">
                Images
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-8" data-testid={`tab-content-${activeTab}`}>
            {filteredTools.length === 0 ? (
              <div className="text-center py-16" data-testid="empty-state">
                <p className="text-muted-foreground text-lg" data-testid="text-empty-message">
                  {activeTab === "favorites"
                    ? "No favorite tools yet. Click the star icon on any tool to add it to favorites."
                    : activeTab === "recent"
                    ? "No recently used tools. Start using a tool to see it here."
                    : "No tools found matching your search."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="tools-grid">
                {filteredTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onFavoriteChange={handleFavoriteChange}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
