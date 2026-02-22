import { Injectable } from '@nestjs/common';
import { DatabaseService } from './DataBase/database.service';

@Injectable()
export class AppService {

  constructor(private databaseService: DatabaseService) {}
async checkDatabase() {
    // Usamos el método query que ya programaste en tu DatabaseService
    const result = await this.databaseService.query('SELECT NOW() as time');
    return result.rows[0];
  }

  getHello(): string {
    return 'Hello World!';
  }
}
