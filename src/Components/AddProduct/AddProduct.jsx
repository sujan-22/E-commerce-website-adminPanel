import React, { useState } from "react";
import "./AddProduct.css";
import axios from "axios";

const AddProduct = () => {
  const [Images, setImages] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: "",
    images: [],
    category: "smartphones",
    rating: 0,
    price: "",
    onSale: false,
    new_price: "",
  });

  const imageHandler = (files) => {
    const fileListArray = Array.from(files);
    setImages([...Images, ...fileListArray]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const toggleSale = (e) => {
    setProductDetails({ ...productDetails, onSale: e.target.checked });
  };

  const Add_Product = async () => {
    const formData = new FormData();

    for (let i = 0; i < Images.length; i++) {
      formData.append("product", Images[i]);
    }

    try {
      const uploadResponse = await axios.post(
        "http://localhost:4000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (uploadResponse.data.success) {
        const responseData = uploadResponse.data;
        const product = { ...productDetails, images: responseData.image_urls };

        const addProductResponse = await axios.post(
          "http://localhost:4000/addproduct",
          product
        );

        if (addProductResponse.data.success) {
          alert("Successfully added");
        } else {
          alert("Failed to add");
        }
      } else {
        alert("Failed to upload images");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred");
    }
  };

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.price}
            onChange={changeHandler}
            type="text"
            name="price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>On Sale</p>
          <input
            type="checkbox"
            name="onSale"
            checked={productDetails.onSale}
            onChange={toggleSale}
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
            disabled={!productDetails.onSale}
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="smartphones">Smartphones</option>
          <option value="laptops">Laptop</option>
          <option value="furniture">Furniture</option>
          <option value="home-decoration">Home-Decoration</option>
          <option value="lighting">Lighting</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <input
          onChange={(e) => {
            imageHandler(e.target.files);
          }}
          type="file"
          name="image"
          id="file-input"
          multiple
        />
      </div>
      <div className="selected-images">
        {Images.map((image, index) => (
          <img
            key={index}
            src={URL.createObjectURL(image)}
            alt={`image-${index}`}
            style={{ width: "100px", height: "100px", margin: "10px" }}
          />
        ))}
      </div>

      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
