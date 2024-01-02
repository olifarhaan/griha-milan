import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/svg/logo.svg"
import { MdMenuOpen } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import Button from "./Button";




const Header = () => {
    const myAccountRef = useRef();
    const mobileMenuRef = useRef();



    const menu = [
        {
            id: '1',
            name: 'Home',
            link: '/',
        },
        {
            id: '2',
            name: 'Properties',
            link: '/all',
        },
        {
            id: '3',
            name: 'Rent',
            link: '/category/rent',
        },
        {
            id: '4',
            name: 'Sale',
            link: '/category/sell',
        },
        {
            id: '5',
            name: 'Offers',
            link: '/offers',
        },
        {
            id: '6',
            name: 'About',
            link: '/about',
        },
        {
            id: '7',
            name: 'Contact',
            link: '/contact',
        }
    ]

    const location = useLocation();
    const navigate = useNavigate();
    const auth = getAuth();
    const [isSignedIn, setIsSignedIn] = useState(false);

    const checkPath = (path) => {
        // console.log(location.pathname, path);
        if (path === location.pathname) return true;
        else return false;
    }

    const onSignOut = () => {
        signOut(auth);
        navigate('/');
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) setIsSignedIn(true)
            else setIsSignedIn(false)
        })
    }, [auth, isSignedIn])

    const [showDropdown, setShowDropdown] = useState(false);
    const [showMobileMainDropdown, setShowMobileMainDropdown] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            if (!myAccountRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }

        if (showDropdown) {
            document.addEventListener("mousedown", handler);
        } else {
            document.removeEventListener("mousedown", handler);
        }
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, [showDropdown])

    useEffect(() => {
        const handler = (e) => {
            if (!mobileMenuRef.current.contains(e.target)) {
                console.log(mobileMenuRef)
                setShowMobileMainDropdown(false);
            }
        }

        if (showMobileMainDropdown) {
            document.addEventListener("mousedown", handler);
        } else {
            document.removeEventListener("mousedown", handler);
        }
        return () => {
            document.removeEventListener("mousedown", handler);
        }
    }, [showMobileMainDropdown])


    return (

        <nav className="sticky top-0 z-50 bg-white border-b-gray-300 shadow-sm rounded-[0px_0px_20px_20px]">
            <div className="px-3 max-w-6xl mx-auto">
                <div className="flex mx-auto justify-between">
                    {/* Primary menu and logo */}
                    <div className="flex items-center gap-16">
                        {/* logo */}
                        <div className="flex gap-2 items-center justify-center cursor-pointer py-3" onClick={() => navigate('/')}>
                            <img src={logo} alt="" className="h-12" />
                            <span className="text-paragraph text-3xl hidden sm:inline hover:text-primary">Griha Milan</span>
                        </div>
                        {/* primary */}
                        <ul className="hidden lg:flex gap-8 ">
                            {
                                menu.map((item) => {
                                    return <li key={item.id}>
                                        <Link
                                            to={item.link}
                                            className={`md:py-5 text-sm font-semibold cursor-pointer md:border-b-[3px] ${checkPath(item.link) ? "border-b-primary text-heading" : "text-paragraph border-b-transparent"}`}
                                            aria-current="page"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                    {/* secondary */}
                    <div className="flex gap-4">
                        <div className="flex items-center gap-10">
                            <div className="relative" ref={myAccountRef}>
                                <Button text="My Account" func={() => setShowDropdown(!showDropdown)} className="my-3" />
                                {showDropdown && (

                                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-40 overflow-hidden">
                                        <ul className="flex flex-col gap-3 mt-3 text-center">
                                            <li hidden={!auth.currentUser}>
                                                <Link to="/profile" className="block text-sm font-semibold cursor-pointer px-4 text-paragraph hover:text-primary">
                                                    My Profile
                                                </Link>
                                            </li>
                                            <li hidden={auth.currentUser}>
                                                <Link to="/sign-in" className="block text-sm font-semibold cursor-pointer px-4 text-paragraph hover:text-primary">
                                                    Sign In
                                                </Link>
                                            </li>
                                            <li hidden={auth.currentUser}>
                                                <Link to="/sign-up" className="block text-sm font-semibold cursor-pointer px-4 text-paragraph hover:text-primary" >
                                                    Sign Up
                                                </Link>
                                            </li>
                                            <li hidden={!auth.currentUser}>
                                                <p onClick={() => onSignOut()} className="block text-sm font-semibold cursor-pointer px-4 text-paragraph hover:text-primary" >
                                                    Sign Out
                                                </p>
                                            </li>

                                            <li className="block w-full text-center py-2 px-4 bg-primary text-white cursor-pointer hover:bg-primaryHover"
                                                onClick={() => navigate('/create-listing')}
                                            >
                                                Create Listing
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Mobile navigation toggle */}
                        <div className="lg:hidden flex items-center" ref={mobileMenuRef}>
                            <div className="flex justify-center items-center p-2 border-2 shadow-[5px_5px_0px_0px_rgba(178,146,107,1)] rounded-lg border-primary">
                                <button
                                    onClick={() => {
                                        setShowMobileMainDropdown(!showMobileMainDropdown)
                                    }
                                    }>
                                    {
                                        showMobileMainDropdown ? <IoMdClose className="text-3xl" /> : <MdMenuOpen className="text-3xl" />
                                    }
                                </button>
                            </div>
                            {showMobileMainDropdown &&
                                <div className="absolute dropdown top-full right-[5%] mt-2 bg-white border border-gray-300 rounded-md shadow-xl w-52">
                                    <ul className="flex flex-col gap-3 mt-3 justify-center">

                                        {
                                            menu.map((item) => {
                                                return <li key={item.id} className="flex justify-center hover:bg-gray-300 transition duration-500 ease-in-out">
                                                    <Link
                                                        to={item.link}
                                                        className=" py-2 px-3 text-heading"
                                                        aria-current="page"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <hr />
                                                </li>
                                            })

                                        }
                                        <button className="flex w-full py-3 text-sm justify-center items-center gap-2 bg-primary hover:bg-primaryHover text-white rounded-md transition duration-200 ease-in-out active:bg-primaryHover hover:shadow-lg active:shadow-lg"
                                            onClick={() => navigate('/create-listing')}
                                        >
                                            Create a listing
                                        </button>
                                    </ul>

                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header