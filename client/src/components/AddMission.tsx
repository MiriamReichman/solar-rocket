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

  const initialValues: Mission = {
    id: "7db171adf4135d6c09385fa9521ee83e",
    title: "Broadstar I",
    operator: "SpaceCOM",
    launch: {
      date:new Date(2022-12-26),
      vehicle: "Vulture 9",
      location: {
        name: "Cape Canaveral SLC-40",
        longitude: -80.57718,
        latitude: -28.562106
      }
    },
    orbit: {
      periapsis: 200,
      apoapsis: 300,
      inclination: 36
    },
    payload: {
      capacity: 22000,
      available: 7000
    }
  };
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values: Mission, { setSubmitting }: FormikHelpers<Mission>) => {
      debugger;
      console.log(JSON.stringify(values));
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
        <DialogContent>
        <form onSubmit={formik.handleSubmit} >
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
                  value={formik.values.launch.vehicle}
                  onChange={formik.handleChange}
                  error={formik.touched.launch?.vehicle && Boolean(formik.touched.launch?.vehicle)}
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
                  value={formik.values.launch.location.name}
                  onChange={formik.handleChange}
                  error={formik.touched.launch?.location?.name && Boolean(formik.errors.launch?.location?.name)}
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
                  value={formik.values.launch.location.longitude}
                  onChange={formik.handleChange}
                  error={formik.touched.launch?.location?.longitude && Boolean(formik.touched.launch?.location?.longitude)}
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
                  value={formik.values.launch.location.latitude}
                  onChange={formik.handleChange}
                  error={formik.touched.launch?.location?.latitude && Boolean(formik.touched.launch?.location?.latitude)}
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
                  value={formik.values.orbit.periapsis}
                  onChange={formik.handleChange}
                  error={formik.touched.orbit?.periapsis && Boolean(formik.errors.orbit?.periapsis)}
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
                  value={formik.values.orbit.apoapsis}
                  onChange={formik.handleChange}
                  error={formik.touched.orbit?.apoapsis && Boolean(formik.errors.orbit?.apoapsis)}
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
                  value={formik.values.orbit.inclination}
                  onChange={formik.handleChange}
                  error={formik.touched.orbit?.inclination && Boolean(formik.errors.orbit?.inclination)}
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
                  value={formik.values.payload.capacity}
                  onChange={formik.handleChange}
                  error={formik.touched.payload?.capacity && Boolean(formik.errors.payload?.capacity)}
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
                  value={formik.values.payload.available}
                  onChange={formik.handleChange}
                  error={formik.touched.payload?.available && Boolean(formik.errors.payload?.available)}
                />
              </Grid>

            </Grid>
            <Button  type="submit" >Save</Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleNewMissionClose}>Cancel</Button>
          
        </DialogActions> 
       
      </Dialog>
    </div>
  )
}




export { AddMission };