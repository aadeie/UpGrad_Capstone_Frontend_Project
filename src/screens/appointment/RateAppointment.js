import React, { useState } from "react";

import Modal from "react-modal";


import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button
} from "@material-ui/core";

import Rating from "@material-ui/lab/Rating";

Modal.setAppElement("#root");

const RateAppointment = ({
  open,
  handleClose,
  appointment
}) => {

  const [rating, setRating] =
    useState(null);

  const [comments, setComments] =
    useState("");

  const [ratingRequired,
    setRatingRequired] =
    useState(false);

  const submitRatingHandler =
    async () => {

      if (
        rating === null ||
        rating === ""
      ) {

        setRatingRequired(true);

        return;
      }

      setRatingRequired(false);

      try {

        const ratingData = {

          appointmentId:
            appointment.appointmentId,

          doctorId:
            appointment.doctorId,

          rating:
            Number(rating),

          comments:
            comments
        };

        const response =
          await fetch(
            "/ratings",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                authorization:
                  "Bearer " +
                  sessionStorage.getItem(
                    "access-token"
                  )
              },

              body:
                JSON.stringify(
                  ratingData
                )
            }
          );

        if (response.ok) {

          alert(
            "Rating submitted successfully"
          );

          setRating(null);
          setComments("");

          handleClose();

        } else {

          alert(
            "Unable to submit rating"
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

    <Modal
      isOpen={open}
      onRequestClose={handleClose}
      style={{
        content: {
          width: "500px",
          height: "500px",
          margin: "auto"
        }
      }}
    >

      <Card>

        <div
          style={{
            background:
              "purple",
            height: "70px",
            padding: "11px",
            color: "white"
          }}
        >

          <Typography
            variant="h6"
          >
            Rate an Appointment
          </Typography>

        </div>

        <CardContent>

          <TextField
            label="Comments"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={comments}
            onChange={(event) =>
              setComments(
                event.target.value
              )
            }
          />

          <div
            style={{
              marginTop: "20px",
              marginBottom: "20px"
            }}
          >

            <Typography
              variant="subtitle1"
            >
              Rating
            </Typography>

            <Rating
              name="doctor-rating"
              value={rating}
              onChange={(
                event,
                newValue
              ) => {
                setRating(
                  newValue
                );
              }}
            />

          </div>

          {ratingRequired && (

            <Typography
              style={{
                color: "red",
                marginTop: "10px"
              }}
            >
              Submit a rating
            </Typography>

          )}

          <div
            style={{
              marginTop: "25px"
            }}
          >

            <Button
              variant="contained"
              color="primary"
              onClick={
                submitRatingHandler
              }
            >
              RATE APPOINTMENT
            </Button>

            <Button
              variant="contained"
              color="secondary"
              style={{
                marginLeft: "10px"
              }}
              onClick={
                handleClose
              }
            >
              CLOSE
            </Button>

          </div>

        </CardContent>

      </Card>

    </Modal>

  );
};

export default RateAppointment;