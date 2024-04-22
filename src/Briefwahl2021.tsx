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
        if (target && target.getAttribute('stroke') !== '#ffffff') {
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
        ['Belgium', 'Belgium'],
    ];

    const options = {
        region: 'DE',
        displayMode: 'regions',
        resolution: 'provinces',
        colorAxis: { colors: ['#e0e0e0', '#267114'] },
        backgroundColor: '#ffffff',
        datalessRegionColor: '#f5f5f5',
        defaultColor: '#267114',
        tooltip: { trigger: 'hover' },
        icons: {
            default: {
                normal: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Default icon for provinces
                selected: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', // Selected icon for provinces
            },
            Capital: {
                normal: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Icon for capital cities
                selected: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', // Selected icon for capital cities
            },
        },
    };

    const openModal = (modal: any) => {
        if (modal === "modal")
            setShowModal(true);
        else
            setShowModal1(true);
    };
    const cancelbox = () => {
        setShowModal(false);
        setShowModal1(false);
    }
    return (
        <>
            <div className="container">
                <div className="red_block">
                    <Link className='gap-3 valign-middle justify-center' to="/bundestageswahl-2021/warum-aus-dem-ausland-w%C3%A4hlen">
                        Warum eigentlich aus dem Ausland wählen? Es gibt 1000 gute Gründe … <IoChevronForwardOutline />
                        {/* <svg className="right-arrowSvg" width="31" height="22" viewBox="0 0 31 22" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.266 20.32l1.468 1.36 9.795-10.58L20.734.523 19.266 1.88 26.784 10H0v2h26.97l-7.704 8.32z"></path>
                        </svg> */}
                    </Link>

                </div>
                <section className="section container  Briefwahl2021">
                    <div className="form-group clearfix">
                        <div id="BriefwahlTitleDiv">
                            <h1 className="privacypageTitle">Europawahl 2024- Briefwahl Suchmaschine</h1>
                            <ul className="scrollToBtns" id="web-view-btns">
                                <li><a className='gap-3 valign-middle' onClick={() => openModal("modal")}>Anleitung Briefwahl - Bin in Deutschland gemeldet <IoChevronForwardOutline /></a>
                                </li>
                                <li><a className='gap-3 valign-middle' onClick={() => openModal("modal1")}>Anleitung Briefwahl - Nicht mehr in Deutschland
                                    gemeldet <IoChevronForwardOutline /></a></li>
                            </ul>
                            <ul className="scrollToBtns" id="mobile-view-btns">
                                <li>
                                    <span onClick={() => openModal("modal1")}>
                                        Anleitung Briefwahl - Bin in Deutschland gemeldet
                                        <svg className="right-arrowSvgMini" width="31" height="22" viewBox="0 0 31 22" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19.266 20.32l1.468 1.36 9.795-10.58L20.734.523 19.266 1.88 26.784 10H0v2h26.97l-7.704 8.32z" />
                                        </svg>
                                    </span>
                                </li>
                                <li>
                                    <span onClick={() => openModal("modal1")}>
                                        Anleitung Briefwahl - Nicht mehr in Deutschland gemeldet
                                        <svg className="right-arrowSvgMini" width="31" height="22" viewBox="0 0 31 22" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19.266 20.32l1.468 1.36 9.795-10.58L20.734.523 19.266 1.88 26.784 10H0v2h26.97l-7.704 8.32z" />
                                        </svg>
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div id="Stoerer_Briefwahl_imgDiv">
                            <a href="https://gruene-weltweit.de/BriefwahlSearch" target="blank"><img
                                className="Stoerer_Briefwahl_img"
                                src="https://gruene-weltweit.de/Site%20Collection%20Images/ICONS/Stoerer_Briefwahl_RGB.png"></img></a>
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
                                />
                            </div>
                        </div>
                        <ul id="stateslist" style={{}}>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Baden-Württemberg`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Baden-Württemberg</h3>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Bayern`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Bayern</h3>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Berlin`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Berlin</h3>
                                </Link>

                            </li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Brandenburg`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Brandenburg</h3>
                                </Link></li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Bremen`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Bremen</h3>
                                </Link></li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Hamburg`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Hamburg</h3>
                                </Link></li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Hessen`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Hessen</h3>
                                </Link></li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Mecklenburg-Vorpommern`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Mecklenburg-Vorpommern</h3>
                                </Link></li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Niedersachsen`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Niedersachsen</h3>
                                </Link></li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Nordrhein-Westfalen`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Nordrhein-Westfalen</h3>
                                </Link></li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Rheinland-Pfalz`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Rheinland-Pfalz</h3>
                                </Link></li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Saarland`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Saarland</h3>
                                </Link></li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Sachsen`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Sachsen</h3>
                                </Link></li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Sachsen-Anhalt`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Sachsen-Anhalt</h3>
                                </Link></li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Schleswig-Holstein`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Schleswig-Holstein</h3>
                                </Link></li>
                            <li>
                                <Link
                                    to={`/BriefwahlSearch/State=Thüringen`}
                                    className="nav-link"
                                >
                                    <h3 className="state-list-text">Thüringen</h3>
                                </Link></li>

                            <li>

                                <a href="https://gruene-weltweit.de/BriefwahlSearch" target="blank">
                                    <img style={{ width: '99%' }} alt="DC-Map" src="https://gruene-weltweit.de/Site%20Collection%20Images/DC-Map.png" />
                                </a>
                            </li>
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

