import { Outlet, Navigate } from "react-router";
import useAuthCheck from "../hooks/useAuthCheck";
import Spinner from "./Spinner";
const PrivateRoute = () => {
    const { isLoggedIn, checkingStatus } = useAuthCheck();
    if (checkingStatus) {
        return <Spinner />
    }
    return isLoggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute