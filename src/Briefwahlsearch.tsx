import * as React from 'react';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GlobalCommanTable from './GlobalCommanTable';
import './CSS/Briefwahlsearch.css';
let backupdata: any = []
const Briefwahlsearch = (props: any) => {
    let State: any;
    const [Briefwahldata, setBriefwahldata]: any = useState([]);
    if (props.stateParam && props.stateParam != undefined && props.stateParam != '') {
        State = decodeURIComponent(props.stateParam)
    }
    const [SelectedTile, setSelectedTile] = useState(State != undefined && State != '' ? State : 'Alle')
    useEffect(() => {
        getBriefwahldata();
    }, [])
    const getBriefwahldata = async () => {
        const tableName = "Briefwahl";
        let allfilterdata: any = []
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
                backupdata = result?.data;
                if (State != undefined && State != undefined) {
                    result?.data?.forEach((item: any) => {
                        if (item?.Land == State) {
                            allfilterdata.push(item)
                        }
                    })
                }
                if (State != undefined && State != undefined) {
                    setBriefwahldata(allfilterdata)
                } else {
                    setBriefwahldata(result?.data)
                }
                console.log('Get data from server successfully');
                console.log(result)
             
            })
            .catch(error => console.log('error', error));              
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };
    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
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
                id: "Gemeinde", size: 150,
                cell: ({ row }: any) => (
                    <>{row.original.Gemeinde}
                    </>
                ),
            },
            {
                accessorKey: "PLZ", placeholder: "PLZ", header: "", id: "PLZ", size: 100,
                cell: ({ row }: any) => (
                    <>
                        {row?.original?.PLZ}
                    </>
                ),
            },

            {
                accessorKey: "WKName", placeholder: "WKName", header: "", id: "WKName", size: 145,
                cell: ({ row }: any) => (
                    <>
                        {row?.original?.WKName}
                    </>
                ),
            },
            {
                accessorKey: "Wahlkreis", placeholder: "Wahlkreis", header: "", id: "Wahlkreis", size: 75,
                cell: ({ row }: any) => (
                    <>
                        {row?.original?.Wahlkreis}
                    </>
                ),
            },

            {
                accessorKey: "Email", placeholder: "Email", header: "", id: "Email", size: 295,
                cell: ({ row }: any) => (
                    <>
                          <a href={`mailto:${row?.original?.Email}`}>{row?.original?.Email}</a>
                    </>
                ),
            },

            {
                accessorKey: "LinkBundestag", placeholder: "LinkBundestag", header: "", id: "LinkBundestag", size: 435,
                cell: ({ row }: any) => (
                    <>
                        <div className='word-break'><a href={row?.original?.LinkBundestag} target="_blank" >{row?.original?.LinkBundestag}</a></div>
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
        let allfilterdata: any = []
        setSelectedTile(tile)
        if (tile != undefined && tile != undefined) {
            backupdata?.forEach((item: any) => {
                if (item?.Land == tile) {
                    allfilterdata.push(item)
                }
            })
        }
        if (tile != 'Alle') {
            setBriefwahldata(allfilterdata)
        } else {
            setBriefwahldata(backupdata)
        }
    }
    return (
        <div className="container">
            <header className="page-header">
                <h1 className="page-title heading  text-center">Grüne Weltweit Briefwahl-Suchmaschine</h1>
            </header>
            <h3 className=' text-center'>  *** Links und Adressen sind von Bundestagswahl 2021 - viele funktionieren aber auch für Bundestagswahl 2025 *** </h3>
            <div className="col-12 no-padding topDesign" id="BriefId">
                <ul id="stateslist">
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
                    <li className={SelectedTile === 'Mecklenburg-Vorpommern' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Mecklenburg-Vorpommern')}>Mecklenburg-Vorpommern</a>
                    </li>
                    <li className={SelectedTile === 'Niedersachsen' ? 'active' : ''}>
                        <a className="hreflink" onClick={() => ChangeTile('Niedersachsen')}>Niedersachsen</a>
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
                                    hideTeamIcon={true} hideOpenNewTableIcon={true} hideExcelIcon={false} hidePrintsIcon={false}
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
