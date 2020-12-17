import React from 'react';
import './Styles/graphWrapper.css';

class LinkInfo extends React.Component{

    render(){
        let isBridge = "";
        if(this.props.isBridge){
            isBridge = "True"
        }
        else{
            isBridge = "False";
        }
        return(
            <div className="infoModal" >
                <div className="infoModalContent" >
                    <p>Source: {this.props.source}</p>
                    <p>Target: {this.props.target}</p>
                    <p>Is a bridge: {isBridge}</p>
                    <button onClick={this.props.onClick} className="btn btn-primary">Close &times; </button>
                </div>
            </div>
        );
    }
}

export default LinkInfo;