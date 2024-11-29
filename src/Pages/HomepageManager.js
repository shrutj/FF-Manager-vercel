import React, { useState } from 'react';
import './Styles/HomepageManager.css'; // Ensure this file exists
import Footer from './Footer';
import Header from './Header';

// Import FontAwesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Import the Trash icon

const HomepageManager = ({ onLogout, database, Ref, update, homepageData, remove }) => {
  // Use default values to avoid errors if homepageData is undefined or missing keys
  const [categories, setCategories] = useState(homepageData?.categories || [{ name: '', image: '' }]);
  const [slideshowImages, setSlideshowImages] = useState(homepageData?.slideshowImages || ['']);
  const [sections, setSections] = useState(homepageData?.sections || [{ sectionName: '', itemIds: [''] }]);
  const [sizeChart, setSizeChart] = useState(homepageData?.sizeChart || [{ size: '', chest: '', length: '' }]);

  // Handling Category Updates
  const handleCategoryChange = (index, field, value) => {
    const newCategories = [...categories];
    newCategories[index][field] = value;
    setCategories(newCategories);
  };

  const addCategory = () => {
    setCategories([...categories, { name: '', image: '' }]);
  };

  const removeCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  // Handling Slideshow Image Updates
  const handleSlideshowImageChange = (index, value) => {
    const newImages = [...slideshowImages];
    newImages[index] = value;
    setSlideshowImages(newImages);
  };

  const addSlideshowImage = () => {
    setSlideshowImages([...slideshowImages, '']);
  };

  const removeSlideshowImage = (index) => {
    const newImages = slideshowImages.filter((_, i) => i !== index);
    setSlideshowImages(newImages);
  };

  // Handling Section Updates
  const handleSectionChange = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const addItemId = (sectionIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].itemIds.push('');
    setSections(newSections);
  };

  const removeItemId = (sectionIndex, itemIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].itemIds = newSections[sectionIndex].itemIds.filter((_, i) => i !== itemIndex);
    setSections(newSections);
  };

  const handleItemIdChange = (sectionIndex, itemIndex, value) => {
    const newSections = [...sections];
    newSections[sectionIndex].itemIds[itemIndex] = value;
    setSections(newSections);
  };

  const addSection = () => {
    setSections([...sections, { sectionName: '', itemIds: [''] }]);
  };

  const removeSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };

  // Handling Size Chart Updates
  const handleSizeChartChange = (index, field, value) => {
    const newSizeChart = [...sizeChart];
    newSizeChart[index][field] = value;
    setSizeChart(newSizeChart);
  };

  const addSizeChart = () => {
    setSizeChart([...sizeChart, { size: '', chest: '', length: '' }]);
  };

  const removeSizeChart = (index) => {
    const newSizeChart = sizeChart.filter((_, i) => i !== index);
    setSizeChart(newSizeChart);
  };

  // Save All Data
  const saveAllData = () => {
    const dataToSave = {
      categories: categories,
      slideshowImages: slideshowImages,
      sections: sections,
      sizeChart: sizeChart, // Add sizeChart data
    };
    const database_ref = Ref.ref(database, 'homepageData/');
    update(database_ref, dataToSave)
      .then(() => {
        alert('Home Page Data added successfully!!');
        console.log('Data of homepage saved in database');
      })
      .catch((error) => {
        console.log(error);
      });
    console.log('Saving all data:', dataToSave);
  };

  const removeAllData = () => {
    const database_ref = Ref.ref(database, 'homepageData/');

    remove(database_ref)
      .then(() => {
        console.log('Data Emptied.');
        alert('Data Emptied!!');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="home-container">
      <Header onLogout={onLogout} />
      <h2 className="header-title">Manage Homepage</h2>

      {/* Create Category Section */}
      <div className="section">
        <h3 className="section-header">Create Category</h3>
        {categories.map((category, index) => (
          <div key={index} className="category-inputs">
            <input
              className="input-text"
              type="text"
              placeholder="Category Name"
              value={category.name}
              onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
            />
            <input
              className="input-text"
              type="text"
              placeholder="Image URL"
              value={category.image}
              onChange={(e) => handleCategoryChange(index, 'image', e.target.value)}
            />
            <button
              className="button remove-button"
              onClick={() => removeCategory(index)}
              style={{ marginLeft: '10px' }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        ))}
        <button className="button" onClick={addCategory}>Add More Categories</button>
      </div>

      {/* Slideshow Images Section */}
      <div className="section">
        <h3 className="section-header">Slideshow Images</h3>
        {slideshowImages.map((image, index) => (
          <div key={index} className="image-inputs">
            <input
              className="input-text"
              type="text"
              placeholder="Image URL"
              value={image}
              onChange={(e) => handleSlideshowImageChange(index, e.target.value)}
            />
            <button
              className="button remove-button"
              onClick={() => removeSlideshowImage(index)}
              style={{ marginLeft: '10px' }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        ))}
        <button className="button" onClick={addSlideshowImage}>Add More Images</button>
      </div>

      {/* Sections Management */}
      <div className="section">
        <h3 className="section-header">Add Sections</h3>
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="section-inputs">
            <input
              className="input-text"
              type="text"
              placeholder="Section Name"
              value={section.sectionName}
              onChange={(e) => handleSectionChange(sectionIndex, 'sectionName', e.target.value)}
            />
            {section.itemIds.map((itemId, itemIndex) => (
              <div key={itemIndex} className="item-id-inputs">
                <input
                  className="input-text"
                  type="text"
                  placeholder="Item ID"
                  value={itemId}
                  onChange={(e) => handleItemIdChange(sectionIndex, itemIndex, e.target.value)}
                />
                <button
                  className="button remove-button"
                  onClick={() => removeItemId(sectionIndex, itemIndex)}
                  style={{ marginLeft: '10px' }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            ))}
            <button className="button" onClick={() => addItemId(sectionIndex)} style={{ marginBottom: '10px' }}>
              Add More Item IDs
            </button>
            <button
              className="button remove-button"
              onClick={() => removeSection(sectionIndex)}
              style={{ marginTop: '10px', marginLeft: '10px' }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        ))}
        <button className="button" onClick={addSection}>Add More Sections</button>
      </div>

      {/* Size Chart Section */}
      <div className="section">
        <h3 className="section-header">Size Chart <b>(NOT an HOMEPAGE OBJECT)</b></h3>
        {sizeChart.map((size, index) => (
          <div key={index} className="size-chart-inputs">
            <input
              className="input-text"
              type="text"
              placeholder="Size (e.g., S, M, L)"
              value={size.size}
              onChange={(e) => handleSizeChartChange(index, 'size', e.target.value)}
            />
            <input
              className="input-text"
              type="text"
              placeholder="Chest (in cm)"
              value={size.chest}
              onChange={(e) => handleSizeChartChange(index, 'chest', e.target.value)}
            />
            <input
              className="input-text"
              type="text"
              placeholder="Length (in cm)"
              value={size.length}
              onChange={(e) => handleSizeChartChange(index, 'length', e.target.value)}
            />
            <button
              className="button remove-button"
              onClick={() => removeSizeChart(index)}
              style={{ marginLeft: '10px' }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        ))}
        <button className="button" onClick={addSizeChart}>Add More Sizes</button>
      </div>

      {/* Save All Button */}
      <div className="section">
        <button className="button" style={{ marginRight: '10px', marginBottom: '10px' }} onClick={saveAllData}>
          Save All Data
        </button>
        <button className="button" onClick={removeAllData}>Remove All Data</button>
      </div>

      <Footer />
    </div>
  );
};

export default HomepageManager;
