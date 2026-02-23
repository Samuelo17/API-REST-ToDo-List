
import {IsOptional, IsInt, Min, Max, IsString, IsDateString, IsNotEmpty } from "class-validator";

export class CrearTareaDto {
    @IsNotEmpty({message: 'El título de la tarea es obligatorio' })
    @IsString()
    Titulo: string;

    @IsOptional()
    @IsString()
    Descripcion?: string;

    @IsOptional()
    @IsDateString({}, {message: 'La fecha de vencimiento debe ser una fecha válida' })
    fch_entrega?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    Prioridad?: number;

    @IsOptional()
    @IsInt()
    @Min(0, {message: 'Laa Story Points no pueden ser negativas' })
    StoryPoints?: number;

    @IsNotEmpty({ message: 'Debe de indicar a quien se le asigna la tarea' })
    @IsInt()
    id_usuario_asignado: number;


    
}