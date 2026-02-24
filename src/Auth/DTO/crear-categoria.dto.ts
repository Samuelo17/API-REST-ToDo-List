import {IsNotEmpty, IsString, Matches, IsOptional} from 'class-validator';

export class CrearCategoriaDto {
    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @Matches(/^#[0-9A-Fa-f]{6}$/, {message: 'El color debe ser un código hexadecimal válido'})
    color: string;
}