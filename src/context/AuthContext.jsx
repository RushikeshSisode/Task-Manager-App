import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }); 

    return () => unsubscribe(); // Cleanup function When component unmounts then Firebase listener is removed, Prevents memory leaks
  }, []); // empty dependecy array so the function inside useEffect will run only 1 time i.e when the component is mounted Initially.
//   So this effect runs only one time when AuthProvider loads

  return (
    <AuthContext.Provider value={{ user }}>
      {!loading && children} 
      {/* the above is conditional rendering using logical AND (&&):

If loading === false → show children
If loading === true → show nothing 
&
 children is a special, automatic prop , children is not a random name — it’s a special prop in React.*/}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);




