import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";

type PropsTaskType = {
    removeTask: (taskId: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    taskId: string
    todolistId: string
    isDone: boolean
    title: string
    // можно было написать t: TaskType
}

const Task = React.memo((props: PropsTaskType) => {

    const onClickHandler = () => props.removeTask(props.taskId, props.todolistId)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        props.changeTaskStatus(props.taskId, newIsDoneValue, props.todolistId);
    }

    const onTitleChangeHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.taskId, newValue, props.todolistId);
    }, [props.changeTaskTitle, props.taskId, props.todolistId])

    return <div key={props.taskId} className={props.isDone ? "is-done" : ""}>
            <Checkbox
                checked={props.isDone}
                color="primary"
                onChange={onChangeHandler}
            />

            <EditableSpan value={ props.title} onChange={onTitleChangeHandler} />
            <IconButton onClick={onClickHandler}>
                <Delete />
            </IconButton>
        </div>
})

export default Task;