import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import ListingCard from "../components/ListingCard";
import Spinner from "../components/Spinner";

const Offers = () => {
  const [listings, setlistings] = useState(null);
  const [lastVisibleListing, setLastVisibleListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMoreListings = async () => {
    try {
      const collectionRef = collection(db, "listings");
      const q = query(collectionRef, where("offer", "==", true), orderBy("timestamp", "desc"), startAfter(lastVisibleListing), limit(4));
      const querySnap = await getDocs(q);
      if (querySnap.docs.length < 4) {
        setLastVisibleListing(null);
      }
      else {
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastVisibleListing(lastVisible);
      }
      const listings = []
      querySnap.forEach((snap) => {
        listings.push({
          id: snap.id,
          data: snap.data()
        })
      })
      setlistings((prev) => [...prev, ...listings])


    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    (
      async () => {
        try {
          const collectionRef = collection(db, "listings");
          const q = query(collectionRef, where("offer", "==", true), orderBy("timestamp", "desc"), limit(8));
          const querySnap = await getDocs(q);
          if (querySnap.docs.length < 8) {
            setLastVisibleListing(null);
          }
          else {
            const lastVisible = querySnap.docs[querySnap.docs.length - 1];
            setLastVisibleListing(lastVisible);
          }
          const listings = []
          querySnap.forEach((snap) => {
            listings.push({
              id: snap.id,
              data: snap.data()
            })
          })
          setlistings(listings)
          setLoading(false);

        } catch (error) {
          console.log(error)
        }
      }
    )()
  }, [])

  if (loading) return <Spinner />

  return (
    <main className="">
      {
        listings ? <section className="max-w-6xl px-3 my-20 mx-auto">
          <h2 className="text-3xl text-center bmt-6 font-bold text-heading">Recent Offers</h2>
          <p className="text-center text-primary">Here are some of the offers</p>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  my-5 gap-3">
            {listings.map((listing) => {
              return <ListingCard key={listing.id} id={listing.id} listing={listing.data} />
            })}
          </ul>
          {
            lastVisibleListing ?
              <div className="flex justify-center">
                <button type="button" className="py-2 px-5 bg-primary hover:bg-primaryHover text-white rounded-md transition duration-200 ease-in-out active:bg-primaryHover hover:shadow-lg active:shadow-lg"
                  onClick={() => fetchMoreListings()}
                > Load More</button>
              </div>
              : <p className="text-center">No More Listings</p>
          }
        </section> : <section className="flex items-center my-20 justify-center">
          <h1 className="text-heading text-3xl font-bold">No Offer Listing Found</h1>
        </section>
      }
    </main>

  )
}

export default Offers