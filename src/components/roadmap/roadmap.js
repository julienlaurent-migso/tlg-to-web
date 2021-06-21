import React from 'react'
import {RoadmapHeader} from './roadmapHeader'
import RoadmapGroup from './roadmapGroup'
import RoadmapContentLines from './roadmapContentLines' 
import {RoadmapSpinner} from '../../core/spinner'
import {APP_STANDARDS} from '../../core/constants'
import {
    FUNC_ARRAY_SUM_ATTRIBUT
} from '../../core/standards'


/////////////////////////
/// ROADMAP COMPONENT ///
///////////////////////// 
class Roadmap extends React.Component{

    /////////////////////////
    /// INITIAL STATEMENT ///
    /////////////////////////
    constructor(props) {
        super(props);
        this.state={
            displaySelectRect:{
                display:false,
                left:0,
                top:0,
                width:0,
                height:0,
                initX:0,
                initY:0,
                parentX:0,
                parentY:0,
                scrollLeft:0,
                scrollTop:0,
                contentWidth:0,
                totWidth:0
            }
        }
    }

    /////////////////
    /// SELECTION /// =>> INTEGRATION COMPONENT
    /////////////////

    //SELECTION START ------------------------------------------------------------------------------------------
    handleSelectionStart(e){

        e.preventDefault();

        if(e.button === 0 ){

            //INIT
            var appContent = document.getElementById("appContent")
            var appContentBlock = appContent.getBoundingClientRect();

            //GET CLIENT X Y for init
            this.setState(prevState =>{
                let displaySelectRect = prevState.displaySelectRect;
                displaySelectRect.display = true;
                displaySelectRect.initX = e.clientX - appContentBlock.left;
                displaySelectRect.initY = e.clientY - appContentBlock.top;
                displaySelectRect.left = e.clientX - appContentBlock.left + appContent.scrollLeft;
                displaySelectRect.top = e.clientY - appContentBlock.top + appContent.scrollTop;
                displaySelectRect.parentX = appContentBlock.left;
                displaySelectRect.parentY = appContentBlock.top;
                displaySelectRect.scrollLeft = appContent.scrollLeft;
                displaySelectRect.scrollTop = appContent.scrollTop;
                return displaySelectRect;
            })

            //RESET ONLY IF CTRL NOT PRESS
            if(!e.ctrlKey){
                this.resetSelectedItem(e);
            }
        }
    }

    //SELECTION MOUVE ---------------------------------------------------------------------------------------------
    handleSelectionMouve(e){

        //INIT
        e.preventDefault();
        const {
            initX, 
            initY, 
            parentX, 
            parentY, 
            scrollLeft, 
            scrollTop, 
        } = this.state.displaySelectRect
        const clientX = e.clientX - parentX;
        const clientY = e.clientY - parentY;

        //CASE > initX && > initY
        if (clientX >= initX && clientY >= initY){

            //UPDATE SET
            this.setState(prevState =>{
                let displaySelectRect = prevState.displaySelectRect;
                displaySelectRect.width = clientX - initX;
                displaySelectRect.height = clientY - initY;
                return displaySelectRect;
            })
        }

        //CASE < initX && < initY
        if (clientX < initX && clientY < initY){
            this.setState(prevState =>{
                let displaySelectRect = prevState.displaySelectRect;
                displaySelectRect.width = initX - clientX ;
                displaySelectRect.height = initY - clientY ;
                displaySelectRect.left = clientX + scrollLeft ;
                displaySelectRect.top = clientY + scrollTop;
                return displaySelectRect;
            })
        }

        //CASE < initX && > initY
        if (clientX < initX && clientY >= initY){
            this.setState(prevState =>{
                let displaySelectRect = prevState.displaySelectRect;
                displaySelectRect.width = initX - clientX ;
                displaySelectRect.height = clientY - initY;
                displaySelectRect.left = clientX + scrollLeft;
                return displaySelectRect;
            })
        }

        //CASE < initX && > initY
        if (clientX >= initX && clientY < initY){
            this.setState(prevState =>{
                let displaySelectRect = prevState.displaySelectRect;
                displaySelectRect.width = clientX - initX ;
                displaySelectRect.height = initY - clientY ;
                displaySelectRect.top = clientY + scrollTop;
                return displaySelectRect;
            })
        }

    }

    //SELECTION STOP -------------------------------------------------------------------------------------------
    handleSelectionStop(e){

        //LANCH SELECTION AND PASS SELECTION RECT
        var options = {
            selectionTop: this.state.displaySelectRect.top,
            selectionLeft: this.state.displaySelectRect.left,
            selectionWidth: this.state.displaySelectRect.width,
            selectionHeight: this.state.displaySelectRect.height
        };
        this.props.launchAppFunctions(e, "roadmapGroupSelection", options)

        //UPDATE STATE TO RESET THE SELECTION RECT
        this.setState(prevState =>{
            let displaySelectRect = prevState.displaySelectRect;
            displaySelectRect.display = false;
            displaySelectRect.width = 0;
            displaySelectRect.height = 0;
            return displaySelectRect;
        })
    }


    
    //RESET SELECTED ITEMS
    resetSelectedItem(e){

        //INIT
        e.preventDefault();

        //TEST SI BESOIN DE RESET
        if(this.props.actions.isItemsSelected || this.props.actions.isItemsCopied){
            var options ={
                id: null,
                object: null,
                option: {type:"actionReset"},
            }
            this.props.launchAppFunctions(e,"roadmapItemSelect", options)
        }

    }



    ////////////////////////////////
    /// ROADMAP COMPONENT RENDER ///
    ////////////////////////////////
    render(){

        console.log("Render: ROADMAP")

        //PROPS
        const {
            isOnEditMode,
            roadmapMonthWidth,
            userSettings,
            groupSettings,
            updateState,
            roadmapData, 
            launchAppFunctions,
            headerOption,
            roadmapPeriod,
            actions,
            roadmapSizeInfo,
        } = this.props;

        ////////////////////////////////////////////////////
        /// FIND GLOBAL HEIGHT ONLY IF UPDATE ROADMAP OK ///
        ////////////////////////////////////////////////////
        
        //INIT
        var groupData;

        //NEED FOR CONTENT LINE PURE COMPONENT / COUNT IF MODIF ON HEADER OPTION
        var headerOptionString =  
        headerOption.isRoadmapQuaters +
        headerOption.isRoadmapMonths + 
        headerOption.isRoadmapWeeks + 
        headerOption.isRoadmapDays ;

        ////////////////////////////////
        /// ROADMAP COMPONENT RETURN /// !HERE DRAG SELECT !! 
        ////////////////////////////////
        return(
            <section 
                id="appContent" 
                className="roadmapContent"
                onMouseDown={isOnEditMode ? (e)=> this.handleSelectionStart(e) : null}
                onMouseUp={isOnEditMode && this.state.displaySelectRect.display  ? (e) => this.handleSelectionStop(e) : null}
                onMouseMove={isOnEditMode && this.state.displaySelectRect.display  ? (e)=> this.handleSelectionMouve(e) : null}
                onMouseLeave={isOnEditMode && this.state.displaySelectRect.display  ? (e) => this.handleSelectionStop(e) : null}
            >

                 {/* SELECTOR */}
                 {this.state.displaySelectRect.display ?
                    <div 
                        id="selector"
                        style={{
                            left:this.state.displaySelectRect.left + "px",
                            top:this.state.displaySelectRect.top + "px",
                            width:this.state.displaySelectRect.width + "px",
                            height:this.state.displaySelectRect.height + "px",
                        }}
                    ></div>
                :null}

                {/* ROADMAP HEADER ------------------------------- OK -----------------------*/}
                <RoadmapHeader 
                    roadmapPeriod={roadmapPeriod}
                    headerOption={headerOption}
                    roadmapMonthWidth={roadmapMonthWidth}
                    launchAppFunctions={launchAppFunctions}
                />

                {/* CONTENT LINES ----------------------------- OK ----------------------*/}
                <RoadmapContentLines 
                    isGlobal={true}
                    roadmapHeight={groupSettings.roadmapHeight}
                    roadmapPeriod={roadmapPeriod}
                    headerOption={headerOption}
                    roadmapMonthWidth={roadmapMonthWidth}
                    headerOptionString={headerOptionString}
                />

                {/* CREATION DES GROUPES / SPINNER -------------------------------------------*/}
                {!roadmapData ? 
                    <RoadmapSpinner 
                        roadmapInitHeight={APP_STANDARDS.roadmapInitHeight}
                        roadmapGroupWidth={APP_STANDARDS.roadmapGroupWidth}
                    />
                :
                    groupSettings.group.map(group =>{

                        //GET GROUP DATA
                        groupData = roadmapData.filter(item => item.groupKey === group.key)

                        //RETURN
                        return(
                            <RoadmapGroup 
                                key={"group-" + group.key}
                                updateTracker={FUNC_ARRAY_SUM_ATTRIBUT(groupData, "updateTracker")}
                                isOnEditMode={isOnEditMode}
                                userSettings={userSettings}
                                groupSettings={group}
                                roadmapFirstYear={roadmapPeriod.roadmapFirstYear}
                                sizeInfo={roadmapSizeInfo}
                                actions={actions}
                                roadmapMonthWidth={roadmapMonthWidth}
                                updateState={updateState}
                                groupData={groupData}
                                launchAppFunctions={launchAppFunctions}
                            />
                        )
                    })
                }
            </section>
        )
    }
}
export default Roadmap

