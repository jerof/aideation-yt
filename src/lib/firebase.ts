// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "aideation-yt-40f16.firebaseapp.com",
  projectId: "aideation-yt-40f16",
  storageBucket: "aideation-yt-40f16.appspot.com",
  messagingSenderId: "157365062017",
  appId: "1:157365062017:web:a37dbc78f57bbac60a4080"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app)

export async function uploadFileToFirebase(image_url: string, name: string) {
  try {
    const response = await fetch(image_url)
    const buffer = await response.arrayBuffer()
    const file_name = name.replace(' ', '') + Date.now + '.jpeg'
    const storageRef = ref(storage, file_name)
    await uploadBytes(storageRef, buffer, {
      contentType: "image/jpeg"
    })
    const firebase_url = await getDownloadURL(storageRef)
    console.log(firebase_url)
    return firebase_url
  } catch (error) {
      console.error(error)
  }
}