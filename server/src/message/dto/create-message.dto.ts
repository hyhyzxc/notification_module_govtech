/* eslint-disable prettier/prettier */
import {
    IsArray,
    IsNotEmpty,
    IsNumberString,
    IsString,
  } from 'class-validator';

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    userName: string

    @IsArray()
    message: []

    @IsString()
    @IsNotEmpty()
    statusName: string

    @IsString()
    @IsNumberString()
    @IsNotEmpty()
    userNumber: string   
}
