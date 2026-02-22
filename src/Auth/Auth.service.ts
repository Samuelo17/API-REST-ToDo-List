import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsuarioService } from "src/Usuario/Usuario.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuarioService,
        private readonly jwtService: JwtService,
    ) {}

    //METODO PPARA VALIDAR EL ACCESO DE UN USUARIO (login)
    async validarUsuario(email: string, clavePlana: string) {
        const usuario = await this.usuarioService.obtenerUsuarioPorEmail(email);
        if (!usuario) {
            throw new UnauthorizedException('Credenciales inválidas');
     }  
        const esValida = await bcrypt.compare(clavePlana, usuario.clave);
        if (!esValida) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = {
            id: usuario.id_usuario,
            email: usuario.email,
            nombre: usuario.nombre
        };
            
        return{
            accessToken: this.jwtService.sign(payload),
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email
            }
        };
    }
}