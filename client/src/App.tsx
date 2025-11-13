import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import MergePDFPage from "@/pages/tools/merge-pdf";
import SplitPDFPage from "@/pages/tools/split-pdf";
import CompressPDFPage from "@/pages/tools/compress-pdf";
import ImagesToPDFPage from "@/pages/tools/images-to-pdf";
import PDFToImagesPage from "@/pages/tools/pdf-to-images";
import RotatePDFPage from "@/pages/tools/rotate-pdf";
import AddWatermarkPage from "@/pages/tools/add-watermark";
import AddPageNumbersPage from "@/pages/tools/add-page-numbers";
import RemovePagesPage from "@/pages/tools/remove-pages";
import ExtractPagesPage from "@/pages/tools/extract-pages";
import RearrangePagesPage from "@/pages/tools/rearrange-pages";
import ProtectPDFPage from "@/pages/tools/protect-pdf";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      
      {/* PDF Tools */}
      <Route path="/tool/merge-pdf" component={MergePDFPage} />
      <Route path="/tool/split-pdf" component={SplitPDFPage} />
      <Route path="/tool/compress-pdf" component={CompressPDFPage} />
      <Route path="/tool/images-to-pdf" component={ImagesToPDFPage} />
      <Route path="/tool/pdf-to-images" component={PDFToImagesPage} />
      <Route path="/tool/rotate-pdf" component={RotatePDFPage} />
      <Route path="/tool/add-watermark" component={AddWatermarkPage} />
      <Route path="/tool/add-page-numbers" component={AddPageNumbersPage} />
      <Route path="/tool/remove-pages" component={RemovePagesPage} />
      <Route path="/tool/extract-pages" component={ExtractPagesPage} />
      <Route path="/tool/rearrange-pages" component={RearrangePagesPage} />
      <Route path="/tool/protect-pdf" component={ProtectPDFPage} />
      
      {/* Alias routes for similar tools */}
      <Route path="/tool/jpg-to-pdf" component={ImagesToPDFPage} />
      <Route path="/tool/png-to-pdf" component={ImagesToPDFPage} />
      <Route path="/tool/pdf-to-jpg" component={PDFToImagesPage} />
      <Route path="/tool/pdf-to-png" component={PDFToImagesPage} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
