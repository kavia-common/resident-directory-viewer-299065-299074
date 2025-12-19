import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import residentsData from '../data/residents.json';
import SearchBar from '../components/SearchBar';
import ResidentList from '../components/ResidentList';

/**
 * PUBLIC_INTERFACE
 * ResidentListView page displays heading, search input, and a list of residents filtered by name, unit, and tags,
 * with sorting controls. State is synchronized with URL query parameters.
 *
 * Query params:
 * - q: search by name (string)
 * - unit: unit filter (case-insensitive substring)
 * - tags: comma-separated list of tags; resident must include all selected tags
 * - sort: one of name_asc, name_desc, unit_asc, unit_desc (defaults to name_asc)
 */
function ResidentListView() {
  // Build tag options from data
  const allTags = useMemo(() => {
    const s = new Set();
    residentsData.forEach(r => (r.tags || []).forEach(t => s.add(t)));
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();

  // Parse state from URL on first render and when searchParams change externally
  const [query, setQuery] = useState(() => searchParams.get('q') || '');
  const [unitFilter, setUnitFilter] = useState(() => searchParams.get('unit') || '');
  const [selectedTags, setSelectedTags] = useState(() => {
    const t = searchParams.get('tags');
    return t ? t.split(',').filter(Boolean) : [];
  });
  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'name_asc');

  // Keep local state in sync if url changes (e.g., user pastes a URL)
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const unit = searchParams.get('unit') || '';
    const tags = searchParams.get('tags');
    const sort = searchParams.get('sort') || 'name_asc';
    setQuery(q);
    setUnitFilter(unit);
    setSelectedTags(tags ? tags.split(',').filter(Boolean) : []);
    setSortBy(sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // initialize once from URL

  // Whenever any state changes, push to URL (replace, not add history)
  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (unitFilter) params.unit = unitFilter;
    if (selectedTags.length) params.tags = selectedTags.join(',');
    if (sortBy && sortBy !== 'name_asc') params.sort = sortBy;
    setSearchParams(params, { replace: true });
  }, [query, unitFilter, selectedTags, sortBy, setSearchParams]);

  const normalizedQuery = query.trim().toLowerCase();
  const normalizedUnit = unitFilter.trim().toLowerCase();

  // Filtering + sorting via memoization for performance
  const results = useMemo(() => {
    let list = residentsData;

    // Search by name
    if (normalizedQuery) {
      list = list.filter((r) => r.name.toLowerCase().includes(normalizedQuery));
    }

    // Filter by unit (substring, case-insensitive)
    if (normalizedUnit) {
      list = list.filter((r) =>
        String(r.unit || '').toLowerCase().includes(normalizedUnit)
      );
    }

    // Filter by tags (resident must include all selected tags)
    if (selectedTags.length) {
      const needs = new Set(selectedTags);
      list = list.filter((r) => {
        const tags = new Set(r.tags || []);
        for (const t of needs) {
          if (!tags.has(t)) return false;
        }
        return true;
      });
    }

    // Sorting
    const compare = (a, b) => {
      switch (sortBy) {
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'unit_asc':
          return String(a.unit || '').localeCompare(String(b.unit || ''));
        case 'unit_desc':
          return String(b.unit || '').localeCompare(String(a.unit || ''));
        case 'name_asc':
        default:
          return a.name.localeCompare(b.name);
      }
    };
    return [...list].sort(compare);
  }, [normalizedQuery, normalizedUnit, selectedTags, sortBy]);

  // Handlers
  function handleTagToggle(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function clearAll() {
    setQuery('');
    setUnitFilter('');
    setSelectedTags([]);
    setSortBy('name_asc');
  }

  // Accessible labels and controls
  return (
    <div role="region" aria-labelledby="residents-heading">
      <div className="toolbar" style={{ alignItems: 'start' }}>
        <h2 id="residents-heading" style={{ margin: 0 }}>Residents</h2>
        <div role="group" aria-label="Sorting and filtering controls" style={{ display: 'grid', gap: 8 }}>
          {/* Sorting */}
          <div className="search-bar" style={{ padding: 6 }}>
            <label htmlFor="sort-select" style={{ marginRight: 8, color: 'var(--muted)' }}>
              Sort by
            </label>
            <select
              id="sort-select"
              aria-label="Sort residents"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: '8px 10px',
                background: 'var(--surface)',
                color: 'var(--text)',
              }}
            >
              <option value="name_asc">Name (A–Z)</option>
              <option value="name_desc">Name (Z–A)</option>
              <option value="unit_asc">Unit (asc)</option>
              <option value="unit_desc">Unit (desc)</option>
            </select>
          </div>

          {/* Unit filter */}
          <div className="search-bar">
            <label htmlFor="unit-filter" className="visually-hidden">Filter by unit</label>
            <input
              id="unit-filter"
              type="text"
              placeholder="Filter by unit (e.g., A-1)"
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              aria-label="Filter by unit"
              autoComplete="off"
              aria-describedby="results-summary"
              aria-controls="results-region"
            />
          </div>

          {/* Tag filters (checkboxes) */}
          <div
            className="search-bar"
            style={{ padding: 8, display: 'block' }}
            role="group"
            aria-label="Filter by tags"
          >
            <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 6 }}>
              Tags
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {allTags.map((tag) => {
                const id = `tag-${tag.replace(/\s+/g, '-').toLowerCase()}`;
                const checked = selectedTags.includes(tag);
                return (
                  <label
                    key={tag}
                    htmlFor={id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      border: '1px solid var(--border-color)',
                      padding: '6px 10px',
                      borderRadius: 999,
                      background: checked ? 'var(--chip-bg)' : 'var(--surface)',
                      color: checked ? 'var(--chip-text)' : 'var(--text)',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleTagToggle(tag)}
                      aria-label={`Filter by tag ${tag}`}
                      aria-describedby="results-summary"
                      style={{ accentColor: 'var(--color-secondary)' }}
                    />
                    <span>{tag}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Search input below heading/controls bar */}
      <SearchBar value={query} onChange={setQuery} />

      {/* Live region for results summary */}
      <p
        id="results-summary"
        role="status"
        aria-live="polite"
        style={{ marginTop: 12, marginBottom: 0, color: 'var(--muted)' }}
      >
        {results.length} {results.length === 1 ? 'result' : 'results'} found
        {query ? ` for “${query}”` : ''}{unitFilter ? ` in unit “${unitFilter}”` : ''}{selectedTags.length ? ` with tags: ${selectedTags.join(', ')}` : ''}.
      </p>

      {/* Active filters pills */}
      {(unitFilter || selectedTags.length > 0) && (
        <div className="tags" role="status" aria-live="polite" style={{ marginTop: 12 }}>
          {unitFilter ? <span className="tag">Unit: {unitFilter}</span> : null}
          {selectedTags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="tag"
            aria-label="Clear all filters"
            style={{
              background: 'var(--color-error)',
              color: 'var(--on-primary)',
              borderColor: 'transparent',
              cursor: 'pointer'
            }}
          >
            Clear all
          </button>
        </div>
      )}

      <div style={{ height: 12 }} />
      {/* Region wrapper for results to connect aria-controls */}
      <div id="results-region">
        <ResidentList residents={results} />
      </div>
    </div>
  );
}

export default ResidentListView;
