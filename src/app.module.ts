import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { WsModule } from './ws/ws.module';
import { AuthModule } from './auth/auth.module';
import { database } from './config';
import { CashflowModule } from './cashflow/cashflow.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...database,
      dialect: 'mysql',
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    WsModule,
    CashflowModule,
    MailModule,
    ConfigModule,
  ]
})
export class AppModule {}
