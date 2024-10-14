import * as React from 'react';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import { green } from '@mui/material/colors';
const EventHomemainPage = (props: any) => {
    const [EventData, setEventData]: any = useState([]);
    const GetserverUrl = 'https://eventservers.onrender.com/api/getDataFilterSmartPageId';
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [yearData, setYearData] = useState([]);
    const [uniqueYears, setUniqueYears] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isFlatView, setIsFlatView] = useState<boolean>(true);
    const [FilterData, setFilterData]: any = useState([]);


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
    function formatDate(dateString: string) {
        // Parse the date string
        const date = new Date(dateString);
        // Extract day, month, and year
        const day = date.getDate();
        const month = date.getMonth() + 1; // getMonth() returns month from 0-11, so we add 1
        const year = date.getFullYear();
        // Construct the formatted date string
        const formattedDate = `${day}-${month}-${year}`;

        return formattedDate;
    }
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
                    event?.Title?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                    event?.EventDescription?.toLowerCase()?.includes(searchTerm.toLowerCase())
                );
                setFilterData(filteredEvents)
            }
            else {
                const data: any = filterEventsByYear(EventData, selectedYear)
                const filteredEvents = data.filter((event: { Title: string; EventDescription: string }) =>
                    event?.Title?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
                    event?.EventDescription?.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilterData(filteredEvents)
            }

        }
    }


    return (
        <>
            <div className="container">
                <header className='page-header text-center'><h1 className='page-title'>Events Home</h1></header>
                <div className="align-item-center d-flex gap-2 mb-4">
                    {/* <span>Search in all News Data:</span> */}
                    <div className="col">
                        <input
                            type="text"
                            placeholder="Search All..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
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
                <section className={!isFlatView ? "border-top-0 border clearfix p-3 tab-content" : ''}>
                    {FilterData?.map((item: any) => (
                        <>
                            <div key={item.Id} className='events_home publicationItem has-shadow clearfix'>
                                <div className='entry-meta'><span>  {item?.EventDate ? formatDate(item.EventDate) : ''}</span></div>
                                <div className='valign-middle'>
                                    <h4>{item.Title}</h4>
                                </div>
                                <div className='entry-content clearfix'>
                                    <div className='Coverimage'>
                                        <img className="image" src={item?.ItemCover == "" ? "https://gruene-washington.de/PublishingImages/Covers/Default_img.jpg" : item?.ItemCover ?? "https://gruene-washington.de/PublishingImages/Covers/Default_img.jpg"} />
                                    </div>
                                    <p>
                                        {/* { item.Description.replaceAll(/&#160;/g, ' '} */}
                                    </p>
                                    <p dangerouslySetInnerHTML={{ __html: item.Description.replaceAll(/&#160;/g, ' ') }} />
                                </div>
                            </div>

                        </>

                    ))}

                </section>
            </div>
        </>
    )
};
export default EventHomemainPage;