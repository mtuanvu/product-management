const express = require('express');
const Product = require('../models/product');
const router = express.Router();

// Thêm sản phẩm mới
router.post('/products', async (req, res) => {
  try {
    const { ProductCode, ProductName, ProductDate, ProductOriginPrice, Quantity, ProductStoreCode } = req.body;
    const newProduct = new Product({
      ProductCode, ProductName, ProductDate, ProductOriginPrice, Quantity, ProductStoreCode
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lấy danh sách sản phẩm
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật sản phẩm
  router.put('/products/:id', async (req, res) => {
    try {
      const { ProductCode, ProductName, ProductDate, ProductOriginPrice, Quantity, ProductStoreCode } = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { ProductCode, ProductName, ProductDate, ProductOriginPrice, Quantity, ProductStoreCode },
        { new: true }
      );
      if (!updatedProduct) return res.status(404).json({ error: 'Product Not Found!' });
      res.json(updatedProduct);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

// Xóa sản phẩm
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product Not Found!' });
    res.json({ message: 'Deleted Product' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
