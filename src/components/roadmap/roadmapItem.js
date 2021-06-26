import React from 'react'
import {UpdaterWithInput} from '../../core/updater'
import {ItemInfoModal} from '../../core/modal'
import {DateViewer} from '../../core/dateViewer'
import {
    APP_STANDARDS, 
    APP_ITEM_TYPES
} from '../../core/constants'
import {ItemIcon} from './roadmapItemIcon'
import {ContextMenu} from '../../core/contextMenu'
import {FUNC_COLOR_MNGT} from '../../core/standards'






//////////////////////////////
/// ROADMAP ITEM COMPONENT ///
////////////////////////////// 
class RoadmapItem extends React.PureComponent{

    /////////////////////////
    /// INITIAL STATEMENT ///
    /////////////////////////
    constructor(props) {
        super(props);
        this.state={
            isOnDrag:false,
            stopTransition:false,
            limit: {left:0, rectifLeft:0 ,right:0, rectifRight:0},
            deltaPosition: {initX:0, x: 0, initY:0, y: 0},
            itemWidth: this.props.item.width,
            deltaWidth: {initX:0, initWidth:0, diffX:0},
            initScroll: {initX:0, initY:0},
            dateViewer: {initX:0, x:0, y:0},
            modalShow:false,
            displayContextMenu: false,
            contextMenuX:0,
            contextMenuY:0,
            mouseX:0,
            mouseY:0,
        }
        this.handleModal = this.handleModal.bind(this);
        this.resetContextMenu = this.resetContextMenu.bind(this);
    }

    ////////////////////
    /// ITEM ACTIONS ///
    ////////////////////

    //GET X AND Y POSITION OF DRAGGED ELEMENT -------------------------------------------------------------------
    handleDrag = (e) => {

        ///APP CONTENT ELEMENT
        const appContent = document.getElementById("appContent");

        //INIT
        e.preventDefault()
        e.dataTransfer.effectAllowed = "move";
        
        //CALCUL DIFF
        const {initX, initY} = this.state.deltaPosition;  
        var diffX = (e.pageX - initX) + (appContent.scrollLeft - this.state.initScroll.initX);
        var diffY = (e.pageY - initY) + (appContent.scrollTop - this.state.initScroll.initY);
        var dateViewerX = this.state.dateViewer.initX + (e.pageX - initX) ;

        //SET STATE
        if (e.pageX !== 0 && e.pageY !==0){
            this.setState(prevState => {
                let deltaPosition = {...prevState.deltaPosition};
                deltaPosition.x = diffX;
                deltaPosition.y = diffY;
                let dateViewer = {...prevState.dateViewer};
                dateViewer.x = dateViewerX
                return { 
                    deltaPosition, 
                    dateViewer,
                }; 
            })
        }

        //SCROLL MANAGEMENT MIN X
        const overflowDiffMin = e.clientX - (appContent.offsetLeft + 210)
        if(overflowDiffMin < 0 ){

            //UPDATE SCROLL
            appContent.scroll(appContent.scrollLeft - 5,0)

        }else{

            //SCROLL MANAGEMENT MAX X SEULEMENT SI VERS LA DROITE
            if(this.state.deltaWidth.initX - e.clientX > 0 ){
                const overflowDiffMax = (e.clientX + this.state.itemWidth) - (document.body.clientWidth - 30)
                if(overflowDiffMax > 0 ){
                    appContent.scroll(appContent.scrollLeft + 5,0)
                }
            }
        }

        //SCROLL TOP
        const overFlowTop = e.clientY - (appContent.offsetTop + 30)
        if(overFlowTop < 0 ){
            appContent.scroll(0,appContent.scrollTop - 10)
        }
    };

    //GET X AND Y POSITION OF RESIZED ELEMENT ----------------------------------------------------------------------
    handleResize = (e) => {

        //INIT
        e.preventDefault()
        e.dataTransfer.effectAllowed = "move";

        ///APP CONTENT ELEMENT
        const appContent = document.getElementById("appContent");

        //INIT
        const {initX, initWidth} = this.state.deltaWidth;
        var diffX = e.pageX - initX + (appContent.scrollLeft - this.state.initScroll.initX);
        var newWidth =  initWidth + diffX;
        var dateViewerX = this.state.dateViewer.initX + e.pageX - initX ;
            
        //SET SEULEMETN SI SUP A 0
        if(newWidth > 0 ){
            this.setState(prevState => {
                let deltaWidth = {...prevState.deltaWidth};
                deltaWidth.diffX = diffX;
                let dateViewer = {...prevState.dateViewer};
                dateViewer.x = dateViewerX
                return { 
                    deltaWidth, 
                    dateViewer,
                    itemWidth:newWidth
                }; 
            })
        }

        //SCROLL MANAGEMENT MIN X
        const overflowDiffMin = e.clientX - (appContent.offsetLeft + 210)
        if(overflowDiffMin < 0 ){

            //UPDATE SCROLL
            appContent.scroll(appContent.scrollLeft - 5,0)

        }else{
            //SCROLL MANAGEMENT MAX X SEULEMENT SI VERS LA DROITE
            if(initX - e.clientX < 0 ){
                const overflowDiffMax = e.clientX  - (document.body.clientWidth - 30)
                if(overflowDiffMax > 0 ){
                    appContent.scroll(appContent.scrollLeft + 5,0)
                }
            }
        }
    };

    //START MOVING ITEM --------------------------------------------------------------------------------------------
    onMoveStart = (e, type, item) => { 

        
        //INIT
        var dateViewerX;

        //VIEWVER
        var roadmapHeaderRight = document.getElementById("roadmapHeaderRight").getBoundingClientRect();
        var roadmapHeaderLeft = document.getElementById("roadmapHeaderLeft").getBoundingClientRect();
        var headerY = roadmapHeaderRight.top + roadmapHeaderRight.height - APP_STANDARDS.roadmapViewerHeight;

        //CALCUL LIMITE 
        var limitLeft = roadmapHeaderRight.left ;
        var limitRight =  roadmapHeaderLeft.left + roadmapHeaderLeft.width + roadmapHeaderRight.width;
        var limitRectifRight = 0;

        //WIDTH PARENT SET INIT
        var ctr = document.getElementById("dragShadow");
        e.dataTransfer.setDragImage(ctr, 0, 0);

        //APPCONTENT ELEMENT
        const appContent = document.getElementById("appContent");

        //TEST TYPE
        if(type === "resize"){

            //CALCUL Date Viewer
            dateViewerX = item.right + roadmapHeaderRight.left ;
            limitRectifRight = dateViewerX - e.pageX;
            if(limitRectifRight + dateViewerX > limitRight){limitRectifRight = 0}

            //PRESERV
            this.setState(prevState => {
                let deltaWidth = {...prevState.deltaWidth};
                deltaWidth.initX = e.pageX;
                deltaWidth.initWidth = item.width;
                let limit ={...prevState.limit};
                limit.right = limitRight;
                limit.rectifRight = limitRectifRight;
                let initScroll = {...prevState.initScroll};
                initScroll.initX = appContent.scrollLeft;
                initScroll.initY = appContent.scrollTop;
                return { 
                    isOnDrag:true, 
                    stopTransition: true, 
                    itemWidth: item.width,
                    deltaWidth,
                    initScroll,
                    limit,
                    dateViewer: {
                        initX: dateViewerX,
                        x: dateViewerX, 
                        y:headerY
                    }, 
                }; 
            })

        }else{

            //PERFECT POSITION FOR DATE VIEWER
            dateViewerX = item.left + roadmapHeaderRight.left ;
            if(!item.isTask){dateViewerX = dateViewerX + (this.props.userSettings.roadmapItemHeight / 2)}

            //PRESERV
            this.setState(prevState => {
                let deltaPosition = {...prevState.deltaPosition};
                deltaPosition.initX = e.pageX;
                deltaPosition.initY = e.pageY;
                let limit ={...prevState.limit};
                limit.left = limitLeft;
                limit.rectifLeft = e.pageX - dateViewerX;
                limit.right = limitRight - item.width  ;
                limit.rectifRight = e.pageX - dateViewerX;
                let initScroll = {...prevState.initScroll};
                initScroll.initX = appContent.scrollLeft;
                initScroll.initY = appContent.scrollTop;
                return { 
                    isOnDrag:true, 
                    stopTransition: true, 
                    itemWidth: item.width,
                    limit,
                    initScroll,
                    deltaPosition,
                    dateViewer: {
                        initX: dateViewerX,
                        x: dateViewerX, 
                        y:headerY
                    }, 
                }; 
            })
        }
    }

    //ON MOVE STOP -----------------------------------------------------------------------------------------
    onMoveStop = (type, itemId) => {
    
        //INIT
        var options={};

        //RESIZE FINISH TASK
        if(type === "resize"){

            //OPTIONS CALLBACK
            options={
                action:"resize",
                id:itemId,
                diffX: this.state.deltaWidth.diffX,
                left: this.props.item.left
            }

            //STOP DRAG & LAUNCH POSITION REGARDING NEW TASK RIGHT
            this.setState({
                    isOnDrag:false, 
                    stopTransition:false
                }, 
                this.props.launchAppFunctions(null,"roadmapItemResizeDragDrop", options),
            );

        //DRAG START FOR TASK / FINISH FOR MIL
        }else{

            //RESET POSITION
            const resetPosition = {initX:0, x:0, initY:0, y:0};
            const {x, y} = this.state.deltaPosition;

            //OPTIONS CALLBACK
            options={
                action:"dragDrop",
                id:itemId,
                diffX:x,
                positionY:this.props.item.cumuTop + y,
                groupKey:this.props.groupKey,
                left: this.props.item.left
            }

            //!!!!!!!!!!!!!!!!!!!!
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  modifier positionY
            //!!!!!!!!!!!!!!!!!!


            //STOP DRAG & LAUNCH POSITION REGARDING NEW LEFT & TOP POSITION
            this.setState({
                isOnDrag:false, 
                stopTransition:false, 
                deltaPosition: resetPosition,
                }, 
                this.props.launchAppFunctions(null,"roadmapItemResizeDragDrop", options),
            );
        }
    };

    //////////////////
    /// ITEM MODAL ///
    //////////////////

    //DISPLAY MODAL ----------------------------------------------------------------------------------------------
    handleModal(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({modalShow:!this.state.modalShow});
    }

    /////////////////////////
    /// ITEM CONTEXT MENU ///
    /////////////////////////

    // //UPDATE CONTEXTMENU -------------------------------------------------------------------------------------------
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

    ////////////////////////////////
    /// ROADMAP COMPONENT RENDER ///
    ////////////////////////////////
    render(){

        console.log("Render: ROADMAP ITEM")

        //PROPS
        const {
            item,
            userSettings,
            roadmapMonthWidth,
            isOnEditMode,
            roadmapFirstYear,
            launchAppFunctions,
            updateInputFocus
        } = this.props;



        //IS TASK
        var isTask = item.type === APP_ITEM_TYPES.task || item.type === APP_ITEM_TYPES.consotask;

        //DISPLAY 
        var displayResizer = isTask && isOnEditMode;

        //CSS
        var itemSelectedCss = item.action === "select" ? "0 0 0 3px rgb(13 110 253 / 25%)" : null;
        var itemCopiedCss = item.action === "copy" ? "roadmapItemCopied" : null;
        var itemCss = this.state.stopTransition  ? "box flexBetweenCenter " + itemCopiedCss : "box flexBetweenCenter roadmapItemBlock " + itemCopiedCss;
        
        //COLOR MANAGEMENT
        var colorOptions = FUNC_COLOR_MNGT(isTask, item.colors);

        //ITEM POSITION 
        var itemTransalte = this.state.isOnDrag ? 
            "translate(" + (item.left + this.state.deltaPosition.x) + "px," + (item.top + this.state.deltaPosition.y) + "px)" 
        : 
            "translate(" + item.left + "px," + item.top + "px)";

        //- WIDTH - ZINDEX
        var itemWidth = this.state.isOnDrag ? this.state.itemWidth : this.props.item.width;
        var itemZindex = this.state.isOnDrag ? 51 : 50;

        //LIGTH ITEM INFO
        var itemLight = {
            id: item.id, 
            left: item.left, 
            top: item.top, 
            width: item.width, 
            right: item.right, 
            isTask: isTask
        }

        /////////////////////////////////////
        /// ROADMAP ITEM COMPONENT RETURN ///
        /////////////////////////////////////
        return(
            <React.Fragment key={"item-displayed-" + item.id}>

                {/* DRAGGABLE CONTENT, DO NOT INCLUDE DATEVIEWER / MODAL INFO / CONTEXT MENU ----------------------------- */}
            

                    {/* ITEM CONTENT --------------------------------------------------------------------------------------*/}
                    <div 
                        id={item.id}
                        className={itemCss} 
                        onContextMenu={isOnEditMode ? (e) => this.updateContextMenu(e) : null}
                        onClick={!isOnEditMode? (e) => this.handleModal(e) : null}
                        style={{
                            width: itemWidth, 
                            height: userSettings.roadmapItemHeight,
                            backgroundColor: isTask ? colorOptions.background : null,
                            border: isTask ? colorOptions.border ? "1px solid " + colorOptions.borderColor : "none" : "none",
                            borderRadius: isTask ? colorOptions.borderRadius ? "3px" : "0px" : "0px",
                            color: isTask ? colorOptions.textColorTask : colorOptions.textColorMilestone, 
                            fontSize: userSettings.roadmapItemFontSize,
                            zIndex: itemZindex,
                            boxShadow: itemSelectedCss,
                            transform : itemTransalte,
                            top:"0px", 
                            left:"0px",

                        }}
                    >

                        {/* ITEM ICON WITH DRAG AND DROP OPTION  --------------------------------------------------*/}
                        {isOnEditMode ? 
                            <div 
                                id={"icon-" + item.id}
                                onMouseDown={(e) => e.stopPropagation()}
                                onDrag={(e) => this.handleDrag(e, item.id)} 
                                onDragStart={(e) => this.onMoveStart(e,"drag", itemLight)}
                                onDragEnd={() => this.onMoveStop("drag", item.id)}
                                draggable
                                style={{height: "inherit"}}
                            >
                                <ItemIcon 
                                    isOnEditMode={isOnEditMode}
                                    id={item.id}
                                    type={item.type}
                                    iconColor={colorOptions.iconColor}
                                    roadmapItemHeight={userSettings.roadmapItemHeight}
                                />
                            </div>
                        : 
                            //DO NOT DISPLAY IF IT'S TASK
                            !isTask ?
                                <ItemIcon 
                                    isOnEditMode={isOnEditMode}
                                    id={item.id}
                                    type={item.type}
                                    iconColor={colorOptions.iconColor}
                                    roadmapItemHeight={userSettings.roadmapItemHeight}
                                />
                            :null
                        }
                    
                        {/* CALL UPDATER COMPONENT -------------------------------------*/}
                        <UpdaterWithInput 
                            item={item}
                            isOnEditMode={isOnEditMode}
                            inputType="input" 
                            inputName="name"
                            isTask={isTask}
                            launchAppFunctions={launchAppFunctions}
                            updateInputFocus={updateInputFocus}
                        />

                        {/* RISIZER ------------------ --------------------------------- */}
                        {displayResizer ?
                            <div 
                                id={"resizer-" + item.id} 
                                className="roadmapItemResizer"
                                onMouseDown={(e) => e.stopPropagation()}
                                onDrag={(e) => this.handleResize(e, item.id)} 
                                onDragStart={(e) => this.onMoveStart(e,"resize", itemLight)}
                                onDragEnd={() => this.onMoveStop("resize", item.id)}
                                draggable
                            >
                            </div>
                        :null}
                        
                    </div>
         

                {/* DATE VIEWER ---------------------------------------------------------------------*/}
                {this.state.isOnDrag?
                    <DateViewer 
                        height={APP_STANDARDS.roadmapViewerHeight}
                        width={APP_STANDARDS.roadmapViewerWidth}
                        left={this.state.dateViewer.x - APP_STANDARDS.roadmapViewerWidth/2}
                        top={this.state.dateViewer.y}
                        roadmapFirstYear={roadmapFirstYear}
                        roadmapMonthWidth={roadmapMonthWidth}
                    />
                :null}

                {/* MODAL INFO ----------------------------------------------------------------------*/}
                {!isOnEditMode && this.state.modalShow ?
                    <ItemInfoModal 
                        item={item} 
                        resetModal={this.handleModal} 
                    />
                :null}

                {/* CONTEXT MENU ------------------------------------------------------------------- */}
                {this.state.displayContextMenu?
                    <ContextMenu 
                        contextMenuX={this.state.contextMenuX}
                        contextMenuY={this.state.contextMenuY}
                        mouseX={this.state.mouseX}
                        mouseY={this.state.mouseY}
                        type="item"
                        item={item}
                        resetContextMenu={this.resetContextMenu}
                        launchAppFunctions={launchAppFunctions}
                    />
                :null}



            </React.Fragment>
        )
    }
}
export default RoadmapItem