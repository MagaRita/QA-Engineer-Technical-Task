export interface Pet {
	id?: number;
    name: string;
    photoUrls: string[];
    status?: 'available' | 'pending' | 'sold';
    category?: {
		id: number;
        name: string;
    };
    tags?: { id: number; name: string }[];
}