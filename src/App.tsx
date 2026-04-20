import { useState, lazy, Suspense } from "react";
import HomeScreen from "./pages/HomeScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import DotBackground from "./components/DotBackground";
import LoadingFallback from "./components/LoadingFallback";
import type { CategoryData, Data, StrokeItem } from "./types";

const TracingScreen = lazy(() => import("./pages/TracingScreen"));

const CATEGORY_LOADERS: Record<keyof Data, () => Promise<{ [k: string]: CategoryData }>> = {
  letters: () => import("./data/letters"),
  numbers: () => import("./data/numbers"),
  shapes: () => import("./data/shapes"),
};

type Screen = "home" | "loading" | "tracing";

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  async function selectCategory(cat: keyof Data) {
    setScreen("loading");
    try {
      const mod = await CATEGORY_LOADERS[cat]();
      const key = Object.keys(mod)[0] as keyof Data;
      const data = mod[key] as CategoryData;
      const keys = Object.keys(data);
      setCategoryData(data);
      setSelectedKey(keys[0]);
      setScreen("tracing");
    } catch {
      setScreen("home");
    }
  }

  function goHome() {
    setScreen("home");
    setCategoryData(null);
    setSelectedKey(null);
  }

  const items: Record<string, StrokeItem> = categoryData ?? {};
  const keys = Object.keys(items);
  const currentIndex = selectedKey ? keys.indexOf(selectedKey) : -1;
  const hasNext = currentIndex < keys.length - 1;
  const currentItem = selectedKey ? items[selectedKey] : undefined;

  function goNext() {
    if (hasNext) setSelectedKey(keys[currentIndex + 1]);
  }

  let content = null;

  if (screen === "home") {
    content = <HomeScreen onSelect={selectCategory} />;
  } else if (screen === "loading") {
    content = <LoadingFallback />;
  } else if (screen === "tracing" && selectedKey && currentItem) {
    content = (
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <TracingScreen
            key={selectedKey}
            item={currentItem}
            onClose={goHome}
            onNext={goNext}
            hasNext={hasNext}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <>
      <DotBackground />
      {content}
    </>
  );
}

export default App;
