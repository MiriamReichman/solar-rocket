import { Mission } from "../../graphql/schema"
interface MissionForm {
    id?:string;
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
export const convertToMission = (MissionForm: MissionForm, date: Date) :Mission => {
    return {
      title: MissionForm.title,
      operator: MissionForm.operator,
      launch:{
      date: date,
      vehicle: MissionForm.vehicle,
      location: {
        name: MissionForm.name,
        longitude: MissionForm.longitude,
        latitude: MissionForm.latitude
      }
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