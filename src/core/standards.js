import React, {useState} from 'react'
import ReactTooltip from "react-tooltip";
import {
  APP_MONTH_NAMES,
  APP_STANDARDS,
  APP_ITEM_TYPES
} from '../core/constants'


///////////////////////////////////////////////////////////////
/// CUSTOM HOOK ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////

//USE INPUT IN FORM
export const useInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  //RETURN useInput Attribut and method
  return {
    value,
    setValue,
    bind: {
      value,
      onChange: event => {

        //CHECK NUMBER
        var newValue = event.target.value;
        if(event.target.name === "number" && isNaN(newValue)){newValue = 1}

        //SET VALUE
        setValue(newValue);
      }
    }
  };
};


//////////////////////////////////////////////////////////////////////
/// HELPERS //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

//DETERMINE IF SCROLL CLIQUED
export const FUNC_IS_ON_SCROLL = (clientX, clientY) => {

  //INIT
  var isOnScoll = false;

  //GET APP OCNTENT ELEMENT
  var appContent = document.getElementById("appContent")

  //TEST SCROLL BAR 
  var isScrollX = appContent.scrollWidth > appContent.clientWidth;
  var isScrollY = appContent.scrollHeight > appContent.clientHeight;

  //TEST SUR Y
  if (isScrollY 
    && clientX >= (appContent.offsetLeft + appContent.offsetWidth - 8)
    && clientX <= (appContent.offsetLeft + appContent.offsetWidth)
  ){isOnScoll = true}

  //TEST SUR X
  if (isScrollX 
    && clientY >= (appContent.offsetTop + appContent.offsetHeight - 8)
    && clientY <= (appContent.offsetTop + appContent.offsetHeight)
  ){isOnScoll = true}

  //RETURN
  return isOnScoll

}

//DETERMINE IF TASK AND MILESTONE SELECTED OR ONLY TASK OR ONLY MILESOTNE FOR COLOR SETTINGS
export const FUNC_ROADMAP_SELECTED_ITEM = (itemList) => {
  let selectedItem = null;
  let isTask = false;
  let isMilestone = false;
  if (itemList.length > 0){

    //loop selected items to identify task and milestones
    for (let j=0 ; j < itemList.length ; j++){
      if (itemList[j].type === APP_ITEM_TYPES.task || itemList[j].type === APP_ITEM_TYPES.consotask){
        isTask = true;
      }else{
        isMilestone=true;
      }
    }

    //set selectedItem info
    if(isTask && isMilestone){
      selectedItem = "both"
    }else{
      if(isTask && !isMilestone){
        selectedItem = "task"
      }else{
        selectedItem = "milestone"
      }
    }

  }
  return selectedItem;
}

//ROADMAP SIZE INFO
export const FUNC_ROADMAP_SIZE_INFO = (appSettings,headerOption,roadmapPeriod ) =>{
  var roadmapSizeInfo = {};
  roadmapSizeInfo.roamdpaHeaderHeight = FUNC_GET_ROADMAP_HEADER_HEIGHT(headerOption, appSettings.roadmapMonthWidth);
  roadmapSizeInfo.roadmapWidth = (roadmapPeriod.roadmapLastYear - roadmapPeriod.roadmapFirstYear + 1)*(appSettings.roadmapMonthWidth*12) + APP_STANDARDS.roadmapGroupWidth + 1 
  return roadmapSizeInfo
}


//ROADMAP GROUP HEIGHT AND GLOBAL
export const FUNC_ROADMAP_GROUP_HEIGHT = (roadmapData, groupSettings, userSettings) =>{

  //
  var roadmapHeightGroup = {};
  var groupsSettingsShallow = groupSettings;
  var roadmapHeight = 0;

  //TEST SI ROADMAP DATA
  if(roadmapData){

      //ITEM LIST
      const groupHeight = (group) => {
          let items = roadmapData.filter(item => item.groupKey === groupsSettingsShallow[group].key && item.display);
          items.sort(function(a, b){return a.top - b.top;})
          let heightCalc = items[items.length-1].top + userSettings.roadmapItemHeight + userSettings.roadmapItemSpaceLine;
          return heightCalc
      }

      //LOOP
      for(let i = 0 ; i < groupsSettingsShallow.length ; i++){
          groupsSettingsShallow[i].height = groupHeight(i);
          roadmapHeight = roadmapHeight + groupsSettingsShallow[i].height;
      }
  }else{
      roadmapHeight = APP_STANDARDS.roadmapInitHeight;
  }

  //OBJECT RETURN
  roadmapHeightGroup.roadmapHeight = roadmapHeight
  roadmapHeightGroup.group = groupsSettingsShallow

  //RETURN
  return roadmapHeightGroup
}

//RETURN MIN MAX DATE OF AN ARRAY 
export const FUNC_ARRAY_MIN_MAX = (array, minAttribut, maxAttribut) => {
  var minMax = {};
  minMax.min = new Date(Math.min.apply(Math, array.map(function(o) { return o[minAttribut]; })));
  minMax.max = new Date(Math.max.apply(Math, array.map(function(o) { return o[maxAttribut]; })));
  return minMax;
}

//SUM OF AN ARRAY ATTRIBUT
export const FUNC_ARRAY_SUM_ATTRIBUT = (array, attribut) =>{
  var total = 0;
  for (var i = 0 ; i < array.length ; i++){
    total += array[i][attribut]
  }
  return total
}

//COLOR MANAGEMENT
export const FUNC_COLOR_MNGT = (isTask, colors) =>{
  
  //INIT
  var colorOptions ={
    background: null,
    textColor: null,
    iconColor: null,
    border: null,
    borderRadius: null,
    borderColor : null,
  }

  //TEST SI COLOR
  if(colors){

    //INTEGRATION
    colorOptions.background = colors.background ? colors.background : isTask ? APP_STANDARDS.itemTaskBackground : null ;
    colorOptions.textColorTask = colors.textColorTask ? colors.textColorTask : APP_STANDARDS.itemTaskColorTxt ;
    colorOptions.textColorMilestone = colors.textColorMilestone ? colors.textColorMilestone : APP_STANDARDS.itemMilestoneColorTxt;
    colorOptions.iconColor = colors.iconColor ? colors.iconColor : isTask ? APP_STANDARDS.itemTaskColorIcon : APP_STANDARDS.itemMilestoneColorIcon ;
    colorOptions.borderColor = colors.borderColor ? colors.borderColor : APP_STANDARDS.itemBorderColor;
    colorOptions.border = colors.border === null || colors.border === undefined ? APP_STANDARDS.itemTaskBorder : colors.border  ;
    colorOptions.borderRadius = colors.borderRadius === null || colors.borderRadius === undefined ?   APP_STANDARDS.itemTaskBorderRadius : colors.borderRadius ;

  }else{

    //INTEGRATION
    colorOptions.background = isTask ? APP_STANDARDS.itemTaskBackground : null ;
    colorOptions.textColorTask = APP_STANDARDS.itemTaskColorTxt;
    colorOptions.textColorMilestone = APP_STANDARDS.itemMilestoneColorTxt ;
    colorOptions.iconColor = isTask ? APP_STANDARDS.itemTaskColorIcon : APP_STANDARDS.itemMilestoneColorIcon ;
    colorOptions.borderColor =  isTask ? APP_STANDARDS.itemBorderColor : null;
    colorOptions.border =  isTask ? APP_STANDARDS.itemTaskBorder : null;
    colorOptions.borderRadius =  isTask ? APP_STANDARDS.itemTaskBorderRadius : null;

  }

  //RETURN COLORS
  return colorOptions

}

//UPDATE SELECTED LIST
export const FUNC_UPDATE_LIST = (list, item, isCtrlPressed) =>{
  
  //TESTER SI LENGTH > 0 et CTRL PRESSED
  var selectedItemsList = [];
  if (list && list.length > 0 && isCtrlPressed){

    //TESTER SI ITEM PRESENT DANS ARRAY
    var itemIndex = FUNCT_FIND_INDEX(list,"id",item.id);
    if (itemIndex !== -1){

      //SI LENGTH > 1 ALORS ON splice delete sinon on retourne []
      if (list.length > 1){
        selectedItemsList = list.slice();
        selectedItemsList.splice(itemIndex,1);
      }

    }else{

      //PUSH NEW ITEM
      selectedItemsList = list.slice();
      selectedItemsList.push(item);
    }
  }else{

    if (list && list.length > 0){
      if (list[0].id !== item.id){
        selectedItemsList.push(item)
      }
    }else{
      selectedItemsList.push(item)
    }
  }
  return selectedItemsList;
}

export const FUNC_CREATE_UNIQUE_ID = (nbCar) =>{
  var newId = Math.random();
  newId = newId.toFixed(nbCar);
  newId = parseInt(newId.substring(2),10);
  return newId
}

//PARSE DATE FROM INPUT DATE
export const FUNC_PARSE_DATE_FROM_INPUT = (date) => {
  var b = date.split(/\D/);
  return new Date(b[0], --b[1], b[2]);
}

//GET WEEK NUMBER
export const FUNC_GET_WEEK_NUMBER = (date) =>{
  var newDate = new Date(date.getTime());
  newDate.setHours(0, 0, 0, 0);
  newDate.setDate(newDate.getDate() + 3 - (newDate.getDay() + 6) % 7);
  var week1 = new Date(newDate.getFullYear(), 0, 4);
  return 1 + Math.round(((newDate.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

//GET ROADMAP HEADER 
export const FUNC_GET_ROADMAP_HEADER_HEIGHT = (headerOption, roadmapMonthWidth) => {
  const lineHeight = APP_STANDARDS.roadmapHeaderLineHeight;
  var headerHeight = lineHeight + 2;
  if(headerOption.isRoadmapQuaters && roadmapMonthWidth >= APP_STANDARDS.roadmapMinDisplayQuater){headerHeight = headerHeight + lineHeight + 1};
  if(headerOption.isRoadmapMonths && roadmapMonthWidth >= APP_STANDARDS.roadmapMinDisplayMonth){headerHeight = headerHeight + lineHeight + 1};
  if(headerOption.isRoadmapMonths && headerOption.isRoadmapWeeks  && roadmapMonthWidth >= APP_STANDARDS.roadmapMinDisplayWeek){headerHeight = headerHeight + lineHeight + 1};
  if(headerOption.isRoadmapMonths && headerOption.isRoadmapDays && roadmapMonthWidth >= APP_STANDARDS.roadmapMinDisplayDay){headerHeight = headerHeight + lineHeight + 1};
  return headerHeight;
}

//GET ROADMAP HEADER 
export const FUNC_GET_STEP_ZOOM = (roadmapMonthWidth, isNext) => {

  //ON SET A L'ANNEE
  var setRoadmapWidth;
  var isSet = false;
  if(isNext){

    //TEST SI QUATER DISPLAY
    if(roadmapMonthWidth < APP_STANDARDS.roadmapMinDisplayQuater){
      setRoadmapWidth = APP_STANDARDS.roadmapMinDisplayQuater;
      isSet = true;
    };

    //TEST SI MONTH DISPLAY
    if(!isSet && roadmapMonthWidth < APP_STANDARDS.roadmapMinDisplayMonth){
      setRoadmapWidth = APP_STANDARDS.roadmapMinDisplayMonth;
      isSet = true;
    };

    //TEST SI WEEK DISPLAY
    if(!isSet && roadmapMonthWidth < APP_STANDARDS.roadmapMinDisplayWeek){
      setRoadmapWidth = APP_STANDARDS.roadmapMinDisplayWeek;
      isSet = true;
    };

    //TEST SI DAY DISPLAY
    if(!isSet && roadmapMonthWidth < APP_STANDARDS.roadmapMinDisplayDay){
      setRoadmapWidth = APP_STANDARDS.roadmapMinDisplayDay;
      isSet = true;
    };
 
    //MAX
    if(!isSet){
      setRoadmapWidth = APP_STANDARDS.roadmapMaxMonthWidth;
    }

  }else{

    //TEST SI DAY DISPLAY
    if(roadmapMonthWidth > APP_STANDARDS.roadmapMinDisplayDay){
      setRoadmapWidth = APP_STANDARDS.roadmapMinDisplayDay;
      isSet = true;
    };

    //TEST SI WEEK DISPLAY
    if(!isSet && roadmapMonthWidth > APP_STANDARDS.roadmapMinDisplayWeek){
      setRoadmapWidth = APP_STANDARDS.roadmapMinDisplayWeek;
      isSet = true;
    };

    //TEST SI MONTH DISPLAY
    if(!isSet && roadmapMonthWidth > APP_STANDARDS.roadmapMinDisplayMonth){
      setRoadmapWidth = APP_STANDARDS.roadmapMinDisplayMonth;
      isSet = true;
    };

    //TEST SI QUATER DISPLAY
    if(!isSet && roadmapMonthWidth > APP_STANDARDS.roadmapMinDisplayQuater){
      setRoadmapWidth = APP_STANDARDS.roadmapMinDisplayQuater;
      isSet = true;
    };

    //MAX
    if(!isSet){
      setRoadmapWidth = APP_STANDARDS.roadmapMinMonthWidth;
    }

  }
  return setRoadmapWidth;
}

//GET MONTH NAME RELATED TO WIDTH
export const FUNC_GET_MONTH_NAME = (monthWidth, month) => {
  
  //GET MONT NAMES RELATED TO MONTHWIDTH
  var monthName; 
  if(monthWidth < 45){
    monthName = APP_MONTH_NAMES.small[month];
  }else{
      if(monthWidth < 100){
          monthName = APP_MONTH_NAMES.medium[month];
      }else{
          monthName = APP_MONTH_NAMES.big[month];
      }
  }
  return monthName

}

//FIND NUMBER OF DAYS OF MONTH
export const FUNC_NB_OF_DAYS = (date) =>{
  return new Date(date.getFullYear(),date.getMonth() + 1,0).getDate();
}

//FIND ROADMAP LEFT POSITION FROM DATE
export const FUNC_LEFT_POSITION = (date, nbOfDays, roadmapFirstYear, roadmapMonthWidth) => {
  const roadmapFirst = new Date(roadmapFirstYear,0,1);
  const monthDiffWidth = FUNC_MONTH_DIFF(roadmapFirst,date)*roadmapMonthWidth;
  const daysWidth = (date.getDate() / nbOfDays)*roadmapMonthWidth;
  return monthDiffWidth + daysWidth
}

//GET TEXT WIDTH
export const FUNC_TEXT_WIDTH = (canevasName, txt, fontSize) => {
  var canevas = document.getElementById(canevasName);
  var ctx = canevas.getContext('2d');
  ctx.font = "500 " + fontSize + "px Segoe UI";
  return ctx.measureText(txt).width;
}

//FIND NUMBER OF MONTH BETEEN 2 DATES
export const  FUNC_MONTH_DIFF = (d1, d2) =>{
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

//Transfort number to "XXXX" text format
//ex : FUNC_ZERO_FORMAT_TO_NUM(3,3) = "003"
export const FUNC_ZERO_FORMAT_TO_NUM = (num, size) => {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num ;
}

//CONVETIR LA CHAINE DD/MM/YYYY en objet date
export const FUNC_TXT_TO_DATE = (dateTxt) =>{
  const dateConvertion = new Date(parseInt(dateTxt.substr(6,4),0),parseInt(dateTxt.substr(3,2),0)-1,parseInt(dateTxt.substr(0,2),0));
  return dateConvertion;
}

//CONVETIR LA CHAINE D/M/YY en objet date
export const FUNC_TXT_TO_DATE_2 = (dateTxt) =>{
  const txtSplit = dateTxt.split("/");
  const dateConvertion = new Date(parseInt("20" + txtSplit[2],10),parseInt(txtSplit[0],10)-1,parseInt(txtSplit[1],10));
  return dateConvertion;
}

//findIndex of an item in an array object, specify search column and what are you looking for
export const FUNCT_FIND_INDEX = (data, searchColumn, searchName) => {
  return data.findIndex(item => searchName === item[searchColumn])
}  

//findIndex of an item in an array object, specify search column and what are you looking for
export const FUNCT_FIND_INDEX_ARRAY = (data, searchItem) => {
  return data.findIndex(item => item === searchItem)
}  


//Conversion number to MILIONS 
export const numberFormatMillions = number => {
  const options = { style: "decimal", currency: "EUR", currencyDisplay: "symbol", minimumFractionDigits:0, maximumFractionDigits:2};
  const numberFormat = new Intl.NumberFormat("fr-EU", options);
  return numberFormat.format(number/1000);
};

//FORMAT number millier
export const numberFormatMilliers = number => {
  const numberFormat = new Intl.NumberFormat('fr-FR', {   minimumFractionDigits: 0, maximumFractionDigits:0 }).format(number);
  return numberFormat;
}

//SWITCH FORMAT NUMBER
export const numberFormatSwitch = (number, numberFormat) => {

  //INTIT
  var newNumber = number;

  //WHICH CONVERSION
  switch (numberFormat) {

      //MILIONS EUROS
      case 'M€':
        newNumber = numberFormatMillions(newNumber) + " M€"
        break;

      //MILIER EUROS
      case 'k€':
        newNumber = numberFormatMilliers(newNumber) + " k€"
        break;

      default:
        break;
    }

  //RETURN
  return newNumber;
}

//FIND DATE FROM LEFT POSITION
export const FUNC_FIND_DATE_FROM_LEFT = (left, roadmapFirstYear,  roadmapMonthWidth) =>{

  //CALCUL
  var ratioMonth = left / roadmapMonthWidth
  var nbMonth = Math.ceil(ratioMonth) 
  var ratioDay =ratioMonth % 1
  var monthDate = new Date(roadmapFirstYear,nbMonth-1,1)
  var currentNbOfDays = FUNC_NB_OF_DAYS(monthDate);
  var nbDay = Math.ceil(ratioDay*currentNbOfDays);
  if(nbDay <= 0 || nbDay === -0){nbDay = 1}
  if(nbMonth < 0 || nbMonth === -0){nbMonth=1}
  var newDate = new Date(roadmapFirstYear,nbMonth-1,nbDay)

  //OK NEW DATE
  return newDate;
 
}


//TOOLTIP
export const AppTooltip = ({tooltipId,tooltipPlacement,tooltipContent,theme}) => { 
  
  //SELECT THEME
  if(theme === "dark"){
    return(
      <ReactTooltip id={tooltipId} place={tooltipPlacement} type="dark" effect="solid" className="py-1 px-2 tooltipCommon">
        <span className="tooltipText">{tooltipContent}</span>
      </ReactTooltip>
    );
  }else{
    return(
      <ReactTooltip id={tooltipId} place={tooltipPlacement} type="dark" effect="solid" className="py-1 px-2 tooltipLight" 
        arrowColor='white' borderColor='#333333' backgroundColor='#FFFFFF'>
        <span className="tooltipText">{tooltipContent}</span>
      </ReactTooltip>
  );
  }

};

