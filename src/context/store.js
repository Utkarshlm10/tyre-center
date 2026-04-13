"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Papa from "papaparse";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [csvData, setCsvData] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSLT2sRabV3tq3foUMNXqIg9G2tkgGmSgDIjnQ2xpNpgU9EfFMaO4mMY-LhG6Qq6Ihe7x9ePJa8ztCQ/pub?output=csv";
        Papa.parse(url, {
          download: true,
          header: true,
          complete: (results) => {
            setCsvData(results.data);
          },
          error: (err) => {
            console.error("Error parsing CSV:", err);
          }
        });
      } catch (error) {
        console.error("Fetch CSV Error:", error);
      }
    };
    fetchCSV();
  }, []);

  return (
    <AppContext.Provider value={{ csvData, selectedBrand, setSelectedBrand }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
