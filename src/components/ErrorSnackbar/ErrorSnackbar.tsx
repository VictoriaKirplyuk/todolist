import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {forwardRef} from "react";
import {AppRootStateType} from "../../state/store";
import {useDispatch, useSelector} from "react-redux";
import {AppErrorType, setAppErrorAC} from "../../state/app-reducer";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function ErrorSnackbar() {

    const dispatch = useDispatch()

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAppErrorAC(null))
    };
    const error = useSelector<AppRootStateType, AppErrorType>(s => s.app.appError)
    const isOpen = error != null

    return (
        <Stack spacing={2} sx={{width: '100%'}}>
            <Snackbar open={isOpen} autoHideDuration={5000} onClose={handleClose}>
                <Alert severity="error" sx={{width: '100%'}} onClose={handleClose}>
                    {error}
                </Alert>
            </Snackbar>
        </Stack>
    );
}