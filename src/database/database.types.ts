import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ModelCtor } from 'sequelize-typescript';

export interface IDatabaseSamples {
  connect: (models?: ModelCtor[]) => SequelizeModuleOptions;
}

export type TDialect = 'mysql' | 'postgres' | 'sqlite' | 'mariadb';
