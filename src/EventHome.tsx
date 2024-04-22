import * as React from 'react';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
const EventHomemainPage = (props: any) => {
    const [EventData, setEventData]: any = useState([]);
    const GetserverUrl = 'https://eventservers.onrender.com/api/getDataFilterSmartPageId';

    useEffect(() => {
        getEventdata();
    }, [])
    const getEventdata = async function () {
        const tableName = "Announcements"
        try {
            const response = await axios.get(`${GetserverUrl}?table=${tableName}`);
            if (response.status === 200) {
                setEventData(response.data)
                console.log('Get data from server successfully');
                console.log(response)
            } else {
                console.error('Error sending data to server:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <>
            <div className="container">
                <header className='page-header text-center'><h1 className='page-title'>Events Home</h1></header>
                <section>
                    {EventData.map((item: any) => (
                        <>
                            <div key={item.Id} className='events_home publicationItem has-shadow clearfix'>
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

                        </>

                    ))}

                </section>
            </div>
        </>
    )
};
export default EventHomemainPage;