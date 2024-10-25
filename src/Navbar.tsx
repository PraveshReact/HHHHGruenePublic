import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { IoChevronDown } from "react-icons/io5";
import SmartpageComponent from "./SmartpageComponent";
import { fetchData } from './service'
import Container from 'react-bootstrap/Container';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { MdMenu, MdClose } from "react-icons/md";
const Navbarcomponent = () => {
  const [data, setData] = useState([]);
  const [isSticky, setSticky] = useState(false);
  const [clickedTitle, setClickedTitle] = useState('');
  const [clickItem, setClickItem] = useState();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  // const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();

  const GetserverUrl = 'https://eventservers.onrender.com/api/getData';
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
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
          const structuredData = structureData(results);
          console.log(structuredData, "structuredData")
          structuredData.sort((a: any, b: any) => a.SortOrder - b.SortOrder);
          setData(structuredData);
        })
        .catch(error => console.log('error', error));
    } catch (error) {
      console.error('An error occurred:', error);
    }
    return results;
  }
  useEffect(() => {
    const topNavigationData = async () => {
      const tableName = "navigation";
      try {
        const response: any = await getPublicServerData(`${tableName}`)

      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    topNavigationData();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // const handleLinkHover = (keyTitle:any) => {
  //   fetchData(keyTitle); // Call the fetchData function with the KeyTitle parameter
  // };

  const getParameterByName = () => {
    const searchParams = window?.location?.pathname?.split("/").pop()?.replace(/%20/g, ' ');
    if (searchParams)
      setClickedTitle(searchParams);
  };

  const handleScroll = useMemo(() => {
    const handleScrollEvent = () => {
      setSticky(window.scrollY > 56);
    };
    return debounce(handleScrollEvent, 100);
  }, []);

  const structureData = (rawData: any) => {
    rawData.forEach((item: any) => {
      if (!item.children) {
        item.children = [];
      }
      item.children = [
        ...item.children,
        ...rawData.filter((child: any) => child.ParentId === item.id),
      ];
    });
    return rawData.filter((item: any) => !item.ParentId);
  };

  // const handleLinkClick = (title: any, item: any) => {
  //   console.log(`Clicked on: ${title}`);
  //   setClickedTitle(title);
  //   setClickItem(item)

  // };
  const handleLinkClick = (title: any, item: any) => {
    console.log("Clicked on", item);
    setClickedTitle(title);
    setClickItem(item);

    // Navigate to the Smartpage with clickItem as state
    // if (item.KeyTitle) {
    //   navigate(`/${removeSpacialChar(title)}/${item.KeyTitle}`, { state: { clickItem: item } });
    // }
  };
  const removeSpacialChar = (Title: any) => {
    return Title.replace(/ /g, '-');
  }
  // const handleSearchChange = (e: any) => {
  //   setSearchInput(e.target.value);
  // };
  const renderItem = (item: any) => (
    <li key={item.id} className="nav-item dropdown">
      <Link
        to={{
          pathname: `/${item.Title === "Home" ? "" : removeSpacialChar(item.Title)}`,
        }}
        state={{ item: item }}  // This is the new way in React Router v6
        id="navbarDropdown"
        role="button"
        data-toggle="dropdown"
        className="nav-link"
      >
        {item?.Title}
      </Link>
      {/* <a
        href={`/${item.Title === "Home" ? "" : removeSpacialChar(item.Title)}`}
        className="nav-link dropdown-item"
        onClick={() => handleLinkClick(item?.Title, item)}
      >
        {item?.Title}
      </a> */}

      {item.children.length > 0 && (
        <span onClick={toggleDropdown}>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="m112 184 144 144 144-144"></path>
          </svg>
        </span>
      )}
      {
        window.innerWidth < 1200 ? dropdownOpen && item.children.length > 0 && (
          <div className="dropdown-menu dropdown-menu-level-0">
            <div className="dropdown-menu-spacer"></div>
            <ul className="dropdown-menu-item" aria-labelledby="navbarDropdown">
              {item.children.map((child: any) => (
                <li key={child.id} className="dropdown-submenu">
                  <a
                    href={`/${removeSpacialChar(child.KeyTitle)}`}
                    className="nav-link dropdown-item"
                    onClick={() => handleLinkClick(child?.Title, child)}
                  >
                    {child?.Title}
                  </a>

                  {child.children.length > 0 && (
                    <div className="dropdown-submenu dropdown-menu-level-1">
                      <div className="dropdown-menu-spacer"> </div>
                      <ul className="dropdown-menu-item" aria-labelledby="navbarDropdown">
                        {child.children.map((subchild: any) => (
                          <li key={subchild.id} className="dropdown-submenu">
                            <a
                              href={`/${removeSpacialChar(subchild.KeyTitle)}`}
                              className="nav-link dropdown-item"
                              onClick={() => handleLinkClick(subchild?.Title, subchild)}
                            >
                              {subchild?.Title}

                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
          : item.children.length > 0 && (
            <div className="dropdown-menu dropdown-menu-level-0">
              <div className="dropdown-menu-spacer"></div>
              <ul className="dropdown-menu-item" aria-labelledby="navbarDropdown">
                {item.children.map((child: any) => (
                  <li key={child.id} className="dropdown-submenu">
                    <a
                      href={`/${removeSpacialChar(child.KeyTitle)}`}
                      className="nav-link dropdown-item"
                      onClick={() => handleLinkClick(child?.Title, child)}
                    >
                      {child?.Title}
                    </a>
                    {child?.children?.length > 0 && (
                      <div className="dropdown-submenu dropdown-menu-level-1">
                        <div className="dropdown-menu-spacer"> </div>
                        <ul className="dropdown-menu-item" aria-labelledby="navbarDropdown">
                          {child?.children?.map((subchild: any) => (
                            <li key={subchild.id} className="dropdown-submenu">
                              <a
                                href={`/${removeSpacialChar(subchild.KeyTitle)}`}
                                className="nav-link dropdown-item"
                                onClick={() => handleLinkClick(subchild?.Title, subchild)}
                              >
                                {subchild?.Title}

                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )

      }

    </li>
  );

  return (
    <>

      <div className="headerContainer">
        {/* <nav className="navbar navbar-top d-none d-lg-block navbar-expand-lg navbar-dark p-0 topmenu">
          <div className="container">
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#topmenu-container" aria-controls="topmenu-container" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-between" id="topmenu-container">
              <div className="some-profiles d-flex"></div>
              <div className="d-flex">
                <ul id="topmenu" className="navbar-nav small">
                  <li className="menu-item nav-item "> <a title="Project page" href="/" className="nav-link">Home</a></li>
                </ul>
 
              </div>
            </div>
          </div>
        </nav> */}
        <div className="container d-flex align-item-center">
          <div className="nav_logo">
            <Link
              to={`/`}
              role="button"
              className="nav-link"
              onClick={() => handleLinkClick("Home", "")}
            >
              <img
                src="https://gruene-weltweit.de/SiteAssets/washington-dc_184.png"
                className="logo_image"
              />
              <span>GRÜNE WASHINGTON D.C.</span>
            </Link>
          </div>
        </div>
      </div>
      <Navbar expand="lg" className={`p-0${isSticky ? " sticky" : ""}`}>
        <Container>
          <Navbar.Brand href="/"><img src="https://gruene-weltweit.de/SiteAssets/nav-logo.png" /></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav">
            <MdMenu className="open" />
            <MdClose className="close" />
          </Navbar.Toggle>
          <Navbar.Collapse id="basic-navbar-nav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {data.map((item) => renderItem(item))}
            </ul>
            {/* <form className="d-flex">
              <FormControl>
                
                <Input
                  id="search-input"
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  value={searchInput}
                  onChange={handleSearchChange}
                />
                <InputLabel htmlFor="search-input" className="mt-5 text-white 3xl">{searchInput}</InputLabel>
              </FormControl>
            </form> */}

          </Navbar.Collapse>
        </Container>
      </Navbar>

    </>
  );
};

function debounce(func: any, wait: any) {
  let timeout: any;
  return (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}



export default Navbarcomponent;