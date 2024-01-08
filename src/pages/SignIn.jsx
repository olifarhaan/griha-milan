import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router";
import OAuth from "../components/OAuth";
import { fetchSignInMethodsForEmail, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify"
import login from '../assets/jpg/login.jpg'




const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const { email, password } = { ...formData };
  const formChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const [showPassword, setShowPassword] = useState(false);
  const onFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);

      if (userCredentials.user) {
        toast.success("Sign in successful");
        navigate("/")
      }

    } catch (error) {
      const code = error.code.toString();
      if (code === 'auth/user-not-found') toast.error("User not found");
      else if (code === 'auth/wrong-password') {
        await fetchSignInMethodsForEmail(auth, email).then(function (result) {
          if (result) {
            result[0] === 'google.com' && toast.error("You have to sign in using Google")
          }
          else {
            toast.error("Invalid email/password");
          }
        })
      }
      else if (code === 'auth/user-disabled') toast.error("User is disabled");
      else if (code === 'auth/network-request-failed') toast.error("Check your internet connection");
      else if (code === 'auth/too-many-requests') toast.error("Try logging after some time");
      else toast.error("Something went wrong");
    }
    setLoading(false);

  }
  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold text-heading">Sign In</h1>
      <div className="flex justify-center items-center flex-wrap py-12 px-6 gap-16 max-w-6xl mx-auto">
        <div className="lg:w-[50%]">
          <img src={login} alt="" className="rounded-2xl" />
        </div>
        <div className="w-full lg:w-[40%]">
          <form onSubmit={onFormSubmit} className="flex flex-col gap-4">
            <input className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="email" id="email" placeholder="Enter your email" value={email} onChange={formChange} />
            <div className="relative">
              <input className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type={showPassword ? "text" : "password"} id="password" placeholder="Enter your password" value={password} onChange={formChange} minLength={6} />
              {showPassword ? <FaEyeSlash className="absolute right-3 top-3 text-2xl text-gray-700 cursor-pointer transition ease-in-out" onClick={() => setShowPassword(false)} /> : <FaEye onClick={() => setShowPassword(true)} className="absolute right-3 top-3 text-2xl text-gray-700 cursor-pointer transition ease-in-out" />}
            </div>
            <div className="flex flex-wrap justify-between text-sm sm:text-lg">
              <div> Don't have an account? <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/sign-up')}>Register</span></div>
              <div className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/forgot-password')}> Forgot Password? </div>
            </div>
            <div>
              <button type="submit" className={`w-full bg-primary hover:bg-primaryHover text-white rounded-md py-3 uppercase transition duration-200 ease-in-out active:bg-primaryHover hover:shadow-lg active:shadow-lg ${loading ? "opacity-50" : 'opacity-100'} disabled:${loading}`}>{loading ? "Signing In ..." : "Sign In"}</button>
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

export default SignIn