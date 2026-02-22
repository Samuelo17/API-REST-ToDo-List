import {IsEmail, IsString} from "class-validator";

export class LoginDTO {
    @IsEmail({}, {message: 'Debe ser un email valido'})
        email: string;
    @IsString()
        clave: string;
}