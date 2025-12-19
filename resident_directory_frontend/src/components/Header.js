import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Header provides app branding and a link back to the home page.
 */
function Header() {
  return (
    <header className="app-header" role="banner">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Resident Directory Home">
          <div className="brand-mark" aria-hidden="true" />
          <h1>Resident Directory</h1>
        </Link>
      </div>
    </header>
  );
}

export default Header;
