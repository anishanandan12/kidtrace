import type { Point } from "../types";
import { getPathLength } from "./pathMath";

export function drawPill(
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  width: number,
  color: string,
  progress = 1,
): void {
  if (pts.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (progress >= 1) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  } else {
    const total = getPathLength(pts);
    const target = total * progress;
    let acc = 0;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const ax = pts[i - 1].x,
        ay = pts[i - 1].y;
      const bx = pts[i].x,
        by = pts[i].y;
      const dx = bx - ax,
        dy = by - ay;
      const seg = Math.sqrt(dx * dx + dy * dy);
      if (acc + seg >= target) {
        const t = (target - acc) / seg;
        ctx.lineTo(ax + dx * t, ay + dy * t);
        break;
      }
      ctx.lineTo(bx, by);
      acc += seg;
    }
    ctx.stroke();
  }
  ctx.restore();
}

export function drawDirectionDots(
  ctx: CanvasRenderingContext2D,
  pts: Point[],
  strokeW: number,
  fromProgress = 0,
): void {
  const total = getPathLength(pts);
  const dotR = strokeW * 0.09;
  const spacing = strokeW * 0.52;
  const startLen = total * fromProgress + spacing;
  let acc = 0,
    nextAt = startLen;

  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  for (let i = 1; i < pts.length; i++) {
    const ax = pts[i - 1].x,
      ay = pts[i - 1].y;
    const dx = pts[i].x - ax,
      dy = pts[i].y - ay;
    const seg = Math.sqrt(dx * dx + dy * dy);
    while (acc + seg >= nextAt && nextAt <= total) {
      const t = (nextAt - acc) / seg;
      ctx.beginPath();
      ctx.arc(ax + t * dx, ay + t * dy, dotR, 0, Math.PI * 2);
      ctx.fill();
      nextAt += spacing;
    }
    acc += seg;
  }
  ctx.restore();
}

export function drawTraceTip(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  strokeW: number,
): void {
  const tipR = strokeW * 0.55;
  const cv = tipR * 0.55;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, tipR, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "rgba(0,0,0,0.22)";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = "#4CAF50";
  ctx.lineWidth = strokeW * 0.1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-cv * 0.5, -cv * 0.7);
  ctx.lineTo(cv * 0.6, 0);
  ctx.lineTo(-cv * 0.5, cv * 0.7);
  ctx.stroke();
  ctx.restore();
}

export function drawChevron(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  strokeW: number,
): void {
  const r = strokeW * 0.28;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = "rgba(255,255,255,0.82)";
  ctx.lineWidth = strokeW * 0.1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(-r * 0.5, -r * 0.7);
  ctx.lineTo(r * 0.55, 0);
  ctx.lineTo(-r * 0.5, r * 0.7);
  ctx.stroke();
  ctx.restore();
}
