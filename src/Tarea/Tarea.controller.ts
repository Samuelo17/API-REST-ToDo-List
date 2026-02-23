import {Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import {TareaService} from './Tarea.service';
import { CrearTareaDto } from 'src/Auth/DTO/crear-tarea.dto';
import { JwtAuthGuard } from 'src/Auth/Guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tareas')
export class TareaController {
    constructor(private readonly tareaService: TareaService) {}
    @Post()
    async crearTarea(@Body() dto: CrearTareaDto, @Request() req) {
        console.log("Usuario en el token:", req.user); // Verificar el contenido del token JWT
        const idCreador = req.user.id; // Obtener el ID del usuario desde el token JWT
        return await this.tareaService.crearTarea(dto, idCreador);
    }
    //Listar tareas con filtros
    @Get()
    async listarTareas(
        @Query('id_usuario') id_usuario?: string,
        @Query('estado') estado?: string
        ) {
            const UsuarioId = id_usuario ? parseInt(id_usuario) : undefined;
            return await this.tareaService.listarTareas(UsuarioId, estado);
    }
    //Obtener detalles de una tarea
    @Get(':id')
    async obtenerDetallesTarea(@Param('id', ParseIntPipe) id_tarea: number) {
        return await this.tareaService.obtenerDetallesTarea(id_tarea);
    }
    //Actualizar tarea
    @Put(':id')
    async actualizarTarea(@Param('id', ParseIntPipe) id_tarea: number, @Body() datos: Partial<CrearTareaDto & { estado?: string}>) {
        return await this.tareaService.actualizarTarea(id_tarea, datos);
    }

    //Eliminar tarea(Borrado logico)
    @Delete(':id')
    async eliminarTarea(@Param('id', ParseIntPipe) id_tarea: number) {
        return await this.tareaService.eliminarTarea(id_tarea);
    }


}