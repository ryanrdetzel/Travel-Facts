/**
 * Ray-casting point-in-polygon algorithm.
 * Determines if a point [lng, lat] is inside a polygon ring.
 */
export function pointInRing(point: [number, number], ring: [number, number][]): boolean {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];

    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * Check if a point is inside a polygon (array of rings).
 * First ring is the outer boundary, subsequent rings are holes.
 */
export function pointInPolygon(point: [number, number], polygon: [number, number][][]): boolean {
  if (polygon.length === 0) return false;

  // Must be inside the outer ring
  if (!pointInRing(point, polygon[0])) return false;

  // Must not be inside any hole
  for (let i = 1; i < polygon.length; i++) {
    if (pointInRing(point, polygon[i])) return false;
  }

  return true;
}
