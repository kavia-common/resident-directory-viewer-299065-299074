import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Header provides app branding and a link back to the home page.
 * It also exposes a theme toggle button to switch between light and dark modes.
 */
function Header() {
  const STORAGE_KEY = 'theme';
  const [theme, setTheme] = useState(() => {
    // Initial hydration-safe theme value (does not touch DOM yet)
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    // Fallback to system preference
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Apply theme to <html> and persist
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  // Respond to system changes only if user hasn't explicitly chosen before
  useEffect(() => {
    let saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch {}
    if (saved === 'light' || saved === 'dark') return;

    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (!mq || !mq.addEventListener) return;

    const handler = (e) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  function toggleTheme() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }

  const isDark = theme === 'dark';
  const icon = isDark ? '☀️' : '🌙';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

  return (
    <header className="app-header" role="banner">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Resident Directory Home">
          <div className="brand-mark" aria-hidden="true" />
          <h1>Resident Directory</h1>
        </Link>

        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-pressed={isDark}
          aria-label={label}
          title={label}
        >
          <span aria-hidden="true">{icon}</span>
          <span style={{ fontSize: 14 }}>
            {isDark ? 'Dark' : 'Light'}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
