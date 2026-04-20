// Stroke data in a 0-100 coordinate space.
import type { CategoryData } from "../types";

export const LETTERS: CategoryData =
{
  A: {
    label: "A",
    ghost: "A",
    strokes: [
      {
        id: 0,
        points: [
          { x: 50, y: 5 },
          { x: 20, y: 95 },
        ],
        width: 12,
      }, // left leg
      {
        id: 1,
        points: [
          { x: 50, y: 5 },
          { x: 80, y: 95 },
        ],
        width: 12,
      }, // right leg
      {
        id: 2,
        points: [
          { x: 28, y: 58 },
          { x: 72, y: 58 },
        ],
        width: 12,
      }, // crossbar
    ],
  },
  B: {
    label: "B",
    ghost: "B",
    strokes: [
      {
        id: 0,
        points: [
          { x: 25, y: 5 },
          { x: 25, y: 95 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 25, y: 5 },
          { x: 60, y: 5 },
          { x: 75, y: 15 },
          { x: 75, y: 45 },
          { x: 60, y: 50 },
          { x: 25, y: 50 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 25, y: 50 },
          { x: 65, y: 50 },
          { x: 80, y: 62 },
          { x: 80, y: 83 },
          { x: 65, y: 95 },
          { x: 25, y: 95 },
        ],
        width: 12,
      },
    ],
  },
  C: {
    label: "C",
    ghost: "C",
    strokes: [
      {
        id: 0,
        points: [
          { x: 80, y: 20 },
          { x: 65, y: 8 },
          { x: 50, y: 5 },
          { x: 30, y: 10 },
          { x: 15, y: 30 },
          { x: 12, y: 50 },
          { x: 15, y: 70 },
          { x: 30, y: 88 },
          { x: 50, y: 95 },
          { x: 65, y: 92 },
          { x: 80, y: 80 },
        ],
        width: 12,
      },
    ],
  },
  D: {
    label: "D",
    ghost: "D",
    strokes: [
      {
        id: 0,
        points: [
          { x: 25, y: 5 },
          { x: 25, y: 95 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 25, y: 5 },
          { x: 55, y: 5 },
          { x: 80, y: 20 },
          { x: 85, y: 50 },
          { x: 80, y: 80 },
          { x: 55, y: 95 },
          { x: 25, y: 95 },
        ],
        width: 12,
      },
    ],
  },
  E: {
    label: "E",
    ghost: "E",
    strokes: [
      {
        id: 0,
        points: [
          { x: 25, y: 5 },
          { x: 25, y: 95 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 25, y: 5 },
          { x: 75, y: 5 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 25, y: 50 },
          { x: 65, y: 50 },
        ],
        width: 12,
      },
      {
        id: 3,
        points: [
          { x: 25, y: 95 },
          { x: 75, y: 95 },
        ],
        width: 12,
      },
    ],
  },
  F: {
    label: "F",
    ghost: "F",
    strokes: [
      {
        id: 0,
        points: [
          { x: 25, y: 5 },
          { x: 25, y: 95 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 25, y: 5 },
          { x: 75, y: 5 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 25, y: 50 },
          { x: 65, y: 50 },
        ],
        width: 12,
      },
    ],
  },
  G: {
    label: "G",
    ghost: "G",
    strokes: [
      {
        id: 0,
        points: [
          { x: 80, y: 20 },
          { x: 65, y: 8 },
          { x: 50, y: 5 },
          { x: 30, y: 10 },
          { x: 15, y: 30 },
          { x: 12, y: 50 },
          { x: 15, y: 70 },
          { x: 30, y: 88 },
          { x: 50, y: 95 },
          { x: 70, y: 90 },
          { x: 83, y: 75 },
          { x: 83, y: 55 },
          { x: 60, y: 55 },
        ],
        width: 12,
      },
    ],
  },
  H: {
    label: "H",
    ghost: "H",
    strokes: [
      {
        id: 0,
        points: [
          { x: 20, y: 5 },
          { x: 20, y: 95 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 80, y: 5 },
          { x: 80, y: 95 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 20, y: 50 },
          { x: 80, y: 50 },
        ],
        width: 12,
      },
    ],
  },
  I: {
    label: "I",
    ghost: "I",
    strokes: [
      {
        id: 0,
        points: [
          { x: 50, y: 5 },
          { x: 50, y: 95 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 30, y: 5 },
          { x: 70, y: 5 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 30, y: 95 },
          { x: 70, y: 95 },
        ],
        width: 12,
      },
    ],
  },
  J: {
    label: "J",
    ghost: "J",
    strokes: [
      {
        id: 0,
        points: [
          { x: 65, y: 5 },
          { x: 65, y: 75 },
          { x: 55, y: 90 },
          { x: 40, y: 95 },
          { x: 25, y: 88 },
          { x: 20, y: 75 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 45, y: 5 },
          { x: 85, y: 5 },
        ],
        width: 12,
      },
    ],
  },
  K: {
    label: "K",
    ghost: "K",
    strokes: [
      {
        id: 0,
        points: [
          { x: 20, y: 5 },
          { x: 20, y: 95 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 80, y: 5 },
          { x: 20, y: 50 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 20, y: 50 },
          { x: 80, y: 95 },
        ],
        width: 12,
      },
    ],
  },
  L: {
    label: "L",
    ghost: "L",
    strokes: [
      {
        id: 0,
        points: [
          { x: 25, y: 5 },
          { x: 25, y: 95 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 25, y: 95 },
          { x: 75, y: 95 },
        ],
        width: 12,
      },
    ],
  },
  M: {
    label: "M",
    ghost: "M",
    strokes: [
      {
        id: 0,
        points: [
          { x: 15, y: 95 },
          { x: 15, y: 5 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 15, y: 5 },
          { x: 50, y: 55 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 50, y: 55 },
          { x: 85, y: 5 },
        ],
        width: 12,
      },
      {
        id: 3,
        points: [
          { x: 85, y: 5 },
          { x: 85, y: 95 },
        ],
        width: 12,
      },
    ],
  },
  N: {
    label: "N",
    ghost: "N",
    strokes: [
      {
        id: 0,
        points: [
          { x: 20, y: 95 },
          { x: 20, y: 5 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 20, y: 5 },
          { x: 80, y: 95 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 80, y: 95 },
          { x: 80, y: 5 },
        ],
        width: 12,
      },
    ],
  },
  O: {
    label: "O",
    ghost: "O",
    strokes: [
      {
        id: 0,
        points: [
          { x: 50, y: 5 },
          { x: 75, y: 10 },
          { x: 88, y: 30 },
          { x: 88, y: 50 },
          { x: 88, y: 70 },
          { x: 75, y: 90 },
          { x: 50, y: 95 },
          { x: 25, y: 90 },
          { x: 12, y: 70 },
          { x: 12, y: 50 },
          { x: 12, y: 30 },
          { x: 25, y: 10 },
          { x: 50, y: 5 },
        ],
        width: 12,
      },
    ],
  },
  P: {
    label: "P",
    ghost: "P",
    strokes: [
      {
        id: 0,
        points: [
          { x: 25, y: 5 },
          { x: 25, y: 95 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 25, y: 5 },
          { x: 60, y: 5 },
          { x: 75, y: 15 },
          { x: 75, y: 40 },
          { x: 60, y: 50 },
          { x: 25, y: 50 },
        ],
        width: 12,
      },
    ],
  },
  Q: {
    label: "Q",
    ghost: "Q",
    strokes: [
      {
        id: 0,
        points: [
          { x: 50, y: 5 },
          { x: 75, y: 10 },
          { x: 88, y: 30 },
          { x: 88, y: 50 },
          { x: 88, y: 70 },
          { x: 75, y: 90 },
          { x: 50, y: 95 },
          { x: 25, y: 90 },
          { x: 12, y: 70 },
          { x: 12, y: 50 },
          { x: 12, y: 30 },
          { x: 25, y: 10 },
          { x: 50, y: 5 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 65, y: 70 },
          { x: 85, y: 90 },
        ],
        width: 12,
      },
    ],
  },
  R: {
    label: "R",
    ghost: "R",
    strokes: [
      {
        id: 0,
        points: [
          { x: 25, y: 5 },
          { x: 25, y: 95 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 25, y: 5 },
          { x: 60, y: 5 },
          { x: 75, y: 15 },
          { x: 75, y: 40 },
          { x: 60, y: 50 },
          { x: 25, y: 50 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 45, y: 50 },
          { x: 80, y: 95 },
        ],
        width: 12,
      },
    ],
  },
  S: {
    label: "S",
    ghost: "S",
    strokes: [
      {
        id: 0,
        points: [
          { x: 80, y: 15 },
          { x: 65, y: 5 },
          { x: 45, y: 5 },
          { x: 25, y: 15 },
          { x: 20, y: 30 },
          { x: 30, y: 45 },
          { x: 50, y: 50 },
          { x: 70, y: 55 },
          { x: 80, y: 70 },
          { x: 75, y: 85 },
          { x: 55, y: 95 },
          { x: 35, y: 95 },
          { x: 20, y: 85 },
        ],
        width: 12,
      },
    ],
  },
  T: {
    label: "T",
    ghost: "T",
    strokes: [
      {
        id: 0,
        points: [
          { x: 15, y: 5 },
          { x: 85, y: 5 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 50, y: 5 },
          { x: 50, y: 95 },
        ],
        width: 12,
      },
    ],
  },
  U: {
    label: "U",
    ghost: "U",
    strokes: [
      {
        id: 0,
        points: [
          { x: 20, y: 5 },
          { x: 20, y: 70 },
          { x: 25, y: 85 },
          { x: 40, y: 95 },
          { x: 50, y: 95 },
          { x: 60, y: 95 },
          { x: 75, y: 85 },
          { x: 80, y: 70 },
          { x: 80, y: 5 },
        ],
        width: 12,
      },
    ],
  },
  V: {
    label: "V",
    ghost: "V",
    strokes: [
      {
        id: 0,
        points: [
          { x: 15, y: 5 },
          { x: 50, y: 95 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 50, y: 95 },
          { x: 85, y: 5 },
        ],
        width: 12,
      },
    ],
  },
  W: {
    label: "W",
    ghost: "W",
    strokes: [
      {
        id: 0,
        points: [
          { x: 10, y: 5 },
          { x: 25, y: 95 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 25, y: 95 },
          { x: 50, y: 45 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 50, y: 45 },
          { x: 75, y: 95 },
        ],
        width: 12,
      },
      {
        id: 3,
        points: [
          { x: 75, y: 95 },
          { x: 90, y: 5 },
        ],
        width: 12,
      },
    ],
  },
  X: {
    label: "X",
    ghost: "X",
    strokes: [
      {
        id: 0,
        points: [
          { x: 15, y: 5 },
          { x: 85, y: 95 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 85, y: 5 },
          { x: 15, y: 95 },
        ],
        width: 12,
      },
    ],
  },
  Y: {
    label: "Y",
    ghost: "Y",
    strokes: [
      {
        id: 0,
        points: [
          { x: 15, y: 5 },
          { x: 50, y: 50 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 85, y: 5 },
          { x: 50, y: 50 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 50, y: 50 },
          { x: 50, y: 95 },
        ],
        width: 12,
      },
    ],
  },
  Z: {
    label: "Z",
    ghost: "Z",
    strokes: [
      {
        id: 0,
        points: [
          { x: 15, y: 5 },
          { x: 85, y: 5 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 85, y: 5 },
          { x: 15, y: 95 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 15, y: 95 },
          { x: 85, y: 95 },
        ],
        width: 12,
      },
    ],
  },
};
