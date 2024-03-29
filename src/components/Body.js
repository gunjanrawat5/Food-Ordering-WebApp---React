import RestaurantCard from "./RestaurantCard"
import resList from "../utils/mockData"
import {useEffect, useState} from "react"
import Shimmer from "./Shimmer"
import { Link } from "react-router-dom"
import useOnlineStatus from "../utils/useOnlineStatus"


const Body = () => {

    //State Variable
    const [listOfRestaurants,setListOfRestaurant] =useState([]);
    const [filteredRestaurant, setFilteredRestaurant] = useState([]);
    const [searchText, setSearchText] = useState("")

    //console.log(listOfRestaurants)

    useEffect(()=>{
        fetchData()
    },[]);

    const fetchData = async () => {
        const data = await fetch("https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9351929&lng=77.62448069999999&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING")

        const json = await data.json();

        //Optional Chaining
        // console.log(json.data.cards[4].card.card.gridElements.infoWithStyle.restaurants);
        setListOfRestaurant(json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants)
        setFilteredRestaurant(json?.data?.cards[4]?.card?.card?.gridElements?.infoWithStyle?.restaurants)
    }

    const onlineStatus = useOnlineStatus();
    if(onlineStatus === false){
        return <h1>Looks like you are offline , please check your connection!</h1>
    }

    //Conditional Rendering
    if(listOfRestaurants.length === 0){
        return <Shimmer/>
    }

    return(
        <div className="body">
            <div className="filter flex">
                <div className="search m-4 p-4">
                    <input
                     type="text"
                      className="border border-solid border-black "
                       value={searchText}
                       onChange={(e)=>{
                        setSearchText(e.target.value)
                       }}
                       >
                       </input>
                    <button className="px-4 py-2 bg-green-100 m-4 rounded-lg"
                     onClick={()=>{
                        //Filter the res cards and update the UI
                        //seearchText
                        const filteredRestaurant = listOfRestaurants.filter((res)=>
                            res.info.name.toLowerCase().includes(searchText.toLowerCase())
                        )
                        setFilteredRestaurant(filteredRestaurant)
                    }}
                    >Search</button>
                </div>
                <div className="search m-1 p-4 flex items-center">
                    <button
                    className="px-4 py-2 bg-gray-100 rounded-lg"
                    onClick={()=>{
                        const filteredList = listOfRestaurants.filter(
                            (res)=>res.info.avgRating>4.3
                            )
                            setListOfRestaurant(filteredList);
                        }}
                        >
                        Top Rated Restaurants
                    </button>
                </div>
               
            </div>
            <div className="res-container flex flex-wrap">
               {/* <RestaurantCard resData={resList[8]}/> */}
               {
                filteredRestaurant.map((restaurant) => (
                <Link
                 to={"/restaurants/"+restaurant.info.id}
                 key={restaurant.info.id}
                 ><RestaurantCard  resData= {restaurant}/> </Link>
                ))}
            </div>
        </div>
    )
}

export default Body