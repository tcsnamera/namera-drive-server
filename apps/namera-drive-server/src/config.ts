import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { plainToClass } from 'class-transformer';
import { JwtModuleOptions } from '@nestjs/jwt';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class Config {
  jwt: JwtModuleOptions;
  typeorm: TypeOrmModuleOptions;
}

export default () => {
  const fileContent = fs.readFileSync(path.join(__dirname, 'assets/config.yaml'), { encoding: 'utf-8' });
  const object = yaml.parse(fileContent);
  return plainToClass(Config, object);
};
