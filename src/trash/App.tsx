import React, {useState} from 'react';
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
import {FilterValuesType, TodolistDomainType} from "../app/AppWithRedux";
import {ItemTaskType, TaskStatuses} from "../api/API";
import {useSelector} from "react-redux";
import {AppRootStateType} from "../state/store";
import {StatusType} from "../state/app-reducer";
import {TodolistList} from "../features/TodolistList/TodolistList";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";

export type TasksStateType = {
    [key: string]: Array<ItemTaskType>
}

type AppPropsType = {
    demo: boolean
}

function App(props:AppPropsType) {
    let todolistId1 = v1();
    let todolistId2 = v1();

    const status = useSelector<AppRootStateType, StatusType>(s => s.app.appStatus)

    let [todolists, setTodolists] = useState<Array<TodolistDomainType>>([
        {id: todolistId1, title: "What to learn", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'},
        {id: todolistId2, title: "What to buy", filter: "all", addedDate: '', order: 0, entityStatus: 'idle'}
    ])

    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistId1]: [
            {
                id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, description: '',
                todoListId: todolistId1, order: 0, priority: 0, startDate: '', deadline: '', addedDate: ''
            },
            {
                id: v1(), title: "JS", status: TaskStatuses.Completed, description: '',
                todoListId: todolistId1, order: 0, priority: 0, startDate: '', deadline: '', addedDate: ''
            }
        ],
        [todolistId2]: [
            {
                id: v1(), title: "Milk", status: TaskStatuses.Completed, description: '',
                todoListId: todolistId2, order: 0, priority: 0, startDate: '', deadline: '', addedDate: ''
            },
            {
                id: v1(), title: "React Book", status: TaskStatuses.Completed, description: '',
                todoListId: todolistId2, order: 0, priority: 0, startDate: '', deadline: '', addedDate: ''
            }
        ]
    });

    function removeTask(id: string, todolistId: string) {
        //достанем нужный массив по todolistId:
        let todolistTasks = tasks[todolistId];
        // перезапишем в этом объекте массив для нужного тудулиста отфилтрованным массивом:
        tasks[todolistId] = todolistTasks.filter(t => t.id != id);
        // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
        setTasks({...tasks});
    }

    function addTask(title: string, todolistId: string) {
        let task = {
            id: v1(), title: title, status: TaskStatuses.New, description: '', todoListId: todolistId,
            order: 0, priority: 0, startDate: '', deadline: '', addedDate: ''
        };
        //достанем нужный массив по todolistId:
        let todolistTasks = tasks[todolistId];
        // перезапишем в этом объекте массив для нужного тудулиста копией, добавив в начало новую таску:
        tasks[todolistId] = [task, ...todolistTasks];
        // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
        setTasks({...tasks});
    }

    function changeStatus(id: string, status: TaskStatuses, todolistId: string) {
        //достанем нужный массив по todolistId:
        let todolistTasks = tasks[todolistId];
        // найдём нужную таску:
        let task = todolistTasks.find(t => t.id === id);
        //изменим таску, если она нашлась
        if (task) {
            task.status = status;
            // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
            setTasks({...tasks});
        }
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        //достанем нужный массив по todolistId:
        let todolistTasks = tasks[todolistId];
        // найдём нужную таску:
        let task = todolistTasks.find(t => t.id === id);
        //изменим таску, если она нашлась
        if (task) {
            task.title = newTitle;
            // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
            setTasks({...tasks});
        }
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        let todolist = todolists.find(tl => tl.id === todolistId);
        if (todolist) {
            todolist.filter = value;
            setTodolists([...todolists])
        }
    }

    function removeTodolist(id: string) {
        // засунем в стейт список тудулистов, id которых не равны тому, который нужно выкинуть
        setTodolists(todolists.filter(tl => tl.id != id));
        // удалим таски для этого тудулиста из второго стейта, где мы храним отдельно таски
        delete tasks[id]; // удаляем св-во из объекта... значением которого являлся массив тасок
        // засетаем в стейт копию объекта, чтобы React отреагировал перерисовкой
        setTasks({...tasks});
    }

    function changeTodolistTitle(id: string, title: string) {
        // найдём нужный todolist
        const todolist = todolists.find(tl => tl.id === id);
        if (todolist) {
            // если нашёлся - изменим ему заголовок
            todolist.title = title;
            setTodolists([...todolists]);
        }
    }

    function addTodolist(title: string) {
        let newTodolistId = v1();
        let newTodolist: TodolistDomainType = {id: newTodolistId, title: title, filter: 'all', addedDate: '', order: 0, entityStatus: 'idle'};
        setTodolists([newTodolist, ...todolists]);
        setTasks({
            ...tasks,
            [newTodolistId]: []
        })
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

export default App;
