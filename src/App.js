import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import Category from "./pages/Category";
import EditListing from "./pages/EditListing";
import NotFound404 from "./pages/NotFound404";
import Listing from "./pages/Listing";
import Properties from "./pages/Properties";
import { Offline, Online } from "react-detect-offline";
import NoInternet from "./pages/NoInternet";
import About from "./pages/About";
import ContactForm from "./pages/ContactForm";



function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <Header />
        <Online>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="/create-listing" element={<PrivateRoute />}>
              <Route path="/create-listing" element={<CreateListing />} />
            </Route>

            <Route path="/edit-listing" element={<PrivateRoute />}>
              <Route path="/edit-listing/:id" element={<EditListing />} />
            </Route>

            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactForm />} />


            <Route path="/all" element={<Properties />} />
            <Route path="/category/:type/:id" element={<Listing />} />
            <Route path="/category/:type" element={<Category />} />

            <Route path="/offers" element={<Offers />} />
            <Route path="*" element={<NotFound404 />} />
          </Routes>
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </Online>

        <Offline>
          <NoInternet />
        </Offline>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
