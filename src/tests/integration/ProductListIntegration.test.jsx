/**
 * INTEGRATION TESTS — ProductList + ProductCard
 *
 * These tests exercise the interaction between ProductList (parent)
 * and ProductCard (child), including search, filter, sort, and add-to-cart.
 *
 * Tests:
 *  1.  Renders all products initially
 *  2.  Shows result count
 *  3.  Search filters products by name
 *  4.  Search filters products by description
 *  5.  Search is case-insensitive
 *  6.  Empty search restores all products
 *  7.  Category filter narrows to correct products
 *  8.  Sort by price orders correctly
 *  9.  Sort by rating orders correctly
 *  10. Sort by name (default) orders alphabetically
 *  11. Combined search + filter
 *  12. Empty state shown when no match
 *  13. onAddToCart flows from ProductCard click up to ProductList
 *  14. Out-of-stock product button is disabled in list
 */

import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductList from '../../components/ProductList';
import { mockProducts } from '../fixtures';

// ─── Helper ───────────────────────────────────────────────────────────────────
const renderList = (props = {}) =>
  render(<ProductList products={mockProducts} onAddToCart={jest.fn()} {...props} />);

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe('ProductList + ProductCard — Integration Tests', () => {

  // ── Initial Rendering ──────────────────────────────────────────────────────
  describe('Initial rendering', () => {
    test('renders all products on mount', () => {
      renderList();
      const cards = screen.getAllByTestId(/^product-card-/);
      expect(cards).toHaveLength(mockProducts.length);
    });

    test('shows correct result count', () => {
      renderList();
      expect(screen.getByTestId('result-count')).toHaveTextContent(
        `Showing ${mockProducts.length} of ${mockProducts.length} products`
      );
    });

    test('renders search input, category filter, and sort select', () => {
      renderList();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByTestId('category-filter')).toBeInTheDocument();
      expect(screen.getByTestId('sort-select')).toBeInTheDocument();
    });

    test('renders all product names', () => {
      renderList();
      mockProducts.forEach(p => {
        expect(screen.getByText(p.name)).toBeInTheDocument();
      });
    });
  });

  // ── Search ─────────────────────────────────────────────────────────────────
  describe('Search functionality', () => {
    test('filters products by name', async () => {
      renderList();
      await userEvent.type(screen.getByTestId('search-input'), 'React');
      await waitFor(() => {
        expect(screen.getByText('React Masterclass')).toBeInTheDocument();
        expect(screen.queryByText('Node.js Pro')).not.toBeInTheDocument();
      });
    });

    test('filters products by description text', async () => {
      renderList();
      await userEvent.type(screen.getByTestId('search-input'), 'interview');
      await waitFor(() => {
        expect(screen.getByText('System Design')).toBeInTheDocument();
        expect(screen.queryByText('React Masterclass')).not.toBeInTheDocument();
      });
    });

    test('search is case-insensitive', async () => {
      renderList();
      await userEvent.type(screen.getByTestId('search-input'), 'react');
      await waitFor(() => expect(screen.getByText('React Masterclass')).toBeInTheDocument());
    });

    test('clearing search restores all products', async () => {
      renderList();
      await userEvent.type(screen.getByTestId('search-input'), 'React');
      await userEvent.clear(screen.getByTestId('search-input'));
      await waitFor(() => {
        const cards = screen.getAllByTestId(/^product-card-/);
        expect(cards).toHaveLength(mockProducts.length);
      });
    });

    test('shows empty state when no search match', async () => {
      renderList();
      await userEvent.type(screen.getByTestId('search-input'), 'xyzxyzxyz');
      await waitFor(() => expect(screen.getByTestId('empty-state')).toBeInTheDocument());
    });

    test('result count updates after search', async () => {
      renderList();
      await userEvent.type(screen.getByTestId('search-input'), 'React');
      await waitFor(() =>
        expect(screen.getByTestId('result-count')).toHaveTextContent('Showing 1 of')
      );
    });
  });

  // ── Category Filter ────────────────────────────────────────────────────────
  describe('Category filter', () => {
    test('filters by "Course" category', async () => {
      renderList();
      await userEvent.selectOptions(screen.getByTestId('category-filter'), 'Course');
      const courses = mockProducts.filter(p => p.category === 'Course');
      await waitFor(() => {
        const cards = screen.getAllByTestId(/^product-card-/);
        expect(cards).toHaveLength(courses.length);
      });
    });

    test('filters by "Guide" category', async () => {
      renderList();
      await userEvent.selectOptions(screen.getByTestId('category-filter'), 'Guide');
      await waitFor(() => expect(screen.getByText('System Design')).toBeInTheDocument());
      expect(screen.queryByText('React Masterclass')).not.toBeInTheDocument();
    });

    test('selecting "All" shows all products', async () => {
      renderList();
      await userEvent.selectOptions(screen.getByTestId('category-filter'), 'Course');
      await userEvent.selectOptions(screen.getByTestId('category-filter'), 'All');
      await waitFor(() => {
        const cards = screen.getAllByTestId(/^product-card-/);
        expect(cards).toHaveLength(mockProducts.length);
      });
    });
  });

  // ── Sorting ────────────────────────────────────────────────────────────────
  describe('Sorting', () => {
    test('sort by price shows cheapest first', async () => {
      renderList();
      await userEvent.selectOptions(screen.getByTestId('sort-select'), 'price');
      const prices = screen.getAllByTestId('product-price').map(el =>
        parseFloat(el.textContent.replace('$', ''))
      );
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    test('sort by rating shows highest rating first', async () => {
      renderList();
      await userEvent.selectOptions(screen.getByTestId('sort-select'), 'rating');
      const ratings = screen.getAllByTestId('product-rating').map(el =>
        parseFloat(el.textContent.replace('⭐ ', '').replace('/5', ''))
      );
      expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
    });
  });

  // ── Combined Filter + Search ───────────────────────────────────────────────
  describe('Combined filter and search', () => {
    test('search + category filter work together', async () => {
      renderList();
      await userEvent.selectOptions(screen.getByTestId('category-filter'), 'Course');
      await userEvent.type(screen.getByTestId('search-input'), 'React');
      await waitFor(() => {
        expect(screen.getByText('React Masterclass')).toBeInTheDocument();
        expect(screen.queryByText('Node.js Pro')).not.toBeInTheDocument();
      });
    });
  });

  // ── Add to Cart Flow ───────────────────────────────────────────────────────
  describe('Add to cart flow (ProductList → ProductCard → onAddToCart)', () => {
    test('clicking Add to Cart on a card calls onAddToCart', async () => {
      const onAddToCart = jest.fn();
      renderList({ onAddToCart });
      const card = screen.getByTestId('product-card-1');
      await userEvent.click(within(card).getByTestId('add-to-cart-btn'));
      expect(onAddToCart).toHaveBeenCalledTimes(1);
      expect(onAddToCart).toHaveBeenCalledWith(expect.objectContaining({ id: 1, name: 'React Masterclass' }));
    });

    test('clicking multiple cards calls onAddToCart for each', async () => {
      const onAddToCart = jest.fn();
      renderList({ onAddToCart });
      // Click in-stock products (id 1, 3, 4, 5)
      const inStockIds = mockProducts.filter(p => p.inStock).map(p => p.id);
      for (const id of inStockIds) {
        const card = screen.getByTestId(`product-card-${id}`);
        await userEvent.click(within(card).getByTestId('add-to-cart-btn'));
      }
      expect(onAddToCart).toHaveBeenCalledTimes(inStockIds.length);
    });

    test('out-of-stock product button is disabled in list', () => {
      renderList();
      const outCard = screen.getByTestId('product-card-2'); // TypeScript Guide = out of stock
      expect(within(outCard).getByTestId('add-to-cart-btn')).toBeDisabled();
    });

    test('out-of-stock click does NOT call onAddToCart', async () => {
      const onAddToCart = jest.fn();
      renderList({ onAddToCart });
      const outCard = screen.getByTestId('product-card-2');
      await userEvent.click(within(outCard).getByTestId('add-to-cart-btn'));
      expect(onAddToCart).not.toHaveBeenCalled();
    });
  });

  // ── Empty Product Array ────────────────────────────────────────────────────
  describe('Edge cases', () => {
    test('renders without crashing when products=[]', () => {
      render(<ProductList products={[]} onAddToCart={jest.fn()} />);
      expect(screen.getByTestId('product-list')).toBeInTheDocument();
      expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    });

    test('result count shows 0 when products array is empty', () => {
      render(<ProductList products={[]} onAddToCart={jest.fn()} />);
      expect(screen.getByTestId('result-count')).toHaveTextContent('Showing 0 of 0 products');
    });
  });
});
