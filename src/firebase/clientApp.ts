// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import {getFirestore,doc,getDoc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {getStorage} from 'firebase/storage'


const firebaseConfig = {
  apiKey: 'AIzaSyBf2RTpf2KomTnlhks9-mzVtDPxGeBLW1k',
  authDomain: "mangxhht.firebaseapp.com",
  projectId: "mangxhht",
  storageBucket: "mangxhht.appspot.com",
  messagingSenderId:"1034189569140",
  appId: "1:1034189569140:web:503eb9d0a6bcbeaa902521",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const firestore = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)
const db = getFirestore();

export const getData = async ()=>{


  const docRef = doc(db,'post','postid1');
  const docSnap = await getDoc(docRef)
  return docSnap.data()
  const comment = docSnap.data()
}

export {app,firestore,auth,storage,db}
