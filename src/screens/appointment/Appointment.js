import React, { useEffect, useState } from "react";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import RateAppointment from "./RateAppointment";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [openRateModal, setOpenRateModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const isLoggedIn =
    sessionStorage.getItem("access-token") !== null;

  useEffect(() => {
    if (isLoggedIn) {
      const token =
        sessionStorage.getItem("access-token");

      const userId =
        sessionStorage.getItem("uuid");

      fetch(
        `/appointments/users/${userId}`,
        {
          method: "GET",
          headers: {
            authorization:
              "Bearer " + token
          }
        }
      )
        .then((response) =>
          response.json()
        )
        .then((data) => {
          setAppointments(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoggedIn]);

  const handleRateAppointment = (
    appointment
  ) => {
    setSelectedAppointment(
      appointment
    );
    setOpenRateModal(true);
  };

  const closeRateModal = () => {
    setOpenRateModal(false);
    setSelectedAppointment(null);
  };

  if (!isLoggedIn) {
    return (
      <Typography
        variant="h5"
        style={{
          textAlign: "center",
          marginTop: "30px"
        }}
      >
        Login to see appointments
      </Typography>
    );
  }

  if (appointments.length === 0) {
    return (
      <Typography
        variant="h6"
        style={{
          textAlign: "center",
          marginTop: "30px"
        }}
      >
        No appointments found
      </Typography>
    );
  }

  return (
    <div>
      {appointments.map(
        (appointment) => (
          <Paper
            key={
              appointment.appointmentId
            }
            style={{
              textAlign: "left",
              margin: "15px",
              padding: "20px",
              cursor: "pointer"
            }}
          >
            <Typography variant="h6">
              Dr.{" "}
              {
                appointment.doctorName
              }
            </Typography>

            <Typography>
              <b>
                Appointment Date:
              </b>{" "}
              {
                appointment.appointmentDate
              }
            </Typography>

            <Typography>
              <b>Symptoms:</b>{" "}
              {appointment.symptoms ||
                "N/A"}
            </Typography>

            <Typography>
              <b>
                Prior Medical History:
              </b>{" "}
              {appointment.priorMedicalHistory ||
                "N/A"}
            </Typography>

            <br />

            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                handleRateAppointment(
                  appointment
                )
              }
            >
              RATE APPOINTMENT
            </Button>
          </Paper>
        )
      )}

      {selectedAppointment && (
        <RateAppointment
          open={openRateModal}
          appointment={
            selectedAppointment
          }
          handleClose={
            closeRateModal
          }
        />
      )}
    </div>
  );
};

export default Appointment;