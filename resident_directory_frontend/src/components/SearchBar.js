import React, { useEffect, useMemo, useState } from 'react';
import { debounce } from '../utils';

/**
 * PUBLIC_INTERFACE
 * SearchBar provides an accessible, debounced input for filtering by name.
 * Props:
 * - value: current input value
 * - onChange: (value) => void, receives debounced updates
 */
function SearchBar({ value = '', onChange }) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedEmit = useMemo(() => debounce(onChange, 250), [onChange]);

  function handleChange(e) {
    const v = e.target.value;
    setLocalValue(v);
    debouncedEmit(v);
  }

  return (
    <div className="search-bar" role="search" aria-labelledby="search-label">
      <label id="search-label" htmlFor="resident-search" className="visually-hidden">
        Search residents by name
      </label>
      <input
        id="resident-search"
        type="search"
        placeholder="Search by name..."
        value={localValue}
        onChange={handleChange}
        aria-label="Search residents by name"
        aria-controls="results-region"
        aria-describedby="results-summary"
        autoComplete="off"
      />
    </div>
  );
}

export default SearchBar;
