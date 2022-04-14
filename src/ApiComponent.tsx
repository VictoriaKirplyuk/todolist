import React, {useState} from 'react'
import {tasksAPI, TaskStateType, todolistAPI, StateType} from "./API";

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
        if (title != '') {
            todolistAPI.addTodolist(title)
                .then(res => setState([res.data.data.item, ...state]))
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
                if (res.status === 200) {
                    if (state) {
                        const todoUpdate = state.find(t => t.id === todolistId)
                        todoUpdate ? todoUpdate.title = title : setError('Not a todolist')
                        setState([...state])
                    }
                }
                setTitle('')
                setTodolistId('')
            })
    }
    const getTasks = () => {
        tasksAPI.getTasks(todolistId)
            .then(res => setTaskState(res.data))
    }
    const addTask = () => {
        tasksAPI.addTask(todolistId, taskTitle)
            .then(res =>
                taskState && setTaskState({...taskState, items: [res.data.data.item, ...taskState.items]}))
    }
    const deleteTask = () => {
        tasksAPI.deleteTask(todolistId, taskId)
            .then(res => {
                if (res.status === 200) {
                    taskState && setTaskState({...taskState, items: taskState.items.filter(t => t.id != taskId)})
                }
            })
    }
    const updateTask = () => {
        tasksAPI.updateTaskTitle(todolistId, taskId, taskTitle)
            .then(res => {
                if (res.status === 200) {
                    if (taskState) {
                        const taskUpdate = taskState.items.find(t => t.id === taskId)
                        taskUpdate ? taskUpdate.title = taskTitle : setError("No task")
                        setTaskState({...taskState})
                    }
                }
            })
            .catch(e => {
                console.log(e)
            })

    }


    return <div>
        <div>{state
            ? state.map(t => <div key={t.id}>{JSON.stringify(t)}</div>)
            : 'No todolists'}
        </div>
        <br/>
        <div>
            <div>
                <input placeholder='titleTodolist' value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
                <input placeholder='todolistId' value={todolistId}
                       onChange={(e) => setTodolistId(e.currentTarget.value)}/>
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
            <div>
                {taskState
                    ? taskState.items.map(t => <div key={t.id}>{JSON.stringify(t)}</div>)
                    : 'No tasks'
                }
            </div>
            <br/>
            <div>
                <input placeholder='titleTask' value={taskTitle} onChange={(e) => setTaskTitle(e.currentTarget.value)}/>
                <input placeholder='taskId' value={taskId} onChange={(e) => setTaskId(e.currentTarget.value)}/>
            </div>
            <div>
                <button onClick={getTasks}>Get tasks</button>
                <button onClick={addTask}>Add task</button>
                <button onClick={deleteTask}>Delete task</button>
                <button onClick={updateTask}>Update task</button>
            </div>
        </div>
    </div>
}