
import React, {useState} from 'react'
import {createPortal} from 'react-dom';
import { 
    useInput, 
    FUNC_ZERO_FORMAT_TO_NUM,
    FUNC_PARSE_DATE_FROM_INPUT,
    FUNC_TEXT_WIDTH,
    FUNC_COLOR_MNGT,
    FUNC_ROADMAP_SELECTED_ITEM,
 } from '../core/standards'
 import {
    APP_ITEM_TYPES_ENRICH,
    APP_ITEM_TYPES,
    APP_TXT_TBD,
 } from '../core/constants'


/////////////////////////////////////////////////////////////
/// ITEM INFO MODAL /////////////////////////////////////////
/////////////////////////////////////////////////////////////

export function ItemInfoModal ({item, resetModal}) {
    return createPortal(
        <React.Fragment>
            <div className="modalAnimationContent modal fade show" id={"modal-" + item.id} style={{display:"block"}} onClick={(e) => resetModal(e)} >
                <div className="modal-dialog ">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{item.name}</h5>
                        <button type="button" className="btn-close" onClick={(e) => resetModal(e)}></button>
                    </div>
                    <div className="modal-body">
                    CONTENT CONTENT
                    </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show modalAnimationBg" ></div>

        </React.Fragment>
        , document.body
    );
  };

/////////////////////////////////////////////////////////////
/// FILTER MODAL ////////////////////////////////////////////
/////////////////////////////////////////////////////////////

export function DateRangeFilterModal ({resetModal, roadmapMinMaxDate,roadmapFirstPeriod,roadmapLastPeriod, launchAppFunctions}) {

    //INIT
    var initStartDate;
    var initFiniashDate;

    //RECTIF DATE
    if(roadmapFirstPeriod && roadmapLastPeriod){
        initStartDate = roadmapFirstPeriod.getFullYear() + "-" + FUNC_ZERO_FORMAT_TO_NUM(roadmapFirstPeriod.getMonth()+1,2) + "-" + FUNC_ZERO_FORMAT_TO_NUM(roadmapFirstPeriod.getDate(),2);
        initFiniashDate = roadmapLastPeriod.getFullYear() + "-" + FUNC_ZERO_FORMAT_TO_NUM(roadmapLastPeriod.getMonth()+1,2) + "-" + FUNC_ZERO_FORMAT_TO_NUM(roadmapLastPeriod.getDate(),2);
    }else{
        initStartDate = roadmapMinMaxDate.min.getFullYear() + "-" + FUNC_ZERO_FORMAT_TO_NUM(roadmapMinMaxDate.min.getMonth()+1,2) + "-" + FUNC_ZERO_FORMAT_TO_NUM(roadmapMinMaxDate.min.getDate(),2);
        initFiniashDate = roadmapMinMaxDate.max.getFullYear() + "-" + FUNC_ZERO_FORMAT_TO_NUM(roadmapMinMaxDate.max.getMonth()+1,2) + "-" + FUNC_ZERO_FORMAT_TO_NUM(roadmapMinMaxDate.max.getDate(),2);

    }
    //CONSTRUCTOR
    const {value:startDate, bind:bindStartDate} = useInput(initStartDate);
    const {value:finishDate, bind:bindFinishDate} = useInput(initFiniashDate); 

    //SUBMIT FORM
    const handleSubmit = (e) => {
        e.preventDefault()

        //GET DATE
        const endStartDate = FUNC_PARSE_DATE_FROM_INPUT(startDate);
        const endFinishDate = FUNC_PARSE_DATE_FROM_INPUT(finishDate)

        //OPTIONS
        var options={
            startDate: endStartDate,
            finishDate: endFinishDate,
            startYear: endStartDate.getFullYear(),
            finishYear: endFinishDate.getFullYear()
        }

        //UPDATE APPSET
        launchAppFunctions(e, "roadmapHeaderRangePeriod", options);

        //CLOSE MODAL
        resetModal(e);
    }

    //COMPONENT RENDER
    return createPortal(
        <React.Fragment>
            <div 
                className="modalContent" 
                style={{display:"block"}} 
            >
                    <div className="modal-content">
                        <div className="modal-header modalBlockBg">
                            <span className="material-icons" style={{marginRight:"10px"}} >date_range</span>
                            <h5 className="modal-title">Date Range Selection</h5>
                            <button type="button" className="btn-close" onClick={(e) => resetModal(e)}></button>
                        </div>
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <div   
                                className="modal-body flexBetweenCenter"
                                style={{paddingBottom:"25px"}}
                            >
                                <div >
                                    <label className="form-label modalLabel">Start Date</label>
                                    <input type="date" {...bindStartDate} required className="form-control" />
                                </div>
                                <span className="material-icons" style={{fontSize:"35px",marginTop:"28px",color:"#ccc"}} >forward</span>
                                <div >
                                    <label className="form-label modalLabel">Finish Date</label>
                                    <input type="date" {...bindFinishDate} required className="form-control"/>
                                </div>
                            </div>
                            <div className="modal-footer modalBlockBg">
                                
                                <button type="submit" className="btn modalButtonSubmit">Update</button>
                            </div>
                        </form>
                    </div>
                
            </div>
            <div className="modalBg" onClick={(e) => resetModal(e)}></div>

        </React.Fragment>
        , document.body
    );
  };

/////////////////////////////////////////////////////////////
/// DELTE ITEMS CONFIRMATION MODAL //////////////////////////
/////////////////////////////////////////////////////////////

export function DeleteItemsModal ({items,updateState,actionDeleteItems}) {

    //RESET
    const resetAction = {
        type: null,
        items: null,
    }

    //COMPONENT RENDER
    return createPortal(
        <React.Fragment>
            <div 
                className="modalContent" 
                style={{display:"block"}} 
            >
                    <div className="modal-content">
                        <div className="modal-header modalBlockBg">
                            <span className="material-icons" style={{marginRight:"10px"}} >delete_forever</span>
                            <h5 className="modal-title">Delete {items.length} Item(s) ?</h5>
                            <button type="button" className="btn-close" onClick={() => updateState("action", resetAction)}></button>
                        </div>
                            <div   
                                className="modal-body flexColCenterStart"
                                style={{paddingBottom:"25px"}}
                            >
                               {items.map(item => {
                                   return(
                                   <div key={"deletedItem-" + item.id} className="flexStartCenter">
                                       <span className="material-icons modalIconListDelete" >clear</span>
                                       <span style={{fontWeight:600, marginRight:"5px"}}>{item.id}</span>- {item.name}
                                    </div>
                                   )
                                })
                               }
                            </div>
                            <div className="modal-footer modalBlockBg">
                                <button type="submit" className="btn modalButtonSubmitDanger" onClick={(e) => actionDeleteItems(e)}>Delete</button>
                            </div>
                    </div>
                
            </div>
            <div className="modalBg" onClick={() => updateState("action", resetAction)}></div>

        </React.Fragment>
        , document.body
    );
  };

/////////////////////////////////////////////////////////////
/// DELTE ITEMS CONFIRMATION MODAL //////////////////////////
/////////////////////////////////////////////////////////////

export function AddItemsModal ({updateState, roadmapNewItemOption, launchAppFunctions, userSettings}) {

    //CONSTRUCTOR
    const {value:multiplier, bind:bindMultiplier} = useInput(1);

    //USE STATE
    const [type, setType] = useState(APP_ITEM_TYPES.milestone);
    const [specific, setSpecific] = useState({level: false, group:false});

    //CHANGE
    const changeHandler = e => {
        setSpecific({...specific, [e.target.name]: !specific[e.target.name]})
    }

    //SUBMIT FORM
    const handleSubmit = (e) => {
        
        //INT
        e.preventDefault()
        var itemOject = [];
        
        //CAL MULTIPLIER
        var newMultiplier = 1;
        if(multiplier && multiplier !== ""){newMultiplier = Number(multiplier);}

        //LOOP
        var currentItem;
        for (var i = 0 ; i < newMultiplier ; i++){

            //RESET
            currentItem = {};            
            currentItem.type = type;
            currentItem.optionLabel = false;
            currentItem.name = APP_TXT_TBD;
            currentItem.display = true

            //TEST SI TASK OU MILESTONE
            if(type === APP_ITEM_TYPES.task || type === APP_ITEM_TYPES.consoTask){
                currentItem.width =200;
            }else{
                currentItem.txtWidth = FUNC_TEXT_WIDTH("canevasMilestone", APP_TXT_TBD, userSettings.roadmapItemFontSize);
                currentItem.width = userSettings.roadmapItemHeight + currentItem.txtWidth;
            }

            //PUSH
            itemOject.push(currentItem)
        }

        var options = {
            itemOject:itemOject,
            roadmapNewItemOption:roadmapNewItemOption,
            specific:specific,
        }

        //LANCEMENT MAJ
        launchAppFunctions(e, "roadmapGroupAddItem", options);

    }


    //COMPONENT RENDER
    return createPortal(
        <React.Fragment>
            <div 
                className="modalContent" 
                style={{display:"block"}} 
            >
                <div className="modal-content">
                    <div className="modal-header modalBlockBg">
                        <span className="material-icons" style={{marginRight:"10px"}} >add_circle</span>
                        <h5 className="modal-title">Add Item(s)</h5>
                        <button type="button" className="btn-close" onClick={() => updateState("appSettings", {actionModal: null})}></button>
                    </div>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div   
                            className="modal-body flexColCenterStart modalBody"
                            style={{padding:"0px"}}
                        >
                            <div 
                                className="flexColCenterStart"
                                style={{padding:"15px 20px 0px 20px"}}
                            >
                                <span className="modalGroupTitle">Choose a Type</span>
                                <div>
                                {APP_ITEM_TYPES_ENRICH.map((item, index) => {
                                    return(
                                        <div 
                                            key={"addItem-" + index} 
                                            className="modalItemFloat"
                                            style={{marginBottom:"10px"}}
                                        >

                                            <input
                                                id={"addItem-" + index}
                                                type="radio"
                                                value={item.type}
                                                checked={type === item.type}
                                                onChange={() => setType(item.type)}
                                                className="btn-check"
                                            />

                                            <label 
                                                className={item.type === type ? "btn modalButtonSubmit flexStartCenter" : "btn modalButtonSubmitOutline flexStartCenter"} 
                                                htmlFor={"addItem-" + index}
                                                style={{cursor:"pointer"}}
                                            >
                                                {item.type !== APP_ITEM_TYPES.consoTask && item.type !== APP_ITEM_TYPES.task ?
                                                    <span 
                                                        className="material-icons " 
                                                        style={{
                                                            fontSize:userSettings.roadmapItemHeight + "px",
                                                            marginRight:"5px",
                                                            marginLeft:"-3px",
                                                            transform:item.rotate ? 
                                                                "rotate(" + item.rotate +")" 
                                                            :null}}
                                                    >
                                                        {item.icon}
                                                    </span>
                                                :null}
                                                <span style={{fontWeight:600}}>
                                                    {item.type}
                                                </span>
                                            </label>
                                        </div>
                                    )
                                })}
                            </div>
                            </div>

                            {/* ITEM MULTIPLIER */}
                            <div className="modalSeparator"></div>
                            <div 
                                className="modalBlockInfo flexColCenterStart" 
                                style={{padding:"5px 20px 0px 20px"}}
                            >
                                <div className="modalGroupTitle">Multiply the number of Added Item</div>
                                <div className="flexStartCenter">
                                    <input type="text" {...bindMultiplier} className="form-control" name="number" required maxLength="3" style={{width:"52px"}}/>
                                    
                                </div>
                            </div>

                            {/* Options */}
                            <div className="modalSeparator"></div>
                            <div 
                                className="modalBlockInfo flexColCenterStart" 
                                style={{padding:"5px 20px 15px 20px"}}
                            >
                                <div className="modalGroupTitle" >Specific Options</div>
                                <div className="flexColCenterStart">
                                    
                                    <div className="form-check form-switch" style={{fontSize:"14px"}}>
                                        <input className="form-check-input" type="checkbox" name="level" onChange={changeHandler} />
                                        <label className="form-check-label">Add item(s) in a new Level group</label>
                                    </div>

                                    <div className="form-check form-switch" style={{fontSize:"14px"}}>
                                        <input className="form-check-input" type="checkbox" name="group" onChange={changeHandler}/>
                                        <label className="form-check-label" >Add item(s) in a new Domain group</label>
                                    </div>
                                   
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer modalBlockBg">
                            
                            <button type="submit" className="btn modalButtonSubmitSuccess">Add</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="modalBg" onClick={() => updateState("appSettings", {actionModal: null})}></div>

        </React.Fragment>
        , document.body
    );
};

/////////////////////////////////////////////////////////////
/// DELTE ITEMS CONFIRMATION MODAL //////////////////////////
/////////////////////////////////////////////////////////////

export function ColorsItemsModal ({updateState, roadmapNewItemOption, launchAppFunctions, itemList}) {


    const selectedItem = FUNC_ROADMAP_SELECTED_ITEM(itemList);

    //INIT
    var isTask;
    if(selectedItem){
        isTask = selectedItem !== "milestone";
    }else{
        isTask = APP_ITEM_TYPES.task === roadmapNewItemOption.type || APP_ITEM_TYPES.consoTask === roadmapNewItemOption.type;
    }
    
    //GET COLOR 
    var colorOptions = FUNC_COLOR_MNGT(isTask, roadmapNewItemOption.colors);

    ////////////////////////
    /// COLORS SELECTORS ///
    ////////////////////////

    //SET STATE
    const [colors, setColors] = useState({
        background:colorOptions.background,
        textTask: colorOptions.textColorTask,
        textMilestone: colorOptions.textColorMilestone,
        border: colorOptions.borderColor,
        icon: colorOptions.iconColor,
    });

    //HANDLE COLOR
    const handlerColor = (e) =>{
        setColors({...colors, [e.target.name]: e.target.value})
    }

    ////////////////////////
    /// SPECIFIC OPTIONS ///
    ////////////////////////

    //SET STATE
    const [specific, setSpecific] = useState({border: !colorOptions.border, borderRadius: !colorOptions.borderRadius});
    
    //HANDLER
    const handlerSpecific = e => {
        setSpecific({...specific, [e.target.name]: !specific[e.target.name]})
    }

    ///////////////////
    /// SUBMIT FORM ///
    ///////////////////

    const handleSubmit = (e) => {
        
        //INT
        e.preventDefault()
        var colorsOject = {
            colors:{},
        };

        //IS TASK 
        colorsOject.colors.background = colors.background;
        colorsOject.colors.textColorTask = colors.textTask;
        colorsOject.colors.textColorMilestone = colors.textMilestone;
        colorsOject.colors.borderColor = colors.border;
        colorsOject.colors.border = !specific.border;
        colorsOject.colors.borderRadius = !specific.borderRadius;
        colorsOject.colors.iconColor = colors.icon;
        colorsOject.action = null;

        //selectedItemId
        var selectedItemId;
        if (selectedItem){
            selectedItemId = itemList.map(item => item.id);
        }else{
            selectedItemId = [roadmapNewItemOption.id];
        }

        //OPTIONS
        var options  ={
            itemId: selectedItemId,
            colorsOject,
        }

        //LANCEMENT MAJ
        launchAppFunctions(e, "roadmapItemColor", options);
        updateState("appSettings", {actionModal: null});

    }

    //COMPONENT RENDER
    return createPortal(
        <React.Fragment>
            <div 
                className="modalContent" 
                style={{display:"block"}} 
            >
                <div className="modal-content">
                    <div className="modal-header modalBlockBg">
                        <span className="material-icons" style={{marginRight:"10px"}} >color_lens</span>
                        <h5 className="modal-title">Item Color Management</h5>
                        <button type="button" className="btn-close" onClick={() => updateState("appSettings", {actionModal: null})}></button>
                    </div>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div   
                            className="modal-body flexColCenterStart modalBody"
                            style={{padding:"0px"}}
                        >
                            <div 
                                className="flexColCenterStart"
                                style={{padding:"15px 20px 0px 20px"}}
                            >
                                <span className="modalGroupTitle">Preview</span>

                                {/* FLEX LINE*/}
                                <div className="flexBetweenStart" style={{width:"415px"}}>

                                    {isTask || selectedItem === "both" ? 
                                        <div 
                                            className="modalPreview"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.textTask,
                                                borderRadius: specific.borderRadius ? 0 : "4px",
                                                border: specific.border ? "none" : "1px solid " + colors.border, 
                                                padding:"5px 10px",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Task Text Preview
                                        </div>
                                    :null}

                         

                                    {!isTask || selectedItem === "both" ? 
                                        <div className="modalPreview flexStartCenter">
                                            <span 
                                                className="material-icons" 
                                                style={{
                                                    marginRight:"6px",
                                                    color: colors.icon,
                                                }}
                                            >
                                                star</span>
                                            <span style={{
                                                color: colors.textMilestone,
                                                fontWeight: 500,
                                                }}>
                                                    Milestone Text Preview
                                            </span>
                                        </div>
                                    :null}
                                </div>

                            </div>

                            {/* ITEM MULTIPLIER */}
                            <div className="modalSeparator"></div>
                            <div 
                                className="modalBlockInfo flexColCenterStart" 
                                style={{padding:"5px 20px 0px 20px"}}
                            >
                                
                                
                                {/* FLEX LINE*/}
                                <div className="flexBetweenStart" style={{width:"380px"}}>

                                    

                                    {/* TASK */}
                                    {isTask || selectedItem === "both" ?
                                        <div>

                                            <div className="modalGroupTitle">Task Colors Selectors</div>

                                            {/* TEXT COLOR */}
                                            <div className="flexStartCenter modalInputRow">
                                                <input type="color" className="form-control modalInputColor" name="textTask" defaultValue={colors.textTask} onChange={handlerColor} />
                                                Text Color
                                            </div>

                                            {/* BACKGROUND COLOR */}
                                            <div className="flexStartCenter modalInputRow">
                                                <input type="color" className="form-control modalInputColor"  name="background" defaultValue={colors.background}  onChange={handlerColor} />
                                                Background Color 
                                            </div>

                                            {/* BORDER COLOR */}
                                            <div className="flexStartCenter modalInputRow">
                                                <input type="color" className="form-control modalInputColor" name="border" defaultValue={colors.border} onChange={handlerColor} />
                                                Border Color
                                            </div>
                                        </div>

                                    :null}

                                    
                                    {/* MILESTONE */}
                                    {!isTask || selectedItem === "both" ? 
                                        <div>

                                            <div className="modalGroupTitle">Task Colors Selectors</div>

                                            {/* TEXT COLOR */}
                                            <div className="flexStartCenter modalInputRow">
                                                <input type="color" className="form-control modalInputColor" name="textMilestone" defaultValue={colors.textMilestone} onChange={handlerColor} />
                                                Text Color
                                            </div>

                                            {/* ICON */}
                                            <div className="flexStartCenter modalInputRow">
                                                <input type="color" className="form-control modalInputColor"  name="icon" defaultValue={colors.icon} onChange={handlerColor} />
                                                Icon Color 
                                            </div>
                                        </div>

                                    :null}
                                </div>

                            </div>

                            {/* Options */}

                            {isTask?
                                <React.Fragment>
                                    <div className="modalSeparator"></div>
                                    <div 
                                        className="modalBlockInfo flexColCenterStart" 
                                        style={{padding:"5px 20px 15px 20px"}}
                                    >
                                        <div className="modalGroupTitle" >Specific Options</div>
                                        <div className="flexColCenterStart">
                                            
                                            {/* Border */}
                                            <div className="form-check form-switch" style={{fontSize:"14px"}}>
                                                <input className="form-check-input" type="checkbox" name="border" onChange={handlerSpecific} />
                                                <label className="form-check-label">Disabled Border</label>
                                            </div>

                                            {/* Border radius */}
                                            <div className="form-check form-switch" style={{fontSize:"14px"}}>
                                                <input className="form-check-input" type="checkbox" name="borderRadius" onChange={handlerSpecific}/>
                                                <label className="form-check-label" >Disabled border radius</label>
                                            </div>
                         
                                        </div>
                                    </div>
                                </React.Fragment>
                            :<div style={{height:"10px"}}></div>}

                        </div>


                        <div className="modal-footer modalBlockBg">
                            
                            <button type="submit" className="btn modalButtonSubmitSuccess">Update</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="modalBg" onClick={() => updateState("appSettings", {actionModal: null})}></div>

        </React.Fragment>
        , document.body
    );
};