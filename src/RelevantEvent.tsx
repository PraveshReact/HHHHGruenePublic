import axios from "axios";
import React, { useState, useEffect } from 'react';
import moment from "moment";

export default function RelevantEvent(props: any) {
    const [allEvents, setallEvents]: any = useState([]);
    const newsWebpartId = props.newsItem[0].id
    //const GetserverUrl = 'http://localhost:4000/api/getData';
    const GetserverUrl = 'https://eventservers.onrender.com/api/getData';


    useEffect(() => {
        getNewsListData();
    }, [])

    const getNewsListData = async () => {
        const tableName = 'events';
        try {
            const response = await axios.get(`${GetserverUrl}?table=${tableName}`);
            // Parse SmartPagesId values from JSON strings to arrays
            const parsedData = response.data.map((item: any) => {
                let smartPagesIdArray = [];
                try {
                    // Check if SmartPagesId is a non-empty JSON string
                    if (item.SmartPagesId && item.SmartPagesId.trim() !== '') {
                        smartPagesIdArray = JSON.parse(item.SmartPagesId);
                    }
                } catch (error) {
                    console.error('Error parsing SmartPagesId:', error);
                    // Handle the error, such as setting to an empty array
                }

                return {
                    ...item,
                    SmartPagesId: smartPagesIdArray
                };
            });
            parsedData.map((item: any) => {
                if (item?.EventDate != null && item?.EventDate != undefined) {
                    item.EventDate = moment(item?.EventDate, "DD-MM-YYYY").format("DD MMM YYYY");
                }
                return item; // Return the modified item
            });
            // Filter data based on newsWebpartId
            const eventdata = parsedData.filter((item: any) => {
                // Check if SmartPagesId is an array and includes newsWebpartId
                if (Array.isArray(item?.SmartPagesId)) {
                    return item.SmartPagesId.includes(parseInt(newsWebpartId));
                } else {
                    // If SmartPagesId is not an array, check if it matches newsWebpartId
                    return item.SmartPagesId.includes(parseInt(newsWebpartId));
                }
            });

            if (eventdata && eventdata.length > 0) {
                props.showwebpart()
            }
            setallEvents(eventdata);
            console.log(allEvents);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getNewsListData();
    }, []); // This will run once on component mount


    useEffect(() => {
        getNewsListData();
    }, []); // This will run once on component mount

    // Usage:
    // Make sure you have the `allEvents` state initialized and set up correctly
    // It will be populated with the filtered events data

    return (
        <>
            {allEvents && allEvents?.length > 0 && (
                <div className="container">
                    <div className="panel panel-default">
                        <div className="panel-heading">Relevant Events</div>
                        {allEvents?.map((event: any) => (
                            <div key={event.Id} className="panel-body">
                                <div className="entry-meta">
                                    <div className="publishdata">
                                        <span className="small">{event?.EventDate}</span>
                                        <span>{event?.Title}</span>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );


}
