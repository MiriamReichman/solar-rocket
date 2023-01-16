import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Container, Divider, Drawer, Grid, List, ListItem, ListItemText, TextField, Toolbar, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { DatePicker, DateTimePicker, LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import { ListMenu } from "../components/ListMenu";
import { AppLayout } from "../layouts/AppLayout";
import fetchFuledByDate from "../solar-rocket-fuel/getFuelDeliveryByDate";
import fetchDeliveryDates from "../solar-rocket-fuel/getFuleDeliverieDates";
import { Dates, Delivery, DeliveryDate, Error } from "../solar-rocket-fuel/schema";

interface FuelDeliveriesDate {
  deliveryDates: Dates
}


const FuelDeliveries = (): JSX.Element => {

  const [date, setDate] = useState<Date>(new Date('2023-02-12'));
  const [numOfDays, setNumberOfDays] = useState<Number>(5)
  const [fuelDeliveriesDate, setFuelDeliveriesDates] = useState<FuelDeliveriesDate | null>(null);
  const [fuelDeliveries, setFuelDeliveries] = useState<DeliveryDate | null>(null);
  const [viewDelevarys, setViewDelevarys] = useState<Date>(new Date('2023-02-12'));
  const [All, setAll] = useState<boolean>(false);
  const [viewAllDelevarys, setViewAllDelevarys] = useState<DeliveryDate[]>();


  useEffect(() => {
    fetchDeliveryDates(date.toISOString().split('T')[0], numOfDays)
      .then((fule: FuelDeliveriesDate | null) => setFuelDeliveriesDates(fule));
  }, [date, numOfDays])

  useEffect(() => {
    fuelDeliveriesDate?.deliveryDates.forEach((date: String) => {
      fetchFuledByDate(date)
        .then((fuleDeliveryDate: DeliveryDate) => {
          if (viewAllDelevarys) 
            setViewAllDelevarys([...viewAllDelevarys, fuleDeliveryDate]);
          else
            setViewAllDelevarys([fuleDeliveryDate]);
        })
    })
  }, [fuelDeliveriesDate])

  useEffect(() => {
    fetchFuledByDate(viewDelevarys.toISOString().split('T')[0])
      .then((fuleDeliveryDate: DeliveryDate) => {
        setFuelDeliveries(fuleDeliveryDate);
      })
  }, [viewDelevarys])

  const handleClick = (date: string) => {
    setViewDelevarys(new Date(date));
    setAll(false);
  }

  const handleClickAll = () => {
    setAll(true);
  }

  return (
    <AppLayout title="Fuel Deliveries">
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1">
          Upcoming Fuel Deliveries!
        </Typography>
        <br></br>
        <Box
          sx={{ maxWidth: 500, bgcolor: 'background.paper', padding: 2, display: 'flex', alignItems: 'flex-end' }}
        >
          <LocalizationProvider dateAdapter={AdapterDateFns}
          >
            <DatePicker
              minDate={new Date(+1)}
              label="pick delevary Date:"
              views={['year', 'day', 'month']}
              value={date.toISOString().split('T')[0]}
              onChange={(e) => setDate(e ? e : new Date())}
              renderInput={(params) => (
                <TextField  {...params} />
              )}
            />
          </LocalizationProvider>
          <TextField
            sx={{ minWidth: 200, paddingLeft: 1 }}
            autoFocus
            id="numOfDays"
            label="nummber Of Days to display"
            type="Number"
            inputProps={{ min: 0, max: 5 }}
            value={numOfDays}
            onChange={(e) => {
              var value = parseInt(e.target.value, 10);
              if (value > 5) value = 5;
              if (value < 0) value = 0;
              setNumberOfDays(value);}
            }
          />
        </Box>
        <br></br>
        <Typography >
          click on date to view details:
        </Typography>

        {fuelDeliveriesDate ?
          <Toolbar disableGutters>
            <Grid justifyContent="flex-end" container>
              <Grid item xs>
                <ListItem key={"index"}
                  onClick={() => handleClickAll()}
                >
                  <ListItemText primary={"All"} sx={{ color: blue }}></ListItemText>
                </ListItem>
              </Grid>
              {
                fuelDeliveriesDate.deliveryDates.map((date: string, index: number) => (
                  <Grid item xs>
                    <ListItem key={index + date} onClick={() => handleClick(date)}>
                      <ListItemText primary={date} sx={{ color: blue }}></ListItemText>
                    </ListItem>
                  </Grid>
                ))
              }
            </Grid>
          </Toolbar>
          : ""}

        {fuelDeliveries && !All ? (
          <Grid container spacing={2}>
            {" "}
            {fuelDeliveries.deliveries.map((fuelDeliveriesDetials: Delivery, key: number) => (
              <Grid item key={key}>
                <Card sx={{ width: 200, height: 300 }}>
                  <CardHeader
                    title={fuelDeliveries.date}
                  />
                  <CardContent>
                    <CardMedia
                      sx={{ height: 160, whidth: 120 }}
                      image={fuelDeliveriesDetials.icon}
                      title="green iguana"
                    />
                    <Typography >type: {fuelDeliveriesDetials.type}</Typography>
                    <Typography >unit :{fuelDeliveriesDetials.unit}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (

          <Box sx={{ textAlign: "center" }}>
            {All ? "" : <CircularProgress />}
          </Box>
        )}

        {viewAllDelevarys && All ? (
          <Grid container spacing={2}>
            {viewAllDelevarys.map((fuelDeliveriesDetials: DeliveryDate, index: number) => {
              let dateTitle = fuelDeliveriesDetials.date;
              return (
                <>
                  {fuelDeliveriesDetials.deliveries.map((deliverie: Delivery, index: number) => (
                    <Grid item key={index}>
                      <Card sx={{ width: 200, height: 300 }}>
                        <CardHeader
                          title={dateTitle}
                        />
                        <CardContent>
                          <CardMedia
                            sx={{ height: 160, whidth: 120 }}
                            image={deliverie.icon}
                            title="green iguana"
                          />
                          <Typography >type: {deliverie.type}</Typography>
                          <Typography >unit :{deliverie.unit}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </>
              )
            })}
          </Grid>
        ) : (

          <Box sx={{ textAlign: "center" }}>
            {All ? <CircularProgress /> : ""}
          </Box>
        )}

      </Container>
    </AppLayout >
  );
};

export { FuelDeliveries as FuelDeliveries };
