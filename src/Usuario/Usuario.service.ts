import {Injectable, ConflictException, InternalServerErrorException, BadRequestException} from "@nestjs/common";
import { DatabaseService } from "src/DataBase/database.service";
import * as bcrypt from 'bcrypt';
import { use } from "passport";

@Injectable()
export class UsuarioService {
    constructor(private readonly db: DatabaseService) {}

    async crearUsuario(nombre: string, email: string, clavePlana: string){
        //validamos si el usuario ya existe
        const UsuarioExistente = await this.obtenerUsuarioPorEmail(email);
        if(UsuarioExistente){
            throw new ConflictException('El email ya está registrado');
        }
        const saltos = 10;
        const claveHash = await bcrypt.hash(clavePlana, saltos);
        try{
        const sql = `INSERT INTO USUARIO (nombre, email, clave) VALUES ($1, $2, $3) RETURNING id_usuario, nombre, activo`;
        const { rows}  = await this.db.query(sql, [nombre, email, claveHash]);
        return rows[0];
        } catch (error) {
            throw new BadRequestException('No se pudo crear el usuario, por favor verifique los datos ingresados');
        }
    }
    async obtenerUsuarioPorEmail(email: string) {
        const sql = `SELECT id_usuario, nombre, email, clave FROM USUARIO WHERE email = $1 AND activo = true`;
        const { rows, rowCount } = await this.db.query(sql, [email]);
        return rowCount > 0 ? rows[0] : null;
    }

    async obtenerUsuarioPorId(id_usuario: number) {
        const sql = `SELECT id_usuario, nombre, email, activo FROM USUARIO WHERE id_usuario = $1 AND activo = true`;
        const { rows, rowCount } = await this.db.query(sql, [id_usuario]);

        if(rowCount === 0){
            throw new BadRequestException('El Usuario con `ID ${id_usuario}` no existe');
        }
        return rows[0];
    }

    async obtenerUsuarios(){
        const sql = `SELECT id_usuario, nombre, email, fch_creacion, activo FROM USUARIO WHERE activo = true`;
        const { rows } = await this.db.query(sql);
        return rows;
    }

    //metodo para obtener usuarios eliminados como forma de historial
    async obtenerUsuariosEliminados(){
        const sql = `SELECT id_usuario, nombre, email, fch_creacion, fch_borrado FROM USUARIO WHERE activo = false`;
        const { rows } = await this.db.query(sql);
        return rows;
    }

    async actualizarUsuario(id_usuario: number,datos: {nombre?: string, email?: string}){
        //validamos si el usuario existe
        const UsuarioExistente = await this.obtenerUsuarioPorId(id_usuario);
        if(!UsuarioExistente){
            throw new BadRequestException('El Usuario con `ID ${id_usuario}` no existe');
        }
        const sql = `UPDATE USUARIO  SET nombre = COALESCE($1, nombre), email = COALESCE($2, email) WHERE id_usuario = $3 RETURNING id_usuario, nombre, email`;
        const { rows } = await this.db.query(sql, [datos.nombre, datos.email, id_usuario]);
        return rows[0];
    }

    async eliminarUsuario(id_usuario: number){
        //validamos si el usuario existe
        const UsuarioExistente = await this.obtenerUsuarioPorId(id_usuario);
        if(!UsuarioExistente){
            throw new BadRequestException('El Usuario con `ID ${id_usuario}` no existe');
        }
        const sql = `UPDATE USUARIO SET activo = false, fch_borrado = CURRENT_TIMESTAMP WHERE id_usuario = $1 RETURNING id_usuario, nombre, email, activo, fch_borrado`;
        try{
            const { rows } = await this.db.query(sql, [id_usuario]);
            return{
                message: 'Usuario eliminado exitosamente',
                usuario: rows[0]
            }
            
        }catch (error) {
            throw new InternalServerErrorException('No se pudo eliminar el usuario, por favor intente nuevamente');
        } 
    }
}


