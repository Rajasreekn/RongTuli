import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect, useState } from "react";

function AuthGuard({ children }) {

  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const [user, setUser] = useState(null);


  useEffect(()=>{

    const unsubscribe = auth.onAuthStateChanged((currentUser)=>{

      setUser(currentUser);

      setLoading(false);

    });


    return unsubscribe;

  },[]);



  if(loading){

    return (
      <h2 style={{
        textAlign:"center",
        marginTop:"50px"
      }}>
        Checking Login...
      </h2>
    );

  }



  if(!user){

    return (
      <Navigate
        to="/login"
        state={{
          from: location.pathname
        }}
        replace
      />
    );

  }



  return children;

}


export default AuthGuard;