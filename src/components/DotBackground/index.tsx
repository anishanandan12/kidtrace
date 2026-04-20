import styles from "./index.module.css";

const BG_DOTS = [
  { x: 8, y: 14, r: 24, light: false },
  { x: 22, y: 68, r: 16, light: false },
  { x: 76, y: 7, r: 34, light: false },
  { x: 88, y: 22, r: 13, light: false },
  { x: 93, y: 74, r: 30, light: false },
  { x: 62, y: 90, r: 20, light: false },
  { x: 38, y: 8, r: 9, light: false },
  { x: 4, y: 82, r: 22, light: false },
  { x: 73, y: 58, r: 11, light: false },
  { x: 48, y: 96, r: 16, light: false },
  { x: 18, y: 44, r: 28, light: false },
  { x: 16, y: 32, r: 15, light: true },
  { x: 82, y: 40, r: 11, light: true },
  { x: 96, y: 88, r: 20, light: true },
  { x: 55, y: 4, r: 11, light: true },
  { x: 30, y: 88, r: 24, light: true },
  { x: 71, y: 75, r: 9, light: true },
  { x: 12, y: 95, r: 13, light: true },
  { x: 44, y: 18, r: 8, light: true },
];

export default function DotBackground() {
  return (
    <>
      {BG_DOTS.map((d, i) => (
        <div
          key={i}
          className={`${styles.bgDot} ${d.light ? styles.bgDotLight : styles.bgDotDark}`}
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.r * 2, height: d.r * 2 }}
        />
      ))}
    </>
  );
}
