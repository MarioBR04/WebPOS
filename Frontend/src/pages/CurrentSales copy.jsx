import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Importación automática de Chart.js

// Consulta GraphQL para obtener productos y sus cantidades vendidas
const GET_TOP_PRODUCTS = gql`
  query GetTopProducts {
    sales {
      id
    }
    products {
      id
      name
    }
    saleProducts {
      product_id
      quantity
    }
  }
`;

export default function CurrentSales() {
  const { loading, error, data } = useQuery(GET_TOP_PRODUCTS);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data) {
      // Combinar datos de productos y cantidades vendidas
      const productSales = {};

      data.saleProducts.forEach((saleProduct) => {
        const { product_id, quantity } = saleProduct;
        if (!productSales[product_id]) {
          productSales[product_id] = 0;
        }
        productSales[product_id] += quantity;
      });

      const labels = [];
      const quantities = [];

      data.products.forEach((product) => {
        if (productSales[product.id]) {
          labels.push(product.name);
          quantities.push(productSales[product.id]);
        }
      });

      // Preparar datos para el gráfico
      setChartData({
        labels,
        datasets: [
          {
            label: "Cantidad Vendida",
            data: quantities,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data]);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error al cargar los datos: {error.message}</p>;

  return (
    <div className="current-sales">
      <h1 className="text-3xl font-bold text-gray-900">Productos más vendidos</h1>
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: true },
            },
          }}
        />
      ) : (
        <p>No hay datos disponibles para mostrar.</p>
      )}
    </div>
  );
}
