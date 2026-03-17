import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';

/**
 * ProductList — renders a filterable/searchable list of ProductCards.
 * Props:
 *   products: Product[]
 *   onAddToCart: (product) => void
 */
const ProductList = ({ products = [], onAddToCart }) => {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy]     = useState('name');

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return ['All', ...cats];
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== 'All') list = list.filter(p => p.category === category);
    if (search.trim())       list = list.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
    list.sort((a, b) =>
      sortBy === 'price'  ? a.price  - b.price  :
      sortBy === 'rating' ? b.rating - a.rating :
      a.name.localeCompare(b.name)
    );
    return list;
  }, [products, search, category, sortBy]);

  return (
    <section data-testid="product-list">
      {/* Search & Filters */}
      <div data-testid="filter-bar" style={{ marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search products"
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', background: '#1e293b', color: '#f1f5f9', flex: 1 }}
        />

        <select
          data-testid="category-filter"
          value={category}
          onChange={e => setCategory(e.target.value)}
          aria-label="Filter by category"
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', background: '#1e293b', color: '#f1f5f9' }}
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          data-testid="sort-select"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          aria-label="Sort products"
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', background: '#1e293b', color: '#f1f5f9' }}
        >
          <option value="name">Sort: Name</option>
          <option value="price">Sort: Price</option>
          <option value="rating">Sort: Rating</option>
        </select>
      </div>

      {/* Result count */}
      <p data-testid="result-count" style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '14px' }}>
        Showing {filtered.length} of {products.length} products
      </p>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div data-testid="empty-state" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          No products found. Try adjusting your search or filter.
        </div>
      )}

      {/* Product grid */}
      <div
        data-testid="product-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}
      >
        {filtered.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
