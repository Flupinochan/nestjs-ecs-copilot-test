// DTOとは、クライアントとサーバーの間でデータをやり取りするためのオブジェクト
// データを格納するクラス
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
