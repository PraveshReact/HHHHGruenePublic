import React, { useState } from 'react';
import axios from 'axios';
import '../src/CSS/ContactForm.css'; // Import the CSS file for styling

const ContactForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    message: '',
    acceptPrivacyPolicy: false,
    subscribeNewsletter: false
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiEndpoint = 'https://gruene-weltweit.de/SPPublicAPIs/insertData.php';

    try {
      // Send POST request with form data
      const response = await axios.post(apiEndpoint, formData);

      // Handle success
      console.log('Form submitted successfully:', response.data);
      alert('Your message has been sent successfully!');
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        message: '',
        acceptPrivacyPolicy: false,
        subscribeNewsletter: false
      });

    } catch (error) {
      // Handle error
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again later.');
    }
  };

  // Check if the privacy policy checkbox is checked
  const isFormValid = formData.acceptPrivacyPolicy; // The form will only be valid if this is true

  return (
    <div className="contact-form-bg">
    <div className="contact-form-container">
      <h2 className="contact-form-title">Kontakt</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">E-Mail<span className='text-danger'>*</span></label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input m-0"
          />
        </div>

        <div className="input-group">
          <label htmlFor="firstName">Vorname</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="form-input m-0"
          />
        </div>

        <div className="input-group">
          <label htmlFor="lastName">Nachname</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input m-0"
          />
        </div>

        <div className="input-group">
          <label htmlFor="message">Meine Frage / Mein Anliegen</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="form-input m-0"
            rows={4} // Increase the rows to make the textarea taller
          />
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input className='form-check-input me-2'
              type="checkbox"
              name="acceptPrivacyPolicy"
              checked={formData.acceptPrivacyPolicy}
              onChange={handleChange}
              required
            />
            Ich akzeptiere die <a href="/Datenschutz" className="privacy-policy-link">Datenschutzerklärung</a>.
          </label>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input className='form-check-input me-2'
              type="checkbox"
              name="subscribeNewsletter"
              checked={formData.subscribeNewsletter}
              onChange={handleChange}
            />
            Ich möchte den Grüne-Weltweit-Newsletter beziehen.
          </label>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!isFormValid} // Disable the button if the privacy policy checkbox is not checked
        >
          Absenden
        </button>
      </form>
    </div>
    </div>
  );
};

export default ContactForm;
