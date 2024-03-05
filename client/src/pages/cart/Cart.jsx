import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../components/Layout'
import { DeleteOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Modal,Table } from 'antd';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
    const [table,setTable]= useState(0)
    const [subTotal, setSubTotal] = useState(0);
    const [billPopUp, setBillPopUp] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {cartItems} = useSelector(state => state.rootReducer);

    const handlerIncrement = (record) => {
        dispatch({
            type: "UPDATE_CART",
            payload: {...record, quantity: record.quantity + 1}
        });
    };

    const handlerDecrement = (record) => {
        if(record.quantity !== 1){
            dispatch({
                type: "UPDATE_CART",
                payload: {...record, quantity: record.quantity - 1}
            });
        }
    };

    const initisilizeCart = ()=>{
        dispatch({
            type : 'INITIALIZE_CART'
        })
    }

    const handlerDelete = (record) => {
        dispatch({
            type: "DELETE_FROM_CART",
            payload: record
        });
    }

    const columns = [
        {
            title: "اسم المنتج",
            dataIndex: "name"
        },
        {
            title: "الصورة",
            dataIndex: "image",
            render:(image, record) => <img src={image} alt={record.name} height={60} width={60} />
        }, 
        {
            title: "السعر",
            dataIndex: "price",
        }
        , 
        {
            title: "الكمية",
            dataIndex: "_id",
            render:(id, record) => 
                <div>
                    <MinusCircleOutlined className='cart-minus' onClick={() => handlerDecrement(record)}/>
                    <strong className='cart-quantity'>{record.quantity}</strong>
                    <PlusCircleOutlined className='cart-plus' onClick={() => handlerIncrement(record)} />
                </div>
        }
        , 
        {
            title: "حذف المنتج",
            dataIndex: "_id",
            render:(id, record) => <DeleteOutlined className='cart-action' onClick={() => handlerDelete(record)} />
        }
    ]

    useEffect(() => {

        let temp = 0;
        cartItems.forEach((product) => (temp = temp + product.price * product.quantity));
        setSubTotal(temp); 

    }, [cartItems]);

    const handlerSubmit = async (value) => {
        //console.log(value);
        try {
            const newObject = {
                ...value,
                cartItems,
                subTotal,
                table,
                tax: Number(((subTotal / 100) * 10).toFixed(2)),
                totalAmount: Number((Number(subTotal) + Number(((subTotal / 100) * 10).toFixed(2))).toFixed(2)),
                userId: JSON.parse(localStorage.getItem("auth"))._id
            }
            await axios.post("https://pos-ktdt.onrender.com/api/bills/addbills", newObject);
            message.success("Bill Generated!");
            initisilizeCart()
            navigate("/bills");
        } catch(error) {
            message.error("Error!")
            console.log(error);
        }
    }
  return (
    <Layout>
      <h2>Cart</h2>
      <Input onChange={(e)=>{setTable(e.target.value)}} placeholder='numero de table'>
      </Input>
      <Table dataSource={cartItems} columns={columns} bordered />
      <div className="subTotal">
        <h2>السعر الاجمالي <span>$ {(subTotal).toFixed(2)}</span></h2>
        <Button onClick={() => setBillPopUp(true)} className='add-new'>انشاء الفاتورة</Button>
      </div>
      <Modal title="Create Invoice" visible={billPopUp} onCancel={() => setBillPopUp(false)} footer={false}>
        <Form layout='vertical' onFinish={handlerSubmit}>
            
          
            <div className="total">
                <span>SubTotal: Dt{(subTotal.toFixed(2))}</span><br />
                <h3>Total: Dt{subTotal.toFixed(2)}</h3>
            </div>
            <div className="form-btn-add">
              <Button htmlType='submit' className='add-new'>تاكيد الفاتورة</Button>
            </div>  
        </Form>
      </Modal>
    </Layout>
  )
}

export default Cart
