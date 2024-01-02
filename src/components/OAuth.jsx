import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";


const OAuth = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    const navigate = useNavigate();

    const onGoogleClick = async () => {

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(user)
            //Check if user is in the firestore or not
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                await setDoc(docRef, {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                });
            } 
            toast.success("Sign In Successful")
            navigate("/");

        } catch (error) {
            if(error.code==='auth/email-already-exists') toast.error("Email already exists, Sign In")
            else if(error.code==='auth/too-many-requests') toast.error("Try later, too many requests")
            else if(error.code==='auth/invalid-email') toast.error("Invalid email")
            else toast.error("Something went wrong")
        }

    }

    return (
        <button type="button" onClick={onGoogleClick} className="flex justify-center items-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white rounded-md py-3 uppercase transition duration-200 ease-in-out active:bg-red-900 hover:shadow-lg active:shadow-lg">
            <FcGoogle className="bg-white rounded-full text-xl" />
            Continue With Google
        </button>
    )
}

export default OAuth