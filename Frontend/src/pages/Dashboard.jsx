import "./dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Es tiempo de buen tiempo</h1>
        <p>
          Si quieres disfrutar de un momento de relax al aire libre, no hace falta que te vayas muy lejos.
          Convierte tu balcón o terraza en un remanso de paz.
        </p>
        <button className="cta-button">Ver productos de terraza y jardín</button>
      </header>
      <section className="products-section">
        <div className="product-card">
          <img src="https://via.placeholder.com/300x200" alt="Producto 1" />
          <h3>HAVSTEN</h3>
          <p>Sillón int/ext, beige</p>
          <p className="price">€245/ud</p>
        </div>
        <div className="product-card">
          <img src="https://via.placeholder.com/300x200" alt="Producto 2" />
          <h3>Producto 2</h3>
          <p>Descripción breve del producto.</p>
          <p className="price">€199</p>
        </div>
        <div className="product-card">
          <img src="https://via.placeholder.com/300x200" alt="Producto 3" />
          <h3>Producto 3</h3>
          <p>Descripción breve del producto.</p>
          <p className="price">€149</p>
        </div>
      </section>
    </div>
  );
}
