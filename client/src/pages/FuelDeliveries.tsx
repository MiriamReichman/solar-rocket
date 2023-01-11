import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import fetchFuledByDate from "../solar-rocket-fuel/getFuelDeliveryByDate";
import fetchDeliveryDates from "../solar-rocket-fuel/getFuleDeliverieDates";
import { Dates, DeliveryDate,Error } from "../solar-rocket-fuel/schema";

const FuelDeliveries = (): JSX.Element => {
  const [fuelDeliveriesDate,setFuelDeliveriesDates] =useState<Dates[] | null>(null);
  const [fuelDeliveries,setFuelDeliveries] = useState<DeliveryDate|Error|null>(null);
  useEffect(() => {
    fetchDeliveryDates('2023-02-12',4)
    .then((fule:Dates[] | null)=>setFuelDeliveriesDates(fule));
  }, [])
  useEffect(() => {
    fetchFuledByDate('2023-02-12')
    .then((fuleDeliveryDate:DeliveryDate|Error)=>setFuelDeliveries(fuleDeliveryDate));
  }, [fuelDeliveriesDate])
  return (
    <AppLayout title="Fuel Deliveries">
      <Container maxWidth="lg">
        <div>Fuel Deliveries!</div>
       
         
                
     
      </Container>
    </AppLayout>
  );
};

export { FuelDeliveries as FuelDeliveries };
