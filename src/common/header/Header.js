import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Modal from "react-modal";

import logo from "../../assets/logo.jpeg";
import Login from "../../screens/login/Login";
import Register from "../../screens/register/Register";

import "./Header.css";

Modal.setAppElement("#root");

const Header = () => {
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem("access-token") !== null
  );

  const loginSuccessHandler = () => {
    setIsLoggedIn(true);
    setOpen(false);
  };

  const logoutHandler = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <>
      <div className="header">
        <div className="logo-section">
          <img
            src={logo}
            alt="logo"
            className="logo"
          />

          <span className="app-title">
            Doctor Finder
          </span>
        </div>

        <div className="button-section">
          {!isLoggedIn ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpen(true)}
            >
              LOGIN
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={logoutHandler}
            >
              LOGOUT
            </Button>
          )}
        </div>
      </div>

      <Modal
        isOpen={open}
        onRequestClose={() => setOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)"
          },
          content: {
            width: "450px",
            height: "420px",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            padding: "20px"
          }
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          Authentication
        </h2>

        <Tabs
          value={tabValue}
          onChange={(event, value) => setTabValue(value)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="LOGIN" />
          <Tab label="REGISTER" />
        </Tabs>

        <div style={{ marginTop: "20px" }}>
  {tabValue === 0 && (
    <Login onLoginSuccess={loginSuccessHandler} />
  )}

  {tabValue === 1 && (
  <Register
    onRegisterSuccess={() =>
      setTabValue(0)
    }
  />
)}
</div>
      </Modal>
    </>
  );
};

export default Header;