import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/DataBase/database.service";
import { CrearComentarioDTO } from "src/Auth/DTO/crear-comentario.dto";

@Injectable()
export class ComentarioService {
    constructor(private readonly db: DatabaseService) {}

    async crearComentario(dto: CrearComentarioDTO, id_usuario: number) {
        //validar que la tarea exista
        const tareaExisteSQL = `SELECT id_tarea FROM TAREA WHERE id_tarea = $1 AND activo = true`;
        const tareaExiste = await this.db.query(tareaExisteSQL, [dto.id_tarea]);
        if (tareaExiste.rowCount === 0) {
            throw new NotFoundException("No se puede comentar la tarea no existe");
        }
        const sql = `INSERT INTO COMENTARIO (contenido, id_usuario, id_tarea) VALUES ($1, $2, $3) RETURNING *`;
        const values = [
            dto.contenido,
            id_usuario,
            dto.id_tarea
        ];
        try{
            const {rows} = await this.db.query(sql, values);
            return rows[0];
        }catch(error){
            throw new BadRequestException("Error al crear el comentario: " + error.message);
        }
    }

    //listar comentarios por tarea
    async listarComentariosPorTarea(id_tarea: number) {
        const sql = `SELECT c.id_coment, c.contenido, c.fch_creacion, u.nombre AS autor FROM COMENTARIO c JOIN USUARIO u ON c.id_usuario = u.id_usuario WHERE c.id_tarea = $1 AND c.activo = true ORDER BY c.fch_creacion ASC`;
        const {rows} = await this.db.query(sql, [id_tarea]);
        return rows;
    }

    //Eliminar comentario (borrado lógico)
    async eliminarComentario(id_coment: number, id_usuario: number) {
        //validar que el comentario exista y que el usuario sea el autor
        const comentarioExisteSQL = `SELECT id_coment FROM COMENTARIO WHERE id_coment = $1 AND id_usuario = $2 AND activo = true`;
        const comentarioExiste = await this.db.query(comentarioExisteSQL, [id_coment, id_usuario]);
        if (comentarioExiste.rowCount === 0) {
            throw new NotFoundException("No se puede eliminar el comentario porque no existe o no es del usuario");
        }
        const sql = `UPDATE COMENTARIO SET activo = false WHERE id_coment = $1`;
        await this.db.query(sql, [id_coment]);
    }
}