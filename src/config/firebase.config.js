// Import the functions you need from the SDKs you need
import { initializeApp, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgr0sJQ5JZ3CD6HZoiZwH9TcdzWeudK4w",
  authDomain: "movie-logger-32c2b.firebaseapp.com",
  projectId: "movie-logger-32c2b",
  storageBucket: "movie-logger-32c2b.appspot.com",
  messagingSenderId: "292221432549",
  appId: "1:292221432549:web:cdc89e9636e95e82031a0c"
};

// Initialize Firebase
let app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export let auth;

// Initialize Cloud Firestore and get a reference to the service
export let db;
export let functions;

// Cloud function endpoints
export let search_api;
export let movie_api;
export let now_playing_api;
export let popular_api;
export let upcoming_api;

if (process.env.NODE_ENV === "development") {
  db = getFirestore();
  connectFirestoreEmulator(db, '127.0.0.1', 8080)

  functions = getFunctions(getApp());
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);

  auth = getAuth();
  connectAuthEmulator(auth, "http://127.0.0.1:9099");

  search_api = 'http://127.0.0.1:5001/movie-logger-32c2b/us-central1/search';
  movie_api = 'http://127.0.0.1:5001/movie-logger-32c2b/us-central1/movie';
  now_playing_api = 'http://127.0.0.1:5001/movie-logger-32c2b/us-central1/now_playing';
  popular_api = 'http://127.0.0.1:5001/movie-logger-32c2b/us-central1/popular';
  upcoming_api = 'http://127.0.0.1:5001/movie-logger-32c2b/us-central1/upcoming';
} else {
  db = getFirestore(app);
  auth = getAuth(app);

  search_api = 'https://search-hvgk5xclmq-uc.a.run.app/';
  movie_api = 'https://movie-hvgk5xclmq-uc.a.run.app/';
  now_playing_api = 'https://now-playing-hvgk5xclmq-uc.a.run.app';
  popular_api = 'https://popular-hvgk5xclmq-uc.a.run.app';
  upcoming_api = 'https://upcoming-hvgk5xclmq-uc.a.run.app';
}
