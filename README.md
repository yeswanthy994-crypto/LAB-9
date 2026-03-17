# Unit & Integration Testing — React + Jest + RTL

A complete React application with comprehensive unit and integration tests using **Jest** and **React Testing Library (RTL)**.

---

## 🚀 Getting Started

```bash
npm install

# Run all tests in watch mode
npm test

# Run all tests once with verbose output
npm run test:verbose

# Run tests + generate coverage report
npm run test:coverage

# Start the app
npm start
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ProductCard.js        # Single product display
│   ├── ProductList.js        # Filterable/searchable product grid
│   ├── CartSummary.js        # Cart with qty controls, coupon, checkout
│   └── ContactForm.js        # Controlled form with validation
├── context/
│   └── CartContext.js        # useReducer-based cart state
├── tests/
│   ├── fixtures.js           # Shared mock product/cart data
│   ├── unit/
│   │   ├── ProductCard.test.js      # 20 unit tests
│   │   ├── ContactForm.test.js      # 22 unit tests
│   │   ├── CartSummary.test.js      # 18 unit tests
│   │   └── CartContext.test.js      # 8 context unit tests
│   └── integration/
│       ├── ProductListIntegration.test.js   # 20 integration tests
│       └── ShoppingFlow.test.js             # 14 end-to-end flow tests
└── setupTests.js             # jest-dom configuration
```

**Total: ~100 tests across 6 test files**

---

## ✅ Skills Demonstrated

### 1. Unit Testing with Jest + RTL

**ProductCard.test.js**
- Rendering props (name, price, category, rating, description)
- Price formatting (2 decimal places)
- Conditional rendering (in-stock vs out-of-stock)
- Button enabled/disabled state
- Click event handlers (`jest.fn()` mocks)
- Optional prop rendering (Details button)
- Snapshot tests (`asFragment()`)
- Accessibility assertions (`aria-label`, `role`)

**ContactForm.test.js**
- Controlled input state (`toHaveValue`)
- Blur-triggered per-field validation
- Submit with empty form shows all errors
- Error messages via `role="alert"`
- `aria-invalid` attribute on error fields
- Valid submission calls `onSubmit` with correct data
- Success screen rendering
- Form reset after success

**CartSummary.test.js**
- Empty cart state
- Item rendering from context
- Quantity +/− controls
- Remove item and remove-at-qty-1
- Clear Cart
- Coupon code validation (valid, invalid, case-insensitive)
- Checkout flow with success screen
- `onCheckout` callback

**CartContext.test.js**
- Reducer actions: ADD_ITEM, REMOVE_ITEM, UPDATE_QTY, CLEAR_CART
- Duplicate product qty increment
- Computed `totalItems` and `totalPrice`
- `useCart` throws outside `CartProvider`

---

### 2. Integration Testing

**ProductListIntegration.test.js**
- All products rendered on mount
- Search by name (case-insensitive)
- Search by description
- Search → clear → all products restored
- Category filter + reset to All
- Sort by price (ascending)
- Sort by rating (descending)
- Combined search + category filter
- Empty state when no results
- `onAddToCart` flows from ProductCard click up through ProductList
- Out-of-stock disabled in list context

**ShoppingFlow.test.js (End-to-End)**
- Add product → appears in CartSummary (cross-component context)
- Add same product twice → qty=2
- Add 3 different products → all visible
- Cart badge reflects total count
- Subtotal correct after multiple adds
- Remove from cart → item disappears
- Coupon → reduces checkout total
- Full checkout → success screen → continue shopping → empty cart
- Qty increase in cart → badge updates (context propagation)

---

### 3. Key RTL Patterns Used

```jsx
// Query methods
screen.getByTestId('...')          // preferred for test-specific IDs
screen.getByRole('button', {...})  // accessible role queries
screen.getByLabelText('...')       // form fields
screen.queryByTestId('...')        // for asserting absence
screen.findByTestId('...')         // async waiting

// User interactions
await userEvent.type(input, 'text')
await userEvent.click(button)
await userEvent.selectOptions(select, 'value')
await userEvent.clear(input)
fireEvent.blur(input)              // for blur-only events

// Assertions
expect(el).toBeInTheDocument()
expect(el).not.toBeInTheDocument()
expect(el).toHaveTextContent('...')
expect(el).toHaveValue('...')
expect(el).toBeEnabled() / .toBeDisabled()
expect(el).toHaveAttribute('aria-invalid', 'true')
expect(fn).toHaveBeenCalledWith(expect.objectContaining({...}))

// Scoped queries
within(card).getByTestId('...')    // query inside a specific element
```

---

### 4. Coverage Report

After `npm run test:coverage`, open `coverage/lcov-report/index.html` to see:
- Statement coverage
- Branch coverage (if/else paths)
- Function coverage
- Line coverage

Coverage threshold is set to **70%** minimum for all metrics.
