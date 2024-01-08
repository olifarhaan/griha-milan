import { useCallback, useEffect, useState } from "react"
import { IoCreate } from "react-icons/io5";
import { useNavigate, useParams } from "react-router";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { getAuth } from "firebase/auth"
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";


const EditListing = () => {
    const navigate = useNavigate();
    const auth = getAuth();

    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);

    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedroom: 0,
        bathroom: 0,
        parking: true,
        furnished: true,
        address: '',
        lattitude: '',
        longitude: '',
        description: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},

    })
    const params = useParams();

    useEffect(() => {
        setLoading(true)
        if (listing && listing.userId !== auth.currentUser.uid) {
            toast.error("You are unauthorize")
            navigate("/")
        }
        setLoading(false)

    }, [auth.currentUser.uid, listing, navigate])

    const fetchData = useCallback(async () => {
        const docRef = doc(db, "listings", params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setListing(docSnap.data());
            const data = docSnap.data();
            setFormData({
                ...data,
                lattitude: data.geoLocation?.lat || '',
                longitude: data.geoLocation?.lng || '',
            });
        } else {
            navigate("/");
            toast.error("Listing not found");
        }
    }, [params.id, navigate])

    useEffect(() => {
        fetchData()
    }, [fetchData])


    const onChange = (e) => {
        let flag = null
        if (e.target.value === "true") flag = true;
        if (e.target.value === "false") flag = false;
        if (e.target.files) {
            setFormData({
                ...formData, images: e.target.files
            })
        }
        if (!e.target.files) {
            setFormData({
                ...formData, [e.target.id]: flag ?? e.target.value
            })
        }
    }


    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (offer && +discountedPrice >= +regularPrice) {
            setLoading(false);
            toast.error("Discounted should be less that Regular price");
            return
        }
        if (images.length > 6) {
            setLoading(false);
            toast.error("Only 6 images are allowed");
            return
        }

        let geoLocation = {
            lat: lattitude,
            lng: longitude
        }
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage();
                const filename = `${auth.currentUser.uid}-${auth.currentUser.displayName}-${uuidv4()}`;
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        // switch (snapshot.state) {
                        //     case 'paused':
                        //         console.log('Upload is paused');
                        //         break;
                        //     case 'running':
                        //         console.log('Upload is running');
                        //         break;
                        // }
                    },
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error);
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );

            })
        }


        const imgUrls = await Promise.all(
            [...images].map((image) => storeImage(image)))
            .catch((error) => {
                setLoading(false);
                toast.error("Could not upload images")
                return
            })

        console.log(imgUrls)
        const formDataCopy = { ...formData, imgUrls, geoLocation, userId: auth.currentUser.uid, timestamp: serverTimestamp() }
        delete formDataCopy.lattitude;
        delete formDataCopy.longitude;
        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        console.log(formDataCopy)

        // const docRef = await setDoc(collection(db, "listings"), formDataCopy);
        const docRef = doc(db, "listings", params.id);
        await updateDoc(docRef, formDataCopy)
        setLoading(false)
        toast.success("Congratulation! Listing updated");
        // console.log("After:", docRef)
        console.log("DocRef id", docRef.id)
        console.log("Param id", params.id)
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)

    }

    const {
        type,
        name,
        bedroom,
        bathroom,
        parking,
        furnished,
        address,
        description,
        offer,
        regularPrice,
        discountedPrice,
        lattitude,
        longitude,
        images
    } = { ...formData }

    if (loading) {
        return <Spinner />
    }

    return (
        <main className="w-full sm: max-w-md sm: mx-auto px-6">
            <h1 className="text-3xl text-center mt-6 font-bold">Update Listing</h1>
            <form onSubmit={onSubmit} className="flex flex-col gap-6 my-6" disa>
                <div>
                    <p className="text-lg font-semibold">Sell/Rent</p>
                    <div className="flex gap-8 ">
                        <button type="button" id="type" value="sell" onClick={onChange}
                            className={`w-full py-3 text-sm ${type === 'sell' ? 'bg-primary text-white' : 'bg-white text-heading'} rounded shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg uppercase font-semibold transition duration-200 ease-in-out`}
                        >Sell </button>
                        <button type="button" id="type" value="rent" onClick={onChange}
                            className={`w-full py-3 text-sm ${type === 'rent' ? 'bg-primary text-white' : 'bg-white text-heading'} rounded shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg uppercase font-semibold transition duration-200 ease-in-out`}
                        >Rent </button>
                    </div>
                </div>

                <div>
                    <p className="text-lg font-semibold">Propert Name</p>
                    <input className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="text" id="name" placeholder="Enter property name" value={name} onChange={onChange} required />
                </div>
                <div className="flex gap-8 ">
                    <div>
                        <p className="text-lg font-semibold">Bedrooms</p>
                        <input className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="number" id="bedroom" value={bedroom} onChange={onChange} required />
                    </div>
                    <div>
                        <p className="text-lg font-semibold">Bathrooms</p>
                        <input className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="number" id="bathroom" value={bathroom} onChange={onChange} required />
                    </div>
                </div>
                <div>
                    <p className="text-lg font-semibold">Parking Available</p>
                    <div className="flex gap-8 ">
                        <button type="button" id="parking" value={true} onClick={onChange}
                            className={`w-full py-3 text-sm ${parking ? 'bg-primary text-white' : 'bg-white text-heading'} rounded shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg uppercase font-semibold transition duration-200 ease-in-out`}
                        >Yes </button>
                        <button type="button" id="parking" value={false} onClick={onChange}
                            className={`w-full py-3 text-sm ${!parking ? 'bg-primary text-white' : 'bg-white text-heading'} rounded shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg uppercase font-semibold transition duration-200 ease-in-out`}
                        >No </button>
                    </div>
                </div>
                <div>
                    <p className="text-lg font-semibold">Furnished</p>
                    <div className="flex gap-8 ">
                        <button type="button" id="furnished" value={true} onClick={onChange}
                            className={`w-full py-3 text-sm ${furnished ? 'bg-primary text-white' : 'bg-white text-heading'} rounded shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg uppercase font-semibold transition duration-200 ease-in-out`}
                        >Yes </button>
                        <button type="button" id="furnished" value={false} onClick={onChange}
                            className={`w-full py-3 text-sm ${!furnished ? 'bg-primary text-white' : 'bg-white text-heading'} rounded shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg uppercase font-semibold transition duration-200 ease-in-out`}
                        >No </button>
                    </div>
                </div>
                <div>
                    <p className="text-lg font-semibold">Propert Address</p>
                    <textarea className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="text" id="address" placeholder="Enter property address" value={address} onChange={onChange} required />
                </div>

                <div>
                    <div className="flex gap-8 ">
                        <div>
                            <p className="text-lg font-semibold">Lattitude</p>
                            <input className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="number" step="any" id="lattitude" value={lattitude} onChange={onChange} required min="-90" max="90" />
                        </div>
                        <div>
                            <p className="text-lg font-semibold">Longitude</p>
                            <input className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="number" step="any" id="longitude" value={longitude} onChange={onChange} required min="-180" max="180" />
                        </div>
                    </div>
                    <p className="mt-2 text-xs">Get your property's lattitude & longitude from <a href="https://www.latlong.net" className="text-red-700 underline hover:text-red-900" target='_blank' rel="noopener noreferrer"> here</a></p>
                </div>

                <div>
                    <p className="text-lg font-semibold">Propert Description</p>
                    <textarea className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="text" id="description" placeholder="Enter property description" value={description} onChange={onChange} required />
                </div>
                <div>
                    <p className="text-lg font-semibold">Offer Available</p>
                    <div className="flex gap-8 ">
                        <button type="button" id="offer" value={true} onClick={onChange}
                            className={`w-full py-3 text-sm ${offer ? 'bg-primary text-white' : 'bg-white text-heading'} rounded shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg uppercase font-semibold transition duration-200 ease-in-out`}
                        >Yes </button>
                        <button type="button" id="offer" value={false} onClick={onChange}
                            className={`w-full py-3 text-sm ${!offer ? 'bg-primary text-white' : 'bg-white text-heading'} rounded shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg uppercase font-semibold transition duration-200 ease-in-out`}
                        >No </button>
                    </div>
                </div>
                <div>
                    <p className="text-lg font-semibold">Regular Price</p>
                    <div className="flex gap-8 justify-start items-center">
                        <input className="w-[47%] rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="number" id="regularPrice" value={regularPrice} onChange={onChange} required />
                        {type === 'rent' ? <p className="text-sm"> INR / month</p> : ''}
                    </div>
                </div>
                {offer && <div>
                    <p className="text-lg font-semibold">Discounted Price</p>
                    <div className="flex gap-8 justify-start items-center">
                        <input className="w-[47%] rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="number" id="discountedPrice" value={discountedPrice} onChange={onChange} required />
                        {type === 'rent' ? <p className="text-sm"> INR / month</p> : ''}
                    </div>
                </div>}

                <div>
                    <p className="text-lg font-semibold">Upload Images</p>
                    <p className="text-gray-500 mb-2">The first image will be the cover (max 6)</p>
                    <input className="w-full rounded-md text-paragraph bg-white px-3 py-1.5 border border-gray-300 transition ease-in-out" type="file" id="images" onChange={onChange} accept=".jpg, .jpeg, .png" multiple required />
                </div>
                <div>
                    <button type="submit" className="my-8 flex justify-center items-center gap-2 w-full bg-primary hover:bg-primaryHover text-white rounded-md py-3 uppercase transition duration-200 ease-in-out active:bg-hoverPrimary hover:shadow-lg active:shadow-lg" > <IoCreate className="text-xl" /> Update listing</button>
                </div>

            </form>
        </main>
    )
}

export default EditListing