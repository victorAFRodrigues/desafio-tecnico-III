import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Médica')
    .setDescription('Cadastro de pacientes e exames DICOM')
    .setVersion('1.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-json', app, document);

  const { apiReference } = await import('@scalar/nestjs-api-reference');
  app.use(
    '/docs',
    apiReference({
      url: '/api-json-json',
    }),
  );

  await app.listen(3000);
}
bootstrap();
