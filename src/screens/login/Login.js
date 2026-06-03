import React, { useState } from "react";

import {
  FormControl,
  InputLabel,
  Input,
  Button,
  FormHelperText
} from "@material-ui/core";

const Login = ({ onLoginSuccess }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailRequired, setEmailRequired] =
    useState(false);

  const [passwordRequired,
    setPasswordRequired] =
    useState(false);

  const [emailInvalid,
    setEmailInvalid] =
    useState(false);

  const validateEmail = (email) => {

    return /\S+@\S+\.\S+/.test(email);

  };

  const loginHandler = async () => {

    let valid = true;

    setEmailRequired(false);
    setPasswordRequired(false);
    setEmailInvalid(false);

    if (email.trim() === "") {

      setEmailRequired(true);

      valid = false;
    }
    else if (!validateEmail(email)) {

      setEmailInvalid(true);

      valid = false;
    }

    if (password.trim() === "") {

      setPasswordRequired(true);

      valid = false;
    }

    if (!valid) {
      return;
    }

    try {

      const authString =
        window.btoa(
          email + ":" + password
        );

      const response =
        await fetch(
          "/auth/login",
          {
            method: "POST",

            headers: {
              Authorization:
                "Basic " +
                authString
            }
          }
        );

      if (response.ok) {

        const data =
          await response.json();

        console.log(
          "Login Response:",
          data
        );

        sessionStorage.setItem(
          "access-token",
          data.accessToken
        );

        sessionStorage.setItem(
          "uuid",
          data.id
        );

        sessionStorage.setItem(
          "first-name",
          data.firstName
        );

        sessionStorage.setItem(
          "last-name",
          data.lastName
        );

        sessionStorage.setItem(
          "email",
          data.emailAddress
        );

        alert(
          "Login Successful"
        );

        if (
          onLoginSuccess
        ) {
          onLoginSuccess();
        }

      } else {

        alert(
          "Invalid Credentials"
        );

      }

    } catch (error) {

      console.error(error);

      alert(
        "Unable to connect to backend"
      );

    }
  };

  return (

    <div>

      <FormControl
        required
        fullWidth
        margin="normal"
      >

        <InputLabel htmlFor="email">
          Email
        </InputLabel>

        <Input
          id="email"
          value={email}
          onChange={(e) => {

            setEmail(
              e.target.value
            );

            setEmailRequired(
              false
            );

            setEmailInvalid(
              false
            );

          }}
        />

        {emailRequired && (

          <FormHelperText error>
            Please fill out this field
          </FormHelperText>

        )}

        {emailInvalid && (

          <FormHelperText error>
            Enter valid Email
          </FormHelperText>

        )}

      </FormControl>

      <FormControl
        required
        fullWidth
        margin="normal"
      >

        <InputLabel htmlFor="password">
          Password
        </InputLabel>

        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {

            setPassword(
              e.target.value
            );

            setPasswordRequired(
              false
            );

          }}
        />

        {passwordRequired && (

          <FormHelperText error>
            Please fill out this field
          </FormHelperText>

        )}

      </FormControl>

      <br />

      <Button
        variant="contained"
        color="primary"
        onClick={
          loginHandler
        }
      >
        LOGIN
      </Button>

    </div>

  );
};

export default Login;