import React from 'react'
import {
    APP_ITEM_TYPES_ENRICH,
    APP_ITEM_TYPES,
} from './constants'
import {
    FUNCT_FIND_INDEX,
} from './standards'


///////////////////////////////////////////////////////////
/// ITEM ICON /////////////////////////////////////////////
///////////////////////////////////////////////////////////

export function ItemIcon (
    {isOnEditMode, 
    id,
    type,
    iconColor,
    roadmapItemHeight
}) {

    //INIT
    var iconJSX = [];

    //FIND ICON IN ENRICH ICON OBJECT
    const index = FUNCT_FIND_INDEX(APP_ITEM_TYPES_ENRICH,"type",type);

    //SPECIFIC MILESTONE FOR TRIANGLE (NO TIRANGLE ICON IN GOOGLE FONT)
    if(type === APP_ITEM_TYPES.milestone){
        iconJSX= [
            <strong 
                key={"icon-" + id}
                id={id} 
                className={isOnEditMode ? "grabCursor" : null} 
                style={{
                    display:"inline-block",
                    height:0,
                    width:0,
                    margin:"4px",
                    borderRight:(roadmapItemHeight - 8)/2 + "px solid transparent",
                    borderBottom:(roadmapItemHeight - 8) + "px solid " + iconColor,
                    borderLeft:(roadmapItemHeight - 8)/2 + "px solid transparent",
                }}
            >
            </strong>
        ]

    //OTHER
    }else{
        iconJSX= [
            <strong 
                key={"icon-" + id}
                id={id} 
                className={isOnEditMode ? "grabCursor material-icons" : "material-icons"} 
                style={{
                    color:  iconColor,
                    fontSize:roadmapItemHeight + "px",
                    transform:APP_ITEM_TYPES_ENRICH[index].rotate ? 
                        "rotate(" + APP_ITEM_TYPES_ENRICH[index].rotate +")" 
                    :null}}
            >
                {APP_ITEM_TYPES_ENRICH[index].icon}
            </strong>
        ]
    }

    //RETURN JSX ICON
    return iconJSX;
}