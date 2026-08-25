import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

import shippingRules from "../utils/shipping";
import districtData from "../data/districtData";

import { toast } from "react-toastify";

import { auth, db } from "../firebase";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import {
  onAuthStateChanged,
} from "firebase/auth";

import "./Checkout.css";


const FREE_SHIPPING_THRESHOLD = 599;


function Checkout() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [user, setUser] = useState(null);

  const [addresses, setAddresses] = useState([]);

  const [showAddresses, setShowAddresses] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    district: "",
    pincode: ""
  });


  // LOAD CART / BUY NOW
  useEffect(() => {

    const buyNow =
      JSON.parse(
        localStorage.getItem("buyNow")
      );

    if (buyNow) {

      setCart([
        {
          ...buyNow,
          quantity: 1,
          price: Number(buyNow.price) || 0
        }
      ]);

      return;
    }


    const savedCart =
      JSON.parse(
        localStorage.getItem("cart")
      ) || [];


    setCart(
      savedCart.map(item => ({

        ...item,

        quantity:
          Number(item.quantity) || 1,

        price:
          Number(
            String(item.price).replace("₹", "")
          ) || 0

      }))
    );

  }, []);


  // LOAD USER + SAVED ADDRESS
  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {

          if (!currentUser)
            return;

          setUser(currentUser);


          const userSnap =
            await getDoc(
              doc(
                db,
                "users",
                currentUser.uid
              )
            );


          if (userSnap.exists()) {

            const data =
              userSnap.data();

            setForm(prev => ({
              ...prev,

              name:
                data.name || "",

              phone:
                data.phone || "",

              email:
                data.email || ""
            }));

          }


          const addressSnap =
            await getDoc(
              doc(
                db,
                "savedAddresses",
                currentUser.uid
              )
            );


          if (addressSnap.exists()) {

            setAddresses(
              addressSnap.data().addresses || []
            );

          }

        }
      );


    return () => unsubscribe();

  }, []);


  // CART TOTAL
  const cartTotal =
    cart.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.quantity,
      0
    );


  // SHIPPING
  // ₹599 OR MORE = ₹0 SHIPPING
  const shipping =
    cartTotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : form.state
        ? shippingRules[form.state]?.shipping ??
          shippingRules.default.shipping
        : 0;


  // DELIVERY TIME
  const deliveryTime =
    form.state
      ? shippingRules[form.state]?.delivery ??
        shippingRules.default.delivery
      : "";


  // TOTAL
  const total =
    cartTotal + shipping;


  // FORM CHANGE
  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  // STATE CHANGE
  const handleStateChange = (e) => {

    setForm({

      ...form,

      state: e.target.value,

      district: "",

      pincode: ""

    });

  };


  // SELECT SAVED ADDRESS
  const selectSavedAddress = (address) => {

    setForm(prev => ({

      ...prev,

      name:
        address.name || prev.name,

      phone:
        address.phone || prev.phone,

      address:
        address.house ||
        address.address ||
        "",

      state:
        address.state || "",

      district:
        address.city ||
        address.district ||
        "",

      pincode:
        address.pincode || ""

    }));


    setShowAddresses(false);

    toast.success(
      "Address Selected ✓"
    );

  };


  // CHANGE ADDRESS
  const changeAddress = () => {

    setShowAddresses(true);

  };


  // VERIFY PINCODE
  const verifyPincode = async () => {

    if (form.pincode.length !== 6) {

      toast.error(
        "Enter valid 6 digit pincode"
      );

      return false;

    }


    try {

      const response =
        await fetch(
          `https://api.postalpincode.in/pincode/${form.pincode}`
        );


      const data =
        await response.json();


      if (data[0].Status !== "Success") {

        toast.error(
          "Invalid Pincode"
        );

        return false;

      }


      const postOffice =
        data[0].PostOffice[0];


      const apiState =
        postOffice.State;


      const apiDistrict =
        postOffice.District;


      // CHECK STATE
      if (
        form.state &&
        form.state.toLowerCase() !==
        apiState.toLowerCase()
      ) {

        toast.error(
          `Wrong State. This pincode belongs to ${apiState}`
        );

        return false;

      }


      // CHECK DISTRICT
      if (
        form.district &&
        form.district.toLowerCase() !==
        apiDistrict.toLowerCase()
      ) {

        toast.error(
          `Wrong District. This pincode belongs to ${apiDistrict}`
        );

        return false;

      }


      return true;

    } catch (error) {

      console.log(error);

      toast.error(
        "Pincode verification failed"
      );

      return false;

    }

  };


  // CONTINUE PAYMENT
  const continuePayment = async () => {

    if (
      !form.name ||
      !form.phone ||
      !form.email ||
      !form.address ||
      !form.state ||
      !form.district ||
      !form.pincode
    ) {

      toast.error(
        "Please fill all delivery details"
      );

      return;

    }


    if (!/^[0-9]{10}$/.test(form.phone)) {

      toast.error(
        "Enter valid phone number"
      );

      return;

    }


    const verified =
      await verifyPincode();


    if (!verified)
      return;


    // SAVE ADDRESS
    if (user) {

      const ref =
        doc(
          db,
          "savedAddresses",
          user.uid
        );


      const snap =
        await getDoc(ref);


      let list = [];


      if (snap.exists()) {

        list =
          snap.data().addresses || [];

      }


      const newAddress = {

        id: Date.now(),

        name: form.name,

        phone: form.phone,

        house: form.address,

        area: "",

        landmark: "",

        city: form.district,

        state: form.state,

        pincode: form.pincode

      };


      const exist =
        list.some(
          item =>
            item.pincode ===
              newAddress.pincode &&
            item.house ===
              newAddress.house
        );


      if (!exist && list.length < 3) {

        list.push(newAddress);


        await setDoc(
          ref,
          {
            addresses: list
          }
        );


        setAddresses(list);

      }

    }


    // CHECKOUT DATA
    const checkoutData = {

      customer: form,

      items: cart,

      subtotal: cartTotal,

      shipping: shipping,

      total: total,

      deliveryTime: deliveryTime

    };


    localStorage.setItem(
      "checkoutData",
      JSON.stringify(checkoutData)
    );


    navigate("/payment");

  };


  return (
    <>
      <Navbar />

      <div className="checkout">

        {/* LEFT SIDE */}

        <div className="checkout-left">

          <h2>
            Delivery Details
          </h2>


          {/* CHANGE ADDRESS */}

          {addresses.length > 0 &&
            !showAddresses && (

              <button
                className="change-address-btn"
                onClick={changeAddress}
              >
                📍 Change Address
              </button>

            )}


          {/* SAVED ADDRESSES */}

          {addresses.length > 0 &&
            showAddresses && (

              <div className="saved-address-box">

                <h3>
                  Saved Addresses
                </h3>


                {addresses.map(
                  (address, index) => (

                    <div
                      className="address-item"
                      key={
                        address.id ||
                        index
                      }
                    >

                      <p>
                        <strong>
                          Address {index + 1}
                        </strong>
                      </p>


                      <p>
                        {
                          address.house ||
                          address.address
                        }
                      </p>


                      <p>
                        {
                          address.city ||
                          address.district
                        }
                        {", "}
                        {address.state}
                      </p>


                      <p>
                        PIN : {address.pincode}
                      </p>


                      <button
                        onClick={() =>
                          selectSavedAddress(
                            address
                          )
                        }
                      >
                        Use This Address
                      </button>

                    </div>

                  )
                )}

              </div>

            )}


          {/* NAME */}

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />


          {/* PHONE */}

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />


          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />


          {/* ADDRESS */}

          <textarea
            name="address"
            placeholder="Full Address"
            value={form.address}
            onChange={handleChange}
          />


          {/* STATE */}

          <select
            name="state"
            value={form.state}
            onChange={handleStateChange}
          >

            <option value="">
              Select State
            </option>


            {Object.keys(
              districtData
            ).map(state => (

              <option
                key={state}
                value={state}
              >
                {state}
              </option>

            ))}

          </select>


          {/* DISTRICT */}

          <select
            name="district"
            value={form.district}
            onChange={handleChange}
            disabled={!form.state}
          >

            <option value="">
              Select District
            </option>


            {form.state &&
              districtData[
                form.state
              ].map(district => (

                <option
                  key={district}
                  value={district}
                >
                  {district}
                </option>

              ))
            }

          </select>


          {/* PINCODE */}

          <input
            type="text"
            name="pincode"
            placeholder="Enter Pincode"
            value={form.pincode}
            onChange={handleChange}
          />


          {/* DELIVERY TIME */}

          {deliveryTime && (

            <p className="delivery-time">
              🚚 Estimated Delivery:
              {" "}
              {deliveryTime}
            </p>

          )}

        </div>


        {/* RIGHT SIDE */}

        <div className="checkout-right">

          <h2>
            Order Summary
          </h2>


          {/* ITEMS */}

          {cart.map(item => (

            <div
              className="checkout-item"
              key={item.id}
            >

              <span>
                {item.name}
                {" × "}
                {item.quantity}
              </span>


              <span>
                ₹
                {item.price *
                  item.quantity}
              </span>

            </div>

          ))}


          <hr />


          {/* CART TOTAL */}

          <p>

            <span>
              Cart Total
            </span>

            <span>
              ₹{cartTotal}
            </span>

          </p>


          {/* SHIPPING */}

          <p>

            <span>
              Shipping
            </span>

            <span>
              ₹{shipping}
            </span>

          </p>


          <hr />


          {/* TOTAL */}

          <h2>

            <span>
              Total
            </span>

            <span>
              ₹{total}
            </span>

          </h2>


          {/* PAYMENT */}

          <button
            className="checkout-btn"
            onClick={continuePayment}
          >
            Continue To Payment
          </button>

        </div>

      </div>


      <Footer />

    </>
  );
}


export default Checkout;