import {AddTodolistActionType, RemoveTodolistActionType, setTodolistsActionType} from './todolists-reducer';
import {TasksStateType} from "../AppWithRedux";
import {ItemTaskType, tasksAPI, TaskStatuses, UpdateTaskModelType} from "../API";
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK'
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK'
    todolistId: string
    title: string
    task: ItemTaskType
}

export type ChangeTaskStatusActionType = {
    type: 'CHANGE-TASK-STATUS'
    todolistId: string
    taskId: string
    status: TaskStatuses
}

export type ChangeTaskTitleActionType = {
    type: 'CHANGE-TASK-TITLE'
    todolistId: string
    taskId: string
    title: string
}
export type setTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<ItemTaskType>
    todolistId: string
}

type ActionsType = RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | setTodolistsActionType
    | setTasksActionType

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id != action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            const newTask = {...action.task, title: action.title}
            const tasks = stateCopy[action.todolistId];
            const newTasks = [newTask, ...tasks];
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'CHANGE-TASK-STATUS': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, status: action.status} : t)
            state[action.todolistId] = newTasksArray
            return ({...state});
        }
        case 'CHANGE-TASK-TITLE': {
            let todolistTasks = state[action.todolistId];
            let newTasksArray = todolistTasks
                .map(t => t.id === action.taskId ? {...t, title: action.title} : t)
            state[action.todolistId] = newTasksArray
            return ({...state});
        }
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS': {
            const copyState = {...state}
            copyState[action.todolistId] = action.tasks
            return copyState
        }
        default:
            return state;
    }
}

export const fetchTasksThunkAC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        tasksAPI.getTasks(todolistId)
            .then(res => dispatch(setTasksAC(res.data.items, todolistId)))
    }
}
export const addTaskThunkAC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch) => {
        tasksAPI.addTask(todolistId, title)
            .then(res => dispatch(addTaskAC(title, todolistId, res.data.data.item)))
    }
}
export const removeTaskThunkAC = (todolistId: string, taskId: string) => {
    return (dispatch: Dispatch) => {
        tasksAPI.deleteTask(todolistId, taskId)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(removeTaskAC(taskId, todolistId))
                }
            })
    }
}

export const changeTaskTitleThunkAC = (taskId: string, newTitle: string, todolistId: string) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {

        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)

        if(task) {

            const model: UpdateTaskModelType = {
                title: newTitle,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline
            }

            tasksAPI.updateTask(todolistId, taskId, model)
                .then(res => {
                    if (res.data.resultCode === 0) {
                        dispatch(changeTaskTitleAC(taskId, newTitle, todolistId))
                    }
                })
        } else {
            throw new Error('ERROR! TASK IS NOT FOUND!')
        }
    }
}


export const changeTaskStatusThunkAC = (todolistId: string, taskId: string, status: TaskStatuses) => {

    return (dispatch: Dispatch, getState: () => AppRootStateType) => {

        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)

        if(task) {
            const model: UpdateTaskModelType = {
                title: task.title,
                description: task.description,
                status: status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline
            }

            tasksAPI.updateTask(todolistId, taskId, model)
                .then( res => {
                    if(res.data.resultCode === 0) {
                        dispatch(changeTaskStatusAC(taskId, status, todolistId))
                    }
                })

        } else {
            throw new Error('ERROR! TASK IS NOT FOUND!')
        }
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (title: string, todolistId: string, task: ItemTaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', title, todolistId, task}
}
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}
export const setTasksAC = (tasks: Array<ItemTaskType>, todolistId: string) => {
    return {type: 'SET-TASKS', tasks: tasks, todolistId: todolistId}
};