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
              {selectedBill.cartItems.map((product) => (
                <>
                  <div className="footerCard">
                    <div className="group">
                      <span>Produits:</span>
                      <span>
                        <b>{product.name}</b>
                      </span>
                    </div>
                    <div className="group">
                      <span>Qté:</span>
                      <span>
                        <b>{product.quantity}</b>
                      </span>
                    </div>
                    <div className="group">
                      <span>Prix:</span>
                      <span>
                        <b>{product.price}Dt</b>
                      </span>
                    </div>
                  </div>
                </>
              ))}
              <div className="footerCardTotal">
                <div className="group">
                  <h3>Total:</h3>
                  <h3>
                    <b>{selectedBill.subTotal}Dt</b>
                  </h3>
                </div>
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
