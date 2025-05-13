import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from './firebaseConfig';

const auth = getAuth(app);

export const loginComEmailESenha = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export default auth;