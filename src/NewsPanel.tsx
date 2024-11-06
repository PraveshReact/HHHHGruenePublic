import React from 'react';
import { Panel, PanelType } from '@fluentui/react';
import PropTypes from 'prop-types';
import { IoCalendarOutline } from 'react-icons/io5';
import SocialMediaIcon from './SocialMediaIcon';
const NewsPanel = ({ selectedNews, onClose, url }: any) => {
    const CustomHeader = () => (
        <div className="align-items-center d-flex justify-content-between w-100">
            <h3 className="m-0">News Details</h3>
            <div className="Shareon align-items-baseline d-flex mb-0">
                <h6>Share :</h6>
                <SocialMediaIcon platform="facebook" postUrl={url} />
                <SocialMediaIcon platform="twitter" postUrl={url} />
                <SocialMediaIcon platform="linkedin" postUrl={url} />
                <SocialMediaIcon platform="copy-link" postUrl={url} />
                <span
                    className="svg__iconbox svg__icon--cross"
                    style={{ position: "relative", top: "6px" }}
                    onClick={onClose}
                ></span>
            </div>
        </div>
    );

    return (
        selectedNews && (
            <Panel
                type={PanelType.medium}
                customWidth="550px"
                isOpen={Boolean(selectedNews)}
                isBlocking={false}
                isFooterAtBottom={true}
                onDismiss={onClose}
                onRenderHeader={CustomHeader}
            >
                <div className="p-0 news_home publicationItem clearfix bg-white border-0">
                    <div className="entry-meta">
                        <IoCalendarOutline />
                        <span>{formatDate(selectedNews?.PublishingDate)}</span>
                    </div>
                    <h4>{selectedNews?.Title}</h4>
                    <div className="imagedetail">
                        <img
                            className="image"
                            src={
                                selectedNews?.ItemCover ||
                                "https://gruene-washington.de/PublishingImages/Covers/Default_img.jpg"
                            }
                            alt="News cover"
                        />
                    </div>
                    <div className="eventItemDesc">
                        <span>
                            <p dangerouslySetInnerHTML={{ __html: selectedNews?.Body }}></p>
                        </span>
                    </div>
                </div>
            </Panel>
        )
    );
};

const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

NewsPanel.propTypes = {
    selectedNews: PropTypes.shape({
        PublishingDate: PropTypes.string,
        Title: PropTypes.string,
        ItemCover: PropTypes.string,
        Body: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
};

export default NewsPanel;
