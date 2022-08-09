import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProductsList } from "../redux/action";
import ReactStars from "react-rating-stars-component";
import { productCat } from "../constants/productCat";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Products() {
  // const [data, setData] = useState([]);
  const data = useSelector((state) => state.productReducer.productList);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState(productCat.all);
  const componentMounted = useRef(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products");
      if (componentMounted) {
        // setData(await response.clone().json());
        dispatch(getProductsList(await response.clone().json()));
        setFilter(await response.json());
        setLoading(false);
      }
      return () => {
        componentMounted.current = false;
      };
    };
    if (!data.length) getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
        <div className="col-md-3">
          <Skeleton height={350} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((x) => x.category === cat);
    setFilter(updatedList);
    setSelectedCat(cat);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="buttons d-flex justify-content-center mb-5 pb-5">
          <button
            className={`btn ${
              selectedCat === productCat.all ? "btn-dark" : "btn-outline-dark"
            } me-2`}
            onClick={() => {
              setFilter(data);
              setSelectedCat(productCat.all);
            }}
          >
            All
          </button>
          <button
            className={`btn ${
              selectedCat === productCat.MEN ? "btn-dark" : "btn-outline-dark"
            } me-2`}
            onClick={() => filterProduct(productCat.MEN)}
          >
            Men's Clothing
          </button>
          <button
            className={`btn ${
              selectedCat === productCat.women ? "btn-dark" : "btn-outline-dark"
            } me-2`}
            onClick={() => filterProduct(productCat.women)}
          >
            Women's Clothing
          </button>
          <button
            className={`btn ${
              selectedCat === productCat.jewellery
                ? "btn-dark"
                : "btn-outline-dark"
            } me-2`}
            onClick={() => filterProduct(productCat.jewellery)}
          >
            Jewellery
          </button>
          <button
            className={`btn ${
              selectedCat === productCat.electronic
                ? "btn-dark"
                : "btn-outline-dark"
            } me-2`}
            onClick={() => filterProduct(productCat.electronic)}
          >
            Electronic
          </button>
        </div>
        {filter.map((product) => {
          return (
            <>
              <div className="col-md-3 my-3">
                <div className="card h-100 text-center p-4" key={product.id}>
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.title}
                    height="250px"
                  />
                  <div className="card-body">
                    <h5 className="card-title mb-0">
                      {product.title.substring(0, 12)}...
                    </h5>
                    <p className="card-text lead fw-bold my-0">
                      ₹{product.price}
                    </p>
                    <div className="d-flex justify-content-center">
                      <ReactStars
                        isHalf
                        size="35"
                        value={product.rating.rate}
                        edit={false}
                      />
                      <p className="d-flex align-self-end lead my-2">{` (${product.rating.count})`}</p>
                    </div>
                    <NavLink
                      to={`/products/${product.id}`}
                      className="btn btn-outline-dark"
                    >
                      Buy Now
                    </NavLink>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </>
    );
  };

  return (
    <div>
      <div className="container my-5 py-5">
        <div className="row">
          <div className="col-12">
            <h1 className="display-6 fw-bolder text-center">Latest Products</h1>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </div>
  );
}
