import React, { useState } from "react";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Header from "../../common/header/Header";
import DoctorList from "../doctorList/DoctorList";
import Appointment from "../appointment/Appointment";

const Home = () => {

const [tabValue,
setTabValue] =
useState(0);

return (
<>


  <Header />

  <Tabs
    value={tabValue}
    onChange={(event, value) =>
      setTabValue(value)
    }
    indicatorColor="primary"
    textColor="primary"
    centered
  >

    <Tab
      label="DOCTORS"
    />

    <Tab
      label="APPOINTMENT"
    />

  </Tabs>

  {tabValue === 0 && (
    <DoctorList />
  )}

  {tabValue === 1 && (
    <Appointment />
  )}

</>

);
};

export default Home;
