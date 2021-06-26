import React from 'react';
import {ContextMenu} from '../../core/contextMenu'
import {APP_STANDARDS} from '../../core/constants'
import RoadmapItem from './roadmapItem'

/////////////////////////
/// ROADMAP COMPONENT ///
///////////////////////// 
class RoadmapGroup extends React.PureComponent{

    /////////////////////////
    /// INITIAL STATEMENT ///
    /////////////////////////
    constructor(props) {
        super(props);
        this.state={
            displayContextMenu: false,
            contextMenuX:0,
            contextMenuY:0,
            mouseX:0,
            mouseY:0,
            autoScrollX: {isDown: false, startX:0, scrollLeft:0},
            inputFocus:null
        }
        this.resetContextMenu = this.resetContextMenu.bind(this);
        this.updateInputFocus = this.updateInputFocus.bind(this);
    }

    /////////////////////
    /// GROUP ACTIONS ///
    /////////////////////

    //UPDATE CONTEXTMENU -------------------------------------------------------------------------------------------
    updateContextMenu(e){
        
        //INIT
        e.preventDefault();
        e.stopPropagation();

        //CURRENT HEIGHT (DECALE IF CONTEXT MENU DISPLAYED AT THE BOTTOM ON DE SCRREN)
        var newHeight;
        var currentContextMenuHeight = APP_STANDARDS.roadmapContextMenuGroupHeight;
        if(document.body.clientHeight < e.pageY + currentContextMenuHeight){
            newHeight = e.pageY - currentContextMenuHeight
        }else{
            newHeight = e.pageY
        }

        //SET STATE
        this.setState({
            displayContextMenu:true,
            contextMenuX:e.pageX,
            contextMenuY:newHeight,
            mouseX:e.pageX,
            mouseY:e.pageY,
        })
    }

    //RESET CONEXT -----------------------------------------------------------------------------------------------------
    resetContextMenu(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({displayContextMenu:false});
    }

    //DRAG OVER ---------------------------------------------------
    dragOver = (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move";
    }

    //UPDATE INPUT FOCUS
    updateInputFocus(id){
        this.setState({inputFocus:id});
    }

    /////////////////////////////
    /// AUTO SCROLL WITH DRAG ///
    /////////////////////////////

    //DARG START
    onDragStart = (e) => {

        //SI RIGHT CLICK
        if(e.button !== 0 ) return;

        //UNFOCUS INPUT CHANGE TO SEND TO SOURCE
        if(this.state.inputFocus){
            
            //RECUP DE L'ITEM FOCUSED
            const focusedInput = document.getElementById(this.state.inputFocus);

            //ON VERIFIE QU'IL n'A PAS DEJA ETE BLURED
            if(focusedInput){focusedInput.blur()}
        }

        //INIT
        e.preventDefault();

        //AJouter
        const appContent = document.getElementById("appContent");
        appContent.classList.add('grabbing');

        
        this.setState(prevState => {
            let autoScrollX = {...prevState.autoScrollX}
            autoScrollX.isDown = true;
            autoScrollX.startX = e.pageX - appContent.offsetLeft;
            autoScrollX.scrollLeft = appContent.scrollLeft;
            let inputFocus = false
            return { autoScrollX , inputFocus};
        });

    }

    //ON DRAG
    onDragScroll = (e) => {

        //SORTIR SI PAS ACTIVE
        if(!this.state.autoScrollX.isDown) return;
        const appContent = document.getElementById("appContent");

        //INIT
        e.preventDefault();
        const x = e.pageX - appContent.offsetLeft;
        const walkX = (x - this.state.autoScrollX.startX) * 4; //scroll-fast
        appContent.scrollLeft = this.state.autoScrollX.scrollLeft - walkX;

    }

    //DRAG STOP
    onDragStop = () => {

        //SORTIR SI PAS ACTIVE
        if(!this.state.autoScrollX.isDown) return;

        //AJouter
        const appContent = document.getElementById("appContent");
        appContent.classList.remove('grabbing');

        //STATE
        this.setState(prevState => {
            let autoScrollX = {...prevState.autoScrollX}
            autoScrollX.isDown = false;
            return { autoScrollX };
        });

    }


    ////////////////////////////////
    /// ROADMAP COMPONENT RENDER ///
    ////////////////////////////////
    render(){

        console.log("Render: ROADMAP GROUP | Modif: " + this.props.updateTracker )

        //INIT
        const {
            isOnEditMode,
            userSettings,
            groupSettings,
            roadmapFirstYear,
            sizeInfo,
            actions,
            roadmapMonthWidth,
            updateState,
            groupData,
            launchAppFunctions, 
        } = this.props;

        //INIT
        var levelLineJSX;

        ////////////////////////////////
        /// ROADMAP COMPONENT RETURN ///
        ////////////////////////////////
        return(
            <div 
                className="roadmapContentGroup" 
                onMouseDown={(e) => this.onDragStart(e)}
                onMouseMove={(e) => this.onDragScroll(e)}
                onMouseUp={() => this.onDragStop()}
                onMouseLeave={() => this.onDragStop()}
            >

                    <div 
                        className="roadmapGroup flexStartStrech" 
                        style={{
                            height: groupSettings.height,
                            width: sizeInfo.roadmapWidth,
                        }}
                    >

                        {/* LEFT SIDE GROUP NAME -------------------------------------------------------------- */}
                        <div 
                            className="roadmapLeftSide" 
                            style={{
                                minWidth: APP_STANDARDS.roadmapGroupWidth + "px",
                                maxWidth: APP_STANDARDS.roadmapGroupWidth + "px"
                            }}
                        >
                            <div 
                                className="roadmapGroupName"
                                style={{
                                    position: "sticky",
                                    top: sizeInfo.roamdpaHeaderHeight
                                }}
                            >
                                {groupSettings.name}
                            </div>
                        </div>

                        {/* RIGHT SIDE -------------------------------------------------------------- */}
                        <div 
                            id={"itemsGroup-" + groupSettings.key}
                            className="roadmapRightSide" 
                            onContextMenu={isOnEditMode ? (e) => this.updateContextMenu(e) : null}
                            onDragOver={(e) => this.dragOver(e)}
                        >
                            
                            {/* ROADMAP ITEMS & LEVEL LINE -------------------------------------------------------- */}
                            {groupData.map((item, index) =>{

                                //LEVEL LINE -------------------------------------------------------------------------
                                levelLineJSX = [];
                                if(isOnEditMode && index !== 0 && item.level !== groupData[index-1].level){
                                    levelLineJSX = [
                                        <div 
                                            key={"level-" + groupSettings.key + index} 
                                            className="roadmapLevelBorder"
                                            style={{
                                                position:"absolute", 
                                                top: item.top - userSettings.roadmapItemSpaceLine/2,
                                            }}
                                            onDragOver={(e) => this.dragOver(e)}
                                        ></div>
                                    ]
                                }

                                // ITEM --------------------------------------------------------------------------------
                                return(
                                    <React.Fragment
                                        key={"fragItemLevel-" + item.id}
                                    >

                                        {/* LEVEL LINE */}
                                        {levelLineJSX}

                                        {/* ITEM */}
                                        {item.display ?
                                            <RoadmapItem 
                                                key={"roadmapItem-" + item.id}
                                                updateTracker={item.updateTracker}
                                                isOnEditMode={isOnEditMode}
                                                userSettings={userSettings}
                                                groupKey={groupSettings.key}
                                                item={item}
                                                roadmapFirstYear={roadmapFirstYear}
                                                roadmapMonthWidth={roadmapMonthWidth}
                                                updateState={updateState}
                                                launchAppFunctions={launchAppFunctions}
                                                updateInputFocus={this.updateInputFocus}
                                            />
                                        :null}

                                    </React.Fragment>
                                )

                            })}

                            {/* CONTEXT MENU --------------------------------------------------------------------*/}
                            {this.state.displayContextMenu ?
                                <ContextMenu 
                                    contextMenuX={this.state.contextMenuX}
                                    contextMenuY={this.state.contextMenuY}
                                    mouseX={this.state.mouseX}
                                    mouseY={this.state.mouseY}
                                    type="group"
                                    item={groupSettings}
                                    resetContextMenu={this.resetContextMenu}
                                    launchAppFunctions={launchAppFunctions}
                                    actions={actions}
                                />
                            :null}
                        </div>
                    </div>
                </div> 
        )
    }
}
export default RoadmapGroup