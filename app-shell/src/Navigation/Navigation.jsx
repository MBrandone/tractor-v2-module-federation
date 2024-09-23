import * as React from 'react';
import './Navigation.css';

export default () => {
  return (
    <nav className="e_Navigation">
      <ul className="e_Navigation__list">
        <li className="e_Navigation__item">
          <a href="/machines">Machines</a>
        </li>
        <li className="e_Navigation__item">
          <a href="/stores">Stores</a>
        </li>
      </ul>
    </nav>
  );
};
