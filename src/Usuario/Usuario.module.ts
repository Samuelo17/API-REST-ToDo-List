import { Module } from "@nestjs/common";
import { UsuarioService } from "./Usuario.service";
import { DatabaseModule } from "src/DataBase/database.module";
import { UsuarioController } from "./Usuario.controller";

@Module({
    imports: [DatabaseModule],
    providers: [UsuarioService],
    controllers: [UsuarioController],
    exports: [UsuarioService]
})
export class UsuarioModule {}