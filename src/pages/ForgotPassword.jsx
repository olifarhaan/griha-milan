import { useState } from "react"
import { useNavigate } from "react-router";
import OAuth from "../components/OAuth";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify"
import forgotPassword from '../assets/jpg/forgotPassword.jpg'



const ForgotPassword = () => {
  const auth = getAuth()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: ''
  })
  const { email } = { ...formData };
  const formChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Email sent successfully");
      navigate("/")

    } catch (error) {
      console.log(error.code)
      if (error.code === "auth/user-not-found") toast.error("Email does not exist");
      else if (error.code === 'auth/user-disabled') toast.error("User is disabled");
      else if (error.code === 'auth/network-request-failed') toast.error("Check your internet connection");
      else if (error.code === 'auth/too-many-requests') toast.error("Try logging after some time");
      else toast.error("Something went wrong");
    }
  }

  return (
    <section>
      <h1 className="text-3xl text-center mt-6 font-bold text-heading">Change Your Password</h1>
      <div className="flex justify-center items-center flex-wrap py-12 px-6 gap-16 max-w-6xl mx-auto">
        <div className="lg:w-[50%]">
          <img src={forgotPassword} alt="" className="rounded-2xl" />
        </div>
        <div className="w-full lg:w-[40%]">
          <form onSubmit={onFormSubmit} className="flex flex-col gap-4">
            <input className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="email" id="email" placeholder="Enter your email" value={email} onChange={formChange} />

            <div className="flex flex-wrap justify-between text-sm sm:text-lg">
              <div> Don't have an account? <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate('/sign-up')}>Register</span></div>
              <div className="text-blue-600 cursor-pointer hover:underline" onClick={() => navigate('/sign-in')}> Sign in instead </div>
            </div>
            <div>
              <button type="submit" className="w-full bg-primary hover:bg-primaryHover text-white rounded-md py-3 uppercase transition duration-200 ease-in-out active:bg-primaryHover hover:shadow-lg active:shadow-lg"> Send reset email</button>
            </div>
            <div className="flex items-center before:border-t-[1px] before:flex-1 after:border-t-[1px] after:flex-1">
              <p className="text-center font-semibold mx-2 text-heading">OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword