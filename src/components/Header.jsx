import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const checkPath = (path) => {
        return location.pathname === path;
    }

    return (
        <div className="bg-white border-b shadow-sm sticky top-0 z-50">
            <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
                <div>
                    <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="" className="h-5 cursor-pointer" onClick={() => navigate('/')} />
                </div>
                <div>
                    <ul className="flex gap-5">
                        <li className={`py-6 text-sm font-semibold cursor-pointer ${checkPath("/") ? "bg-red-600 text-black" : "text-gray-500 hover:bg-gray-100"} `} onClick={() => navigate('/')}>Home</li>
                        <li className={`py-6 text-sm font-semibold cursor-pointer ${checkPath("/offers") ? "bg-red-600 text-black" : "text-gray-500 hover:bg-gray-100"} `} onClick={() => navigate('/offers')}>Offers</li>
                        <li className={`py-6 text-sm font-semibold cursor-pointer ${checkPath("/sign-in") ? "bg-red-600 text-black" : "text-gray-500 hover:bg-gray-100"} `} onClick={() => navigate('/sign-in')}>Sign In</li>
                    </ul>
                </div>
            </header>
        </div>
    )
}

export default Header;
