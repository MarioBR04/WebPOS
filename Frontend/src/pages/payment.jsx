import React, { useState } from "react";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState(""); // Para seleccionar entre tarjeta o efectivo
  const [cashAmount, setCashAmount] = useState(0); // Monto en efectivo recibido
  const [totalAmount] = useState(100); // Monto total, ajusta según tu necesidad
  const [change, setChange] = useState(0); // Cambio
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false); // Simulación de impresión

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setIsPaymentComplete(false);
  };

  const handleCashPayment = () => {
    if (cashAmount >= totalAmount) {
      setChange(cashAmount - totalAmount);
      setIsPaymentComplete(true);
    } else {
      alert("El monto recibido es insuficiente.");
    }
  };

  const simulatePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      alert("¡Recibo impreso!");
      setIsPrinting(false);
    }, 2000); // Simula la impresión del recibo con un retraso de 2 segundos
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        {!isPaymentComplete ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
              Selecciona el Método de Pago
            </h1>
            {!paymentMethod ? (
              <div className="flex flex-col items-center space-y-6">
                <button
                  onClick={() => handlePaymentMethodChange("card")}
                  className="w-full text-2xl bg-gray-800 text-white py-4 rounded hover:bg-gray-900 transition"
                >
                  Tarjeta
                </button>
                <button
                  onClick={() => handlePaymentMethodChange("cash")}
                  className="w-full text-2xl bg-gray-800 text-white py-4 rounded hover:bg-gray-900 transition"
                >
                  Efectivo
                </button>
              </div>
            ) : paymentMethod === "card" ? (
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-700 mb-6">
                  Continúa en la terminal
                </h2>
                <button
                  className="text-xl bg-gray-800 text-white py-3 px-6 rounded hover:bg-gray-900 transition"
                  onClick={() => setIsPaymentComplete(true)}
                >
                  Confirmar
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">
                  Pago en Efectivo
                </h2>
                <p className="text-lg text-center mb-6">
                  Monto total: <span className="font-bold">${totalAmount.toFixed(2)}</span>
                </p>
                <label className="mb-2 text-sm font-medium text-gray-700">
                  Ingresa el monto recibido:
                </label>
                <input
                  type="number"
                  min="0"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(Number(e.target.value))}
                  className="w-full p-3 text-lg border border-gray-300 rounded-md mb-6"
                />
                <button
                  onClick={handleCashPayment}
                  className="w-full text-2xl bg-gray-800 text-white py-4 rounded hover:bg-gray-900 transition"
                >
                  Confirmar Pago
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            {paymentMethod === "cash" ? (
              <>
                <h1 className="text-3xl font-bold text-green-600 mb-6">
                  ¡Pago Exitoso!
                </h1>
                <p className="text-lg text-gray-700 mb-6">
                  Cambio: <span className="font-bold">${change.toFixed(2)}</span>
                </p>
              </>
            ) : (
              <h1 className="text-3xl font-bold text-green-600 mb-6">
                ¡Pago Completo!
              </h1>
            )}
            <button
              className={`w-full text-2xl bg-gray-800 text-white py-4 rounded hover:bg-gray-900 transition mb-4 ${
                isPrinting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={simulatePrint}
              disabled={isPrinting}
            >
              {isPrinting ? "Imprimiendo recibo..." : "Imprimir Recibo"}
            </button>
            <button
              className="w-full text-2xl bg-gray-800 text-white py-4 rounded hover:bg-gray-900 transition"
              onClick={() => {
                setPaymentMethod("");
                setCashAmount(0);
                setChange(0);
                setIsPaymentComplete(false);
              }}
            >
              Volver a Métodos de Pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
