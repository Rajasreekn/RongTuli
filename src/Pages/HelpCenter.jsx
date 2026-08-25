import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

import "./HelpCenter.css";


function HelpCenter(){

  return(

    <>

      <Navbar />


      <div className="help-page">


        <div className="help-card">


          <h2>
            Help Center
          </h2>


          <p>
            Need help? Contact us anytime.
          </p>



          <a href="tel:+919876543210">
            📞 Call Us
          </a>



          <a href="mailto:rongtuli@gmail.com">
            📧 Email Us
          </a>



          <a
            href="https://instagram.com/rongtuli_25"
            target="_blank"
            rel="noreferrer"
          >
            📷 Instagram
          </a>



          <a
            href="https://wa.me/+916291776858"
            target="_blank"
            rel="noreferrer"
          >
            💬 WhatsApp
          </a>


        </div>


      </div>


      <Footer />

    </>

  );

}


export default HelpCenter;