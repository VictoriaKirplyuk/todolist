import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from '../features/Todolists/Todolist';
import {AddItemForm} from '../components/AddItemForm/AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    addTodolistThunkAC,
    changeTodolistFilterAC,
    changeTodolistTitleThunkAC,
    fetchTodolistsThunkAC,
    removeTodolistThunkAC,
} from '../state/todolists-reducer';
import {
    addTaskThunkAC,
    updateTaskThunkAC,
    removeTaskThunkAC
} from '../state/tasks-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../state/store';
import {ItemTaskType, TaskStatuses, TodolistType} from "../api/API";

export type FilterValuesType = "all" | "active" | "completed";

export type TasksStateType = {
    [key: string]: Array<ItemTaskType>
}

export type TodolistDomenType = TodolistType & {
    filter: FilterValuesType
}

function AppWithRedux() {
    console.log("App is called")

    const todolists = useSelector<AppRootStateType, Array<TodolistDomenType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const dispatch = useDispatch();

    useEffect(() => {
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


    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>

                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];
                            let tasksForTodolist = allTodolistTasks;

                            return <Grid item key={tl.id}>
                                <Paper style={{padding: "10px"}}>
                                    <Todolist
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasksForTodolist}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    )
}

export default AppWithRedux;