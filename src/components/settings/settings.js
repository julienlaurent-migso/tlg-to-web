import React from 'react'

//////////////////////
/// GRID COMPONENT ///
////////////////////// 
class Settings extends React.Component{

    /////////////////////////
    /// INITIAL STATEMENT ///
    /////////////////////////
    constructor(props) {
        super(props);
        this.state={
        }
    }

    /////////////////////////////
    /// GRID COMPONENT RENDER ///
    /////////////////////////////
    render(){


        /////////////////////////////
        /// GRID COMPONENT RETURN ///
        /////////////////////////////
        return(
            <section id="appContent" className="settingsContent">
                SETTINGS

                <div 
                    className="roadmapItemSelected"
                    style={{
                        height:"200px",
                        width:"200px", 
                        backgroundColor:"#cdcdcd"
                    }}
                >

                </div>

            </section>
        )
    }
}
export default Settings