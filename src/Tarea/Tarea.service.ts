import {Injectable, BadRequestException, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { DatabaseService } from 'src/DataBase/database.service';
import { CrearTareaDto } from 'src/Auth/DTO/crear-tarea.dto';

@Injectable()
export class TareaService {

    constructor(private readonly db: DatabaseService) {}

    async crearTarea(dto: CrearTareaDto, id_usuario_creador: number) {
        // Validar que el usuario asignado exista y esté activo
        const UsuarioAsigSQL = `SELECT id_usuario FROM USUARIO WHERE id_usuario = $1 AND activo = true`;
        const UsuarioAsignado = await this.db.query(UsuarioAsigSQL, [dto.id_usuario_asignado]);
        if (UsuarioAsignado.rowCount === 0) {
            throw new BadRequestException(`El usuario asignado con ID ${dto.id_usuario_asignado} no existe`);
        }
        // Insertar la tarea en la base de datos
        const sql = `INSERT INTO TAREA (titulo, descrip, fch_entrega, prioridad, story_points, id_asignado, id_creador, estado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

        const values = [
            dto.Titulo,                 //$1
            dto.Descripcion || null,    //$2
            dto.fch_entrega || null,    //$3
            dto.Prioridad ?? 1,         //$4
            dto.StoryPoints ?? 0,       //$5
            dto.id_usuario_asignado,    //$6
            id_usuario_creador,         //$7
            "pendiente"                 //$8
        ]

        try{
            const {rows} = await this.db.query(sql, values);
            return rows[0];
        }catch (error){
            console.error("---ERROR EN POSTGRESL---");
            console.error("Mensaje de error:", error.message);
            console.error("Valores enviados:", values);
            throw new InternalServerErrorException(`Error DB: ${error.message}`);
        }
    }

    async listarTareas(id_usuario?: number, estado?: string) {
        let sql = `SELECT * FROM TAREA WHERE activo = true`;
        const params: (number | string)[] = [];

        if (id_usuario) {
            params.push(id_usuario);
            const idx = params.length;
            sql += ` AND (id_asignado = $${idx} OR id_creador = $${idx})`;
        }

        if (estado) {
            params.push(estado);
            sql += ` AND estado = $${params.length}`;
        }
        const {rows} = await this.db.query(sql, params);
        return rows;
    }

    async obtenerDetallesTarea(id_tarea: number) {
        const sql = `SELECT * FROM TAREA WHERE id_tarea = $1 AND activo = true`;
        const {rows} = await this.db.query(sql, [id_tarea]);
        if (rows.length === 0) {
            throw new NotFoundException(`Tarea con ID ${id_tarea} no encontrada`);
        }
        return rows[0];
    }

    async actualizarTarea(id_tarea: number, datos: Partial<CrearTareaDto & { estado?: string }>) {
        const sql = `UPDATE TAREA SET titulo = COALESCE($1, titulo), descrip = COALESCE($2, descrip), fch_entrega = COALESCE($3, fch_entrega), prioridad = COALESCE($4, prioridad), story_points = COALESCE($5, story_points), id_asignado = COALESCE($6, id_asignado), estado = COALESCE($7, estado) WHERE id_tarea = $8 AND activo = true RETURNING *`;
        const values = [
            datos.Titulo || null,
            datos.Descripcion || null,
            datos.fch_entrega || null,
            datos.Prioridad || 1,
            datos.StoryPoints || 0,
            datos.id_usuario_asignado || null,
            datos.estado || null,
            id_tarea
        ]
        const {rows, rowCount} = await this.db.query(sql, values);
        if (rowCount === 0) {
            throw new NotFoundException(`No se pudo actualizar: Tarea con ID ${id_tarea} no encontrada`);
        }
        return rows[0];
    }

    async eliminarTarea(id_tarea: number) {
        const sql = `UPDATE TAREA SET activo = false, fch_borrado = CURRENT_TIMESTAMP WHERE id_tarea = $1 AND activo = true RETURNING *`;
        const {rowCount} = await this.db.query(sql, [id_tarea]);
        if (rowCount === 0) {
            throw new NotFoundException(`No se pudo eliminar: Tarea con ID ${id_tarea} no encontrada`);
        }
        return { message: `Tarea con ID ${id_tarea} eliminada exitosamente` };
    }
}