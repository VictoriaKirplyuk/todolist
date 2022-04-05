import React, {useState} from 'react'
import {API} from "./API";


type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number

}

type StateType = Array<TodolistType> | null

export const ApiComponent = () => {


    const [state, setState] = useState<StateType>(null)
    const [title, setTitle] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')

    const getTodolists = () => {
        API.getTodolists()
            .then(res => setState(res.data))
    }

    const addTodolist = () => {
        API.addTodolist(title)
            .then(res => setState([res.data.data.item,...state]))
        setTitle('')
    }

    const deleteTodolist = () => {
        const todoId = todolistId

        API.deleteTodolist(todoId)
            .then(res => {
                if (res.status === 200 && state) {
                    setState(state.filter(t => t.id != todoId))
                }
            })
            setTodolistId('')
    }

    return <div>
        {/*<div>{JSON.stringify(state)}</div><br/>*/}
        <div>{state
            ? state.map(t => <div key={t.id}>{JSON.stringify(t)}</div>)
            : null}
        </div>
        <br/>
        <div>
            <input placeholder='title todolist' value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
            <input placeholder='todolistId' value={todolistId} onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input placeholder='taskId' value={taskId} onChange={(e) => setTaskId(e.currentTarget.value)}/>
        </div>
        <div>
            <button onClick={getTodolists}>Get todolists</button>
            <button onClick={addTodolist}>Add todolist</button>
            <button onClick={deleteTodolist}>Delete todolist</button>
        </div>
    </div>
}