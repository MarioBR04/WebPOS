import React, { useState } from "react";

export default function Payment() {
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [errors, setErrors] = useState({
    cardNumber: false,
    expirationDate: false,
    cvv: false,
    cardholderName: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: false }); // Limpia el error cuando se modifica el campo
  };

  const handlePayment = (e) => {
    e.preventDefault();
    const newErrors = {
      cardNumber: formData.cardNumber.trim() === "",
      expirationDate: formData.expirationDate.trim() === "",
      cvv: formData.cvv.trim() === "",
      cardholderName: formData.cardholderName.trim() === "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);
    if (!hasErrors) {
      setIsPaymentComplete(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      {!isPaymentComplete ? (
        <>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Payment Details
          </h1>
          <form className="flex flex-col" onSubmit={handlePayment}>
            <label
              className={`mb-2 text-sm font-medium ${
                errors.cardNumber ? "text-red-600" : "text-gray-700"
              }`}
            >
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              placeholder="Enter your card number"
              value={formData.cardNumber}
              onChange={handleChange}
              className={`p-2 border ${
                errors.cardNumber ? "border-red-600" : "border-gray-300"
              } rounded-md mb-4`}
            />

            <label
              className={`mb-2 text-sm font-medium ${
                errors.expirationDate ? "text-red-600" : "text-gray-700"
              }`}
            >
              Expiration Date
            </label>
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              className={`p-2 border ${
                errors.expirationDate ? "border-red-600" : "border-gray-300"
              } rounded-md mb-4`}
            />

            <label
              className={`mb-2 text-sm font-medium ${
                errors.cvv ? "text-red-600" : "text-gray-700"
              }`}
            >
              CVV
            </label>
            <input
              type="text"
              name="cvv"
              placeholder="Enter CVV"
              value={formData.cvv}
              onChange={handleChange}
              className={`p-2 border ${
                errors.cvv ? "border-red-600" : "border-gray-300"
              } rounded-md mb-4`}
            />

            <label
              className={`mb-2 text-sm font-medium ${
                errors.cardholderName ? "text-red-600" : "text-gray-700"
              }`}
            >
              Cardholder Name
            </label>
            <input
              type="text"
              name="cardholderName"
              placeholder="Enter cardholder name"
              value={formData.cardholderName}
              onChange={handleChange}
              className={`p-2 border ${
                errors.cardholderName ? "border-red-600" : "border-gray-300"
              } rounded-md mb-6`}
            />

            <button
              type="submit"
              className="bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
            >
              Complete Payment
            </button>
          </form>
        </>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-700 mb-6">
            Your payment has been processed. A confirmation email has been sent
            to your inbox.
          </p>
          <button
            className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-900 transition"
            onClick={() => setIsPaymentComplete(false)}
          >
            Back to Payment
          </button>
        </div>
      )}
    </div>
  );
}
