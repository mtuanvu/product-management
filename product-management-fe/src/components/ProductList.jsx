import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  notification,
} from "antd";

const { Option } = Select;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    ProductCode: "",
    ProductName: "",
    ProductDate: "",
    ProductOriginPrice: "",
    Quantity: "",
    ProductStoreCode: "",
  });
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' for ascending, 'desc' for descending

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async () => {
    if (
      isNaN(newProduct.ProductOriginPrice) ||
      newProduct.ProductOriginPrice <= 0
    ) {
      notification.error({ message: "Please enter a valid origin price" });
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/products", newProduct);
      fetchProducts();
      setIsModalOpen(false);
      setNewProduct({
        ProductCode: "",
        ProductName: "",
        ProductDate: "",
        ProductOriginPrice: "",
        Quantity: "",
        ProductStoreCode: "",
      });
      notification.success({ message: "Product added successfully!" });
    } catch (err) {
      console.error(err);
      notification.error({ message: "Failed to add product!" });
    }
  };

  const handleEditProduct = async () => {
    try {
      if (!editingProduct || !editingProduct._id) {
        console.error("Product ID is missing");
        return;
      }
      await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        editingProduct
      );
      fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
      notification.success({ message: "Product updated successfully!" });
    } catch (err) {
      console.error(err);
      notification.error({ message: "Failed to update product!" });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
      notification.success({ message: "Product deleted successfully!" });
    } catch (err) {
      console.error(err);
      notification.error({ message: "Failed to delete product!" });
    }
  };

  // Function to sort products by store code
  const sortProducts = (order) => {
    const sortedProducts = [...products].sort((a, b) => {
      if (order === "asc") {
        return a.ProductStoreCode.localeCompare(b.ProductStoreCode);
      } else {
        return b.ProductStoreCode.localeCompare(a.ProductStoreCode);
      }
    });
    setProducts(sortedProducts);
  };

  return (
    <div>
      <h1>Product Management</h1>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add New Product
      </Button>

      {/* Dropdown Select for sorting */}
      <Select
        value={sortOrder}
        style={{ width: 200, marginLeft: "10px" }}
        onChange={(value) => {
          setSortOrder(value);
          sortProducts(value);
        }}
      >
        <Option value="asc">Ascending Store Code</Option>
        <Option value="desc">Descending Store Code</Option>
      </Select>

      <Table
        dataSource={products}
        columns={[
          { title: "Product Code", dataIndex: "ProductCode", key: "ProductCode" },
          { title: "Product Name", dataIndex: "ProductName", key: "ProductName" },
          {
            title: "Manufacture Date",
            dataIndex: "ProductDate",
            key: "ProductDate",
            render: (text) => new Date(text).toLocaleDateString(),
          },
          { title: "Origin Price", dataIndex: "ProductOriginPrice", key: "ProductOriginPrice" },
          { title: "Quantity", dataIndex: "Quantity", key: "Quantity" },
          { title: "Store Code", dataIndex: "ProductStoreCode", key: "ProductStoreCode" },
          {
            title: "Actions",
            key: "action",
            render: (text, record) => (
              <>
                <Button
                  onClick={() => {
                    setEditingProduct(record);
                    setIsModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteProduct(record._id)}
                  danger
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]}
        rowKey="_id"
      />

      <Modal
        title={editingProduct ? "Edit Product" : "Add New Product"}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={editingProduct ? handleEditProduct : handleAddProduct}
      >
        <Form layout="vertical">
          <Form.Item label="Product Code">
            <Input
              value={editingProduct?.ProductCode || newProduct.ProductCode}
              onChange={(e) => {
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      ProductCode: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, ProductCode: e.target.value });
              }}
            />
          </Form.Item>
          <Form.Item label="Product Name">
            <Input
              value={editingProduct?.ProductName || newProduct.ProductName}
              onChange={(e) => {
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      ProductName: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, ProductName: e.target.value });
              }}
            />
          </Form.Item>
          <Form.Item label="Manufacture Date">
            <Input
              type="date"
              value={
                editingProduct
                  ? new Date(editingProduct.ProductDate)
                      .toISOString()
                      .split("T")[0]
                  : newProduct.ProductDate
              }
              onChange={(e) => {
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      ProductDate: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, ProductDate: e.target.value });
              }}
            />
          </Form.Item>
          <Form.Item label="Origin Price">
            <Input
              value={
                editingProduct?.ProductOriginPrice ||
                newProduct.ProductOriginPrice
              }
              onChange={(e) => {
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      ProductOriginPrice: e.target.value,
                    })
                  : setNewProduct({
                      ...newProduct,
                      ProductOriginPrice: e.target.value,
                    });
              }}
            />
          </Form.Item>
          <Form.Item label="Quantity">
            <Input
              value={editingProduct?.Quantity || newProduct.Quantity}
              onChange={(e) => {
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      Quantity: e.target.value,
                    })
                  : setNewProduct({ ...newProduct, Quantity: e.target.value });
              }}
            />
          </Form.Item>
          <Form.Item label="Store Code">
            <Input
              value={
                editingProduct?.ProductStoreCode || newProduct.ProductStoreCode
              }
              onChange={(e) => {
                editingProduct
                  ? setEditingProduct({
                      ...editingProduct,
                      ProductStoreCode: e.target.value,
                    })
                  : setNewProduct({
                      ...newProduct,
                      ProductStoreCode: e.target.value,
                    });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductList;
