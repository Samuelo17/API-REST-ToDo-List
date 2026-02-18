import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsuarioService } from "src/Usuario/Usuario.service";
import { DatabaseService } from "../DataBase/database.service";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly config: ConfigService,
    ) {}

private generarToken(usuario: any) {
        const secreta = this.config.get<string>('JWT_SECRET');
        if(!secreta) {
            throw new Error('JWT_SECRET no está configurada en las variables de entorno');
        }
        const payload = {
            sub: usuario.id_usuario,
            email: usuario.email,   
            nombre: usuario.nombre,
        };
        return jwt.sign(payload, secreta, { expiresIn: '8h' });
}

    //METODO PPARA VALIDAR EL ACCESO DE UN USUARIO (login)
    async validarUsuario(email: string, clavePlana: string) {
        const usuario = await this.usuarioService.obtenerUsuarioPorEmail(email);
        if (!usuario || !usuario.activo) {
            throw new UnauthorizedException('Credenciales inválidas');
     }  
        const esValida = await bcrypt.compare(clavePlana, usuario.clave);
        if (!esValida) {
            throw new UnauthorizedException('Credenciales inválidas');
        }
        return{
            accessToken: this.generarToken(usuario),
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
            }
        };
    }
}