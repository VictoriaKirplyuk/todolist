import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from '../../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../components/EditableSpan/EditableSpan';
import {Button, IconButton} from '@material-ui/core';
import {Delete} from '@material-ui/icons';
import Task from "./Tasks/Task";
import {FilterValuesType} from "../../app/AppWithRedux";
import {ItemTaskType, TaskStatuses} from "../../api/API";
import {useDispatch} from "react-redux";
import {fetchTasksThunkAC} from "../../state/tasks-reducer";

type PropsType = {
    id: string
    title: string
    tasks: Array<ItemTaskType>
    removeTask: (taskId: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Todolist = React.memo((props: PropsType) => {

    console.log("Todolist is called")

    const dispatch = useDispatch()

    useEffect( () => {
        dispatch(fetchTasksThunkAC(props.id))
    } ,[])

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id);
    }, [])

    const removeTodolist = () => {
        props.removeTodolist(props.id);
    }

    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title);
    }, [props.changeTodolistTitle, props.id])

    const onAllClickHandler = useCallback(() => props.changeFilter("all", props.id), [props.changeFilter, props.id]);
    const onActiveClickHandler = useCallback(() => props.changeFilter("active", props.id), [props.changeFilter, props.id]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter("completed", props.id), [props.changeFilter, props.id]);

    let tasksForTodolist = props.tasks

    if (props.filter === "active") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New);
    }
    if (props.filter === "completed") {
        tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed);
    }

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                props.tasks && tasksForTodolist.map(t => {
                    return <Task key={t.id}
                                 title={t.title}
                                 taskId={t.id}
                                 status={t.status}
                                 todolistId={props.id}
                                 removeTask={props.removeTask}
                                 changeTaskStatus={props.changeTaskStatus}
                                 changeTaskTitle={props.changeTaskTitle}
                    />
                })
            }
        </div>
        <div style={{paddingTop: "10px"}}>
            <Button variant={props.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'default'}
            >All
            </Button>
            <Button variant={props.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


