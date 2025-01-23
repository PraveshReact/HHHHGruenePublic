import React, { useState } from 'react';
import axios from 'axios';
import '../src/CSS/ContactForm.css'; // Import the CSS file for styling
import '../src/CSS/ButtonStyle.css';
import AlertPopup from './AlertPopup';

const ContactForm = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    message: '',
    Created: new Date().toISOString().slice(0, 19).replace('T', ' '),
    acceptPrivacyPolicy: false,
    subscribeNewsletter: false,
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [formErrors, setFormErrors]:any = useState({
    email: false,
    acceptPrivacyPolicy: false,
  });

  // Email validation function
  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => {
      const updatedData = {
        ...prevState,
        [name]: type === 'checkbox' ? checked : value,
      };

      // Revalidate email whenever input is changed
      if (name === 'email') {
        const isValidEmail = isEmailValid(value);
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          email: value.trim() === '' ? 'empty' : isValidEmail ? false : 'invalid',
        }));
      }

      // Check if the privacy policy checkbox is checked to enable the button
      setIsButtonDisabled(!updatedData.acceptPrivacyPolicy);

      return updatedData;
    });
  };

  // Validate form before submission
  const validateForm = () => {
    const errors = {
      email: formData.email.trim() === '' ? 'empty' : !isEmailValid(formData.email) ? 'invalid' : false,
      acceptPrivacyPolicy: !formData.acceptPrivacyPolicy,
    };
    setFormErrors(errors);
    return !errors.email && !errors.acceptPrivacyPolicy; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Prevent form submission if there are validation errors
    }

    const apiEndpoint = 'https://gruene-weltweit.de/SPPublicAPIs/insertData.php';

    try {
      // Send POST request with form data
      const response = await axios.post(apiEndpoint, formData);

      // Handle success
      console.log('Form submitted successfully:', response.data);
      setAlertMessage('Vielen Dank für Deine Hilfe!');
      setShowAlert(true);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        message: '',
        Created: new Date().toISOString().slice(0, 19).replace('T', ' '),
        acceptPrivacyPolicy: false,
        subscribeNewsletter: false,
      });
      setIsButtonDisabled(true); // Disable the button after submit
    } catch (error) {
      // Handle error
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again later.');
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="contact-form-bg">
      <div className="contact-form-container">
        <h2 className="contact-form-title">Kontakt</h2>
        <form className="contact-form">
          <div className="input-group">
            <label htmlFor="email">
              E-Mail<span className="text-danger">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input m-0"
            />
            {formErrors.email === 'empty' && (
              <span className="error-text">Das ist ein Pflichtfeld.</span>
            )}
            {formErrors.email === 'invalid' && (
              <span className="error-text">Bitte geben Sie eine gültige E-Mail-Adresse ein.</span>
            )}
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
            <label className="checkbox-label gap-1">
              <input
                className=""
                type="checkbox"
                name="acceptPrivacyPolicy"
                checked={formData.acceptPrivacyPolicy}
                onChange={handleChange}
                required
              />
              Ich akzeptiere die <span>
                <a href="/Datenschutz" target="_blank" rel="noopener noreferrer" className="privacy-policy-link">Datenschutzerklärung</a>
              </span>
              <span className="text-danger">*</span>
            </label>
            {formErrors.acceptPrivacyPolicy && (
              <span className="error-text">Das ist ein Pflichtfeld.</span>
            )}
          </div>

          <div className="checkbox-group">
            <label className="align-items-baseline checkbox-label gap-1">
              <input
                className=""
                type="checkbox"
                name="subscribeNewsletter"
                checked={formData.subscribeNewsletter}
                onChange={handleChange}
              />
              <span>Ich will bei Grüne-Weltweit mitmachen. Kontaktiert mich gerne zu Neuigkeiten in meiner Region. (Hinweis zum&nbsp;
                <a href="/Datenschutz" target="_blank" rel="noopener noreferrer" className="privacy-policy-link">Datenschutz</a>)
              </span>
            </label>
          </div>

          <button
            type="submit"
            className={`submit-button ${isButtonDisabled ? 'disabled' : ''}`}
            disabled={isButtonDisabled}
            onClick={handleSubmit}
          >
            Absenden
          </button>
        </form>
        {showAlert && <AlertPopup message={alertMessage} onClose={handleCloseAlert} />}
      </div>
    </div>
  );
};

export default ContactForm;
