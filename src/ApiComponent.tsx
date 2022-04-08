import React, {useState} from 'react'
import {tasksAPI, todolistAPI} from "./API";


type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number

}
type StateType = Array<TodolistType> | null

type TaskType = {
    addedDate: string
    deadline: string | null
    description: string | null
    id: string
    order: number
    priority: number
    startDate: string | null
    status: number
    title: string
    todoListId: string
}
type TaskStateType = Array<TaskType> | null

export const ApiComponent = () => {


    const [state, setState] = useState<StateType>(null)
    const [taskState, setTaskState] = useState<TaskStateType>(null)
    const [title, setTitle] = useState<string>('')
    const [taskTitle, setTaskTitle] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')
    const [error, setError] = useState<string>('') //add error

    const getTodolists = () => {
        todolistAPI.getTodolists()
            .then(res => setState(res.data))
    }

    const addTodolist = () => {
        if(title != '') {
            todolistAPI.addTodolist(title)
                .then(res => setState([res.data.data.item,...state]))
            setTitle('')
        }
    }

    const deleteTodolist = () => {
        const todoId = todolistId

        todolistAPI.deleteTodolist(todoId)
            .then(res => {
                if (res.status === 200 && state) {
                    setState(state.filter(t => t.id != todoId))
                }
            })
            setTodolistId('')
    }

    const updateTodolist = () => {
        todolistAPI.updateTodolist(todolistId, title)
            .then(res => {
                if(res.status === 200) {
                    if(state) {
                        const todoUpdate = state.find(t => t.id === todolistId)
                        todoUpdate ? todoUpdate.title = title : setError('Not a todolist')
                        setState([...state])
                    }
                }
                setTitle('')
                setTodolistId('')
            })
    }

    const getTask = () => {
        tasksAPI.getTasks(todolistId)
            .then( res =>
                setTaskState(res.data.items)
            )
        setTodolistId('')
    }
    const addTask = () => {
        tasksAPI.addTask(todolistId, taskTitle)
            .then( res =>
                setTaskState([res.data.data.item, ...taskState])
            )
    }
    const deleteTask = () => {
        //удаляется по id таски, а с id туду - 405 ошибка
        const todoId = todolistId
        const tId = taskId
        tasksAPI.deleteTask(todoId, tId)
            .then(res => {
                if (taskState) {
                    setTaskState(taskState.filter(t => t.id != tId))
                }
            })
    }
    const updateTask = () => {
        //404 error
        const todoId = todolistId
        const tId = taskId
        tasksAPI.updateTaskTitle(todoId, tId, taskTitle)
            .then(res => {
                console.log(res)
            })
    }



    return <div>
        {/*<div>{JSON.stringify(state)}</div><br/>*/}
        <div>{state
            ? state.map(t => <div key={t.id}>{JSON.stringify(t)}</div>)
            : 'No todolists' }
        </div>
        <br/>
        <div>
            <div>
                <input placeholder='titleTodolist' value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
                <input placeholder='todolistId' value={todolistId} onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            </div>
            <div>
                <button onClick={getTodolists}>Get todolists</button>
                <button onClick={addTodolist}>Add todolist</button>
                <button onClick={deleteTodolist}>Delete todolist</button>
                <button onClick={updateTodolist}>Update todolist</button>
            </div>
        </div>
        <br/>
        <div>
            {<div>
                { taskState
                    ? taskState.map( t => <div key={t.id}>{JSON.stringify(t)}</div>)
                    : 'No tasks'
                }
            </div>}
            <div>
                <input placeholder='titleTask' value={taskTitle} onChange={(e) => setTaskTitle(e.currentTarget.value)}/>
                <input placeholder='taskId' value={taskId} onChange={(e) => setTaskId(e.currentTarget.value)}/>
            </div>
            <div>
                <button onClick={getTask}>Get tasks</button>
                <button onClick={addTask}>Add task</button>
                <button onClick={deleteTask}>Delete task</button>
                <button onClick={updateTask}>Update task</button>
            </div>
        </div>
    </div>
}