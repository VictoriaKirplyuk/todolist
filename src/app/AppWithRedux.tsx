import React, {useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    Container,
    LinearProgress,
    IconButton,
    Toolbar,
    Typography, CircularProgress
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../state/store';
import {ItemTaskType, TodolistType} from "../api/API";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {setIsAuthTC, StatusType} from "../state/app-reducer";
import {TodolistList} from "../features/TodolistList/TodolistList";
import {
    Routes,
    Route
} from "react-router-dom";
import {Login} from "../features/Login/Login";

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
    const isAuth = useSelector<AppRootStateType, boolean>(s => s.app.isAuth)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setIsAuthTC())
    }, [])

    if (!isAuth) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

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
                <Routes>
                    <Route path='/' element={<TodolistList demo={props.demo}/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                </Routes>
            </Container>
            <ErrorSnackbar/>
        </div>
    )
}

export default AppWithRedux;