import {IsEmail, IsString, MinLength} from "class-validator";

export class RegistroDTO {
    @IsString()
        nombre: string;
    @IsEmail({}, {message: 'El formato del email no es valido'})
        email: string
    
    @IsString()
    @MinLength(6, {message: 'La clave debe tener al menos 6 caracteres'})
        clave: string;
    
}