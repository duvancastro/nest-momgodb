import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/tasks.schemas';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private tasksModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const newTask = new this.tasksModel(createTaskDto);
      await newTask.save();
      return newTask;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('task already exists');
      }
      throw error;
    }
  }

  async findAll() {
    const tasks = await this.tasksModel.find();
    return tasks;
  }

  async findOne(id: string) {
    const task = await this.tasksModel.findById(id);
    if (!task) throw new NotFoundException('task no found');
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const updateTask = await this.tasksModel.findByIdAndUpdate(
      id,
      updateTaskDto,
      { new: true },
    );
    if (!up) throw new NotFoundException('task no found');

    return updateTask;
  }

  async remove(id: string) {
    const taskDelete = await this.tasksModel.findByIdAndDelete(id);
    if (!taskDelete) throw new NotFoundException('task no found');
    return taskDelete;
  }
}
