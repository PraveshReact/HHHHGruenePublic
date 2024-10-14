import React, { useRef, useEffect, useState, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import Slider_Comp from "./Slider_Comp";
// import Home_slider1 from "./Home_slider1";
import Footer from "./Footer";
import axios from "axios";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
const Slider_Comp = lazy(() => import("./Slider_Comp"));
const Home_slider1 = lazy(() => import("./Home_slider1"));

const HomeComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const sliderRef = useRef<Slider | null>(null);
  const [slidesToShow, setSlidesToShow] = useState<number>(4);
  const [data, setData] = useState<any>(null);
  const GetserverUrl = "https://eventservers.onrender.com/api/getData";

  const getPublicServerData = async (tableName: any) => {
    let results: any = [];
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "table": `${tableName}`
      });

      var requestOptions: any = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataAll.php", requestOptions)
        .then(response => response.text())
        .then((result: any) => {
          result = JSON.parse(result)
          results = result?.data
          setData(results);
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.error('An error occurred:', error);
    }
    return results;
  }
  useEffect(() => {
    const tableName = "slider";
    const fetchData = async () => {
      try {
        const response: any = await getPublicServerData(`${tableName}`)
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
        setError(error); // Set error state
      } finally {
        setIsLoading(false); // Set loading to false after fetch
      }
    };
    fetchData();
  }, []);
  const settings: Settings = {
    dots: false,
    speed: 2000,
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
                  item.IsDisabled == "0" && (
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
                              <h2>
                                <Link
                                  to={
                                    item?.Title ===
                                      `People's Climate March - "Es gibt keinen Planet B"`
                                      ? "https://www.gruene-weltweit.de/Documents/Topics/Positionen/2017-04-27_Flyer_Why_We_March_Climate_March_BLS.pdf"
                                      : item?.smartPage
                                  }
                                  className="text-white"
                                >
                                  {item?.Title}
                                </Link>
                              </h2>

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
                  )
                ))}
          </Slider>
        </section>
      )}
      <Suspense fallback={<div>Loading...</div>}>

        <Slider_Comp />
        <div className="home_slider1">
          <Home_slider1 />
        </div>
      </Suspense>
    </section>
  );
};

export default HomeComponent;
