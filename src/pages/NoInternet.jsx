import React from 'react'
import { MdOutlineSignalWifiStatusbarConnectedNoInternet4 } from "react-icons/md";

const NoInternet = () => {
    return (
        <div className='h-[70vh] flex justify-center items-center'>
            <div className='flex flex-col justify-center'>
                <MdOutlineSignalWifiStatusbarConnectedNoInternet4 className='text-[200px] text-primary' />
                <button type="button" className="py-2 px-5 bg-primary hover:bg-primaryHover text-white rounded-md transition duration-200 ease-in-out active:bg-primaryHover hover:shadow-lg active:shadow-lg">
                    No Internet Connection
                </button>
            </div>
        </div>
    )
}

export default NoInternet