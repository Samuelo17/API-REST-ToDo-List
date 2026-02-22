import { Module } from "@nestjs/common";
import { AuthService } from "./Auth.service";
import { AuthController } from "./Auth.controller";
import { UsuarioModule } from "src/Usuario/Usuario.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./Strategies/jwt.strategy";
import { JwtAuthGuard } from "./Guards/jwt-auth.guard";

@Module({
    imports: [
        UsuarioModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '8h' },
            }),
        }),
    ],
    providers:[AuthService, JwtStrategy, JwtAuthGuard],
    controllers: [AuthController],
    exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}