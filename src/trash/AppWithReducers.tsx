import React, {useReducer} from 'react';
import '../app/App.css';
import {v1} from 'uuid';
import {
    AppBar,
    Button,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    todolistsReducer
} from '../state/todolists-reducer';
import {removeTaskAC, tasksReducer, updateTaskAC} from '../state/tasks-reducer';
import {ItemTaskType, TaskStatuses} from "../api/API";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {StatusType} from "../state/app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {TodolistList} from "../features/TodolistList/TodolistList";

export type FilterValuesType = "all" | "active" | "completed";

export type TasksStateType = {
    [key: string]: Array<ItemTaskType>
}

type AppWithReducersPropsType = {
    demo: boolean
}

function AppWithReducers(props:AppWithReducersPropsType) {
    let todolistId1 = v1();
    let todolistId2 = v1();

    const status = useSelector<AppRootStateType, StatusType>(s => s.app.appStatus)

    let [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'},
        {id: todolistId2, title: "What to buy", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'}
    ])

    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistId1]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, description: '',
                todoListId: todolistId1, order: 0, priority: 0, startDate: '', deadline: '', addedDate: ''},
            {id: v1(), title: "JS", status: TaskStatuses.Completed, description: '',
                todoListId: todolistId1, order: 0, priority: 0, startDate: '', deadline: '', addedDate: ''}
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", status: TaskStatuses.Completed, description: '',
                todoListId: todolistId2, order: 0, priority: 0, startDate: '', deadline: '', addedDate: ''},
            {id: v1(), title: "React Book", status: TaskStatuses.Completed, description: '',
                todoListId: todolistId2, order: 0, priority: 0, startDate: '', deadline: '', addedDate: ''}
        ]
    });

    function removeTask(id: string, todolistId: string) {
        const action = removeTaskAC(id, todolistId);
        dispatchToTasks(action);
    }

    function addTask(title: string, todolistId: string) {
        //different logic
    }

    function changeStatus(id: string, status: TaskStatuses, todolistId: string) {
        const action = updateTaskAC(id, { status: status }, todolistId);
        dispatchToTasks(action);
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        const action = updateTaskAC(id, { title: newTitle }, todolistId);
        dispatchToTasks(action);
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatchToTodolists(action);
    }

    function removeTodolist(id: string) {
        const action = removeTodolistAC(id);
        dispatchToTasks(action);
        dispatchToTodolists(action);
    }

    function changeTodolistTitle(id: string, title: string) {
        const action = changeTodolistTitleAC(id, title);
        dispatchToTodolists(action);
    }

    function addTodolist(title: string) {
        //different logic
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
                <TodolistList demo={props.demo}/>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
}

export default AppWithReducers;
