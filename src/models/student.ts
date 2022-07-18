export interface Student {
    id?: string; //optional
    name: string; 
    age: number;
    mark: number;
    gender: 'male' | 'female';
    city: string;

    createdAt?: number;
    updatedAt?: number;
}