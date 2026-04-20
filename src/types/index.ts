export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: number;
  points: Point[];
  width: number;
  smooth?: boolean;
}

export interface StrokeItem {
  label: string;
  ghost: string;
  strokes: Stroke[];
}

export interface CategoryData {
  [key: string]: StrokeItem;
}

export interface LetterWord {
  word: string;
  emoji: string;
}

export interface Data {
  letters: Record<string, StrokeItem>;
  numbers: Record<string, StrokeItem>;
  shapes: Record<string, StrokeItem>;
}

declare module "*.css";
