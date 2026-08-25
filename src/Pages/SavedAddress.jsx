import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import "./SavedAddress.css";

import { auth, db } from "../firebase";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { toast } from "react-toastify";

function SavedAddress() {

  const emptyAddress = {
    name: "",
    phone: "",
    house: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  };

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [formData, setFormData] = useState(emptyAddress);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {

    if (!auth.currentUser) return;

    try {

      const ref = doc(db, "savedAddresses", auth.currentUser.uid);

      const snap = await getDoc(ref);

      if (snap.exists()) {
        setAddresses(snap.data().addresses || []);
      }

    } catch (e) {
      console.log(e);
    }
  };

  const saveFirestore = async (list) => {

    if (!auth.currentUser) return;

    await setDoc(
      doc(db, "savedAddresses", auth.currentUser.uid),
      {
        addresses: list,
      }
    );
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSave = async () => {

    if (
      !formData.name ||
      !formData.phone ||
      !formData.house ||
      !formData.area ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      toast.error("Fill all required fields");
      return;
    }

    let updated = [...addresses];

    if (editingIndex >= 0) {
      updated[editingIndex] = formData;
    } else {

      if (updated.length >= 3) {
        toast.error("Maximum 3 addresses allowed");
        return;
      }

      updated.push(formData);

    }

    setAddresses(updated);

    await saveFirestore(updated);

    toast.success("Address Saved");

    setFormData(emptyAddress);
    setEditingIndex(-1);
    setShowForm(false);
  };

  const handleEdit = (index) => {

    setEditingIndex(index);

    setFormData(addresses[index]);

    setShowForm(true);

  };

  const handleDelete = async (index) => {

    let updated = addresses.filter((item, i) => i !== index);

    setAddresses(updated);

    await saveFirestore(updated);

    toast.success("Address Deleted");

  };
    return (
    <>
      <Navbar />

      <div className="saved-address-page">

        <h2>Saved Addresses</h2>

        <button
          className="add-address-btn"
          onClick={() => {
            setShowForm(true);
            setEditingIndex(-1);
            setFormData(emptyAddress);
          }}
        >
          + Add New Address
        </button>


        {showForm && (

          <div className="address-form">

            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              name="house"
              placeholder="House / Flat No."
              value={formData.house}
              onChange={handleChange}
            />

            <input
              name="area"
              placeholder="Area / Street"
              value={formData.area}
              onChange={handleChange}
            />

            <input
              name="landmark"
              placeholder="Landmark"
              value={formData.landmark}
              onChange={handleChange}
            />

            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />

            <input
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            />

            <input
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
            />


            <button
              className="save-address-btn"
              onClick={handleSave}
            >
              Save Address
            </button>


          </div>

        )}



        <div className="address-list">

          {
            addresses.map((item,index)=>(

              <div className="address-card" key={index}>

                <h3>{item.name}</h3>

                <p>{item.phone}</p>

                <p>
                  {item.house}, {item.area}
                </p>

                <p>
                  {item.landmark}
                </p>

                <p>
                  {item.city}, {item.state} - {item.pincode}
                </p>


                <div className="address-actions">

                  <button
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>


                  <button
                    onClick={() => handleDelete(index)}
                  >
                    Remove
                  </button>

                </div>


              </div>

            ))
          }

        </div>


      </div>


      <Footer />

    </>
  );

}

export default SavedAddress;