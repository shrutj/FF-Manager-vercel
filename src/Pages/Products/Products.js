import React, { useState } from 'react';
import ManageProduct from './ManageProducts';
import AddProduct from './AddProduct';
import Header from '../Header';
import Footer from '../Footer';
import '../Styles/Products/Products.css'; // Adjust the path if necessary

const Products = ({onLogout, database, Ref, set, products, setProducts, update, remove, homepageData}) => {
  const [activeComponent, setActiveComponent] = useState('allProducts');

  const renderComponent = () => {
    console.log('homepageData', homepageData);
    switch (activeComponent) {
      case 'allProducts':
        return <ManageProduct database={database} Ref={Ref} Products={products} SetProducts={setProducts} update={update} remove={remove} homepageData={homepageData} />;
      case 'addProduct':
        return <AddProduct database={database} Ref={Ref} set={set} homepageData={homepageData} />;
      default:
        return <ManageProduct database={database} Ref={Ref} Products={products} SetProducts={setProducts} update={update} remove={remove} homepageData={homepageData} />;
    }
  };

  return (
    <div className='products-comp-container'>
      <Header onLogout={onLogout} />
      <div className="products-container">
        <div className="products-sidebar">
          <button onClick={() => setActiveComponent('allProducts')}>All Products</button>
          <button onClick={() => setActiveComponent('addProduct')}>Add New Product</button>
        </div>
        <div className="products-content">
          {renderComponent()}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Products;
