import React from 'react'
import NotFound from "../assets/png/NotFound.png"
import { useNavigate } from 'react-router'

const NotFound404 = () => {
  const navigate= useNavigate()
  return (
    <div className='h-[70vh] flex justify-center items-center'> 
      <div className='flex flex-col justify-center'>
        <img src={NotFound} alt="" className='h-[400px]' />
        <button type="button" className="py-2 px-5 bg-primary hover:bg-primaryHover text-white rounded-md transition duration-200 ease-in-out active:bg-primaryHover hover:shadow-lg active:shadow-lg"
          onClick={()=>navigate('/')}
        >
          Go to Home Page
        </button>
      </div>
    </div>
  )
}

export default NotFound404