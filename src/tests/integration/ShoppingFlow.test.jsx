/**
 * INTEGRATION TESTS — Full Shopping Flow
 *
 * Tests the complete user journey:
 * ProductList → add items → CartSummary → coupon → checkout
 *
 * All components share CartContext (as they would in a real app).
 *
 * Tests:
 *  1.  Adding product from list appears in cart
 *  2.  Adding same product increments qty in cart
 *  3.  Adding multiple products all appear in cart
 *  4.  Cart total updates correctly after adds
 *  5.  Removing from cart hides item
 *  6.  Applying coupon updates the checkout total
 *  7.  Full checkout flow — cart clears, success shown
 *  8.  Cart badge in summary reflects correct count
 */

import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductList from '../../components/ProductList';
import CartSummary from '../../components/CartSummary';
import { CartProvider, useCart } from '../../context/CartContext';
import { mockProducts } from '../fixtures';

// ─── Full App component: both panels share one CartProvider ───────────────────
const ShoppingApp = ({ onCheckout } = {}) => {
  const { addItem } = useCart();
  return (
    <div>
      <ProductList products={mockProducts} onAddToCart={addItem} />
      <CartSummary onCheckout={onCheckout} />
    </div>
  );
};

const renderApp = (props = {}) =>
  render(
    <CartProvider>
      <ShoppingApp {...props} />
    </CartProvider>
  );

// ─── Helpers ──────────────────────────────────────────────────────────────────
const addProductById = async (id) => {
  const card = screen.getByTestId(`product-card-${id}`);
  await userEvent.click(within(card).getByTestId('add-to-cart-btn'));
};

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe('Full Shopping Flow — Integration Tests', () => {

  // ── Add to Cart ────────────────────────────────────────────────────────────
  describe('Adding products to cart', () => {
    test('product added from list appears in cart summary', async () => {
      renderApp();
      await addProductById(1);
      await waitFor(() =>
        expect(screen.getByTestId('cart-item-1')).toBeInTheDocument()
      );
    });

    test('adding same product twice increments quantity to 2', async () => {
      renderApp();
      await addProductById(1);
      await addProductById(1);
      await waitFor(() =>
        expect(screen.getByTestId('item-qty-1')).toHaveTextContent('2')
      );
    });

    test('adding three different products shows all three in cart', async () => {
      renderApp();
      await addProductById(1); // React Masterclass
      await addProductById(3); // Node.js Pro
      await addProductById(5); // System Design
      await waitFor(() => {
        expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
        expect(screen.getByTestId('cart-item-3')).toBeInTheDocument();
        expect(screen.getByTestId('cart-item-5')).toBeInTheDocument();
      });
    });

    test('cart badge shows correct total item count', async () => {
      renderApp();
      await addProductById(1); // qty 1
      await addProductById(1); // qty 2
      await addProductById(3); // qty 1 → total = 3
      await waitFor(() =>
        expect(screen.getByTestId('cart-item-count')).toHaveTextContent('3')
      );
    });

    test('cart subtotal reflects added products', async () => {
      renderApp();
      await addProductById(1); // $49.99
      await addProductById(3); // $39.99 → $89.98
      await waitFor(() =>
        expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$89.98')
      );
    });
  });

  // ── Remove from Cart ───────────────────────────────────────────────────────
  describe('Removing products from cart', () => {
    test('removing item from cart hides it', async () => {
      renderApp();
      await addProductById(1);
      await screen.findByTestId('cart-item-1');
      await userEvent.click(screen.getByTestId('remove-item-1'));
      await waitFor(() =>
        expect(screen.queryByTestId('cart-item-1')).not.toBeInTheDocument()
      );
    });

    test('empty cart message shown after removing last item', async () => {
      renderApp();
      await addProductById(1);
      await screen.findByTestId('cart-item-1');
      await userEvent.click(screen.getByTestId('remove-item-1'));
      await waitFor(() =>
        expect(screen.getByTestId('empty-cart-message')).toBeInTheDocument()
      );
    });
  });

  // ── Coupon + Total ─────────────────────────────────────────────────────────
  describe('Coupon applied before checkout', () => {
    test('coupon SAVE10 reduces checkout button total', async () => {
      renderApp();
      await addProductById(1); // $49.99

      await screen.findByTestId('coupon-input');
      await userEvent.type(screen.getByTestId('coupon-input'), 'SAVE10');
      await userEvent.click(screen.getByTestId('apply-coupon-btn'));

      await waitFor(() =>
        expect(screen.getByTestId('checkout-btn')).toHaveTextContent('$44.99')
      );
    });
  });

  // ── Checkout ───────────────────────────────────────────────────────────────
  describe('Checkout flow', () => {
    test('after checkout, success screen is shown', async () => {
      renderApp();
      await addProductById(1);
      await screen.findByTestId('checkout-btn');
      await userEvent.click(screen.getByTestId('checkout-btn'));
      expect(await screen.findByTestId('checkout-success')).toBeInTheDocument();
    });

    test('calls onCheckout callback on checkout', async () => {
      const onCheckout = jest.fn();
      renderApp({ onCheckout });
      await addProductById(1);
      await screen.findByTestId('checkout-btn');
      await userEvent.click(screen.getByTestId('checkout-btn'));
      await waitFor(() => expect(onCheckout).toHaveBeenCalledTimes(1));
    });

    test('cart is empty after checkout and Continue Shopping clicked', async () => {
      renderApp();
      await addProductById(1);
      await screen.findByTestId('checkout-btn');
      await userEvent.click(screen.getByTestId('checkout-btn'));
      await screen.findByTestId('checkout-success');
      await userEvent.click(screen.getByTestId('continue-shopping-btn'));
      expect(screen.getByTestId('empty-cart-message')).toBeInTheDocument();
    });
  });

  // ── Context Updates Across Components ─────────────────────────────────────
  describe('Context state propagation', () => {
    test('qty increase in cart updates cart-item-count badge', async () => {
      renderApp();
      await addProductById(1); // qty=1
      await screen.findByTestId(`increase-qty-1`);
      await userEvent.click(screen.getByTestId('increase-qty-1')); // qty=2
      await waitFor(() =>
        expect(screen.getByTestId('cart-item-count')).toHaveTextContent('2')
      );
    });

    test('Clear Cart removes all items and shows empty message', async () => {
      renderApp();
      await addProductById(1);
      await addProductById(3);
      await screen.findByTestId('clear-cart-btn');
      await userEvent.click(screen.getByTestId('clear-cart-btn'));
      await waitFor(() =>
        expect(screen.getByTestId('empty-cart-message')).toBeInTheDocument()
      );
    });
  });
});
