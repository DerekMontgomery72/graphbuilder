import './App.css';
import './components/GraphWrapper';
import SketchGraph from './components/GraphWrapper';
import {Graph} from "react-d3-graph";
import wsucougarhead from './wsu-cougarhead.png';


const data = {
  nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
  links: [
      { source: "Harry", target: "Sally" },
      { source: "Harry", target: "Alice" },
  ],
};

function App() {
  return (
    <div className="App">
      <div className="graphWrapper">
        <SketchGraph 
        id="MainContentGraph"
         />
         <br/>
         <br/>
      </div>
      
    </div>
  );
}

export default App;
