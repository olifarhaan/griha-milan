import Moment from "react-moment"
import { Link } from "react-router-dom"
import { MdLocationOn } from "react-icons/md"
import bedroom from "../assets/svg/bedroom.svg"
import bathroom from "../assets/svg/bathroom.svg"
import { SlTrash, SlNote } from "react-icons/sl";





const ListingCard = ({ id, listing, onEdit, onDelete }) => {



    return (
        <li className="relative bg-white flex flex-col justify-between items-center border border-gray-300 shadow hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150">
            <Link className="contents" to={`/category/${listing.type}/${id}`}>
                <img src={listing.imgUrls[0]} alt="" loading="lazy"
                    className="w-full h-[170px] object-cover hover:scale-105 transition-scale duration-200 ease-in"
                />
                <Moment className="absolute top-2 left-2 text-[10px] text-white bg-[#4C4A49] bg-opacity-50 py-0.5 px-1 rounded" fromNow>
                    {listing.timestamp.toDate()}
                </Moment>
                {
                    (listing.offer === true) &&
                    <div className="absolute top-2 right-2 text-[10px] text-white bg-primary  py-0.5 px-1 rounded">
                        Offer
                    </div>
                }
                <div className="w-full p-[10px] flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                        <MdLocationOn className="h-4 w-4 text-green-600" />
                        <p className="font-semibold text-sm mb-[2px] text-paragraph truncate">
                            {listing.address}
                        </p>
                    </div>
                    <h3 className="font-semibold text-heading m-0 text-md sm:text-md truncate">{listing.name}</h3>
                    {listing.offer ?
                        <p className="text-sm text-primary font-bold flex gap-2 items-baseline text-wrap">
                            INR {Intl.NumberFormat('en-IN').format(listing.discountedPrice)}
                            <span className="text-sm text-gray-600 line-through">{Intl.NumberFormat('en-IN').format(listing.regularPrice)}</span>
                            <span className="text-xs text-paragraph font-normal"> {listing.type === "rent" && " /month"} </span>
                        </p> : <p className="text-sm text-primary font-bold flex gap-2 items-baseline text-wrap">
                            INR {Intl.NumberFormat('en-IN').format(listing.regularPrice)}
                            <span className="text-xs text-paragraph font-normal"> {listing.type === "rent" && " /month"} </span>
                        </p>
                    }

                    <div className="flex items-center mt-[10px] space-x-3">
                        <div className="flex items-center space-x-1">
                            <img src={bedroom} alt="" className="w-4" />
                            <p className="font-semibold text-xs text-paragraph">
                                {listing.bedroom > 1 ? `${listing.bedroom} Beds` : "1 Bed"}
                            </p>
                        </div>
                        <div className="flex items-center space-x-1">
                            <img src={bathroom} alt="" className="w-4" />
                            <p className="font-semibold text-xs text-paragraph">
                                {listing.bathroom > 1
                                    ? `${listing.bathroom} Baths`
                                    : "1 Bath"}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>

            {(onDelete && onEdit) &&
                <div className="absolute bottom-3 right-3 flex gap-3">
                    <SlNote className="text-primary text-lg cursor-pointer" onClick={() => onEdit()} />
                    <SlTrash className="text-red-700 text-lg cursor-pointer" onClick={() => onDelete()} />
                </div>
            }

        </li>
    )
}

export default ListingCard