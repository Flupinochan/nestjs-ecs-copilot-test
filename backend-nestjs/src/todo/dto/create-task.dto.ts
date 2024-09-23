// Taskを作成する際に、データを格納し、バリデーションを行うためのクラス
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateTaskDto {
  // string型で、空でないことを保証する
  @IsString()
  @IsNotEmpty()
  title: string;

  // string型で、空でも良いことを保証する
  @IsString()
  @IsOptional()
  description?: string;
}

// isNotEmptyとisOptionalは、反対の関係にある
