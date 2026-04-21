import { createRoot } from "react-dom/client";
import MeuComponente from "./test";
import "./index.css";

const App = () => {

  
  return (<div><MeuComponente/></div>)

}

const container = document.getElementById("root");
const root = createRoot(container)
root.render(<App/>)