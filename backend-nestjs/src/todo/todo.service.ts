import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  // ユーザーのタスクを一覧取得する
  // findManyは、Select文に相当する。条件を指定しなければ、全てのデータを取得する
  getTasks(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // TaskIDを指定して、タスク1つを取得する
  getTaskById(userId: number, taskId: number): Promise<Task> {
    return this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });
  }

  // Taskを作成する
  async createTask(userId: number, dto: CreateTaskDto): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        userId,
        ...dto,
      },
    });
    return task;
  }

  // Taskを更新する
  async updateTask(
    userId: number,
    taskId: number,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    // タスクが存在するか、ユーザーがそのタスクの所有者かを確認する
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
    // タスクが存在しない、またはユーザーがそのタスクの所有者でない場合(ユーザIDが一致しない場合)は、エラーをスローする
    if (!task || task.userId !== userId) {
      throw new ForbiddenException('No permission to update this task');
    }
    // タスクを更新する
    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...dto,
      },
    });
  }

  // タスクを削除する
  async deleteTask(userId: number, taskId: number): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
    // タスクが存在しない、またはユーザーがそのタスクの所有者でない場合(ユーザIDが一致しない場合)は、エラーをスローする
    if (!task || task.userId !== userId) {
      throw new ForbiddenException('No permission to delete this task');
    }
    // タスクを削除する
    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}
