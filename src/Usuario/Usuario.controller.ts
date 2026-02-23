import { Controller, Get, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { UsuarioService } from "./Usuario.service";
import { JwtAuthGuard } from "src/Auth/Guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}
    //Listar Usuarios
    @Get()
    async ListarUsuarios(){
        return this.usuarioService.obtenerUsuarios();
    }

    //Listar Usuarios Eliminados
    @Get('historial')
    async obtenerUsuariosEliminados(){
        return this.usuarioService.obtenerUsuariosEliminados();
    }

    //Obtener Usuario por ID
    @Get(':id_usuario')
    async obtenerUsuarioPorId(@Param('id_usuario', ParseIntPipe) id_usuario: number){
        return await this.usuarioService.obtenerUsuarioPorId(id_usuario);
    }

    //Actualizar Usuario
    @Put(':id_usuario')
    async actualizarUsuario(@Param('id_usuario', ParseIntPipe) id_usuario: number, @Body() datos: {nombre?: string, email?: string}){
        return await this.usuarioService.actualizarUsuario(id_usuario, datos);
    }

    //Eliminar Usuario (Borrado Lógico)
    @Delete(':id_usuario')
    async eliminarUsuario(@Param('id_usuario', ParseIntPipe) id_usuario: number){
        return await this.usuarioService.eliminarUsuario(id_usuario);
    }
}
