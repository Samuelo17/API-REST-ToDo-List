import {Module} from '@nestjs/common';
import { CategoriaController } from './Categoria.controller';
import { CategoriaService } from './Categoria.service';
import { DatabaseModule } from 'src/DataBase/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [CategoriaController],
    providers: [CategoriaService],
    exports: [CategoriaService],
})
export class CategoriaModule {}