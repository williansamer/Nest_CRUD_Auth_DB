import { HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { FindAllParameters, StatusDefinition, TaskDto, TaskDtoParameters } from './dtos/task.dto';
import { v4 as uuid } from 'uuid';
import { AuthGuard } from 'src/auth/auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>
    ) {}

    @UseGuards(AuthGuard)
    async create(task: TaskDto): Promise<TaskDto> {
        let taskAlreadyExists = await this.taskRepository.findOne({
            where: {title: task.title}
        })

        if (taskAlreadyExists) {
            throw new HttpException('Task already exists', HttpStatus.CONFLICT);
        }

        const dbTask = new TaskEntity();

        dbTask.title = task.title;
        dbTask.description = task.description;
        dbTask.expirationDate = new Date();
        
        if (!dbTask.status) {
            dbTask.status = StatusDefinition.TO_DO;
        }
        await this.taskRepository.save(dbTask);

        return this.mapTaskEntity(dbTask);
    }

    @UseGuards(AuthGuard)
    createMultipleTasks(task: TaskDto[]) {
        task.forEach((item) => {
            item.id = uuid();
            item.expirationDate = new Date();
            if (!item.status) {
                item.status = StatusDefinition.TO_DO;
            }
            const dbTask = new TaskEntity();
            dbTask.title = item.title;
            dbTask.description = item.description;
            dbTask.expirationDate = new Date();

            this.taskRepository.save(dbTask);
        })

        return {message: 'Added'}
    }

    async findAll(params: FindAllParameters): Promise<TaskDto[]> {
        const searchTasks: FindOptionsWhere<TaskEntity> = {};

        if (params.title) {
            searchTasks.title = Like(`%${params.title}%`)
        }
        if (params.status) {
            searchTasks.status = Like(`%${params.status}%`)
        }
        
        const tasksFound = await this.taskRepository.find({
            where: {
                title: searchTasks.title,
                status: searchTasks.status
            }
        })

        return tasksFound.map((task) => this.mapTaskEntity(task))
    }

    async findById(id: string): Promise<TaskDto> {
        let getTask = await this.taskRepository.findOne({
            where: {id: id}
        });

        if (!getTask) {
            throw new HttpException(`Can not find the task with id ${id}`, HttpStatus.NOT_FOUND);
        }

        return getTask;
    }

    @UseGuards(AuthGuard)
    async update(id: string, task: TaskDto): Promise<object> {
        const getTask = await this.taskRepository.findOne({
            where: {id}
        })

        if (!getTask) {
            throw new HttpException('Task not Found!!!', HttpStatus.BAD_REQUEST)
        }

        await this.taskRepository.update(id, this.mapTaskDtoEntity(task));

        return {
            message: 'UPDATED',
            task: this.mapTaskDtoEntity(task)
        }
    }

    @UseGuards(AuthGuard)
    async delete(id: string): Promise<object> {
        const getTask = await this.taskRepository.findOne({
            where: {id}
        })

        if (!getTask) {
            throw new HttpException(`Can not find the task with id ${id}`, HttpStatus.NOT_FOUND);
        }

        await this.taskRepository.delete(getTask)

        return {message: 'DELETED'}
    }

    private mapTaskEntity(task: TaskDto) {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            expirationDate: task.expirationDate
        }
    }

    private mapTaskDtoEntity(task: TaskDto): Partial<TaskEntity> {
        return {
            title: task.title,
            description: task.description,
            status: task.status && task.status
        }
    }
}
