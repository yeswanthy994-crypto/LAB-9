// Shared test fixtures used across all test files

export const mockProduct = {
  id: 1,
  name: 'React Masterclass',
  price: 49.99,
  category: 'Course',
  rating: 4.9,
  description: 'Complete guide to React 18 with hooks and routing.',
  inStock: true,
};

export const mockProductOutOfStock = {
  id: 2,
  name: 'TypeScript Guide',
  price: 29.99,
  category: 'Book',
  rating: 4.7,
  description: 'Master TypeScript from scratch.',
  inStock: false,
};

export const mockProducts = [
  mockProduct,
  mockProductOutOfStock,
  {
    id: 3,
    name: 'Node.js Pro',
    price: 39.99,
    category: 'Course',
    rating: 4.8,
    description: 'Backend with Node.js, Express & MongoDB.',
    inStock: true,
  },
  {
    id: 4,
    name: 'CSS Layouts',
    price: 19.99,
    category: 'Course',
    rating: 4.5,
    description: 'Master grid and flexbox layouts.',
    inStock: true,
  },
  {
    id: 5,
    name: 'System Design',
    price: 59.99,
    category: 'Guide',
    rating: 4.9,
    description: 'Interview-ready system design patterns.',
    inStock: true,
  },
];

export const mockCartItems = [
  { ...mockProduct,  qty: 2 },
  { id: 3, name: 'Node.js Pro', price: 39.99, category: 'Course', rating: 4.8, description: '', inStock: true, qty: 1 },
];
