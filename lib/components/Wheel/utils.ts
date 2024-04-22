export function angleDifference(angle1: number, angle2: number): number {
  const diff = ((angle2 - angle1 + 180) % 360) - 180;
  return diff < -180 ? diff + 360 : diff;
}

export const RAD_TO_DEG = 57.2958;

export function limitValue(
  initial: number,
  delta: number,
  snap?: number,
  min?: number,
  max?: number,
): number {
  let total = initial + delta;
  if (snap !== undefined && snap > 0) {
    total = Math.round(total / snap) * snap;
  }
  if (min !== undefined) {
    total = Math.max(min, total);
  }
  if (max !== undefined) {
    total = Math.min(max, total);
  }
  return total;
}
