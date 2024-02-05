import { Button, Modal, Select, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

import { useReactToPrint } from "react-to-print";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";

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
];

const Bills = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [todaysBills, setTodaysBills] = useState(null);
  const [popModifyModal, setPopModifyModal] = useState(false);
  const [productObject, setProductObject] = useState(null);
  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState(null);
  const [subTotal,setSubTotal]=useState(0)

  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get(
        "https://forever-pos-zz.onrender.com/api/bills/getbills"
      );
      setBillsData(data);
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
    const handletodaysBills = async () => {
      const { data } = await axios.get(
        "https://forever-pos-zz.onrender.com/api/bills/getTodaysBills"
      );
      setTodaysBills(data.todaySubTotal);
      console.log("data", todaysBills);
    };

    handletodaysBills();
    getAllBills();
  }, [selectedBill]);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },

    {
      title: "Total ",
      dataIndex: "subTotal",
    },
    {
      title: "Table",
      dataIndex: "table",
    },
    {
      title: "Modify",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            className="cart-edit eye"
            onClick={() => {
              setSelectedBill(record);
              setPopModifyModal(true);
              console.log(selectedBill.cartItems);
            }}
          />
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EyeOutlined
            className="cart-edit eye"
            onClick={() => {
              setSelectedBill(record);

              setPopModal(true);
            }}
          />
        </div>
      ),
    },
  ];

  const ModifyColumns = [
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Product",
      dataIndex: "name",
    },
  ];

  const handleSelectChange = async (value) => {
    try {
      const category = value;
      const response = await axios.get(
        `https://forever-pos-zz.onrender.com/api/products/getSelectProducts/${category}`
      );

      setCategory(response.data.data);
      console.log("products", response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  function filterByName(products, filterName) {
    const filteredProduct = products.find((drink) =>
      drink.name.toLowerCase().includes(filterName.toLowerCase())
    
    );
    setProductObject(filteredProduct);

    return productObject;
  }

  const handleAddProduct = async () => {
    selectedBill.cartItems.push(filterByName(category, product));
   selectedBill.subTotal += productObject.price

   await axios.
  };

  const handleProductChange = (value) => {
    setProduct(value);
    console.log("product change", product);
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return (
    <Layout>
      <h2>All Invoice </h2>
      <Table dataSource={billsData} columns={columns} bordered />

      {popModal && (
        <Modal
          title=""
          width={400}
          pagination={false}
          visible={popModal}
          onCancel={() => setPopModal(false)}
          footer={false}
        >
          <div className="card" ref={componentRef}>
            <div className="cardHeader">
              <h2 className="logo">FOREVER</h2>
            </div>
            <div className="cardBody">
              <div className="group">
                <b>Date:</b>
                <div style={{ display: "flex", gap: 3 }}>
                  <span>
                    {selectedBill.createdAt.toString().substring(0, 10)}/
                  </span>
                  <span>{`${hours}:${minutes}:${seconds}`}</span>
                </div>
              </div>
              <div className="group">
                <b>Total:</b>
                <span>
                  <span>{selectedBill.subTotal}Dt</span>
                </span>
              </div>
            </div>
            <div className="cardFooter">
              <h4>Votre Ordre</h4>
              <div id="table">
                <table>
                  <thead>
                    <tr className="tabletitle">
                      <td className="item" style={{ width: "60%" }}>
                        <h2>Article</h2>
                      </td>
                      <td className="Hours" style={{ width: "20%" }}>
                        <h2>Qté</h2>
                      </td>
                      <td className="Rate" style={{ width: "20%" }}>
                        <h2>Total</h2>
                      </td>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedBill.cartItems.map((product, index) => (
                      <tr className="service" key={index}>
                        <td className="tableitem">
                          <b className="itemtext">
                            {product.category} {product.name}
                          </b>
                        </td>
                        <td className="tableitem">
                          <b className="itemtext">{product.quantity}</b>
                        </td>
                        <td className="tableitem">
                          <b className="itemtext">{`${
                            product.quantity * product.price.toFixed(2)
                          }Dt`}</b>
                        </td>
                      </tr>
                    ))}

                    <tr className="tabletitle">
                      <td></td>
                      <td className="Rate">
                        <h2>Total</h2>
                      </td>
                      <td className="payment">
                        <h2>{`${selectedBill.subTotal.toFixed(2)}Dt`}</h2>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="footerThanks">
                <span>{"Merci :)"}</span>
              </div>
            </div>
          </div>
          <div className="bills-btn-add">
            <Button onClick={handlePrint} htmlType="submit" className="add-new">
              Generer Facture
            </Button>
          </div>
        </Modal>
      )}
      {popModifyModal && (
        <Modal
          title=""
          width={400}
          pagination={false}
          visible={popModifyModal}
          onCancel={() => setPopModifyModal(false)}
          footer={false}
        >
          <Table
            dataSource={selectedBill.cartItems}
            columns={ModifyColumns}
            bordered
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/** <Button onClick={()=>{setNewItem(true)}}>
  Ajouter un autre Article
</Button>*/}

            <Select onChange={handleSelectChange}>
              {options.map((option) => (
                <Select.Option key={option} value={option}>
                  {option}
                </Select.Option>
              ))}
            </Select>

            {category && (
              <Select onChange={handleProductChange}>
                {category.map((option) => (
                  <Select.Option key={option._id} value={option.name}>
                    {option.name}
                  </Select.Option>
                ))}
              </Select>
            )}
            <Button onClick={() => handleAddProduct()}>Modifier facture</Button>
          </div>
        </Modal>
      )}
      <span style={{ textDecoration: "underline", fontSize: "25px" }}>
        Recette de jour: {todaysBills}Dt
      </span>
    </Layout>
  );
};

export default Bills;
