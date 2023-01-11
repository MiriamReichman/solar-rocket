
const fetchDeliveryDates = async (startDate: String,numberOfDays:Number) => {
    
    const response : Response =await fetch(`https://solar-rocket-fuel.benmanage.click/deliveries?startDate=${startDate}&numberOfDays=${numberOfDays}`,
            {
                method: 'GET',

                headers: {
                    'Accept': 'application/json',
                    'UserID': 'mreichman309@gmail.com',
                    'ApiKey': '1f4faefeb984cbf86e5eaf65c561bd835e3f22e6691f7795f281ba66dd048023',
                    // 'crossorigin': 'true',    
                    // 'mode': 'no-cors',  
                    // 'Access-Control-Allow-Origin':'http://localhost:3000'
                }
            })
            if(response.ok)
            return await response.json();
        
          throw(await response.json());
};
export default fetchDeliveryDates;