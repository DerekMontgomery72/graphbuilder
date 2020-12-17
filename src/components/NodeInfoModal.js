import React from 'react';
import './Styles/graphWrapper.css';


class NodeInfo extends React.Component
{
    render()
    {
        let rows = this.props.neighbors.map(function(item, i){
            return(<tr>
                <td></td><td key={i}>{item.id}</td>
                </tr>);
        })
        return(
            <div className="infoModal">
                <div className="infoModalContent">
                <p>Node ID: {this.props.id} </p>
                <p>Node Degree: {this.props.degree}</p>
                <p>Color: {this.props.color}</p>
                <table className="table-bordered">
                    <tbody>
                        <tr><td>Neighbors: </td><td></td></tr>
                        {rows}
                    </tbody>
                </table>
                <button onClick={this.props.onClick} className="btn btn-primary">Close</button>
                
            </div>
        </div>
            
        );
    }
}

export default NodeInfo;