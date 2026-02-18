import { Injectable } from '@nestjs/common';
import { DatabaseService } from './DataBase/database.service';

@Injectable()
export class AppService {

  constructor(private databaseService: DatabaseService) {}
  getHello(): string {
    return 'Hello World!';
  }
}
