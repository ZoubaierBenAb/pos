import { Button, Modal, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

import { useReactToPrint } from "react-to-print";
import { EyeOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";

const Bills = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const [billsData, setBillsData] = useState([]);
  const [popModal, setPopModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [todaysBills, setTodaysBills] = useState(null);



  const getAllBills = async () => {
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      const { data } = await axios.get("https://forever-pos-zz.onrender.com/api/bills/getbills");
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
      const { data } = await axios.get("https://forever-pos-zz.onrender.com/api/bills/getTodaysBills");
      setTodaysBills(data.todaySubTotal);
      console.log("data", todaysBills);
    };

    handletodaysBills()
    getAllBills();
  }, []);

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
                      <td className="item">
                        <h2>article</h2>
                      </td>
                      <td className="Hours">
                        <h2>Qté</h2>
                      </td>
                      <td className="Rate">
                        <h2>Total</h2>
                      </td>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedBill.cartItems.map((product, index) => (
                      <tr className="service" key={index}>
                        <td className="tableitem">
                          <p className="itemtext">{product.category} {product.name}</p>
                        </td>
                        <td className="tableitem">
                          <p className="itemtext">{product.quantity}</p>
                        </td>
                        <td className="tableitem">
                          <p className="itemtext">{`${product.quantity * product.price.toFixed(2)}Dt`}</p>
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
<span style={{textDecoration : 'underline',fontSize:'25px'}}>Recette de jour: {todaysBills}Dt</span>
    </Layout>
  );
};

export default Bills;
