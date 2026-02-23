import { Module } from "@nestjs/common";
import { TareaService } from "./Tarea.service";
import { TareaController } from "./Tarea.controller";
import { DatabaseModule } from "src/DataBase/database.module";

@Module({
    imports: [DatabaseModule],
    providers: [TareaService],
    controllers: [TareaController],
    exports: [TareaService]
})
export class TareaModule {}