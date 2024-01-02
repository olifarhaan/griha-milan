import React from 'react'
import buy from "../assets/svg/buy.svg"
import rent from "../assets/svg/rent.svg"
import sell from "../assets/svg/sell.svg"
import appraisals from "../assets/svg/appraisals.svg"



const Card = ({ content }) => {
    return (
        <div className='py-10 px-5 bg-white flex flex-col gap-3 justify-between items-center border border-gray-300 shadow hover:shadow-xl rounded-md transition-shadow duration-150'>
            <div className='flex justify-center items-center bg-[#F7F2EE] p-4 rounded-full'> <img src={content.img} className='h-10' alt="" /></div>

            <h3 className='font-semibold text-heading m-0 text-center text-md sm:text-md'>{content.heading}</h3>
            <p className='text-center text-paragraph text-sm'>{content.description}</p>
        </div>
    )
}


const WhyChooseUs = () => {
    const content = [{
        id: '1',
        img: buy,
        heading: "Buy a home",
        description: "Looking to make an investment or settle down? Explore our wide range of homes available for purchase across India. From cozy apartments to spacious villas, find the perfect place to call your own.",
    }, {
        id: '2',
        img: rent,
        heading: "Rent a home",
        description: "Renting made simple! Browse through our collection of rental properties in various cities across India. Whether you're seeking a temporary residence or a long-term stay, we've got you covered. ",
    }, {
        id: '3',
        img: sell,
        heading: "Sell your home",
        description: "Ready to part ways with your property? List your home with us hassle-free. Our platform provides a seamless selling experience, connecting you with potential buyers across the country. ",
    }, {
        id: '4',
        img: appraisals,
        heading: "No hidden fee",
        description: "Rest assured, our platform operates with complete transparency, ensuring no hidden fees. We believe in clarity and honesty throughout your journey of buying, renting, or selling a home.",
    }]

    return (
        <section>
            <div className="max-w-6xl px-3 my-20 mx-auto">
                <h2 className="text-3xl mt-6 font-bold text-heading">Why Choose Us</h2>
                <p className="inline text-primary max-w-2xl">Trust us to make finding, renting, or selling your home a smooth and satisfying process.</p>
                {

                    <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-5 gap-3">
                        {content.map((item) => {
                            return <Card key={item.id} id={item.id} content={item} />
                        })}
                    </ul>
                }
            </div>
        </section >
    )
}

export default WhyChooseUs