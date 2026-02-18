import { Injectable, OnModuleInit, OnModuleDestroy, Logger, ConflictException, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;
    private readonly logger = new Logger(DatabaseService.name);

    constructor(private configService: ConfigService) {}

    onModuleInit() {
        this.pool = new Pool({
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            user: this.configService.get<string>('DB_USER'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_NAME'),
            max: 10,
        });

        this.logger.log('!Conexion al Pool de PosgreSQL inicializada!');
    }

    async onModuleDestroy() {
        await this.pool.end();
        this.logger.log('Pool de conexiones cerrado.');
    }

    async query<T extends Record<string, any> = Record<string, any>>(text: string, params?:unknown[]): Promise<{ rows: T[];
        rowCount: number }> {
            if(!text || text.trim() === '') {
                throw new InternalServerErrorException('La consulta SQL no puede estar vacía o Invalidad');
            }
            const start = Date.now();
            try {
                const result = await this.pool.query<T>(text, params);
                //calcular duracion 
                const duracion = Date.now() - start;
                if (duracion > 1000){
                    this.logger.warn(`Consulta lenta (${duracion}ms): ${text.substring(0, 100)}...`);
                }
                return {
                    rows: result.rows,
                    rowCount: result.rowCount ?? 0,
                };


            } catch (error: any) {
                const duracion = Date.now() - start;

                this.logger.error(`Error SQL (${duracion}ms) [Code: ${error.code}]: ${error.message} \nQuery: ${text}`,
                    error.stack
                );
                switch (error.code){
                    case '23505':
                        throw new ConflictException('Ya existe un registro con esos datos unicos');
                    case '23503': 
                        throw new BadRequestException('El registro relacionado no existe (FOREIGN KEY)');
                    case '23502':
                        throw new BadRequestException('Faltan campos obligatorios');
                    case '22P02':
                        throw new BadRequestException('Formato de datos invalido en la consulta SQL');
                    case '42P01':
                        throw new InternalServerErrorException('Error interno: Tabla no encontrada en la base de datos');
                    default:
                        throw new InternalServerErrorException(`Error en base de datos: ${error.message}`);


                }
            }
       
    }

    async getClient() {
        return await this.pool.connect();
    }
}
