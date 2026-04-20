# KidTrace

A fun and educational tracing app for kids to learn alphabets, numbers, and shapes through interactive drawing.

## Features

- **Tracing Practice** — Interactive canvas for tracing letters, numbers, and shapes
- **Audio Feedback** — Voice praise and word pronunciation via Web Speech API
- **Celebration Overlay** — Animated reward screen after each successful trace
- **Responsive Design** — Works across desktop, tablet, and mobile
- **Accessible** — ARIA labels, keyboard navigation, focus management, and screen-reader support

## Tech Stack

- **React 19** with TypeScript (`strict` mode)
- **Vite** — build tool with per-category code splitting
- **CSS Modules** + design tokens (`src/styles/tokens.css`)
- **ESLint** (typescript-eslint, react-hooks, jsx-a11y) + **Prettier**

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
git clone https://github.com/anishanandan12/kidtrace.git
cd kidtrace
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Script                 | Description                         |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start development server            |
| `npm run build`        | Type-check and build for production |
| `npm run preview`      | Preview the production build        |
| `npm run lint`         | Run ESLint                          |
| `npm run format`       | Format source files with Prettier   |
| `npm run format:check` | Check formatting without writing    |
| `npm run type-check`   | Run `tsc --noEmit` standalone       |

## Project Structure

```
src/
├── components/
│   ├── ErrorBoundary/   # Catches lazy-load and render errors
│   └── TracingCanvas/   # Canvas tracing engine
├── pages/
│   ├── HomeScreen/      # Category selection screen
│   └── TracingScreen/   # Active tracing screen + celebration overlay
├── data/                # Per-category stroke data (lazy-loaded)
│   ├── letters.ts       # A–Z stroke definitions
│   ├── numbers.ts       # 0–9 stroke definitions
│   └── shapes.ts        # Circle, square, triangle, etc.
├── styles/
│   └── tokens.css       # Global CSS custom property design tokens
├── types/               # Shared TypeScript interfaces
├── App.tsx              # Root component — routing + data loading
├── main.tsx             # Entry point
└── index.css            # Global reset + token import
```

## Stroke Data Format

All stroke coordinates live in a **0–100 normalised space** (think of it as a 100×100 unit grid). The canvas scales these to physical pixels at render time using the canvas's actual `width`/`height` and a padding factor. This keeps stroke definitions resolution-independent.

Each item in a category file follows this shape:

```ts
{
  label: string;   // display label, e.g. "A"
  ghost: string;   // background ghost character
  strokes: {
    id: number;
    points: { x: number; y: number }[];  // in 0–100 space
    width: number;                        // stroke thickness (0–100 units)
    smooth?: boolean;                     // false = no Catmull-Rom smoothing
  }[];
}
```

## License

MIT
