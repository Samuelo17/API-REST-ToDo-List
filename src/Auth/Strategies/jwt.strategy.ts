import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuarioService } from 'src/Usuario/Usuario.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly usuarioService: UsuarioService
    ) {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new UnauthorizedException('JWT_SECRET no esta definida');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret
        });
    }

    async validate(payload: any) {
        const usuario = await this.usuarioService.obtenerUsuarioPorEmail(payload.email);
        if (!usuario){
            throw new UnauthorizedException('Usuario no encontrado');
        }
        return{
            id: payload.id,
            email: payload.email,
            nombre: payload.nombre
        };
}
}
    