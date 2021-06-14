import React from 'react'
import {APP_LOGO, APP_NAV} from '../../core/constants'
import {NavLink} from 'react-router-dom'

////////////////////////
/// HEADER COMPONENT ///
//////////////////////// 
class Header extends React.Component{

    ///////////////////////////////
    /// HEADER COMPONENT RENDER ///
    ///////////////////////////////
    render(){

        //MAP NAV MENU FROM APP_NAV CONSTANT
        const appNavLinks = APP_NAV.map(link => {

            //MAP APP_NAV RETURN
            return(
                <NavLink 
                    key={"nav-" + link.id} 
                    to={link.url} 
                    activeClassName="headerNavSelected" 
                    className="flexCenterCenter"
                >
                    <div className="flexCenterCenter headerMenuItem">
                        <span className="material-icons headerMenuIcon" >{link.icon}</span>
                        {link.name}
                    </div>
                </NavLink>
            )
        })

        ///////////////////////////////
        /// HEADER COMPONENT RETURN ///
        ///////////////////////////////
        return(
            <header id="appHeader" className="flexBetweenCenter">

                {/* APP NAME */}
                <NavLink to="/" >
                    <div className="flexCenterCenter logoContent">

                        {/* LOGO */}
                        <span className="flexCenterCenter logoAbr" >
                            <span className="material-icons logoIcon">
                                {APP_LOGO.icon}
                            </span>
                        </span>

                        {/* TITRE */}
                        <div className="flexColCenterStart logoTxtContent">
                            {APP_LOGO.logoTxt}
                            <div className="dashboardTitleMPTxt logoByMigso">
                                By MI-GSO | PCUBED
                            </div>
                        </div>

                    </div>
                </NavLink>

                {/* NAVIGATION */}
                <div className="flexCenterStrech headerMenuBlock">
                    {appNavLinks}
                </div>

            </header>
        )
    }
}
export default Header
       
    