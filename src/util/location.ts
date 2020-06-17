import HttpError from "../models/http-error";

interface ICoords {
  lat: number;
  lng: number;
}

export const getCoordsForAddress = async () => {
  const coordinates: ICoords = {
    lat: 44.952655,
    lng: 34.1050162,
  };

  if (!coordinates) {
    throw new HttpError(422, "Could not find location for specified address");
  }
  return coordinates;
};
