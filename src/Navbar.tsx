import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { IoChevronDown } from "react-icons/io5";
import SmartpageComponent from "./SmartpageComponent";
import { fetchData } from './service'

const Navbar = () => {
  const [data, setData] = useState([]);
  const [isSticky, setSticky] = useState(false);
  const [clickedTitle, setClickedTitle] = useState('');

  const GetserverUrl = 'https://eventservers.onrender.com/api/getData';

  useEffect(() => {
    const topNavigationData = async () => {
      const tableName = "navigation";
      try {
        const response = await axios.get(`${GetserverUrl}?table=${tableName}`);
        if (response.status === 200) {
          const structuredData = structureData(response?.data);
          setData(structuredData);
        } else {
          console.error('Error sending data to server:', response.statusText);
        }
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

  const structureData = (rawData:any) => {
    rawData.forEach((item:any) => {
      if (!item.children) {
        item.children = [];
      }
      item.children = [
        ...item.children,
        ...rawData.filter((child:any) => child.ParentId === item.id),
      ];
    });
    return rawData.filter((item:any) => !item.ParentId);
  };

  const handleLinkClick = (title:any) => {
    console.log(`Clicked on: ${title}`);
    setClickedTitle(title);
  };

  const renderItem = (item:any) => (
    <li key={item.id} className="nav-item dropdown">
      <Link
        to={`/${item.Title === "Home" ? "" : item.KeyTitle.toLowerCase()}`}
        id="navbarDropdown"
        role="button"
        data-toggle="dropdown"
        className="nav-link"
        //onMouseEnter={() => handleLinkHover(item.KeyTitle)}
        onClick={() => handleLinkClick(item?.Title)}
      >
        {item?.Title}
        {item.children.length > 0 && <span><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="m112 184 144 144 144-144"></path></svg></span>}
       
      </Link>
      {item.children.length > 0 && (
        <div className="dropdown-menu dropdown-menu-level-0">
          <div className="dropdown-menu-spacer"></div>
          <ul className="dropdown-menu-item" aria-labelledby="navbarDropdown">
            {item.children.map((child:any) => (
              <li key={child.id} className="dropdown-submenu">
                <Link
                  to={`/${child.KeyTitle.toLowerCase()}`}
                  className="nav-link dropdown-item"
                  onClick={() => handleLinkClick(child?.Title)}
                >
                  {child?.Title}
                </Link>
                {child.children.length > 0 && (
                  <div className="dropdown-submenu dropdown-menu-level-1">
                    <div className="dropdown-menu-spacer"> </div>
                    <ul className="dropdown-menu-item" aria-labelledby="navbarDropdown">
                      {child.children.map((subchild:any) => (
                        <li key={subchild.id} className="dropdown-submenu">
                          <Link
                            to={`/${child.KeyTitle.toLowerCase()}/${subchild.KeyTitle.toLowerCase()}`}
                            className="nav-link dropdown-item"
                            onClick={() => handleLinkClick(subchild?.Title)}
                          >
                            {subchild?.Title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );

  return (
    <>
 
      <div className={`headerContainer${isSticky ? " sticky" : ""}`}>
      <nav className="navbar navbar-top d-none d-lg-block navbar-expand-lg navbar-dark p-0 topmenu">
	    <div className="container">
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#topmenu-container" aria-controls="topmenu-container" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse justify-content-between" id="topmenu-container">
        <div className="some-profiles d-flex"></div>
        <div className="d-flex">
          <ul id="topmenu" className="navbar-nav small">
            <li className="menu-item nav-item"> <a title="Project page" href="/" className="nav-link">Home</a></li>
          </ul>
         
        </div>
      </div>
    </div>
		</nav>
        <div className="container d-flex align-item-center">
          <div className="nav_logo">
              <Link
                to={`/`}
                role="button"
                className="nav-link"
                onClick={() => handleLinkClick("Home")}
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
      <nav className={`navbar navbar-main navbar-light${isSticky ? " fixed-top" : ""}`}>
        <div className="container">
          <div className="navbar-collapse collapsed">
            <ul className="navbar-nav">
              {data.map((item) => renderItem(item))}
            </ul>
          </div>
        </div>
      </nav>
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



export default Navbar;
