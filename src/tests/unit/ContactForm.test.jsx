/**
 * UNIT TESTS — ContactForm
 *
 * Tests:
 *  1.  All form fields are rendered
 *  2.  Controlled input updates (typing changes value)
 *  3.  Blur triggers per-field validation
 *  4.  Submit without filling shows all errors
 *  5.  Invalid email shows error
 *  6.  Short name shows error
 *  7.  Short message shows error
 *  8.  Valid form calls onSubmit with correct data
 *  9.  Shows success screen after valid submit
 *  10. "Send Another" resets the form
 *  11. Error clears when field is corrected
 *  12. aria-invalid set on fields with errors
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../../components/ContactForm';

// ─── Helper ───────────────────────────────────────────────────────────────────
const fillForm = async (overrides = {}) => {
  const defaults = {
    name:    'Jane Doe',
    email:   'jane@example.com',
    subject: 'Test Subject',
    message: 'This is a test message that is long enough.',
  };
  const data = { ...defaults, ...overrides };

  if (data.name    !== null) await userEvent.type(screen.getByTestId('input-name'),    data.name);
  if (data.email   !== null) await userEvent.type(screen.getByTestId('input-email'),   data.email);
  if (data.subject !== null) await userEvent.type(screen.getByTestId('input-subject'), data.subject);
  if (data.message !== null) await userEvent.type(screen.getByTestId('input-message'), data.message);
};

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe('ContactForm — Unit Tests', () => {

  // ── Rendering ──────────────────────────────────────────────────────────────
  describe('Rendering', () => {
    beforeEach(() => render(<ContactForm />));

    test('renders all form fields', () => {
      expect(screen.getByTestId('input-name')).toBeInTheDocument();
      expect(screen.getByTestId('input-email')).toBeInTheDocument();
      expect(screen.getByTestId('input-subject')).toBeInTheDocument();
      expect(screen.getByTestId('input-message')).toBeInTheDocument();
    });

    test('renders Submit button', () => {
      expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
    });

    test('all fields start empty', () => {
      expect(screen.getByTestId('input-name')).toHaveValue('');
      expect(screen.getByTestId('input-email')).toHaveValue('');
      expect(screen.getByTestId('input-subject')).toHaveValue('');
      expect(screen.getByTestId('input-message')).toHaveValue('');
    });

    test('labels are associated with fields via htmlFor', () => {
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });
  });

  // ── Controlled Inputs ──────────────────────────────────────────────────────
  describe('Controlled inputs', () => {
    beforeEach(() => render(<ContactForm />));

    test('typing in name field updates its value', async () => {
      await userEvent.type(screen.getByTestId('input-name'), 'Alice');
      expect(screen.getByTestId('input-name')).toHaveValue('Alice');
    });

    test('typing in email field updates its value', async () => {
      await userEvent.type(screen.getByTestId('input-email'), 'alice@test.com');
      expect(screen.getByTestId('input-email')).toHaveValue('alice@test.com');
    });

    test('typing in message textarea updates its value', async () => {
      await userEvent.type(screen.getByTestId('input-message'), 'Hello world');
      expect(screen.getByTestId('input-message')).toHaveValue('Hello world');
    });
  });

  // ── Validation on Blur ─────────────────────────────────────────────────────
  describe('Blur validation', () => {
    beforeEach(() => render(<ContactForm />));

    test('shows name error when name field is blurred empty', async () => {
      fireEvent.blur(screen.getByTestId('input-name'));
      expect(await screen.findByTestId('error-name')).toHaveTextContent('Name is required.');
    });

    test('shows email error when email field is blurred empty', async () => {
      fireEvent.blur(screen.getByTestId('input-email'));
      expect(await screen.findByTestId('error-email')).toHaveTextContent('Email is required.');
    });

    test('shows invalid email error for bad email format', async () => {
      await userEvent.type(screen.getByTestId('input-email'), 'not-an-email');
      fireEvent.blur(screen.getByTestId('input-email'));
      expect(await screen.findByTestId('error-email')).toHaveTextContent('Invalid email address.');
    });

    test('shows name too short error for 1-char name', async () => {
      await userEvent.type(screen.getByTestId('input-name'), 'A');
      fireEvent.blur(screen.getByTestId('input-name'));
      expect(await screen.findByTestId('error-name')).toHaveTextContent('at least 2 characters');
    });

    test('shows message too short error', async () => {
      await userEvent.type(screen.getByTestId('input-message'), 'Short');
      fireEvent.blur(screen.getByTestId('input-message'));
      expect(await screen.findByTestId('error-message')).toHaveTextContent('at least 10 characters');
    });
  });

  // ── Submit Validation ──────────────────────────────────────────────────────
  describe('Submit without filling', () => {
    beforeEach(() => render(<ContactForm />));

    test('shows all 4 error messages on empty submit', async () => {
      await userEvent.click(screen.getByTestId('submit-btn'));
      expect(await screen.findByTestId('error-name')).toBeInTheDocument();
      expect(screen.getByTestId('error-email')).toBeInTheDocument();
      expect(screen.getByTestId('error-subject')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    test('does not show success screen on invalid submit', async () => {
      await userEvent.click(screen.getByTestId('submit-btn'));
      expect(screen.queryByTestId('form-success')).not.toBeInTheDocument();
    });
  });

  // ── Error Clearing ─────────────────────────────────────────────────────────
  describe('Error clearing on correction', () => {
    test('name error disappears after valid name is typed', async () => {
      render(<ContactForm />);
      fireEvent.blur(screen.getByTestId('input-name'));
      await screen.findByTestId('error-name');
      await userEvent.type(screen.getByTestId('input-name'), 'Bob');
      await waitFor(() => expect(screen.queryByTestId('error-name')).not.toBeInTheDocument());
    });
  });

  // ── Successful Submission ──────────────────────────────────────────────────
  describe('Successful form submission', () => {
    test('calls onSubmit with correct form data', async () => {
      const onSubmit = jest.fn();
      render(<ContactForm onSubmit={onSubmit} />);
      await fillForm();
      await userEvent.click(screen.getByTestId('submit-btn'));
      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name:    'Jane Doe',
        email:   'jane@example.com',
        subject: 'Test Subject',
      }));
    });

    test('shows success screen after valid submit', async () => {
      render(<ContactForm />);
      await fillForm();
      await userEvent.click(screen.getByTestId('submit-btn'));
      expect(await screen.findByTestId('form-success')).toBeInTheDocument();
    });

    test('success screen shows the submitted name', async () => {
      render(<ContactForm />);
      await fillForm();
      await userEvent.click(screen.getByTestId('submit-btn'));
      expect(await screen.findByTestId('success-name')).toHaveTextContent('Jane Doe');
    });

    test('"Send Another" button resets to blank form', async () => {
      render(<ContactForm />);
      await fillForm();
      await userEvent.click(screen.getByTestId('submit-btn'));
      await screen.findByTestId('form-success');
      await userEvent.click(screen.getByTestId('reset-form-btn'));
      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
      expect(screen.getByTestId('input-name')).toHaveValue('');
    });
  });

  // ── Accessibility ──────────────────────────────────────────────────────────
  describe('Accessibility', () => {
    test('error inputs have aria-invalid=true', async () => {
      render(<ContactForm />);
      await userEvent.click(screen.getByTestId('submit-btn'));
      await waitFor(() => {
        expect(screen.getByTestId('input-name')).toHaveAttribute('aria-invalid', 'true');
        expect(screen.getByTestId('input-email')).toHaveAttribute('aria-invalid', 'true');
      });
    });

    test('error messages have role="alert"', async () => {
      render(<ContactForm />);
      fireEvent.blur(screen.getByTestId('input-name'));
      const alert = await screen.findByRole('alert');
      expect(alert).toBeInTheDocument();
    });
  });
});
