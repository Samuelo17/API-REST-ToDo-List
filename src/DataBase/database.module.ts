import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Global() 
@Module({
  providers: [DatabaseService], // El Service es el que tiene la lógica de conexión
  exports: [DatabaseService],  
})
export class DatabaseModule {}