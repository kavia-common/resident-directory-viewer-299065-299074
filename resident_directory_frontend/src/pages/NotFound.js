import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * NotFound presents a simple 404 message and a back link.
 */
function NotFound() {
  return (
    <div className="empty">
      <h2 style={{ marginTop: 0 }}>404 - Not Found</h2>
      <p>We couldn't find that page.</p>
      <Link className="back-link" to="/">← Back to list</Link>
    </div>
  );
}

export default NotFound;
