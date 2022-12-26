import { DataSource } from 'typeorm';
import ormconfig from './ormconfig';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'root',
  database: 'mediumclone',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/seeds/**/*{.ts,.js}'],
  migrationsTableName: 'seeds_table',
});
