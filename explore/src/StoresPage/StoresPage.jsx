import * as React from 'react';
import data from '../data/db.json';
import Store from '../Store/Store';
import './StoresPage.css'

const StoresPage = () => {
  return (
    <div data-boundary-page="explore">
      <main className="e_StoresPage">
        <h2>Our Stores</h2>
        <p>
          Want to see our products in person? Visit one of our stores to see our products up close and talk to our
          experts. We have stores in the following locations:
        </p>
        <ul className="e_StoresPage_list">
          {data.stores.map((store, i) => (
            <Store key={i} {...store} />
          ))}
        </ul>
      </main>
    </div>
  );
};

export default StoresPage;
