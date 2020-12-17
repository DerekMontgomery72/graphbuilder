import React from 'react'


class LaplacianMatrix extends React.Component
{
    constructor(props){
        super(props); // Props.nodes, props.links

        this.state={
            size: this.props.nodes.length,
            value: [],
        };

        this.constructMatrix();
    }


    constructMatrix = () =>
    {
        let size = this.props.nodes.length;
        if(this.props.nodes.length === 0)
        {
            return;
        }
        else{
            var newValue = [];
            var row = [];
            let degree = 0;
            for(var j = 0; j < size; j++) // the row we are inserting
            {
                var focusNode = this.props.nodes[j];
                
                for(var k = 0; k < size; k++)
                {
                    var tempNode = this.props.nodes[k];
                    if(k === j)
                    {
                        degree = tempNode.attachedLinks.length;
                        row.push(degree);
                    }
                    else{
                        if(this.isNodeANeighbor(focusNode, tempNode)){
                            row.push(-1);
                        }
                        else{
                            row.push(0);
                        }
                    }
                    
                }
                
                newValue.push(row);
                row = [];
            }
            return newValue;
        }
    }

    getNodeDegree = (node) =>
    {
        var degree = 0;
        for(var i = 0; i < this.props.links.length; i++)
        {
            if(this.props.links[i].target === node.id || this.props.links[i].source === node.id)
            {
                degree += 1;
            }
        }
        return degree;
    }

    isNodeANeighbor = (node1, node2) => 
    {
        for(var i = 0; i < node1.attachedLinks.length; i++)
        {
            let link = node1.attachedLinks[i];
            let source = link.sourceNode;
            let target = link.targetNode;
            if((source.id === node1.id && target.id === node2.id) || (source.id === node2.id && target.id === node1.id) )
            {
                return true;
            }
        }
        return false;
    }

    render()
    {
        let value = this.constructMatrix();
        console.log(value);
        let rows = value.map(function (item, i){
            let entry = item.map(function(element, j){
                return( <td key={j}>{element} </td>);
            });
            return(<tr key={i}> {entry} </tr>);
        });

        
        
        return(
            <div>
                <table className="table-hover table-bordered">
                    <tbody>
                        {rows}
                    </tbody>
                </table>
                
            </div>
        );
    }

}
export default LaplacianMatrix;