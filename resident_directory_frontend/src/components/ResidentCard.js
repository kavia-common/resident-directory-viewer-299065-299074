import React from 'react';
import { Link } from 'react-router-dom';
import { initialsFromName, getResidentAvatarUrl, avatarAltText } from '../utils';

/**
 * PUBLIC_INTERFACE
 * ResidentCard renders a resident summary as a card.
 * Props: resident { id, name, unit, tags, avatar/image }
 */
function ResidentCard({ resident }) {
  const initials = initialsFromName(resident.name);
  const avatarUrl = getResidentAvatarUrl(resident);
  const alt = avatarAltText(resident.name);

  return (
    <article className="card" data-testid={`resident-card-${resident.id}`}>
      <Link to={`/resident/${resident.id}`} aria-label={`View details for ${resident.name}`}>
        <div className="card-header">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={alt}
              className="avatar"
              width="48"
              height="48"
              loading="lazy"
            />
          ) : (
            <div className="avatar" aria-hidden="true">{initials}</div>
          )}
          <div>
            <h3>{resident.name}</h3>
            <div className="meta">Unit {resident.unit}</div>
          </div>
        </div>
        {resident.tags?.length ? (
          <div className="tags" aria-label="tags">
            {resident.tags.map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        ) : null}
      </Link>
    </article>
  );
}

export default ResidentCard;
