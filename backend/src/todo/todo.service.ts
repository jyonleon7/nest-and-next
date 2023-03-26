import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask(
    userId: number,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    try {
      const task = await this.prisma.task.create({
        data: {
          ...createTaskDto,
          userId,
        },
      });
      return task;
    } catch (error) {
      throw error;
    }
  }

  async getTasks(userId: number): Promise<Task[]> {
    return await this.prisma.task.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTaskById(id: number, userId: number): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });
    if (!task) {
      throw new NotFoundException('該当のリストが見つかりませんでした。');
    }
    return task;
  }

  async updateTask(
    id: number,
    userId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task || task.userId !== userId) {
      throw new ForbiddenException('no permission exception');
    }
    return await this.prisma.task.update({
      where: {
        id,
      },
      data: { ...updateTaskDto },
    });
  }

  async deleteTaskById(id: number, userId: number): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      throw new ForbiddenException('No permission to delete');
    }

    await this.prisma.task.delete({ where: { id } });
  }
}
