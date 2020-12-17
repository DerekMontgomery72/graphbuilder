import React from 'react'

class ColorPicker extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            colorSelected: this.props.color,
            radioButtonSelected: "",
        };
    }

    radioButtonSelected = (event) =>{
        console.log(this.props);
        this.props.colorChange(event.target.value);
    }

    isColorChecked = (color) =>{
        if(color === this.props.color)
        {
            return true;
        }
        else{
            return false;
        }
    }

    render(){
        return(
            <table>
                <tr>
                    <td>
                        <input type="radio" name="defaultColor" value="#d3d3d3" className="input-radio" onChange={this.radioButtonSelected}checked={this.isColorChecked("#d3d3d3")} />Default
                    </td>
                    <td>
                        <input type="radio" name="Red" value="#b00000" className="input-radio" onChange={this.radioButtonSelected} checked={this.isColorChecked("#b00000")} />Red
                    </td>
                    <td>
                        <input type="radio" name="Blue" value="#0035b0" className="input-radio" onChange={this.radioButtonSelected} checked={this.isColorChecked("#0035b0")} />Blue
                    </td>
                    <td>
                        <input type="radio" name="Yellow" value="#eef200" className="input-radio" onChange={this.radioButtonSelected} checked={this.isColorChecked("#eef200")} />Yellow
                    </td>
                </tr>
            </table>
        );
    }
}

export default ColorPicker;