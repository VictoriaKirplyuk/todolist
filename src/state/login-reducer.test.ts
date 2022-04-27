import {loginReducer, loginStateType, setIsLoggedInAC} from './login-reducer'

let startState: loginStateType

beforeEach(()=> {
    startState = {
        isLoggedIn: false
    }
})

test('authorization of the specified app must be changed', () => {
    const action = setIsLoggedInAC(true)

    const endState = loginReducer(startState, action)

    expect(endState.isLoggedIn).toBe(true)
})