import { IsDate, IsEnum, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export enum StatusDefinition{
    TO_DO = 'TO_DO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE'
}

export class TaskDto {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsString()
    @MinLength(3)
    @MaxLength(256)
    title: string;

    @IsString()
    @MinLength(5)
    @MaxLength(512)
    description: string;

    @IsOptional()
    @IsEnum(StatusDefinition)
    status?: string;

    @IsDate()
    @IsOptional()
    expirationDate?: Date;
}

export interface FindAllParameters {
    title: string;
    status: string
}

export class TaskDtoParameters {
    @IsUUID()
    id: string;
}