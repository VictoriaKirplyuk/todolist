import React, {useCallback, useEffect} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC, fetchTodolistsThunkAC,
    removeTodolistAC,
} from './state/todolists-reducer';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from './state/tasks-reducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './state/store';
import {ItemTaskType, TaskStatuses, todolistAPI, TodolistType} from "./API";

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
        const action = removeTaskAC(id, todolistId);
        dispatch(action);
    }, [])

    const addTask = useCallback((title: string, todolistId: string) => {
        const action = addTaskAC(title, todolistId);
        dispatch(action);
    }, [])

    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        const action = changeTaskStatusAC(id, status, todolistId);
        dispatch(action);
    }, [])

    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        const action = changeTaskTitleAC(id, newTitle, todolistId);
        dispatch(action);
    }, [])

    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, [])

    const removeTodolist = useCallback((id: string) => {
        const action = removeTodolistAC(id);
        dispatch(action);
    }, [])

    const changeTodolistTitle = useCallback((id: string, title: string) => {
        const action = changeTodolistTitleAC(id, title);
        dispatch(action);
    }, [])


    const addTodolist = useCallback((title: string) => {
        const action = addTodolistAC(title);
        dispatch(action);
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