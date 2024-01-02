import { Swiper, SwiperSlide } from "swiper/react"
import { EffectFade, Autoplay, Navigation } from "swiper/modules";
import "swiper/css/bundle"
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "./Spinner";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "./Button";



const HomeSlider = () => {

    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);

    useEffect(() => {
        (
            async () => {

                try {
                    const collectionRef = collection(db, "listings");
                    const q = query(collectionRef, orderBy("timestamp", "desc"), limit(5));
                    const querySnap = await getDocs(q);
                    const listings = []
                    querySnap.forEach((snap) => {
                        listings.push({
                            id: snap.id,
                            data: snap.data()
                        })
                    })
                    setListings(listings)
                } catch (error) {
                    console.log(error)
                }
                setLoading(false);
            }
        )()
    }, [])

    if (loading) {
        return <Spinner />
    }

    if (listings.length <= 0) {
        return <></>
    }

    return (
        <div>
            <Swiper
                modules={[Navigation, Autoplay, EffectFade]}
                slidesPerView={1}
                navigation
                effect="fade"
                autoplay={{ delay: 3000 }}
            >
                {listings.map((listing) => (

                    <SwiperSlide key={listing.id}>
                        <Link className="cursor-pointer" to={`/category/${listing.data.type}/${listing.id}`} >
                            <div
                                className="relative flex justify-center items-end overflow-hidden h-[500px]"
                                style={{
                                    background: `url(${listing.data.imgUrls[0]}) center no-repeat`,
                                    backgroundSize: "cover",
                                    borderRadius: "10px",
                                    margin: "4px"
                                }}
                            >
                                <div className="flex w-full h-full items-end py-7 px-3 bg-gradient-to-b from-transparent to-black">
                                    <div className="w-full flex flex-col justify-center max-w-3xl mx-auto">
                                        <div className="flex justify-center items-center gap-1">
                                            <FaMapMarkerAlt className="h-6 w-6 text-green-600 shadow" />
                                            <p className="font-semibold text-sm mb-[2px] text-white truncate">
                                                {listing.data.address}
                                            </p>
                                        </div>
                                        <h1 className="text-center text-xl sm:text-3xl text-white font-bold">{listing.data.name}</h1>
                                        <div className="flex justify-center">
                                            <Button text="Enquire Now" classes="my-3" />
                                            {/* <button className="flex my-3 px-10 py-3 text-sm justify-center items-center gap-2 bg-primary hover:bg-primaryHover text-white rounded-md transition duration-200 ease-in-out active:bg-primaryHover hover:shadow-lg active:shadow-lg">
                                                Enquire Now <FaArrowRightLong /></button> */}
                                        </div>
                                    </div>
                                </div>
                                {/* <div className={`fixed top-[13%] right-[3%] z-10 bg-primary py-2 px-4 rounded-2xl cursor-pointer`}>
                                    <p className=" text-white "> {listing.data.type === "rent" ? "Available for Rent" : "Available for Sale"}</p>
                                </div> */}
                            </div>
                        </Link>
                    </SwiperSlide>

                ))}
            </Swiper>
        </div>
    )
}

export default HomeSlider