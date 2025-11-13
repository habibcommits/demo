# PDF Tools Suite - Design Guidelines

## Design Approach

**System Selected**: Material Design 3 with utility-first modifications

**Justification**: This is a productivity tool suite requiring clarity, efficiency, and familiar patterns. Material Design provides the structure needed for information-dense interfaces while maintaining modern aesthetics.

**Key Principles**:
- Function over form - every element serves a purpose
- Instant recognition - users should immediately understand each tool's function
- Efficiency - minimal steps from landing to completing a task
- Consistency - uniform patterns across all 50+ tools

---

## Typography

**Font Stack**: Inter (via Google Fonts CDN)
- **Headlines**: 600 weight, sizes from text-2xl to text-4xl
- **Tool Titles**: 500 weight, text-lg
- **Body Text**: 400 weight, text-base
- **Captions/Labels**: 400 weight, text-sm
- **Buttons**: 500 weight, text-sm

**Hierarchy Rules**:
- Page titles: text-3xl to text-4xl, font-semibold
- Section headers: text-xl, font-medium  
- Tool cards: text-lg, font-medium for title; text-sm for description
- Interface labels: text-sm, font-normal

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16**
- Component padding: p-4, p-6
- Section spacing: py-12, py-16
- Card gaps: gap-4, gap-6
- Margins: m-2, m-4, m-8

**Grid Systems**:
- Tool grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`
- Container: `max-w-7xl mx-auto px-4`
- Tool workspace: `max-w-4xl mx-auto`

---

## Component Library

### Navigation
- **Top Bar**: Fixed header with logo, search bar (central), favorites counter
- **Breadcrumbs**: On tool pages showing Home > Category > Tool
- **Tab Navigation**: For tool categories (Favorites, Recent, All Tools, Convert to PDF, etc.)

### Tool Cards
- **Structure**: Icon (top), Title, Brief description, "Use Tool" CTA
- **Dimensions**: Consistent height, aspect ratio 4:3
- **States**: Default, hover (subtle lift with shadow-lg), active

### Tool Workspace
- **File Upload Zone**: Large drag-drop area with dashed border, prominent icon, clear instructions
- **File List**: Compact list showing filename, size, remove button
- **Action Panel**: Sticky bottom bar with primary action button (e.g., "Merge PDFs", "Convert")
- **Progress Indicators**: Linear progress bar during processing
- **Result Display**: Preview area with download button

### Buttons
- **Primary**: Solid fill, px-6 py-3, rounded-lg, font-medium
- **Secondary**: Border style, same padding
- **Icon Buttons**: p-2, rounded-md for utility actions

### Forms & Inputs
- **File Input**: Hidden, triggered by styled button or drop zone
- **Text Inputs**: border, rounded-lg, px-4 py-2, focus ring
- **Checkboxes/Options**: For tool settings (quality, page range, etc.)

---

## Page Structures

### Homepage
1. **Hero Section**: 
   - Centered headline: "All PDF Tools in One Place"
   - Subheading: "Fast, secure, client-side processing. No login required."
   - Prominent search bar
   - NO hero image - focus on tool grid below

2. **Tool Grid Section**:
   - Category tabs at top
   - 3-4 column responsive grid of tool cards
   - Each card: icon, title, 1-line description
   - "Recently Used" and "Favorites" sections if applicable

3. **Footer**: Links to all tools, privacy info, simple/minimal

### Individual Tool Pages
1. **Header**: Tool name, back button, breadcrumb
2. **Instructions Panel**: Brief how-to (collapsible on mobile)
3. **Upload Zone**: Primary interaction area - large, centered
4. **Options Panel**: Tool-specific settings (appears after file upload)
5. **Action Bar**: Fixed bottom with primary CTA
6. **Output Area**: Results preview with download option

---

## Visual Specifications

**Borders**: 1px solid, rounded corners (rounded-lg for cards, rounded-md for inputs)
**Shadows**: shadow-sm for cards at rest, shadow-lg on hover, shadow-xl for modals
**Transitions**: transition-all duration-200 for interactive elements
**Icons**: Heroicons via CDN, consistent 24px size for tool cards, 20px for UI elements

---

## Critical Implementation Notes

- **No Authentication UI**: Skip login/signup flows entirely
- **Local Storage**: Visual indicator showing "Your files never leave your browser"
- **Tool Categories**: Implement filtering/tabs matching PDF24 structure
- **Responsive Priority**: Mobile-first, tool cards stack to single column
- **Performance**: Lazy load tool grid, code-split individual tool pages
- **Accessibility**: ARIA labels for all tools, keyboard navigation for grid

---

## Images

**NO hero images** - This is a utility application where users want immediate access to tools.

**Tool Icons**: Use Heroicons for all tool representations (document icons, arrow icons, etc.) - no custom illustrations needed. Each tool card gets a relevant icon in a subtle background circle.