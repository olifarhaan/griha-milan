import { useLocation, useNavigate } from "react-router-dom";


const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const checkPath = (path) => {
        console.log(location.pathname, path);
        if (path === location.pathname) return true;
        else return false;
    }

    return (
        <div className="bg-white border-b shadow-sm sticky top-0 z-50">
            <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
                <div>
                    <img src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="" className="h-5 cursor-pointer" onClick={() => navigate('/')} />
                </div>
                <div>
                    <ul className="flex gap-5">
                        <li className={`py-6 text-sm border-b-[3px] text-gray-500 font-semibold border-b-transparent ${checkPath("/") && "text-black border-b-red-500"}  cursor-pointer`} onClick={() => navigate('/')}>Home</li>
                        <li className={`py-6 text-sm border-b-[3px] text-gray-500 font-semibold border-b-transparent ${checkPath("/offers") && "text-black border-b-red-500"}  cursor-pointer`} onClick={() => navigate('/offers')}>Offers</li>
                        <li className={`py-6 text-sm border-b-[3px] text-gray-500 font-semibold border-b-transparent ${checkPath("/sign-in") && "text-black border-b-red-500"} cursor-pointer`} onClick={() => navigate('/sign-in')}>Sign In</li>
                    </ul>

                </div>

            </header>
        </div>
    )
}

export default Header