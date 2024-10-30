import axios from "axios";
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import SocialMediaIcon from "./SocialMediaIcon";
import { Panel, PanelType } from '@fluentui/react';
export default function RelevantNews(props: any) {
    const [allAnnouncements, setallAnnouncements]: any = useState([]);
    const newsWebpartId = props.newsItem[0].id
    //const GetserverUrl = 'http://localhost:4000/api/getDataFilterSmartPageId';
    //const GetserverUrl = 'http://localhost:4000/api/getData';
    const GetserverUrl = 'https://eventservers.onrender.com/api/getData';
    const [selectedNews, setSelectedNews] = useState<any>(null);
    const [url, setUrl] = useState('');
    const handleTitleClick = (newsItem: any) => {
        // Navigate to the new page and pass the newsItem as state
        setSelectedNews(newsItem);
        setUrl(`https://www.gruene-washington.de/Neuigkeiten/${newsItem?.Title}`);
    };
    const closePanel = () => {
        setSelectedNews(null);
    }
    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const CustomHeader = () => {
        return (
            <>
                <div className="align-items-center d-flex justify-content-between w-100">
                    <h3 className="m-0">News Details</h3>
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
    useEffect(() => {
        getNewsListData();
    }, [])

    const getNewsListData = async () => {
        const tableName = 'Announcements';
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
            // parsedData.map((item: any) => {
            //     if (item?.PublishingDate != null && item?.PublishingDate != undefined) {
            //         item.PublishingDate = moment(item?.PublishingDate, "MMM DD YYYY").format("DD MMM YYYY");
            //     }
            //     return item; // Return the modified item
            // });

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
            setallAnnouncements(eventdata);
            console.log(allAnnouncements, "allAnnouncementsallAnnouncements");
        } catch (error: any) {
            console.error(error);
        };
    };
    return (
        <>
            {allAnnouncements && allAnnouncements?.length > 0 && (
                <div className="container">
                    <div className="panel panel-default">
                        <div className="panel-heading">Relevant News</div>
                        {allAnnouncements?.map((news: any) => (
                            <div key={news.Id} className="panel-body">
                                <div className="relavantpanel">
                                    <div className="publishdata">
                                        <span>  {news?.PublishingDate ? formatDate(news?.PublishingDate) : ' '}</span>
                                        <span onClick={() => handleTitleClick(news)}>{news?.Title}</span>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            )}
            {selectedNews && (
                <Panel
                    type={PanelType.medium}
                    customWidth="550px"
                    isOpen={selectedNews}
                    isBlocking={false}
                    isFooterAtBottom={true}
                    onRenderHeader={CustomHeader}
                >
                    <div className="p-0 news_home publicationItem clearfix bg-white  border-0 ">
                    </div>
                    <div className="p-0 news_home publicationItem clearfix bg-white  border-0 ">
                        <div className='entry-meta'>
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect width="416" height="384" x="48" y="80" fill="none" stroke-linejoin="round" stroke-width="32" rx="48"></rect><circle cx="296" cy="232" r="24"></circle><circle cx="376" cy="232" r="24"></circle><circle cx="296" cy="312" r="24"></circle><circle cx="376" cy="312" r="24"></circle><circle cx="136" cy="312" r="24"></circle><circle cx="216" cy="312" r="24"></circle><circle cx="136" cy="392" r="24"></circle><circle cx="216" cy="392" r="24"></circle><circle cx="296" cy="392" r="24"></circle><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M128 48v32m256-32v32"></path><path fill="none" stroke-linejoin="round" stroke-width="32" d="M464 160H48"></path></svg>
                            <span>  {formatDate(selectedNews?.PublishingDate)}</span></div>
                        <h4>{selectedNews?.Title}</h4>
                        <div className="imagedetail">

                            <img className="image" src={selectedNews?.ItemCover == "" ? "https://gruene-washington.de/PublishingImages/Covers/Default_img.jpg" : selectedNews?.ItemCover ?? "https://gruene-washington.de/PublishingImages/Covers/Default_img.jpg"} />

                        </div>
                        <div className="eventItemDesc">
                            <span>
                                <p dangerouslySetInnerHTML={{ __html: selectedNews?.Body }}></p>
                            </span>
                        </div>
                    </div>


                </Panel>
            )}
        </>
    );


}

