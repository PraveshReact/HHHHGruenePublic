import * as React from 'react';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GlobalCommanTable from './GlobalCommanTable';
import './CSS/Briefwahlsearch.css';
let SelectedTile = 'Berlin'
let backupdata:any=[]
const Briefwahlsearch = (props: any) => {
    const [Briefwahldata, setBriefwahldata]: any = useState([]);
    const GetserverUrl = 'https://eventservers.onrender.com/api/getData';
    let State: any;
    if (props.stateParam && props.stateParam != undefined && props.stateParam != '') {
        State = props.stateParam
    }
    useEffect(() => {
        getBriefwahldata();
    }, [])
    const getBriefwahldata = async () => {
        const tableName = "Briefwahl";
        let allfilterdata: any = []
        try {
            const response = await axios.get(`${GetserverUrl}?table=${tableName}`);
            if (response.status === 200) {
                backupdata = response?.data;
                if (State != undefined && State != undefined) {
                    response?.data?.forEach((item: any) => {
                        if (item?.Land == State) {
                            allfilterdata.push(item)
                        }
                    })
                }
                if (State != undefined && State != undefined) {
                    setBriefwahldata(allfilterdata)
                } else {
                    setBriefwahldata(response?.data)
                }
                console.log('Get data from server successfully');
                console.log(response)
            } else {
                console.error('Error sending data to server:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: false,
                hasExpanded: false,
                isHeaderNotAvlable: true,
                size: 25,
                id: 'Id',
            },
            {
                accessorKey: "Gemeinde",
                placeholder: "Stadt",
                header: "",
                id: "Gemeinde",
                cell: ({ row }: any) => (
                    <>{row.original.Gemeinde}
                    </>
                ),
            },
            {
                accessorKey: "PLZ", placeholder: "PLZ", header: "", id: "PLZ", size: 5,
                cell: ({ row }: any) => (
                    <>
                        <a>{row?.original?.PLZ}</a>
                    </>
                ),
            },

            {
                accessorKey: "WKName", placeholder: "WKName", header: "", id: "WKName",
                cell: ({ row }: any) => (
                    <>
                        <a>{row?.original?.WKName}</a>
                    </>
                ),
            },
            {
                accessorKey: "Wahlkreis", placeholder: "Wahlkreis", header: "", id: "Wahlkreis", size: 55,
                cell: ({ row }: any) => (
                    <>
                        <a>{row?.original?.Wahlkreis}</a>
                    </>
                ),
            },

            {
                accessorKey: "Email", placeholder: "Email", header: "", id: "Email",
                cell: ({ row }: any) => (
                    <>
                        <a>{row?.original?.Email}</a>
                    </>
                ),
            },

            {
                accessorKey: "LinkBundestag", placeholder: "LinkBundestag", header: "", id: "LinkBundestag",
                cell: ({ row }: any) => (
                    <>
                        <a>{row?.original?.LinkBundestag}</a>
                    </>
                ),
            }
        ],
        [Briefwahldata]
    );
    const callBackData = (data: any) => {
        console.log(data)
    }
    const ChangeTile = (tile: string) => {
        let allfilterdata:any=[]
        if (tile != undefined && tile != undefined) {
            backupdata?.forEach((item: any) => {
                if (item?.Land == tile) {
                    allfilterdata.push(item)
                }
            })
        }
        if(tile!='Alle'){
            setBriefwahldata(allfilterdata)
        }else{
            setBriefwahldata(backupdata)
        }
    }
    return (
        <div className="container">
            <header className="page-header">
                <h1 className="page-title heading">OV Washington Briefwahl-Suchmaschine</h1>
            </header>
            <div className="col-12 no-padding topDesign" id="BriefId">
                <ul id="stateslist" className='p-2'>
                    <li className={SelectedTile === 'Baden-Württemberg' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Baden-Württemberg')}>Baden-Württemberg</a>
                    </li>
                    <li className={SelectedTile === 'Bayern' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Bayern')}>Bayern</a>
                    </li>
                    <li className={SelectedTile === 'Berlin' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Berlin')}>Berlin</a>
                    </li>
                    <li className={SelectedTile === 'Brandenburg' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Brandenburg')}>Brandenburg</a>
                    </li>
                    <li className={SelectedTile === 'Bremen' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Bremen')}>Bremen</a>
                    </li>
                    <li className={SelectedTile === 'Hamburg' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Hamburg')}>Hamburg</a>
                    </li>
                    <li className={SelectedTile === 'Hessen' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Hessen')}>Hessen</a>
                    </li>
                    <li className={SelectedTile === 'Niedersachsen' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Niedersachsen')}>Mecklenburg-Vorpommern</a>
                    </li>
                    <li className={SelectedTile === 'Berlin' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Berlin')}>Niedersachsen</a>
                    </li>
                    <li className={SelectedTile === 'Nordrhein-Westfalen' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Nordrhein-Westfalen')}>Nordrhein-Westfalen</a>
                    </li>
                    <li className={SelectedTile === 'Rheinland-Pfalz' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Rheinland-Pfalz')}>Rheinland-Pfalz</a>
                    </li>
                    <li className={SelectedTile === 'Saarland' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Saarland')}>Saarland</a>
                    </li>
                    <li className={SelectedTile === 'Sachsen' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Sachsen')}>Sachsen</a>
                    </li>
                    <li className={SelectedTile === 'Sachsen-Anhalt' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Sachsen-Anhalt')}>Sachsen-Anhalt</a>
                    </li>
                    <li className={SelectedTile === 'Schleswig-Holstein' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Schleswig-Holstein')}>Schleswig-Holstein</a>
                    </li>
                    <li className={SelectedTile === 'Thüringen' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Thüringen')}>Thüringen</a>
                    </li>
                    <li className={SelectedTile === 'Alle' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Alle')}>Alle</a>
                    </li>

                </ul>
            </div>
            <div className="tab-pane show active" id="Contacts" role="tabpanel" aria-labelledby="Contacts">
                <div>
                    <div className="TableContentSection">
                        <div className="Alltable mt-2 mb-2">
                            <div className="col-md-12 p-0 ">
                                <GlobalCommanTable
                                    fixedWidthTable={true}
                                    columns={columns}
                                    customHeaderButtonAvailable={true}
                                    data={Briefwahldata}
                                    showHeader={true}
                                    hideTeamIcon={true} hideOpenNewTableIcon={true}
                                    callBackData={callBackData}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
};
export default Briefwahlsearch;