import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, setDoc, CollectionReference, serverTimestamp, query, orderBy, onSnapshot, Query, DocumentData, QuerySnapshot } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import { StorageReference, getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyC05TGXvCxLgIRwHIz3EHzjdcNzlNTYTZU",
  authDomain: "instagram-clone-reinaldo.firebaseapp.com",
  projectId: "instagram-clone-reinaldo",
  storageBucket: "instagram-clone-reinaldo.appspot.com",
  messagingSenderId: "205894192500",
  appId: "1:205894192500:web:1486a331c5533e1cdb7021",
  measurementId: "G-4VP41904C2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const dbCollection = (name: string) => collection(db, name);
const dbAdd = (ref: CollectionReference, id: string, object: Object) => setDoc(doc(ref, id), object);
const dbOrderBy = (ref: CollectionReference, prop: string) => query(ref, orderBy(prop, 'desc'));
const dbOnSnapshot = (query: Query<unknown, DocumentData>, action: ((snapshot: QuerySnapshot<unknown, DocumentData>) => void)) => onSnapshot(query, action)
const auth = getAuth(app);
const authCreate = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);
const authSignIn = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
const authUpdate = (user: User,
  { displayName, photoURL: photoUrl }: {
    displayName?: string | null | undefined;
    photoURL?: string | null | undefined;
  }) => updateProfile(user, { displayName, photoURL: photoUrl })
const storage = getStorage(app);
const storageRef = (location: string | undefined) => ref(storage, location);
const storagePut = (ref: StorageReference, data: File | Blob | Uint8Array | ArrayBuffer ) => uploadBytesResumable(ref, data)
const getURL = (ref: StorageReference) => getDownloadURL(ref)
const functions = getFunctions(app);

export {dbCollection, dbAdd, dbOrderBy, dbOnSnapshot, authCreate, authSignIn, authUpdate, storageRef, storagePut, getURL, functions, serverTimestamp}
