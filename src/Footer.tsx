import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Footer = () => {
  const [data, setData] = useState<any>([]);
  const GetserverUrl = 'https://eventservers.onrender.com/api/getData';
  const organizeData = (rawData: any) => {
    const parents = rawData.filter((item: any) => !item.ParentId);
    return parents.map((parent: any) => ({
      ...parent,
      children: rawData.filter((child: any) => child.ParentId === parent.id)
    }));
  };
  useEffect(() => {
    const footerData = async () => {
      const tableName = "Footer";
      try {
        const response = await axios.get(`${GetserverUrl}?table=${tableName}`);
        if (response.status === 200) {
          const footerItems = organizeData(response?.data);
          setData(footerItems);
        } else {
          console.error('Error sending data to server:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };
    footerData();
  }, []);



  return (
    <div>
      <footer className="bg-sitecolor">
        <section className="footer-widgets-wrap">
          <div className="container">
            <div className="row">
              {data
                .slice() // Create a copy of the array to avoid mutating the original data
                .sort((a:any, b:any) => a.SortOrder - b.SortOrder) // Sort the array based on SortOrder of parent
                .map((parent:any) => (
                  <div key={parent.id} className="col">
                    <h4>{parent.Title}</h4>
                    <ul className="list-unstyled">
                      {parent.children
                        .slice() // Create a copy of the children array to avoid mutating the original data
                        .sort((a:any, b:any) => a.SortOrder - b.SortOrder) // Sort the array based on SortOrder of children
                        .map((child:any) => (
                          <li key={child.id} className="widget_links">
                            <a href={child.href} target="_blank" rel="noopener noreferrer">
                              {child.Title}
                            </a>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        </section>
        <section className="copyrights p-2">
          <div className="container">
            <div className="row">
              <div className="col-12 mt-4 mb-4">
                <hr></hr>
              </div>
            </div>
            <div className="row">
              <div className="col-8 col-md-10">
                <p>Powered By: <a href="https://hochhuth-consulting.de/">Hochhuth Consulting GmbH</a></p>
              </div>
              <div className="col-4 col-md-2">
                <a href="https://gruene-weltweit.de"><img
                  src="https://gruene-weltweit.de/SiteAssets/logo2.png"
                  alt="Gruene Logo" className="footer-logo"></img></a>
              </div>
            </div>

          </div>
        </section>
      </footer>
    </div>
  );
};

export default Footer;
