import {appReducer, AppStateType, setAppErrorAC, setAppStatusAC, setAppTaskStatusAC} from "./app-reducer";

let startState: AppStateType

beforeEach(() => {
    startState = {
        appStatus: 'idle',
        appTaskStatus: 'idle',
        appError: null,
        isAuth: false
    }
});

test('Status of app should be changed', () => {
    const action = setAppStatusAC('succeeded')

    const endState = appReducer(startState, action)

    expect(endState.appStatus).toBe('succeeded')
    expect(endState.appTaskStatus).toBe('idle')
});

test('Status of the specified app task must be changed', () => {
    const action = setAppTaskStatusAC('failed')

    const endState = appReducer(startState, action)

    expect(endState.appTaskStatus).toBe('failed')
    expect(endState.appStatus).toBe('idle')
});

test('Error of the specified app must be changed', () => {
    const action = setAppErrorAC('Error getting data')

    const endState = appReducer(startState, action)

    expect(endState.appError).toBe('Error getting data')
    expect(endState.appStatus).toBe('idle')
    expect(endState.appTaskStatus).toBe('idle')
});