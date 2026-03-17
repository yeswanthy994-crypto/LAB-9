/**
 * UNIT TESTS — CartContext (useReducer logic)
 *
 * Tests the context reducer and hook directly via a test consumer.
 *
 * Tests:
 *  1.  Initial state is empty cart
 *  2.  addItem adds new product
 *  3.  addItem increments qty for duplicate
 *  4.  removeItem removes product
 *  5.  updateQty changes quantity
 *  6.  clearCart removes all items
 *  7.  totalItems computed correctly
 *  8.  totalPrice computed correctly
 *  9.  useCart throws outside provider
 */

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '../../context/CartContext';
import { mockProduct } from '../fixtures';

// ─── Test Consumer ────────────────────────────────────────────────────────────
const TestConsumer = () => {
  const { items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart();
  return (
    <div>
      <button data-testid="add"    onClick={() => addItem(mockProduct)}>add</button>
      <button data-testid="remove" onClick={() => removeItem(mockProduct.id)}>remove</button>
      <button data-testid="update" onClick={() => updateQty(mockProduct.id, 5)}>update</button>
      <button data-testid="clear"  onClick={clearCart}>clear</button>
      <span data-testid="count">{totalItems}</span>
      <span data-testid="price">{totalPrice.toFixed(2)}</span>
      <span data-testid="items-json">{JSON.stringify(items)}</span>
    </div>
  );
};

const renderConsumer = () =>
  render(<CartProvider><TestConsumer /></CartProvider>);

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe('CartContext — Unit Tests', () => {

  test('initial state: totalItems=0, totalPrice=0', () => {
    renderConsumer();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('price')).toHaveTextContent('0.00');
  });

  test('addItem adds product to cart', async () => {
    renderConsumer();
    await userEvent.click(screen.getByTestId('add'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  test('addItem increments qty for existing product', async () => {
    renderConsumer();
    await userEvent.click(screen.getByTestId('add'));
    await userEvent.click(screen.getByTestId('add'));
    const items = JSON.parse(screen.getByTestId('items-json').textContent);
    expect(items[0].qty).toBe(2);
    expect(screen.getByTestId('count')).toHaveTextContent('2');
  });

  test('removeItem removes product from cart', async () => {
    renderConsumer();
    await userEvent.click(screen.getByTestId('add'));
    await userEvent.click(screen.getByTestId('remove'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  test('updateQty changes qty to 5', async () => {
    renderConsumer();
    await userEvent.click(screen.getByTestId('add'));
    await userEvent.click(screen.getByTestId('update'));
    const items = JSON.parse(screen.getByTestId('items-json').textContent);
    expect(items[0].qty).toBe(5);
  });

  test('clearCart empties all items', async () => {
    renderConsumer();
    await userEvent.click(screen.getByTestId('add'));
    await userEvent.click(screen.getByTestId('add'));
    await userEvent.click(screen.getByTestId('clear'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  test('totalPrice is price * qty', async () => {
    renderConsumer();
    await userEvent.click(screen.getByTestId('add')); // $49.99 × 1
    await userEvent.click(screen.getByTestId('add')); // $49.99 × 2
    expect(screen.getByTestId('price')).toHaveTextContent('99.98');
  });

  test('useCart throws when used outside CartProvider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useCart must be used within CartProvider');
    spy.mockRestore();
  });
});
