import {
  Controller,
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TodoService } from './todo.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getTasks(@Req() req: Request): Promise<Task[]> {
    const userId = (req.user as { id: number }).id; // custom.d.tsが有効でないらしい...
    return this.todoService.getTasks(userId);
  }

  // @Paramを使用すると、GetリクエストのURLパラメータを変数(taskId)として取得できる
  // ParseIntPipeを使用すると、URLパラメータを整数に変換できる
  @Get(':id')
  getTaskById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<Task> {
    const userId = (req.user as { id: number }).id;
    return this.todoService.getTaskById(userId, taskId);
  }

  // @Bodyを使用すると、Postリクエストのリクエストボディを変数(createTaskDto)として取得できる
  @Post()
  createTask(
    @Req() req: Request,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const userId = (req.user as { id: number }).id;
    return this.todoService.createTask(userId, createTaskDto);
  }

  @Patch(':id')
  updateTask(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const userId = (req.user as { id: number }).id;
    return this.todoService.updateTask(userId, taskId, updateTaskDto);
  }

  // @HttpCodeを使用すると、HTTPステータスコードを変更できる。
  // NO_CONTENTは、リソースが正常に削除されたことを示すステータスコード204
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteTask(
    @Req() req: Request,
    @Param('id', ParseIntPipe) taskId: number,
  ): Promise<void> {
    const userId = (req.user as { id: number }).id;
    return this.todoService.deleteTask(userId, taskId);
  }
}
