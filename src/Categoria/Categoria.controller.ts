import { Controller, Post, Get, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { CategoriaService } from "./Categoria.service";
import { CrearCategoriaDto } from "src/Auth/DTO/crear-categoria.dto";
import { AsociarCategoriaDto } from "src/Auth/DTO/asociar-categoria.dto";
import { JwtAuthGuard } from "src/Auth/Guards/jwt-auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('categorias')
export class CategoriaController {
    constructor(private readonly categoriaService: CategoriaService) {}

    @Post()
    async crearCategoria(@Body() dto: CrearCategoriaDto) {
        return this.categoriaService.crearCategoria(dto);
    }

    @Get()
    async listarCategorias() {
        return await this.categoriaService.listarCategorias();
    }

    @Post('asociar')
    async asociarCategoria(@Body() dto: AsociarCategoriaDto) {
        return await this.categoriaService.asociarCategoria(dto);
    }

    @Get('no-asociadas/:id_tarea')
    async listarNoAsociadas(@Param('id_tarea') id_tarea: number) {
        return await this.categoriaService.listarNoAsociadas(id_tarea);
    }

    @Delete(':id_categ')
    async eliminarCategoria(@Param('id_categ') id_categ: number) {
        return await this.categoriaService.eliminarCategoria(id_categ);
    }
}