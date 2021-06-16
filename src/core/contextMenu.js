import React from 'react'
import {createPortal} from 'react-dom';
import {
  CONTEXT_MENU_ROADMAP_GROUP, 
  CONTEXT_MENU_ROADMAP_ITEM,
  CONTEXT_MENU_ROADMAP_HEADER,
  APP_STANDARDS,
} from '../core/constants'

//////////////////////////////////////////////////////////////
/// CONTEXT MENU /////////////////////////////////////////////
//////////////////////////////////////////////////////////////

export function ContextMenu ({
    contextMenuX,
    contextMenuY, 
    mouseX,
    mouseY,
    item, 
    type,
    launchAppFunctions,
    resetContextMenu,
    options,
    actions,
  }) {

      //INIT GROUP OPTION
      if(type === "group"){

        //TROUVER TOP DU GROUP
        var groupRect = document.getElementById("itemsGroup-" + item.key).getBoundingClientRect()

        //INTEGRATION OPTION PLUS GESTION DU SCROLL HORIZONTAL
        var groupOptions = {
          mouseX : mouseX + document.getElementById("appContent").scrollLeft - groupRect.left, 
          mouseY : mouseY - groupRect.top, 
          groupKey : item.key
        }
      }

      //FUNCTION HANDLE
      const handleAction = (e, parameters, options) =>{
        e.preventDefault()
        launchAppFunctions(e, parameters, options)
        resetContextMenu(e)
      }

      /////////////////
      /// ITEM MENU ///
      ///////////////// 
      const  roadmapItemMenu = () =>{
      return  CONTEXT_MENU_ROADMAP_ITEM.map(menu => {
        if(menu.name === "separator"){
          return <div key={"contextItem" + menu.sort}  className="contextMenuSeperator"></div>
        }else{
          
          return(
            <div 
              key={"contextItem" + menu.sort} 
              className={menu.icon === "delete" ? "contextMenuAction flexStartCenter contextMenuActionDelete" : "contextMenuAction flexStartCenter"}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => handleAction(e,menu.parameter,item)}
            >
              <span className="material-icons contextMenuActionIcon">
                {menu.icon}
              </span>
              {menu.name}
            </div>
          )
        }
      })
    }

      //////////////////
      /// GROUP MENU ///
      //////////////////
      const roadmapGroupMenu = () =>{
         return CONTEXT_MENU_ROADMAP_GROUP.map(menu => {
        if(menu.name === "separator"){
          return <div key={"contextGroup" + menu.sort} className="contextMenuSeperator"></div>
        }else{

         //DO NOT DISPLAY PASTE IF SELECTED ITEM NULL
          if(
              (!actions.isItemsCopied && menu.name === "Paste") 
            || 
              (!actions.isItemsSelected && menu.name === "Move here")
            ){
            return null
          }else{

            //RETURN MENU
            return(
              <div 
                key={"contextGroup" + menu.sort} 
                className="contextMenuAction flexStartCenter " 
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => handleAction(e,menu.parameter,groupOptions)}
              >
                <span className="material-icons contextMenuActionIcon " >
                  {menu.icon}
                </span>
                {menu.name}
              </div>
            )
          }
        }
      })
    }

      ///////////////////
      /// HEADER MENU ///
      ///////////////////
      const roadmapHeaderMenu = () =>{

      return CONTEXT_MENU_ROADMAP_HEADER.map(menu => {

          //TESTER SI PASSER ICON ACTIF
          var iconClassSelected = null;
          var toDisplay = false

          //QUATER
          if(menu.name === "Quaters"  && options.roadmapMonthWidth >= APP_STANDARDS.roadmapMinDisplayQuater){
            toDisplay = true
            if(options.display.isRoadmapQuaters){iconClassSelected = "contextMenuActionIconSelected"}
          }

          //MONTHS
          if(menu.name === "Months" && options.roadmapMonthWidth >= APP_STANDARDS.roadmapMinDisplayMonth){
            toDisplay = true
            if(options.display.isRoadmapMonths){iconClassSelected = "contextMenuActionIconSelected"}
          }

          //WEEKS
          if(menu.name === "Weeks" && options.roadmapMonthWidth >= APP_STANDARDS.roadmapMinDisplayWeek){
            toDisplay = true
            if(options.display.isRoadmapWeeks){iconClassSelected = "contextMenuActionIconSelected"}
          }

          //DAYS
          if(menu.name === "Days" && options.roadmapMonthWidth >= APP_STANDARDS.roadmapMinDisplayDay){
            toDisplay = true
            if(options.display.isRoadmapDays){iconClassSelected = "contextMenuActionIconSelected"}
          }

          //RETURN SI TO DISPLAY
          if(toDisplay){
            return(
              <div 
                key={"contextGroup" + menu.sort} 
                className="contextMenuAction flexStartCenter"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => handleAction(e,"roadmapHeader", {parameter: menu.parameter})}
              >
                <span className={"material-icons contextMenuActionIcon " + iconClassSelected}>
                  {menu.icon}
                </span>
                {menu.name}
              </div>
            )
            }else{return null};
        }
      )
    }

      ///////////////////
      /// SWITCH MENU ///
      ///////////////////

      const switchMenu = () =>{

        //SWITCH
        var contexMenu = [];
        switch (type) {

          //ROADMAP ITEM
          case 'item':
            contexMenu = [
              <React.Fragment key="contextMenu-Item">
                <div className="contextMenuTitle">{item.name}</div>
                {roadmapItemMenu()}
              </React.Fragment>
            ]
            break;

          //ROADMAP GROUP
          case 'group':
            contexMenu = [
              <React.Fragment key="contextMenu-Group">
                <div className="contextMenuTitle flexStartCenter">{item.name}</div>
                {roadmapGroupMenu()}
              </React.Fragment>
            ]
            break;

          //ROADMAP HEADER
          case 'header':
            contexMenu = [
              <React.Fragment key="contextMenu-Group">
                <div className="contextMenuTitle flexStartCenter">Display / Hidde</div>
                {roadmapHeaderMenu()}
              </React.Fragment>
            ]
            break;

          default:
            contexMenu = [];
        }

        //RETURN CONTEXT MENU AFTER SWICTH
        return contexMenu;
      }

      ///////////////////////////
      /// RENDER CONTEXT MENU ///
      ///////////////////////////
      return createPortal(
        <React.Fragment>
          <div
            className="contextMenuContent"
            style={{
              top: contextMenuY, 
              left: contextMenuX
            }}
          >
            {switchMenu()}
          </div>
          <div 
            className="contextMenuBg" 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => resetContextMenu(e)}
            onContextMenu={(e) => resetContextMenu(e)}
          ></div>
        </React.Fragment>
        , document.body
      );
    }