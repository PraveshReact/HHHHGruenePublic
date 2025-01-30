import * as React from 'react';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { ColumnDef } from '@tanstack/react-table';
import { useParams } from 'react-router-dom';
import GlobalCommanTable from './GlobalCommanTable';
import './CSS/Briefwahlsearch.css';
import Highlighter from "react-highlight-words";
import axios from 'axios';
import { cursorTo } from 'readline';
import AlertPopup from './AlertPopup';
import { getAllTableData } from './service';

const Botschaftskuriere = (props: any) => {
    const [AllBotschaftskuriere, setAllBotschaftskuriere]: any = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleCloseAlert = () => {
        setShowAlert(false);
    };
    useEffect(() => {
        getTabledata("GWTBotschaftskuriere");
    }, [])
    const getTabledata = async (tableName) => {
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
            await fetch("https://gruene-weltweit.de/SPPublicAPIs/getDataAll.php", requestOptions)
                .then(response => response.text())
                .then((result: any) => {
                    result = JSON.parse(result)
                    if (result != undefined && result != null && result?.data != undefined && result?.data != null)
                        setAllBotschaftskuriere(result?.data);
                    else
                        setAllBotschaftskuriere([]);
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
                size: 1,
                id: 'Id',
            },
            {
                accessorKey: "Title",
                placeholder: "Botschaft",
                header: "",
                id: "Title", size: 200,
                cell: ({ row }: any) => (
                    <>{row.original.Title}
                    </>
                ),

            },
            {
                accessorKey: "City", placeholder: "Stadt", header: "", id: "City", size: 140,
                cell: ({ row }: any) => (
                    <>
                        {row?.original?.City}
                    </>
                ),
            },

            {
                accessorKey: "Country", placeholder: "Land", header: "", id: "Country", size: 175,
                cell: ({ row }: any) => (
                    <>
                        {row?.original?.Country}
                    </>
                ),
            },
            {
                accessorKey: "DeadlineDay", placeholder: "Abgabefrist", header: "", id: "DeadlineDay", size: 280,
                cell: ({ row }: any) => (
                    <>
                        {row?.original?.DeadlineDay}
                    </>
                ),
            },

            // {
            //     accessorKey: "DeadlineTime", placeholder: "Lokale Uhrzeit", header: "", id: "DeadlineTime", size: 280,
            //     cell: ({ row }: any) => (
            //         <>
            //             {row?.original?.DeadlineTime}
            //         </>
            //     ),
            // },

            {
                accessorKey: "Link", placeholder: "Mehr Informationen", header: "", id: "Link", size: 435,
                cell: ({ row }: any) => (
                    <>
                        <a target='_blank' href={row?.original?.Link}>{row?.original?.Link}</a>
                    </>
                ),
            },
            {
                accessorKey: "Comment", placeholder: "Hinweis", header: "", id: "Comment", size: 435,
                cell: ({ row }: any) => (
                    <>
                        {row?.original?.Comment}
                    </>
                ),
            }
        ],
        [AllBotschaftskuriere]
    );
    const callBackData = (data: any) => {
        console.log(data)
    }

    return (
        <div className="container mb-5">
            <header className="page-header">
                <h1 className="page-title heading  text-center">Grüne Weltweit Botschaftskuriere</h1>
            </header>
           <div className="BotschaftskurierePageTable border"><GlobalCommanTable columns={columns} data={AllBotschaftskuriere} showHeader={true} callBackData={callBackData} expandIcon={true} hideTeamIcon={true} hideOpenNewTableIcon={true} /></div> 
            {showAlert && <AlertPopup message={alertMessage} onClose={handleCloseAlert} />}
        </div >

    )
};
export default Botschaftskuriere;