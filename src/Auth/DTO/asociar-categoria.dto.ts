import { IsInt, IsNotEmpty } from "class-validator";

export class AsociarCategoriaDto {

    @IsNotEmpty({message: 'El ID de la tarea es obligatorio'})
    @IsInt({message: 'El ID de la tarea debe ser un número entero'})
    id_tarea: number;

    @IsNotEmpty({message: 'El ID de la categoría es obligatorio'})
    @IsInt({message: 'El ID de la categoría debe ser un número entero'})
    id_categ: number;
}