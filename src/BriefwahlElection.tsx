import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/CSS/ContactForm.css"; // Import the CSS file for styling
import '../src/CSS/ButtonStyle.css';
import AlertPopup from "./AlertPopup";

const BriefwahlElection = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Initially disabled
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Country: "",
    Comment: "",
    Created: new Date()
      .toISOString()
      .slice(0, 19)
      .replace("T", " "),
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Function to check if all fields are filled
  const validateForm = () => {
    const { FirstName, LastName } = formData;
    return FirstName && LastName;
  };

  // Update button disabled state when form data changes
  useEffect(() => {
    setIsButtonDisabled(!validateForm());
  }, [formData]); // Run this check every time formData changes

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiEndpoint =
      "https://gruene-weltweit.de/SPPublicAPIs/insertelectiondata.php";

    try {
      // Send POST request with form data
      const response = await axios.post(apiEndpoint, formData);

      // Handle success
      console.log("Form submitted successfully:", response.data);
      setAlertMessage("Vielen Dank für Deine Hilfe!");
      setShowAlert(true);
      setFormData({
        FirstName: "",
        LastName: "",
        Country: "",
        Comment: "",
        Created: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
      });
      setIsButtonDisabled(true); // Disable the button after submit
    } catch (error) {
      // Handle error
      console.error("Error submitting form:", error);
      alert("There was an error submitting your form. Please try again later.");
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="contact-form-bg">
      <div className="contact-form-container">
        <h2 className="contact-form-title">Wahlkampf-aus-der-Ferne</h2>
        <form className="contact-form">
          <div className="input-group">
            <label htmlFor="FirstName">First Name<span className="text-danger">*</span></label>
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
            <label htmlFor="LastName">Last Name<span className="text-danger">*</span></label>
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
              rows={10}
            />
          </div>

          <button
            type="submit"
            className={`submit-button ${isButtonDisabled ? "disabled" : ""}`}
            disabled={isButtonDisabled}
            onClick={handleSubmit}
          >
            Absenden
          </button>
        </form>
      </div>
      {showAlert && (
        <AlertPopup message={alertMessage} onClose={handleCloseAlert} />
      )}
    </div>
  );
};

export default BriefwahlElection;
