import IDE from "./pages/create-ide/IDE";
import Home from "./pages/home/Home";
import { Route, Routes } from "react-router-dom";

function App() {

  return (
    <Routes>
      <Route path="/" element={<IDE />}/>
      <Route path="/ide/:subdomain" element={<Home />}/>
    </Routes>
  );
}

export default App;