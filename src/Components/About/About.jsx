import "./About.css";
import bestie from "../../assets/Products/bestie.jpg";
function About() {
  return (
    <section className="about">
      
<div className="about-image">
  <img src={bestie} alt="Best Friend" />
</div>

      <div className="about-content">

        <p className="small-title">
          ABOUT RONGTULI
        </p>

        <h2>
          Handmade with love,
          inspired by friendship.
        </h2>

        <p>
          RongTuli began as a shared dream between two best friends during
          college. What started with sketchbooks, paint, and countless ideas
          slowly became something we wanted to share with everyone.
        </p>

        <p>
          Every tote bag, keychain, canvas, coaster, and custom creation is
          carefully handmade with patience, creativity, and love. We believe
          handmade gifts carry emotions that factory-made products never can.
        </p>

        <p>
          Every order supports two artists who chose to stop waiting for
          "someday" and finally started building their dream—one brush stroke
          at a time.
        </p>

      </div>

    </section>
  );
}

export default About;