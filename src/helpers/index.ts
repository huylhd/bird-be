import { House } from 'src/modules/house/entities/house.entity';

export const formatHouse = (house: House): Partial<House> => {
  const { id, ubid, ...rest } = house;
  return rest;
};
