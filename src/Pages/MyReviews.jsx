import { useEffect, useState } from "react";

import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

import { db } from "../firebase";

import {
collection,
query,
where,
getDocs
} from "firebase/firestore";

import "./MyReviews.css";


function MyReviews(){


const [reviews,setReviews]=useState([]);



useEffect(()=>{


const loadReviews=async()=>{


const user =
JSON.parse(localStorage.getItem("user"));

if(!user) return;



const q=query(

collection(db,"reviews"),

where(
"userId",
"==",
user.uid
)

);



const snap =
await getDocs(q);



setReviews(

snap.docs.map(doc=>(
{
id:doc.id,
...doc.data()
}
))

);


};


loadReviews();


},[]);




return(

<>

<Navbar />


<div className="my-reviews">


<h2>
My Reviews
</h2>



{
reviews.length===0 ?

<p>
No reviews submitted yet.
</p>


:


reviews.map(review=>(

<div
className="review-card"
key={review.id}
>


<h3>
{"⭐".repeat(review.rating)}
</h3>


<p>
{review.review}
</p>


<small>
{review.productName}
</small>


</div>


))

}



</div>


<Footer />

</>

);


}


export default MyReviews;