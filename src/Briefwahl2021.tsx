import React, { useState, useEffect } from 'react';
import './CSS/Briefwahl.css';
import './CSS/ButtonStyle.css';
import { Chart } from 'react-google-charts';
import { Link } from 'react-router-dom';
import { Panel, PanelType } from "@fluentui/react";
import BriefwahlPopup from './BriefwahlPopup';
import FeedBackForm from './FeedBackForm';
import App from './App';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import axios from 'axios';
import AlertPopup from './AlertPopup';
import { FaCopy } from 'react-icons/fa';

let backupdata: any = [];
let BriefwahldataBackup: any = [];
let filteredItemsBackup: any = []
let trimmedSearchTerm: any
const Briefwahl2021 = () => {
  let State: any;
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showSearchItems, setShowSearchItems] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermpopup, setSearchTermpopup] = useState('');
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null); // State to store selected item for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility
  const [isSearchModalOpen, setisSearchModalOpen] = useState(false); // State to control the modal visibility
  const [SelectedTile, setSelectedTile] = useState(State != undefined && State != '' ? State : '');
  const [ChangeStateDataArray, setChangeStateDataArray] = useState([{ Title: 'Deutschlandweit', SortOrder: 1, src: 'https://gruene-weltweit.de/assets/Deutschlandweit.png', IsSelected: false }])
  const [ChangeStateDataArrayIcon, setChangeStateDataArrayIcon] = useState([{ Title: 'Deutschlandweit', SortOrder: 1, src: 'https://gruene-weltweit.de/assets/Deutschlandweit.png', IsSelected: false }])
  const [isExpanded, setIsExpanded] = useState(false);
  const [Email, setEmail] = useState('');
  const [LinkOnlineFormular, setLinkOnlineFormular] = useState('');
  const [Iscolor, setIscolor] = useState('Green');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);  // Toggle between expanded and collapsed
  };



  // Function to copy email to clipboard
  const copyEmailToClipboard = () => {
    if (selectedItem?.Email) {
      navigator.clipboard.writeText(selectedItem.Email)
        .then(() => {
          setIsCopied(true);
          //setTimeout(() => setIsCopied(false), 2000); // Reset "copied" state after 2 seconds
        })
        .catch(err => console.error("Failed to copy: ", err));
    }
  };

  // Function to generate the mailto link with custom subject and body
  const generateMailToLink = () => {
    const subject = `Antrag Briefwahl - Wahlkreis ${selectedItem?.Wahlkreis} - ${selectedItem?.WKName}`;
    return `mailto:${selectedItem?.Email}?subject=${encodeURIComponent(subject)}`;
  };

  const handleSubmit = async () => {
    try {
      try {
        const postDataArray = [{ id: selectedItem?.id, Email: Email, LinkBundestag: LinkOnlineFormular, Title: selectedItem?.Title, Gemeinde: selectedItem?.Gemeinde, Wahlkreis: selectedItem?.Wahlkreis, WKName: selectedItem?.WKName, PLZ: selectedItem?.PLZ, Bevolkerung: selectedItem?.Bevolkerung, ExistingEmail: selectedItem?.Email, ExistingLinkBundestag: selectedItem?.LinkBundestag, Status: {IsEmailVerified:false,IsLinkBundestagVerified:false} }];
        const postData = {
          data: postDataArray,
          tableName: 'BriefwahlFeedback',
          ApiType: 'postData'
        };
        const response = await axios.post('https://gruene-weltweit.de/SPPublicAPIs/createTableColumns.php', postData);
        if (response.status === 200) {
          setAlertMessage('Vielen Dank für Deine Hilfe!');
          setShowAlert(true)
          setEmail('')
          setLinkOnlineFormular('')
        } else {
          console.error('Error sending data to server:', response.statusText);
        }

      } catch (error) {
        console.error('An error occurred:', error);
      }

    } catch (error) {
      console.error('An error occurred:', error);
    }
    closeModal();
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
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
    { Title: 'Deutschlandweit', SortOrder: 1, src: 'https://gruene-weltweit.de/assets/Deutschlandweit.png', IsSelected: false },
    { Title: 'Baden-Württemberg', SortOrder: 2, src: 'https://gruene-weltweit.de/assets/Baden-Wurttemberg.png', IsSelected: false },
    { Title: 'Bayern', SortOrder: 3, src: 'https://gruene-weltweit.de/assets/Bayern.png', IsSelected: false },
    { Title: 'Berlin', SortOrder: 4, src: 'https://gruene-weltweit.de/assets/Berlin.png', IsSelected: false },
    { Title: 'Brandenburg', SortOrder: 5, src: 'https://gruene-weltweit.de/assets/Brandenburg.png', IsSelected: false },
    { Title: 'Bremen', SortOrder: 6, src: 'https://gruene-weltweit.de/assets/Bremen.png', IsSelected: false },
    { Title: 'Hamburg', SortOrder: 7, src: 'https://gruene-weltweit.de/assets/Hamburg.png', IsSelected: false },
    { Title: 'Hessen', SortOrder: 8, src: 'https://gruene-weltweit.de/assets/Hessen.png', IsSelected: false },
    { Title: 'Mecklenburg-Vorpommern', SortOrder: 9, src: 'https://gruene-weltweit.de/assets/Mecklenburg-Vorpommern.png', IsSelected: false },
    { Title: 'Nordrhein-Westfalen', SortOrder: 10, src: 'https://gruene-weltweit.de/assets/Nordrhein-Westfalen.png', IsSelected: false },
    { Title: 'Niedersachsen', SortOrder: 11, src: 'https://gruene-weltweit.de/assets/Niedersachen.png', IsSelected: false },
    { Title: 'Rheinland-Pfalz', SortOrder: 12, src: 'https://gruene-weltweit.de/assets/Rheinland-Pfalz.png', IsSelected: false },
    { Title: 'Saarland', SortOrder: 13, src: 'https://gruene-weltweit.de/assets/Saarland.png', IsSelected: false },
    { Title: 'Sachsen', SortOrder: 14, src: 'https://gruene-weltweit.de/assets/Sachsen.png', IsSelected: false },
    { Title: 'Sachsen-Anhalt', SortOrder: 15, src: 'https://gruene-weltweit.de/assets/Sachen-Anhalt.png', IsSelected: false },
    { Title: 'Schleswig-Holstein', SortOrder: 16, src: 'https://gruene-weltweit.de/assets/Schleswig-Holstein.png', IsSelected: false },
    { Title: 'Thüringen', SortOrder: 17, src: 'https://gruene-weltweit.de/assets/Thuringen.png', IsSelected: false }
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
      ChangeTile(selectedProvinceName, '')
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
      await fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataAll.php", requestOptions)
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
    setIsCopied(false);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setisSearchModalOpen(false)
    setSearchTerm('')
    setSearchTermpopup('')
    setIsExpanded(false)
    setEmail('')
    setLinkOnlineFormular('')
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
          String(item.PLZ || '').indexOf(trimmedSearchTerm) !== -1 || String(item.ZipCodes || '').indexOf(trimmedSearchTerm) !== -1 || String(item.WKName || '').indexOf(trimmedSearchTerm) !== -1
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
          String(item.PLZ || '').indexOf(trimmedSearchTerm) !== -1 || String(item.ZipCodes || '').indexOf(trimmedSearchTerm) !== -1 || String(item.WKName || '').indexOf(trimmedSearchTerm) !== -1
        );

      });

      setFilteredItems([...filtered]); // Update filtered items
      filteredItemsBackup = filtered;
      setShowSearchItems(true)
    }
  };
  const ChangeTile = (tile: string, Type: any) => {
    if (tile == 'DE-BB') {
      tile = 'Brandenburg'
    }
    let allfilterdata: any = []
    setSelectedTile(tile)
    if (tile != undefined && tile != undefined) {
      backupdata?.forEach((item: any) => {
        if (item?.Land == tile) {
          allfilterdata.push(item)
        }
      })
    }
    StateDataArray.map((item: any) => {
      if (item.Title.toLowerCase() == tile.toLowerCase()) {
        //setChangeStateDataArray([item]);
        if (Type == 'All') {
          setIscolor('Green')
        } else {
          setIscolor('Gray')
        }
        setChangeStateDataArrayIcon([item]);
      }
    })
    if (tile != 'Deutschlandweit' && tile.toLowerCase() != 'deutschlandweit') {
      BriefwahldataBackup = allfilterdata;
    } else if (tile != undefined && tile != undefined && tile.toLowerCase() == 'deutschlandweit') {
      BriefwahldataBackup = backupdata;
    } else {
      BriefwahldataBackup = allfilterdata;
    }

    if (tile == 'Berlin' || tile == 'Hamburg' || tile == 'Bremen') {
      setSearchTerm(tile);
      handleSearch(tile)
    }
    if (trimmedSearchTerm == undefined || trimmedSearchTerm == null || trimmedSearchTerm === '') {
      setFilteredItems([]);  // If search term is empty, clear the results
    } else {
      handleSearch(trimmedSearchTerm)
    }

  }
  useEffect(() => {
    console.log('filteredItems')
  }, [filteredItems, searchTerm])

  useEffect(() => {
    setCaptchaText(generateCaptcha());
  }, []); // Empty dependency array ensures it runs once when the component is mounted

  const handleCaptchaChange = (e) => {
    const value = e.target.value;
    setCaptchaInput(value);
    setIsCaptchaValid(value.toLowerCase() === captchaText.toLowerCase());
  };
  // Function to regenerate CAPTCHA text
  const refreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setCaptchaInput('');
    setIsCaptchaValid(false);
  };

  function generateCaptcha(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < length; i++) {
      captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captcha;
  }

  return (
    <>
      <div className={filteredItems.length > 0 ? "container fgjj" : "container abc"} >
        <section className="section  Briefwahl2021">
          <div className="col-lg-12">
            <div id="BriefwahlTitleDiv">
              <h1 className="privacypageTitle">Bundestagswahl 2025 - Briefwahl Suchmaschine</h1>
              <ul className="scrollToBtns">
                <li onClick={() => openModalContent("modal2")}>
                  Anleitung Briefwahl - Bin in Deutschland gemeldet
                  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="17" viewBox="0 0 23 17" fill="none">
                    <path d="M14.7389 15.2777L15.8066 16.2668L22.9302 8.57225L15.8066 0.879883L14.7389 1.86679L20.2066 7.77225H0.727295V9.22679H20.3418L14.7389 15.2777Z" fill="white" />
                  </svg>
                </li>
                <li onClick={() => openModalContent("modal1")}>
                  Anleitung Briefwahl - Nicht mehr in Deutschland gemeldet
                  <svg xmlns="http://www.w3.org/2000/svg" width="23" height="17" viewBox="0 0 23 17" fill="none">
                    <path d="M14.7389 15.2777L15.8066 16.2668L22.9302 8.57225L15.8066 0.879883L14.7389 1.86679L20.2066 7.77225H0.727295V9.22679H20.3418L14.7389 15.2777Z" fill="white" />
                  </svg>
                </li>
              </ul>
            </div>

          </div>

          <div className="row clearfix Homepage position-relative">
            <div className="flex-searchrowWithBtn">
              <div className="CustomSearchInputWithBtn">
                <span className="BtnSearchIcon" onClick={() => setSearchTerm('')}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M13.3333 4C8.17867 4 4 8.17867 4 13.3333C4 18.488 8.17867 22.6667 13.3333 22.6667C15.5213 22.6701 17.6404 21.9014 19.3173 20.496L26.5773 27.756C26.6547 27.8334 26.7466 27.8948 26.8477 27.9367C26.9488 27.9786 27.0572 28.0001 27.1667 28.0001C27.2761 28.0001 27.3845 27.9786 27.4856 27.9367C27.5867 27.8948 27.6786 27.8334 27.756 27.756C27.8334 27.6786 27.8948 27.5867 27.9367 27.4856C27.9786 27.3845 28.0001 27.2761 28.0001 27.1667C28.0001 27.0572 27.9786 26.9488 27.9367 26.8477C27.8948 26.7466 27.8334 26.6547 27.756 26.5773L20.496 19.3173C21.9012 17.6403 22.6699 15.5213 22.6667 13.3333C22.6667 8.17867 18.488 4 13.3333 4ZM5.66667 13.3333C5.66667 9.09933 9.09933 5.66667 13.3333 5.66667C17.5673 5.66667 21 9.09933 21 13.3333C21 17.5673 17.5673 21 13.3333 21C9.09933 21 5.66667 17.5673 5.66667 13.3333Z" fill="#00893A" />
                </svg>
                </span>
                <input
                  type="text"
                  className="CustomSearchInput"
                  placeholder="Gib hier Deine Gemeinde oder Postleitzahl (PLZ) ein..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value); // Update searchTerm on typing
                    handleSearch(e.target.value); // Call handleSearch whenever typing
                  }}
                />
                <span className="BtnCrossIcon" onClick={clearSearchButton}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 33" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M23.0711 22.628L22.5997 23.0994L22.1282 23.5708L16 17.4426L9.87175 23.5708L9.40035 23.0994L8.92896 22.628L15.0572 16.4998L8.92896 10.3715L9.40035 9.90011L9.87175 9.42871L16 15.557L22.1282 9.42871L22.5997 9.90011L23.0711 10.3715L16.9428 16.4998L23.0711 22.628Z" fill="#333333" />
                </svg>
                </span>
                <span className="SearchInputFieldstateLogo">
                  {ChangeStateDataArrayIcon.map((item: any, index: any) => (
                    <img src={item.src} alt={item.Title} />
                  ))}
                </span>

                {showSearchItems == true && searchTerm !== '' && filteredItemsBackup.length > 0 ? (
                  <table className="SmartTableOnTaskPopup scrollbar">
                    {filteredItemsBackup.map((item, index) => (
                      <tr className='searchItemList p-1 fs-6'
                        key={index}
                        onClick={() => openModal(item)}
                        style={{ cursor: 'pointer' }}
                      ><td style={{ width: '78%' }}>
                          <span className="d-flex flex-column">
                            <span className="">
                              {item.PLZ || 'n/a'} {item.Gemeinde}
                            </span>
                            <span className=''>{item.WKName || 'n/a'} (WK {item.Wahlkreis || 'n/a'})</span>
                          </span>
                        </td>
                        <td style={{ width: '10%' }}>
                          <span className='align-content-start d-flex'>Email:
                            {item.Email ? <span className='OnlineIconSvg'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z" fill="#00893A" />
                            </svg></span> : <span className='NAIconSvg'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path fill-rule="evenodd" clip-rule="evenodd" d="M10.786 4.14797C8.96271 4.47725 7.08373 5.59373 5.88881 7.05785C5.28696 7.7955 4.45293 9.40344 4.22327 10.269C3.98202 11.1786 3.9245 13.072 4.10882 14.0401C4.74734 17.3946 7.36138 20.0438 10.7312 20.7517C11.625 20.9394 13.2986 20.9357 14.229 20.7436C17.5669 20.0553 20.269 17.226 20.8118 13.8514C20.9627 12.9137 20.8862 11.1061 20.6605 10.269C20.5725 9.94278 20.284 9.23101 20.0194 8.68735C18.3556 5.26838 14.6554 3.44927 10.786 4.14797ZM13.9965 5.42823C14.3948 5.51156 15.1425 5.78409 15.6579 6.03411C16.4562 6.42124 16.7284 6.62219 17.4933 7.39019C18.964 8.86693 19.6209 10.4183 19.6209 12.4154C19.6209 14.0082 19.1624 15.4983 18.3244 16.6295L18.0065 17.0587L12.973 12.0332C10.2047 9.26911 7.93966 6.96292 7.93976 6.90837C7.94006 6.76208 8.78561 6.21593 9.5323 5.87957C10.8156 5.30179 12.5517 5.12623 13.9965 5.42823ZM11.9731 12.913C14.7093 15.6449 16.948 17.9363 16.948 18.0053C16.948 18.074 16.7071 18.2842 16.4126 18.4723C13.483 20.3437 9.78456 19.966 7.36307 17.5479C6.21966 16.4061 5.50357 14.924 5.27062 13.2168C5.13639 12.2335 5.32229 10.8601 5.72845 9.83508C6.01459 9.11283 6.7357 7.94592 6.89601 7.94592C6.95234 7.94592 9.23712 10.1811 11.9731 12.913Z" fill="#333333" />
                            </svg></span>
                            }
                          </span>
                        </td>
                        <td style={{ width: '12%' }}>
                          <span className="align-content-start d-flex">
                            Online:
                            {item.ColumnLevelVerification && item.ColumnLevelVerification !== "" && item.ColumnLevelVerification !== "[]" && item.ColumnLevelVerification.indexOf('LinkBundestag') > -1 ? (
                              JSON.parse(item.ColumnLevelVerification).map((verification, index) => (
                                <span key={index} >
                                  {verification.Title === 'LinkBundestag' && verification.Value === "Incorrect" ? (
                                    <span className='MaybeIconSvg'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="24" height="24"><path d="m32 2c-16.568 0-30 13.432-30 30s13.432 30 30 30 30-13.432 30-30-13.432-30-30-30" fill="#FFE600" /></svg></span>

                                  ) : verification.Title === 'LinkBundestag' && verification.Value === "Correct" ? (
                                    <span className='OnlineIconSvg'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z"
                                        fill="#00893A"
                                      />
                                    </svg></span>
                                  ) : verification.Title === 'LinkBundestag' && verification.Value === "Maybe" ? (
                                    <span className='MaybeIconSvg'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="24" height="24"><path d="m32 2c-16.568 0-30 13.432-30 30s13.432 30 30 30 30-13.432 30-30-13.432-30-30-30" fill="#FFE600" /></svg></span>

                                  ) : verification.Title === 'LinkBundestag' && verification.Value === "" ? (
                                    <span className='MaybeIconSvg'><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="24" height="24"><path d="m32 2c-16.568 0-30 13.432-30 30s13.432 30 30 30 30-13.432 30-30-13.432-30-30-30" fill="#FFE600" /></svg></span>

                                  ) : null}
                                </span>
                              ))
                            ) : item.LinkBundestag ? (
                              <span className='OnlineIconSvg'>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z"
                                    fill="#00893A"
                                  />
                                </svg>
                              </span>
                            ) : (
                              <span className='NAIconSvg'>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M10.786 4.14797C8.96271 4.47725 7.08373 5.59373 5.88881 7.05785C5.28696 7.7955 4.45293 9.40344 4.22327 10.269C3.98202 11.1786 3.9245 13.072 4.10882 14.0401C4.74734 17.3946 7.36138 20.0438 10.7312 20.7517C11.625 20.9394 13.2986 20.9357 14.229 20.7436C17.5669 20.0553 20.269 17.226 20.8118 13.8514C20.9627 12.9137 20.8862 11.1061 20.6605 10.269C20.5725 9.94278 20.284 9.23101 20.0194 8.68735C18.3556 5.26838 14.6554 3.44927 10.786 4.14797ZM13.9965 5.42823C14.3948 5.51156 15.1425 5.78409 15.6579 6.03411C16.4562 6.42124 16.7284 6.62219 17.4933 7.39019C18.964 8.86693 19.6209 10.4183 19.6209 12.4154C19.6209 14.0082 19.1624 15.4983 18.3244 16.6295L18.0065 17.0587L12.973 12.0332C10.2047 9.26911 7.93966 6.96292 7.93976 6.90837C7.94006 6.76208 8.78561 6.21593 9.5323 5.87957C10.8156 5.30179 12.5517 5.12623 13.9965 5.42823ZM11.9731 12.913C14.7093 15.6449 16.948 17.9363 16.948 18.0053C16.948 18.074 16.7071 18.2842 16.4126 18.4723C13.483 20.3437 9.78456 19.966 7.36307 17.5479C6.21966 16.4061 5.50357 14.924 5.27062 13.2168C5.13639 12.2335 5.32229 10.8601 5.72845 9.83508C6.01459 9.11283 6.7357 7.94592 6.89601 7.94592C6.95234 7.94592 9.23712 10.1811 11.9731 12.913Z"
                                    fill="#333333"
                                  />
                                </svg>
                              </span>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}

                  </table>
                ) : (
                  searchTerm !== '' &&
                  filteredItems.length === 0 && (
                    <table className="SmartTableOnTaskPopupNoResult"><tr><td><p className="text-danger mt-3">No matching results found.</p></td></tr></table>
                  )
                )}
              </div>
              <div className='CustomSearchInputTile'>
                <ul className='HomepagestateListbuttonTiles'>
                  {ChangeStateDataArray.map((item, index) => {
                    const isFirstItem = index === 0;
                    const isActiveClass = Iscolor === 'Green' ? 'state active' : Iscolor === 'Gray' ? 'states active gray' : 'state active';
                    const className = isFirstItem ? `state ${isActiveClass}` : `states ${isActiveClass}`;

                    return (
                      <li key={index} onClick={() => ChangeTile(item.Title, 'All')} className={className}>
                        <img src={item.src} alt={item.Title} className="stateLogo" />
                        <span className="stateName">{item.Title}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

            </div>
            <div id='regions_div' className='left-map-section'>
              <div id="chart-wrapper">
                <Chart
                  width="100%"
                  height="520px"
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
            <div className='right-tile-section'>
              <ul className='mb-5 HomepagestateListTiles'>
                {StateDataArray.map((item, index) => (
                  item.Title.toLowerCase() !== 'deutschlandweit' && (
                    <li
                      key={index}
                      onClick={() => ChangeTile(item.Title, '')}
                      className={index === 0 ? (SelectedTile === item.Title ? "state active" : "state") : (SelectedTile === item.Title ? 'states active' : "states")}
                    >
                      <img src={item.src} alt={item.Title} className="stateLogo" />
                      <span className='stateName'>{item.Title}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>

            {/* <div className='right-tile-section'>
              <ul className='mb-5 HomepagestateListTiles'>
                {StateDataArray.map((item: any, index: any) => (
                  <li key={index} onClick={() => ChangeTile(item.Title)} className={index == 0 ? SelectedTile === item.Title ? "state active" : "state" : SelectedTile === item.Title ? 'states active' : "states"}>
                    <img src={item.src} alt={item.Title} className="stateLogo" />
                    <span className='stateName'>{item.Title}</span>
                  </li>
                ))}
              </ul>
            </div> */}


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
                    zIndex: '99999',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      width: '100%',
                      maxWidth: '600px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    }}
                  >
                    {/* Close icon at top-right */}
                    <button
                      onClick={closeModal}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >

                    </button>
                    <div className='BriefwahlInformationPopup'>
                      <div className='modal-header'>
                        <h3 className='modal-title'>Briefwahl Information - {selectedItem?.Gemeinde}</h3>
                        <span className='closePopupBtn' style={{ cursor: 'pointer' }} onClick={closeModal}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M6 18L18 6M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg></span>
                      </div>
                      <div className="modal-body">
                        <div className='infoBox'>
                          <div className="infoBox-itemBox">
                            <div className='infoBox-itemBox-item'>
                              <strong>PLZ:</strong> {selectedItem?.PLZ}
                              {selectedItem?.ZipCodes ? (
                                <div className="zipCodeHover">{selectedItem?.ZipCodes}</div>
                              ) : null}
                            </div>
                            <div className='infoBox-itemBox-item'><strong>Gemeinde:</strong>{selectedItem?.Gemeinde}</div>
                          </div>
                          <div className="infoBox-itemBox">
                            <div className='infoBox-itemBox-item'><strong>Wahlkreis:</strong>{selectedItem?.Wahlkreis}</div>
                            <div className='infoBox-itemBox-item'><strong>WK Name:</strong>{selectedItem?.WKName}</div>
                          </div>
                        </div>
                        <div className="infoBox">
                          <div className="col">
                            <strong>Email: </strong>
                            <span className="email-container">
                              {/* Email link */}
                              <a className=' text-bold' href={generateMailToLink()}>{selectedItem?.Email ? selectedItem?.Email : 'n/a'}</a>

                              {/* Copy Icon */}
                              <span
                                className="copy-icon"
                                onClick={copyEmailToClipboard}
                                style={{ cursor: 'pointer', marginLeft: '10px' }}
                                title="Copy to Clipboard"
                              >
                                <FaCopy color={isCopied ? 'green' : '#b6b0b0'} />
                              </span>

                              {/* Feedback text */}
                              {isCopied && <span style={{ color: '#008939', marginLeft: '10px' }}>Copied!</span>}
                            </span>
                          </div>
                        </div>
                        {/* <div className='infoBox'>
                          <div className='col'>
                            
                            <strong>Email:</strong> <a className='text-bold' href={`mailto:${selectedItem?.Email}`}>{selectedItem?.Email ? selectedItem?.Email : 'n/a'}</a>
                          </div>
                        </div> */}
                        {isExpanded && (
                          <>
                            <div className='infoBox'>
                              <div className='col' style={{ width: '100%' }}>
                                <input className="form-control m-0 rounded-0"
                                  type="text"
                                  value={Email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="Richtige Gemeinde-Email melden:"
                                  style={{ width: '100%' }}
                                />
                              </div>
                            </div>

                          </>
                        )}
                        <div className='infoBox'>
                          <div className="col-12">
                            <span className="VerifyOnlineStatus">
                              <span className="alignCenter d-flex">
                                {selectedItem.ColumnLevelVerification && selectedItem.ColumnLevelVerification !== "" && selectedItem.ColumnLevelVerification !== "[]" && selectedItem.ColumnLevelVerification.indexOf('LinkBundestag') > -1 ? (
                                  JSON.parse(selectedItem.ColumnLevelVerification).map((verification, index) => (
                                    <span key={index}>
                                      {verification.Title === 'LinkBundestag' && verification.Value === "Incorrect" ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                          <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
                                        </svg>
                                      ) : verification.Title === 'LinkBundestag' && verification.Value === "Correct" ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z"
                                            fill="#00893A"
                                          />
                                        </svg>
                                      ) : verification.Title === 'LinkBundestag' && verification.Value === "Maybe" ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                          <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
                                        </svg>
                                      ) : verification.Title === 'LinkBundestag' && verification.Value === "" ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                          <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
                                        </svg>
                                      ) : null}
                                    </span>
                                  ))
                                ) : selectedItem.LinkBundestag ? (

                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z"
                                      fill="#00893A"
                                    />
                                  </svg>

                                ) : (

                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M10.786 4.14797C8.96271 4.47725 7.08373 5.59373 5.88881 7.05785C5.28696 7.7955 4.45293 9.40344 4.22327 10.269C3.98202 11.1786 3.9245 13.072 4.10882 14.0401C4.74734 17.3946 7.36138 20.0438 10.7312 20.7517C11.625 20.9394 13.2986 20.9357 14.229 20.7436C17.5669 20.0553 20.269 17.226 20.8118 13.8514C20.9627 12.9137 20.8862 11.1061 20.6605 10.269C20.5725 9.94278 20.284 9.23101 20.0194 8.68735C18.3556 5.26838 14.6554 3.44927 10.786 4.14797ZM13.9965 5.42823C14.3948 5.51156 15.1425 5.78409 15.6579 6.03411C16.4562 6.42124 16.7284 6.62219 17.4933 7.39019C18.964 8.86693 19.6209 10.4183 19.6209 12.4154C19.6209 14.0082 19.1624 15.4983 18.3244 16.6295L18.0065 17.0587L12.973 12.0332C10.2047 9.26911 7.93966 6.96292 7.93976 6.90837C7.94006 6.76208 8.78561 6.21593 9.5323 5.87957C10.8156 5.30179 12.5517 5.12623 13.9965 5.42823ZM11.9731 12.913C14.7093 15.6449 16.948 17.9363 16.948 18.0053C16.948 18.074 16.7071 18.2842 16.4126 18.4723C13.483 20.3437 9.78456 19.966 7.36307 17.5479C6.21966 16.4061 5.50357 14.924 5.27062 13.2168C5.13639 12.2335 5.32229 10.8601 5.72845 9.83508C6.01459 9.11283 6.7357 7.94592 6.89601 7.94592C6.95234 7.94592 9.23712 10.1811 11.9731 12.913Z"
                                      fill="#333333"
                                    />
                                  </svg>

                                )}

                              </span>
                              {selectedItem?.OnlineStatus != null && selectedItem?.OnlineStatus != undefined && selectedItem?.OnlineStatus != "" && (<span className='VerifyOnlineStatusText'>Verifiziert - verfügbar ab {selectedItem?.OnlineStatus}</span>)}
                            </span>
                          </div>
                          <div className='col'>
                            <strong>Link Online Formular: </strong>
                            <a className='breakURLLink text-bold' href={selectedItem?.LinkBundestag} target="_blank" rel="noopener noreferrer">{selectedItem?.LinkBundestag}</a>
                          </div>
                        </div>
                        {isExpanded && (
                          <>

                            <div className='infoBox'>
                              <div className='col' style={{ width: '100%' }}>
                                <input className="form-control m-0 rounded-0"
                                  type="LinkOnlineFormular"
                                  value={LinkOnlineFormular}
                                  onChange={(e) => setLinkOnlineFormular(e.target.value)}
                                  placeholder="Richtigen Online-Link melden:"
                                  style={{ width: '100%' }}
                                />
                              </div>
                            </div>
                          </>
                        )}
                        {/* Expanded fields */}


                      </div>
                      {isExpanded && (
                        <div className='modal-footer'>
                          {/* Submit button */}
                          {isExpanded && (
                            <div className="captcha-container">
                              <span>Geben Sie das Wort ein:
                                <label htmlFor="captcha" className="captcha-label">
                                  {captchaText}
                                </label>
                                <span
                                  className="captcha-refresh-icon"
                                  onClick={refreshCaptcha}
                                  title="CAPTCHA aktualisieren"
                                  style={{ cursor: 'pointer', marginLeft: '10px' }}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path
                                      d="M12 4V1L8 5l4 4V6c4.418 0 8 3.582 8 8s-3.582 8-8 8c-2.255 0-4.293-.896-5.657-2.343l-2.121 2.121C7.895 19.307 9.889 20 12 20c5.523 0 10-4.477 10-10S17.523 0 12 0V4z"
                                      fill="#28a745" 
    />
                                  </svg>
                                </span>

                              </span>
                              <input
                                type="text"
                                id="captcha"
                                value={captchaInput}
                                onChange={handleCaptchaChange}
                                placeholder="Geben Sie CAPTCHA ein"
                                className="form-control"
                              />
                              {!isCaptchaValid && captchaInput && (
                                <small className="text-danger">Captcha ist falsch</small>
                              )}
                            </div>
                          )}

                          {/* {isExpanded && isCaptchaValid && (
                           <button
                             className='btn btn-primary rounded-0 mb-2'
                             onClick={handleSubmit}
                           >
                             Melden
                           </button>
                         )} */}
                          {isExpanded && (
                            <button
                              className="btn btn-primary rounded-0 mb-2"
                              onClick={handleSubmit}
                              disabled={!isCaptchaValid}  // Disabled if CAPTCHA is not valid
                            >
                              Melden
                            </button>
                          )}



                          {/* Close button */}
                          {/* <button
                           className='btn btn-secondary rounded-0 ms-2'
                           onClick={closeModal}
                         >
                           Close
                         </button> */}
                        </div>
                      )}

                      <div className="ExpandLinkFooter">

                        {/* Expand/Collapse icon button */}

                        {isExpanded ? (
                          <>
                            {/* <a onClick={handleToggleExpand}>Falsche Informationen melden</a> */}

                          </>
                        ) : (
                          <>
                            <a onClick={handleToggleExpand}>Falsche Informationen melden</a>
                          </>
                        )}


                        <span className='footer_text_right'>Alle Angaben ohne Gewähr</span>
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
                      <div className='modal-header'>{SelectedTile}</div>
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
                                  <td style={{ width: '12%' }}>
                                    <span className="align-content-start d-flex">
                                      Online:
                                      {item.ColumnLevelVerification && item.ColumnLevelVerification !== "" && item.ColumnLevelVerification !== "[]" ? (
                                        // Parse the JSON string to an array if it's a string
                                        JSON.parse(item.ColumnLevelVerification).map((verification, index) => (
                                          <span key={index}>
                                            {verification.Title === 'LinkBundestag' && verification.Value === "Incorrect" ? (
                                              <span style={{ marginLeft: '3px' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                  <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
                                                </svg>
                                              </span>
                                            ) : verification.Title === 'LinkBundestag' && verification.Value === "Correct" ? (
                                              <span style={{ marginLeft: '3px' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                  <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z"
                                                    fill="#00893A"
                                                  />
                                                </svg>
                                              </span>
                                            ) : verification.Title === 'LinkBundestag' && verification.Value === "Maybe" ? (
                                              <span style={{ marginLeft: '3px' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                  <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
                                                </svg>
                                              </span>
                                            ) : verification.Title === 'LinkBundestag' && verification.Value === "" ? (
                                              <span style={{ marginLeft: '3px' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                  <circle cx="8.9998" cy="8.9998" r="8.45" fill="#FFE600" />
                                                </svg>
                                              </span>
                                            ) : null}
                                          </span>
                                        ))
                                      ) : item.LinkBundestag ? (
                                        <span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z"
                                              fill="#00893A"
                                            />
                                          </svg>
                                        </span>
                                      ) : (
                                        <span>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              clipRule="evenodd"
                                              d="M10.786 4.14797C8.96271 4.47725 7.08373 5.59373 5.88881 7.05785C5.28696 7.7955 4.45293 9.40344 4.22327 10.269C3.98202 11.1786 3.9245 13.072 4.10882 14.0401C4.74734 17.3946 7.36138 20.0438 10.7312 20.7517C11.625 20.9394 13.2986 20.9357 14.229 20.7436C17.5669 20.0553 20.269 17.226 20.8118 13.8514C20.9627 12.9137 20.8862 11.1061 20.6605 10.269C20.5725 9.94278 20.284 9.23101 20.0194 8.68735C18.3556 5.26838 14.6554 3.44927 10.786 4.14797ZM13.9965 5.42823C14.3948 5.51156 15.1425 5.78409 15.6579 6.03411C16.4562 6.42124 16.7284 6.62219 17.4933 7.39019C18.964 8.86693 19.6209 10.4183 19.6209 12.4154C19.6209 14.0082 19.1624 15.4983 18.3244 16.6295L18.0065 17.0587L12.973 12.0332C10.2047 9.26911 7.93966 6.96292 7.93976 6.90837C7.94006 6.76208 8.78561 6.21593 9.5323 5.87957C10.8156 5.30179 12.5517 5.12623 13.9965 5.42823ZM11.9731 12.913C14.7093 15.6449 16.948 17.9363 16.948 18.0053C16.948 18.074 16.7071 18.2842 16.4126 18.4723C13.483 20.3437 9.78456 19.966 7.36307 17.5479C6.21966 16.4061 5.50357 14.924 5.27062 13.2168C5.13639 12.2335 5.32229 10.8601 5.72845 9.83508C6.01459 9.11283 6.7357 7.94592 6.89601 7.94592C6.95234 7.94592 9.23712 10.1811 11.9731 12.913Z"
                                              fill="#333333"
                                            />
                                          </svg>
                                        </span>
                                      )}
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
        {showAlert && <AlertPopup message={alertMessage} onClose={handleCloseAlert} />}
      </div>
    </>
  );
}

export default Briefwahl2021;