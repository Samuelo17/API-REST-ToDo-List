import {Injectable, ConflictException, InternalServerErrorException} from "@nestjs/common";
import { DatabaseService } from "src/DataBase/database.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
    constructor(private readonly db: DatabaseService) {}

    async crearUsuario(nombre: string, email: string, clavePlana: string){
        const saltos = 10;
        const claveHash = await bcrypt.hash(clavePlana, saltos);

        const sql = `INSERT INTO USUARIO (nombre, email, clave) VALUES ($1, $2, $3) RETURNING id_usuario, nombre, activo`;
        const { rows}  = await this.db.query(sql, [nombre, email, claveHash]);
        return rows[0];
    }

    async obtenerUsuarioPorEmail(email: string) {
        const sql = `SELECT id_usuario, nombre, email, clave FROM USUARIO WHERE email = $1 AND activo = true`;
        const { rows, rowCount } = await this.db.query(sql, [email]);
        return rowCount > 0 ? rows[0] : null;
    }
}


