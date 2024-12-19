import * as React from 'react';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { green } from '@mui/material/colors';
import { Panel, PanelType } from '@fluentui/react';
import { useNavigate } from "react-router-dom";
import SocialMediaIcon from './SocialMediaIcon';
import EventPanel from './EventPanel';

const EventHomemainPage = (props: any) => {
    const [EventData, setEventData]: any = useState([]);
    const GetserverUrl = 'https://eventservers.onrender.com/api/getDataFilterSmartPageId';
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [yearData, setYearData] = useState([]);
    const [uniqueYears, setUniqueYears] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isFlatView, setIsFlatView] = useState<boolean>(true);
    const [FilterData, setFilterData]: any = useState([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const navigate = useNavigate();
    const [url, setUrl] = useState('');
    const removeSpacialChar = (Title: any) => {
        return Title?.replace(/ /g, '-');
    }
    const HTMLRenderer = ({ content }: any) => {

        return (
            <div
                className="html-content"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    };
    const handleTitleClick = (newsItem: any) => {
        // Navigate to the new page and pass the newsItem as state
        setSelectedEvent(newsItem);
        setUrl(`https://www.gruene-washington.de/Veranstaltungen/${newsItem?.Title}`);
    };
    const handleCopy = () => {
        navigator.clipboard.writeText(url)
            .then(() => alert('URL copied to clipboard!'))
            .catch((err) => console.error('Failed to copy: ', err));
    };
    const closePanel = () => {
        setSelectedEvent(null);
    }

    const CustomHeader = () => {
        return (
            <>
                <div className="align-items-center d-flex justify-content-between w-100">
                    <h3 className="m-0">Event Details</h3>
                    <div className="Shareon align-items-baseline d-flex mb-0">
                        <h6>Share :</h6>
                        <SocialMediaIcon platform="facebook" postUrl={url} />
                        <SocialMediaIcon platform="twitter" postUrl={url} />
                        <SocialMediaIcon platform="linkedin" postUrl={url} />
                        <SocialMediaIcon platform="copy-link" postUrl={url} />
                        <span className="svg__iconbox svg__icon--cross" style={{ position: "relative", top: "6px" }} onClick={closePanel}></span>
                    </div>
                </div>

            </>
        );
    };
    const handleYearSelect = (year: any) => {
        console.log(year, "year")
        if (year == "All") {
            setFilterData(EventData)
            setSelectedYear(year);

        }
        else {
            setSelectedYear(year);
            const data: any = filterEventsByYear(EventData, year)
            setFilterData(data)
        }

    };
    useEffect(() => {
        getPublicServerData('events');
    }, [])

    const extractUniqueYears = (events: any): number[] => {
        const yearsSet = new Set<number>();

        events.forEach((event: { EventDate: string | number | Date; ItemRank: any }) => {

            const year = new Date(event?.EventDate).getFullYear();
            yearsSet.add(year);


        });

        return Array.from(yearsSet);
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
                    console.log(results, "resultsevenbt")
                    //   const footerItems = organizeData(results);
                    //   setData(footerItems);
                    const sortedEventData = [...results];
                    sortedEventData.sort((a: any, b: any) => {
                        const dateA: any = new Date(a.EventDate);
                        const dateB: any = new Date(b.EventDate);
                        return dateB - dateA;
                    });
                    const uniqueYears: any = extractUniqueYears(sortedEventData);
                    uniqueYears.unshift("All");
                    setYearData(uniqueYears);
                    setEventData(sortedEventData)
                    setFilterData(sortedEventData)
                    setSelectedYear(uniqueYears[0])
                })
                .catch(error => console.log('error', error));
        } catch (error) {
            console.error('An error occurred:', error);
        }
        return results;
    }
    const getEventdata = async function () {
        const tableName = "events"
        try {
            const response = await axios.get(`${GetserverUrl}?table=${tableName}`);
            if (response.status === 200) {
                const sortedEventData = [...response.data];

                sortedEventData.sort((a: any, b: any) => {
                    const dateA: any = new Date(a.EventDate);
                    const dateB: any = new Date(b.EventDate);
                    return dateB - dateA;
                });
                setEventData(sortedEventData)
                console.log('Get data from server successfully event', response);
                console.log(response)
            } else {
                console.error('Error sending data to server:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
    // sortedEventData.sort((a:any, b:any) => {
    //     const dateA: any = new Date(a.EventDate);
    //     const dateB: any = new Date(b.EventDate);
    //     return dateB - dateA;
    // });

    //To Correct the Format of The Date DD-MM-YYYY
    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
    const filterEventsByYear = (events: any, year: any) => {
        if (year == "All") {
            return events
        }
        else {
            return events.filter((event: { EventDate: string | number | Date; }) => {
                const eventYear = new Date(event.EventDate).getFullYear();
                return eventYear === year;
            });
        }

    };

    const handleClearSearch = () => {
        setSearchTerm('');
        if (isFlatView) {
            setFilterData(EventData)

        }
        else {
            const data: any = filterEventsByYear(EventData, selectedYear)
            setFilterData(data)
        }
    };
    const onToggleHandle = () => {
        if (!isFlatView) {
            setIsFlatView(!isFlatView)
            setFilterData(EventData)

        }
        else {
            setIsFlatView(!isFlatView)
            const data: any = filterEventsByYear(EventData, yearData[0])
            setFilterData(data)
        }
    }

    const handleSearch = (search: any) => {
        if (search == "") {
            const data: any = filterEventsByYear(EventData, selectedYear)
            setFilterData(data)
            setSearchTerm("")
        }
        else {
            setSearchTerm(search)
            if (isFlatView) {
                const filteredEvents = EventData.filter((event: { Title: string; EventDescription: string }) =>
                    event?.Title?.toLowerCase()?.includes(search.toLowerCase()) ||
                    event?.EventDescription?.toLowerCase()?.includes(search.toLowerCase())
                );
                setFilterData(filteredEvents)
            }
            else {
                const data: any = filterEventsByYear(EventData, selectedYear)
                const filteredEvents = data.filter((event: { Title: string; EventDescription: string }) =>
                    event?.Title?.toLowerCase()?.includes(search.toLowerCase()) ||
                    event?.EventDescription?.toLowerCase().includes(search.toLowerCase())
                );
                setFilterData(filteredEvents)
            }

        }
    }


    return (
        <>
            <div className="container">
                <header className='page-header text-center'><h1 className='page-title'>Events Home</h1></header>
                <div className="align-item-center align-items-baseline d-flex fs-6 gap-2 mb-4 searchFilter">
                    {/* <span>Search in all News Data:</span> */}
                    <div className="col position-relative">
                        <input
                            type="text"
                            placeholder="Search All..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}

                        />
                        {searchTerm && ( // Show the clear icon only if there is a value in searchTerm
                            <span onClick={handleClearSearch} className="searchinput-searchclear">X</span>
                        )}
                    </div>

                    <span>Showing {FilterData?.length} of {EventData?.length} Event</span>
                    {/* <button
                            onClick={() => setIsFlatView(!isFlatView)}
                            style={{
                                margin: '0 10px',
                                backgroundColor: isFlatView ? '#28a745' : '#007bff', // Green when flat view is on
                                color: 'white'
                            }}
                        >
                            {isFlatView ? 'Flat View On' : 'Flat View Off'}
                        </button> */}
                    <span className="d-flex">

                        <span className="me-2" >Flat View</span> {/* Text next to the toggle */}

                        <label
                            className={`toggle-container ${isFlatView ? 'toggled' : ''}`}
                            onClick={() => onToggleHandle()}
                            title={isFlatView ? 'Switch to Tab-View' : 'Switch to Flat-View'}
                        >
                            <div className="toggle-circle"></div>
                        </label>

                    </span>
                    <span className="text-end">
                        <a onClick={handleClearSearch}>
                            Clear All
                        </a>
                    </span>
                </div>
                {!isFlatView && <div>
                    <div id="tabs" className="exTab3" >
                        <ul className="nav nav-tabs" id="myTab">
                            {yearData.map((year) => (
                                <button className={`nav-link ${selectedYear === year ? 'active' : ''}`}
                                    key={year}
                                    onClick={() => handleYearSelect(year)}
                                >
                                    {year}
                                </button>
                            ))}
                        </ul>

                    </div>
                </div>}
                <section className={!isFlatView ? "border-top-0 border clearfix p-3 tab-content mb-3" : ''}>
                    {FilterData?.map((item: any) => (
                        <>
                            <div key={item.Id} className='events_home publicationItem has-shadow clearfix'>
                                <div className='entry-meta'>
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect width="416" height="384" x="48" y="80" fill="none" stroke-linejoin="round" stroke-width="32" rx="48"></rect><circle cx="296" cy="232" r="24"></circle><circle cx="376" cy="232" r="24"></circle><circle cx="296" cy="312" r="24"></circle><circle cx="376" cy="312" r="24"></circle><circle cx="136" cy="312" r="24"></circle><circle cx="216" cy="312" r="24"></circle><circle cx="136" cy="392" r="24"></circle><circle cx="216" cy="392" r="24"></circle><circle cx="296" cy="392" r="24"></circle><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M128 48v32m256-32v32"></path><path fill="none" stroke-linejoin="round" stroke-width="32" d="M464 160H48"></path></svg>
                                    <span>  {item?.EventDate ? formatDate(item.EventDate) : ''}</span></div>
                                <div className='valign-middle'>
                                    <h4 className="card-title" onClick={() => handleTitleClick(item)}>
                                        <a> {item?.Title}</a>
                                    </h4>
                                </div>
                                <div className='entry-content clearfix'>
                                    <div className='Coverimage'>
                                        <img className="image" src={item?.ItemCover == "" ? "https://gruene-washington.de/PublishingImages/Covers/Default_img.jpg" : item?.ItemCover ?? "https://gruene-washington.de/PublishingImages/Covers/Default_img.jpg"} />
                                    </div>

                                    <p>
                                        <HTMLRenderer content={item?.Description} />
                                    </p>
                                    {/* <div className="eventItemDesc cutoff-text">
                                        <div dangerouslySetInnerHTML={{ __html: item?.Description }}></div>
                                    </div> */}
                                </div>
                            </div>

                        </>

                    ))}
                    {selectedEvent && (
                        <EventPanel selectedEvent={selectedEvent} onClose={closePanel} url={url} />

                    )}
                    {/* {selectedEvent && (
                        <Panel
                            type={PanelType.medium}
                            customWidth="550px"
                            isOpen={selectedEvent}
                            isBlocking={false}
                            isFooterAtBottom={true}
                            onRenderHeader={CustomHeader}
                        >

                            <div className="p-0 news_home publicationItem clearfix bg-white  border-0 ">
                                <div className="p-0 news_home publicationItem clearfix bg-white  border-0 ">
                                    <div className='entry-meta'>
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect width="416" height="384" x="48" y="80" fill="none" stroke-linejoin="round" stroke-width="32" rx="48"></rect><circle cx="296" cy="232" r="24"></circle><circle cx="376" cy="232" r="24"></circle><circle cx="296" cy="312" r="24"></circle><circle cx="376" cy="312" r="24"></circle><circle cx="136" cy="312" r="24"></circle><circle cx="216" cy="312" r="24"></circle><circle cx="136" cy="392" r="24"></circle><circle cx="216" cy="392" r="24"></circle><circle cx="296" cy="392" r="24"></circle><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M128 48v32m256-32v32"></path><path fill="none" stroke-linejoin="round" stroke-width="32" d="M464 160H48"></path></svg>
                                        <span>  {selectedEvent?.EventDate ? formatDate(selectedEvent.EventDate) : ''}</span></div>
                                    <h4>{selectedEvent?.Title}</h4>
                                    <div className="imagedetail">

                                        <img className="image"
                                            src={selectedEvent?.ItemCover == "" ? "https://gruene-washington.de/PublishingImages/Covers/Default_img.jpg" :
                                                selectedEvent?.ItemCover ?? "https://gruene-washington.de/PublishingImages/Covers/Default_img.jpg"} />

                                    </div>
                                    <div className="eventItemDesc">
                                        <span>
                                            <p dangerouslySetInnerHTML={{ __html: selectedEvent?.Description }} />
                                        </span>
                                    </div>
                                </div>
                            </div>


                        </Panel>
                    )} */}


                </section>
            </div>
        </>
    )
};
export default EventHomemainPage;