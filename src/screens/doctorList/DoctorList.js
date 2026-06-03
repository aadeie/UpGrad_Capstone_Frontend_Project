import React, { useEffect, useState } from "react";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import TextField from "@material-ui/core/TextField";

import Rating from "@material-ui/lab/Rating";

import Modal from "react-modal";

Modal.setAppElement("#root");

const DoctorList = () => {

  const [doctors, setDoctors] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] =
    useState("");

  const [selectedDoctor, setSelectedDoctor] =
    useState(null);

  const [appointmentModalOpen,
    setAppointmentModalOpen] =
    useState(false);

  const [appointmentDate,
    setAppointmentDate] =
    useState("");

  const [availableSlots,
    setAvailableSlots] =
    useState([]);

  const [selectedTimeSlot,
    setSelectedTimeSlot] =
    useState("");

  const [symptoms,
    setSymptoms] =
    useState("");

  const [medicalHistory,
    setMedicalHistory] =
    useState("");



  const [doctorDetailsOpen,
    setDoctorDetailsOpen] =
    useState(false);

  const [doctorDetails,
    setDoctorDetails] =
    useState(null);

  const [rating,
    setRating] =
    useState("");

  const [comments,
    setComments] =
    useState("");

  useEffect(() => {

    fetch("/doctors/speciality")
      .then((response) => response.json())
      .then((data) => {
        setSpecialities(data);
      })
      .catch((error) => {
        console.error(error);
      });

  }, []);

  useEffect(() => {

    let url = "/doctors";

    if (selectedSpeciality !== "") {

      url =
        "/doctors?speciality=" +
        selectedSpeciality;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
      })
      .catch((error) => {
        console.error(error);
      });

  }, [selectedSpeciality]);

  const bookAppointmentHandler =
    (doctor) => {

      const token =
        sessionStorage.getItem(
          "access-token"
        );

      if (!token) {

        alert(
          "Please login first"
        );

        return;
      }

      setSelectedDoctor(doctor);

      setAppointmentDate("");
      setAvailableSlots([]);
      setSelectedTimeSlot("");

      setSymptoms("");
      setMedicalHistory("");

      setAppointmentModalOpen(true);
    };



  const submitRatingHandler =
    async () => {

      if (rating === "") {

        alert(
          "Please select rating"
        );

        return;
      }

      try {

        const ratingData = {

          appointmentId:
            "MANUAL-RATING",

          doctorId:
            doctorDetails.id,

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

          setRating("");
          setComments("");

          const doctorResponse =
            await fetch(
              `/doctors/${doctorDetails.id}`
            );

          const updatedDoctor =
            await doctorResponse.json();

          setDoctorDetails(
            updatedDoctor
          );

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

  const viewDoctorDetailsHandler =
    async (doctorId) => {

      try {

        const response =
          await fetch(
            `/doctors/${doctorId}`
          );

        const data =
          await response.json();


        setDoctorDetails(data);

        setDoctorDetailsOpen(
          true
        );

      } catch (error) {

        console.error(error);

        alert(
          "Unable to load doctor details"
        );

      }
    };

  const appointmentDateChangeHandler =
    (date) => {

      setAppointmentDate(date);

      setSelectedTimeSlot("");

      if (
        !selectedDoctor ||
        date === ""
      ) {
        return;
      }

      fetch(
        `/doctors/${selectedDoctor.id}/timeSlots?date=${date}`
      )
        .then((response) =>
          response.json()
        )

        .then((data) => {

          console.log(
            "TimeSlot API Response:",
            data
          );

          setAvailableSlots(
            data.timeSlot || []
          );

          console.log(
            "Available Slots:",
            data.timeSlot
          );

        })
        .catch((error) => {
          console.error(error);
        });
    };

  const submitAppointmentHandler =
    async () => {

      if (
        appointmentDate === "" ||
        selectedTimeSlot === ""
      ) {

        alert(
          "Please select appointment date and time slot"
        );

        return;
      }

      try {

        const appointmentData = {

          doctorId:
            selectedDoctor.id,

          doctorName:
            selectedDoctor.firstName +
            " " +
            selectedDoctor.lastName,

          userId:
            sessionStorage.getItem(
              "uuid"
            ),

          userName:
            sessionStorage.getItem(
              "first-name"
            ) +
            " " +
            sessionStorage.getItem(
              "last-name"
            ),

          userEmailId:
            sessionStorage.getItem(
              "email"
            ),

          timeSlot:
            selectedTimeSlot,

          appointmentDate:
            appointmentDate,

          symptoms:
            symptoms,

          priorMedicalHistory:
            medicalHistory,

          status:
            "BOOKED"
        };

        console.log(
          "Access Token:",
          sessionStorage.getItem(
            "access-token"
          )
        );

        console.log(
          "Appointment Data:",
          appointmentData
        );

        const response =
          await fetch(
            "/appointments",
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
                  appointmentData
                )
            }
          );

        if (response.ok) {

          const appointmentId =
            await response.text();

          alert(
            "Appointment Booked Successfully. Appointment Id: " +
            appointmentId
          );

          setAppointmentModalOpen(
            false
          );

          setAppointmentDate("");
          setSelectedTimeSlot("");
          setSymptoms("");
          setMedicalHistory("");

        } else {

          const error =
            await response.text();

          alert(
            error
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

    <div
      style={{
        padding: "30px"
      }}
    >

      <Typography
        variant="h4"
        gutterBottom
      >
        Doctors
      </Typography>

      <div
        style={{
          textAlign: "center",
          marginBottom: "30px"
        }}
      >
        <Typography
          variant="h6"
          style={{
            marginBottom: "10px"
          }}
        >
          Select Speciality:
        </Typography>

        <FormControl
          variant="outlined"
          style={{
            width: "200px"
          }}
        >

          <InputLabel id="speciality-label">
            Speciality
          </InputLabel>

          <Select
            labelId="speciality-label"
            value={selectedSpeciality}
            onChange={(event) =>
              setSelectedSpeciality(
                event.target.value
              )
            }
            label="Speciality"
          >

            <MenuItem value="">
              <em>All</em>
            </MenuItem>

            {specialities.map(
              (speciality) => (

                <MenuItem
                  key={speciality}
                  value={speciality}
                >
                  {speciality}
                </MenuItem>

              )
            )}

          </Select>

        </FormControl>

      </div>

      {doctors.map((doctor) => (

        <Card
          key={doctor.id}
          elevation={3}
          style={{
            width: "650px",
            margin: "20px auto"
          }}
        >

          <CardContent>

            <Typography
              variant="h5"
              gutterBottom
            >
              Doctor Name : {doctor.firstName}
              {" "}
              {doctor.lastName}
            </Typography>

            <Typography>
              <strong>Speciality:</strong>
              {" "}
              {doctor.speciality}
            </Typography>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
                marginBottom: "10px"
              }}
            >
              <Typography
                style={{
                  fontWeight: "bold",
                  marginRight: "5px"
                }}
              >
                Rating:
              </Typography>

              <Rating
                value={doctor.rating || 0}
                precision={0.5}
                readOnly
                size="small"
              />
            </div>



            <div
              style={{
                marginTop: "20px"
              }}
            >

              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  bookAppointmentHandler(
                    doctor
                  )
                }
              >
                BOOK APPOINTMENT
              </Button>

              <Button
                variant="contained"
                style={{
                  backgroundColor: "green",
                  color: "white",
                  marginLeft: "10px",
                  minWidth: "170px"
                }}
                onClick={() =>
                  viewDoctorDetailsHandler(
                    doctor.id
                  )
                }
              >
                VIEW DETAILS
              </Button>

            </div>

          </CardContent>

        </Card>

      ))}

      <Modal
        isOpen={appointmentModalOpen}
        onRequestClose={() =>
          setAppointmentModalOpen(false)
        }
        style={{
          overlay: {
            backgroundColor:
              "rgba(0,0,0,0.5)",
            zIndex: 2000
          },
          content: {
            width: "550px",
            maxHeight: "85vh",
            margin: "auto",
            overflow: "auto"
          }
        }}
      >

        <h2>
          Book Appointment
        </h2>

        {selectedDoctor && (

          <div>

            <Typography>
              <strong>
                Doctor:
              </strong>
              {" "}
              {selectedDoctor.firstName}
              {" "}
              {selectedDoctor.lastName}
            </Typography>

            <TextField
              label="Appointment Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
              value={appointmentDate}
              onChange={(event) =>
                appointmentDateChangeHandler(
                  event.target.value
                )
              }
            />

            <FormControl
              fullWidth
              margin="normal"
            >
              <select
                style={{
                  width: "100%",
                  height: "40px"
                }}
                value={selectedTimeSlot}
                onChange={(e) =>
                  setSelectedTimeSlot(e.target.value)
                }
              >
                
                <option value="">
                  Select Time Slot
                </option>

                {availableSlots.map((slot) => (
                  <option
                    key={slot}
                    value={slot}
                  >
                    {slot}
                  </option>
                ))}
              </select>
            </FormControl>

            <TextField
              label="Symptoms"
              fullWidth
              margin="normal"
              value={symptoms}
              onChange={(event) =>
                setSymptoms(
                  event.target.value
                )
              }
            />

            <TextField
              label="Prior Medical History"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={medicalHistory}
              onChange={(event) =>
                setMedicalHistory(
                  event.target.value
                )
              }
            />

            <div
              style={{
                marginTop: "20px"
              }}
            >

              <Button
                variant="contained"
                color="primary"
                onClick={
                  submitAppointmentHandler
                }
              >
                BOOK APPOINTMENT
              </Button>

              <Button
                variant="contained"
                color="secondary"
                style={{
                  marginLeft: "10px"
                }}
                onClick={() =>
                  setAppointmentModalOpen(
                    false
                  )
                }
              >
                CLOSE
              </Button>

            </div>

          </div>

        )}

      </Modal>

      <Modal
        isOpen={doctorDetailsOpen}
        onRequestClose={() =>
          setDoctorDetailsOpen(false)
        }
        style={{
          content: {
            width: "300px",
            height: "380px",
            margin: "auto",
            padding: "0",
            inset: "50% auto auto 50%",
            transform: "translate(-50%, -50%)",
            overflow: "hidden"
          }
        }}
      >

        {doctorDetails && (

          <div>

            <div
              style={{
                backgroundColor: "#800080",
                color: "white",
                padding: "15px"
              }}
            >
              <Typography variant="h5">
                Doctor Details
              </Typography>
            </div>

            <div
              style={{
                padding: "20px"
              }}
            >

              <Typography
                variant="h5"
                gutterBottom
              >
                Dr: {doctorDetails.firstName}{" "}
                {doctorDetails.lastName}
              </Typography>

              <Typography>
                Total Experience:{" "}
                {doctorDetails.totalYearsOfExp} years
              </Typography>

              <Typography>
                Speciality :{" "}
                {doctorDetails.speciality}
              </Typography>

              <Typography>
                Date of Birth :{" "}
                {doctorDetails.dob}
              </Typography>



              <Typography>
                Email:{" "}
                {doctorDetails.emailId}
              </Typography>

              <Typography>
                Mobile:{" "}
                {doctorDetails.mobile}
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
                    marginRight: "5px"
                  }}
                >
                  Rating :
                </Typography>

                <Rating
                  value={
                    doctorDetails.rating || 0
                  }
                  precision={0.5}
                  readOnly
                  size="small"
                />
              </div>

              <Button
                variant="contained"
                color="secondary"
                style={{
                  marginTop: "20px"
                }}
                onClick={() =>
                  setDoctorDetailsOpen(false)
                }
              >
                CLOSE
              </Button>

            </div>

          </div>

        )}
      </Modal>

    </div>
  );
};

export default DoctorList;