import { doc, getDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react'
import { db } from '../firebase';
import { Link } from 'react-router-dom';

const ContactLandlord = ({ listing }) => {
    const [landlordName, setLandlordName] = useState(null);
    const [landlordEmail, setLandlordEmail] = useState(null);
    const [landlordNotFound, setLandlordNotFound] = useState(null);
    const [message, setMessage] = useState("I have an enquiry about your property...");

    const getLandlordName = useCallback(async () => {
        const docRef = doc(db, "users", listing.userId);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setLandlordNotFound(false);
            setLandlordName(docSnap.data().name);
            setLandlordEmail(docSnap.data().email);
        }
        else {
            setLandlordNotFound(true);
        }
    }, [listing.userId])

    useEffect(() => {
        getLandlordName()
    }, [getLandlordName])


    return (
        <div className='flex flex-col gap-2'>
            <hr />
            {!landlordNotFound ?
                <div>
                    <p className='text-paragraph'>Landlord Email: <span className='font-bold'>{landlordEmail}</span></p>
                    <p className='text-paragraph'>You are contacting <span className='font-bold' > {landlordName}</span> for <span className='font-bold'>{listing.name}</span> </p>
                    <textarea className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="text" onChange={(e) => setMessage(e.target.value)} value={message} id="message" cols="30" rows="5" required minLength={10} maxLength={1000} autoFocus></textarea>
                    <Link to={`mailto:${landlordEmail}?Subject=${listing.name}&body=${message}`}>
                        <button type="button"
                            className="my-8 flex justify-center items-center gap-2 w-full bg-primary hover:bg-primaryHover text-white rounded-md py-3 uppercase transition duration-200 ease-in-out active:bg-primaryHover hover:shadow-lg active:shadow-lg" > Send Message</button>
                    </Link>
                </div>
                : <div className='w-full bg-red-200 border-[1px] border-red-600 p-3 rounded-md'>
                    <p className='text-heading'>Landlord not found, this listing will be removed soon
                    </p>
                </div>
            }
        </div>
    )
}

export default ContactLandlord