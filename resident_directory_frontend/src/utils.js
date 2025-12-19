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

/**
 * PUBLIC_INTERFACE
 * Build a deterministic placeholder avatar URL using Dicebear Initials.
 * Prefer using a provided seed (id or name). SVG is used for crispness and small size.
 * @param {string} seed
 * @param {string} name - used for initials
 * @returns {string}
 */
export function buildPlaceholderAvatar(seed, name) {
  const initials = encodeURIComponent(initialsFromName(name || seed || 'R D'));
  const safeSeed = encodeURIComponent(String(seed || name || 'resident'));
  // Using Dicebear v7 initials collection
  return `https://api.dicebear.com/7.x/initials/svg?seed=${safeSeed}&backgroundType=gradientLinear&fontFamily=Helvetica&fontWeight=700&initials=${initials}`;
}

/**
 * PUBLIC_INTERFACE
 * Return a local avatar asset path if present for a given id/slug, else null.
 * This assumes optional assets placed under src/assets/avatars with names:
 * - avatar-<id>.svg
 * - avatar-<slug>.svg
 * Note: In CRA, importing statics via require ensures they are bundled.
 * @param {string} id
 * @param {string} slug
 * @returns {string|null}
 */
export function getLocalAvatarAsset(id, slug) {
  try {
    if (id) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      return require(`./assets/avatars/avatar-${id}.svg`);
    }
  } catch {}
  try {
    if (slug) {
      // eslint-disable-next-line import/no-dynamic-require, global-require
      return require(`./assets/avatars/avatar-${slug}.svg`);
    }
  } catch {}
  return null;
}

/**
 * PUBLIC_INTERFACE
 * Compute the appropriate avatar URL for a resident.
 * Order of preference:
 * 1. resident.image or resident.avatar if non-empty
 * 2. local asset by id/slug (avatar-<id>.svg or avatar-<slug>.svg)
 * 3. deterministic Dicebear placeholder (seeded by id or name)
 *
 * @param {{id:string,name:string,avatar?:string,image?:string,slug?:string}} resident
 * @returns {string}
 */
export function getResidentAvatarUrl(resident) {
  if (!resident) return '';
  const explicit = resident.image || resident.avatar;
  if (explicit && String(explicit).trim() !== '') return explicit;

  const slug = resident.slug || (resident.name ? resident.name.trim().toLowerCase().replace(/\s+/g, '-') : '');
  const local = getLocalAvatarAsset(resident.id, slug);
  if (local) return local;

  return buildPlaceholderAvatar(resident.id || slug || resident.name, resident.name);
}

/**
 * PUBLIC_INTERFACE
 * Generate accessible alt text for a resident avatar.
 * @param {string} name
 * @returns {string}
 */
export function avatarAltText(name) {
  const n = name && String(name).trim();
  return n ? `${n}'s avatar` : 'Resident avatar';
}
