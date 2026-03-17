/**
 * UNIT TESTS — ProductCard
 *
 * Tests:
 *  1.  Renders product name, price, category, rating, description
 *  2.  Formats price with 2 decimal places
 *  3.  Shows "In Stock" for inStock=true
 *  4.  Shows "Out of Stock" for inStock=false
 *  5.  Add-to-cart button is enabled when inStock=true
 *  6.  Add-to-cart button is disabled when inStock=false
 *  7.  Calls onAddToCart with correct product on click
 *  8.  Does NOT call onAddToCart when out of stock
 *  9.  Shows Details button only when onViewDetails prop provided
 *  10. Calls onViewDetails with product id
 *  11. Returns null when no product prop
 *  12. Correct aria-labels for accessibility
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductCard from '../../components/ProductCard';
import { mockProduct, mockProductOutOfStock } from '../fixtures';

// ─── Helper ──────────────────────────────────────────────────────────────────
const renderCard = (props = {}) =>
  render(<ProductCard product={mockProduct} onAddToCart={jest.fn()} {...props} />);

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe('ProductCard — Unit Tests', () => {

  // ── Rendering ──────────────────────────────────────────────────────────────
  describe('Rendering props correctly', () => {
    test('renders the product name', () => {
      renderCard();
      expect(screen.getByTestId('product-name')).toHaveTextContent('React Masterclass');
    });

    test('renders the product category', () => {
      renderCard();
      expect(screen.getByTestId('product-category')).toHaveTextContent('Course');
    });

    test('renders the product description', () => {
      renderCard();
      expect(screen.getByTestId('product-description')).toHaveTextContent(
        'Complete guide to React 18 with hooks and routing.'
      );
    });

    test('renders price formatted to 2 decimal places', () => {
      renderCard();
      expect(screen.getByTestId('product-price')).toHaveTextContent('$49.99');
    });

    test('renders the product rating', () => {
      renderCard();
      expect(screen.getByTestId('product-rating')).toHaveTextContent('4.9/5');
    });

    test('returns null when product prop is not provided', () => {
      const { container } = render(<ProductCard />);
      expect(container.firstChild).toBeNull();
    });

    test('renders correct data-testid on article element', () => {
      renderCard();
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    });
  });

  // ── Stock Status ───────────────────────────────────────────────────────────
  describe('Stock status display', () => {
    test('shows "In Stock" when inStock is true', () => {
      renderCard();
      expect(screen.getByTestId('product-stock-status')).toHaveTextContent('In Stock');
    });

    test('shows "Out of Stock" when inStock is false', () => {
      renderCard({ product: mockProductOutOfStock });
      expect(screen.getByTestId('product-stock-status')).toHaveTextContent('Out of Stock');
    });
  });

  // ── Button States ──────────────────────────────────────────────────────────
  describe('Add to Cart button', () => {
    test('button is enabled when product is in stock', () => {
      renderCard();
      expect(screen.getByTestId('add-to-cart-btn')).toBeEnabled();
    });

    test('button is disabled when product is out of stock', () => {
      renderCard({ product: mockProductOutOfStock });
      expect(screen.getByTestId('add-to-cart-btn')).toBeDisabled();
    });

    test('button shows "Add to Cart" when in stock', () => {
      renderCard();
      expect(screen.getByTestId('add-to-cart-btn')).toHaveTextContent('Add to Cart');
    });

    test('button shows "Unavailable" when out of stock', () => {
      renderCard({ product: mockProductOutOfStock });
      expect(screen.getByTestId('add-to-cart-btn')).toHaveTextContent('Unavailable');
    });

    test('button has correct aria-label', () => {
      renderCard();
      expect(screen.getByRole('button', { name: /Add React Masterclass to cart/i })).toBeInTheDocument();
    });
  });

  // ── Click Events ───────────────────────────────────────────────────────────
  describe('Click events', () => {
    test('calls onAddToCart with the product when clicked', async () => {
      const onAddToCart = jest.fn();
      renderCard({ onAddToCart });
      await userEvent.click(screen.getByTestId('add-to-cart-btn'));
      expect(onAddToCart).toHaveBeenCalledTimes(1);
      expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
    });

    test('does NOT call onAddToCart when product is out of stock', async () => {
      const onAddToCart = jest.fn();
      renderCard({ product: mockProductOutOfStock, onAddToCart });
      await userEvent.click(screen.getByTestId('add-to-cart-btn'));
      expect(onAddToCart).not.toHaveBeenCalled();
    });

    test('does not throw if onAddToCart is not provided', async () => {
      render(<ProductCard product={mockProduct} />);
      expect(() => fireEvent.click(screen.getByTestId('add-to-cart-btn'))).not.toThrow();
    });
  });

  // ── View Details ───────────────────────────────────────────────────────────
  describe('View Details button', () => {
    test('Details button is NOT rendered when onViewDetails not provided', () => {
      renderCard();
      expect(screen.queryByTestId('view-details-btn')).not.toBeInTheDocument();
    });

    test('Details button IS rendered when onViewDetails is provided', () => {
      renderCard({ onViewDetails: jest.fn() });
      expect(screen.getByTestId('view-details-btn')).toBeInTheDocument();
    });

    test('calls onViewDetails with product id when Details clicked', async () => {
      const onViewDetails = jest.fn();
      renderCard({ onViewDetails });
      await userEvent.click(screen.getByTestId('view-details-btn'));
      expect(onViewDetails).toHaveBeenCalledWith(mockProduct.id);
    });
  });

  // ── Snapshot ───────────────────────────────────────────────────────────────
  describe('Snapshot', () => {
    test('matches snapshot for in-stock product', () => {
      const { asFragment } = renderCard();
      expect(asFragment()).toMatchSnapshot();
    });

    test('matches snapshot for out-of-stock product', () => {
      const { asFragment } = render(
        <ProductCard product={mockProductOutOfStock} onAddToCart={jest.fn()} />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });
});
