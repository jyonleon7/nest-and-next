import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Task } from '@prisma/client';
import { Request } from 'express';
import { CreateTaskDto } from './dto/create-task-dto';
import { UpdateTaskDto } from './dto/update-task-dto';
import { TodoService } from './todo.service';

@UseGuards(AuthGuard('jwt'))
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getTasks(@Req() req: Request): Promise<Task[]> {
    return await this.todoService.getTasks(req.user.id);
  }

  @Get(':id')
  async getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<Task> {
    return await this.todoService.getTaskById(id, req.user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async createTask(
    @Req() req: Request,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return await this.todoService.createTask(req.user.id, createTaskDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.todoService.updateTask(id, req.user.id, updateTaskDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ): Promise<void> {
    await this.todoService.deleteTaskById(id, req.user.id);
  }
}
