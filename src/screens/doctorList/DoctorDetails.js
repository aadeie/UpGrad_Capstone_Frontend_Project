import React, { useEffect, useState } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import Rating from "@material-ui/lab/Rating";

const DoctorDetails = ({ doctorId }) => {

  const [doctor, setDoctor] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetch(`/doctors/${doctorId}`)
      .then((response) =>
        response.json()
      )
      .then((data) => {

        setDoctor(data);
        setLoading(false);

      })
      .catch((error) => {

        console.error(error);
        setLoading(false);

      });

  }, [doctorId]);

  if (loading) {

    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "50px"
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (!doctor) {

    return (
      <Typography
        color="error"
      >
        Unable to load doctor details
      </Typography>
    );
  }

  return (

    <Card
      elevation={3}
      style={{
        marginTop: "20px"
      }}
    >

      <div
        style={{
          background: "purple",
          color: "white",
          padding: "15px"
        }}
      >

        <Typography
          variant="h6"
        >
          Doctor Details
        </Typography>

      </div>

      <CardContent
        style={{
          padding: "20px"
        }}
      >

        <Typography
          variant="h5"
          gutterBottom
        >
          {doctor.firstName}
          {" "}
          {doctor.lastName}
        </Typography>

        <Typography>
          <strong>
            Total Experience:
          </strong>
          {" "}
          {doctor.totalYearsOfExp}
          {" "}
          years
        </Typography>

        <Typography>
          <strong>
            Speciality:
          </strong>
          {" "}
          {doctor.speciality}
        </Typography>

        <Typography>
          <strong>
            Date of Birth:
          </strong>
          {" "}
          {doctor.dob || "N/A"}
        </Typography>

        <Typography>
          <strong>
            City:
          </strong>
          {" "}
          {doctor.city || "N/A"}
        </Typography>

        <Typography>
          <strong>
            Email:
          </strong>
          {" "}
          {doctor.emailId || "N/A"}
        </Typography>

        <Typography>
          <strong>
            Mobile:
          </strong>
          {" "}
          {doctor.mobile || "N/A"}
        </Typography>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px"
          }}
        >

          <Typography
            style={{
              marginRight: "10px"
            }}
          >
            <strong>
              Rating:
            </strong>
          </Typography>

          <Rating
            value={
              doctor.rating || 0
            }
            readOnly
          />

        </div>

      </CardContent>

    </Card>

  );
};

export default DoctorDetails;