import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase";

import "./Signup.css";


function Signup() {


  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);



  const [formData, setFormData] = useState({


    name: "",

    email: "",

    phone: "",

    password: "",

    confirmPassword: "",


  });



  const handleChange = (e) => {


    setFormData({

      ...formData,

      [e.target.name]: e.target.value,


    });


  };




  const handleSignup = async (e) => {


    e.preventDefault();



    if (loading) return;




    if (formData.name.trim().length < 3) {


      alert("Please enter your full name.");

      return;


    }




    if (!/^[0-9]{10}$/.test(formData.phone)) {


      alert("Phone number must be 10 digits.");

      return;


    }





    if (formData.password.length < 6) {


      alert("Password must contain at least 6 characters.");

      return;


    }





    if (formData.password !== formData.confirmPassword) {


      alert("Passwords do not match.");

      return;


    }





    setLoading(true);




    try {


      const userCredential =

        await createUserWithEmailAndPassword(

          auth,

          formData.email.trim(),

          formData.password

        );



      const user = userCredential.user;





      await updateProfile(user, {


        displayName: formData.name.trim(),


      });





      await setDoc(

        doc(db, "users", user.uid),

        {


          uid: user.uid,

          name: formData.name.trim(),

          email: formData.email.trim(),

          phone: formData.phone.trim(),


          createdAt: serverTimestamp(),


        }


      );





      localStorage.setItem(


        "user",


        JSON.stringify({


          uid: user.uid,

          email: user.email,

          displayName: formData.name.trim(),


        })


      );





      window.dispatchEvent(


        new Event("storage")


      );





      const pending = JSON.parse(

        localStorage.getItem("pendingAction")

      );





      if (pending) {




        if (pending.type === "wishlist") {


          let wishlist =

            JSON.parse(

              localStorage.getItem("wishlist")

            ) || [];





          const exists = wishlist.some(

            item => item.id === pending.product.id

          );





          if (!exists) {


            wishlist.push(

              pending.product

            );



            localStorage.setItem(

              "wishlist",

              JSON.stringify(wishlist)

            );


          }





          localStorage.removeItem(

            "pendingAction"

          );





          navigate("/wishlist");


          return;


        }
                if (pending.type === "cart") {


          let cart =

            JSON.parse(

              localStorage.getItem("cart")

            ) || [];





          const existing =

            cart.find(

              item => item.id === pending.product.id

            );





          if (existing) {


            existing.quantity++;


          } else {


            cart.push({


              ...pending.product,


              quantity: 1,


            });


          }





          localStorage.setItem(


            "cart",


            JSON.stringify(cart)


          );





          localStorage.removeItem(


            "pendingAction"


          );





          navigate("/cart");


          return;



        }





        if (pending.type === "buy") {



          localStorage.setItem(


            "buyNow",


            JSON.stringify({


              ...pending.product,


              quantity: 1,


            })


          );





          localStorage.removeItem(


            "pendingAction"


          );





          navigate("/checkout");


          return;



        }



      }





      alert("Account Created Successfully ✅");

      navigate("/");





    } catch (error) {



      console.error(error);




      switch (error.code) {



        case "auth/email-already-in-use":


          alert(

            "This email is already registered."

          );


          break;




        case "auth/invalid-email":


          alert(

            "Please enter a valid email."

          );


          break;




        case "auth/weak-password":


          alert(

            "Password should be at least 6 characters."

          );


          break;




        default:


          alert(error.message);



      }




    } finally {



      setLoading(false);



    }




  };






  return (



    <div className="signup-page">



      <div className="signup-box">



        <h1>Create Account</h1>





        <form onSubmit={handleSignup}>





          <input


            type="text"


            name="name"


            placeholder="Full Name"


            value={formData.name}


            onChange={handleChange}


            required


          />





          <input


            type="email"


            name="email"


            placeholder="Email Address"


            value={formData.email}


            onChange={handleChange}


            required


          />





          <input


            type="tel"


            name="phone"


            placeholder="Phone Number"


            value={formData.phone}


            onChange={handleChange}


            maxLength={10}


            required


          />





          <input


            type="password"


            name="password"


            placeholder="Password"


            value={formData.password}


            onChange={handleChange}


            minLength={6}


            required


          />





          <input


            type="password"


            name="confirmPassword"


            placeholder="Confirm Password"


            value={formData.confirmPassword}


            onChange={handleChange}


            minLength={6}


            required


          />





          <button


            type="submit"


            disabled={loading}


          >


            {


              loading


              ? "Creating Account..."


              : "Create Account"


            }



          </button>





        </form>





        <p>


          Already have an account?


          <Link to="/login">


            {" "}Login


          </Link>



        </p>





      </div>



    </div>



  );



}



export default Signup;