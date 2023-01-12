import React, { useState } from 'react'
import {
  Button,
  Grid,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Formik, FormikHelpers, FormikProps, Form, Field, ErrorMessage, useFormik
} from 'formik';

import * as Yup from 'yup';
import { Mission } from '../graphql/schema';

interface MissionForm {
  title: String,
  operator: String,
  vehicle: String,
  name: String,
  longitude: Number,
  latitude: Number,
  periapsis: Number,
  apoapsis: Number,
  inclination: Number,
  capacity: Number,
  available: Number

}
const convertToMission = (MissionForm: MissionForm, date: Date | null) => {
  return {
    id: null,
    title: MissionForm.title,
    operator: MissionForm,
    date: date,
    vehicle: MissionForm.vehicle,
    location: {
      name: MissionForm.name,
      longitude: MissionForm.longitude,
      latitude: MissionForm.latitude
    },
    orbit: {
      periapsis: MissionForm.periapsis,
      apoapsis: MissionForm.apoapsis,
      inclination: MissionForm.inclination
    },
    payload: {
      capacity: MissionForm.capacity,
      available: MissionForm.available
    }
  }
}
const AddMission: React.FC<{
  handleNewMissionOpen: Function,
  newMissionOpen: boolean,
  handleNewMissionClose: () => void,
  tempLaunchDate: Date | null,
  handleTempLaunchDateChange: (newValue: Date | null) => void
  ,
}> = (props) => {
  const validationSchema = Yup.object({
    title:
      Yup.string()
        .required('title is required'),
    // length: Yup
    //   .number()
    //   .min(1, 'length should be of minimum 1')
    //   .required('length is required'),
  });

  const initialValues: MissionForm = {
    title: "Broadstar I",
    operator: "SpaceCOM",
    vehicle: "Vulture 9",
    name: "Cape Canaveral SLC-40",
    longitude: -80.57718,
    latitude: -28.562106,
    periapsis: 200,
    apoapsis: 300,
    inclination: 36,
    capacity: 22000,
    available: 7000
  }
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values: MissionForm, { setSubmitting }: FormikHelpers<MissionForm>) => {
      debugger;
      console.log(JSON.stringify(values));
      console.log(JSON.stringify(convertToMission(values, props.tempLaunchDate)));
      setSubmitting(false);
      props.handleNewMissionClose();
    }
  });
  return (
    <div>

      <Dialog
        open={props.newMissionOpen}
        onClose={props.handleNewMissionClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>New Mission</DialogTitle>
        <form onSubmit={formik.handleSubmit} >
          <DialogContent>


            {/* {Object.keys(initialValues).map(item => {
          return(
            <Grid item>
              <TextField
                autoFocus
                id={item}
                label={item}
                variant="standard"
                fullWidth
                value={formik.values.item}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
              />
            </Grid>
          );
        })} */}
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  autoFocus
                  id="title"
                  label="title"
                  variant="standard"
                  fullWidth
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="operator"
                  label="operator"
                  variant="standard"
                  fullWidth
                  value={formik.values.operator}
                  onChange={formik.handleChange}
                  error={formik.touched.operator && Boolean(formik.errors.operator)}
                />
              </Grid>

              <Grid item>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    minDate={new Date()}
                    minTime={new Date()}
                    label="Launch Date"

                    value={props.tempLaunchDate}
                    onChange={props.handleTempLaunchDateChange}
                    renderInput={(params) => (
                      <TextField variant="standard" {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="vehicle"
                  label="vehicle"
                  variant="standard"
                  fullWidth
                  value={formik.values.vehicle}
                  onChange={formik.handleChange}
                  error={formik.touched.vehicle && Boolean(formik.touched.vehicle)}
                />
              </Grid>
              <br></br>
              <Divider textAlign="left">location</Divider>
              <Grid item>
                <TextField
                  autoFocus
                  id="name"
                  label="name "
                  variant="standard"
                  fullWidth
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="longitude"
                  label="longitude"
                  variant="standard"
                  fullWidth
                  type="Number"
                  value={formik.values.longitude}
                  onChange={formik.handleChange}
                  error={formik.touched.longitude && Boolean(formik.touched.longitude)}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="latitude"
                  label="latitude"
                  variant="standard"
                  fullWidth
                  type="Number"
                  value={formik.values.latitude}
                  onChange={formik.handleChange}
                  error={formik.touched.latitude && Boolean(formik.touched.latitude)}
                />
              </Grid>
              <br></br>
              <Divider textAlign="left" >orbit</Divider>
              <Grid item>
                <TextField
                  autoFocus
                  id="periapsis"
                  label="periapsis"
                  variant="standard"
                  fullWidth
                  type="Number"
                  value={formik.values.periapsis}
                  onChange={formik.handleChange}
                  error={formik.touched.periapsis && Boolean(formik.errors.periapsis)}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="apoapsis"
                  label="apoapsis"
                  variant="standard"
                  fullWidth
                  type="Number"
                  value={formik.values.apoapsis}
                  onChange={formik.handleChange}
                  error={formik.touched.apoapsis && Boolean(formik.errors.apoapsis)}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="inclination"
                  label="inclination"
                  variant="standard"
                  fullWidth
                  type="Number"
                  value={formik.values.inclination}
                  onChange={formik.handleChange}
                  error={formik.touched.inclination && Boolean(formik.errors.inclination)}
                />
              </Grid>
              <br></br>
              <Divider textAlign="left">payload</Divider>
              <Grid item>
                <TextField
                  autoFocus
                  id="capacity"
                  label="capacity"
                  variant="standard"
                  fullWidth
                  type="Number"
                  value={formik.values.capacity}
                  onChange={formik.handleChange}
                  error={formik.touched.capacity && Boolean(formik.errors.capacity)}
                />
              </Grid>
              <Grid item>
                <TextField
                  autoFocus
                  id="available"
                  label="available"
                  variant="standard"
                  fullWidth
                  type="Number"
                  value={formik.values.available}
                  onChange={formik.handleChange}
                  error={formik.touched.available && Boolean(formik.errors.available)}
                />
              </Grid>

            </Grid>


          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleNewMissionClose}>Cancel</Button>
            <Button type="submit" >Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}




export { AddMission };