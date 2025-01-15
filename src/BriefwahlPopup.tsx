import React, { useState } from 'react';
import './CSS/Briefwahl.css';
import './CSS/custom.css';

const BriefwahlPopup = (props: any) => {
    const [showModal, setShowModal] = useState(props.showModal);
    const [showModal1, setShowModal1] = useState(props.showModal1);

    const cancelbox = () => {
        props.cancelbox();
    };

    const ModalPopup = () => {
        return (
            <><div id="box1content" className={`modal  ${showModal ? 'show' : ''}`} role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="col"><span className="subtext">Anleitung Briefwahl <br /></span> Bin in Deutschland gemeldet</h3>
                            <a className="text-dark" onClick={cancelbox}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368 144 144m224 0L144 368"></path></svg></a>
                        </div>
                        <div className="modal-body">
                            <div className="flex-20">
                                <strong>Anleitung zur Beantragung von Briefwahlunterlagen</strong>
                                <div className="flex-steps">
                                    <span className="flex-step">
                                        <span className="flex-steps-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none"> <path d="M19.6938 12.5967H32.45H37V16.8217V28.4404H32.3687V19.7467L14.25 36.4029L11 33.3967L29.1187 16.8217H19.6938V12.5967Z" fill="#005437" /></svg>
                                        </span>
                                        <span className='flex-steps-text'>Klick auf’s Bundesland</span>
                                    </span>
                                    <span className="flex-steps-arrow">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M24.6666 16.8374L16.7793 8.50032L15.6026 9.61146L21.6669 15.8835H7.33325V17.6677H21.6669L15.6026 24.0559L16.7793 25.167L24.6666 16.8374Z" fill="#333333" /></svg>
                                    </span>
                                    <span className="flex-step">
                                        <span className="flex-steps-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
                                                <path d="M23.9999 15.1562C21.3999 15.1562 19.2874 17.4313 19.2874 20.275C19.2874 23.1188 21.3999 25.3938 23.9999 25.3938C26.5999 25.3938 28.7124 23.1188 28.7124 20.275C28.7936 17.4313 26.6811 15.1562 23.9999 15.1562ZM23.9999 11.5C28.7936 11.5 32.6937 15.725 32.6937 20.8438C32.6937 26.0437 23.9999 37.5 23.9999 37.5C23.9999 37.5 15.3062 26.0437 15.3062 20.8438C15.3062 15.725 19.2061 11.5 23.9999 11.5Z" fill="#005437" />
                                            </svg>
                                        </span>
                                        <span className='flex-steps-text'>Eingabe der Stadt, Gemeinde oder PLZ</span>
                                    </span>
                                    <span className="flex-steps-arrow">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M24.6666 16.8374L16.7793 8.50032L15.6026 9.61146L21.6669 15.8835H7.33325V17.6677H21.6669L15.6026 24.0559L16.7793 25.167L24.6666 16.8374Z" fill="#333333" /></svg>
                                    </span>
                                    <span className="flex-step">
                                        <span className="flex-steps-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="49" viewBox="0 0 48 49" fill="none">
                                                <path d="M19.5471 23.6425C20.1817 23.6506 20.8146 23.7701 21.4158 24.0008L19.8388 25.577C18.837 25.4754 17.7995 25.7923 17.0333 26.5577L13.9231 29.667C12.5703 31.0206 12.5695 33.2224 13.9231 34.576C15.2767 35.9296 17.4794 35.9296 18.8321 34.576L21.9423 31.4666C22.7085 30.7005 23.0254 29.6629 22.9238 28.6603L24.5 27.0833C25.2378 29.0057 24.8405 31.2635 23.2902 32.8145L20.1801 35.9239C18.0798 38.0241 14.6755 38.0241 12.5752 35.9247C10.4749 33.8245 10.4749 30.4202 12.5752 28.3191L15.6854 25.2106C16.7506 24.1454 18.1513 23.6246 19.5471 23.6425ZM27.1081 19.9644L28.5332 21.3903L20.8227 29.1023L19.396 27.6773L27.1081 19.9644ZM31.6231 11.5C32.9994 11.5 34.3758 12.0249 35.4255 13.0754C37.525 15.1748 37.525 18.5783 35.4247 20.6794L32.3153 23.7887C30.7651 25.3389 28.5064 25.7362 26.5849 24.9985L28.1611 23.4223C29.1637 23.5239 30.2012 23.207 30.9674 22.4408L34.0768 19.3323C35.4296 17.9787 35.4304 15.7761 34.0768 14.4233C32.724 13.0697 30.5214 13.0697 29.1686 14.4233L26.0584 17.5318C25.293 18.298 24.9762 19.3347 25.0777 20.3373L23.5007 21.9135C22.7637 19.992 23.1619 17.7341 24.7113 16.1848L27.8207 13.0754C28.8704 12.0249 30.2467 11.5 31.6231 11.5Z" fill="#005437" />
                                            </svg>
                                        </span>
                                        <span className='flex-steps-text'>Es erscheint der Link zum Online-Antrag und/oder die Email</span>
                                    </span>
                                </div>
                                <span className='flex-20-text'>Online-Formular der Melde-Gemeinde in <a href="https://www.gruene-weltweit.de/Briefwahl" target="_blank"><strong>Grüne Weltweit Briefwahl-Suchmaschine</strong></a> finden:</span>
                            </div>
                            <div className="bannerlinks">
                                <div className="bannerlinksWithList">
                                    <a href="https://www.gruene-weltweit.de/Briefwahl" target="_blank">
                                        Per Online-Antrag
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M19 12.7528L13.0845 6.5L12.202 7.33335L16.7502 12.0374H6V13.3755H16.7502L12.202 18.1666L13.0845 19L19 12.7528Z" fill="white" />
                                        </svg>
                                    </a>
                                    <ul className="banner-list">
                                        <li>Online-Formular ausfüllen</li>
                                        <li>Unterlagen werden kostenlos zugeschickt</li>
                                    </ul>
                                </div>
                                <div className="bannerlinksWithList">
                                    <a href="https://www.gruene-weltweit.de/Briefwahl" target="_blank">
                                        Per formloser Email <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                            <path d="M5.5 14.7752H6.59688V17.4158H17.4438V14.7752H18.5V18.4721H5.5V14.7752ZM12 6.52832L12.65 7.17831L15.3719 9.90019L15.3313 9.94083H14.1125L12.4469 8.27519V14.2471H11.5531V8.23457L9.88752 9.90019H8.66877H8.62813L12 6.52832Z" fill="white" />
                                        </svg>
                                    </a>
                                    <ul className="banner-list">
                                        <li>Inhalt: Familienname, Vorname(n), Geburtsdatum, Anschrift</li>
                                        <li>Unterlagen werken kostenlos zugeschickt</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <div id="box2content" className={`modal ${showModal1 ? 'show' : ''}`} role="dialog" style={{ display: showModal1 ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="col"><span className="subtext">Anleitung Briefwahl <br /></span>Nicht mehr in Deutschland gemeldet</h3>
                                <a className="text-dark" onClick={cancelbox}><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368 144 144m224 0L144 368"></path></svg></a>
                            </div>
                            <div className="modal-body">
                                <div className="flex-8">
                                    <strong>Anleitung zum Eintrag ins Wähler*innenverzeichnis</strong>
                                    <span>Wer nicht mehr in Deutschland gemeldet ist muss den Eintrag ins Wähler*innenverzeichnis beantragen. Zuständig ist die Gemeinde, bei der man zuletzt gemeldet war.</span>
                                </div>
                                <div className="links">
                                    <a className="linkWithText" href="https://www.gruene-weltweit.de/Briefwahl" target="_blank">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 4.5L21.25 20.5H2.75L12 4.5ZM4.62748 19.4272H19.3725L12 6.67465L4.62748 19.4272ZM11.4532 15.8868V11.3807H12.5468V15.8868H11.4532ZM11.4532 17.8179V16.9596H12.5468V17.8179H11.4532Z" fill="#333333" />
                                        </svg>Muss bei jeder Wahl neu gemacht werden!</a>
                                    <a className="linkWithText" target="_blank" href="https://www.bundeswahlleiterin.de/dam/jcr/dc589523-d709-4c43-adbc-9342dda468ad/bwo_anlage-2_ausfuellbar.pdf"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.999 16.5629L17.1729 11.2966L16.3419 10.4458L12.591 14.1742V5H11.4095V14.2065L7.67635 10.4073L6.8297 11.3013L11.999 16.5629ZM4 20V16.2675H5.209V18.7237H18.7871V16.2675H20V19.9768L4 20Z" fill="#333333" />
                                    </svg>
                                        Der Antrag als Download
                                    </a>
                                </div>
                                <div className="flex-12">
                                    <span>Zu schicken an: die für die letzte Meldeadresse zuständige Behörde postalisch im Original oder neu per Fax, <a target="_blank" href="https://gruene-weltweit.de/briefwahl">E-Mail</a></span>
                                    <span className='text-danger'>Frist: Sonntag, 2. Februar 2025 (Eingangsdatum bei der Behörde)</span>
                                    <span>Mit dem Eintrag werden die Briefwahlunterlagen automatisch mitbeantragt.</span>
                                    <a target="_blank" href="https://www.bundeswahlleiterin.de/bundestagswahlen/2025/informationen-waehler/deutsche-im-ausland.html">Weitere Informationen: Bundeswahlleiterin - Deutsche im Ausland</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div></>
        );
    };

    return (
        <>
            <ModalPopup />
        </>
    );
}

export default BriefwahlPopup;
