import React, { useState } from 'react';
import axios from 'axios';
import '../src/CSS/ContactForm.css'; // Import the CSS file for styling

const BriefwahlElection = () => {
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Country: '',
        Comment: '',
        // acceptPrivacyPolicy: false,
        // subscribeNewsletter: false
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

        const apiEndpoint = 'https://gruene-weltweit.de/SPPublicAPIs/insertelectiondata.php';

        try {
            // Send POST request with form data
            const response = await axios.post(apiEndpoint, formData);

            // Handle success
            console.log('Form submitted successfully:', response.data);
            alert('Your Form submitted successfully!');
            setFormData({
                FirstName: '',
                LastName: '',
                Country: '',
                Comment: '',
                // acceptPrivacyPolicy: false,
                // subscribeNewsletter: false
            });

        } catch (error) {
            // Handle error
            console.error('Error submitting form:', error);
            alert('There was an error submitting your form. Please try again later.');
        }
    };

    // Check if the privacy policy checkbox is checked
   // const isFormValid = formData.acceptPrivacyPolicy; // The form will only be valid if this is true

    return (
        <div className="contact-form-bg">
            <div className="contact-form-container">
                <h2 className="contact-form-title">Wahlkampf-aus-der-Ferne</h2>
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="FirstName">First Name</label>
                        <input
                            type="text"
                            id="FirstName"
                            name="FirstName"
                            value={formData.FirstName}
                            onChange={handleChange}
                            className="form-input m-0"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="LastName">Last Name</label>
                        <input
                            type="text"
                            id="LastName"
                            name="LastName"
                            value={formData.LastName}
                            onChange={handleChange}
                            className="form-input m-0"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="Country">Country</label>
                        <input
                            type="text"
                            id="Country"
                            name="Country"
                            value={formData.Country}
                            onChange={handleChange}
                            className="form-input m-0"
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="Comment">Comment</label>
                        <textarea
                            id="Comment"
                            name="Comment"
                            value={formData.Comment}
                            onChange={handleChange}
                            required
                            className="form-input m-0"
                            rows={4} // Increase the rows to make the textarea taller
                        />
                    </div>

                    {/* <div className="checkbox-group">
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
                    </div> */}

                    <button
                        type="submit"
                        className="submit-button"
                        //disabled={!isFormValid} // Disable the button if the privacy policy checkbox is not checked
                    >
                        Absenden
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BriefwahlElection;
