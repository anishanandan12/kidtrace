import { useEffect, useState, useCallback, useRef, memo } from "react";
import type { StrokeItem, Stroke, Point } from "../../types";
import {
  getPointAtProgress,
  getTangentAtProgress,
  getProgressAlongPath,
  scalePoints,
  smoothPoints,
} from "../../utils/pathMath";
import { drawPill, drawDirectionDots, drawChevron, drawTraceTip } from "../../utils/canvasDraw";

const ORANGE = "#F5A623";
const GUIDE_COLOR = "rgba(0,0,0,0.22)";
const COMPLETION_THRESHOLD = 0.85;
const MAX_CANVAS_DPR = 2;

interface Props {
  item: StrokeItem;
  onComplete: () => void;
  onTraceStart?: () => void;
}

function TracingCanvas({ item, onComplete, onTraceStart }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastItemRef = useRef<StrokeItem | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const [currentStroke, setCurrentStroke] = useState<number>(0);
  const [completedStrokes, setCompletedStrokes] = useState<number[]>([]);
  const [tracingProgress, setTracingProgress] = useState<number>(0);
  const [isTracing, setIsTracing] = useState<boolean>(false);
  const [showCheck, setShowCheck] = useState<boolean>(false);
  const [allDone, setAllDone] = useState<boolean>(false);

  useEffect(() => {
    if (lastItemRef.current !== item) {
      lastItemRef.current = item;
      setCurrentStroke(0);
      setCompletedStrokes([]);
      setTracingProgress(0);
      setIsTracing(false);
      setShowCheck(false);
      setAllDone(false);
      activePointerIdRef.current = null;
    }
  }, [item]);

  const getScale = useCallback(() => {
    if (!canvasRef.current) return { sx: 1, sy: 1, ox: 0, oy: 0 };
    const c = canvasRef.current;
    const pad = Math.min(c.width, c.height) * 0.08;
    return {
      sx: (c.width - 2 * pad) / 100,
      sy: (c.height - 2 * pad) / 100,
      ox: pad,
      oy: pad,
    };
  }, []);

  const draw = useCallback(
    (cs: number, done: number[], prog: number, check: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { sx, sy, ox, oy } = getScale();
      const W = canvas.width,
        H = canvas.height;
      const strokeW = Math.min(W, H) * 0.13;
      const strokes = item.strokes;

      ctx.clearRect(0, 0, W, H);

      const getpts = (stroke: Stroke): Point[] => {
        const scaled = scalePoints(stroke.points, sx, sy, ox, oy);
        return stroke.smooth === false ? scaled : smoothPoints(scaled);
      };

      done.forEach((i: number) => {
        const pts = getpts(strokes[i]);
        drawPill(ctx, pts, strokeW, ORANGE, 1);
      });

      if (cs < strokes.length && !check) {
        const pts = getpts(strokes[cs]);

        drawPill(ctx, pts, strokeW, GUIDE_COLOR, 1);
        drawDirectionDots(ctx, pts, strokeW, prog);

        if (prog === 0) {
          const numChevrons = 3;
          for (let c = 0; c < numChevrons; c++) {
            const p = 0.15 + c * 0.28;
            const pt = getPointAtProgress(pts, p);
            const angle = getTangentAtProgress(pts, p);
            drawChevron(ctx, pt.x, pt.y, angle, strokeW);
          }
        }

        if (prog > 0) {
          drawPill(ctx, pts, strokeW, ORANGE, prog);
        }

        if (prog === 0) {
          drawTraceTip(ctx, pts[0].x, pts[0].y, getTangentAtProgress(pts, 0), strokeW);
        }

        if (prog > 0.02 && prog < 0.99) {
          const tip = getPointAtProgress(pts, prog);
          drawTraceTip(ctx, tip.x, tip.y, getTangentAtProgress(pts, prog), strokeW);
        }
      }
    },
    [item, getScale],
  );

  useEffect(() => {
    draw(currentStroke, completedStrokes, tracingProgress, showCheck);
  }, [draw, currentStroke, completedStrokes, tracingProgress, showCheck]);

  const canvasPos = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * canvas.width,
        y: ((e.clientY - rect.top) / rect.height) * canvas.height,
      };
    },
    [],
  );

  const handleStart = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (
        activePointerIdRef.current !== null ||
        allDone ||
        showCheck ||
        currentStroke >= item.strokes.length
      ) {
        return;
      }
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = canvasPos(e, canvas);
      const { sx, sy, ox, oy } = getScale();
      const stroke = item.strokes[currentStroke];
      const scaled = scalePoints(stroke.points, sx, sy, ox, oy);
      const pts = stroke.smooth === false ? scaled : smoothPoints(scaled);
      const startTol = Math.min(canvas.width, canvas.height) * 0.2;
      const d = Math.sqrt((pos.x - pts[0].x) ** 2 + (pos.y - pts[0].y) ** 2);
      if (d <= startTol) {
        onTraceStart?.();
        activePointerIdRef.current = e.pointerId;
        canvas.setPointerCapture(e.pointerId);
        setIsTracing(true);
        setTracingProgress(0.02);
      }
    },
    [item, canvasPos, getScale, allDone, showCheck, currentStroke, onTraceStart],
  );

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isTracing || activePointerIdRef.current !== e.pointerId) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = canvasPos(e, canvas);
      const { sx, sy, ox, oy } = getScale();
      const stroke = item.strokes[currentStroke];
      const scaled = scalePoints(stroke.points, sx, sy, ox, oy);
      const pts = stroke.smooth === false ? scaled : smoothPoints(scaled);
      const tol = Math.min(canvas.width, canvas.height) * 0.24;
      const { progress, dist } = getProgressAlongPath(pts, pos.x, pos.y);
      // Prevent jumping far ahead — handles closed-loop paths where start ≈ end
      if (dist <= tol && progress <= tracingProgress + 0.35) {
        setTracingProgress((prev) => Math.max(prev, progress));
      }
    },
    [item, canvasPos, getScale, isTracing, currentStroke, tracingProgress],
  );

  const handleEnd = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (activePointerIdRef.current !== e.pointerId) return;
      e.preventDefault();
      if (!isTracing) return;
      const canvas = e.currentTarget;
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
      activePointerIdRef.current = null;
      setIsTracing(false);

      if (tracingProgress >= COMPLETION_THRESHOLD) {
        const next = currentStroke + 1;
        const isLastStroke = next >= item.strokes.length;
        setCompletedStrokes([...completedStrokes, currentStroke]);
        setTracingProgress(0);

        if (isLastStroke) {
          setCurrentStroke(next);
          setAllDone(true);
          onComplete();
        } else {
          setCurrentStroke(next);
        }
      } else {
        setTracingProgress(0);
      }
    },
    [item, onComplete, isTracing, tracingProgress, currentStroke, completedStrokes],
  );

  const handleCancel = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    e.preventDefault();
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    activePointerIdRef.current = null;
    setIsTracing(false);
    setTracingProgress(0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let rafId = 0;

    const resize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DPR);
        const rect = canvas.getBoundingClientRect();
        const nextWidth = Math.max(1, Math.round(rect.width * dpr));
        const nextHeight = Math.max(1, Math.round(rect.height * dpr));

        if (canvas.width !== nextWidth) {
          canvas.width = nextWidth;
        }
        if (canvas.height !== nextHeight) {
          canvas.height = nextHeight;
        }

        draw(currentStroke, completedStrokes, tracingProgress, showCheck);
      });
    };

    const observedElement = canvas.parentElement ?? canvas;
    const resizeObserver = new ResizeObserver(resize);
    const visualViewport = window.visualViewport;

    resizeObserver.observe(observedElement);
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);
    visualViewport?.addEventListener("resize", resize);
    visualViewport?.addEventListener("scroll", resize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      visualViewport?.removeEventListener("resize", resize);
      visualViewport?.removeEventListener("scroll", resize);
      cancelAnimationFrame(rafId);
    };
  }, [draw, currentStroke, completedStrokes, tracingProgress, showCheck]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`Trace the ${item.label}. Use your finger or mouse to follow the path.`}
      tabIndex={0}
      style={{
        width: "100%",
        height: "100%",
        touchAction: "none",
        WebkitTouchCallout: "none",
        WebkitUserSelect: "none",
        display: "block",
        outline: "none",
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = "4px solid rgba(255,255,255,0.7)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = "none";
      }}
      onPointerDown={handleStart}
      onPointerMove={handleMove}
      onPointerUp={handleEnd}
      onPointerCancel={handleCancel}
      onLostPointerCapture={handleCancel}
    />
  );
}

export default memo(TracingCanvas);
