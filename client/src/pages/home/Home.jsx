import React, { useState, useEffect } from "react";
import axios from "axios";
import LayoutApp from "../../components/Layout";
import { Row, Col } from "antd";
import Product from "../../components/Product";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();

  const [productData, setProductData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("pizzas");
  const categories = [
    {
      name: "Café",
      imageUrl:
        "https://i0.wp.com/www.engagingcultures.com/wp-content/uploads/2020/02/DSC_2940.jpg?fit=1000%2C563&ssl=1",
    },
    {
      name: "Thé",
      imageUrl:
        "https://www.thesdelapagode.com/guide-du-the/wp-content/uploads/2017/05/composes-the-qu-y-a-t-il-dans-tasse.jpg",
    },
    {
      name: "Jus",
      imageUrl:
        "https://img.passeportsante.net/1200x675/2023-03-01/jus-fruit.webp",
    },
    {
      name: "Mojito",
      imageUrl:
        "https://www.shutterstock.com/image-vector/mojito-cocktail-letter-mint-ice-260nw-678493888.jpg",
    },
    {
      name: "Smothie",
      imageUrl:
        "https://c8.alamy.com/comp/TB3BM1/word-smoothie-made-of-different-fruits-and-berries-fruit-font-isolated-on-white-background-fresh-and-healthy-smoothie-concept-TB3BM1.jpg",
    },
    {
      name : 'Frappuchino',
      imageUrl : 'https://trademarks.justia.com/media/image.php?serial=78567766'
    },
    {
    name : 'Milk Shake',
    imageUrl : 'https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/4d35b047353929.5877abb9145b9.png'
    },
    {
      name : 'Glaces',
      imageUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvU9qsOLMHUb7wW8g06fEjOaxGg1_3kPwtPA&usqp=CAU'
    },
    { 
      name : 'Cocktail',
      imageUrl : 'https://static.vecteezy.com/system/resources/previews/003/485/068/original/logo-word-cocktail-stylized-as-trendy-drinks-vector.jpg'
    },
    {
      name : 'Crêpe sucrée',
      imageUrl : 'https://i.ytimg.com/vi/0P7jm2i-krI/maxresdefault.jpg'
    },
    {
      name : 'Petit Dejeuner',
      imageUrl : 'https://i.pinimg.com/736x/cb/07/e8/cb07e804dfcfbe58218c8ee5f373fdaf.jpg'
    },
    {
      name : 'Crêpe Salée',
      imageUrl : 'https://i.ytimg.com/vi/0P7jm2i-krI/maxresdefault.jpg',
    },
    {
      name : 'Boisson',
      imageUrl : 'https://www.clearwatersystems.com/wp-content/uploads/2019/03/Soda-Bottled-Tap-805x503-1.png'
    },
    {
      name : 'Gauffre',
      imageUrl : 'https://cdn-tam.ouest-france.fr/media/cache/thumb_400/assets/featured/d2c99f65b289a3461161206d47862e05f0d660e8.jpeg'
    },
    { name : 'Cheese Cake',
    imageUrl : 'https://www.shutterstock.com/image-vector/cheesecake-vector-logo-hand-drawn-600nw-1824095345.jpg'
    
    },
    {
      name : 'Gateau',
      imageUrl : 'https://lh3.googleusercontent.com/proxy/cPkGALNWMDgWQ8jWypzroxjLqLhIbp74QFQSo4SPmYNSyfsLs9Br-J_V3NJUKfYV_oCEqS8h6zS74xR2N6QEtS_McNGf1MY0J4hLfbDqbj4'
    },
    {
      name : 'Croissant',
      imageUrl : 'https://img.freepik.com/premium-vector/vector-illustration-croissant-pastry-with-word-croissant-written-it-handwritten-style-vector-illustration_727385-1925.jpg?w=2000'
    },
    {
      name : 'Cake',
      imageUrl :'https://images.creativemarket.com/0.1.0/ps/7299279/2427/1600/m1/fpnw/wm0/temping-typography-lettering-5-.jpg?1&s=b13e3eb2beeac76a9c905546c47f2741'
    },
    {
      name : 'Baguette Farcie',
      imageUrl : 'https://i.ytimg.com/vi/0Cv10EXzFNw/maxresdefault.jpg'
    },
    {
      name : 'Omelette',
      imageUrl : 'https://www.olivetomato.com/wp-content/uploads/2016/02/SAM4952-1.jpg'
    },
    {
      name : 'Burger',
      imageUrl : 'https://previews.123rf.com/images/tatty85nati/tatty85nati1708/tatty85nati170800088/83588185-burger-and-black-word-hamburger.jpg'
    },
    {
      name : 'Tacos',
      imageUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx-yHvVACwMFPggzBMpBKde8C7SS-T8AcPBfcH52zysQ&s'
    },
    {
      name : 'Pizza',
      imageUrl :'https://tastesbetterfromscratch.com/wp-content/uploads/2023/06/Pepperoni-Pizza-1.jpg'
    },
    {name : 'Chicha',
  imageUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQ_izuwna4Fb1-LsPNiHFmoRlIwLYYaqa96GAINfnnPA&s'
  },
  {name : 'Panini',
imageUrl : 'https://delitraiteur.lu/wp-content/uploads/2022/02/panini-1.png'
},
{
  name : 'Plat',
  imageUrl :'https://cdn.chefclub.tools/uploads/recipes/cover-thumbnail/fdb607b8-98ad-441b-9a63-e5d2ba83b656.jpg'
}
  

  ];

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        dispatch({
          type: "SHOW_LOADING",
        });
        const { data } = await axios.get(
          "https://forever-pos-zz.onrender.com/api/products/getproducts"
        );
        setProductData(data);
        dispatch({
          type: "HIDE_LOADING",
        });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllProducts();
  }, [dispatch]);

  return (
    <LayoutApp>
      <div className="category"
        style={{display: 'flex',flexWrap: 'wrap'}}>
        {categories.map((category) => (
          <div
         
            key={category.name}
            className={`categoryFlex ${
              selectedCategory === category.name && "category-active"
            }`}
            onClick={() => setSelectedCategory(category.name)}
          >
            <div 
             >
            <h3 className="categoryName">{category.name}</h3>
            <img
              src={category.imageUrl}
              alt={category.name}
              height={60}
              width={60}
            />
               </div>
            
          </div>
        ))}
      </div>
      <Row>
        {productData
          .filter((i) => i.category === selectedCategory)
          .map((product) => (
            <Col xs={24} sm={6} md={12} lg={6}>
              <Product key={product.id} product={product} />
            </Col>
          ))}
      </Row>
    </LayoutApp>
  );
};

export default Home;
