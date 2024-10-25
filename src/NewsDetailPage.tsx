
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
export const NewsDetailPage = ({ selectedNews }: any) => {
    const [data, setData] = useState<any>({});
    const { newsId: newsId } = useParams(); // Destructure the SmartPage parameter from useParams
    const location = useLocation();
    // const { newsId } = location.state || {};
    console.log(newsId, "newsId")
    const removeSpacialChar2 = (Title: any) => {
        return Title?.replace(/-/g, ' ');
    }
    const getPublicServerSmartMetaData = async (tableName: any, Title: any, smartid: any) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "table": tableName,
                "keyTitle": newsId,
                "id": null
            });
            console.log(raw, "rawrawrawrawss")

            const requestOptions: any = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            const response = await fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataByTitle.php", requestOptions);
            const result = await response.json();
            if (result?.status == 200) {
                setData(result?.data);
            }
            else {
                setData({});
            }
            console.log(result, "resultresultresultresult")
            // Filter the results to match the specific KeyTitle
            //   const smartPageData = result?.data?.id != undefined ? [result?.data] : [];
        } catch (error) {
            console.error('An error occurred:', error);
            return [];
        }
    }

    useEffect(() => {
        getPublicServerSmartMetaData("Announcements", "", selectedNews?.id)

    }, [])

    console.log(selectedNews, "selectedNews")
    // if (!selectedNews) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div className="p-4 news_home publicationItem clearfix bg-white  border-0">
            <h4 className="alignCenter">{data?.Title}</h4>
            <div className="imagedetail">
                <img
                    className="image"
                    src={
                        data?.ItemCover === ""
                            ? "https://gruene-washington.de/PublishingImages/Covers/Default_img.jpg"
                            : data?.ItemCover ?? "https://gruene-washington.de/PublishingImages/Covers/Default_img.jpg"
                    }
                    alt={data?.Title}
                />
            </div>
            <div className="eventItemDesc">
                <span>
                    <p dangerouslySetInnerHTML={{ __html: data?.Body?.replaceAll(/&#160;/g, ' ') }} />
                </span>
            </div>
        </div>
    );
};

export default NewsDetailPage;
