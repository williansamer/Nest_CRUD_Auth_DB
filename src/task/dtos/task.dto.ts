export class TaskDto {
    readonly id?: string;
    readonly title: string;
    readonly description: string;
    readonly status: string;
    readonly expirationDate?: Date;
}

export interface FindAllParameters {
    title: string;
    status: string
}