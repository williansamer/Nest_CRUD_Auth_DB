import { HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { FindAllParameters, TaskDto } from './dtos/task.dto';

@Injectable()
export class TaskService {

    private tasks: TaskDto[] = [];
    async create(task: TaskDto): Promise<TaskDto[]> {
        let taskAlreadyExists = await this.tasks.filter((item) => item.id === task.id);

        if (taskAlreadyExists.length) {
            throw new HttpException('Task already exists', HttpStatus.CONFLICT);
        }

        this.tasks.push(task);

        return this.tasks
    }

    createMultipleTasks(task: TaskDto[]) {
        task.forEach((item) => {
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

    async findById(id: string): Promise<TaskDto[]> {
        let getTask = await this.tasks.filter((item) => item.id === id);

        if (!getTask.length) {
            throw new HttpException(`Can not find the task with id ${id}`, HttpStatus.NOT_FOUND);
        }

        return getTask;
    }

    async update(task: TaskDto): Promise<object> {
        let taskIndex = await this.tasks.findIndex(item => item.id === task.id);

        if (taskIndex >= 0) {
            this.tasks[taskIndex] = task;
            return {message: 'UPDATED', task};
        }

        throw new HttpException('Task not Found!!!', HttpStatus.BAD_REQUEST)
    }

    async delete(id: string): Promise<object> {
        let taskIndex = await this.tasks.findIndex((item) => item.id === id);

        if (!(taskIndex >= 0)) {
            throw new HttpException(`Can not find the task with id ${id}`, HttpStatus.NOT_FOUND);
        }

        await this.tasks.splice(taskIndex, 1);

        return {message: 'DELETED'}
    }
}
