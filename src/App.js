import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/Homepage';
import Products from './Pages/Products/Products';
import HomepageManager from './Pages/HomepageManager';
import Users from './Pages/Users';
import Delivery from './Pages/Delivery';
import DeliveryHistory from './Pages/DeliveryHistory';
import AuthPanel from './Pages/Authpanel';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';
import { getDatabase, ref, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [homepageData, setHomepageData] = useState({});

  useEffect(() => {
    const authStatus = sessionStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  // const firebaseConfig = {
  //   apiKey: "AIzaSyAwWznhhP09HYpOZAdu55_6KiRhWaTkHog",
  //   authDomain: "figure-fiesta.firebaseapp.com",
  //   projectId: "figure-fiesta",
  //   storageBucket: "figure-fiesta.appspot.com",
  //   messagingSenderId: "301445630990",
  //   appId: "1:301445630990:web:d4d95308f81cf31ee5805f",
  //   databaseURL: "https://figure-fiesta-default-rtdb.firebaseio.com/",
  // };

  const firebaseConfig = {
    apiKey: "AIzaSyBcJiEMvAWXoA16tMiwh_VD1g0rDmsRUWg",
    authDomain: "figure-fiesta-7e575.firebaseapp.com",
    projectId: "figure-fiesta-7e575",
    storageBucket: "figure-fiesta-7e575.firebasestorage.app",
    messagingSenderId: "866889663948",
    appId: "1:866889663948:web:2ce3def48b74fe5b4b8969",
    databaseURL: "https://figure-fiesta-7e575-default-rtdb.firebaseio.com/",
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const Ref = {ref};

  useEffect(() => {
    const database_ref = Ref.ref(database, 'items/');
    onValue(database_ref, (snapshot) => {
      const data = snapshot.val();
      const productsArray = data ? Object.values(data) : [];
      setProducts(productsArray);
    });
  }, []);

  useEffect(() => {
    const database_ref = Ref.ref(database, 'users/');
    onValue(database_ref, (snapshot) => {
      const data = snapshot.val();
      const productsArray = data ? Object.values(data) : [];
      setUsers(productsArray);
    });
  }, []);

  useEffect(() => {
    const database_ref = Ref.ref(database, 'orders/');
    onValue(database_ref, (snapshot) => {
      const data = snapshot.val();
      const productsArray = data ? Object.values(data) : [];
      setOrders(productsArray);
    });
  }, []);

  useEffect(() => {
    const database_ref = Ref.ref(database, 'homepageData/');
    onValue(database_ref, (snapshot) => {
      const data = snapshot.val();
      console.log('1',data);
      const productsArray = data ? data : {};
      setHomepageData(productsArray);
    });
  }, []);

console.log("Products", products, "Users", users, "Orders", orders);
  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('isAuthenticated', 'true');
  };


  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isAuthenticated ? <HomePage onLogout={handleLogout} /> : <AuthPanel onLogin={handleLogin} />} />
          <Route path="/home" element={isAuthenticated ? <HomePage onLogout={handleLogout} /> : <Navigate to="/" />} />
          <Route path="/products/*" element={isAuthenticated ? <Products onLogout={handleLogout} database={database} Ref={Ref} set={set} products={products} setProducts={setProducts} update={update} remove={remove} homepageData = {homepageData.categories} /> : <Navigate to="/" />} />
          <Route path="/homepage" element={isAuthenticated ? <HomepageManager onLogout={handleLogout} database={database} Ref={Ref} update={update} homepageData={homepageData} remove={remove} /> : <Navigate to="/" />} />
          <Route path="/users" element={isAuthenticated ? <Users onLogout={handleLogout} users={users} setUsers={setUsers} /> : <Navigate to="/" />} />
          <Route path="/delivery" element={isAuthenticated ? <Delivery onLogout={handleLogout} users={users} products={products} orders={orders} setOrders={setOrders} database={database} Ref={Ref} update={update} /> : <Navigate to="/" />} />
          <Route path="/history" element={isAuthenticated ? <DeliveryHistory onLogout={handleLogout} users={users} products={products} orders={orders} database={database} Ref={Ref} update={update}  /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
