import React from "react";
import './Styles/configdiv.css';


class ConfigSetup extends React.Component{
   

    linkType = (rbCheck) =>
    {
        
        switch(this.props.linktype){
            case "STRAIGHT":
                if(rbCheck === "straight")
                {
                    return true;
                }
                else{
                    return false;
                }
            case "CURVE_SMOOTH":
                if(rbCheck === "curve"){
                    return true;
                }
                else{
                    return false;
                }
            default:
                return false;
        }
    }

    render(){

        console.log(this.props);
        return(
            <table className="setConfig">
                <tbody>
                    <tr>
                        <td colSpan={1}>
                            Link Options:
                        </td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;
                        </td>
                        <td>
                            <input id="directed" type="checkbox" onChange={this.props.directedcheckchanged} checked={this.props.directed}
                                />
                                <label className="form-check-label">
                                    Directed
                                </label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            &nbsp;
                        </td>
                        <td>
                            <input id="straight" className="form-check-input" type="radio"
                                onChange={this.props.lnktypechange} checked={this.linkType("straight")}
                                />
                                <label className="form-check-label">
                                    Straight
                                </label>
                                <br/>
                            <input id="curve" className="form-check-input" type="radio" onChange={this.props.lnktypechange}
                                checked={this.linkType("curve")}/>
                            <label className="form-check-label" for="curve">
                                Curve
                            </label>

                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default ConfigSetup;