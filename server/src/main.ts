import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as https from 'https';

declare const module: any;
async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert'),
  };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  app.enableCors();
  await app.listen(4000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
