import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";

const GET_LAST_SALES = gql`
  query GetLastSales($username: String!) {
    lastSales(username: $username) {
      id
      username
      total
      payment
      date
    }
  }
`;

const GET_SALE_PRODUCTS = gql`
  query GetSaleProducts($saleId: Int!) {
    saleProducts(saleId: $saleId) {
      product_id
      quantity
      name
    }
  }
`;

export default function CurrentSales() {
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [saleProducts, setSaleProducts] = useState({});

  const { loading, error, data } = useQuery(GET_LAST_SALES, {
    variables: { username: localStorage.getItem("user") },
  });

  const { data: saleProductsData } = useQuery(GET_SALE_PRODUCTS, {
    variables: { saleId: selectedSaleId },
  });

  useEffect(() => {
    if (saleProductsData && selectedSaleId) {
      if (selectedSaleId === null) {
        return;
      }
      setSaleProducts((prev) => ({
        ...prev,
        [selectedSaleId]: saleProductsData.saleProducts,
      }));
    }
  }, [saleProductsData, selectedSaleId]);

  if (loading) return <p>Cargando últimas ventas...</p>;
  if (error) return <p>Error al cargar las ventas: {error.message}</p>;

  return (
    <div className="main">
      <h1 className="text-3xl font-bold text-gray-900">Últimas Ventas</h1>

      {data.lastSales.length === 0 ? (
        <p className="text-gray-600">No hay ventas recientes.</p>
      ) : (
        <div className="mt-6 space-y-6">
          {data.lastSales.map((sale, index) => (
            <div
              key={sale.id}
              className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-300"
              onClick={() => setSelectedSaleId(parseInt(sale.id, 10))}
            >
              <h2 className="text-xl font-semibold text-gray-800">
                Venta #{index + 1}
              </h2>
              <p className="text-gray-600">Total: ${sale.total}</p>
              <p className="text-gray-600">Método de Pago: {sale.payment}</p>
              <p className="text-gray-600">
                Fecha: {new Date(parseInt(sale.date)).toLocaleDateString()}
              </p>
              {saleProducts[sale.id]?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Productos:
                  </h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {saleProducts[sale.id].map((product) => (
                      <li key={product.product_id}>
                        Producto ID: {product.product_id}, Cantidad:{" "}
                        {product.quantity}, Nombre: {product.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
