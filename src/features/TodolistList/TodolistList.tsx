import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import React, {useCallback, useEffect} from "react";
import {FilterValuesType, TasksStateType, TodolistDomainType} from "../../app/AppWithRedux";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../state/store";
import {StatusType} from "../../state/app-reducer";
import {
    addTodolistThunkAC,
    changeTodolistFilterAC, changeTodolistTitleThunkAC,
    fetchTodolistsThunkAC,
    removeTodolistThunkAC
} from "../../state/todolists-reducer";
import {addTaskThunkAC, removeTaskThunkAC, updateTaskThunkAC} from "../../state/tasks-reducer";
import {TaskStatuses} from "../../api/API";

type TodolistListPropsType = {
    demo: boolean
}

export const TodolistList = React.memo((props: TodolistListPropsType) => {
    console.log("TodolistList is called")

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const appTaskStatus = useSelector<AppRootStateType, StatusType>(s => s.app.appTaskStatus)
    const dispatch = useDispatch();

    useEffect(() => {
        if(props.demo) {
            return
        }
        dispatch(fetchTodolistsThunkAC())
    }, [])

    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatch(removeTaskThunkAC(todolistId, id))
    }, [])
    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(addTaskThunkAC(todolistId, title))
    }, [])
    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskThunkAC(id, { status: status }, todolistId))
    }, [])
    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        dispatch(updateTaskThunkAC(id, { title: newTitle }, todolistId))
    }, [])
    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, [])
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistThunkAC(title))
    }, [])
    const removeTodolist = useCallback((id: string) => {
        dispatch(removeTodolistThunkAC(id))
    }, [])
    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(changeTodolistTitleThunkAC(id, title))
    }, [])


    return(<div>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={addTodolist} disabled={false}/>
        </Grid>

        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id];
                    let tasksForTodolist = allTodolistTasks;

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: "10px"}}>
                            <Todolist
                                todolist={tl}
                                tasks={tasksForTodolist}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                appTaskStatus={appTaskStatus}
                                demo={props.demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </div>)
})