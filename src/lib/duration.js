const UNITS = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000, w: 604_800_000 };

// Parses strings like "30s", "10m", "1h30m" or "2d" into milliseconds. Returns null if invalid.
function parseDuration(input) {
  const text = input.trim().toLowerCase().replace(/\s+/g, '');
  if (!/^(\d+[smhdw])+$/.test(text)) return null;
  let total = 0;
  for (const [, amount, unit] of text.matchAll(/(\d+)([smhdw])/g)) total += Number(amount) * UNITS[unit];
  return total > 0 ? total : null;
}

function formatDuration(ms) {
  const parts = [];
  for (const [unit, size] of [['d', 86_400_000], ['h', 3_600_000], ['m', 60_000], ['s', 1_000]]) {
    const amount = Math.floor(ms / size);
    if (amount) parts.push(`${amount}${unit}`);
    ms -= amount * size;
  }
  return parts.join(' ') || '0s';
}

module.exports = { parseDuration, formatDuration };
