import React from 'react';
import { Panel, PanelType } from '@fluentui/react';
import PropTypes from 'prop-types';
import { IoCalendarOutline } from 'react-icons/io5';
import SocialMediaIcon from './SocialMediaIcon'; // Import your social media icon component if it's in a separate file.

const EventPanel = ({ selectedEvent, onClose, url }: any) => {
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
            <div className="align-items-center d-flex justify-content-between w-100">
                <h3 className="m-0">Event Details</h3>
                <div className="Shareon align-items-baseline d-flex mb-0">
                    <h6>Share :</h6>
                    <SocialMediaIcon platform="facebook" postUrl={url} />
                    <SocialMediaIcon platform="twitter" postUrl={url} />
                    <SocialMediaIcon platform="linkedin" postUrl={url} />
                    <SocialMediaIcon platform="copy-link" postUrl={url} />
                    <span
                        className="svg__iconbox svg__icon--cross"
                        style={{ position: "relative", top: "6px" }}
                        onClick={onClose}>
                    </span>
                </div>
            </div>
        );
    };

    return (
        selectedEvent && (
            <Panel
                type={PanelType.medium}
                customWidth="550px"
                isOpen={Boolean(selectedEvent)}
                isBlocking={false}
                isFooterAtBottom={true}
                onDismiss={onClose}
                onRenderHeader={CustomHeader}
            >
                <div className="p-0 news_home publicationItem clearfix bg-white border-0">
                    <div className="entry-meta">
                        <IoCalendarOutline />
                        <span>{selectedEvent?.EventDate ? formatDate(selectedEvent.EventDate) : ''}</span>
                    </div>
                    <h4>{selectedEvent?.Title}</h4>
                    <div className="imagedetail">
                        <img
                            className="image"
                            src={selectedEvent?.ItemCover || "https://gruene-washington.de/PublishingImages/Covers/Default_img.jpg"}
                            alt="Event cover"
                        />
                    </div>
                    <div className="eventItemDesc">
                        <span>
                            <p dangerouslySetInnerHTML={{ __html: selectedEvent?.Description }}></p>
                        </span>
                    </div>
                </div>
            </Panel>
        )
    );
};

EventPanel.propTypes = {
    selectedEvent: PropTypes.shape({
        EventDate: PropTypes.string,
        Title: PropTypes.string,
        ItemCover: PropTypes.string,
        Description: PropTypes.string,
    }),
    onClose: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
};

export default EventPanel;
