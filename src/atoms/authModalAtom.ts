import {atom} from 'recoil'


export interface AuthModalState{
    open:boolean;
    view:'login' | 'signup' | 'resetPassword'
}
export interface HomeNavigation{
 
    view:'diendan' | 'khoahoc'
}

const defaulModalState:AuthModalState={
    open:false,
    view:'login'
}
const defaultNavigation:HomeNavigation={
    view:'diendan'
}

export const homeNavigation = atom<HomeNavigation>({
    key:'homeNavigation',
    default:defaultNavigation
})
export const authModalState = atom<AuthModalState>({
    key:'authModalState',
    default: defaulModalState,
})