export type DeliveryDate={
    date: String,
    deliveries: [
        Delivery
    ]
  };
  export type Delivery={
   type: FuelDeliveryType,
    quantity: Number,
    unit: String,
    icon: String
  };
export type FuelDeliveryType ="sunlight"|"wind"|"kerosene"|"electricity";
export type Dates=[String];

export type Error= String