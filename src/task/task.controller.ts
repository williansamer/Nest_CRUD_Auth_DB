import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { FindAllParameters, TaskDto } from './dtos/task.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() task: TaskDto) {
        let taskCreated = await this.taskService.create(task);
        return taskCreated;
    }

    @UseGuards(AuthGuard)
    @Post('all')
    async createMultipleTasks(@Body() task: TaskDto[]) {
        let taskCreated = await this.taskService.createMultipleTasks(task);
        return taskCreated;
    }

    @Get()
    async findAll(@Query() param: FindAllParameters) {
        let response = await this.taskService.findAll(param);

        return response;
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        let response = await this.taskService.findById(id);

        return response;
    }

    @Put()
    async update(@Body() task: TaskDto) {
        let response = await this.taskService.update(task);

        return response;
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        let response = await this.taskService.delete(id);

        return response;
    }
}
