import React from 'react';
import { Link, useParams } from 'react-router-dom';
import residents from '../data/residents.json';
import { initialsFromName, getResidentAvatarUrl, avatarAltText } from '../utils';

/**
 * PUBLIC_INTERFACE
 * ResidentDetail shows details for a single resident by id from route params.
 */
function ResidentDetail() {
  const { id } = useParams();
  const resident = residents.find((r) => r.id === id);

  if (!resident) {
    return (
      <div className="empty" role="status" aria-live="polite">
        Resident not found.
        <div>
          <Link className="back-link" to="/">← Back to list</Link>
        </div>
      </div>
    );
  }

  const initials = initialsFromName(resident.name);
  const avatarUrl = getResidentAvatarUrl(resident);
  const alt = avatarAltText(resident.name);

  return (
    <article className="detail" aria-labelledby="resident-name">
      <Link className="back-link" to="/">← Back to list</Link>
      <div className="detail-header">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            className="detail-avatar"
            alt={alt}
            width="72"
            height="72"
            loading="lazy"
          />
        ) : (
          <div className="detail-avatar" aria-hidden="true">{initials}</div>
        )}
        <div>
          <h2 id="resident-name">{resident.name}</h2>
          <div className="meta">Unit {resident.unit}</div>
        </div>
      </div>

      <div className="kv" role="list">
        <div className="kv-row" role="listitem">
          <div className="kv-label">Phone</div>
          <div>
            <a href={`tel:${resident.phone}`} aria-label={`Call ${resident.name}`}>{resident.phone}</a>
          </div>
        </div>
        <div className="kv-row" role="listitem">
          <div className="kv-label">Email</div>
          <div>
            <a href={`mailto:${resident.email}`} aria-label={`Email ${resident.name}`}>{resident.email}</a>
          </div>
        </div>
        <div className="kv-row" role="listitem">
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
