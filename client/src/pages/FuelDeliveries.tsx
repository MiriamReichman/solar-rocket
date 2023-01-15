import { Box, Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Container, Divider, Drawer, Grid, List, ListItem, ListItemText, TextField, Toolbar, Typography } from "@mui/material";
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

  useEffect(() => {
    fetchDeliveryDates(date.toISOString().split('T')[0], numOfDays)
      .then((fule: FuelDeliveriesDate | null) => setFuelDeliveriesDates(fule));
  }, [date, numOfDays])

  useEffect(() => {
    fetchFuledByDate(viewDelevarys.toISOString().split('T')[0])
      .then((fuleDeliveryDate: DeliveryDate) => {

        setFuelDeliveries(fuleDeliveryDate);
      })
  }, [viewDelevarys])


  const handleClick = (date: string) => {
    setViewDelevarys(new Date(date));
  }
  return (
    <AppLayout title="Fuel Deliveries">
      <Container maxWidth="lg">

        <Typography variant="h4" component="h1">
          Upcoming Fuel Deliveries!
        </Typography>
        <br></br>
        <Box
          sx={{ maxWidth: 360, bgcolor: 'background.paper', padding: 2, display: 'flex', alignItems: 'flex-end' }}
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
            sx={{ minWidth: 200 }}
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
              setNumberOfDays(value);
            }}
          />
        </Box>

        <br></br>
        <Typography >
          click on date to view details:
        </Typography>
        {fuelDeliveriesDate ?
        


            <Toolbar disableGutters>
              <Grid justifyContent="flex-end" container>
                  {
                    fuelDeliveriesDate.deliveryDates.map((date: string, index: number) => (
                      <Grid item xs>
                        <ListItemText key={index} onClick={() => handleClick(date)}>
                        <ListItemText primary={date} ></ListItemText>
                          </ListItemText>
                       </Grid>
                     
                  
                    ))}
               

              </Grid>


            </Toolbar>
          
          : ""}



        {fuelDeliveries ? (
          <Grid container spacing={2}>
            {" "}
            {fuelDeliveries.deliveries.map((fuelDeliveriesDetials: Delivery, key: number) => (
              <Grid item key={key}>
                <Card sx={{ width: 200, height: 300 }}>
                  <CardHeader
                    title={fuelDeliveries.date}
                  //subheader={new Date(missions.launch.date).toDateString()}
                  />
                  <CardContent>
                    <CardMedia
                      sx={{ height: 160, whidth: 120 }}
                      image={fuelDeliveriesDetials.icon}
                      title="green iguana"
                    />
                    {/* <Typography noWrap>{fuelDeliveriesDetials.icon}</Typography> */}
                    {/* <Typography noWrap>{fuelDeliveriesDetials.quantity}</Typography> */}
                    <Typography >type: {fuelDeliveriesDetials.type}</Typography>
                    <Typography >unit :{fuelDeliveriesDetials.unit}</Typography>
                  </CardContent>

                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}

















      </Container>
    </AppLayout >
  );
};

export { FuelDeliveries as FuelDeliveries };
