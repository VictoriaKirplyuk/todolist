import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses} from "./ApiComponent";

type PropsTaskType = {
    removeTask: (taskId: string, todolistId: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    taskId: string
    todolistId: string
    status: TaskStatuses
    title: string
}

const Task = React.memo((props: PropsTaskType) => {

    const onClickHandler = () => props.removeTask(props.taskId, props.todolistId)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        props.changeTaskStatus(props.taskId, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, props.todolistId);
    }

    const onTitleChangeHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.taskId, newValue, props.todolistId);
    }, [props.changeTaskTitle, props.taskId, props.todolistId])

    return <div key={props.taskId} className={props.status === TaskStatuses.Completed ? "is-done" : ""}>
            <Checkbox
                checked={props.status === TaskStatuses.Completed}
                color="primary"
                onChange={onChangeHandler}
            />

            <EditableSpan value={props.title} onChange={onTitleChangeHandler} />
            <IconButton onClick={onClickHandler}>
                <Delete />
            </IconButton>
        </div>
})

export default Task;