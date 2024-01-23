import type { IDatabaseSamples, TDialect } from '../database.types';
import * as process from 'process';
import type { SequelizeModuleOptions } from '@nestjs/sequelize';
import type { ModelCtor } from 'sequelize-typescript';

export default class SqlDatabase implements IDatabaseSamples {
  public connect(models: ModelCtor[] = []): SequelizeModuleOptions {
    return {
      dialect: process.env.DB_DIALECT as TDialect,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models,
      autoLoadModels: true,
      define: {
        timestamps: false,
      },
    };
  }
}
