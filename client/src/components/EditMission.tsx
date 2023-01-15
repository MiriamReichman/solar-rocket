import React, { useEffect, useState } from 'react'
import { Button, Grid, Dialog, DialogTitle, TextField, DialogContent, DialogActions, Divider, } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
    Formik, FormikHelpers, FormikProps, Form, Field, ErrorMessage, useFormik
} from 'formik';

import * as Yup from 'yup';
import { Mission } from '../graphql/schema';
import fetchGraphQL from '../graphql/GraphQL';
import { convertToMission } from './helpers/convertToMission';

interface MissionsResponse {
    data: {
        editMission: Mission[];
    };
}
interface GetMissionsResponse {
    data: {
        Mission: Mission;
    };
}
const getMissionById = async (
    id: String
): Promise<GetMissionsResponse> => {
    return await fetchGraphQL(
        `query ($id: ID!){
              Mission(id: $id)
              {
                  id
                  title
                  operator
                  launch {
                  date
                  vehicle
                  location {
                    name
                    longitude
                    latitude
                  }
                  }
                  orbit {
                          periapsis
                           apoapsis
                          inclination
                        }
                         payload {
                           capacity
                          available
                        }
  
              }
          }
          `,
        { id: id }
    );
};

const editMission = async (
    id: string,
    mission: Mission
): Promise<MissionsResponse> => {
    return await fetchGraphQL(
        `mutation ($id:ID!,$mission: MissionInput){
      editMission(id:$id,mission: $mission){
        id
        title
        operator
        launch {
        date
        }
      }
    }
    `,
        { id: id, mission: mission }
    );
};
interface MissionForm {
    id: string;
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

const EditMission: React.FC<{
    
    editMissionOpen: boolean,
    handelEditMissionClose:()=>void,
    tempLaunchDate: Date | null,
    handleTempLaunchDateChange: (newValue: Date | null) => void
    , handleMissionEdited: (newValue: Mission[]) => void
    idToEdit: String | null
}> = (props) => {
  
    const [toEdit, setToEdit] = useState<MissionForm>({
        
            id: '',
            title :'',
            operator: '',
            vehicle:  '',
            name:'',
            longitude : 0,
            latitude: 0,
            periapsis: 0,
            apoapsis: 0,
            inclination:  0,
            capacity:  0,
            available:  0
        
    });

    useEffect(() => {
        if (props.idToEdit)
            getMissionById(props.idToEdit)
            .then((result: GetMissionsResponse) => {
                setToEdit(
                 {
                    id: result.data.Mission.id! ,
                    title: result.data.Mission.title,
                    operator: result.data.Mission.operator ,
                    vehicle: result.data.Mission.launch.vehicle ,
                    name: result.data.Mission.launch.location.name ,
                    longitude:result.data.Mission.launch.location.longitude ,
                    latitude: result.data.Mission.launch.location.latitude ,
                    periapsis:result.data.Mission.orbit.periapsis ,
                    apoapsis: result.data.Mission.orbit.apoapsis ,
                    inclination: result.data.Mission.orbit.inclination ,
                    capacity: result.data.Mission.payload.capacity ,
                    available: result.data.Mission.payload.available
                 }
                );
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    const validationSchema = Yup.object({
        title:
            Yup.string()
                .required('title is required'),
    });

    const initialValues = toEdit;

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values: typeof initialValues, { setSubmitting }: FormikHelpers<MissionForm>) => {
            await editMission(values.id, convertToMission(values, props.tempLaunchDate ? props.tempLaunchDate : new Date()))
            .then((result) => {
                props.handleMissionEdited(result.data.editMission);
                
            });
            setSubmitting(false);
           props.handelEditMissionClose();
        }
    });
    return (
        <div>

            <Dialog
                open={props.editMissionOpen}
                onClose={()=>props.handelEditMissionClose()}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Edit Mission</DialogTitle>
                <form onSubmit={formik.handleSubmit} >
                    <DialogContent>



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
                        <Button onClick={()=>props.handelEditMissionClose()}>Cancel</Button>
                        <Button type="submit" >Save</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>
    )
}




export { EditMission };