 // PUBLIC_INTERFACE
 /**
  * Debounce function calls to limit the rate of execution.
  * @param {Function} fn - function to debounce
  * @param {number} delay - milliseconds to wait
  * @returns {Function}
  */
export function debounce(fn, delay = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

// PUBLIC_INTERFACE
/**
 * Generate initials from a full name, e.g. "Alice Johnson" -> "AJ".
 * @param {string} name
 */
export function initialsFromName(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts[parts.length - 1]?.[0] || '';
  return (first + (parts.length > 1 ? last : '')).toUpperCase();
}
