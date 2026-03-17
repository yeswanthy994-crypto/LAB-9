import React from 'react';

/**
 * ProductCard — displays a single product and allows adding to cart.
 * Props:
 *   product: { id, name, price, category, rating, description, inStock }
 *   onAddToCart: (product) => void
 *   onViewDetails: (id) => void   [optional]
 */
const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  if (!product) return null;

  const { id, name, price, category, rating, description, inStock } = product;

  const handleAdd = () => {
    if (inStock && onAddToCart) onAddToCart(product);
  };

  const handleView = () => {
    if (onViewDetails) onViewDetails(id);
  };

  return (
    <article
      data-testid={`product-card-${id}`}
      className="product-card"
      style={{
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '16px',
        background: '#1e293b',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div
        data-testid="product-category"
        style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700 }}
      >
        {category}
      </div>

      <h3
        data-testid="product-name"
        style={{ color: '#f1f5f9', fontSize: '1rem', margin: 0 }}
      >
        {name}
      </h3>

      <p
        data-testid="product-description"
        style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}
      >
        {description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          data-testid="product-price"
          style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.1rem' }}
        >
          ${price.toFixed(2)}
        </span>
        <span
          data-testid="product-rating"
          aria-label={`Rating: ${rating} out of 5`}
          style={{ color: '#fbbf24', fontSize: '0.85rem' }}
        >
          ⭐ {rating}/5
        </span>
      </div>

      <div
        data-testid="product-stock-status"
        style={{ fontSize: '0.8rem', color: inStock ? '#22c55e' : '#f87171' }}
      >
        {inStock ? '✓ In Stock' : '✗ Out of Stock'}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
        <button
          data-testid="add-to-cart-btn"
          onClick={handleAdd}
          disabled={!inStock}
          aria-label={`Add ${name} to cart`}
          style={{
            flex: 1,
            background: inStock ? '#38bdf8' : '#475569',
            color: inStock ? '#0f172a' : '#94a3b8',
            border: 'none',
            borderRadius: '6px',
            padding: '8px',
            fontWeight: 700,
            cursor: inStock ? 'pointer' : 'not-allowed',
          }}
        >
          {inStock ? 'Add to Cart' : 'Unavailable'}
        </button>

        {onViewDetails && (
          <button
            data-testid="view-details-btn"
            onClick={handleView}
            aria-label={`View details for ${name}`}
            style={{
              background: 'transparent',
              border: '1px solid #475569',
              color: '#94a3b8',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
            }}
          >
            Details
          </button>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
