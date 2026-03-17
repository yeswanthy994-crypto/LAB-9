import React, { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import ProductList from './components/ProductList';
import CartSummary from './components/CartSummary';
import { mockProducts } from './tests/fixtures';

const AppInner = () => {
  const { addItem } = useCart();
  const [tab, setTab] = useState('products');

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'sans-serif' }}>
      <nav style={{ background: '#1e293b', padding: '14px 28px', display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid #334155' }}>
        <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.2rem' }}>⚛ Testing Demo</span>
        <button onClick={() => setTab('products')} style={{ background: tab === 'products' ? '#38bdf8' : 'transparent', color: tab === 'products' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '6px', padding: '6px 16px', cursor: 'pointer', fontWeight: 600 }}>Products</button>
        <button onClick={() => setTab('cart')} style={{ background: tab === 'cart' ? '#38bdf8' : 'transparent', color: tab === 'cart' ? '#0f172a' : '#94a3b8', border: 'none', borderRadius: '6px', padding: '6px 16px', cursor: 'pointer', fontWeight: 600 }}>Cart</button>
      </nav>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px' }}>
        {tab === 'products' ? (
          <ProductList products={mockProducts} onAddToCart={addItem} />
        ) : (
          <CartSummary />
        )}
      </div>
    </div>
  );
};

function App() {
  return <CartProvider><AppInner /></CartProvider>;
}

export default App;
