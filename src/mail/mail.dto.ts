import { ApiProperty } from '@nestjs/swagger';

export class MailConfigDto {
  @ApiProperty({ name: 'username', description: '用户名', example: 'imlinhanchao@foxmail.com' })
  username: string;

  @ApiProperty({ name: 'password', description: '密码', example: '123456' })
  password: string;
}

export class MailRecvOptions {
  markSeen?: boolean;
  content?: boolean;
  attachments?: boolean;
  saveAttachments?: (header: any, content) => Promise<{
    filename: string,
    savePath: string,
  }>;
}