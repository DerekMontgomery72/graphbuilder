import React from "react";
import {Graph} from "react-d3-graph";
import LaplacianMatrix from "./LaplaceMatrix";
import ConfigSetup from "./configdiv";
import NodeInfo from "./NodeInfoModal";
import LinkInfo from "./linkInformationModal";
import ColorPicker from "./colorPicker";

import './Styles/graphWrapper.css'


class SketchGraph extends React.Component {
    constructor(props){
        super(props);
            this.state = {
                nodeCount: 0,
                linkCount: 0,
                graphNodes: [],
                graphLinks: [],
                ActiveId: "",
                ActiveLinkSource: "",
                ActiveLinkTarget: "",
                Mode: "Add",
                ShowNodeInfoModal: false,
                ShowLinkInfoModal: false,
                selectedColor: "#d3d3d3",
                Config: 
                    {
                        "automaticRearrangeAfterDropNode": false,
                        "collapsible": false,
                        directed: false,
                        "focusAnimationDuration": 0.75,
                        "focusZoom": 1,
                        "height": 600,
                        "highlightDegree": 1,
                        "highlightOpacity": 0.2,
                        "linkHighlightBehavior": true,
                        "maxZoom": 8,
                        "minZoom": 0.1,
                        "nodeHighlightBehavior": true,
                        "panAndZoom": false,
                        "staticGraph": false,
                        "staticGraphWithDragAndDrop": true,
                        "width": "80%",
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
                        link: {
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
                            "markerWidth": 6,
                            type: "STRAIGHT",
                        }
                    } 
            };  
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
            id: "n" + newNodeCount,
            nodeNum: this.state.nodeCount,
            x: event.clientX,
            y: event.clientY,
            color: "#d3d3d3",
            attachedLinks: [],

        }
        newNodes[this.state.nodeCount] = newNode;
        if(data != null)
        {
            data.nodes = newNodes;
            data.nodeCount = data.nodeCount + 1;
        }
        else{
            data = {
                nodes: [{id: "n1",
                         nodeNum: 0,
                         X: event.clientX,
                         Y: event.clientY,
                         color: "#d3d3d3",
                         attachedLinks:[],
                        }],
                links: [],
                nodeCount: 1,
                linkCount: 0
            }
        }
        
        //localStorage.setItem("graphData", JSON.stringify(data));
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
            linkCount: 0,
            
        }
        localStorage.setItem("graphData", JSON.stringify(data));
        this.setState({
            graphNodes: [],
            nodeCount: 0,
            graphLinks: [],
            linkCount: 0,
            ActiveId: "",
            Mode: "Add",
            });
    }

    onClickGraph = function(event) {
        console.log(event);
        console.log(this);
        console.log(this.state);
    
      }

    onClickNode = (nodeId) =>{
        let newNodeList = this.state.graphNodes;
        let newLinks = this.state.graphLinks;
        switch(this.state.Mode)
        {
            case "Add": // Add a new link or set actively clicked
                if(this.state.ActiveId === "")
                {
                    this.setState({ActiveId: nodeId});
                }
                else
                {
                    this.addLink(this.state.ActiveId, nodeId, newNodeList, newLinks);
                    console.log(newNodeList);
                    this.setState({
                         
                        graphLinks: newLinks,
                        linkCount: newLinks.length,
                        nodeCount: newNodeList.length,
                        ActiveId: ""
                    });
                }
            break;

            case "Delete": // remove the selected node from the node list, and all links to it
                this.deleteNode(nodeId, newNodeList, newLinks);
                console.log(newLinks);
                this.setState({graphNodes: newNodeList, 
                    graphLinks: newLinks, 
                    linkCount: newLinks.count, 
                    nodeCount: newNodeList.length});

            break;
            case "Info":
                this.setState({ActiveId: nodeId, ShowNodeInfoModal: true});
                break;
            case "Color":
                let node = this.getNode(nodeId, newNodeList);
                node.color = this.state.selectedColor;
                this.setState({graphNodes: newNodeList});
                break;
            default:
                break;

        }

    }

    deleteNode = (nodeId, newNodes, newLinks) => {
        //let newNodes = this.state.graphNodes;
        let node = this.getNode(nodeId, newNodes);
        let linksToDelete = node.attachedLinks;
        console.log(linksToDelete);
        var len = linksToDelete.length;
        for(var i = 0; i < len; i++)
        {
            let linkToDelete = linksToDelete.pop();
            console.log(linkToDelete);
            this.deleteLink(linkToDelete.source, linkToDelete.target, newLinks, newNodes);
        }
        for(var j in newNodes)
        {
            if(newNodes[j].id === nodeId)
            {
                newNodes.splice(j, 1);
            }
        }
        //this.setState({graphNodes: newNodes, nodeCount: newNodeCount});
    }

    deleteLink = (source, target, newLinks, newNodes) =>
    {
        //let newLinks = this.state.graphLinks;
        //let newNodes = this.state.graphNodes;
        let sourceNode = this.getNode(source, newNodes);
        let targetNode = this.getNode(target, newNodes);
        console.log(source);
        console.log(sourceNode);
        console.log(target);
        console.log(targetNode);

        for( var i in sourceNode.attachedLinks){
            if(sourceNode.attachedLinks[i].source === source && sourceNode.attachedLinks[i].target === target)
            {
                sourceNode.attachedLinks.splice(i, 1);
            }
        }
        for(var j in targetNode.attachedLinks)
        {
            if(targetNode.attachedLinks[j].source === source && targetNode.attachedLinks[j].target === target){
                targetNode.attachedLinks.splice(j,1);
            }
        }
        for(var k in newLinks){
            if(newLinks[k].source === source && newLinks[k].target === target){
                newLinks.splice(k, 1);
            }
        }
        //this.setState({garphLinks: newLinks, graphNodes: newNodes, linkCount: newLinkCount});
    }
    addLink = (source, target, newNodeList, newLinks) =>
    {
        //let newLinks = this.state.graphLinks;
        let newSource = this.getNode(source, newNodeList);
        let newTarget = this.getNode(target, newNodeList);
        var newLink = {
            source: source,
            target: target,
            sourceNode: newSource,
            targetNode: newTarget,
            color: "#d3d3d3"
        };

        if(this.checkLinkAllowed(newLink))
        {
            newLinks.push(newLink);
            newTarget.attachedLinks.push(newLink);
            newSource.attachedLinks.push(newLink);
            
            //this.setState({graphLinks: newLinks, linkCount: newLinkCount , ActiveId: "", graphNodes: newNodeList});
        }
        else{
            console.log("Sorry, The application currently does not suport Parrallel edges");
            this.setState({ActiveId: ""});
        }        

    }
    onClickLink = (source, target) =>
    { 
        let newLinks = this.state.graphLinks;
        let newNodes = this.state.graphNodes;

        switch(this.state.Mode){
            case "Add":
                // No Action
                break;
            case "Delete":
                this.deleteLink(source, target,newLinks, newNodes);
                this.setState({graphLinks: newLinks, 
                    graphNodes: newNodes,
                    linkCount: newLinks.length, 
                    nodeCount: newNodes.length  });
                break;
            case "Info":
                this.setState({ActiveLinkSource: source, ActiveLinkTarget: target, ShowLinkInfoModal: true});
                break;
            case "Color":
                let link = this.getLink(source, target, newLinks);
                link.color = this.state.selectedColor;
                this.setState({graphLinks: newLinks});
                break;
            default:
                break;
        }
    }

    checkLinkIsBridge = (source, target) =>
    {
        let isBridge = false;
        let nodeList = this.state.graphNodes;
        let linkList = this.state.graphLinks;
        let componentCount = this.getComponentCount(nodeList);
        console.log(componentCount);
        this.deleteLink(source, target, linkList, nodeList);
        let newComponentCount = this.getComponentCount(nodeList);
        console.log(newComponentCount);
        if(componentCount < newComponentCount)
        {
            isBridge = true;
        }
        this.addLink(source, target, nodeList, linkList);
        return isBridge;

    }

    onMouseOverNode = function(nodeId){
        console.log(`Mouse over node ${nodeId}`);
    }

    
    addNodeGraphBehavior = () =>{
        this.setState({Mode: "Add", ActiveId: ""});
    }
    deleteNodeGraphBehavior = () =>{
        this.setState({Mode: "Delete", ActiveId: ""});
    }
    informationbtnBehavior = () =>{
        this.setState({Mode: "Info", ActiveId:""});
    }
    colorBtnBehavior = () =>{
        this.setState({Mode: "Color", ActiveId:""});
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

    getNode = (nodeId, nodeList) =>
    {
        for( var i = 0; i < nodeList.length; i++)
        {
            if(nodeId === nodeList[i].id)
            {
                return nodeList[i];
            }
        }
        return null;
    }
    getLink = (linkSource, linkTarget, linkList) =>
    {
        for(var i in linkList){
            if(linkList[i].source === linkSource && linkTarget === linkList[i].target )
            {
                return linkList[i];
            }
        }
        return null;
    }

    getLinkIndex = (linkSource, linkTarget, linkList) =>
    {
        for(var i in linkList){
            if(linkList[i].source === linkSource && linkTarget === linkList[i].target){
                return i;
            }
        }
        return -1;
    }
    getComponentCount = (nodeList) =>
    {
        let unvisited = nodeList.map( function(item){
            item.visited = false;
            return item;
        } );        
        let count = 0;
        
        for(var i in unvisited)
        {
            if(unvisited[i].visited === false)
            {
                this.DFSHelper(unvisited, unvisited[i]);
                count += 1;
            }
        }
        console.log("Component Count");
        return count;

    }

    DFSHelper = (nodeList, node) =>
    {
        node.visited = true;
            let neighbors = this.getNeighbors(nodeList, node);
            for(var i in neighbors)
            {
                if(neighbors[i].visited === false)
                {
                    this.DFSHelper(nodeList, neighbors[i]);
                }
            }
    }

    getNeighbors = (nodeList, node) =>
    {
        let links = node.attachedLinks;
        let tempNode = node;
        let neighbors = [];
        if(links.length === 0)
        {
            return [];
        }
        for(var i in links)
        {
            if(links[i].source === node.id)
            {
                tempNode = this.getNode(links[i].target, nodeList);

            }
            else{
                tempNode = this.getNode(links[i].source, nodeList);
            }
            neighbors.push(tempNode);
        }
        return neighbors;
    }

    directedcbChange = (event) =>
    {
        let config = this.state.Config;
        console.log("checkChange");
        if(config.directed === true)
        {
            config.directed = false;
        }
        else{
            config.directed = true;
        }
        this.setState({Config: config});
    }
    linkTypeRbChange = (event) =>
    {
        let config = this.state.Config;
        console.log("Radio Button Change Event");
        console.log(event);

        if(config.link.type === "STRAIGHT"){
            config.link.type = "CURVE_SMOOTH";
        }
        else{
            config.link.type = "STRAIGHT"
        }
        this.setState({Config: config});
    }

    getNodeModalInfo = () =>
    {
        let returnInfo = {
            id: "",
            degree: 0,
            neighbors: [],
            color: ""
        };
        if(this.state.Mode === "Info" && this.state.ShowNodeInfoModal === true)
        {
            if(this.state.ActiveId !== "")
        {
            let node = this.getNode(this.state.ActiveId, this.state.graphNodes);
            let neighbors = this.getNeighbors(this.state.graphNodes, node);

            returnInfo = {
                id: node.id,
                degree: neighbors.length,
                neighbors: neighbors,
                color: node.color,
            }
        }
        }
        
        return returnInfo;
        
    }
    NodeModalCloseClick = () =>
    {
        this.setState({ShowNodeInfoModal: false, ActiveId: ""});
    }

    getLinkModalInfo = () =>
    {
        let modalInfo = {
            source: "",
            target: "",
            isBridge: false
        };
        if(this.state.ActiveLinkSource === "" || this.state.ActiveLinkTarget === "")
        {
            return modalInfo;
        }
        modalInfo = {
            source: this.state.ActiveLinkSource,
            target: this.state.ActiveLinkTarget,
            isBridge: this.checkLinkIsBridge(this.state.ActiveLinkSource, this.state.ActiveLinkTarget)
        };
        console.log(modalInfo.isBridge);
        return modalInfo;
    }
    linkModalCloseClick = () =>
    {
        console.log("in close fnctn");
        this.setState({ShowLinkInfoModal: false, ActiveLinkSource: "", ActiveLinkTarget: ""});
    }

    rbColorPickChange = (event) =>
    {
        console.log(event);
    }

    colorChange = (color) =>
    {
        this.setState({selectedColor: color});
    }

    setClassList = () =>
    {
        let list = [];
        for(var i = 0; i < 4; i++)
        {
            list.push("btn btn-secondary ");
        }
        switch(this.state.Mode)
        {
            case "Add":
                list[0] = list[0] + "activeModeBtn";
                list[1] = list[1] + "inactiveModeBtn";
                list[2] = list[2] + "inactiveModeBtn";
                list[3] = list[3] + "inactiveModeBtn";
                break;
            case "Delete":
                list[0] += "inactiveModeBtn";
                list[1] += "activeModeBtn";
                list[2] += "inactiveModeBtn";
                list[3] += "inactiveModeBtn";
                break;
            case "Info":
                list[0] += "inactiveModeBtn";
                list[1] += "inactiveModeBtn";
                list[2] += "activeModeBtn";
                list[3] += "inactiveModeBtn";
                break;
            case "Color":
                list[0] += "inactiveModeBtn";
                list[1] += "inactiveModeBtn";
                list[2] += "inactiveModeBtn";
                list[3] += "activeModeBtn";
                break;
            default:
                list[0] += "inactiveModeBtn";
                list[1] += "inactiveModeBtn";
                list[2] += "inactiveModeBtn";
                list[3] += "inactiveModeBtn";
                break;
        }
        return list;
    }

    render(){

        let componentCount = this.getComponentCount(this.state.graphNodes);
        let classList = this.setClassList();
        let nodeInfo = this.getNodeModalInfo();
        let linkInfo = this.getLinkModalInfo();
        let showNodeInfo = this.state.ShowNodeInfoModal === true;
    
        if(this.state.nodeCount > 0)
        {
            console.log(this.state);
            return(
                <span className="">
                <table style={{width: '100%' }}>
                    <tbody>
                    <tr className="headTableRow">
                        <td className="headTableCell">
                            <h3>Nodes: {this.state.nodeCount} </h3>
                        </td>
                        <td className="headTableCell">
                            <h3>Links: {this.state.linkCount}</h3>
                        </td>
                        <td className="headTableCell">
                            <h3>Comp: {componentCount}</h3>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <Graph               
                    id="Main_Content_graph"
                    data={
                        {nodes: this.state.graphNodes,
                        links: this.state.graphLinks}
                    }
                    config = {this.state.Config}
                    onClickGraph = {this.AddNode}
                    onClickNode = {this.onClickNode}
                    onMouseOverNode={this.onMouseOverNode}
                    onClickLink={this.onClickLink}
                />  
                <button id="ClearGraphBtn" onClick={this.clearGraph}>Clear Graph</button>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={2}>
                                Graph Click Behavior
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <button className={classList[0]} onClick={this.addNodeGraphBehavior} >Add</button>
                            </td>
                            <td>
                                <button className={classList[1]} onClick={this.deleteNodeGraphBehavior}>Delete</button>
                            </td>
                            <td>
                                <button className={classList[2]} onClick={this.informationbtnBehavior}>Information</button>
                            </td>
                            <td>
                                <button className={classList[3]} onClick={this.colorBtnBehavior}>Color</button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={4}>
                            <ConfigSetup directedcheckchanged={this.directedcbChange}
                                         lnktypechange={this.linkTypeRbChange}
                                         directed={this.state.Config.directed}
                                         linktype={this.state.Config.link.type}
                                         className="setConfig"
                                         />
                            </td>
                            

                        </tr>
                        <tr>
                            <td colSpan={4}>
                                <ColorPicker
                                    color={this.state.selectedColor}
                                    onChange={this.rbColorPickChange}
                                    colorChange = {this.colorChange}

                                />
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={4}>
                                <p>Laplacian Matrix</p>

                                <LaplacianMatrix nodes={this.state.graphNodes} links={this.state.graphLinks}>
                                </LaplacianMatrix>
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
                
                {
                showNodeInfo && 
                (<NodeInfo
                    onClick={this.NodeModalCloseClick}
                    id={nodeInfo.id}
                    degree={nodeInfo.degree}
                    neighbors={nodeInfo.neighbors}
                    color={nodeInfo.color}
                    />)
                
                }
                {
                    this.state.ShowLinkInfoModal && 
                    (<LinkInfo 
                        source={linkInfo.source}
                        target={linkInfo.target}
                        isBridge={linkInfo.isBridge}
                        onClick={this.linkModalCloseClick}
                        />)
                }
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

