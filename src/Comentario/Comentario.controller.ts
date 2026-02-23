import {Controller, Post, Get, Delete, Body, Param, Request, UseGuards} from '@nestjs/common';
import { ComentarioService } from './Comentario.service';
import { CrearComentarioDTO } from 'src/Auth/DTO/crear-comentario.dto';
import { JwtAuthGuard } from 'src/Auth/Guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('comentarios')
export class ComentarioController {
    constructor(private readonly comentarioService: ComentarioService) {}

    @Post()
    async crearComentario(@Body() dto: CrearComentarioDTO, @Request() req) {
        return await this.comentarioService.crearComentario(dto, req.user.id);
    }

    //Listar comentarios por tarea
    @Get('tarea/:id_tarea')
    async listarComentariosPorTarea(@Param('id_tarea') id_tarea: number) {
        return await this.comentarioService.listarComentariosPorTarea(id_tarea);
    }

    //Eliminar comentario
    @Delete(':id_coment')
    async eliminarComentario(@Param('id_coment') id_coment: number, @Request() req) {
        await this.comentarioService.eliminarComentario(id_coment, req.user.id);
        return {message: "Comentario eliminado correctamente"};
    }
}