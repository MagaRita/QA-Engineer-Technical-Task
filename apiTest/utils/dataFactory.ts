import { faker } from '@faker-js/faker';
import { Pet } from './types';

export function generatePet(overrides: Partial<Pet> = {}): Pet {
  return {
	  name: faker.animal.type(),
      photoUrls: [],
      ...overrides,
  };
}