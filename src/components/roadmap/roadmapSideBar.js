import React from 'react';
import {
    AppTooltip,
    FUNC_GET_STEP_ZOOM
} from '../../core/standards'
import {APP_STANDARDS} from '../../core/constants'

////////////////////////
/// IMPORT COMPONENT ///
//////////////////////// 
class RoadmapSideBar extends React.Component{

    /////////////////////////
    /// INITIAL STATEMENT ///
    /////////////////////////
    constructor(props) {
        super(props);
        this.state={
            modalShow: false,
            isFullScreen: false,
        }
        this.resetModal = this.resetModal.bind(this);
    }

    //RESET MODAL -----------------------------------------------------------
    resetModal(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({modalShow:false})
    }

    //FULL SCREEN MODE -------------------------------------------------------
    updateFullScreen(e){

        //INIT
        e.preventDefault()
        var testFullScreen = false;

        //TEST IF ALREADY IN FULLSCREEN
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            testFullScreen = true
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }

        //STATE
        this.setState({isFullScreen: testFullScreen})
    }

    //RESET ALL FILTERS
    resetAllFilters(e){
        
        //INIT
        e.preventDefault()

        //OPTIONS
        var options={
            startDate:null,
            finishDate:null,
            startYear:this.props.roadmapMinMaxDate.min.getFullYear(),
            finishYear:this.props.roadmapMinMaxDate.max.getFullYear(),
        };

        //CALL
        this.props.launchAppFunctions(e, "roadmapHeaderRangePeriod", options);
    }

    //HANDLE CLICK TO CREATE DATA
    handleCreateData(e){
        e.preventDefault()
        this.props.launchAppFunctions(e, "globalCreateRoadmapData")
    }

    //HANDLE ZOOM
    handleZoom(e, width){
        e.preventDefault()
        this.props.launchAppFunctions(e, "roadmapHeaderZoom", {width: width})
    }

    ///////////////////////////////
    /// IMPORT COMPONENT RENDER ///
    ///////////////////////////////
    render(){

        console.log("RENDER : SIDEBAR")
        

        //PROPS
        const { 
            roadmapMonthWidth,
            isOnEditMode,
            isRoadmapData,
            roadmapFirstPeriod,
            isLinksDisplayed,
            updateState,
        } = this.props

        //ZOOM IN OUT
        const zoomInValue =  roadmapMonthWidth * (1 + APP_STANDARDS.roadmapZoomIncrement);
        const zoomOutValue = roadmapMonthWidth -  (roadmapMonthWidth*APP_STANDARDS.roadmapZoomIncrement);

        /////////////////////////////
        /// GRID COMPONENT RETURN ///
        /////////////////////////////
        return(
            <section id="appSideBar" className="flexColStartCenter">
           
                {/* VIEW MODE SELECTION ----------------------------------------------------------------------------- */}
                <span className="buttonLabel flexCenterCenter">Data</span>

                {/* EDIT / FULL SCREEN VIEW MODE */}
                <div className="flexColCenterCenter buttonGroup" >

                    {/* NEED TO BE UPDATE */}
                    {isRoadmapData ? null :
                        <button 
                            className= "flexCenterCenter buttonSideBar " 
                            data-tip data-for="tooltipNeedUpdate"
                            onClick={(e) => this.handleCreateData(e)}
                        >
                            <span className="material-icons" >update</span>
                        </button>
                    }

                    {/* SAVE TEMPLATE */}
                    <button 
                        className= "flexCenterCenter buttonSideBar " 
                        data-tip data-for="tooltipSaveTemplate"
                    >
                        <span className="material-icons" >save</span>
                    </button>

                    {/* OPEN NEW */}
                    <button
                        className="flexCenterCenter buttonSideBar " 
                        style={{borderTop:isRoadmapData ?  "1px solid #dcdcdc " : null}}
                        data-tip data-for="tooltipGetTemplate"

                    >
                        <span className="material-icons">cloud_download</span>
                    </button>
                </div>

                {/* VIEW MODE SELECTION ----------------------------------------------------------------------------- */}
                <span className="buttonLabel flexCenterCenter">Mode</span>
                
                {/* EDIT / FULL SCREEN VIEW MODE */}
                <div className="flexColCenterCenter buttonGroup" >

                    {/* VIEW MODE */}
                    <button 
                        className={isRoadmapData && isOnEditMode ? "flexCenterCenter buttonSideBar " : "flexCenterCenter buttonSideBar buttonSideBarSelected" }
                        data-tip data-for="tooltipViewMode"
                        onClick={isRoadmapData && isOnEditMode? () => updateState("appSettings",{isOnEditMode : false}) : null} 
                    >
                        <span className="material-icons" >near_me</span>
                    </button>

                    {/* FULL SCREEN */}
                    <button 
                        className="flexCenterCenter buttonSideBar " 
                        data-tip data-for="tooltipFullScreenMode"
                        onClick={(e) => this.updateFullScreen(e)}
                    >
                        {this.state.isFullScreen ? 
                            <span className="material-icons" >close_fullscreen</span>
                        :  
                            <span className="material-icons" >zoom_out_map</span>  
                        }
                        

                    </button>

                    {/* EDIT MODE */}
                    
                    <button
                        className={isRoadmapData && isOnEditMode ? "flexCenterCenter buttonSideBar buttonSideBarSelected" : "flexCenterCenter buttonSideBar " }
                        data-tip data-for="tooltipEditMode"
                        onClick={isRoadmapData && isOnEditMode ? null : () => updateState("appSettings",{isOnEditMode : true})}
                    >
                        <span className="material-icons">mode_edit</span>
                    </button>
                </div>

                {/* FILTER TITLE  ----------------------------------------------------------------------------- */}
                <span className="buttonLabel flexCenterCenter">Filters</span>
                
                {/* FILTERS */}
                <div className="flexColCenterCenter buttonGroup" >

                    {/* DATE RANGE */}
                    <button 
                        className="flexCenterCenter buttonSideBar" 
                        data-tip data-for="tooltipResetFilter"
                        onClick={isRoadmapData ? (e) => this.resetAllFilters(e) : null}
                    >
                        <span className="material-icons" >restart_alt</span>
                    </button>

                    {/* DATE RANGE */}
                    <button 
                        className={roadmapFirstPeriod ? "flexCenterCenter buttonSideBar buttonSideBarSelected" : "flexCenterCenter buttonSideBar" }
                        data-tip data-for="tooltipDateRange"
                        onClick={isRoadmapData ? () => updateState("appSettings", {actionModal:"dateRange"})  : null }
                    >
                        <span className="material-icons" >date_range</span>
                    </button>

                    {/* TBD */}
                    <button
                        className="flexCenterCenter buttonSideBar " 
                        data-tip data-for="tooltipCustomFilter"
                    >
                        <span className="material-icons">dashboard_customize</span>
                    </button>
                </div>

                {/* LINKS SELECTION ----------------------------------------------------------------------------- */}
                <span className="buttonLabel flexCenterCenter">Links</span>
                
                {/* EDIT / FULL SCREEN VIEW MODE */}
                <div className="flexColCenterCenter " >

                    {/* DISPLAY/HIDDE */}
                    <button 
                        className={isLinksDisplayed ? "flexCenterCenter buttonSideBar buttonSideBarSelected" : "flexCenterCenter buttonSideBar " }
                        data-tip data-for="tooltipDisplayLinks"
                        onClick={() => updateState("appSettings",{isLinksDisplayed: !isLinksDisplayed})}
                        style={{borderRadius:"4px"}}
                    >
                        <span className="material-icons" >
                            {isLinksDisplayed ? "visibility" : "visibility_off"}
                        </span>
                    </button>


                </div>

                {/* ZOOM SELECTION ---------------------------------------------------------------------------------------- */}
                <span className="buttonLabel flexCenterCenter">Zoom</span>

                {/* EDIT / FULL SCREEN VIEW MODE */}
                <div className="flexColCenterCenter buttonGroup" >

                    {/* ZOOM IN */}
                    <button
                        className="flexCenterCenter buttonSideBar " 
                        data-tip data-for="tooltipZoomUp"
                        onClick={
                            isRoadmapData ?
                                zoomInValue < APP_STANDARDS.roadmapMaxMonthWidth ? 
                                (e) => this.handleZoom(e, zoomInValue) 
                                : null 
                            :null}
                    >
                        <span className="material-icons" >zoom_in</span>
                    </button>

                    {/* PREVIOUS STEP */}
                    <button
                        className="flexCenterCenter buttonSideBar " 
                        data-tip data-for="tooltipZoomNext"
                        onClick={
                            isRoadmapData ? 
                            (e) => this.handleZoom(e, FUNC_GET_STEP_ZOOM(roadmapMonthWidth,true)) 
                            : null}
                        style={{borderBottom:"none"}}
                    >
                        <span className="material-icons" >skip_next</span>
                    </button>

                    {/* ZOOM INITIAL */}
                    <button
                        className="flexCenterCenter buttonSideBar " 
                        data-tip data-for="tooltipZoomInit"
                        onClick={
                            isRoadmapData ? 
                            (e) => this.handleZoom(e, APP_STANDARDS.roadmapInitMonthWidth)
                            :null}
                    >
                        <span className="material-icons" >fullscreen</span>
                    </button>

                    {/* NEXT STEP */}
                    <button
                        className="flexCenterCenter buttonSideBar " 
                        data-tip data-for="tooltipZoomPrevious"
                        onClick={
                            isRoadmapData? 
                            (e) => this.handleZoom(e, FUNC_GET_STEP_ZOOM(roadmapMonthWidth,false))
                            :null}
                        style={{borderTop:"none"}}
                    >
                        <span className="material-icons" >skip_previous</span>
                    </button>

                    {/* ZOOM OUT */}
                    <button
                        className="flexCenterCenter buttonSideBar"
                        data-tip data-for="tooltipZoomDown"
                        onClick={
                            isRoadmapData?
                                zoomOutValue > APP_STANDARDS.roadmapMinMonthWidth ? 
                                (e) => this.handleZoom(e, zoomOutValue) 
                                : null
                            : null}
                    >
                        <span className="material-icons">zoom_out</span>
                    </button>

                </div>
 

                {/* TOOLTIP LIST --------------------------------------------------------------------------------------------------- */}
                <AppTooltip tooltipId="tooltipNeedUpdate" tooltipPlacement="right" tooltipContent="Data Update Needed" theme="light"/>
                <AppTooltip tooltipId="tooltipSaveTemplate" tooltipPlacement="right" tooltipContent="Save Template" theme="light"/>
                <AppTooltip tooltipId="tooltipGetTemplate" tooltipPlacement="right" tooltipContent="Get Template" theme="light"/>
                <AppTooltip tooltipId="tooltipViewMode" tooltipPlacement="right" tooltipContent="View Mode" theme="light"/>
                <AppTooltip tooltipId="tooltipFullScreenMode" tooltipPlacement="right" tooltipContent="Full Screen Mode" theme="light"/>
                <AppTooltip tooltipId="tooltipEditMode" tooltipPlacement="right" tooltipContent="Edit Mode" theme="light"/>
                <AppTooltip tooltipId="tooltipZoomUp" tooltipPlacement="right" tooltipContent="Zoom In" theme="light"/>
                <AppTooltip tooltipId="tooltipZoomNext" tooltipPlacement="right" tooltipContent="Next Step" theme="light"/>
                <AppTooltip tooltipId="tooltipZoomInit" tooltipPlacement="right" tooltipContent="Initial Zoom" theme="light"/>
                <AppTooltip tooltipId="tooltipZoomPrevious" tooltipPlacement="right" tooltipContent="Previous Step" theme="light"/>
                <AppTooltip tooltipId="tooltipNextStep" tooltipPlacement="right" tooltipContent="Display Days" theme="light"/>
                <AppTooltip tooltipId="tooltipZoomDown" tooltipPlacement="right" tooltipContent="Zoom Out" theme="light"/>
                <AppTooltip tooltipId="tooltipDisplayLinks" tooltipPlacement="right" tooltipContent="Show/Hidde Links" theme="light"/>
                <AppTooltip tooltipId="tooltipDateRange" tooltipPlacement="right" tooltipContent="Period Range Selection" theme="light"/>
                <AppTooltip tooltipId="tooltipCustomFilter" tooltipPlacement="right" tooltipContent="Custom Filters" theme="light"/>
                <AppTooltip tooltipId="tooltipResetFilter" tooltipPlacement="right" tooltipContent="Reset All Filters" theme="light"/>

            </section>
        )
    }
}
export default RoadmapSideBar