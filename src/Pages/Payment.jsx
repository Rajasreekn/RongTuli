import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

import { toast } from "react-toastify";

import { auth, db } from "../firebase";

import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import "./Payment.css";


function Payment(){


const navigate = useNavigate();


const [method,setMethod] = useState("");

const [upi,setUpi] = useState("");



const orderData =
JSON.parse(
localStorage.getItem("checkoutData")
) || {};





const completePayment = async()=>{


if(!method){

toast.error(
"Select Payment Method"
);

return;

}




if(
method==="Other" &&
!upi.trim()
){

toast.error(
"Enter UPI ID"
);

return;

}




if(
!orderData.items ||
orderData.items.length===0
){

toast.error(
"Order data missing. Please checkout again."
);

navigate("/cart");

return;

}




const user =
auth.currentUser;



if(!user){

toast.error(
"Please login again"
);

navigate("/login");

return;

}



try{


/*
  REAL PAYMENT GATEWAY
  yaha Razorpay/Cashfree response aayega

  Payment success ke baad hi
  neeche order create hoga

*/



const order = {


userId:user.uid,


customer:
orderData.customer || {},



items:
orderData.items || [],



subtotal:
Number(orderData.subtotal)||0,



shipping:
Number(orderData.shipping)||0,



total:
Number(orderData.total)||0,



deliveryTime:
orderData.deliveryTime || "",



paymentMethod:
method,



paymentStatus:
"Paid",



status:
"Order Confirmed",



createdAt:
serverTimestamp(),



};




const orderRef =
await addDoc(

collection(db,"orders"),

order

);



console.log(
"ORDER ID:",
orderRef.id
);



localStorage.removeItem(
"checkoutData"
);


localStorage.removeItem(
"cart"
);


localStorage.removeItem(
"buyNow"
);



toast.success(
"Order Placed Successfully 🎉"
);



setTimeout(()=>{

navigate("/orders");

},1500);



}


catch(error){


console.log(
"ORDER ERROR",
error
);


toast.error(
"Order Failed"
);


}



};






return(

<>

<Navbar />


<div className="payment-page">


<div className="payment-box">



<h2>
Payment Method
</h2>




<label>

<input

type="radio"

name="payment"

value="UPI"

onChange={(e)=>
setMethod(e.target.value)
}

/>

UPI Payment

</label>






<label>

<input

type="radio"

name="payment"

value="Other"

onChange={(e)=>
setMethod(e.target.value)
}

/>

Other Payment Mode

</label>






{

method==="Other" &&

<div className="upi-input">


<input

type="text"

placeholder="Enter UPI ID"

value={upi}

onChange={(e)=>
setUpi(e.target.value)
}

/>



<p>

Example:
yourname@upi

</p>


</div>


}





<div className="payment-total">


<h3>
Amount To Pay
</h3>


<h2>
₹{orderData.total || 0}
</h2>


</div>






<button

className="pay-btn"

onClick={completePayment}

>

Pay Now & Place Order

</button>



</div>


</div>




<Footer />


</>


);


}


export default Payment;