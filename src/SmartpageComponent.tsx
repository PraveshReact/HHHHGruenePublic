import axios from "axios";
import React, { useEffect, useState } from "react";
import "./CSS/styles.css";
import "./CSS/custom.css";
import { useParams } from "react-router-dom";
import WahlWeltweit from "./WahlWeltweit";
import Briefwahl2021 from "./Briefwahl2021";
import GrueneWeltweitForm from "./GrueneWeltweitForm";
import RelevantNews from "./RelevantNews";
import EventDetail from "./event-detail";
import RelevantEvent from "./RelevantEvent";
import { truncate } from "fs/promises";
import Briefwahlsearch from "./Briefwahlsearch";
import { useLocation } from 'react-router-dom';
let FlagSmartPage = false
let showBriefflag=false;
const SmartpageComponent = ({ clickedTitle }: any) => {
  const { SmartPage: smartPage } = useParams(); // Destructure the SmartPage parameter from useParams
  const [EventData, setEventData]: any = useState([]);
  const [NewsData, setNewsData]: any = useState([]);
  const [Newsflag, setNewsflag]: any = useState(false);
  const [Eventflag, setEventflag]: any = useState(false);
  const [Showwebpart, setShowwebpart]: any = useState(false);
  const [Eventdetailflag, setEventdetailflag]: any = useState(false);
  const [Smartpageflag, setSmartpageflag]: any = useState(false);
  const [data, setData] = useState<any>([]);
  const newsEventserverUrl = 'https://eventservers.onrender.com/api/getData';
  const GetserverUrl = 'https://eventservers.onrender.com/api/getDataFilterbase';
  const KeyTitleFilterKeyTitle = 'https://eventservers.onrender.com/api/getFilterKeyTitle'
  const location = useLocation();
  let stateParam: any;
  if (location.pathname.indexOf('/BriefwahlSearch/State=') > -1) {
    const pathParts = location.pathname.split('/');
    stateParam = pathParts[pathParts.length - 1].split('=')[1];
    if (stateParam) {
      showBriefflag = true
    }
  }

  const urlParamsString = smartPage;
  // Parse the URL parameters into an object
  const urlParams = new URLSearchParams(urlParamsString);
  // Get the value of the 'ItemID' parameter
  const itemId = urlParams.get('ItemID');

  const getNewsdata = async function () {
    const tableName = "Announcements";
    try {
      const response = await axios.get(`${newsEventserverUrl}?table=${tableName}`);
      if (response.status === 200) {
        setNewsData(response.data);
        console.log('Get data from server successfully');
        console.log(response);
      } else {
        console.error('Error sending data to server:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const getEventdata = async function () {
    const tableName = "events";
    try {
      const response = await axios.get(`${newsEventserverUrl}?table=${tableName}`);
      if (response.status === 200) {
        setEventData(response.data);
        console.log('Get data from server successfully');
        console.log(response);
      } else {
        console.error('Error sending data to server:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  const showwebpart = () => {
    setShowwebpart(true)
  }

  const fetchData = async () => {
    const tableName = "SmartMetaData";
    let Title = smartPage
    try {
      const response = await axios.get(`${KeyTitleFilterKeyTitle}?table=${tableName}&Title=${smartPage}`);
      if (response.status === 200) {
        setData(response?.data);
        FlagSmartPage = true
        console.log('Get data from server successfully');
        console.log(response);
      } else {
        console.error('Error sending data to server:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  useEffect(() => {
    console.log("useEffect triggered");
    console.log("SmartPage:", smartPage);
    console.log("Newsflag:", Newsflag);
    console.log("Eventflag:", Eventflag);
    console.log("Smartpageflag:", Smartpageflag);

    if (smartPage === 'neuigkeiten') {
      getNewsdata();
      setNewsflag(true);
      setEventflag(false);
      setSmartpageflag(false);
      setEventdetailflag(false);
    } else if (smartPage === 'veranstaltungen') {
      getEventdata();
      setEventflag(true);
      setNewsflag(false);
      setSmartpageflag(false);
      setEventdetailflag(false);
    } else if (itemId) {
      setEventdetailflag(true);
      setEventflag(false);
      setNewsflag(false);
      setSmartpageflag(false);
    } else if (smartPage !== 'neuigkeiten' && smartPage !== 'veranstaltungen') {
      fetchData();
      setSmartpageflag(true);
      setNewsflag(false);
      setEventflag(false);
      setEventdetailflag(false);
    }
  }, [smartPage, Newsflag, Eventflag, Smartpageflag, Eventdetailflag]);

  // Rest of your component code...



  const HTMLRenderer = ({ content }: any) => {
    return (
      <div
        className="html-content container"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <><section className='SmartPages'>
      <div className='row'>
        <div className='col-12'>
          {Smartpageflag && (
            data.map((item: any, index: number) => {
              console.log("Item:", item);
              return (
                item.KeyTitle !== "Warum-aus-dem-Ausland-wählen" && item.KeyTitle.toLowerCase() !== 'europawahl-2024' && item.KeyTitle.toLowerCase() !== 'briefwahlsearch' && showBriefflag == false? (
                  <div key={index}>
                    <section
                      id="page-title"
                      className="page-title-parallax page-title-dark skrollable skrollable-between"
                      style={{
                        backgroundImage: `url("https://gruene-weltweit.de/PhotoGallery/SiteCollectionImages/default_coverImg.jpg")`,
                        backgroundPosition: `0px -117.949px`
                      }}
                      data-bottom-top="background-position:0px 300px;"
                      data-top-bottom="background-position:0px -300px;"
                    >
                      <div className="container text-center clearfix">
                        <h1 className="nott mb-3" style={{ fontSize: '54px' }}>
                          {item.AlternativeTitle}
                        </h1>
                        <span><HTMLRenderer content={item.ShortDescription} /></span>
                      </div>
                    </section>
                    <section className="section container">
                      <div className="row">
                        <div className={!Showwebpart ? "col-12" : "col-9"}>
                          <HTMLRenderer content={item.PageContentProfile} />
                          {item.KeyTitle == "Grüne-Weltweit" ? (<GrueneWeltweitForm />) : ''}
                        </div>
                        <div className={Showwebpart ? "col-3" : ""}>
                          {data.length > 0 && <RelevantNews newsItem={data} showwebpart={showwebpart} />}
                          {data.length > 0 && <RelevantEvent newsItem={data} showwebpart={showwebpart} />}
                        </div>
                      </div>
                    </section>
                  </div>
                ) :
                  item.KeyTitle.toLowerCase() !== 'europawahl-2024' && item.KeyTitle.toLowerCase() !== 'briefwahlsearch' && showBriefflag == false ? (
                    <WahlWeltweit />
                  ) : item.KeyTitle.toLowerCase() !== 'briefwahlsearch' && showBriefflag == false ? (
                    <Briefwahl2021 />
                  ) : (
                    <Briefwahlsearch stateParam={stateParam}/>
                  )
              );
            })
          )}
          {Newsflag && (
            <div className="container">
              <header className='page-header text-center'><h1 className='page-title'>OV Washington News</h1></header>
              {NewsData.map((item: any) => (
                <div key={item.Id} className='news_home publicationItem has-shadow clearfix'>
                  <div className='entry-meta'><span>{item.PublishingDate}</span></div>
                  <div className='valign-middle'>
                    <h4><a>{item.Title}</a></h4>
                  </div>
                  <div className='entry-content clearfix'>
                    <div className='Coverimage'>
                      <img className='image' src={item.ItemCover} />
                    </div>
                    <p>
                      <HTMLRenderer content={item.Body} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {Eventflag && (
            <div className='container'>
              <header className='page-header text-center'><h1 className='page-title'>Events Home</h1></header>
              <section>
                {EventData.map((item: any) => (
                  <div key={item.Id} className='my-3 news_home publicationItem has-shadow clearfix'>
                    <div className='entry-meta'><span>{item.PublishingDate}</span></div>
                    <div className='valign-middle'>
                      <h4><a>{item.Title}</a></h4>
                    </div>
                    <div className='entry-content clearfix'>
                      <div className='Coverimage'>
                        <img className='image' src={item.ItemCover} />
                      </div>
                      <p>
                        {item.Description}
                      </p>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          )}
          {showBriefflag && (
           <Briefwahlsearch stateParam={stateParam}/>
          )}
        </div>
      </div>
    </section></>
  );
};


export default SmartpageComponent;
