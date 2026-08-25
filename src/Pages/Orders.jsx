import { useEffect, useState } from "react";

import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

import { auth, db } from "../firebase";

import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

import "./Orders.css";


function Orders(){


const [orders,setOrders] = useState([]);

const [loading,setLoading] = useState(true);





useEffect(()=>{


const fetchOrders = async()=>{


try{


const user = auth.currentUser;


if(!user){

setLoading(false);

return;

}




const q = query(

collection(db,"orders"),

where(
"userId",
"==",
user.uid
),

orderBy(
"createdAt",
"desc"
)

);




const snapshot = await getDocs(q);




const data = snapshot.docs.map(doc=>(


{

id:doc.id,

...doc.data()

}


));



setOrders(data);



}

catch(error){


console.log(error);


}



setLoading(false);



};



fetchOrders();



},[]);









return(

<>


<Navbar />



<div className="orders-page">


<h2>
My Orders
</h2>





{

loading ?

(

<p>
Loading Orders...
</p>

)

:

orders.length===0

?

(

<p>
No Orders Found
</p>

)

:

(

orders.map(order=>(


<div

className="order-card"

key={order.id}

>


<h3>

Order ID:

{order.id}

</h3>





<p>

Status:

<strong>

{order.status}

</strong>

</p>





<p>

Payment:

{order.paymentMethod}

</p>






<p>

Amount:

₹{order.total}

</p>






<h4>
Products
</h4>



{

order.items?.map(item=>(


<p key={item.id}>

{item.name}

×

{item.quantity}

</p>


))


}







<h4>
Delivery Address
</h4>



<p>

{order.customer?.address}

</p>


<p>

{order.customer?.district},

{order.customer?.state}

</p>


<p>

PIN:

{order.customer?.pincode}

</p>





<p>

🚚 Delivery:

{order.deliveryTime}

</p>





</div>


))


)

}



</div>



<Footer />

</>


);


}


export default Orders;