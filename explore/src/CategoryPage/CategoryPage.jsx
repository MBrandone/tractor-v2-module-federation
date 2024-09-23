import * as React from 'react';
import data from '../data/db.json';
import Filter from "../Filter/Filter";
import Product from "../Product/Product";
import './CategoryPage.css'

const CategoryPage = () => {
  const urlParams = new URLSearchParams(location.search);
  const filter = urlParams.get('filter');

  const filteredCategory = filter && data.categories.find((category) => category.key === filter);

  const title = filteredCategory ? filteredCategory.name : 'All Machines';
  const products = filteredCategory ? filteredCategory.products : data.categories.flatMap((category) => category.products);

  // sort products by price descending
  products.sort((a, b) => b.startPrice - a.startPrice);

  const filters = [
    { url: '/machines', name: 'All', active: !filteredCategory },
    ...data.categories.map((c) => ({
      url: `/machines?filter=${c.key}`,
      name: c.name,
      active: c.key === filter,
    })),
  ];

  return (
    <div data-boundary-page="explore">
      <main className="e_CategoryPage">
        <h2>{title}</h2>
        <div className="e_CategoryPage__subline">
          <p>{products.length} products</p>
          <Filter filters={filters} />
        </div>
        <ul className="e_CategoryPage_list">
          {products.map((product, i) => (
            <Product key={i} {...product} />
          ))}
        </ul>
      </main>
    </div>
  );
};

export default CategoryPage;
