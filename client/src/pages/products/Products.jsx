import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LayoutApp from "../../components/Layout";
import { DeleteOutlined, EditOutlined,SearchOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Table, message } from "antd";
import FormItem from "antd/lib/form/FormItem";

const options = [
  "Café",
  "Thé",
  "Jus",
  "Glaces",
  "Cocktail",
  "Mojito",
  "Smothie",
  "Frappuchino",
  "Milk Shake",
  "Milk shake",
  "Boisson",
  "Crêpe sucrée",
  "Petit Dejeuner",
  "Crêpe Salée",
  "Gauffre",
  "Cheese Cake",
  "Gateau",
  "Cake",
  "Croissant",
  "Burger",
  "Tacos",
  "Plat",
  "Baguette Farcie",
  "Omelette",
  "Pizza",
  "Chicha",
  "Panini",
  'Supplement',
  'Libanais/Makloub'
];
const Products = () => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [searchText, setSearchText] = useState('');
  const handleSearch = (value) => {
    setSearchText(value);
  };
  const filteredProductData = productData.filter(product =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const getAllProducts = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(
        "https://pos-ktdt.onrender.com/api/products/getproducts"
      );
      setProductData(data);
      dispatch({
        type: "HIDE_LOADING",
      });
      console.log(data);
    } catch (error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const handlerDelete = async (record) => {
    try {
      // Display a confirmation alert
      const confirmDelete = window.confirm("Are you sure you want to delete this product?");
      
      if (!confirmDelete) {
        return; // If the user cancels the deletion, do nothing
      }
  
      dispatch({
        type: "SHOW_LOADING",
      });
  
      await axios.post("https://pos-ktdt.onrender.com/api/products/deleteproducts", {
        productId: record._id,
      });
  
      message.success("Product Deleted Successfully!");
  
      getAllProducts();
      setPopModal(false);
  
      dispatch({
        type: "HIDE_LOADING",
      });
    } catch (error) {
      dispatch({
        type: "HIDE_LOADING",
      });
  
      message.error("Error!");
      console.log(error);
    }
  };
  

  const columns = [
    {
      title: "اسم المنتج",
      dataIndex: "name",
    },
    {
      title: "الصورة",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height={60} width={60} />
      ),
    },
    {
      title: "السعر",
      dataIndex: "price",
    },
    {
      title: "حذف او تعديل المنتج",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <DeleteOutlined
            className="cart-action"
            onClick={() => handlerDelete(record)}
          />
          <EditOutlined
            className="cart-edit"
            onClick={() => {
              setEditProduct(record);
              setPopModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  const handlerSubmit = async (value) => {
    //console.log(value);
    if (editProduct === null) {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const res = await axios.post(
          "https://pos-ktdt.onrender.com/api/products/addproducts",
          value
        );
        message.success("Product Added Successfully!");
        getAllProducts();
        setPopModal(false);
        dispatch({
          type: "HIDE_LOADING",
        });
      } catch (error) {
        dispatch({
          type: "HIDE_LOADING",
        });
        message.error("Error!");
        console.log(error);
      }
    } else {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        await axios.put("https://pos-ktdt.onrender.com/api/products/updateproducts", {
          ...value,
          productId: editProduct._id,
        });
        message.success("Product Updated Successfully!");
        getAllProducts();
        setPopModal(false);
        dispatch({
          type: "HIDE_LOADING",
        });
      } catch (error) {
        dispatch({
          type: "HIDE_LOADING",
        });
        message.error("Error!");
        console.log(error);
      }
    }
  };

  return (
    <LayoutApp>
      <h2>All Products </h2>
      <Input
        prefix={<SearchOutlined />}
        placeholder="ابحث عن المنتج"
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 200 }}
      />
      <Button className="add-new" onClick={() => setPopModal(true)}>
        اضف منتج جديد
      </Button>
      <Table dataSource={filteredProductData} columns={columns} bordered />

      {popModal && (
        <Modal
          title={`${editProduct !== null ? "Edit Product" : "Add New Product"}`}
          visible={popModal}
          onCancel={() => {
            setEditProduct(null);
            setPopModal(false);
          }}
          footer={false}
        >
          <Form
            layout="vertical"
            initialValues={editProduct}
            onFinish={handlerSubmit}
          >
            <FormItem name="name" label="Name">
              <Input />
            </FormItem>
            <Form.Item name="category" label="Category">
              <Select>
                {options.map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <FormItem name="price" label="Price">
              <Input />
            </FormItem>
            <FormItem name="image" label="Image URL">
              <Input />
            </FormItem>
            <div className="form-btn-add">
              <Button htmlType="submit" className="add-new">
                Add
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </LayoutApp>
  );
};

export default Products;
