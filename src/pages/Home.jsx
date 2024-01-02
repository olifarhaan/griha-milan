import { useEffect, useState } from "react"
import HomeSlider from "../components/HomeSlider"
import { useNavigate } from "react-router"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { db } from "../firebase"
import ListingCard from "../components/ListingCard"
import WhyChooseUs from "../components/WhyChooseUs"

const Home = () => {
  const navigate = useNavigate()
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    (
      async () => {
        try {
          const collectionRef = collection(db, "listings");
          const q = query(collectionRef, where("offer", "==", true), orderBy("timestamp", "desc"), limit(4));
          const querySnap = await getDocs(q);
          const listings = []
          querySnap.forEach((snap) => {
            listings.push({
              id: snap.id,
              data: snap.data()
            })
          })
          setOfferListings(listings)
          // setLoading(false);
        } catch (error) {
          console.log(error)
        }

      }
    )()
  }, [])

  useEffect(() => {
    (
      async () => {
        try {
          const collectionRef = collection(db, "listings");
          const q = query(collectionRef, where("type", "==", "rent"), orderBy("timestamp", "desc"), limit(4));
          const querySnap = await getDocs(q);
          const listings = []
          querySnap.forEach((snap) => {
            listings.push({
              id: snap.id,
              data: snap.data()
            })
          })
          setRentListings(listings)
          // setLoading(false);
          console.log(listings)
        } catch (error) {
          console.log(error)
        }
      }
    )()
  }, [])

  useEffect(() => {
    (
      async () => {

        try {
          const collectionRef = collection(db, "listings");
          const q = query(collectionRef, where("type", "==", "sell"), orderBy("timestamp", "desc"), limit(4));
          const querySnap = await getDocs(q);
          const listings = []
          querySnap.forEach((snap) => {
            listings.push({
              id: snap.id,
              data: snap.data()
            })
          })
          setSaleListings(listings)
        } catch (error) {
          console.log(error);
        }
      }
    )()
  }, [])

  return (
    <main className="">
      <section>
        <HomeSlider />
      </section>

      <WhyChooseUs />

      {
        offerListings && offerListings.length > 0 && <section className="max-w-6xl px-3 mt-20 mx-auto">
          <h2 className="text-3xl mt-6 font-bold text-heading">Recent Offers</h2>
          <p className="cursor-pointer inline text-primary hover:text-primaryHover hover:underline" onClick={() => navigate("/offers")}>Show more offers</p>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5 my-5 gap-3">
            {offerListings.map((listing) => {
              return <ListingCard key={listing.id} id={listing.id} listing={listing.data} />
            })}
          </ul>
        </section>
      }
      {
        rentListings && rentListings.length > 0 && <section className="max-w-6xl px-3 mt-20 mx-auto">
          <h2 className="text-3xl mt-6 font-bold text-heading">Available for Sale</h2>
          <p className="cursor-pointer inline text-primary hover:text-primaryHover hover:underline" onClick={() => navigate("/category/rent")}>Show more offers</p>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5 my-5 gap-3">
            {rentListings.map((listing) => {
              return <ListingCard key={listing.id} id={listing.id} listing={listing.data} />
            })}
          </ul>
        </section>
      }

      {
        saleListings && saleListings.length > 0 && <section className="max-w-6xl px-3 my-20 mx-auto">
          <h2 className="text-3xl mt-6 font-bold text-heading">Available for Rent</h2>
          <p className="cursor-pointer inline text-primary hover:text-primaryHover hover:underline" onClick={() => navigate("/category/offers")}>Show more offers</p>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5 my-5 gap-3">
            {saleListings.map((listing) => {
              return <ListingCard key={listing.id} id={listing.id} listing={listing.data} />
            })}
          </ul>
        </section>
      }
    </main>
  )
}

export default Home