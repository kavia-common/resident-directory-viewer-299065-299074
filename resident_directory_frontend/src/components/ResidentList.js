import React from 'react';
import ResidentCard from './ResidentCard';

/**
 * PUBLIC_INTERFACE
 * ResidentList renders a grid of ResidentCard items, with an empty state.
 * Props: residents: Array
 */
function ResidentList({ residents }) {
  if (!residents || residents.length === 0) {
    return (
      <div role="status" className="empty" aria-live="polite">
        No residents found. Try a different name.
      </div>
    );
  }

  return (
    <section className="resident-grid" aria-label="Resident results">
      {residents.map((r) => (
        <ResidentCard key={r.id} resident={r} />
      ))}
    </section>
  );
}

export default ResidentList;
