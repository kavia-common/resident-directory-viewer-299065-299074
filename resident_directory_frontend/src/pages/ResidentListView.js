import React, { useMemo, useState } from 'react';
import residentsData from '../data/residents.json';
import SearchBar from '../components/SearchBar';
import ResidentList from '../components/ResidentList';

/**
 * PUBLIC_INTERFACE
 * ResidentListView page displays heading, search input, and a list of residents filtered by name.
 */
function ResidentListView() {
  const [query, setQuery] = useState('');

  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedQuery) return residentsData;
    return residentsData.filter((r) =>
      r.name.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  return (
    <div>
      <div className="toolbar">
        <h2 style={{ margin: 0 }}>Residents</h2>
        {/* theme toggle could be added here if needed */}
      </div>
      <SearchBar value={query} onChange={setQuery} />
      <div style={{ height: 12 }} />
      <ResidentList residents={results} />
    </div>
  );
}

export default ResidentListView;
