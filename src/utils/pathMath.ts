import type { Point } from "../types";

export function getPathLength(pts: Point[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x,
      dy = pts[i].y - pts[i - 1].y;
    len += Math.sqrt(dx * dx + dy * dy);
  }
  return len;
}

export function getPointAtProgress(pts: Point[], progress: number): Point {
  const total = getPathLength(pts);
  const target = total * Math.min(1, Math.max(0, progress));
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x,
      dy = pts[i].y - pts[i - 1].y;
    const seg = Math.sqrt(dx * dx + dy * dy);
    if (acc + seg >= target) {
      const t = (target - acc) / seg;
      return { x: pts[i - 1].x + dx * t, y: pts[i - 1].y + dy * t };
    }
    acc += seg;
  }
  return pts[pts.length - 1];
}

export function getTangentAtProgress(pts: Point[], progress: number): number {
  const total = getPathLength(pts);
  const target = total * Math.min(0.999, Math.max(0, progress));
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x,
      dy = pts[i].y - pts[i - 1].y;
    const seg = Math.sqrt(dx * dx + dy * dy);
    if (acc + seg >= target) return Math.atan2(dy, dx);
    acc += seg;
  }
  const last = pts[pts.length - 1],
    prev = pts[pts.length - 2];
  return Math.atan2(last.y - prev.y, last.x - prev.x);
}

export function getProgressAlongPath(
  pts: Point[],
  px: number,
  py: number,
): { progress: number; dist: number } {
  const total = getPathLength(pts);
  let bestDist = Infinity,
    bestProg = 0,
    acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const ax = pts[i - 1].x,
      ay = pts[i - 1].y;
    const bx = pts[i].x,
      by = pts[i].y;
    const dx = bx - ax,
      dy = by - ay;
    const seg = Math.sqrt(dx * dx + dy * dy);
    const t = seg === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (seg * seg)));
    const cx = ax + t * dx,
      cy = ay + t * dy;
    const dist = Math.sqrt((px - cx) ** 2 + (py - cy) ** 2);
    if (dist < bestDist) {
      bestDist = dist;
      bestProg = (acc + t * seg) / total;
    }
    acc += seg;
  }
  return { progress: bestProg, dist: bestDist };
}

export function scalePoints(pts: Point[], sx: number, sy: number, ox = 0, oy = 0): Point[] {
  return pts.map((p) => ({ x: p.x * sx + ox, y: p.y * sy + oy }));
}

// Catmull-Rom spline: densify sparse points into smooth curve samples
export function smoothPoints(pts: Point[], samplesPerSegment = 18): Point[] {
  if (pts.length < 3) return pts;
  const result = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let j = 0; j < samplesPerSegment; j++) {
      const t = j / samplesPerSegment;
      const t2 = t * t,
        t3 = t2 * t;
      result.push({
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  result.push(pts[pts.length - 1]);
  return result;
}
