import { Module } from "@nestjs/common";
import { UsuarioService } from "./Usuario.service";
import { DatabaseModule } from "src/DataBase/database.module";

@Module({
    imports: [DatabaseModule],
    providers: [UsuarioService],
    controllers: [],
    exports: [UsuarioService]
})
export class UsuarioModule {}