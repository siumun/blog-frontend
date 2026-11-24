export interface User {
    id: number;
    name: string;
    email: string;
    gender: Gender
    avatar: string
}

export enum Gender {
MALE = "male",
FEMALE = "female"
}