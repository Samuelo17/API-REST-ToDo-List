import {Module} from "@nestjs/common";
import { ComentarioController } from "./Comentario.controller";
import { ComentarioService } from "./Comentario.service";
import { DatabaseModule } from "src/DataBase/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [ComentarioController],
    providers: [ComentarioService],
    exports: [ComentarioService],
})
export class ComentarioModule {}

