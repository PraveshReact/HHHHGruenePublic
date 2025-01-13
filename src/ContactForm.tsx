import React, { useState } from 'react';
import axios from 'axios';

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
    
    // Example API endpoint (replace with your actual API URL)
    const apiEndpoint = 'https://gruene-weltweit.de/SPPublicAPIs/insertData.php';

    try {
      // Send POST request with form data
      const response = await axios.post(apiEndpoint, formData);
      // Handle success
      console.log('Form submitted successfully:', response.data);
      alert('Your message has been sent successfully!');
    } catch (error) {
      // Handle error
      console.error('Error submitting form:', error);
      alert('There was an error submitting your form. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">E-Mail*</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="firstName">Vorname</label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="lastName">Nachname</label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="message">Meine Frage / Mein Anliegen</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="acceptPrivacyPolicy"
            checked={formData.acceptPrivacyPolicy}
            onChange={handleChange}
            required
          />
          Ich akzeptiere die <a href="/privacy-policy">Datenschutzerklärung</a>.
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="subscribeNewsletter"
            checked={formData.subscribeNewsletter}
            onChange={handleChange}
          />
          Ich möchte den Grüne-Weltweit-Newsletter beziehen.
        </label>
      </div>

      <button type="submit">Absenden</button>
    </form>
  );
};

export default ContactForm;
