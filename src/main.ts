import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppDataSource } from '@app/ormconfig';

if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Mediumclone example')
    .setDescription('The mediumclone API description')
    .setVersion('1.0')
    .addTag('mediumclone')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  AppDataSource.initialize()
    .then(() => {
      console.log('AppDataSource start');
    })
    .catch((error) => console.log(error));

  await app.listen(3000);
}
bootstrap();
