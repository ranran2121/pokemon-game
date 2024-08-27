import React, { createContext, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export const AppContext = createContext({});

const Root = () => {
  const [map, setMap] = useState(null);

  return (
    <AppContext.Provider value={{ setMap, map }}>
      <Navbar />
      <Outlet />
    </AppContext.Provider>
  );
};

export default Root;
