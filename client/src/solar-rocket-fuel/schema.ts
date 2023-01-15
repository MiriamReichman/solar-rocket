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
    icon: string
  };
export type FuelDeliveryType ="sunlight"|"wind"|"kerosene"|"electricity";
export type Dates=[string];

export type Error= String