import {Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { DatabaseService } from 'src/DataBase/database.service';
import { CrearCategoriaDto } from 'src/Auth/DTO/crear-categoria.dto';
import { AsociarCategoriaDto } from 'src/Auth/DTO/asociar-categoria.dto';

@Injectable()
export class CategoriaService {
    constructor(private readonly db: DatabaseService) {}

    async crearCategoria(dto: CrearCategoriaDto) {
        const sql = `INSERT INTO CATEGORIA (nombre, descrip, color) VALUES ($1, $2, $3) RETURNING *`;
        const {rows} = await this.db.query(sql, [dto.nombre, dto.descripcion, dto.color]);
        return rows[0];
    }

    async listarCategorias() {
        const {rows} = await this.db.query(`SELECT * FROM CATEGORIA WHERE activo = true`);
        return rows;
    }

    async asociarCategoria(dto: AsociarCategoriaDto) {
        // Verificar que la tarea exista
        const tareaExiste = await this.db.query(`SELECT id_tarea FROM TAREA WHERE id_tarea = $1`, [dto.id_tarea]);
        if (tareaExiste.rowCount === 0) {
            throw new NotFoundException(`La tarea con ID ${dto.id_tarea} no existe`);
        }
        // Verificar que la categoría exista
        const categoriaExiste = await this.db.query(`SELECT id_categ FROM CATEGORIA WHERE id_categ = $1`, [dto.id_categ]);
        if (categoriaExiste.rowCount === 0) {
            throw new NotFoundException(`La categoría con ID ${dto.id_categ} no existe`);
        }
        // Verificar que la asociación no exista
        const asociacionExiste = await this.db.query(
            `SELECT * FROM TAREA_CATEGORIA WHERE id_tarea = $1 AND id_categ = $2`,
            [dto.id_tarea, dto.id_categ]
        );
        if (asociacionExiste.rowCount > 0) {
            throw new BadRequestException(`La asociación entre tarea y categoría ya existe`);
        }
        // Crear la asociación
        const sql = `INSERT INTO TAREA_CATEGORIA (id_tarea, id_categ) VALUES ($1, $2) RETURNING *`;
        try{
            const {rows} = await this.db.query(sql, [dto.id_tarea, dto.id_categ]);
            return rows[0];
        }catch(error){
            throw new BadRequestException(`Error al asociar la categoría: ${error.message}`);
        }
    }
    async listarNoAsociadas(id_tarea: number) {
        // Verificar que la tarea exista
        const tareaExiste = await this.db.query(`SELECT id_tarea FROM TAREA WHERE id_tarea = $1`, [id_tarea]);
        if (tareaExiste.rowCount === 0) {
            throw new NotFoundException(`La tarea con ID ${id_tarea} no existe`);
        }
        const sql = `SELECT * FROM CATEGORIA WHERE activo = true AND id_categ NOT IN (SELECT id_categ FROM TAREA_CATEGORIA WHERE id_tarea = $1)`;
        const {rows} = await this.db.query(sql, [id_tarea]);
        return rows;
    }
    //Eliminar categoria
    async eliminarCategoria(id_categ: number) {
        // Verificar que la categoría exista
        const categoriaExiste = await this.db.query(`SELECT id_categ FROM CATEGORIA WHERE id_categ = $1`, [id_categ]);
        if (categoriaExiste.rowCount === 0) {
            throw new NotFoundException(`La categoría con ID ${id_categ} no existe`);
        }
        
        const sql = `DELETE FROM CATEGORIA WHERE id_categ = $1 RETURNING *`;
        const {rows} = await this.db.query(sql, [id_categ]);
        return rows[0];
    }





}