import {Controller, Post, Body, UseGuards, Get, Request} from '@nestjs/common';
import { AuthService } from './Auth.service';
import { UsuarioService } from 'src/Usuario/Usuario.service';
import { RegistroDTO } from './DTO/Registro.DTO';
import { LoginDTO } from './DTO/Login.DTO';
import { JwtAuthGuard } from './Guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
    private readonly authService: AuthService,
    private readonly usuarioService: UsuarioService,
    ) {}

    @Post('registro')
    async registrar(@Body() registroDTO: RegistroDTO) {
        return this.usuarioService.crearUsuario(
            registroDTO.nombre,
            registroDTO.email,
            registroDTO.clave
        );
    }

    @Post('login')
    async login(@Body() loginDTO: LoginDTO) {
        return this.authService.validarUsuario(
            loginDTO.email,
            loginDTO.clave
        );
    }

    @Post('logout')
    async logout(){
        //Por ahora solo un mensaje de que se cerro la sesion, en una implementacion real se deberia invalidar el token
        return {message: 'Sesion cerrada correctamente'};
    }

    @UseGuards(JwtAuthGuard)
    @Get('perfil')
    obtenerPerfil(@Request() req) {
        return req.user;
    }
}