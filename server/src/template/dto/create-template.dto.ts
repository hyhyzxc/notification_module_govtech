import { IsArray, IsNotEmpty, IsString } from 'class-validator';
/* eslint-disable prettier/prettier */
export class CreateTemplateDto {
    @IsArray()
    fields: [];

    @IsString()
    @IsNotEmpty()
    body: string

    @IsString()
    @IsNotEmpty()
    statusName: string
}
