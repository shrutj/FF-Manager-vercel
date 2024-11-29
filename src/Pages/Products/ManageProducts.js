import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import '../Styles/Products/manageProducts.css';
import ConfirmDeleteModal from './ConfirmDeleteModal';

const ManageProducts = ({ database, Ref, set, Products, SetProducts, update, remove, homepageData }) => {
  const [searchId, setSearchId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState(Products);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (homepageData) {
      const Categories = [];
      homepageData.forEach((category) => {
        Categories.push(category.name);
      });
      setCategories(Categories);
    }
  }, [homepageData]);

  const handleDeleteRequest = (id) => {
    setProductToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    handleDelete(productToDelete);
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id));

    const database_Ref = Ref.ref(database, 'items/' + id);
    remove(database_Ref)
      .then(() => {
        alert('Data Deleted Successfully!');
      })
      .catch(error => {
        alert(error);
      });
  };

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setEditedProduct({ ...product, imageUrls: product.imageUrls || [] });
  };

  const handleSave = (id) => {
    const database_Ref = Ref.ref(database, 'items/' + id);
    const updatedData = editedProduct;

    update(database_Ref, updatedData)
      .then(() => {
        console.log('Data updated successfully');
        setProducts(products.map(product => (product.id === id ? editedProduct : product)));
        setEditingProductId(null);
        setEditedProduct({});
        alert('Data Updated Successfully!!');
      })
      .catch(error => {
        console.error('Error updating data:', error);
        alert(error);
      });
  };

  const handleCancel = () => {
    setEditingProductId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct({ ...editedProduct, [name]: value });
  };

  const handleImageUrlChange = (index, value) => {
    const updatedImageUrls = [...editedProduct.imageUrls];
    updatedImageUrls[index] = value;
    setEditedProduct({ ...editedProduct, imageUrls: updatedImageUrls });
  };

  const handleAddImageUrl = () => {
    setEditedProduct({ ...editedProduct, imageUrls: [...editedProduct.imageUrls, ''] });
  };

  const filteredProducts = products.filter(product => {
    return (
      (searchId === '' || product.id.toString().includes(searchId)) &&
      (searchName === '' || product.name.toLowerCase().includes(searchName.toLowerCase())) &&
      (category === '' || product.category === category)
    );
  });

  const currentItems = filteredProducts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="manage-products__container">
      <h1>Manage Products</h1>
      <div className="manage-products__search-bar">
        <input
          type="text"
          className="manage-products__input"
          placeholder="Search by ID"
          value={searchId}
          onChange={(e) => {
            setSearchId(e.target.value);
            setCurrentPage(0);
          }}
        />
        <input
          type="text"
          className="manage-products__input"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(0);
          }}
        />
        <select className="manage-products__select" value={category} onChange={(e) => {
          setCategory(e.target.value);
          setCurrentPage(0);
        }}>
          <option value="">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="manage-products__table-container">
        <table className="manage-products__table">
          <thead>
            <tr>
              <th className="manage-products__th">ID</th>
              <th className="manage-products__th">Name</th>
              <th className="manage-products__th">Description</th>
              <th className="manage-products__th">Images</th>
              <th className="manage-products__th">Dimensions</th>
              <th className="manage-products__th">Size</th>
              <th className="manage-products__th">Category</th>
              <th className="manage-products__th">Price</th>
              <th className="manage-products__th">Brand</th>
              <th className="manage-products__th">Material</th>
              <th className="manage-products__th">Color</th>
              <th className="manage-products__th">Weight</th>
              <th className="manage-products__th">Availability</th>
              <th className="manage-products__th">Quantity Available</th>
              <th className="manage-products__th">Return Policy</th> {/* Added column for Return Policy */}
              <th className="manage-products__th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(product => (
              <tr key={product.id}>
                <td className="manage-products__td">{product.id}</td>
                <td className="manage-products__td">
                  {editingProductId === product.id ? (
                    <input type="text" name="name" value={editedProduct.name} onChange={handleChange} style={{ width: '70px' }} />
                  ) : (
                    product.name
                  )}
                </td>
                <td className="manage-products__td">
                  {editingProductId === product.id ? (
                    <input type="text" name="description" value={editedProduct.description} onChange={handleChange} style={{ width: '140px' }} />
                  ) : (
                    product.description
                  )}
                </td>
                <td className="manage-products__td images">
                  {editingProductId === product.id ? (
                    <div>
                      {editedProduct.imageUrls.map((url, index) => (
                        <div key={index}>
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                            style={{ width: '100px', marginBottom: '5px' }}
                          />
                        </div>
                      ))}
                      <button onClick={handleAddImageUrl} className='manage-products__button' style={{ marginTop: '5px', backgroundColor: 'green' }}>Add Image URL</button>
                    </div>
                  ) : (
                    product.imageUrls.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', height: '200%' }}>
                        {product.imageUrls.map((url, index) => (
                          <img key={index} src={url} alt={`${product.name} ${index}`} />
                        ))}
                      </div>
                    ) : (
                      'No Image'
                    )
                  )}
                </td>
                <td className="manage-products__td">
                  {editingProductId === product.id ? (
                    <input type="text" name="dimensions" value={editedProduct.dimensions} onChange={handleChange} style={{ width: '70px' }} />
                  ) : (
                    product.dimensions
                  )}
                </td>
                <td className="manage-products__td">
                  {editingProductId === product.id ? (
                    <input type="text" name="size" value={editedProduct.size} onChange={handleChange} style={{ width: '60px' }} />
                  ) : (
                    product.size
                  )}
                </td>
                <td className="manage-products__td">
                  {editingProductId === product.id ? (
                    <select name="category" value={editedProduct.category} onChange={handleChange} style={{ width: '60px' }}>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                      ))}
                    </select>
                  ) : (
                    product.category
                  )}
                </td>
                <td className="manage-products__td">
                  {editingProductId === product.id ? (
                    <input type="number" name="price" value={editedProduct.price} onChange={handleChange} style={{ width: '50px' }} />
                  ) : (
                    product.price
                  )}
                </td>
                <td className="manage-products__td">
                  {editingProductId === product.id ? (
                    <input type="text" name="brand" value={editedProduct.brand} onChange={handleChange} style={{ width: '50px' }} />
                  ) : (
                    product.brand
                  )}
                </td>
                <td className="manage-products__td">
                  {editingProductId === product.id ? (
                    <input type="text" name="material" value={editedProduct.material} onChange={handleChange} style={{ width: '60px' }} />
                  ) : (
                    product.material
                  )}
                </td>
                <td className="manage-products__td">
                  {editingProductId === product.id ? (
                    <input type="text" name="color" value={editedProduct.color} onChange={handleChange} style={{ width: '50px' }} />
                  ) : (
                    product.color
                  )}
                </td>
                <td className="manage-products__td">
                  {editingProductId === product.id ? (
                    <input type="number" name="weight" value={editedProduct.weight} onChange={handleChange} style={{ width: '50px' }} />
                  ) : (
                    product.weight
                  )}
                </td>
                <td className="manage-products__td">
                  {editingProductId === product.id ? (
                    <select name="availability" value={editedProduct.availability} onChange={handleChange} style={{ width: '60px' }}>
                      <option value="available_to_preorder">Available to Pre-Order</option>
                      <option value="yes">Yes It's Available</option>
                      <option value="will_be_available_soon">Will be available soon</option>
                    </select>
                  ) : (
                    product.availability
                  )}
                </td>
                <td className="manage-products__td">
                  {editingProductId === product.id ? (
                    <input type="number" name="quantityAvailable" value={editedProduct.quantityAvailable} onChange={handleChange} style={{ width: '50px' }} />
                  ) : (
                    product.quantityAvailable
                  )}
                </td>
                <td className="manage-products__td">
                  {editingProductId === product.id ? (
                    <input type="text" name="returnPolicy" value={editedProduct.returnPolicy} onChange={handleChange} style={{ width: '100px' }} />
                  ) : (
                    product.returnPolicy
                  )}
                </td>
                <td className="manage-products__td" style={{ width: '15%' }}>
                  {editingProductId === product.id ? (
                    <>
                      <button className="manage-products__button" style={{ backgroundColor: 'green', margin: '2px' }} onClick={() => handleSave(product.id)}>Save</button>
                      <button className="manage-products__button" style={{ backgroundColor: 'gray', margin: '2px' }} onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="manage-products__button" style={{ backgroundColor: 'green', margin: '2px' }} onClick={() => handleEdit(product)}>Edit</button>
                      <button className="manage-products__button" style={{ backgroundColor: 'red', margin: '2px' }} onClick={() => handleDeleteRequest(product.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'manage-products__pagination'}
        activeClassName={'manage-products__pagination-button active'}
        previousClassName={'manage-products__pagination-button'}
        nextClassName={'manage-products__pagination-button'}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ManageProducts;
