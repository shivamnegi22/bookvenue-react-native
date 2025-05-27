export type Venue = {
  id: string;
  name: string;
  description: string;
  location: string;
  type: string;
  pricePerHour: number;
  openingTime: string;
  closingTime: string;
  rating: number;
  amenities: string[];
  images: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
};