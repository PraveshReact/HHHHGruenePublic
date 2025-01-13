import React, { useState, useEffect } from 'react';
import './CSS/Briefwahl.css';
import { Chart } from 'react-google-charts';
import { Link } from 'react-router-dom';
import { Panel, PanelType } from "@fluentui/react";
import BriefwahlPopup from './BriefwahlPopup';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';


const Briefwahl2021 = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  useEffect(() => {
    const chartWrapper: any = document.getElementById('chart-wrapper');
    chartWrapper.addEventListener('mouseover', handleMouseOver);
    chartWrapper.addEventListener('mouseout', handleMouseOut);
    return () => {
      chartWrapper.removeEventListener('mouseover', handleMouseOver);
      chartWrapper.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  const handleMouseOver = (event: any) => {

    const target = event.target.closest('path');
    console.log(event)
    if (target && target.getAttribute('stroke') !== '#ffffff' && target.getAttribute('stroke') !== '#dddddd') {
      if (!target.getAttribute('data-original-color')) {
        const originalColor = target.getAttribute('fill');
        target.setAttribute('data-original-color', originalColor);
      }
      target.setAttribute('fill', '#003399'); // Change fill color to yellow on hover
    }
  };

  const handleMouseOut = (event: any) => {
    const target = event.target.closest('path');
    if (target && target.getAttribute('stroke') !== '#ffffff') {
      const originalColor = target.getAttribute('data-original-color');
      if (originalColor) {
        target.setAttribute('fill', originalColor); // Revert back to original color
        target.removeAttribute('data-original-color');
      }
    }
  };

  const generateUrl = (stateName: string) => {
    if (stateName === "DE-BB") {
      return `/BriefwahlSearch/State=Brandenburg`;
    } else {
      return `/BriefwahlSearch/State=${encodeURIComponent(stateName)}`;
    }
  };

  const states = [
    "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
    "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
    "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
    "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
  ];

  const data = [
    ['Provinces', 'Provinces'],
    ['Baden-Württemberg', 'Baden-Württemberg'], // Empty string for data
    ['Bayern', 'Bayern'],
    ['Berlin', 'Berlin'],
    ['DE-BB', 'Brandenburg'],
    ['Bremen', 'Bremen'],
    ['Hamburg', 'Hamburg'],
    ['Hessen', 'Hessen'],
    ['Mecklenburg-Vorpommern', 'Mecklenburg-Vorpommern'],
    ['Niedersachsen', 'Niedersachsen'],
    ['Nordrhein-Westfalen', 'Nordrhein-Westfalen'],
    ['Rheinland-Pfalz', 'Rheinland-Pfalz'],
    ['Saarland', 'Saarland'],
    ['Sachsen', 'Sachsen'],
    ['Sachsen-Anhalt', 'Sachsen-Anhalt'],
    ['Schleswig-Holstein', 'Schleswig-Holstein'],
    ['Thüringen', 'Thüringen'],
  ];

  const handleClick = (event: {
    chartWrapper: {
      getChart: () => { getSelection: () => { row?: number }[] };
    };
    controlWrapper?: any;
    props: any;
    google: any;
    eventArgs: any;
  }) => {
    const chart = event.chartWrapper.getChart();
    const selection = chart.getSelection();
    if (selection.length > 0 && selection[0].row !== undefined) {
      const selectedProvinceIndex = selection[0].row + 1; // Adjusting for header
      const selectedProvinceName = data[selectedProvinceIndex][0];
      const provinceUrl = generateUrl(selectedProvinceName);
      if (provinceUrl) {
        window.open(provinceUrl, "_self");
      } else {
        console.error(
          "URL not found for the selected province:",
          selectedProvinceName
        );
      }
    }
  };

  const options = {
    region: "DE",
    displayMode: "regions",
    resolution: "provinces",
    colorAxis: { colors: ["#e0e0e0", "#267114"] },
    backgroundColor: "#ffffff",
    datalessRegionColor: "#f5f5f5",
    defaultColor: "#267114",
    tooltip: { trigger: "hover" },
    icons: {
      default: {
        normal: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // Default icon for provinces
        selected: "https://maps.google.com/mapfiles/ms/icons/red-dot.png", // Selected icon for provinces
      },
      Capital: {
        normal: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Icon for capital cities
        selected: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Selected icon for capital cities
      },
    },
  };

  const openModal = (modal: any) => {
    if (modal === "modal2")
      setShowModal(true);
    else
      setShowModal1(true);
  };
  const cancelbox = () => {
    setShowModal(false);
    setShowModal1(false);
  };
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  }

  return (
    <>
      <div className="container">
        <div className="red_block">
          <Link className='gap-3 valign-middle justify-center' to="/warum-aus-dem-ausland-w%C3%A4hlen">
            Warum eigentlich aus dem Ausland wählen? Es gibt 1000 gute Gründe … <IoChevronForwardOutline />
            {/* <svg className="right-arrowSvg" width="31" height="22" viewBox="0 0 31 22" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.266 20.32l1.468 1.36 9.795-10.58L20.734.523 19.266 1.88 26.784 10H0v2h26.97l-7.704 8.32z"></path>
                        </svg> */}
          </Link>

        </div>
        <section className="section Briefwahl2021">
          <div className="form-group clearfix">
            <div id="BriefwahlTitleDiv">
              <h1 className="privacypageTitle">Bundestagswahl 2025 - Briefwahl Suchmaschine</h1>

              <ul className="scrollToBtns">
                <li>
                  <a>
                  <span onClick={() => openModal("modal2")}>
                    Anleitung Briefwahl - Bin in Deutschland gemeldet
                    <svg className="right-arrowSvgMini" width="31" height="22" viewBox="0 0 31 22" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.266 20.32l1.468 1.36 9.795-10.58L20.734.523 19.266 1.88 26.784 10H0v2h26.97l-7.704 8.32z" />
                    </svg>
                  </span>
                  </a>
                </li>
                <li>
                <a>
                  <span onClick={() => openModal("modal1")}>
                    Anleitung Briefwahl - Nicht mehr in Deutschland gemeldet
                    <svg className="right-arrowSvgMini" width="31" height="22" viewBox="0 0 31 22" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.266 20.32l1.468 1.36 9.795-10.58L20.734.523 19.266 1.88 26.784 10H0v2h26.97l-7.704 8.32z" />
                    </svg>
                  </span>
                  </a>
                </li>
              </ul>
            </div>
            <div id="Stoerer_Briefwahl_imgDiv">
              <a href="https://www.gruene-weltweit.de/BriefwahlSearch" target="_blank"><img
                className="Stoerer_Briefwahl_img"
                src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/Stoerer_Briefwahl_RGBRed.png"></img></a>
            </div>
          </div>

          <div className="form-group clearfix">
            <div id='regions_div' style={{}}>
              <div id="chart-wrapper">
                <Chart
                  width="100%"
                  height="644px"
                  chartType="GeoChart"
                  data={data}
                  options={options}
                  chartEvents={[
                    {
                      eventName: "select",
                      callback: handleClick,
                    },
                  ]}
                />
              </div>
            </div>

            {/* <a className="DC-mapImg" href="https://www.gruene-weltweit.de/BriefwahlSearch" target="_blank" data-interception="off">
              <img src={isHovered ? "https://gruene-weltweit.de/Site%20Collection%20Images/DC-MapBlue.png" : "https://gruene-weltweit.de/Site%20Collection%20Images/DC-Map.png"}
                alt="DC-Mapimage"
                className="DC-Mapimage"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              />
            </a> */}

            <ul id="stateslist" style={{}}>
              {states.map((state: any) => (
                <li key={state}>
                  <a href={generateUrl(state)}>
                    <h3 className="state-list-text">{state}</h3>
                  </a>
                </li>
              ))}

            </ul>
          </div>
        </section>
        {showModal && <BriefwahlPopup showModal={showModal} cancelbox={cancelbox} />}
        {showModal1 && <BriefwahlPopup showModal1={showModal1} cancelbox={cancelbox} />}
      </div>
    </>
  );
}

export default Briefwahl2021;

