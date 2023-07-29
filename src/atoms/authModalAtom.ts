import { DocumentData } from 'firebase/firestore';
import {atom} from 'recoil'


export interface AuthModalState{
    open:boolean;
    view:'login' | 'signup' | 'resetPassword'
}
export interface PostModalState{
    open:boolean;
}
export interface HomeNavigation{
 
    view:'diendan' | 'khoahoc'
}
export interface CourseCreateImage{
    image:[],
}
export interface CourseCreateAnswer{
    answer:[],
}

export interface FinishModalState{
    open:boolean;
}
export interface ProfileModalState{
    open:boolean;
  //  otherData:DocumentData | string
}
export interface ListModalState{
    open:boolean
    otherData:DocumentData |null
}

interface Comment{
    text:string,
    user:string,
    image:string,
}

export interface Post{
    author:string,
    comment:Comment[]
    content:string,
    date:string,
    id:string,
    like:string,
    title:string,
    imagePost:string
}
export interface CourseCreateModaleState{
    open:boolean;
}
const defaultCourseCreateModalState={
    open:false
}
const defaultProfileModalState:ProfileModalState ={
    open:false,
   
   // otherData: ''
}
const defaultListModalState:ListModalState = {
    open:false,
    otherData: null
}

const defaultModalState:AuthModalState={
    open:false,
    view:'login'
}
const defaultNavigation:HomeNavigation={
    view:'diendan'
}
const defaultPost:Post={
    author:'',
    comment:[],
    content:'',
    date:'',
    id:'',
    like:'',
    title:'',
    imagePost:''
}


const defaultPostModalState:PostModalState={
    open:false,
    
}
const defaultFinishModalState:FinishModalState={
    open:false
}

const defaultCourseCreateImage:CourseCreateImage={
    image:[],
    
}
const defaultCourseCreateAnswer:CourseCreateAnswer={
    answer:[]
}
export const courseCreateAnswer = atom<CourseCreateAnswer>({
    key:'courseCreateAnswer',
    default:defaultCourseCreateAnswer
})
export const courseCreateImage = atom<CourseCreateImage>({
    key:'courseCreateImage',
    default:defaultCourseCreateImage
})
export const homeNavigation = atom<HomeNavigation>({
    key:'homeNavigation',
    default:defaultNavigation
})
export const authModalState = atom<AuthModalState>({
    key:'authModalState',
    default: defaultModalState,
})

export const PostState = atom<Post>({
    key:'post',
    default:defaultPost
})

export const postModalState = atom<PostModalState>({
    key:'postModalState',
    default:defaultPostModalState
})

export const finishModalState = atom<PostModalState>({
    key:'finishModalState',
    default:defaultFinishModalState
})
export const courseCreateModalState = atom<CourseCreateModaleState>({
    key:'courseCreateModalState',
    default:defaultCourseCreateModalState
})
export const profileModalState = atom<ProfileModalState>({
    key:'profileModalState',
    default:defaultProfileModalState
})
export const listModalState = atom<ListModalState>({
    key:'listModalState',
    default:defaultListModalState
})