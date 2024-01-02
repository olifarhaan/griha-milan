import { useNavigate } from "react-router"
import { useEffect, useRef, useState } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { FcHome } from "react-icons/fc";
import ListingCard from "../components/ListingCard";
import ConfirmModal from "../components/ConfirmModal";
import useBodyScrollLock from "../hooks/useBodyScrollLock";


const Profile = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const formNameInput = useRef(null);
  const [toggle] = useBodyScrollLock();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const { name, email } = { ...formData };
  const formChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const onSignOut = () => {
    signOut(auth);
    navigate('/');
  }

  const [changeDetails, setChangeDetails] = useState(false);
  const [listings, setListings] = useState(null);
  useEffect(() => {
    if (changeDetails && formNameInput.current) {
      formNameInput.current.focus(); // Focus on the name input field when changeDetails is true
    }
  }, [changeDetails]);



  useEffect(() => {
    (async () => {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, where("userId", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
      const querySnap = await getDocs(q);
      // console.log("querySnap", querySnap)
      let listings = [];
      querySnap.forEach((doc) => {
        // console.log("dox data", doc.data())
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings(listings)
      // console.log("Listings", listings)
    })()
  }, [auth.currentUser.uid])

  const onSubmit = async (e) => {
    try {
      if (auth.currentUser.displayName !== name) {
        setSubmitting(true);
        //Update name in Firebase Authentication
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        //Update name in Firestore
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          name,
        });
        setSubmitting(false);
        toast.success("Profile updated successfully")
      }
    } catch (error) {
      setSubmitting(false);
      toast.error("Could not update the profile")
    }
  }



  //Show Model & delete functionality
  const [showModal, setShowModal] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  console.log(deleteItemId)

  const onDelete = async (uid) => {
    toggle();
    setDeleteItemId(uid);
    setShowModal(true);
  };

  const confirmDelete = async (uid) => {
    await deleteDoc(doc(db, "listings", uid));
    const updatedListings = listings.filter((listing) => {
      return listing.id !== uid;
    })
    setListings(updatedListings);
    toast.success("Listing deleted successfully")
    setShowModal(false);
    setDeleteItemId(null);
    toggle();
  }

  const cancelDelete = () => {
    toggle();
    setShowModal(false);
    setDeleteItemId(null);
  };


  const onEdit = (uid) => {
    navigate(`/edit-listing/${uid}`)
  }

  return (
    <>
      <section >
        <h1 className="text-3xl text-center mt-6 font-bold text-heading">Profile</h1>

        <div className="w-full lg:w-[40%] mx-auto my-10 px-6">
          <form className="flex flex-col gap-4">
            <input ref={formNameInput} className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="text" id="name" placeholder="Enter your name" value={name} onChange={formChange} disabled={!changeDetails} />
            <input className="w-full rounded-md text-lg text-paragraph bg-white border-gray-300 transition ease-in-out" type="email" id="email" placeholder="Enter your email" value={email} onChange={formChange} disabled />

            <div className="flex flex-wrap justify-between text-sm sm:text-lg">
              <div> Want to change your name? <span className="text-primary cursor-pointer hover:underline"
                onClick={() => {
                  changeDetails && onSubmit();
                  setChangeDetails(!changeDetails);
                }} >{changeDetails ? "Apply Changes" : submitting ? "Saving Changes..." : "Edit"}</span></div>
              <div className="text-blue-600 cursor-pointer hover:underline" onClick={onSignOut}> Sign Out </div>
            </div>
          </form>
          <button type="button" className="my-8 flex justify-center items-center gap-2 w-full bg-primary hover:bg-primaryHover text-white rounded-md py-3 uppercase transition duration-200 ease-in-out active:bg-primaryHover hover:shadow-lg active:shadow-lg" onClick={() => navigate("/create-listing")} > <FcHome className="bg-white rounded-full text-xl" /> Sell or Rent your home</button>
        </div>
      </section>
      {
        listings && listings.length > 0 && <section className="max-w-6xl px-3 my-20 mx-auto">
          <h2 className="text-3xl text-center mt-6 font-bold text-heading">My Listings</h2>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5 my-5 gap-3">
            {listings.map((listing) => {
              return <ListingCard key={listing.id} id={listing.id} listing={listing.data} onDelete={() => onDelete(listing.id)} onEdit={() => onEdit(listing.id)} />
            })}
          </ul>
          {
            showModal &&
            <ConfirmModal
              showModal={showModal}
              setShowModal={setShowModal}
              confirmDelete={() => confirmDelete(deleteItemId)}
              cancelDelete={cancelDelete}
            />
          }
        </section>
      }
    </>
  )
}

export default Profile