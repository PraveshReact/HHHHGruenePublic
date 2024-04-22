


import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoChevronForwardOutline, IoChevronBackOutline, IoCalendarOutline } from "react-icons/io5";
import "./CSS/App.css";

function Slider_Comp() {
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
    const tableName = "events"
    const fetchData = async () => {
      try {
        const response = await axios.get(`${GetserverUrl}?table=${tableName}`);
        const sortedData = response.data.slice().sort((a: any, b: any) => {
          if (a.EventDate && b.EventDate) {
            const dateA: any = new Date(a.EventDate);
            const dateB: any = new Date(b.EventDate);
            return dateB - dateA;
          }
          return 0; // If EventDate is missing in any of the objects, maintain the order
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
    // Parse the ISO 8601 date string
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
    <div className="section container">
      <div className="section-header">
        <h2 className="sectionHeading">Events</h2>
        <div className="pull-right">
          <button onClick={handlePrev} className="button_color" disabled={currentSlide === 0}>
            <IoChevronBackOutline />
          </button>
          <button onClick={handleNext} className="button_color" disabled={currentSlide === data?.length - settings.slidesToShow!}>
            <IoChevronForwardOutline />
          </button>
        </div>
      </div>
      <div className="container">
        <Slider ref={sliderRef} {...settings}>
          {data &&
            data.map((item: any) => (
              <div key={item.id} className="">
                <div className="card border-0">
                  <img className="card-img-top" src={item?.ItemCover} />
                  <div className="card-body">
                    <div className="entry-meta">
                      <IoCalendarOutline />
                      <span>
                        {item?.EventDate ? formatDate(item.EventDate) : ''}
                      </span>
                    </div>
                    <h4 className="card-title">
                      <a target="_blank">{item?.Title}</a>
                    </h4>
                    <div className="eventItemDesc cutoff-text" dangerouslySetInnerHTML={{ __html: item?.Description }}>
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

export default Slider_Comp;

