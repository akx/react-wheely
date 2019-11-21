export function angleDifference(angle1, angle2) {
  const diff = ((angle2 - angle1 + 180) % 360) - 180;
  return diff < -180 ? diff + 360 : diff;
}

export const RAD_TO_DEG = 57.2958;

export function limitValue(initial, delta, snap, min, max) {
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
