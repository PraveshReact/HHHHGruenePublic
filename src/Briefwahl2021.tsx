import React, { useState, useEffect } from 'react';
import './CSS/Briefwahl.css';
import { Chart } from 'react-google-charts';
import { Link } from 'react-router-dom';
import { Panel, PanelType } from "@fluentui/react";
import BriefwahlPopup from './BriefwahlPopup';
import FeedBackForm from './FeedBackForm';
import App from './App';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

let backupdata: any = [];
let BriefwahldataBackup: any = [];
let trimmedSearchTerm: any
const Briefwahl2021 = () => {
  let State: any;
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermpopup, setSearchTermpopup] = useState('');
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null); // State to store selected item for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility
  const [isSearchModalOpen, setisSearchModalOpen] = useState(false); // State to control the modal visibility
  const [SelectedTile, setSelectedTile] = useState(State != undefined && State != '' ? State : '');
  useEffect(() => {
    const chartWrapper: any = document.getElementById('chart-wrapper');
    chartWrapper.addEventListener('mouseover', handleMouseOver);
    chartWrapper.addEventListener('mouseout', handleMouseOut);
    return () => {
      chartWrapper.removeEventListener('mouseover', handleMouseOver);
      chartWrapper.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);
  useEffect(() => {
    getBriefwahldata();
  }, [])
  const handleMouseOver = (event: any) => {

    const target = event.target.closest('path');
    console.log(event)
    if (target && target.getAttribute('stroke') !== '#ffffff' && target.getAttribute('stroke') !== '#dddddd') {
      if (!target.getAttribute('data-original-color')) {
        const originalColor = target.getAttribute('fill');
        target.setAttribute('data-original-color', originalColor);
      }
      target.setAttribute('fill', '#008939'); // Change fill color to yellow on hover
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
      return `/Briefwahl/State=Brandenburg`;
    } else if (stateName === "Deutschlandweit") {
      return `/Briefwahl`;
    } else {
      return `/Briefwahl/State=${encodeURIComponent(stateName)}`;
    }
  };
  const StateDataArray: any = [
    { Title: 'Deutschlandweit', src: 'https://gruene-weltweit.de/assets/Deutschlandweit.png', IsSelected: false },
    { Title: 'Baden-Württemberg', src: 'https://gruene-weltweit.de/assets/Baden-Wurttemberg.png', IsSelected: false },
    { Title: 'Bayern', src: 'https://gruene-weltweit.de/assets/Bayern.png', IsSelected: false },
    { Title: 'Berlin', src: 'https://gruene-weltweit.de/assets/Berlin.png', IsSelected: false },
    { Title: 'Brandenburg', src: 'https://gruene-weltweit.de/assets/Brandenburg.png', IsSelected: false },
    { Title: 'Bremen', src: 'https://gruene-weltweit.de/assets/Bremen.png', IsSelected: false },
    { Title: 'Hamburg', src: 'https://gruene-weltweit.de/assets/Hamburg.png', IsSelected: false },
    { Title: 'Hessen', src: 'https://gruene-weltweit.de/assets/Hessen.png', IsSelected: false },
    { Title: 'Mecklenburg-Vorpommern', src: 'https://gruene-weltweit.de/assets/Mecklenburg-Vorpommern.png', IsSelected: false },
    { Title: 'Nordrhein-Westfalen', src: 'https://gruene-weltweit.de/assets/Nordrhein-Westfalen.png', IsSelected: false },
    { Title: 'Niedersachsen', src: 'https://gruene-weltweit.de/assets/Niedersachen.png', IsSelected: false },
    { Title: 'Rheinland-Pfalz', src: 'https://gruene-weltweit.de/assets/Rheinland-Pfalz.png', IsSelected: false },
    { Title: 'Saarland', src: 'https://gruene-weltweit.de/assets/Saarland.png', IsSelected: false },
    { Title: 'Sachsen', src: 'https://gruene-weltweit.de/assets/Sachsen.png', IsSelected: false },
    { Title: 'Sachsen-Anhalt', src: 'https://gruene-weltweit.de/assets/Sachen-Anhalt.png', IsSelected: false },
    { Title: 'Schleswig-Holstein', src: 'https://gruene-weltweit.de/assets/Schleswig-Holstein.png', IsSelected: false },
    { Title: 'Thüringen', src: 'https://gruene-weltweit.de/assets/Thuringen.png', IsSelected: false }
  ]
  const states = [
    "Deutschlandweit", "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
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
      ChangeTile(selectedProvinceName)
      //const provinceUrl = generateUrl(selectedProvinceName);
      // if (provinceUrl) {
      //   window.open(provinceUrl, "_self");
      // } else {
      //   console.error(
      //     "URL not found for the selected province:",
      //     selectedProvinceName
      //   );
      // }
    }
  };

  const options = {
    region: "DE",
    displayMode: "regions",
    resolution: "provinces",
    colorAxis: { colors: ["#e0e0e0", "#005437"] },
    backgroundColor: "#ffffff",
    datalessRegionColor: "#f5f5f5",
    defaultColor: "#005437",
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

  const openModalContent = (modal: any) => {
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
  const getBriefwahldata = async () => {
    const tableName = "Briefwahl";
    let allfilterdata: any = []
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
          backupdata = result?.data;
          if (State != undefined && State != undefined && State.toLowerCase() == 'deutschlandweit') {
            BriefwahldataBackup = result?.data;
          } else if (State != undefined && State != undefined) {
            result?.data?.forEach((item: any) => {
              if (item?.Land == State) {
                allfilterdata.push(item)
              }
            })
          }
          if (State != undefined && State != undefined && State.toLowerCase() != 'deutschlandweit') {
            BriefwahldataBackup = allfilterdata;
          } else {
            BriefwahldataBackup = result?.data;
          }
          console.log('Get data from server successfully');
          console.log(result)

        })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  const openModal = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setisSearchModalOpen(false)
    setSearchTerm('')
    setSearchTermpopup('')
  };
  const closeModalinformation = () => {
    setIsModalOpen(false);
  }
  const clearSearchButton = () => {
    setFilteredItems([]);
    setSearchTerm('')
    setSearchTermpopup('')
  }
  const normalizeString = (str: string, reverse: string) => {
    if (!str) return str;

    // If reverse flag is set, perform English to German conversion
    if (reverse == '1') {
      return str
        .replace(/ae/g, 'ä')
        .replace(/oe/g, 'ö')
        .replace(/ue/g, 'ü')
        .replace(/ss/g, 'ß')
        .toLowerCase();
    } else if (reverse == '2') {
      return str
        .replace(/ä/g, 'ae')  // Replace ä with ae
        .replace(/ö/g, 'oe')  // Replace ö with oe
        .replace(/ü/g, 'ue')  // Replace ü with ue
        .replace(/ß/g, 'ss')  // Replace ß with ss
        .toLowerCase();  // Convert to lowercase for case-insensitive comparison
    } else if (reverse == '3') {
      return str
        .replace(/ä/g, 'a')  // Replace ä with ae
        .replace(/ö/g, 'o')  // Replace ö with oe
        .replace(/ü/g, 'u')  // Replace ü with ue
        .replace(/ß/g, 's')  // Replace ß with ss
        .toLowerCase();  // Convert to lowercase for case-insensitive comparison
    }

    // Default: German to English conversion

  };
  const handleSearchpopup = (searchTerm: string) => {
    const trimmedSearchTerm = searchTerm.trim(); // Trim any leading/trailing spaces

    if (trimmedSearchTerm === '') {
      setFilteredItems([]);  // If search term is empty, clear the results
    } else {
      const filtered = BriefwahldataBackup.filter((item: any) => {

        const originalGemeinde = String(item.Gemeinde || '').toLowerCase();
        const normalizedGemeinde = normalizeString(String(item.Gemeinde || ''), '1');
        const reverseNormalizedGemeinde = normalizeString(String(item.Gemeinde || ''), '2'); // English to German conversion
        const myreverseNormalizedGemeinde = normalizeString(String(item.Gemeinde || ''), '3');// English to German conversion
        const concatenatedGemeinde = originalGemeinde + normalizedGemeinde + reverseNormalizedGemeinde + myreverseNormalizedGemeinde;
        return (
          concatenatedGemeinde.toLowerCase().indexOf(trimmedSearchTerm.toLowerCase()) !== -1 ||
          String(item.PLZ || '').indexOf(trimmedSearchTerm) !== -1
        );

      });

      setFilteredItems(filtered); // Update filtered items
    }
  };
  const handleSearch = (searchTerm: string) => {
    const trimmedSearchTerm = searchTerm.trim(); // Trim any leading/trailing spaces

    if (trimmedSearchTerm === '') {
      setFilteredItems([]);  // If search term is empty, clear the results
    } else {
      const filtered = BriefwahldataBackup.filter((item: any) => {

        const originalGemeinde = String(item.Gemeinde || '').toLowerCase();
        const normalizedGemeinde = normalizeString(String(item.Gemeinde || ''), '1');
        const reverseNormalizedGemeinde = normalizeString(String(item.Gemeinde || ''), '2'); // English to German conversion
        const myreverseNormalizedGemeinde = normalizeString(String(item.Gemeinde || ''), '3');// English to German conversion
        const concatenatedGemeinde = originalGemeinde + normalizedGemeinde + reverseNormalizedGemeinde + myreverseNormalizedGemeinde;
        return (
          concatenatedGemeinde.toLowerCase().indexOf(trimmedSearchTerm.toLowerCase()) !== -1 ||
          String(item.PLZ || '').indexOf(trimmedSearchTerm) !== -1
        );

      });

      setFilteredItems(filtered); // Update filtered items
    }
  };
  const ChangeTile = (tile: string) => {
    let allfilterdata: any = []
    setisSearchModalOpen(true)
    setSelectedTile(tile)
    if (tile != undefined && tile != undefined) {
      backupdata?.forEach((item: any) => {
        if (item?.Land == tile) {
          allfilterdata.push(item)
        }
      })
    }
    if (tile != 'Deutschlandweit' && tile.toLowerCase() != 'deutschlandweit') {
      BriefwahldataBackup = allfilterdata;
    } else if (tile != undefined && tile != undefined && tile.toLowerCase() == 'deutschlandweit') {
      BriefwahldataBackup = backupdata;
    } else {
      BriefwahldataBackup = allfilterdata;
    }
    if (trimmedSearchTerm == undefined || trimmedSearchTerm == null || trimmedSearchTerm === '') {
      setFilteredItems([]);  // If search term is empty, clear the results
    } else {
      handleSearch(trimmedSearchTerm)
    }

  }
  return (
    <>
      <div className="container">
        <section className="section Briefwahl2021">
          <div className="col-lg-12">
            <div id="BriefwahlTitleDiv">
              <h1 className="privacypageTitle">Bundestagswahl 2025 - Briefwahl Suchmaschine</h1>

              <ul className="scrollToBtns">
                <li>
                  <a>
                    <span onClick={() => openModalContent("modal2")}>
                      Anleitung Briefwahl - Bin in Deutschland gemeldet
                      <svg className="right-arrowSvgMini" width="31" height="22" viewBox="0 0 31 22" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.266 20.32l1.468 1.36 9.795-10.58L20.734.523 19.266 1.88 26.784 10H0v2h26.97l-7.704 8.32z" />
                      </svg>
                    </span>
                  </a>
                </li>
                <li>
                  <a>
                    <span onClick={() => openModalContent("modal1")}>
                      Anleitung Briefwahl - Nicht mehr in Deutschland gemeldet
                      <svg className="right-arrowSvgMini" width="31" height="22" viewBox="0 0 31 22" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.266 20.32l1.468 1.36 9.795-10.58L20.734.523 19.266 1.88 26.784 10H0v2h26.97l-7.704 8.32z" />
                      </svg>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

          </div>
            <div className="row justify-content-center mt-3">
              <div className="col-lg-12 col-sm-12 position-relative">
                <div className="CustomSearchInputWithBtn">
                  <span className="BtnSearchIcon" onClick={() => setSearchTerm('')}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M13.3333 4C8.17867 4 4 8.17867 4 13.3333C4 18.488 8.17867 22.6667 13.3333 22.6667C15.5213 22.6701 17.6404 21.9014 19.3173 20.496L26.5773 27.756C26.6547 27.8334 26.7466 27.8948 26.8477 27.9367C26.9488 27.9786 27.0572 28.0001 27.1667 28.0001C27.2761 28.0001 27.3845 27.9786 27.4856 27.9367C27.5867 27.8948 27.6786 27.8334 27.756 27.756C27.8334 27.6786 27.8948 27.5867 27.9367 27.4856C27.9786 27.3845 28.0001 27.2761 28.0001 27.1667C28.0001 27.0572 27.9786 26.9488 27.9367 26.8477C27.8948 26.7466 27.8334 26.6547 27.756 26.5773L20.496 19.3173C21.9012 17.6403 22.6699 15.5213 22.6667 13.3333C22.6667 8.17867 18.488 4 13.3333 4ZM5.66667 13.3333C5.66667 9.09933 9.09933 5.66667 13.3333 5.66667C17.5673 5.66667 21 9.09933 21 13.3333C21 17.5673 17.5673 21 13.3333 21C9.09933 21 5.66667 17.5673 5.66667 13.3333Z" fill="#555555" />
                  </svg>
                  </span>
                  <input
                    type="text"
                    className="CustomSearchInput"
                    //placeholder="Suche Deine Gemeinde oder Postleitzahl (PLZ)"
                    placeholder="Gib hier Deine Gemeinde oder Postleitzahl (PLZ) ein..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value); // Update searchTerm on typing
                      handleSearch(e.target.value); // Call handleSearch whenever typing
                    }}
                    style={{ flex: 1 }}
                  />
                  <span className="BtnCrossIcon" onClick={clearSearchButton}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 33" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M23.0711 22.628L22.5997 23.0994L22.1282 23.5708L16 17.4426L9.87175 23.5708L9.40035 23.0994L8.92896 22.628L15.0572 16.4998L8.92896 10.3715L9.40035 9.90011L9.87175 9.42871L16 15.557L22.1282 9.42871L22.5997 9.90011L23.0711 10.3715L16.9428 16.4998L23.0711 22.628Z" fill="#333333" />
                  </svg></span>

                <button className="btn btn-primary">Jetzt Starten</button>
              </div>
              {searchTerm !== '' && filteredItems.length > 0 ? (
                <table className="SmartTableOnTaskPopup scrollbar">
                  {filteredItems.map((item, index) => (
                    <tr className='searchItemList p-1 fs-6'
                      key={index}
                      onClick={() => openModal(item)}
                      style={{ cursor: 'pointer' }}
                    ><td style={{ width: '76%' }}>
                        <span className="d-flex flex-column">
                          <span className="" title={item.ZipCode}>
                            {item.PLZ || 'n/a'} {item.Gemeinde}
                          </span>
                          <span className=''>{item.WKName || 'n/a'} (WK {item.Wahlkreis || 'n/a'})</span>
                        </span>
                      </td>
                      <td style={{ width: '12%' }}>
                        <span className='align-content-start d-flex'>Email:
                          {item.Email ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z" fill="#00893A" />
                          </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.786 4.14797C8.96271 4.47725 7.08373 5.59373 5.88881 7.05785C5.28696 7.7955 4.45293 9.40344 4.22327 10.269C3.98202 11.1786 3.9245 13.072 4.10882 14.0401C4.74734 17.3946 7.36138 20.0438 10.7312 20.7517C11.625 20.9394 13.2986 20.9357 14.229 20.7436C17.5669 20.0553 20.269 17.226 20.8118 13.8514C20.9627 12.9137 20.8862 11.1061 20.6605 10.269C20.5725 9.94278 20.284 9.23101 20.0194 8.68735C18.3556 5.26838 14.6554 3.44927 10.786 4.14797ZM13.9965 5.42823C14.3948 5.51156 15.1425 5.78409 15.6579 6.03411C16.4562 6.42124 16.7284 6.62219 17.4933 7.39019C18.964 8.86693 19.6209 10.4183 19.6209 12.4154C19.6209 14.0082 19.1624 15.4983 18.3244 16.6295L18.0065 17.0587L12.973 12.0332C10.2047 9.26911 7.93966 6.96292 7.93976 6.90837C7.94006 6.76208 8.78561 6.21593 9.5323 5.87957C10.8156 5.30179 12.5517 5.12623 13.9965 5.42823ZM11.9731 12.913C14.7093 15.6449 16.948 17.9363 16.948 18.0053C16.948 18.074 16.7071 18.2842 16.4126 18.4723C13.483 20.3437 9.78456 19.966 7.36307 17.5479C6.21966 16.4061 5.50357 14.924 5.27062 13.2168C5.13639 12.2335 5.32229 10.8601 5.72845 9.83508C6.01459 9.11283 6.7357 7.94592 6.89601 7.94592C6.95234 7.94592 9.23712 10.1811 11.9731 12.913Z" fill="#333333" />
                          </svg>
                          }
                        </span>
                      </td>
                      <td style={{ width: '12%' }}><span className='align-content-start d-flex'>Online:
                        {item.LinkBundestag ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z" fill="#00893A" />
                        </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.786 4.14797C8.96271 4.47725 7.08373 5.59373 5.88881 7.05785C5.28696 7.7955 4.45293 9.40344 4.22327 10.269C3.98202 11.1786 3.9245 13.072 4.10882 14.0401C4.74734 17.3946 7.36138 20.0438 10.7312 20.7517C11.625 20.9394 13.2986 20.9357 14.229 20.7436C17.5669 20.0553 20.269 17.226 20.8118 13.8514C20.9627 12.9137 20.8862 11.1061 20.6605 10.269C20.5725 9.94278 20.284 9.23101 20.0194 8.68735C18.3556 5.26838 14.6554 3.44927 10.786 4.14797ZM13.9965 5.42823C14.3948 5.51156 15.1425 5.78409 15.6579 6.03411C16.4562 6.42124 16.7284 6.62219 17.4933 7.39019C18.964 8.86693 19.6209 10.4183 19.6209 12.4154C19.6209 14.0082 19.1624 15.4983 18.3244 16.6295L18.0065 17.0587L12.973 12.0332C10.2047 9.26911 7.93966 6.96292 7.93976 6.90837C7.94006 6.76208 8.78561 6.21593 9.5323 5.87957C10.8156 5.30179 12.5517 5.12623 13.9965 5.42823ZM11.9731 12.913C14.7093 15.6449 16.948 17.9363 16.948 18.0053C16.948 18.074 16.7071 18.2842 16.4126 18.4723C13.483 20.3437 9.78456 19.966 7.36307 17.5479C6.21966 16.4061 5.50357 14.924 5.27062 13.2168C5.13639 12.2335 5.32229 10.8601 5.72845 9.83508C6.01459 9.11283 6.7357 7.94592 6.89601 7.94592C6.95234 7.94592 9.23712 10.1811 11.9731 12.913Z" fill="#333333" />
                        </svg>
                        }
                      </span>
                      </td>

                    </tr>
                  ))}

                </table>
              ) : (
                searchTerm !== '' &&
                filteredItems.length === 0 && (
                  <p className="text-danger mt-3">No matching results found.</p>
                )
              )}
            </div>
          </div>
          <div className="row clearfix">
            <div id='regions_div' className='col-md-7 col-sm-12'>
              <div id="chart-wrapper">
                <Chart
                  width="100%"
                  height="500px"
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
            <div className='col-md-5 col-sm-12'>
              <ul className='mb-5 mt-3 stateListTiles'>
                {StateDataArray.map((item: any, index: any) => (
                  <li key={index} onClick={() => ChangeTile(item.Title)} className={index == 0 ? SelectedTile === item.Title ? "state active" : "state" : SelectedTile === item.Title ? 'states active' : "states"}>
                    <img src={item.src} alt={item.Title} className="stateLogo" />
                    <span className='stateName'>{item.Title}</span>
                  </li>
                ))}
              </ul>
            </div>


            {
              isModalOpen && (
                <div
                  style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: '999999',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'white',
                      padding: '24px',
                      borderRadius: '4px',
                      width: '100%',
                      maxWidth: '572px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    }}

                  >
                    <div className='BriefwahlInformationPopup'>
                      <div className='modal-header'>Briefwahl Information - {selectedItem?.Gemeinde}</div>
                      <div className="modal-body">
                        <div className='infoBox'>
                          <div className="infoBox-itemBox">
                            <div className='infoBox-itemBox-item'><strong>PLZ:</strong>{selectedItem?.PLZ}</div>
                            <div className='infoBox-itemBox-item'><strong>Gemeinde:</strong>{selectedItem?.Gemeinde}</div>
                          </div>
                          <div className="infoBox-itemBox">
                            <div className='infoBox-itemBox-item'><strong>Wahlkreis:</strong>{selectedItem?.Wahlkreis}</div>
                            <div className='infoBox-itemBox-item'><strong>WK Name:</strong>{selectedItem?.WKName}</div>
                          </div>
                        </div>
                        <div className='infoBox'>
                          <div className='col'>
                            <strong>Email:</strong> <a href={`mailto:${selectedItem?.Email}`}>{selectedItem?.Email ? selectedItem?.Email : 'n/a'}</a>
                          </div>
                        </div>
                        <div className='infoBox'>
                          <div className='col'>
                            <strong>Link Online Formular: </strong>
                            <a style={{ wordBreak: 'break-all' }} href={selectedItem?.LinkBundestag} target="_blank" rel="noopener noreferrer">{selectedItem?.LinkBundestag}</a></div>
                        </div>
                      </div>
                      <div className='modal-footer'>
                        <div className='col-sm-6'>
                          <Link to={`/feedbackform?id=${selectedItem.id}`} state={selectedItem}>Falsche Informationen melden</Link>     
                          </div>
                          <div className='col-sm-6 text-end'>
                          <button className='btn btn-primary rounded-0' onClick={closeModalinformation}> Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
            {
              isSearchModalOpen && (
                <div
                  style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: '99999',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'white',
                      padding: '24px',
                      borderRadius: '4px',
                      width: '100%',
                      maxWidth: '750px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    }}

                  >
                    <div className='BriefwahlInformationMiniPopup'>
                      <div className='modal-header'></div>
                      <div className="modal-body">
                        <div className="col-lg-12 mt-2 mb-2">
                          <div className="CustomSearchInputWithBtn">
                            <span className="BtnSearchIcon" onClick={() => setSearchTermpopup('')}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                              <path d="M13.3333 4C8.17867 4 4 8.17867 4 13.3333C4 18.488 8.17867 22.6667 13.3333 22.6667C15.5213 22.6701 17.6404 21.9014 19.3173 20.496L26.5773 27.756C26.6547 27.8334 26.7466 27.8948 26.8477 27.9367C26.9488 27.9786 27.0572 28.0001 27.1667 28.0001C27.2761 28.0001 27.3845 27.9786 27.4856 27.9367C27.5867 27.8948 27.6786 27.8334 27.756 27.756C27.8334 27.6786 27.8948 27.5867 27.9367 27.4856C27.9786 27.3845 28.0001 27.2761 28.0001 27.1667C28.0001 27.0572 27.9786 26.9488 27.9367 26.8477C27.8948 26.7466 27.8334 26.6547 27.756 26.5773L20.496 19.3173C21.9012 17.6403 22.6699 15.5213 22.6667 13.3333C22.6667 8.17867 18.488 4 13.3333 4ZM5.66667 13.3333C5.66667 9.09933 9.09933 5.66667 13.3333 5.66667C17.5673 5.66667 21 9.09933 21 13.3333C21 17.5673 17.5673 21 13.3333 21C9.09933 21 5.66667 17.5673 5.66667 13.3333Z" fill="#555555" />
                            </svg>
                            </span>
                            <input
                              type="text"
                              className="CustomSearchInput"
                              //placeholder="Suche Deine Gemeinde oder Postleitzahl (PLZ)"
                              placeholder="Gib hier Deine Gemeinde oder Postleitzahl (PLZ) ein..."
                              value={searchTermpopup}
                              onChange={(e) => {
                                setSearchTermpopup(e.target.value); // Update searchTerm on typing
                                handleSearchpopup(e.target.value); // Call handleSearch whenever typing
                              }}
                              style={{ flex: 1 }}
                            />
                            <span className="BtnCrossIcon" onClick={clearSearchButton}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 33" fill="none">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M23.0711 22.628L22.5997 23.0994L22.1282 23.5708L16 17.4426L9.87175 23.5708L9.40035 23.0994L8.92896 22.628L15.0572 16.4998L8.92896 10.3715L9.40035 9.90011L9.87175 9.42871L16 15.557L22.1282 9.42871L22.5997 9.90011L23.0711 10.3715L16.9428 16.4998L23.0711 22.628Z" fill="#333333" />
                            </svg></span>

                            <button className="btn btn-primary">Jetzt Starten</button>
                          </div>
                          {searchTermpopup !== '' && filteredItems.length > 0 ? (
                            <table className="SmartTableOnTaskPopup scrollbar">
                              {filteredItems.map((item, index) => (
                                <tr className='searchItemList p-1 fs-6'
                                  key={index}
                                  onClick={() => openModal(item)}
                                  style={{ cursor: 'pointer' }}
                                ><td style={{ width: '76%' }}>
                                    <span className="d-flex flex-column">
                                      <span className="" title={item.ZipCode}>
                                        {item.PLZ || 'n/a'} {item.Gemeinde}
                                      </span>
                                      <span className=''>{item.WKName || 'n/a'} (WK {item.Wahlkreis || 'n/a'})</span>
                                    </span>
                                  </td>
                                  <td style={{ width: '12%' }}>
                                    <span className='align-content-start d-flex'>Email:
                                      {item.Email ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z" fill="#00893A" />
                                      </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.786 4.14797C8.96271 4.47725 7.08373 5.59373 5.88881 7.05785C5.28696 7.7955 4.45293 9.40344 4.22327 10.269C3.98202 11.1786 3.9245 13.072 4.10882 14.0401C4.74734 17.3946 7.36138 20.0438 10.7312 20.7517C11.625 20.9394 13.2986 20.9357 14.229 20.7436C17.5669 20.0553 20.269 17.226 20.8118 13.8514C20.9627 12.9137 20.8862 11.1061 20.6605 10.269C20.5725 9.94278 20.284 9.23101 20.0194 8.68735C18.3556 5.26838 14.6554 3.44927 10.786 4.14797ZM13.9965 5.42823C14.3948 5.51156 15.1425 5.78409 15.6579 6.03411C16.4562 6.42124 16.7284 6.62219 17.4933 7.39019C18.964 8.86693 19.6209 10.4183 19.6209 12.4154C19.6209 14.0082 19.1624 15.4983 18.3244 16.6295L18.0065 17.0587L12.973 12.0332C10.2047 9.26911 7.93966 6.96292 7.93976 6.90837C7.94006 6.76208 8.78561 6.21593 9.5323 5.87957C10.8156 5.30179 12.5517 5.12623 13.9965 5.42823ZM11.9731 12.913C14.7093 15.6449 16.948 17.9363 16.948 18.0053C16.948 18.074 16.7071 18.2842 16.4126 18.4723C13.483 20.3437 9.78456 19.966 7.36307 17.5479C6.21966 16.4061 5.50357 14.924 5.27062 13.2168C5.13639 12.2335 5.32229 10.8601 5.72845 9.83508C6.01459 9.11283 6.7357 7.94592 6.89601 7.94592C6.95234 7.94592 9.23712 10.1811 11.9731 12.913Z" fill="#333333" />
                                      </svg>
                                      }
                                    </span>
                                  </td>
                                  <td style={{ width: '12%' }}><span className='align-content-start d-flex'>Online:
                                    {item.LinkBundestag ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z" fill="#00893A" />
                                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M10.786 4.14797C8.96271 4.47725 7.08373 5.59373 5.88881 7.05785C5.28696 7.7955 4.45293 9.40344 4.22327 10.269C3.98202 11.1786 3.9245 13.072 4.10882 14.0401C4.74734 17.3946 7.36138 20.0438 10.7312 20.7517C11.625 20.9394 13.2986 20.9357 14.229 20.7436C17.5669 20.0553 20.269 17.226 20.8118 13.8514C20.9627 12.9137 20.8862 11.1061 20.6605 10.269C20.5725 9.94278 20.284 9.23101 20.0194 8.68735C18.3556 5.26838 14.6554 3.44927 10.786 4.14797ZM13.9965 5.42823C14.3948 5.51156 15.1425 5.78409 15.6579 6.03411C16.4562 6.42124 16.7284 6.62219 17.4933 7.39019C18.964 8.86693 19.6209 10.4183 19.6209 12.4154C19.6209 14.0082 19.1624 15.4983 18.3244 16.6295L18.0065 17.0587L12.973 12.0332C10.2047 9.26911 7.93966 6.96292 7.93976 6.90837C7.94006 6.76208 8.78561 6.21593 9.5323 5.87957C10.8156 5.30179 12.5517 5.12623 13.9965 5.42823ZM11.9731 12.913C14.7093 15.6449 16.948 17.9363 16.948 18.0053C16.948 18.074 16.7071 18.2842 16.4126 18.4723C13.483 20.3437 9.78456 19.966 7.36307 17.5479C6.21966 16.4061 5.50357 14.924 5.27062 13.2168C5.13639 12.2335 5.32229 10.8601 5.72845 9.83508C6.01459 9.11283 6.7357 7.94592 6.89601 7.94592C6.95234 7.94592 9.23712 10.1811 11.9731 12.913Z" fill="#333333" />
                                    </svg>
                                    }
                                  </span>
                                  </td>

                                </tr>
                              ))}

                            </table>
                          ) : (
                            searchTermpopup !== '' &&
                            filteredItems.length === 0 && (
                              <p className="text-danger mt-3">No matching results found.</p>
                            )
                          )}
                        </div>
                      </div>
                      <div className='modal-footer'>
                        <div className='float-end row'>
                          <button className='btn btn-primary rounded-0' onClick={closeModal}>Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </section>
        {showModal && <BriefwahlPopup showModal={showModal} cancelbox={cancelbox} />}
        {showModal1 && <BriefwahlPopup showModal1={showModal1} cancelbox={cancelbox} />}
      </div>
    </>
  );
}

export default Briefwahl2021;

