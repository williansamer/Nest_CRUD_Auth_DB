import { HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { FindAllParameters, StatusDefinition, TaskDto } from './dtos/task.dto';
import { v4 as uuid } from 'uuid';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
export class TaskService {

    private tasks: TaskDto[] = [];

    @UseGuards(AuthGuard)
    async create(task: TaskDto): Promise<TaskDto> {
        let taskAlreadyExists = await this.tasks.filter((item) => item.id === task.id);

        if (taskAlreadyExists.length) {
            throw new HttpException('Task already exists', HttpStatus.CONFLICT);
        }

        task.id = uuid();
        task.expirationDate = new Date();
        task.position = this.tasks.length + 1;
        if (!task.status) {
            task.status = StatusDefinition.TO_DO;
        }
        this.tasks.push(task);

        return task;
    }

    @UseGuards(AuthGuard)
    createMultipleTasks(task: TaskDto[]) {
        task.forEach((item) => {
            item.id = uuid();
            item.expirationDate = new Date();
            item.position = this.tasks.length + 1;
            if (!item.status) {
                item.status = StatusDefinition.TO_DO;
            }
            this.tasks.push(item);
        })

        return {message: 'Added'}
    }

    async findAll(params: FindAllParameters): Promise<TaskDto[]> {
        let getTasks = await this.tasks.filter(item => {
            let match = true;

            if (params.title !== undefined && !item.title.includes(params.title)) {
                match = false;
            }
            if (params.status !== undefined && !item.status.includes(params.status)) {
                match = false;
            }

            return match;
        })

        return getTasks;
    }

    async findById(position: string): Promise<TaskDto[]> {
        let getTask = await this.tasks.filter((item) => item.position.toString() === position);

        if (!getTask.length) {
            throw new HttpException(`Can not find the task with position ${position}`, HttpStatus.NOT_FOUND);
        }

        return getTask;
    }

    @UseGuards(AuthGuard)
    async update(task: TaskDto): Promise<object> {
        let taskIndex = await this.tasks.findIndex(item => item.position === task.position);

        if (taskIndex >= 0) {
            this.tasks[taskIndex].title = this.tasks[taskIndex].title !== task.title ? task.title : this.tasks[taskIndex].title;
            this.tasks[taskIndex].description = this.tasks[taskIndex].description !== task.description ? task.description : this.tasks[taskIndex].description;
            this.tasks[taskIndex].status = this.tasks[taskIndex].status !== task.status ? task.status : this.tasks[taskIndex].status;
            return {message: 'UPDATED', task: this.tasks[taskIndex]};
        }

        throw new HttpException('Task not Found!!!', HttpStatus.BAD_REQUEST)
    }

    @UseGuards(AuthGuard)
    async delete(id: string): Promise<object> {
        let taskIndex = await this.tasks.findIndex((item) => item.id === id);

        if (!(taskIndex >= 0)) {
            throw new HttpException(`Can not find the task with id ${id}`, HttpStatus.NOT_FOUND);
        }

        await this.tasks.splice(taskIndex, 1);

        return {message: 'DELETED'}
    }
}
