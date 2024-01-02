import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="mt-auto w-full flex justify-center items-center bg-darkBg shadow py-3">
      <span className="text-sm text-gray-400 sm:text-center ">© 2023 <Link to="/" className="hover:underline">Griha Milan</Link>. All Rights Reserved.</span>
    </footer>
  )
}

export default Footer