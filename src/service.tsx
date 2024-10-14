import axios from "axios";
import React, { useEffect, useState } from "react";
let smartPageData:any=[]
export const fetchData = async (smartPageTitle:any) => {
    const KeyTitleFilterKeyTitle = 'https://eventservers.onrender.com/api/getFilterKeyTitle'
    const tableName = "SmartMetaData";
    let Title = smartPageTitle
    try {
      const response = await axios.get(`${KeyTitleFilterKeyTitle}?table=${tableName}&Title=${smartPageTitle}`);
      if (response.status === 200) {
        smartPageData = response?.data
        console.log('Get data from server successfully');
        console.log(response);
      } else {
        console.error('Error sending data to server:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
