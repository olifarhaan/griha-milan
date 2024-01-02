import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router"
import { db } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import Spinner from "../components/Spinner";
import parking from "../assets/svg/parking.svg"
import area from "../assets/svg/area.svg"
import bedroom from "../assets/svg/bedroom.svg"
import bathroom from "../assets/svg/bathroom.svg"


import {
    FaShare,
    FaMapMarkerAlt,
} from "react-icons/fa";


import { Swiper, SwiperSlide } from "swiper/react"
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import "swiper/css/bundle"
import ContactLandlord from "../components/ContactLandlord";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const Listing = () => {
    const params = useParams();
    const auth = getAuth();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contactLandlord, setContactLandlord] = useState(false)



    const getListing = useCallback(async () => {
        const docRef = doc(db, "listings", params.id);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data())
        if (docSnap.exists()) {
            setListing(docSnap.data());
            setLoading(false)
        }
        else {
            navigate("*")
        }
    }, [params.id, navigate])


    useEffect(() => {
        getListing();
    }, [getListing])

    const linkCopy = () => {
        const link = window.location.href
        navigator.clipboard.writeText(link)
        toast.success("Property link copied!")
    }



    if (loading) return <Spinner />
    return (
        <main>
            <Swiper
                modules={[Navigation, Autoplay, EffectFade]}
                slidesPerView={1}
                navigation
                effect="fade"
                autoplay={{ delay: 3000 }}
            >
                {listing.imgUrls.map((url, index) => (
                    <SwiperSlide key={index}>
                        <div
                            className="relative flex justify-center items-end overflow-hidden h-[500px]"
                            style={{
                                background: `url(${url}) center no-repeat`,
                                backgroundSize: "cover",
                                borderRadius: "10px",
                                margin: "4px"
                            }}
                        >
                            <div className="flex w-full h-full items-end py-7 px-3 bg-gradient-to-b from-transparent to-black">
                                <div className="flex flex-col justify-center max-w-3xl mx-auto">
                                    <h1 className="text-center text-xl sm:text-3xl text-white font-bold">{listing.name}</h1>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="fixed top-[13%] right-[3%] z-10 bg-primary p-2 rounded-full cursor-pointer shadow-xl"
                onClick={() => linkCopy()}
            >
                <FaShare className="text-2xl text-white " />
            </div>

            <div className="max-w-6xl mx-3 lg:mx-auto mt-6 mb-20 flex flex-wrap justify-center shadow-xl bg-white rounded-lg ">
                <div className="w-full md:w-[49.9%] h-auto p-3 lg:p-6 flex flex-col gap-3">
                    <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="h-4 w-4 text-green-600" />
                        <p className="font-semibold text-sm mb-[2px] text-gray-600 truncate">
                            {listing.address}
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-heading">{listing.name}</h2>
                    </div>
                    <div className="flex flex-wrap gap-2 items-baseline">
                        {listing.offer ?
                            <p className="text-2xl text-primary font-bold flex gap-2 items-baseline">
                                INR {Intl.NumberFormat('en-IN').format(listing.discountedPrice)}
                                <span className="text-lg text-gray-600 line-through">{Intl.NumberFormat('en-IN').format(listing.regularPrice)}</span>
                            </p> : <p className="text-2xl text-primary font-bold flex gap-2 items-baseline">
                                INR {Intl.NumberFormat('en-IN').format(listing.regularPrice)}
                            </p>
                        }
                        {listing.type === "rent" && <p className="text-paragraph">/month</p>
                        }
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="bg-primary max-w-[200px] w-full flex justify-center items-center p-2 text-sm text-white rounded shadow">{listing.type === "sell" ? "For Sale" : "For Rent"}</div>
                        {listing.offer && <div className="bg-green-700 max-w-[200px] w-full flex justify-center items-center p-2 text-sm text-white rounded shadow">Save INR {Intl.NumberFormat('en-IN').format((+listing.regularPrice) - (+listing.discountedPrice))} </div>}
                    </div>
                    <div className="w-full flex items-center flex-wrap gap-3">
                        {
                            +listing.bedroom > 0 &&
                            <div className="flex gap-1 items-center">
                                <img src={bedroom} alt="" className="w-4" />
                                <p className="text-sm font-bold text-paragraph">{+listing.bedroom > 1 ? `${listing.bedroom} beds` : "1 Bed"}</p>
                            </div>
                        }

                        {
                            +listing.bathroom > 0 &&
                            <div className="flex gap-1 items-center">
                                <img src={bathroom} alt="" className="w-4" />
                                <p className="text-sm font-bold text-paragraph">{+listing.bathroom > 1 ? `${listing.bathroom} Baths` : "1 Bath"}</p>
                            </div>
                        }
                        {
                            <div className="flex gap-1 items-center">
                                <img src={area} alt="" className="w-4" />
                                <p className="text-sm font-bold text-paragraph"> {listing.furnished ? "Furnished" : "Not Furnished"} </p>
                            </div>
                        }
                        {
                            <div className="flex gap-1 items-center">
                                <img src={parking} alt="" className="w-4" />
                                <p className="text-sm font-bold text-paragraph"> {listing.parking ? "Parking" : "No Parking"} </p>
                            </div>
                        }
                    </div>
                    <div>
                        <p className="text-paragraph">{listing.description}</p>
                    </div>

                    {listing.userId !== auth.currentUser?.uid &&
                        <div>
                            {
                                contactLandlord ? <ContactLandlord listing={listing} /> :
                                    <button type="button" onClick={() => setContactLandlord(true)} className="cursor-pointer w-full bg-primary hover:bg-primaryHover text-white rounded-md py-3 uppercase transition duration-200 ease-in-out active:bg-primaryHover hover:shadow-lg active:shadow-lg">Contact Landlord</button>
                            }
                        </div>
                    }
                </div>
                <div className="w-full md:w-[49.9%] h-[300px] md:h-[400px] p-3 z-0">
                    <MapContainer center={[listing.geoLocation.lat, listing.geoLocation.lng]} zoom={13} scrollWheelZoom={false}
                        style={{ height: "100%", width: "100%" }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[listing.geoLocation.lat, listing.geoLocation.lng]}>
                            <Popup>
                                <p className="text-center">{listing.name}</p>

                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            </div>

        </main>
    )
}

export default Listing