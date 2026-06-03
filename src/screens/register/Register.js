import React, { useState } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";

const Register = ({ onRegisterSuccess }) => {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateMobile = (mobile) => {
    return /^[0-9]{10}$/.test(mobile);
  };

  const registerHandler = () => {

    let validationErrors = {};

    if (!firstName.trim()) {
      validationErrors.firstName =
        "Please fill out this field";
    }

    if (!lastName.trim()) {
      validationErrors.lastName =
        "Please fill out this field";
    }

    if (!dob) {
      validationErrors.dob =
        "Please fill out this field";
    }

    if (!mobile.trim()) {
      validationErrors.mobile =
        "Please fill out this field";
    } else if (!validateMobile(mobile)) {
      validationErrors.mobile =
        "Enter valid mobile number";
    }

    if (!emailId.trim()) {
      validationErrors.emailId =
        "Please fill out this field";
    } else if (!validateEmail(emailId)) {
      validationErrors.emailId =
        "Enter valid Email";
    }

    if (!password.trim()) {
      validationErrors.password =
        "Please fill out this field";
    }

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    const data = {
      firstName,
      lastName,
      dob,
      mobile,
      emailId,
      password
    };

    fetch("/users/register", {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(data)
    })
      .then(response => {

        if (response.ok) {

          alert(
            "Registration Successful"
          );

          setFirstName("");
          setLastName("");
          setDob("");
          setMobile("");
          setEmailId("");
          setPassword("");

          setErrors({});

          if (onRegisterSuccess) {
            onRegisterSuccess();
          }

        } else {

          alert(
            "Registration Failed"
          );

        }

      })
      .catch(error => {

        console.log(error);

        alert(
          "Unable to connect to backend"
        );

      });
  };

  return (
    <div>

      <TextField
        label="First Name"
        fullWidth
        margin="normal"
        value={firstName}
        onChange={(e) =>
          setFirstName(e.target.value)
        }
      />
      {errors.firstName && (
        <FormHelperText error>
          {errors.firstName}
        </FormHelperText>
      )}

      <TextField
        label="Last Name"
        fullWidth
        margin="normal"
        value={lastName}
        onChange={(e) =>
          setLastName(e.target.value)
        }
      />
      {errors.lastName && (
        <FormHelperText error>
          {errors.lastName}
        </FormHelperText>
      )}

      <TextField
        label="Date of Birth"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true
        }}
        value={dob}
        onChange={(e) =>
          setDob(e.target.value)
        }
      />
      {errors.dob && (
        <FormHelperText error>
          {errors.dob}
        </FormHelperText>
      )}

      <TextField
        label="Mobile Number"
        fullWidth
        margin="normal"
        value={mobile}
        onChange={(e) =>
          setMobile(e.target.value)
        }
      />
      {errors.mobile && (
        <FormHelperText error>
          {errors.mobile}
        </FormHelperText>
      )}

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={emailId}
        onChange={(e) =>
          setEmailId(e.target.value)
        }
      />
      {errors.emailId && (
        <FormHelperText error>
          {errors.emailId}
        </FormHelperText>
      )}

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />
      {errors.password && (
        <FormHelperText error>
          {errors.password}
        </FormHelperText>
      )}

      <br />
      <br />

      <Button
        variant="contained"
        color="primary"
        onClick={registerHandler}
      >
        REGISTER
      </Button>

    </div>
  );
};

export default Register;