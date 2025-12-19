import React from 'react';
import { Link, useParams } from 'react-router-dom';
import residents from '../data/residents.json';
import { initialsFromName } from '../utils';

/**
 * PUBLIC_INTERFACE
 * ResidentDetail shows details for a single resident by id from route params.
 */
function ResidentDetail() {
  const { id } = useParams();
  const resident = residents.find((r) => r.id === id);

  if (!resident) {
    return (
      <div className="empty" role="status">
        Resident not found.
        <div>
          <Link className="back-link" to="/">← Back to list</Link>
        </div>
      </div>
    );
  }

  const initials = initialsFromName(resident.name);

  return (
    <article className="detail">
      <Link className="back-link" to="/">← Back to list</Link>
      <div className="detail-header">
        {resident.avatar ? (
          <img
            src={resident.avatar}
            className="detail-avatar"
            alt={`${resident.name}'s avatar`}
            width="72"
            height="72"
          />
        ) : (
          <div className="detail-avatar" aria-hidden="true">{initials}</div>
        )}
        <div>
          <h2>{resident.name}</h2>
          <div className="meta">Unit {resident.unit}</div>
        </div>
      </div>

      <div className="kv">
        <div className="kv-row">
          <div className="kv-label">Phone</div>
          <div>
            <a href={`tel:${resident.phone}`} aria-label={`Call ${resident.name}`}>{resident.phone}</a>
          </div>
        </div>
        <div className="kv-row">
          <div className="kv-label">Email</div>
          <div>
            <a href={`mailto:${resident.email}`} aria-label={`Email ${resident.name}`}>{resident.email}</a>
          </div>
        </div>
        <div className="kv-row">
          <div className="kv-label">Tags</div>
          <div className="tags">
            {resident.tags?.length ? resident.tags.map(t => <span key={t} className="tag">{t}</span>) : '—'}
          </div>
        </div>
      </div>
    </article>
  );
}

export default ResidentDetail;
