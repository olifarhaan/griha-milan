import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
import OAuth from "../components/OAuth";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify"
import signUp from '../assets/jpg/signUp.jpg'


const SignUp = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const { name, email, password } = { ...formData };
    const formChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const [showPassword, setShowPassword] = useState(false);

    const onFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const auth = getAuth();
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

            console.log(userCredentials);
            updateProfile(auth.currentUser, {
                displayName: name,
            })
            const user = userCredentials.user;

            const formDataWithoutPassword = { ...formData };
            delete formDataWithoutPassword.password;
            formDataWithoutPassword.timestamp = serverTimestamp();
            await setDoc(doc(db, "users", user.uid), formDataWithoutPassword);
            toast.success("Sign Up Successful");
            navigate("/");
        }
        catch (error) {
            console.log(error)
            if (error.code === "auth/invalid-email") toast.error("Invalid email! Enter a valid email");
            else if (error.code === 'auth/user-disabled') toast.error("This email is disabled");
            else if (error.code === 'auth/network-request-failed') toast.error("Check your internet connection");
            else if (error.code === 'auth/too-many-requests') toast.error("Try logging after some time");
            else toast.error("Something went wrong");
        }
        setLoading(false)
    }

    return (
        <section>
            <h1 className="text-3xl text-center mt-6 font-bold text-heading">Sign Up</h1>
            <div className="flex justify-center items-center flex-wrap py-12 px-6 gap-16 max-w-6xl mx-auto">
                <div className="lg:w-[50%]">
                    <img src={signUp} alt="" className="rounded-2xl" />
                </div>
                <div className="w-full lg:w-[40%]">
                    <form onSubmit={onFormSubmit} className="flex flex-col gap-4">
                        <input className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="text" id="name" placeholder="Enter your name" value={name} onChange={formChange} autoComplete="name" required />
                        <input className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="email" id="email" placeholder="Enter your email" value={email} onChange={formChange} autoComplete="email" required />
                        <div className="relative">
                            <input className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type={showPassword ? "text" : "password"} id="password" placeholder="Enter your password" value={password} onChange={formChange} required />
                            {showPassword ? <FaEyeSlash className="absolute right-3 top-3 text-2xl text-gray-700 cursor-pointer transition ease-in-out" onClick={() => setShowPassword(false)} /> : <FaEye onClick={() => setShowPassword(true)} className="absolute right-3 top-3 text-2xl text-gray-700 cursor-pointer transition ease-in-out" />}
                        </div>
                        <div className="flex flex-wrap justify-between text-sm sm:text-lg">
                            <div> Already have an account? <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/sign-in')}>Sign In</span></div>
                            <div className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/forgot-password')}> Forgot Password? </div>
                        </div>
                        <div>
                            <button type="submit" className={`w-full bg-primary hover:bg-primaryHover text-white rounded-md py-3 uppercase transition duration-200 ease-in-out active:bg-primaryHover hover:shadow-lg active:shadow-lg disabled:${loading}`}>{loading ? "Signing Up ..." : "Sign Up"}</button>
                        </div>
                        <div className="flex items-center before:border-t-[1px] before:flex-1 after:border-t-[1px] after:flex-1">
                            <p className="text-center font-semibold mx-2">OR</p>
                        </div>
                        <OAuth />
                    </form>
                </div>
            </div>
        </section>
    )
}

export default SignUp