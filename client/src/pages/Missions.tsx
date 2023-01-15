import { SyntheticEvent, useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import fetchGraphQL from "../graphql/GraphQL";
import { Mission } from "../graphql/schema";
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Button,
  Grid,
  Typography,
  Fab,
  Toolbar,
  Container,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";

import {
  Add as AddIcon,
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
} from "@mui/icons-material";

import { ListMenu } from "../components/ListMenu";
import { AddMission } from "../components/AddMission";

type SortField = "Title" | "Date" | "Operator";

interface MissionsResponse {
  data: {
    Missions: Mission[];
  };
}
interface DeletedMissionsResponse {
  data:{
      deleteMission:Mission[];
  };
}

const getMissions = async (
  sortField: SortField,
  sortDesc?: Boolean
): Promise<MissionsResponse> => {
  return await fetchGraphQL(
    `
  {
    Missions(
      sort: {
        field: ${sortField}
        desc: ${sortDesc}
      }
    
    ) {
      id
      title
      operator
      launch {
        date
      }
    }
  }
  `,
    []
  );
};
const deleteMission = async(
  id: String|null,
): Promise<DeletedMissionsResponse> => {
  return await fetchGraphQL(
    `mutation ($id: ID!){
      deleteMission(id: $id){
        id
        title
        operator
        launch {
        date
        }
      }
    }
    `,
    { id: id }
  )
};


const Missions = (): JSX.Element => {
  const [missions, setMissions] = useState<Mission[] | null>(null);
  const [newMissionOpen, setNewMissionOpen] = useState(false);
  const [tempLaunchDate, setTempLaunchDate] = useState<Date | null>(null);
  const [sortDesc, setSortDesc] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>("Title");
  const [errMessage, setErrMessage] = useState<String | null>(null);
  const[toDelete, setToDelete] = useState<String|null>(null);

  const handleErrClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setErrMessage(null);
  };
  const handleNewMissionAdded = (newMission:Mission) => {
    if(missions)
      setMissions([...missions,newMission]);
    else setMissions([newMission]);
  };
  const handleNewMissionOpen = () => {
    setTempLaunchDate(null);
    setNewMissionOpen(true);
  };

  const handleNewMissionClose = () => {
    setNewMissionOpen(false);
  };

  const handleTempLaunchDateChange = (newValue: Date | null) => {
    setTempLaunchDate(newValue);
  };

  const handleSortFieldChange = (event: SyntheticEvent, value: SortField) => {
    setSortField(value);
  };
  const handleSortDescClick = () => {
    setSortDesc(!sortDesc);
  };
  
  
  useEffect(() => {
    debugger;
    if (toDelete) 
    deleteMission(toDelete)
      .then((result: DeletedMissionsResponse) => {
        alert("mission deleted")
        setMissions(result.data.deleteMission);
      })
      .catch((err) => {
        setErrMessage("Failed to load missions deleted.");
        console.log(err);
      
      });
  }, [toDelete]);

  useEffect(() => {
    getMissions(sortField, sortDesc)
      .then((result: MissionsResponse) => {
        setMissions(result.data.Missions);
      })
      .catch((err) => {
        setErrMessage("Failed to load missions.");
        console.log(err);
      });
  }, [sortField, sortDesc]);
  return (
    <AppLayout title="Missions">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1">
          Solar Rocket Missions
        </Typography>

        <Toolbar disableGutters>
          <Grid justifyContent="flex-end" container>
            <IconButton>
              <FilterAltIcon />
            </IconButton>
            <ListMenu
              options={["Date", "Title", "Operator"]}
              endIcon={<SortIcon />}
              onSelectionChange={handleSortFieldChange}
            />
            <IconButton onClick={handleSortDescClick}>
              {sortDesc ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            </IconButton>
          </Grid>
        </Toolbar>

        {missions ? (
          <Grid container spacing={2}>
            {" "}
            {missions.map((missions: Mission, key: number) => (
              <Grid item key={key}>
                <Card sx={{ width: 275, height: 200 }}>
                  <CardHeader
                    title={missions.title}
                    subheader={new Date(missions.launch.date).toDateString()}
                  />
                  <CardContent>
                    <Typography noWrap>{missions.operator}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick={()=>{
                      debugger;
                      if(missions.id)
                        setToDelete(missions.id)
                    }}>Delete</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}
      <Tooltip title="New Mission">
        <Fab
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          color="primary"
          aria-label="add"
          onClick={handleNewMissionOpen}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
       <AddMission 
       handleNewMissionOpen={handleNewMissionOpen}
       newMissionOpen={newMissionOpen}
       handleNewMissionClose={handleNewMissionClose}
       tempLaunchDate={tempLaunchDate}
       handleTempLaunchDateChange={handleTempLaunchDateChange}
       handleNewMissionAdded={handleNewMissionAdded}
       />
      </Container>
      <Snackbar
        open={errMessage != null}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={handleErrClose}
      >
        <Alert onClose={handleErrClose} variant="filled" severity="error">
          {errMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
};

export { Missions };


