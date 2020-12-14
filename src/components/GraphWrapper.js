import React from "react";
import {Graph} from "react-d3-graph";

const myConfig = 
{
    "automaticRearrangeAfterDropNode": false,
    "collapsible": false,
    "directed": true,
    "focusAnimationDuration": 0.75,
    "focusZoom": 1,
    "height": 400,
    "highlightDegree": 1,
    "highlightOpacity": 0.2,
    "linkHighlightBehavior": true,
    "maxZoom": 8,
    "minZoom": 0.1,
    "nodeHighlightBehavior": true,
    "panAndZoom": false,
    "staticGraph": false,
    "staticGraphWithDragAndDrop": false,
    "width": 800,
    "d3": {
      "alphaTarget": 0.05,
      "gravity": -400,
      "linkLength": 300,
      "linkStrength": 1,
      "disableLinkForce": false
    },
    "node": {
      "color": "#d3d3d3",
      "fontColor": "black",
      "fontSize": 12,
      "fontWeight": "normal",
      "highlightColor": "red",
      "highlightFontSize": 12,
      "highlightFontWeight": "bold",
      "highlightStrokeColor": "SAME",
      "highlightStrokeWidth": 1.5,
      "labelProperty": "name",
      "mouseCursor": "pointer",
      "opacity": 1,
      "renderLabel": true,
      "size": 450,
      "strokeColor": "none",
      "strokeWidth": 1.5,
      "svg": "",
      "symbolType": "circle"
    },
    "link": {
      "color": "#d3d3d3",
      "fontColor": "red",
      "fontSize": 10,
      "fontWeight": "normal",
      "highlightColor": "blue",
      "highlightFontSize": 8,
      "highlightFontWeight": "bold",
      "mouseCursor": "pointer",
      "opacity": 1,
      "renderLabel": false,
      "semanticStrokeWidth": false,
      "strokeWidth": 4,
      "markerHeight": 6,
      "markerWidth": 6
    }
  };

class SketchGraph extends React.Component {
    constructor(props){
        super(props);
        let data = JSON.parse(localStorage.getItem("graphData"));
        if(data != null)
        {
            this.state = {
                nodeCount: data.nodeCount,
                linkCount: data.linkCount,
                graphNodes: data.nodes,
                graphLinks: data.links,
                ActiveId: ""
    
            };
        }
        else{
            this.state = {
                nodeCount: 0,
                linkCount: 0,
                graphNodes: [],
                graphLinks: [],
                ActiveId: ""
            }
        }
        
    }

    setActiveId = (nodeId) =>{
        this.setState({ActiveId: nodeId});
    }

    AddNode = (event) => {
        console.log(event);
        let data = JSON.parse(localStorage.getItem("graphData"));
        let newNodes = this.state.graphNodes;
        var newNodeCount = this.state.nodeCount + 1;
        var newNode = {
            id: "Node " + newNodeCount,
            nodeNum: this.state.nodeCound,
            x: event.clientX,
            y: event.clientY,

        }
        newNodes[this.state.nodeCount] = newNode;
        if(data != null)
        {
            data.nodes = newNodes;
            data.nodeCount = data.nodeCount + 1;
        }
        else{
            data = {
                nodes: [{id: "Node 1",
                         nodeNum: 0,
                         X: event.ClientX,
                         Y: event.ClientY,

                        }],
                links: [],
                nodeCount: 1,
                linkCount: 0
            }
        }
        
        localStorage.setItem("graphData", JSON.stringify(data));
        this.setState({graphNodes: newNodes, nodeCount: newNodeCount });
    }

    clearGraph = (event) =>
    {
        console.log(event);
        let data = JSON.parse(localStorage.getItem("graphData"));
        data = {
            nodes: [],
            links: [],
            nodeCount: 0,
            linkCount: 0
        }
        localStorage.setItem("graphData", JSON.stringify(data));
        this.setState({graphNodes: [], nodeCount: 0, graphLinks: []});
    }

    onClickGraph = function(event) {
        console.log(event);
        console.log(this);
        console.log(this.state);
    
      }

    onClickNode = (nodeId, event) =>{
        console.log(event);
        console.log(nodeId);
        console.log(this.state);
        let data = JSON.parse(localStorage.getItem("graphData"));
        if(this.state.ActiveId === "")
        {
            this.setState({ActiveId: nodeId});
        }
        else
        {
            var newLinks = this.state.graphLinks;
            var newLink = {
                source: this.state.ActiveId,
                target: nodeId
            };
            if(this.checkLinkAllowed(newLink))
            {
                newLinks[this.state.linkCount] = newLink;
                data.links = newLinks;
                data.linkCount = this.state.linkCount + 1;
                localStorage.setItem("graphData", JSON.stringify(data));
                this.setState({graphLinks: newLinks, linkCount: data.linkCount, ActiveId: ""});
            }
            else{
                console.log("Sorry, The application currently does not suport Parrallel edges");
                this.setState({ActiveId: ""});
            }
            
        }
    }
    onMouseOverNode = function(nodeId){
        console.log(`Mouse over node ${nodeId}`);
    }
    
    checkLinkAllowed = (link) =>
    {
        for( var i = 0; i < this.state.graphLinks.length; i++)
        {
            if(link.target === this.state.graphLinks[i].target 
                && link.source === this.state.graphLinks[i].source)
                {
                    return false;
                }
        }
        return true;

    }

    render(){

        if(this.state.nodeCount > 0)
        {
            console.log(this.state);
            return(
                <span className="sketch-graph">
    
                <Graph
    
                    id="Main_Content_graph"
                    data={
                        {nodes: this.state.graphNodes,
                        links: this.state.graphLinks}
                    }
                    config = {myConfig}
                    onClickGraph = {this.AddNode}
                    onClickNode = {this.onClickNode}
                    onMouseOverNode={this.onMouseOverNode}
                />  
                <button id="ClearGraphBtn" onClick={this.clearGraph}>Clear Graph</button>
                </span>
               
            );
        }
        else{
            return(
            <span className="empty-graph">
                <h4>There is currently No Graph Data</h4>
                <button type="button"
                       id="AddNodebtn"
                       onClick={this.AddNode}
                       >
                Create a New Graph
                </button>

            </span>
            );
        }
        
    }
}
export default SketchGraph;
/*

export default function SketchPageGraph(props){
    var nodes = ""; // Create function or prop to trach all current nodes
    var links = ""; //Create function or prop to get all current links
    return(
        <span className="course-graph">
            <Graph
                id="graph-id"

                
                config = {myConfig}
                onClickNode = {props.onClickNode}
                onClickGraph = {props.onClickGraph}
                />
        </span>
    );
}
*/
