import React from 'react'
import {RoadmapHeader} from './roadmapHeader'
import RoadmapGroup from './roadmapGroup'
import RoadmapContentLines from './roadmapContentLines' 
import {RoadmapSpinner} from '../../core/spinner'
import {APP_STANDARDS} from '../../core/constants'
import {
    FUNC_ARRAY_SUM_ATTRIBUT,
    FUNC_IS_ON_SCROLL
} from '../../core/standards'
import {
    SELECTOR_INIT,
    FUNC_SELECTOR_START,
    FUNC_SELECTOR_MOVE
} from '../../core/selector'


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
            displaySelectRect: SELECTOR_INIT,
        }
    }

    /////////////////
    /// SELECTION /// =>> INTEGRATION COMPONENT
    /////////////////

    //SELECTION START ------------------------------------------------------------------------------------------
    handleSelectionStart(e){

        if(!FUNC_IS_ON_SCROLL(e.clientX, e.clientY) && e.ctrlKey){

            //INIT
            e.preventDefault();
            const {width, height} = this.state.displaySelectRect;
            
            //ONLY IF LEFT BUTTON CLICKED AND NO SELECTOR
            if(e.button === 0 && width === 0 && height === 0){

                //GET CLIENT X Y for init
                this.setState(prevState =>{
                    let displaySelectRect = prevState.displaySelectRect;
                    displaySelectRect = FUNC_SELECTOR_START(displaySelectRect,e.clientX,e.clientY)
                    return displaySelectRect;
                })

            }
        }else{
            this.resetSelectedItem(e);
        }
    }

    //SELECTION MOUVE ---------------------------------------------------------------------------------------------
    handleSelectionMouve(e){

        //INIT
        e.preventDefault();
        
        //GET CLIENT X Y for init
        this.setState(prevState =>{
            let displaySelectRect = prevState.displaySelectRect;
            displaySelectRect = FUNC_SELECTOR_MOVE(displaySelectRect,e.clientX,e.clientY)
            return displaySelectRect;
        })

    }

    //SELECTION STOP -------------------------------------------------------------------------------------------
    handleSelectionStop(e){

        //RECT HEADER HEIGHT
        var headerHeight = document.getElementById("roadmapHeader").offsetHeight

        //LANCH SELECTION AND PASS SELECTION RECT
        var options = {
            selectionTop: this.state.displaySelectRect.top - headerHeight,
            selectionLeft: this.state.displaySelectRect.left - APP_STANDARDS.roadmapGroupWidth,
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

        //TEST SI BESOIN DE RESET
        e.preventDefault();
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
                    groupSettings={groupSettings}
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

