import {IsNotEmpty, IsString, IsInt} from "class-validator";
export class CrearComentarioDTO {
    @IsNotEmpty({message: "El contenido del comentario no puede estar vacío"})
    @IsString({message: "El contenido del comentario debe ser una cadena de texto"})
    contenido: string;

    @IsNotEmpty({message: "El ID de la tarea no puede estar vacío"})
    @IsInt({message: "El ID de la tarea debe ser un número entero"})
    id_tarea: number;
}