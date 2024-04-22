import React, { useRef, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider_Comp from "./Slider_Comp"
import Home_slider1 from "./Home_slider1";
import Footer from "./Footer";
import axios from "axios";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const HomeComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const sliderRef = useRef<Slider | null>(null);
  const [slidesToShow, setSlidesToShow] = useState<number>(4);
  const [data, setData] = useState<any>(null);
  const GetserverUrl = 'https://eventservers.onrender.com/api/getData';

  useEffect(() => {
    const tableName = "slider"
    const fetchData = async () => {
      try {
        const response = await axios.get(`${GetserverUrl}?table=${tableName}`);
        setData(response?.data);
        setError(null); // Reset error on successful fetch
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
        setError(error); // Set error state
      } finally {
        setIsLoading(false); // Set loading to false after fetch
      }
    }
    fetchData();
  }, []);

  const settings: Settings = {
    dots: false,
    speed: 3000,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 9000,
    nextArrow: <IoChevronForwardOutline />,
    prevArrow: <IoChevronBackOutline />,
  };
  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };
  const HTMLRenderer = ({ content }: any) => {

    return (
      <div
        className="html-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1200) {
        setSlidesToShow(1);
      } else {
        setSlidesToShow(1);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <section className="home_component_section">
      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div>Error: {error.message}</div> // Show error message
      ) : (
        <section className="carouselSlider">
          <Slider ref={sliderRef} {...settings}>
            {data &&
              data
                .slice() // Create a copy of the array to avoid mutating the original data
                .sort((a: any, b: any) => a.SortOrder - b.SortOrder) // Sort the array based on SortOrder
                .map((item: any) => (
                  <div key={item.id}>
                    <div
                      className="slide-item"
                      style={{
                        backgroundImage: `url(${item?.ItemCover})`,
                        height: "430px",
                        width: "auto",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="slider-bg-overlay"></div>
                      <div className="sliderDescription">
                        <div className="container">
                          <div className="containerDetail">
                            <h2>{item?.Title}</h2>
                            <div className="subhead">
                              <p>
                                <HTMLRenderer content={item.ItemDescription} />
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </Slider>
        </section>
      )}
      <div className="home_slider1">
        <Home_slider1 />
      </div>
      <Slider_Comp />
    </section>
  );
};

export default HomeComponent;
