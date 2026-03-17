import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

/**
 * CartSummary — shows cart contents, allows qty changes, remove, and checkout.
 */
const CartSummary = ({ onCheckout }) => {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [coupon, setCoupon]             = useState('');
  const [couponError, setCouponError]   = useState('');
  const [discount, setDiscount]         = useState(0);

  const VALID_COUPONS = { SAVE10: 10, SAVE20: 20 };

  const handleApplyCoupon = () => {
    const upper = coupon.trim().toUpperCase();
    if (VALID_COUPONS[upper] !== undefined) {
      setDiscount(VALID_COUPONS[upper]);
      setCouponError('');
    } else {
      setDiscount(0);
      setCouponError('Invalid coupon code.');
    }
  };

  const handleCheckout = () => {
    clearCart();
    setCheckoutDone(true);
    setDiscount(0);
    setCoupon('');
    if (onCheckout) onCheckout();
  };

  const discountedTotal = totalPrice - (totalPrice * discount) / 100;

  if (checkoutDone) {
    return (
      <div data-testid="checkout-success" style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '3rem' }}>✅</div>
        <h2 style={{ color: '#22c55e' }}>Order Placed!</h2>
        <p style={{ color: '#94a3b8' }}>Thank you for your purchase.</p>
        <button
          data-testid="continue-shopping-btn"
          onClick={() => setCheckoutDone(false)}
          style={{ marginTop: '16px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', padding: '10px 24px', fontWeight: 700, cursor: 'pointer' }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <section data-testid="cart-summary">
      <h2 style={{ color: '#38bdf8', marginBottom: '16px' }}>
        🛒 Cart
        {totalItems > 0 && (
          <span data-testid="cart-item-count" style={{ marginLeft: '8px', background: '#38bdf8', color: '#0f172a', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8rem' }}>
            {totalItems}
          </span>
        )}
      </h2>

      {items.length === 0 ? (
        <p data-testid="empty-cart-message" style={{ color: '#64748b' }}>Your cart is empty.</p>
      ) : (
        <>
          {/* Cart items */}
          <ul data-testid="cart-items" style={{ listStyle: 'none', padding: 0, margin: '0 0 16px' }}>
            {items.map(item => (
              <li
                key={item.id}
                data-testid={`cart-item-${item.id}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #334155' }}
              >
                <div>
                  <span data-testid={`cart-item-name-${item.id}`} style={{ color: '#f1f5f9', fontWeight: 600 }}>{item.name}</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: '8px' }}>${item.price.toFixed(2)} each</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    data-testid={`decrease-qty-${item.id}`}
                    aria-label={`Decrease quantity of ${item.name}`}
                    onClick={() => item.qty > 1 ? updateQty(item.id, item.qty - 1) : removeItem(item.id)}
                    style={{ background: '#334155', border: 'none', color: '#f1f5f9', borderRadius: '4px', width: '26px', height: '26px', cursor: 'pointer', fontWeight: 700 }}
                  >−</button>

                  <span data-testid={`item-qty-${item.id}`} style={{ color: '#f1f5f9', minWidth: '20px', textAlign: 'center' }}>
                    {item.qty}
                  </span>

                  <button
                    data-testid={`increase-qty-${item.id}`}
                    aria-label={`Increase quantity of ${item.name}`}
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    style={{ background: '#334155', border: 'none', color: '#f1f5f9', borderRadius: '4px', width: '26px', height: '26px', cursor: 'pointer', fontWeight: 700 }}
                  >+</button>

                  <span data-testid={`item-subtotal-${item.id}`} style={{ color: '#22c55e', minWidth: '60px', textAlign: 'right' }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>

                  <button
                    data-testid={`remove-item-${item.id}`}
                    aria-label={`Remove ${item.name} from cart`}
                    onClick={() => removeItem(item.id)}
                    style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '1rem' }}
                  >✕</button>
                </div>
              </li>
            ))}
          </ul>

          {/* Coupon */}
          <div data-testid="coupon-section" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              data-testid="coupon-input"
              type="text"
              placeholder="Coupon code"
              value={coupon}
              onChange={e => setCoupon(e.target.value)}
              aria-label="Enter coupon code"
              style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', background: '#1e293b', color: '#f1f5f9' }}
            />
            <button
              data-testid="apply-coupon-btn"
              onClick={handleApplyCoupon}
              style={{ background: '#475569', color: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: 600 }}
            >
              Apply
            </button>
          </div>
          {couponError && <p data-testid="coupon-error" style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: '8px' }}>{couponError}</p>}
          {discount > 0 && <p data-testid="coupon-success" style={{ color: '#22c55e', fontSize: '0.82rem', marginBottom: '8px' }}>✓ {discount}% discount applied!</p>}

          {/* Totals */}
          <div data-testid="cart-totals" style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '4px' }}>
              <span>Subtotal</span>
              <span data-testid="cart-subtotal">${totalPrice.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22c55e', marginBottom: '4px' }}>
                <span>Discount ({discount}%)</span>
                <span data-testid="cart-discount">-${((totalPrice * discount) / 100).toFixed(2)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f1f5f9', fontWeight: 700, fontSize: '1.1rem', borderTop: '1px solid #334155', paddingTop: '8px' }}>
              <span>Total</span>
              <span data-testid="cart-total">${discountedTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              data-testid="clear-cart-btn"
              onClick={clearCart}
              style={{ background: 'transparent', border: '1px solid #f87171', color: '#f87171', borderRadius: '6px', padding: '10px 16px', cursor: 'pointer', fontWeight: 600 }}
            >
              Clear Cart
            </button>
            <button
              data-testid="checkout-btn"
              onClick={handleCheckout}
              style={{ flex: 1, background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 16px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}
            >
              Checkout (${discountedTotal.toFixed(2)})
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default CartSummary;
