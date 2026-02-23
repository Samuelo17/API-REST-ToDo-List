import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {DatabaseModule} from './DataBase/database.module';
import { UsuarioModule } from './Usuario/Usuario.module';
import { AuthModule } from './Auth/Auth.module';
import { TareaModule } from './Tarea/Tarea.module';
import { ComentarioModule } from './Comentario/Comentario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsuarioModule,
    AuthModule,
    TareaModule,
    ComentarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
