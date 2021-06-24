import React from 'react';
import {
    APP_STANDARDS,
} from '../../core/constants'
import {ContextMenu} from '../../core/contextMenu'
import  {YearsBlock}  from '../../core/calendar'

////////////////////////
/// IMPORT COMPONENT ///
//////////////////////// 
export class RoadmapHeader extends React.PureComponent{

    /////////////////////////
    /// INITIAL STATEMENT ///
    /////////////////////////

    constructor(props) {
        super(props);
        this.state={
            displayContextMenu: false,
            contextMenuX: 0,
            contextMenuY: 0,
        }
        this.resetContextMenu=this.resetContextMenu.bind(this);
    }

    //////////////////////
    /// HEADER ACTIONS ///
    //////////////////////

    //UPDATE CONTEXTMENU -------------------------------------------------------------------------
    updateContextMenu(e){
        e.preventDefault();
        this.setState({
            displayContextMenu: true, 
            contextMenuX:e.pageX, 
            contextMenuY:e.pageY
        })
    }

    //RESET CONEXT -----------------------------------------------------------------------------------------------------
    resetContextMenu(e){
        e.preventDefault();
        this.setState({displayContextMenu:false});
    }

    ///////////////////////////////
    /// IMPORT COMPONENT RENDER ///
    ///////////////////////////////
    render(){

        console.log("RENDER : ROADMAP HEADER")

        //GET PROPS
        const {
            headerOption,
            roadmapMonthWidth,
            launchAppFunctions,
            roadmapPeriod,
        } = this.props
   
        /////////////////////////////
        /// GRID COMPONENT RETURN ///
        /////////////////////////////
        return(
            <div id="roadmapHeader" className="flexStartStrech" >

                {/*  FIRST DIV OF ROADMAP ---------------------------------------------------------- */}
                <div 
                    id="roadmapHeaderLeft"
                    className="roadmapLeftSide roadmapFirstCell" 
                    style={{
                        minWidth: APP_STANDARDS.roadmapGroupWidth + "px",
                        maxWidth: APP_STANDARDS.roadmapGroupWidth + "px"
                    }}
                >
                    ctrl pour select
                </div>

                {/* CALENDAR ---------------------------------------------------------------------- */}
                <div 
                    id="roadmapHeaderRight" 
                    className="roadmapRightSide flexStartCenter"
                    onContextMenu={(e) => this.updateContextMenu(e)}
                >
                    {/* YEAR BLOCK */}
                    <YearsBlock 
                        type="header"
                        roadmapPeriod={roadmapPeriod}
                        options={{
                            display: headerOption, 
                            roadmapMonthWidth: roadmapMonthWidth
                        }}
                    />
                
                    {/* CONTEXT MENU */}
                    {this.state.displayContextMenu ?
                        <ContextMenu 
                            type="header"
                            contextMenuX={this.state.contextMenuX}
                            contextMenuY={this.state.contextMenuY}
                            resetContextMenu={this.resetContextMenu}
                            launchAppFunctions={launchAppFunctions}
                            options={{
                                display: headerOption, 
                                roadmapMonthWidth: roadmapMonthWidth
                            }}
                        />
                    :null}
                </div>

            </div>
        )
    }
}
