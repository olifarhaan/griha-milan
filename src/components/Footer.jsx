import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="mt-auto w-full bg-darkBg shadow py-5">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 px-3 max-w-6xl mx-auto">
        <div className="text-sm text-gray-400 text-center sm:text-left">© {new Date().getFullYear()} <Link to="/" className="hover:underline">Griha Milan</Link>. All Rights Reserved.</div>
        <div className="text-sm text-gray-400 text-center sm:text-right "> Made with 🤎 by <a href="https://www.linkedin.com/in/olifarhaan/" className="text-white underline hover:text-primaryHover" target='_blank' rel="noopener noreferrer">M. Ali Farhan</a></div>
      </div>
    </footer>
  )
}

export default Footer