import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { gql } from "@apollo/client";

const NEW_SALE = gql`
  mutation NewSale($username: String!, $total: Float!, $payment: String!) {
    newSale(username: $username, total: $total, payment: $payment) {
      id
      username
      total
      payment
    }
  }
`;

const NEW_SALE_PRODUCTS = gql`
  mutation NewSaleProducts($saleId: Int!, $productId: Int!, $quantity: Int!) {
    newSaleProducts(
      saleId: $saleId
      productId: $productId
      quantity: $quantity
    ) {
      sale_id
      product_id
      quantity
    }
  }
`;

const EDIT_PRODUCT = gql`
  mutation EditProduct(
    $id: ID!
    $name: String
    $price: Float
    $category: String
    $barcode: String
    $stock: Int
    $username: String
  ) {
    editProduct(
      id: $id
      name: $name
      price: $price
      category: $category
      barcode: $barcode
      stock: $stock
      username: $username
    ) {
      id
      name
      price
      category
      barcode
      stock
      username
    }
  }
`;

export default function Payment({ price, cart, isOpen, onClose }) {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cashAmount, setCashAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [change, setChange] = useState(0);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const [newSale] = useMutation(NEW_SALE);
  const [newSaleProducts] = useMutation(NEW_SALE_PRODUCTS);
  const [editProduct] = useMutation(EDIT_PRODUCT);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setIsPaymentComplete(false);
  };

  useEffect(() => {
    setTotalAmount(
      cart.reduce((total, item) => total + item.price * item.quantity, 0)
    );
  }, [cart]);

  const handleCashPayment = () => {
    if (cashAmount >= totalAmount) {
      setChange(cashAmount - totalAmount);
      setIsPaymentComplete(true);
    } else {
      alert("El monto recibido es insuficiente.");
    }
  };

  const simulatePrint = async () => {
    setIsPrinting(true);
    try {
      const { data } = await newSale({
        variables: {
          username: localStorage.getItem("user"),
          total: totalAmount,
          payment: paymentMethod,
        },
      });

      const saleId = data.newSale.id;
      await Promise.all(
        cart.map(async (item) => {
          try {
            await newSaleProducts({
              variables: {
                saleId: parseInt(saleId, 10),
                productId: parseInt(item.id, 10),
                quantity: item.quantity,
              },
            });
          } catch (error) {
            console.error("Error adding product to sale:", error);
            console.log(JSON.stringify(error, null, 2));
          }

          try {
            await editProduct({
              variables: {
                id: item.id,
                name: item.name,
                price: item.price,
                category: item.category,
                barcode: item.barcode,
                stock: item.stock - item.quantity,
                username: localStorage.getItem("user"),
              },
            });
          } catch (error) {
            console.error("Error updating product stock:", error);
          }
        })
      );
      setTimeout(() => {
        alert("¡Recibo impreso!");
        setIsPrinting(false);
        setIsPaymentComplete(true);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error al crear la venta:", error);
      alert(
        "Hubo un problema al procesar tu pago. Por favor, intenta nuevamente."
      );
      setIsPrinting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
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
                  Monto total: <span className="font-bold">${totalAmount}</span>
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
                  Cambio:{" "}
                  <span className="font-bold">${change.toFixed(2)}</span>
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
                onClose();
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
