import React, { useRef, useState } from 'react'
import emailjs from '@emailjs/browser';
import contact from '../assets/jpg/contact.jpg'
import { toast } from 'react-toastify';

const ContactForm = () => {
    const [loading, setLoading] = useState(false);
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();
        setLoading(true)
        emailjs.sendForm(process.env.REACT_APP_EMAILJS_SERVICE_ID, 'griha_milan_contact', form.current, process.env.REACT_APP_EMAILJS_PUBLIC_KEY)
            .then((result) => {
                form.current.reset();
                toast.success("Message sent successfully")
            }, (error) => {
                toast.error("Could not send message")
            });
        setLoading(false);
    };


    return (

        <section className='my-20'>
            <h1 className="text-3xl text-center font-bold mb-6 text-heading">Contact Us</h1>
            <div className="flex justify-center items-center flex-wrap px-6 gap-16 max-w-6xl mx-auto">
                <div className="lg:w-[50%]">
                    <img src={contact} alt="" className="rounded-2xl" />
                </div>
                <div className="w-full lg:w-[40%]">
                    <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-4">
                        <input name="user_name" className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="text" id="name" placeholder="Enter your name" autoComplete="name" required />
                        <input name="user_email" className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="email" id="email" placeholder="Enter your email" autoComplete="email" required />
                        <textarea name="message" className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" placeholder="Enter your enquiry" required></textarea>
                        <div>
                            <button value="send" type="submit" className={`w-full bg-primary hover:bg-primaryHover disabled:${loading} text-white rounded-md py-3 uppercase transition duration-200 ease-in-out active:bg-primaryHover hover:shadow-lg active:shadow-lg `}>{loading ? "Sending ..." : "Send Message"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default ContactForm