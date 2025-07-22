import { Pet, Order } from './types';
import { APIRequestContext, APIResponse } from '@playwright/test';

const BASE_URL = 'https://petstore.swagger.io/v2';

//If the task was to create a project with all APIs, I would create a class and use @step decorator, etc.
//But only for a few apis, I decided to use this approach.

export async function createPet(request: APIRequestContext, petData: Pet): Promise<APIResponse> {
	return await request.post(`${BASE_URL}/pet`, {
		data: petData,
	});
}

export async function getPetById(request: APIRequestContext, id: number | string): Promise<APIResponse> {
	return await request.get(`${BASE_URL}/pet/${id}`);
}

export async function deletePet(request: APIRequestContext, id: number | string): Promise<APIResponse> {
  return await request.delete(`${BASE_URL}/pet/${id}`);
}