import React from 'react';

////////////////////////
/// IMPORT COMPONENT ///
//////////////////////// 
class HomeSideBar extends React.Component{

    /////////////////////////
    /// INITIAL STATEMENT ///
    /////////////////////////
    constructor(props) {
        super(props);
        this.state={
        }
    }


    ///////////////////////////////
    /// IMPORT COMPONENT RENDER ///
    ///////////////////////////////
    render(){

        /////////////////////////////
        /// GRID COMPONENT RETURN ///
        /////////////////////////////
        return(
            <section id="appSideBar">
                HOME
            </section>
        )
    }
}
export default HomeSideBar