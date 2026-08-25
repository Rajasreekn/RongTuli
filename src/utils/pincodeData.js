export const verifyPincode = async (pincode) => {

  try {

    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );


    const data = await response.json();


    if (
      data[0].Status === "Success" &&
      data[0].PostOffice
    ) {

      return data[0].PostOffice[0];

    }


    return null;


  } catch (error) {

    console.log("Pincode API Error:", error);

    return null;

  }

};