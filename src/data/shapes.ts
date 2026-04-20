// Stroke data in a 0-100 coordinate space.
import type { CategoryData } from "../types";

export const SHAPES: CategoryData =
{
  circle: {
    label: "Circle",
    ghost: "circle",
    strokes: [
      {
        id: 0,
        points: [
          { x: 50, y: 5 },
          { x: 75, y: 12 },
          { x: 90, y: 30 },
          { x: 95, y: 50 },
          { x: 90, y: 70 },
          { x: 75, y: 88 },
          { x: 50, y: 95 },
          { x: 25, y: 88 },
          { x: 10, y: 70 },
          { x: 5, y: 50 },
          { x: 10, y: 30 },
          { x: 25, y: 12 },
          { x: 50, y: 5 },
        ],
        width: 12,
      },
    ],
  },
  square: {
    label: "Square",
    ghost: "square",
    strokes: [
      {
        id: 0,
        points: [
          { x: 10, y: 10 },
          { x: 90, y: 10 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 90, y: 10 },
          { x: 90, y: 90 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 90, y: 90 },
          { x: 10, y: 90 },
        ],
        width: 12,
      },
      {
        id: 3,
        points: [
          { x: 10, y: 90 },
          { x: 10, y: 10 },
        ],
        width: 12,
      },
    ],
  },
  triangle: {
    label: "Triangle",
    ghost: "triangle",
    strokes: [
      {
        id: 0,
        points: [
          { x: 50, y: 5 },
          { x: 90, y: 90 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 90, y: 90 },
          { x: 10, y: 90 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 10, y: 90 },
          { x: 50, y: 5 },
        ],
        width: 12,
      },
    ],
  },
  star: {
    label: "Star",
    ghost: "star",
    strokes: [
      {
        id: 0,
        points: [
          { x: 50, y: 5 },
          { x: 62, y: 38 },
          { x: 95, y: 38 },
          { x: 68, y: 58 },
          { x: 79, y: 92 },
          { x: 50, y: 72 },
          { x: 21, y: 92 },
          { x: 32, y: 58 },
          { x: 5, y: 38 },
          { x: 38, y: 38 },
          { x: 50, y: 5 },
        ],
        width: 12,
        smooth: false,
      },
    ],
  },
  rectangle: {
    label: "Rectangle",
    ghost: "rectangle",
    strokes: [
      {
        id: 0,
        points: [
          { x: 5, y: 20 },
          { x: 95, y: 20 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 95, y: 20 },
          { x: 95, y: 80 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 95, y: 80 },
          { x: 5, y: 80 },
        ],
        width: 12,
      },
      {
        id: 3,
        points: [
          { x: 5, y: 80 },
          { x: 5, y: 20 },
        ],
        width: 12,
      },
    ],
  },
  diamond: {
    label: "Diamond",
    ghost: "diamond",
    strokes: [
      {
        id: 0,
        points: [
          { x: 50, y: 5 },
          { x: 90, y: 50 },
        ],
        width: 12,
      },
      {
        id: 1,
        points: [
          { x: 90, y: 50 },
          { x: 50, y: 95 },
        ],
        width: 12,
      },
      {
        id: 2,
        points: [
          { x: 50, y: 95 },
          { x: 10, y: 50 },
        ],
        width: 12,
      },
      {
        id: 3,
        points: [
          { x: 10, y: 50 },
          { x: 50, y: 5 },
        ],
        width: 12,
      },
    ],
  },
};
