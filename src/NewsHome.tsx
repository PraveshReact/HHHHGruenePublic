import * as React from 'react';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
const NewsHomemainPage = (props: any) => {
    const [NewsData, setNewsData]: any = useState([]);
    const GetserverUrl = 'https://eventservers.onrender.com/api/getData';

    useEffect(() => {
        getNewsdata();
    }, [])
    const getNewsdata = async function () {
        const tableName = "Announcements"
        try {
            const response = await axios.get(`${GetserverUrl}?table=${tableName}`);
            if (response.status === 200) {
                setNewsData(response.data)
                console.log('Get data from server successfully');
                console.log(response)
            } else {
                console.error('Error sending data to server:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
    const HTMLRenderer = ({ content }: any) => {

        return (
            <div
                className="html-content container"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    };

    return (
        <>
            <div className=''>
                <header className='page-header text-center'><h1 className='page-title'>OV Washington News</h1></header>
                <section>
                    {NewsData.map((item: any) => (
                        <>
                            <div key={item.Id} className='news_home publicationItem has-shadow clearfix'>
                                <div className='entry-meta'><span>{item.PublishingDate}</span></div>
                                <div className='valign-middle'>
                                    <h4><a>{item.Title}</a></h4>
                                </div>
                                <div className='entry-content clearfix'>
                                    <div className='CoverImage'>
                                        <img className='image' src={item.ItemCover} />
                                    </div>
                                    <p>
                                        <HTMLRenderer content={item.Body} />
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
export default NewsHomemainPage;