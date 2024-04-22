


import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CSS/App.css";
import { IoChevronForwardOutline, IoChevronBackOutline, IoTimeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import moment from "moment";

function Home_slider1() {
  const sliderRef = useRef<Slider | null>(null);
  const [data, setData] = useState<any>(null);
  const [slidesToShow, setSlidesToShow] = useState<number>(3);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const GetserverUrl = 'https://eventservers.onrender.com/api/getData';

  const settings: Settings = {
    dots: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 3,
    infinite: false,
    autoplay: false,
    autoplaySpeed: 1000,
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentSlide(newIndex);
    }

  };

  const handleNext = () => {
    if (sliderRef.current && currentSlide < data.length - settings.slidesToShow!) {
      setCurrentSlide((prev) => prev + 1);
      sliderRef.current.slickNext();
    }
  };

  const handlePrev = () => {
    if (sliderRef.current && currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
      sliderRef.current.slickPrev();
    }
  };

  useEffect(() => {
    const tableName = "Announcements"
    const fetchData = async () => {
      try {
        const response = await axios.get(`${GetserverUrl}?table=${tableName}`);
        const sortedData = response.data.slice().sort((a:any, b:any) => {
          if (a.PublishingDate && b.PublishingDate) {
            const format = "MMMM DD, YYYY"; // Define the date format
            const dateA:any = moment(a.PublishingDate, format);
            const dateB:any = moment(b.PublishingDate, format);
            console.log("Date A:", dateA);
            console.log("Date B:", dateB);
            if (dateA.isBefore(dateB)) {
              return 1; // Date A is before Date B, return 1 for descending order
            } else if (dateA.isAfter(dateB)) {
              return -1; // Date A is after Date B, return -1 for descending order
            } else {
              return 0; // Dates are equal, so return 0
            }
          }
          return 0; // If either date is missing, maintain the order
        });        
        setData(sortedData);
      } catch (error) {
        console.log("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1200) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  function formatDate(dateString: string) {
    // Parse the date string
    const date = new Date(dateString);
    // Extract day, month, and year
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    // Construct the formatted date string
    const formattedDate = `${day} ${month} ${year}`;

    return formattedDate;
}
  return (
    <div className="section NewsCardSection">
      <div className="container">
        <div className="section-header">
          <h2 className="sectionHeading">NEUIGKEITEN</h2>
          <div className="pull-right">
            <button onClick={handlePrev} className="button_color" disabled={currentSlide === 0}>
              {/* <i className="fa fa-angle-left" aria-hidden="true"></i> */}
              <IoChevronBackOutline />
            </button>
            <button onClick={handleNext} className="button_color" disabled={currentSlide === data?.length - settings.slidesToShow!}>
              {/* <i className="fa fa-angle-right" aria-hidden="true"></i> */}
              <IoChevronForwardOutline />
            </button>
          </div>
        </div>
        <Slider ref={sliderRef} {...settings}>
          {data &&
            data.map((item: any) => (
              <div key={item.id} className="">
                <div className="card border-0" style={{ position: "relative" }}>
                  <img className="card-img-top" src={item?.ItemCover} />
                  <div className="card-body">
                    <div className="entry-meta">
                      <IoTimeOutline />
                      <span>
                      {item?.PublishingDate ? formatDate(item.PublishingDate) : ''}
                      </span>
                    </div>
                    <h4 className="card-title">
                      <a>
                        <Link
                          to={`/${item.Title.toLowerCase()}/?ItemID=${item.id}&Site=Public`}
                          className="nav-link"
                        >
                          {item?.Title}
                        </Link>
                      </a>
                    </h4>
                    <div className="eventItemDesc cutoff-text" dangerouslySetInnerHTML={{ __html: item?.Body }}>
                    </div>

                    <input className="expand-btn" type="checkbox" />
                  </div>
                </div>
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
}

export default Home_slider1;

