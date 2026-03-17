/**
 * UNIT TESTS — CartSummary
 *
 * Tests:
 *  1.  Shows empty message when cart is empty
 *  2.  Renders cart items from context
 *  3.  Shows correct item count badge
 *  4.  Displays correct subtotal
 *  5.  Increases qty
 *  6.  Decreases qty
 *  7.  Removes item when decrease on qty=1
 *  8.  Remove button removes item
 *  9.  Clear Cart removes all items
 *  10. Valid coupon applies discount
 *  11. Invalid coupon shows error
 *  12. Checkout shows success screen
 *  13. "Continue Shopping" resets to empty cart view
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartSummary from '../../components/CartSummary';
import { CartProvider } from '../../context/CartContext';
import { mockProduct } from '../fixtures';

// ─── Helper ───────────────────────────────────────────────────────────────────
const renderCart = (ui = <CartSummary />) =>
  render(<CartProvider>{ui}</CartProvider>);

// Add items programmatically by rendering a helper button
const CartWithItems = ({ products = [mockProduct] }) => {
  const { addItem } = require('../../context/CartContext').useCart();
  return (
    <>
      {products.map(p => (
        <button key={p.id} data-testid={`add-${p.id}`} onClick={() => addItem(p)}>add</button>
      ))}
      <CartSummary />
    </>
  );
};

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe('CartSummary — Unit Tests', () => {

  // ── Empty State ────────────────────────────────────────────────────────────
  describe('Empty cart', () => {
    test('shows empty cart message when cart is empty', () => {
      renderCart();
      expect(screen.getByTestId('empty-cart-message')).toBeInTheDocument();
    });

    test('does not render cart items list when empty', () => {
      renderCart();
      expect(screen.queryByTestId('cart-items')).not.toBeInTheDocument();
    });

    test('does not show item count badge when cart is empty', () => {
      renderCart();
      expect(screen.queryByTestId('cart-item-count')).not.toBeInTheDocument();
    });
  });

  // ── Items Rendering ────────────────────────────────────────────────────────
  describe('Cart with items', () => {
    const setup = async () => {
      renderCart(<CartWithItems />);
      await userEvent.click(screen.getByTestId('add-1'));
    };

    test('renders cart item after adding', async () => {
      await setup();
      expect(screen.getByTestId(`cart-item-${mockProduct.id}`)).toBeInTheDocument();
    });

    test('shows item name', async () => {
      await setup();
      expect(screen.getByTestId(`cart-item-name-${mockProduct.id}`)).toHaveTextContent('React Masterclass');
    });

    test('shows correct quantity (1 after one add)', async () => {
      await setup();
      expect(screen.getByTestId(`item-qty-${mockProduct.id}`)).toHaveTextContent('1');
    });

    test('shows item count badge', async () => {
      await setup();
      expect(screen.getByTestId('cart-item-count')).toHaveTextContent('1');
    });

    test('shows correct subtotal', async () => {
      await setup();
      expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$49.99');
    });
  });

  // ── Quantity Controls ──────────────────────────────────────────────────────
  describe('Quantity controls', () => {
    const setup = async () => {
      renderCart(<CartWithItems />);
      await userEvent.click(screen.getByTestId('add-1'));
    };

    test('increases quantity when + clicked', async () => {
      await setup();
      await userEvent.click(screen.getByTestId(`increase-qty-${mockProduct.id}`));
      expect(screen.getByTestId(`item-qty-${mockProduct.id}`)).toHaveTextContent('2');
    });

    test('decreases quantity when − clicked', async () => {
      await setup();
      await userEvent.click(screen.getByTestId(`increase-qty-${mockProduct.id}`)); // qty=2
      await userEvent.click(screen.getByTestId(`decrease-qty-${mockProduct.id}`)); // qty=1
      expect(screen.getByTestId(`item-qty-${mockProduct.id}`)).toHaveTextContent('1');
    });

    test('removes item when − clicked at qty=1', async () => {
      await setup();
      await userEvent.click(screen.getByTestId(`decrease-qty-${mockProduct.id}`));
      expect(screen.queryByTestId(`cart-item-${mockProduct.id}`)).not.toBeInTheDocument();
    });

    test('subtotal updates when quantity increases', async () => {
      await setup();
      await userEvent.click(screen.getByTestId(`increase-qty-${mockProduct.id}`));
      expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$99.98');
    });
  });

  // ── Remove Item ────────────────────────────────────────────────────────────
  describe('Remove item', () => {
    test('removes item when ✕ clicked', async () => {
      renderCart(<CartWithItems />);
      await userEvent.click(screen.getByTestId('add-1'));
      await userEvent.click(screen.getByTestId(`remove-item-${mockProduct.id}`));
      expect(screen.queryByTestId(`cart-item-${mockProduct.id}`)).not.toBeInTheDocument();
      expect(screen.getByTestId('empty-cart-message')).toBeInTheDocument();
    });
  });

  // ── Clear Cart ─────────────────────────────────────────────────────────────
  describe('Clear Cart', () => {
    test('clears all items when Clear Cart clicked', async () => {
      renderCart(<CartWithItems />);
      await userEvent.click(screen.getByTestId('add-1'));
      await userEvent.click(screen.getByTestId('clear-cart-btn'));
      expect(screen.getByTestId('empty-cart-message')).toBeInTheDocument();
    });
  });

  // ── Coupon ─────────────────────────────────────────────────────────────────
  describe('Coupon codes', () => {
    const setup = async () => {
      renderCart(<CartWithItems />);
      await userEvent.click(screen.getByTestId('add-1')); // $49.99
    };

    test('applies valid coupon SAVE10 and shows 10% discount', async () => {
      await setup();
      await userEvent.type(screen.getByTestId('coupon-input'), 'SAVE10');
      await userEvent.click(screen.getByTestId('apply-coupon-btn'));
      expect(screen.getByTestId('coupon-success')).toHaveTextContent('10% discount applied');
      expect(screen.getByTestId('cart-discount')).toHaveTextContent('-$5.00');
    });

    test('applies valid coupon SAVE20 and shows 20% discount', async () => {
      await setup();
      await userEvent.type(screen.getByTestId('coupon-input'), 'SAVE20');
      await userEvent.click(screen.getByTestId('apply-coupon-btn'));
      expect(screen.getByTestId('coupon-success')).toHaveTextContent('20% discount applied');
    });

    test('shows error for invalid coupon', async () => {
      await setup();
      await userEvent.type(screen.getByTestId('coupon-input'), 'INVALID');
      await userEvent.click(screen.getByTestId('apply-coupon-btn'));
      expect(screen.getByTestId('coupon-error')).toHaveTextContent('Invalid coupon code.');
    });

    test('coupon is case-insensitive (save10 works)', async () => {
      await setup();
      await userEvent.type(screen.getByTestId('coupon-input'), 'save10');
      await userEvent.click(screen.getByTestId('apply-coupon-btn'));
      expect(screen.getByTestId('coupon-success')).toBeInTheDocument();
    });
  });

  // ── Checkout ───────────────────────────────────────────────────────────────
  describe('Checkout flow', () => {
    test('shows success screen after checkout', async () => {
      renderCart(<CartWithItems />);
      await userEvent.click(screen.getByTestId('add-1'));
      await userEvent.click(screen.getByTestId('checkout-btn'));
      expect(screen.getByTestId('checkout-success')).toBeInTheDocument();
    });

    test('calls onCheckout callback', async () => {
      const onCheckout = jest.fn();
      renderCart(<CartWithItems />);
      render(<CartProvider><CartSummary onCheckout={onCheckout} /></CartProvider>);
      // Add item to the second cart instance
      const buttons = screen.getAllByText('add');
      await userEvent.click(buttons[0]);
      const checkoutBtns = screen.getAllByTestId('checkout-btn');
      await userEvent.click(checkoutBtns[0]);
      await waitFor(() => expect(onCheckout).toHaveBeenCalled());
    });

    test('"Continue Shopping" returns to empty cart view', async () => {
      renderCart(<CartWithItems />);
      await userEvent.click(screen.getByTestId('add-1'));
      await userEvent.click(screen.getByTestId('checkout-btn'));
      await userEvent.click(screen.getByTestId('continue-shopping-btn'));
      expect(screen.getByTestId('empty-cart-message')).toBeInTheDocument();
    });
  });
});
