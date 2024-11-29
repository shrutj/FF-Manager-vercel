import React, { useState, useEffect } from 'react';
import '../Styles/Products/AddProduct.css'; // Make sure the path is correct

const AddProduct = ({ database, Ref, set, homepageData }) => {
  const generateUniqueId = () => {
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');
    return timestamp;
  };

  const [productDetails, setProductDetails] = useState({
    id: generateUniqueId(), // Pre-filled with current date and time
    name: '',
    description: '',
    imageUrls: [''],
    dimensions: '',
    size: '',
    category: '',
    price: '', // Selling price (after discount)
    priceWithoutDiscount: '', // Original price (before discount)
    brand: '',
    material: '',
    color: '',
    weight: '',
    availability: '',
    quantityAvailable: '',
    returnPolicy: '', // New field for return policy
    sizeChart: '', // New field for size chart availability (Yes/No)
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (homepageData) {
      const Categories = homepageData.map(category => category.name);
      setCategories(Categories);
    }
  }, [homepageData]);

  const availabilityOptions = [
    { value: '', label: 'Select Availability' },
    { value: 'available_to_preorder', label: 'Available to Preorder' },
    { value: 'yes', label: "Yes, It's Available" },
    { value: 'will_be_available_soon', label: 'Will Be Available Soon' }
  ];

  const returnPolicyOptions = [
    { value: '', label: 'Select Return Policy' },
    { value: 'no_return', label: 'No Return Policy' },
    { value: '7_days_replacement', label: '7 Days Replacement Policy' },
    { value: '7_days_return', label: '7 Days Return Policy' }
  ];

  const sizeChartOptions = [
    { value: '', label: 'Select Size Chart Availability' },
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('imageUrl')) {
      const index = parseInt(name.split('_')[1]);
      const newImageUrls = [...productDetails.imageUrls];
      newImageUrls[index] = value;
      setProductDetails({ ...productDetails, imageUrls: newImageUrls });
    } else {
      setProductDetails({ ...productDetails, [name]: value });
    }
  };

  const handleAddImage = () => {
    setProductDetails({ ...productDetails, imageUrls: [...productDetails.imageUrls, ''] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const database_ref = Ref.ref(database, 'items/' + productDetails.id);
      set(database_ref, productDetails);
      alert("Item added successfully.");
    } catch (error) {
      console.error(error);
      alert(error);
    }

    setProductDetails({
      ...productDetails,
      id: generateUniqueId(), // Reset with a new unique ID
      name: '',
      description: '',
      imageUrls: [''],
      dimensions: '',
      size: '',
      category: '',
      price: '',
      priceWithoutDiscount: '', // Reset original price
      brand: '',
      material: '',
      color: '',
      weight: '',
      availability: '',
      quantityAvailable: '',
      returnPolicy: '', // Reset the return policy
      sizeChart: '' // Reset size chart availability
    });
  };

  return (
    <div className="add-product__container">
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit} className="add-product__form">
        <input
          type="text"
          name="id"
          placeholder="Product ID"
          value={productDetails.id}
          readOnly // Make the input read-only
        />
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productDetails.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={productDetails.description}
          onChange={handleChange}
          required
        />

        {/* Render multiple image URL inputs */}
        {productDetails.imageUrls.map((imageUrl, index) => (
          <input
            key={index}
            type="text"
            name={`imageUrl_${index}`}
            placeholder={`Image URL ${index + 1}`}
            value={imageUrl}
            onChange={handleChange}
            required
          />
        ))}
        <button type="button" onClick={handleAddImage} className="add-product__add-image-button">
          Add More Image
        </button>

        <input
          type="text"
          name="dimensions"
          placeholder="Product Dimensions"
          value={productDetails.dimensions}
          onChange={handleChange}
        />
        <input
          type="text"
          name="size"
          placeholder="Size"
          value={productDetails.size}
          onChange={handleChange}
        />
        <select
          name="category"
          value={productDetails.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Price Input */}
        <div className="price-container">
          <input
            type="number"
            name="priceWithoutDiscount"
            placeholder="Price (Without Discount)"
            value={productDetails.priceWithoutDiscount}
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Price (Discounted)"
            value={productDetails.price}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={productDetails.brand}
          onChange={handleChange}
        />
        <input
          type="text"
          name="material"
          placeholder="Material"
          value={productDetails.material}
          onChange={handleChange}
        />
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={productDetails.color}
          onChange={handleChange}
        />
        <input
          type="number"
          name="weight"
          placeholder="Item Weight"
          value={productDetails.weight}
          onChange={handleChange}
        />
        <select
          name="availability"
          value={productDetails.availability}
          onChange={handleChange}
          required
        >
          {availabilityOptions.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>

        {(productDetails.availability === 'available_to_preorder' || productDetails.availability === 'yes') && (
          <input
            type="number"
            name="quantityAvailable"
            placeholder="Quantity Available"
            value={productDetails.quantityAvailable}
            onChange={handleChange}
            required
          />
        )}

        {/* New Return Policy Field */}
        <select
          name="returnPolicy"
          value={productDetails.returnPolicy}
          onChange={handleChange}
          required
        >
          {returnPolicyOptions.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>

        {/* New Size Chart Field */}
        <select
          name="sizeChart"
          value={productDetails.sizeChart}
          onChange={handleChange}
          required
        >
          {sizeChartOptions.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>

        <button type="submit" className="add-product__button">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
