import React, { useState } from 'react';

const validate = (fields) => {
  const errors = {};
  if (!fields.name.trim())            errors.name    = 'Name is required.';
  else if (fields.name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
  if (!fields.email.trim())           errors.email   = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errors.email = 'Invalid email address.';
  if (!fields.subject.trim())         errors.subject = 'Subject is required.';
  if (!fields.message.trim())         errors.message = 'Message is required.';
  else if (fields.message.length < 10) errors.message = 'Message must be at least 10 characters.';
  return errors;
};

const INIT = { name: '', email: '', subject: '', message: '' };

const ContactForm = ({ onSubmit }) => {
  const [fields,  setFields]  = useState(INIT);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errs = validate({ ...fields, [name]: value });
      setErrors(prev => ({ ...prev, [name]: errs[name] || '' }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errs = validate(fields);
    setErrors(prev => ({ ...prev, [name]: errs[name] || '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.keys(INIT).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
      if (onSubmit) onSubmit(fields);
    }
  };

  const handleReset = () => { setFields(INIT); setErrors({}); setTouched({}); setSubmitted(false); };

  if (submitted) {
    return (
      <div data-testid="form-success">
        <h3 style={{ color: '#22c55e' }}>✅ Message Sent!</h3>
        <p data-testid="success-name">Thanks, {fields.name}!</p>
        <button data-testid="reset-form-btn" onClick={handleReset}>Send Another</button>
      </div>
    );
  }

  return (
    <form data-testid="contact-form" onSubmit={handleSubmit} noValidate>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          data-testid="input-name"
          value={fields.name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {touched.name && errors.name && (
          <span id="name-error" data-testid="error-name" role="alert">{errors.name}</span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          data-testid="input-email"
          value={fields.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {touched.email && errors.email && (
          <span id="email-error" data-testid="error-email" role="alert">{errors.email}</span>
        )}
      </div>

      <div>
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          name="subject"
          data-testid="input-subject"
          value={fields.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.subject}
        />
        {touched.subject && errors.subject && (
          <span data-testid="error-subject" role="alert">{errors.subject}</span>
        )}
      </div>

      <div>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          data-testid="input-message"
          value={fields.message}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.message}
        />
        {touched.message && errors.message && (
          <span data-testid="error-message" role="alert">{errors.message}</span>
        )}
      </div>

      <button type="submit" data-testid="submit-btn">Send Message</button>
    </form>
  );
};

export default ContactForm;
