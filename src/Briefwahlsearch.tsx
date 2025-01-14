import * as React from 'react';
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { ColumnDef } from '@tanstack/react-table';
import { useParams } from 'react-router-dom';
import GlobalCommanTable from './GlobalCommanTable';
import './CSS/Briefwahlsearch.css';
import Highlighter from "react-highlight-words";


let backupdata: any = [];
let BriefwahldataBackup: any = [];
let trimmedSearchTerm : any
const Briefwahlsearch = (props: any) => {
    let State: any;
    const [Briefwahldata, setBriefwahldata]: any = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any | null>(null); // State to store selected item for the modal
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility

    if (props.stateParam && props.stateParam != undefined && props.stateParam != '') {
        State = decodeURIComponent(props.stateParam)
    }
    const [SelectedTile, setSelectedTile] = useState(State != undefined && State != '' ? State : 'Deutschlandweit');

    const StateDataArray: any = [
        { Title: 'Deutschlandweit', src: 'https://gruene-weltweit.de/assets/Deutschlandweit.png', IsSelected: false },
        { Title: 'Baden-Württemberg', src: 'https://gruene-weltweit.de/assets/Baden-Wurttemberg.png', IsSelected: false },
        { Title: 'Bayern', src: 'https://gruene-weltweit.de/assets/Bayern.png', IsSelected: false },
        { Title: 'Berlin', src: 'https://gruene-weltweit.de/assets/Berlin.png', IsSelected: false },
        { Title: 'Brandenburg', src: 'https://gruene-weltweit.de/assets/Brandenburg.png', IsSelected: false },
        { Title: 'Bremen', src: 'https://gruene-weltweit.de/assets/Bremen.png', IsSelected: false },
        { Title: 'Hamburg', src: 'https://gruene-weltweit.de/assets/Hamburg.png', IsSelected: false },
        { Title: 'Hessen', src: 'https://gruene-weltweit.de/assets/Hessen.png', IsSelected: false },
        { Title: 'Mecklenburg-Vorpommern', src: 'https://gruene-weltweit.de/assets/Mecklenburg-Vorpommern.png', IsSelected: false },
        { Title: 'Nordrhein-Westfalen', src: 'https://gruene-weltweit.de/assets/Nordrhein-Westfalen.png', IsSelected: false },
        { Title: 'Niedersachsen', src: 'https://gruene-weltweit.de/assets/Niedersachen.png', IsSelected: false },
        { Title: 'Rheinland-Pfalz', src: 'https://gruene-weltweit.de/assets/Rheinland-Pfalz.png', IsSelected: false },
        { Title: 'Saarland', src: 'https://gruene-weltweit.de/assets/Saarland.png', IsSelected: false },
        { Title: 'Sachsen', src: 'https://gruene-weltweit.de/assets/Sachsen.png', IsSelected: false },
        { Title: 'Sachen-Anhalt', src: 'https://gruene-weltweit.de/assets/Sachen-Anhalt.png', IsSelected: false },
        { Title: 'Schleswig-Holstein', src: 'https://gruene-weltweit.de/assets/Schleswig-Holstein.png', IsSelected: false },
        { Title: 'Thüringen', src: 'https://gruene-weltweit.de/assets/Thuringen.png', IsSelected: false }
    ]

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
                    if (State != undefined && State != undefined && State.toLowerCase() == 'deutschlandweit') {
                        BriefwahldataBackup = result?.data;
                    } else if (State != undefined && State != undefined) {
                        result?.data?.forEach((item: any) => {
                            if (item?.Land == State) {
                                allfilterdata.push(item)
                            }
                        })
                    }
                    if (State != undefined && State != undefined && State.toLowerCase() != 'deutschlandweit') {
                        BriefwahldataBackup = allfilterdata;
                    } else {
                        BriefwahldataBackup = result?.data;
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
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    let filterVal = row?.original?.Gemeinde;
                    filterVal = filterVal?.replace(/ö/g, 'o')
                        .replace(/ü/g, 'ue')
                        .replace(/ä/g, 'ae')
                        .replace(/ß/g, 'ss');
                    if (filterVal?.includes(filterValue) || row?.original?.Gemeinde?.toLowerCase().includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
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
                accessorKey: "WKName", placeholder: "WK Name", header: "", id: "WKName", size: 145,
                cell: ({ row }: any) => (
                    <>
                        {row?.original?.WKName}
                    </>
                ),
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.WKName?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
            },
            {
                accessorKey: "Wahlkreis", placeholder: "Wahlkreis", header: "", id: "Wahlkreis", size: 75,
                cell: ({ row }: any) => (
                    <>
                        {row?.original?.Wahlkreis}
                    </>
                ),
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Wahlkreis?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
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
                accessorKey: "LinkBundestag", placeholder: "Online Formular Link", header: "", id: "LinkBundestag", size: 435,
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
        if (tile != 'Alle'&& tile.toLowerCase() != 'deutschlandweit') {
            BriefwahldataBackup = allfilterdata;
        } else if (tile != undefined && tile != undefined && tile.toLowerCase() == 'deutschlandweit') {
            BriefwahldataBackup = backupdata;
        } else {
            BriefwahldataBackup = allfilterdata;
        }
        if (trimmedSearchTerm == undefined || trimmedSearchTerm == null || trimmedSearchTerm === '') {
            setFilteredItems([]);  // If search term is empty, clear the results
        }else{
            handleSearch(trimmedSearchTerm)
        }

    }
    const handleSearch = (searchTerm: string) => {
        trimmedSearchTerm = searchTerm.trim(); // Trim any leading/trailing spaces

        if (trimmedSearchTerm === '') {
            setFilteredItems([]);  // If search term is empty, clear the results
        } else {
            // Perform the search: filter based on the search term matching any value in the object
            const filtered = BriefwahldataBackup.filter((item: any) =>
                Object.values(item).some((val) =>
                    String(val).toLowerCase().includes(trimmedSearchTerm.toLowerCase())
                )
            );
            setFilteredItems(filtered); // Update filtered items
        }
    };

    const renderTable = filteredItems.length > 0 || searchTerm === '';

    // Open modal with selected item
    const openModal = (item: any) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };
    const clearSearchButton=()=>{
        setFilteredItems([]);
        setSearchTerm('')
    }
    return (
        <div className="container mb-5">
            <header className="page-header">
                <h1 className="page-title heading  text-center">Grüne Weltweit Briefwahl-Suchmaschine</h1>
            </header>

            <ul className='mb-5 mt-3 stateListTiles'>
                {StateDataArray.map((item: any, index: any) => (
                    <li key={index} onClick={() => ChangeTile(item.Title)} className={index == 0 ? SelectedTile === item.Title ? "state active" : "state" : SelectedTile === item.Title ? 'states active' : "states"}>
                        <img src={item.src} alt={item.Title} className="stateLogo" />
                        <span className='stateName'>{item.Title}</span>
                    </li>
                ))}
            </ul>
            <div className="container my-3">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-sm-12 p-0 position-relative">
                        <div className="CustomSearchInputWithBtn">
                            <span className="BtnSearchIcon" onClick={() => setSearchTerm('')}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M13.3333 4C8.17867 4 4 8.17867 4 13.3333C4 18.488 8.17867 22.6667 13.3333 22.6667C15.5213 22.6701 17.6404 21.9014 19.3173 20.496L26.5773 27.756C26.6547 27.8334 26.7466 27.8948 26.8477 27.9367C26.9488 27.9786 27.0572 28.0001 27.1667 28.0001C27.2761 28.0001 27.3845 27.9786 27.4856 27.9367C27.5867 27.8948 27.6786 27.8334 27.756 27.756C27.8334 27.6786 27.8948 27.5867 27.9367 27.4856C27.9786 27.3845 28.0001 27.2761 28.0001 27.1667C28.0001 27.0572 27.9786 26.9488 27.9367 26.8477C27.8948 26.7466 27.8334 26.6547 27.756 26.5773L20.496 19.3173C21.9012 17.6403 22.6699 15.5213 22.6667 13.3333C22.6667 8.17867 18.488 4 13.3333 4ZM5.66667 13.3333C5.66667 9.09933 9.09933 5.66667 13.3333 5.66667C17.5673 5.66667 21 9.09933 21 13.3333C21 17.5673 17.5673 21 13.3333 21C9.09933 21 5.66667 17.5673 5.66667 13.3333Z" fill="#555555" />
                            </svg>
                            </span>
                            <input
                                type="text"
                                className="CustomSearchInput"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value); // Update searchTerm on typing
                                    handleSearch(e.target.value); // Call handleSearch whenever typing
                                }}
                                style={{ flex: 1 }}
                            />
                            <span className="BtnCrossIcon" onClick={clearSearchButton}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 33" fill="none">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M23.0711 22.628L22.5997 23.0994L22.1282 23.5708L16 17.4426L9.87175 23.5708L9.40035 23.0994L8.92896 22.628L15.0572 16.4998L8.92896 10.3715L9.40035 9.90011L9.87175 9.42871L16 15.557L22.1282 9.42871L22.5997 9.90011L23.0711 10.3715L16.9428 16.4998L23.0711 22.628Z" fill="#333333"/>
</svg></span>

                            <button className="btn btn-primary">Jetzt Starten</button>
                            {/* {searchTerm && (
                                <span
                                    className="BtnCrossIcon"
                                    onClick={() => setSearchTerm('')}
                                ><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <path d="M13.3333 4C8.17867 4 4 8.17867 4 13.3333C4 18.488 8.17867 22.6667 13.3333 22.6667C15.5213 22.6701 17.6404 21.9014 19.3173 20.496L26.5773 27.756C26.6547 27.8334 26.7466 27.8948 26.8477 27.9367C26.9488 27.9786 27.0572 28.0001 27.1667 28.0001C27.2761 28.0001 27.3845 27.9786 27.4856 27.9367C27.5867 27.8948 27.6786 27.8334 27.756 27.756C27.8334 27.6786 27.8948 27.5867 27.9367 27.4856C27.9786 27.3845 28.0001 27.2761 28.0001 27.1667C28.0001 27.0572 27.9786 26.9488 27.9367 26.8477C27.8948 26.7466 27.8334 26.6547 27.756 26.5773L20.496 19.3173C21.9012 17.6403 22.6699 15.5213 22.6667 13.3333C22.6667 8.17867 18.488 4 13.3333 4ZM5.66667 13.3333C5.66667 9.09933 9.09933 5.66667 13.3333 5.66667C17.5673 5.66667 21 9.09933 21 13.3333C21 17.5673 17.5673 21 13.3333 21C9.09933 21 5.66667 17.5673 5.66667 13.3333Z" fill="#555555"/>
                              </svg>
                                </span>
                            )} */}
                        </div>

                        {searchTerm !== '' && filteredItems.length > 0 ? (
                            <table className="SmartTableOnTaskPopup scrollbar">
                                {filteredItems.map((item, index) => (
                                    <tr className='searchItemList p-1 fs-6'
                                        key={index}
                                        onClick={() => openModal(item)}
                                        style={{ cursor: 'pointer' }}
                                    ><td style={{ width: '76%' }}>
                                    <Highlighter
                                      searchWords={[searchTerm]} // Highlight the search term
                                      autoEscape={true}           // Escape special characters
                                      textToHighlight={`${item.PLZ || 'n/a'} ${item.Gemeinde || ''},\u00A0WK: ${item.Wahlkreis || 'n/a'}\nWK Name: ${item.WKName || 'n/a'}`}
                                      renderText={(highlightedText) =>
                                        highlightedText.split("\n").map((line, index) => (
                                          <span key={index}>
                                            {line}
                                            <br />
                                          </span>
                                        ))
                                      }
                                      highlightStyle={{
                                        fontWeight: "bolder",      // Make the text extra bold (bolder than "900")
                                        fontStyle: "normal",      // Ensure it's not italicized
                                        color: "inherit",         // Avoid changing text color
                                        textDecoration: "none",   // Avoid any underlines or strikes
                                        backgroundColor: "transparent",
                                      }}
                                    />
                                  </td>
                                  
                                  {/* <span className="d-flex flex-column">
                                        <span className=''>{item.PLZ || 'n/a'} {item.Gemeinde}, &nbsp;{item.Wahlkreis || 'n/a'}</span>
                                        <span className=''>{item.WKName || 'n/a'}</span>
                                        </span> */}
                                        <td style={{ width: '12%' }}>
                                            <span className='align-content-start d-flex'>Email:
                                            {item.Email ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z" fill="#00893A" />
                                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.3302 3.64893C8.495 3.98036 6.6038 5.1041 5.4011 6.57775C4.79533 7.3202 3.95588 8.9386 3.72472 9.8098C3.4819 10.7253 3.42401 12.631 3.60953 13.6054C4.2522 16.9818 6.88325 19.6482 10.275 20.3607C11.1746 20.5496 12.8591 20.5459 13.7956 20.3526C17.1552 19.6598 19.8749 16.8121 20.4212 13.4155C20.5731 12.4717 20.4961 10.6523 20.2689 9.8098C20.1803 9.48145 19.89 8.76505 19.6236 8.21785C17.949 4.77663 14.2247 2.94569 10.3302 3.64893ZM13.5615 4.93752C13.9624 5.0214 14.715 5.2957 15.2338 5.54735C16.0373 5.937 16.3112 6.13925 17.0811 6.91225C18.5614 8.3986 19.2225 9.96005 19.2225 11.9702C19.2225 13.5733 18.7611 15.0731 17.9176 16.2117L17.5976 16.6437L12.5314 11.5855C9.74505 8.8034 7.4653 6.4822 7.4654 6.4273C7.4657 6.28005 8.31675 5.73035 9.0683 5.3918C10.3599 4.81026 12.1073 4.63356 13.5615 4.93752ZM11.525 12.471C14.279 15.2207 16.5323 17.527 16.5323 17.5964C16.5323 17.6656 16.2898 17.8772 15.9934 18.0665C13.0447 19.9501 9.3222 19.5699 6.88495 17.1361C5.7341 15.9868 5.01335 14.4951 4.77889 12.7768C4.64378 11.7871 4.83089 10.4047 5.2397 9.37305C5.5277 8.6461 6.2535 7.4716 6.41485 7.4716C6.47155 7.4716 8.7712 9.72135 11.525 12.471Z" fill="#333333" />
                                            </svg>
                                            }
                                            </span>
                                        </td>
                                        <td style={{ width: '12%' }}><span className='align-content-start d-flex'>Online:
                                           {item.LinkBundestag ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.4707 3.55257C10.0016 3.66045 8.6209 4.11661 7.41945 4.89104C6.92905 5.2071 6.5878 5.48345 6.1038 5.95645C4.71107 7.31745 3.90362 8.92085 3.60339 10.9216C3.5406 11.3398 3.54119 12.6375 3.60437 13.0784C3.83084 14.6591 4.43966 16.0862 5.3944 17.2745C5.72435 17.6851 6.41 18.366 6.80405 18.6744C7.9629 19.5813 9.3969 20.1808 10.9217 20.3961C11.378 20.4605 12.6255 20.4602 13.0785 20.3955C13.7841 20.2948 14.6695 20.0569 15.2328 19.8167C16.301 19.3611 17.0763 18.845 17.8965 18.0435C19.285 16.6867 20.1165 15.0346 20.3957 13.0784C20.4604 12.6254 20.4607 11.3779 20.3962 10.9216C20.121 8.97155 19.2872 7.31545 17.8965 5.95645C16.7462 4.83245 15.5067 4.14935 13.9217 3.76598C13.2376 3.60053 12.1305 3.50414 11.4707 3.55257ZM13.6965 12.48L10.4121 15.7646L8.7161 14.0689L7.02005 12.3732L7.57835 11.8139L8.13665 11.2546L9.27445 12.3919L10.4122 13.5293L13.1372 10.804L15.8623 8.0788L16.4216 8.6371L16.9809 9.19545L13.6965 12.48Z" fill="#00893A" />
                                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M10.3302 3.64893C8.495 3.98036 6.6038 5.1041 5.4011 6.57775C4.79533 7.3202 3.95588 8.9386 3.72472 9.8098C3.4819 10.7253 3.42401 12.631 3.60953 13.6054C4.2522 16.9818 6.88325 19.6482 10.275 20.3607C11.1746 20.5496 12.8591 20.5459 13.7956 20.3526C17.1552 19.6598 19.8749 16.8121 20.4212 13.4155C20.5731 12.4717 20.4961 10.6523 20.2689 9.8098C20.1803 9.48145 19.89 8.76505 19.6236 8.21785C17.949 4.77663 14.2247 2.94569 10.3302 3.64893ZM13.5615 4.93752C13.9624 5.0214 14.715 5.2957 15.2338 5.54735C16.0373 5.937 16.3112 6.13925 17.0811 6.91225C18.5614 8.3986 19.2225 9.96005 19.2225 11.9702C19.2225 13.5733 18.7611 15.0731 17.9176 16.2117L17.5976 16.6437L12.5314 11.5855C9.74505 8.8034 7.4653 6.4822 7.4654 6.4273C7.4657 6.28005 8.31675 5.73035 9.0683 5.3918C10.3599 4.81026 12.1073 4.63356 13.5615 4.93752ZM11.525 12.471C14.279 15.2207 16.5323 17.527 16.5323 17.5964C16.5323 17.6656 16.2898 17.8772 15.9934 18.0665C13.0447 19.9501 9.3222 19.5699 6.88495 17.1361C5.7341 15.9868 5.01335 14.4951 4.77889 12.7768C4.64378 11.7871 4.83089 10.4047 5.2397 9.37305C5.5277 8.6461 6.2535 7.4716 6.41485 7.4716C6.47155 7.4716 8.7712 9.72135 11.525 12.471Z" fill="#333333" />
                                            </svg>
                                            }
                                             </span>
                                        </td>

                                    </tr>
                                ))}

                            </table>
                        ) : (
                            searchTerm !== '' &&
                            filteredItems.length === 0 && (
                                <p className="text-danger mt-3">No matching results found.</p>
                            )
                        )}
                    </div>
                </div>
            </div>


            {
                isModalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: '99999',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: 'white',
                                padding: '24px',
                                borderRadius: '4px',
                                width: '100%',
                                maxWidth: '572px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                            }}

                        >
                            <div className='BriefwahlInformationPopup'>
                                <div className='modal-header'>Briefwahl Information - {selectedItem?.Gemeinde}</div>
                                <div className="modal-body">
                                    <div className='infoBox'>
                                        <div className="infoBox-itemBox">
                                            <div className='infoBox-itemBox-item'><strong>PLZ:</strong>{selectedItem?.PLZ}</div>
                                            <div className='infoBox-itemBox-item'><strong>Gemeinde:</strong>{selectedItem?.Gemeinde}</div>
                                        </div>
                                        <div className="infoBox-itemBox">
                                            <div className='infoBox-itemBox-item'><strong>Wahlkreis:</strong>{selectedItem?.Wahlkreis}</div>
                                            <div className='infoBox-itemBox-item'><strong>WK Name:</strong>{selectedItem?.WKName}</div>
                                        </div>
                                    </div>
                                    <div className='infoBox'>
                                        <div className='col'>
                                            <strong>Email:</strong> <a href={`mailto:${selectedItem?.Email}`}>{selectedItem?.Email ? selectedItem?.Email : 'n/a'}</a>
                                        </div>
                                    </div>
                                    <div className='infoBox'>
                                        <div className='col'>
                                            <strong>Link Online Formular: </strong>
                                            <a style={{ wordBreak: 'break-all' }} href={selectedItem?.LinkBundestag} target="_blank" rel="noopener noreferrer">{selectedItem?.LinkBundestag}</a></div>
                                    </div>
                                </div>
                                <div className='modal-footer'>
                                    <div className='float-end row'>
                                        <button className='btn btn-primary rounded-0' onClick={closeModal}> Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >

    )
};
export default Briefwahlsearch;