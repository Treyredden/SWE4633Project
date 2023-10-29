import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Shopping } from "./pages/shopping/shopping";
import { Cart } from "./pages/cart/cart"

function App() {
  return (
    <div className="App">
     <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Shopping />}/>
        <Route path="/cart" element={<Cart />}/>
      </Routes>
     </Router>
    </div>
  );
}

export default App;
