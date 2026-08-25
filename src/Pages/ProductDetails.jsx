import { 
  useParams, 
  Link, 
  useNavigate 
} from "react-router-dom";

import { 
  useState, 
  useEffect 
} from "react";

import { toast } from "react-toastify";

import products from "../data/Products";

import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

import { auth, db } from "../firebase";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";

import "./ProductDetails.css";



function ProductDetails(){


const {id}=useParams();

const navigate=useNavigate();



const product = products.find(

(item)=>

String(item.id)===String(id)

);



const [liked,setLiked]=useState(false);



const [reviews,setReviews]=useState([]);


const [reviewName,setReviewName]=useState("");

const [reviewText,setReviewText]=useState("");

const [rating,setRating]=useState(0);





useEffect(()=>{


if(!product) return;



const wishlist =

JSON.parse(
localStorage.getItem("wishlist")
) || [];



setLiked(

wishlist.some(

(item)=>

item.id===product.id

)

);



loadReviews();



},[product]);







const loadReviews=async()=>{


if(!product) return;



try{


const q=query(


collection(
db,
"reviews"
),


where(

"productId",

"==",

product.id

)


);



const snap=await getDocs(q);



const data=snap.docs.map(doc=>({


id:doc.id,

...doc.data()


}));



setReviews(data);



}

catch(error){

console.log(error);

}



};







if(!product){


return(

<>

<Navbar />


<h2

style={{

textAlign:"center",

padding:"80px"

}}

>

Product Not Found

</h2>


<Footer />


</>

);


}






const shuffleArray=(array)=>{


return [

...array

].sort(

()=>Math.random()-0.5

);


};





const sameCategory=shuffleArray(


products.filter(

(item)=>

item.category===product.category &&

item.id!==product.id

)

);






const otherProducts=shuffleArray(


products.filter(

(item)=>

item.category!==product.category &&

item.id!==product.id

)

);






const relatedProducts=[

...sameCategory,

...otherProducts

].slice(0,8);






const toggleWishlist=()=>{


const user=

JSON.parse(
localStorage.getItem("user")
);



if(!user){


localStorage.setItem(

"pendingAction",

JSON.stringify({

type:"wishlist",

product

})

);



navigate("/login",{

state:{

from:`/product/${product.id}`

}

});


return;


}




let wishlist=

JSON.parse(

localStorage.getItem("wishlist")

)||[];




const exists=wishlist.some(

(item)=>

item.id===product.id

);




if(exists){


wishlist=

wishlist.filter(

(item)=>

item.id!==product.id

);



setLiked(false);



toast.info(
"Removed from Wishlist 🤍"
);



}

else{


wishlist.push(product);



setLiked(true);



toast.success(
"Added to Wishlist ❤️"
);



}



localStorage.setItem(

"wishlist",

JSON.stringify(wishlist)

);



window.dispatchEvent(

new Event("wishlistUpdated")

);



};
const addToCart = () => {


const user =
JSON.parse(localStorage.getItem("user"));



if(!user){


localStorage.setItem(

"pendingAction",

JSON.stringify({

type:"cart",

product

})

);



navigate("/login",{

state:{

from:`/product/${product.id}`

}

});

return;


}




let cart =

JSON.parse(
localStorage.getItem("cart")
)||[];




const existing = cart.find(

item=>item.id===product.id

);



if(existing){


existing.quantity++;


}

else{


cart.push({

...product,

quantity:1

});


}




localStorage.setItem(

"cart",

JSON.stringify(cart)

);



toast.success(
"Added To Cart 🛒"
);



window.dispatchEvent(

new Event("cartUpdated")

);



};








const buyNow=()=>{


const user=

JSON.parse(
localStorage.getItem("user")
);



if(!user){


localStorage.setItem(

"pendingAction",

JSON.stringify({

type:"buy",

product

})

);



navigate("/login",{

state:{

from:`/product/${product.id}`

}

});


return;

}




localStorage.setItem(

"buyNow",

JSON.stringify({

...product,

quantity:1

})

);



navigate("/checkout");



};








const submitReview=async()=>{


if(

!reviewName ||

!reviewText ||

rating===0

){


toast.error(
"Please complete review"
);


return;


}



try{


await addDoc(

collection(db,"reviews"),

{


productId:product.id,


name:reviewName,


review:reviewText,


rating:rating,


userId:

auth.currentUser?.uid || "",



createdAt:

serverTimestamp()


}

);




toast.success(
"Review Submitted ⭐"
);



setReviewName("");

setReviewText("");

setRating(0);



loadReviews();



}

catch(error){


console.log(error);


toast.error(
"Review submit failed"
);


}



};







return (

<>

<Navbar />



<section className="product-details">



<div className="product-image">


<img

src={product.image}

alt={product.name}

/>


</div>





<div className="product-info">


<h1>

{product.name}

</h1>





<div className="details-price">


{

product.oldPrice &&

<span className="old-price">

₹{product.oldPrice}

</span>

}



<span className="new-price">

₹{product.price}

</span>



</div>





<div className="rating">


{

reviews.length>0

?

`⭐ ${

(

reviews.reduce(

(a,b)=>a+b.rating,

0

)/reviews.length

).toFixed(1)

}`

:

"⭐⭐⭐⭐⭐"

}



({reviews.length} Reviews)


</div>





<p className="description">


Handmade with love and care.

Every piece is unique and specially crafted by RongTuli.



</p>





<div className="details-box">


<h2>
📌 Product Details
</h2>




<p>

<b>Material:</b>{" "}

{product.details?.material}

</p>



<p>

<b>Type:</b>{" "}

{product.details?.type}

</p>




<p>

<b>Size:</b>{" "}

{product.details?.size}

</p>




<p>

<b>Painting:</b>{" "}

{product.details?.painting}

</p>




<p>

<b>Quantity:</b>{" "}

{product.details?.quantity}

</p>



</div>





<div className="custom-box">


<h3>
🎨 Custom Orders Available
</h3>


<p>

Want your own design, colour or name?

Contact us for custom handmade creations.

</p>


</div>






<div className="buttons">


<button

className="wishlist"

onClick={toggleWishlist}

>

{

liked

?

"❤️ Wishlisted"

:

"🤍 Wishlist"

}

</button>





<button

className="buy"

onClick={buyNow}

>

Buy Now

</button>





<button

className="cart"

onClick={addToCart}

>

🛒 Add To Cart

</button>



</div>



</div>


</section>
<section className="reviews">

  <h2>
    Customer Reviews
  </h2>


  <div className="review-summary">

    <h3>
      ⭐⭐⭐⭐⭐
    </h3>

    <p>
      {reviews.length > 0
        ? `${reviews.length} Reviews`
        : "No reviews yet."
      }
    </p>

  </div>



  {
    reviews.map((item)=>(

      <div
        className="review-card"
        key={item.id}
      >

        <h4>
          {item.name}
        </h4>


        <div className="show-stars">

          {"⭐".repeat(item.rating)}

        </div>


        <p>
          {item.review}
        </p>


      </div>

    ))
  }






  <div className="review-form">


    <h3>
      Write a Review
    </h3>



    <input

      type="text"

      placeholder="Your Name"

      value={reviewName}

      onChange={(e)=>
        setReviewName(e.target.value)
      }

    />




    <div className="star-rating">

      {
        [1,2,3,4,5].map((star)=>(

          <span

            key={star}

            className={
              star <= rating
              ?
              "selected"
              :
              ""
            }

            onClick={()=>
              setRating(star)
            }

          >

            ★

          </span>

        ))
      }


    </div>




    <textarea

      placeholder="Share your experience..."

      value={reviewText}

      onChange={(e)=>
        setReviewText(e.target.value)
      }

    />





    <button
      onClick={submitReview}
    >

      Submit Review

    </button>



  </div>


</section>



<section className="related-products">


<h2>
🌸 You May Also Like
</h2>



<div className="related-slider">



{

relatedProducts.map((item)=>(


<Link

key={item.id}

to={`/product/${item.id}`}

className="related-card"

onClick={()=>window.scrollTo({

top:0,

behavior:"smooth"

})}

>


<img

src={item.image}

alt={item.name}

/>



<h4>

{item.name}

</h4>



<p>


{

item.oldPrice &&

<span className="related-old">

₹{item.oldPrice}

</span>

}



<span className="related-new">

₹{item.price}

</span>



</p>



</Link>


))


}



</div>



</section>






<Footer />



</>

);


}


export default ProductDetails;