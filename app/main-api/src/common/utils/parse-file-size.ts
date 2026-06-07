export function parseFileSize(input?: string | number): number {
  if (!input && input !== 0) return 0;
  const raw = String(input).trim();

  if (/^\d+$/.test(raw)) return Number(raw);

  const m = raw.toLowerCase().match(/^([0-9]+)\s*(b|kb|kib|mb|mib|gb|gib)?$/);
  if (!m) return 0;

  const n = Number(m[1]);
  const unit = m[2] || 'b';
  switch (unit) {
    case 'b':
      return n;
    case 'kb':
    case 'kib':
      return n * 1024;
    case 'mb':
    case 'mib':
      return n * 1024 * 1024;
    case 'gb':
    case 'gib':
      return n * 1024 * 1024 * 1024;
    default:
      return n;
  }
}
