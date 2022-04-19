import React from 'react';
import './App.css';
import {
    AppBar,
    Button,
    Container,
    LinearProgress,
    IconButton,
    Toolbar,
    Typography
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {useSelector} from 'react-redux';
import {AppRootStateType} from '../state/store';
import {ItemTaskType, TodolistType} from "../api/API";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {StatusType} from "../state/app-reducer";
import {TodolistList} from "../features/TodolistList/TodolistList";

export type FilterValuesType = "all" | "active" | "completed";

export type TasksStateType = {
    [key: string]: Array<ItemTaskType>
}

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: StatusType
}

type AppWithReduxPropsType = {
    demo: boolean
}

function AppWithRedux(props: AppWithReduxPropsType) {
    console.log("App is called")

    const status = useSelector<AppRootStateType, StatusType>(s => s.app.appStatus)

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
            {status === 'loading' && <LinearProgress/>}
            <Container fixed>
                <TodolistList demo={props.demo}/>
            </Container>
            <ErrorSnackbar/>
        </div>
    )
}

export default AppWithRedux;