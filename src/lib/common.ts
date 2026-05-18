export function isScreenSmall(w: number, h: number): boolean {
  if (w < 280 || h < 600) return true;
  return false;
}

export function isMobile(): boolean {
  const userAgent: string = navigator.userAgent.toLowerCase();
  return /iphone|ipod|android|windows phone/.test(userAgent);
}