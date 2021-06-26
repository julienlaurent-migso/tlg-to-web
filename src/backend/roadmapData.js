import {
    FUNC_TEXT_WIDTH,
    FUNCT_FIND_INDEX,
    FUNC_NB_OF_DAYS,
    FUNC_LEFT_POSITION,
    FUNC_FIND_DATE_FROM_LEFT,
    FUNC_CREATE_UNIQUE_ID,
    FUNC_TXT_TO_DATE_2
} from '../core/standards'
import {
    APP_ITEM_TYPES,
    APP_TXT_START_TLG_ID,
} from '../core/constants'

/////////////////////////////////////////////////////////////////////////////
/// ADD TOP POSITION ////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

const ROADMAP_TOP_POSITION = (data, userSettings) =>{

    //INIT
    var transformedData = data;

     //TRI PAR STATUS + COVERAGE
     transformedData.sort(function(a, b){
        if(a.groupKey < b.groupKey) { return -1; }
        if(a.groupKey > b.groupKey) { return 1; }
        if(a.sort < b.sort) { return -1; }
        if(a.sort > b.sort) { return 1; }
        if(a.start < b.start) { return -1; }
        if(a.start > b.start) { return 1; }
        return 0;
    })

    //LOOP
    var topPosition = 0;
    var currentGroup = "";
    var currentLevel = "";
    var virtualLineTab;
    var testIfFound;
    var leftPositionToTest;
    var prevTopPosition;
    var cumuTopGroup = 0;
    for(var j = 0 ; j < transformedData.length ; j++){

        //RESET ACTIONS
        prevTopPosition = transformedData[j].top;

        //RESET COPY / SELECT
        if(transformedData[j].action){
            transformedData[j].action = null;
            transformedData[j].updateTracker = transformedData[j].updateTracker + 1
        }

        //SI DISPLAY FALSE ON BREAK
        if(transformedData[j].display){

            //Si NOUVEAU GROUP ALORS ON RESET A INIT
            testIfFound = false;
            if(transformedData[j].group !== currentGroup){

                //CUMU TOP
                if(j !== 0 && virtualLineTab){
                    cumuTopGroup = cumuTopGroup + virtualLineTab[0].top + userSettings.roadmapItemSpaceLine + userSettings.roadmapItemHeight;
                }

                //TOP AND RESET
                topPosition = userSettings.roadmapItemSpaceLine;
                currentGroup = transformedData[j].group;
                currentLevel = "";
                virtualLineTab = [];
                testIfFound = true;

            }

            //Si NOUVEAU LEVEL GROUP
            if(transformedData[j].group + transformedData[j].level !== transformedData[j].group + currentLevel){

                //SEULEMLENT SI PAS NOUVEAU GROUPE
                if(!testIfFound){topPosition = topPosition + userSettings.roadmapItemSpaceLine +  userSettings.roadmapItemHeight;}

                //INIT
                currentLevel = transformedData[j].level;
                virtualLineTab = [];
            }

            /////////////////////////////////////////////////////////////////////
            /// FIND ON QUELLE LINE ON PEUT METTRE L'ITEM / Left SAVE / RIGHT ///
            /////////////////////////////////////////////////////////////////////
            
            //SI VIRTUAL TAB VIDE
            if(virtualLineTab.length === 0){

                //OK POUR 
                transformedData[j].top = topPosition;
                transformedData[j].cumuTop = topPosition + cumuTopGroup;

                //GET UPDATE TRACKER
                if (prevTopPosition !== transformedData[j].top){
                    transformedData[j].updateTracker = transformedData[j].updateTracker + 1;
                }

                //UPDATE VIRTUAL
                virtualLineTab.push({
                    right: transformedData[j].right,
                    top: topPosition, 
                    id:transformedData[j].id
                });

            //ALORS ON PARCOUR LE TAB POUR TROUVER UNE PLACE
            }else{

                //LOOP ON VIRTUAL TAB
                testIfFound = false;
                for(var k = 0 ; k < virtualLineTab.length ; k++){

                    //PRENDR EEN COMPTE LA DEMIE LARGEUR D'UN ITEM
                    if(transformedData[j].type === APP_ITEM_TYPES.task || transformedData[j].type === APP_ITEM_TYPES.consoTask){
                        leftPositionToTest = transformedData[j].left;
                    }else{
                        leftPositionToTest = transformedData[j].left + userSettings.roadmapItemHeight/2;
                    }
                    
                    //Si LEFT > RIGHT SUR LIGNE ALORS ON INTEGRE ET ON REMPLACE
                    if(virtualLineTab[k].right <= leftPositionToTest){
                        
                        //OK FOUND
                        transformedData[j].top = virtualLineTab[k].top;
                        transformedData[j].cumuTop =  virtualLineTab[k].top + cumuTopGroup;
                        virtualLineTab[k].right = transformedData[j].right;
                        virtualLineTab[k].id=transformedData[j].id;
                        testIfFound = true;

                        //GET UPDATE TRACKER
                        if (prevTopPosition !== transformedData[j].top){
                            transformedData[j].updateTracker = transformedData[j].updateTracker + 1;
                        }
                        break;
                    }
                }

                //IF NOT FOUND => NEW LINE 
                if (!testIfFound){

                    //TOP POSITION
                    topPosition = topPosition + userSettings.roadmapItemSpaceLine + userSettings.roadmapItemHeight
                    transformedData[j].top = topPosition;
                    transformedData[j].cumuTop = topPosition + cumuTopGroup;

                    //GET UPDATE TRACKER
                    if (prevTopPosition !== transformedData[j].top){
                        transformedData[j].updateTracker = transformedData[j].updateTracker + 1;
                    }

                    //PUSH VIRTUAL
                    virtualLineTab.push({
                        right: transformedData[j].right,
                        top: topPosition, 
                        id:transformedData[j].id
                    });
                }
            }
        }
    }

    //RETURN TRANSFORMED DATA
    return transformedData
}

////////////////////////////////
/// GRID DATA > ROADMAP DATA ///
////////////////////////////////
export const ROADMAP_DATA_CREATION = (inputData, roadmapFirstYear, roadmapMonthWidth, userSettings) =>{

    //Init
    var data = inputData;
    var transformedData = [];

    ///////////////////////////////
    /// FIRST LOOP TO INIT DATA ///
    ///////////////////////////////
    var currentLine ;
    var keySort = 0;
    var groupKey = 0;
    for(var i=0 ; i < data.length ; i++){

        //INIT
        currentLine = {};
        currentLine = data[i];

        /////////////////////////
        /// GESTION DES DATES ///
        /////////////////////////

        //SEULEMENT SI PAS DEJA DATE
        if (Object.prototype.toString.call(currentLine.start) !== "[object Date]"){
            currentLine.start = FUNC_TXT_TO_DATE_2(currentLine.start);
            currentLine.finish = FUNC_TXT_TO_DATE_2(currentLine.finish);
            currentLine.baselineStart = FUNC_TXT_TO_DATE_2(currentLine.baselineStart);
            currentLine.baselineFinish = FUNC_TXT_TO_DATE_2(currentLine.baselineFinish);
        }
        
        ///////////////////
        /// OPTION MNGT ///
        ///////////////////

        currentLine.optionLabel = false;
        currentLine.optionShadow = false;

        //////////////////////////////////////////////
        /// MODIFICATION TRACKER FOR PURECOMPONENT ///
        //////////////////////////////////////////////

        currentLine.updateTracker = 0

        /////////////////
        /// GROUP KEY ///
        /////////////////

        //GROUP KEY
        if(i !== 0 && (data[i].group !== data[i-1].group)){groupKey = groupKey +1}
        currentLine.groupKey = groupKey;

        //KEY SORT 
        if(i !== 0 && (data[i].group !== data[i-1].group || data[i].level !== data[i-1].level)){keySort = keySort +1;}
        currentLine.sort = keySort;

        //ON AFFICHE TOUTES LES LIGNES
        currentLine.display = true
        
        /////////////////////
        /// LEFT POSITION ///
        /////////////////////

        //GET NUMBER OF DAYS
        currentLine.daysFinishMonth = FUNC_NB_OF_DAYS(currentLine.finish)
        currentLine.daysbaselineFinishMonth = FUNC_NB_OF_DAYS(currentLine.baselineFinish)

        //LEFT FINISH POSITION FINISH
        currentLine.leftFinish = FUNC_LEFT_POSITION(currentLine.finish, currentLine.daysFinishMonth, roadmapFirstYear, roadmapMonthWidth)
        if(currentLine.baselineFinish.getTime() !== currentLine.finish.getTime()){
            currentLine.leftBaselineFinish = FUNC_LEFT_POSITION(currentLine.baselineFinish, currentLine.daysbaselineFinishMonth, roadmapFirstYear, roadmapMonthWidth)
        }
        
        //ADD START INFORMATION FOR TASK
        if (currentLine.type === APP_ITEM_TYPES.task || currentLine.type === APP_ITEM_TYPES.consoTask){

            //GET NUMBER OF DAYS
            currentLine.daysStartMonth = FUNC_NB_OF_DAYS(currentLine.start)
            currentLine.daysbaselineStartMonth = FUNC_NB_OF_DAYS(currentLine.baselineStart)

            //LEFT START POSITION
            currentLine.leftStart = FUNC_LEFT_POSITION(currentLine.start, currentLine.daysStartMonth, roadmapFirstYear, roadmapMonthWidth)
            if(currentLine.baselineStart.getTime() !== currentLine.start.getTime() ){
                currentLine.leftBaselineStart = FUNC_LEFT_POSITION(currentLine.baselineStart, currentLine.daysbaselineStartMonth, roadmapFirstYear, roadmapMonthWidth)
            }

            ///////////////////////////
            /// LEFT & WIDTH GLOBAL ///
            ///////////////////////////

            //LEFT RELATED TO Start & BaselineStart
            currentLine.left = currentLine.leftStart

            //WIDTH
            currentLine.right = currentLine.leftFinish
            currentLine.width = currentLine.right - currentLine.left

        }else{

            ////////////////////////////////////////////////
            /// LEFT & WIDTH GLOBAL + CHECK OPTION LABEL ///
            ////////////////////////////////////////////////

            //GET MILESTONES TEXT WIDTH
            currentLine.txtWidth = FUNC_TEXT_WIDTH("canevasMilestone", currentLine.name, userSettings.roadmapItemFontSize);

            //LEFT LOGO + TXT
            currentLine.left = currentLine.leftFinish - (userSettings.roadmapItemHeight / 2)

            //WIDTH
            currentLine.width = userSettings.roadmapItemHeight + currentLine.txtWidth

            //RIGHT
            currentLine.right = currentLine.left + currentLine.width
        }

        //PUSH
        transformedData.push(currentLine);
    }

    

    //RETURN TRANSFORMED DATA
    return ROADMAP_TOP_POSITION(transformedData, userSettings)
}

////////////////////////////
/// ROADMAP DATA OPTIONS ///
////////////////////////////
export const ROADMAP_DATA_OPTIONS = () =>{

    // //ADD START INFORMATION FOR TASK
    // if (currentLine.type === APP_ITEM_TYPES.task || currentLine.type === APP_ITEM_TYPES.consoTask){

    //     //GET NUMBER OF DAYS
    //     currentLine.daysStartMonth = FUNC_NB_OF_DAYS(currentLine.start)
    //     currentLine.daysbaselineStartMonth = FUNC_NB_OF_DAYS(currentLine.baselineStart)

    //     //LEFT START POSITION
    //     currentLine.leftStart = FUNC_LEFT_POSITION(currentLine.start, currentLine.daysStartMonth, appSet.roadmapFirstYear, appSettings.roadmapMonthWidth)
    //     if(currentLine.baselineStart.getTime() !== currentLine.start.getTime() ){
    //         currentLine.leftBaselineStart = FUNC_LEFT_POSITION(currentLine.baselineStart, currentLine.daysbaselineStartMonth, appSet.roadmapFirstYear, appSettings.roadmapMonthWidth)
    //     }

    //     ///////////////////////////
    //     /// LEFT & WIDTH GLOBAL ///
    //     ///////////////////////////

    //     //LEFT RELATED TO Start & BaselineStart
    //     currentLine.left = currentLine.leftStart
    //     if(currentLine.optionShadow && currentLine.leftBaselineStart && currentLine.leftBaselineStart < currentLine.leftStart){
    //         currentLine.left = currentLine.leftBaselineStart
    //     }

    //     //WIDTH
    //     currentLine.right = currentLine.leftFinish
    //     currentLine.width = currentLine.right - currentLine.left
    //     if(currentLine.optionShadow && currentLine.leftBaselineFinish && currentLine.leftBaselineFinish > currentLine.leftFinish){
    //         currentLine.right = currentLine.leftBaselineFinish
    //         currentLine.width = currentLine.right - currentLine.left
    //     }

    // }else{

    //     ////////////////////////////////////////////////
    //     /// LEFT & WIDTH GLOBAL + CHECK OPTION LABEL ///
    //     ////////////////////////////////////////////////

    //     //GET MILESTONES TEXT WIDTH
    //     currentLine.txtWidth = FUNC_TEXT_WIDTH("canevasMilestone", currentLine.name, appSet.roadmapItemFontSize);

    //     //LEFT LOGO + TXT
    //     currentLine.left = currentLine.leftFinish - (appSet.roadmapItemHeight / 2)
    //     if(currentLine.optionShadow && currentLine.leftBaselineFinish && currentLine.leftBaselineFinish > currentLine.leftFinish){
    //         currentLine.left = currentLine.leftBaselineFinish - (appSet.roadmapItemHeight / 2)
    //     }

    //     //WIDTH
    //     currentLine.width = appSet.roadmapItemHeight + currentLine.txtWidth

    //     //TEST IF OPTION LABEL TRUE
    //     if(currentLine.optionLabel){
    //         currentLine.left = currentLine.left - currentLine.txtWidth
    //     }

    //     //RIGHT
    //     currentLine.right = currentLine.left + currentLine.width
    // }

}



/////////////////////////
/// ROADMAP ZOOM DATA ///
/////////////////////////
export const ROADMAP_DATA_ZOOM = (data, roadmapFirstYear, newWidth, userSettings) =>{

    //Init
    var transformedData = [];
    var currentData = data;

    ///////////////////////////////
    /// FIRST LOOP TO INIT DATA ///
    ///////////////////////////////
    for(var i=0 ; i < currentData.length ; i++){

        /////////////////////
        /// LEFT POSITION ///
        /////////////////////

        //RECALCUL DES LEFT POSITION
        currentData[i].leftFinish = FUNC_LEFT_POSITION(currentData[i].finish, currentData[i].daysFinishMonth, roadmapFirstYear, newWidth);
        if(currentData[i].baselineFinish){currentData[i].leftBaselineFinish = FUNC_LEFT_POSITION(currentData[i].baselineFinish, currentData[i].daysbaselineFinishMonth, roadmapFirstYear, newWidth)};
        if(currentData[i].leftStart){currentData[i].leftStart = FUNC_LEFT_POSITION(currentData[i].start, currentData[i].daysStartMonth, roadmapFirstYear, newWidth)};
        if(currentData[i].baselineStart){currentData[i].leftBaselineStart = FUNC_LEFT_POSITION(currentData[i].baselineStart, currentData[i].daysbaselineStartMonth, roadmapFirstYear, newWidth)};

        //LEFT & WIDTH GLOBAL
        if (currentData[i].type === APP_ITEM_TYPES.task || currentData[i].type === APP_ITEM_TYPES.consoTask){

            //LEFT RELATED TO Start & BaselineStart
            currentData[i].left = currentData[i].leftStart
            if(currentData[i].optionShadow && currentData[i].leftBaselineStart && currentData[i].leftBaselineStart < currentData[i].leftStart){
                currentData[i].left = currentData[i].leftBaselineStart
            }

            //WIDTH
            currentData[i].right = currentData[i].leftFinish
            currentData[i].width = currentData[i].right - currentData[i].left
            if(currentData[i].optionShadow && currentData[i].leftBaselineFinish && currentData[i].leftBaselineFinish > currentData[i].leftFinish){
                currentData[i].right = currentData[i].leftBaselineFinish
                currentData[i].width = currentData[i].right - currentData[i].left
            }

        }else{

            //LEFT LOGO + TXT
            currentData[i].left = currentData[i].leftFinish - (userSettings.roadmapItemHeight / 2)
            if(currentData[i].optionShadow && currentData[i].leftBaselineFinish && currentData[i].leftBaselineFinish > currentData[i].leftFinish){
                currentData[i].left = currentData[i].leftBaselineFinish - (userSettings.roadmapItemHeight / 2)
            }

            //WIDTH
            currentData[i].width = userSettings.roadmapItemHeight + currentData[i].txtWidth

            //TEST IF OPTION LABEL TRUE
            if(currentData[i].optionLabel){
                currentData[i].left = currentData[i].left - currentData[i].txtWidth
            }

            //RIGHT
            currentData[i].right = currentData[i].left + currentData[i].width
        }

        //PUSH
        transformedData.push(currentData[i]);
    }

    //RETURN TRANSFORMED DATA
    return ROADMAP_TOP_POSITION(transformedData, userSettings)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// ROADMAP TASK RESIZE //////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const ROADMAP_DATA_RESIZE = (data, roadmapFirstYear, roadmapMonthWidth, itemId, diffX, userSettings) =>{

    //INIT
    var transformedData = data;

    //TROUVER INDEX 
    const itemIndex = FUNCT_FIND_INDEX(transformedData, "id", itemId)

    //SI BIEN TROUVE ON CONTINUE SINON 
    if(itemIndex !== -1){

        //UPDATE LEFTFINISH
        transformedData[itemIndex].leftFinish = transformedData[itemIndex].leftFinish + diffX

        //FUNCTION POUR TROUVER DATE LEFT FINISH
        transformedData[itemIndex].finish = FUNC_FIND_DATE_FROM_LEFT(transformedData[itemIndex].leftFinish, roadmapFirstYear, roadmapMonthWidth);
        transformedData[itemIndex].daysFinishMonth = FUNC_NB_OF_DAYS(transformedData[itemIndex].finish)

        //UPDATE RIGHT & WIDTH
        transformedData[itemIndex].right = transformedData[itemIndex].leftFinish
        transformedData[itemIndex].width = transformedData[itemIndex].right - transformedData[itemIndex].left
        if(transformedData[itemIndex].optionShadow && transformedData[itemIndex].leftBaselineFinish && transformedData[itemIndex].leftBaselineFinish > transformedData[itemIndex].leftFinish){
            transformedData[itemIndex].right = transformedData[itemIndex].leftBaselineFinish
            transformedData[itemIndex].width = transformedData[itemIndex].right - transformedData[itemIndex].left
        }

        //RETURN TRANSFORMED DATA
        return ROADMAP_TOP_POSITION(transformedData, userSettings)
    
    }else{

        //ID NON TROUVE ON RETOURNE SANS MODIFIER
        return transformedData
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// ROADMAP TASK RESIZE //////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const ROADMAP_DATA_ITEM_TXT = (data, itemId, isTask, newTxt, userSettings) =>{

    //INIT
    var transformedData = data;

    //TROUVER INDEX 
    const itemIndex = FUNCT_FIND_INDEX(transformedData, "id", itemId)

    //SI BIEN TROUVE ON CONTINUE SINON 
    if(itemIndex !== -1){

        //TXT MODIFICATION
        transformedData[itemIndex].name = newTxt;
        transformedData[itemIndex].updateTracker = transformedData[itemIndex].updateTracker + 1;

        //CALCUL POSITION SEULEMENT SI MILESTONE
        if(isTask){

            //PAS DE CALCUL DE POSITION
            return transformedData

        }else{

            //GET MILESTONES TEXT WIDTH
            transformedData[itemIndex].txtWidth = FUNC_TEXT_WIDTH("canevasMilestone", newTxt, userSettings.roadmapItemFontSize);

            //LEFT LOGO + TXT / WIDTH / RIGHT
            transformedData[itemIndex].left = transformedData[itemIndex].leftFinish - (userSettings.roadmapItemHeight / 2)
            transformedData[itemIndex].width = userSettings.roadmapItemHeight + transformedData[itemIndex].txtWidth
            transformedData[itemIndex].right = transformedData[itemIndex].left + transformedData[itemIndex].width

            //RETURN TRANSFORMED DATA
            return ROADMAP_TOP_POSITION(transformedData, userSettings)
        }
    
    }else{

        //ID NON TROUVE ON RETOURNE SANS MODIFIER
        return transformedData
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// ROADMAP ITEM DRAG & DROP /////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const ROADMAP_DATA_DRAG_DROP = (
    data, 
    roadmapFirstYear,
    roadmapMonthWidth, 
    itemId, 
    diffX, 
    itemTopPosition,
    userSettings,
    addYear,
    nbYearToSub
) =>{

    //INIT
    var transformedData = data;

    //TROUVER INDEX 
    const itemIndex = FUNCT_FIND_INDEX(transformedData, "id", itemId)

    //SI BIEN TROUVE ON CONTINUE SINON 
    if(itemIndex !== -1){

        /////////////////////////////////////////////
        /// GESTION DES POSITION LEFT RIGHT WIDTH ///
        /////////////////////////////////////////////


        //RECALCUL DES LEFT POSITION
        transformedData[itemIndex].leftFinish = transformedData[itemIndex].leftFinish + diffX
        if(transformedData[itemIndex].leftStart){transformedData[itemIndex].leftStart = transformedData[itemIndex].leftStart + diffX};

        //RECTIF IF ADD YEAR
        if(addYear){

            //TEST SI TASK 
            if(transformedData[itemIndex].type === APP_ITEM_TYPES.task || transformedData[itemIndex].type === APP_ITEM_TYPES.consoTask){
                transformedData[itemIndex].leftStart = nbYearToSub*(roadmapMonthWidth*12) + transformedData[itemIndex].leftStart
                transformedData[itemIndex].leftFinish = transformedData[itemIndex].leftStart + transformedData[itemIndex].width
            }else{
                transformedData[itemIndex].leftFinish = nbYearToSub*(roadmapMonthWidth*12) + transformedData[itemIndex].leftFinish 
            }
        }
        
        //TEST SI TASK 
        if(transformedData[itemIndex].type === APP_ITEM_TYPES.task || transformedData[itemIndex].type === APP_ITEM_TYPES.consoTask){

            //UPDATE DATE START ET FINISH + NB DAYS
            transformedData[itemIndex].start = FUNC_FIND_DATE_FROM_LEFT(transformedData[itemIndex].leftStart, roadmapFirstYear, roadmapMonthWidth);
            transformedData[itemIndex].finish = FUNC_FIND_DATE_FROM_LEFT(transformedData[itemIndex].leftFinish, roadmapFirstYear, roadmapMonthWidth);
            transformedData[itemIndex].daysStartMonth = FUNC_NB_OF_DAYS(transformedData[itemIndex].start)
            transformedData[itemIndex].daysFinishMonth = FUNC_NB_OF_DAYS(transformedData[itemIndex].finish)

            //UPDATE LEFT
            transformedData[itemIndex].left = transformedData[itemIndex].leftStart
            if(transformedData[itemIndex].optionShadow && transformedData[itemIndex].leftBaselineStart && transformedData[itemIndex].leftBaselineStart < transformedData[itemIndex].leftStart){
                transformedData[itemIndex].left = transformedData[itemIndex].leftBaselineStart
            }
            
            //UPDATE RIGHT & WIDTH
            transformedData[itemIndex].right = transformedData[itemIndex].leftFinish
            transformedData[itemIndex].width = transformedData[itemIndex].right - transformedData[itemIndex].left
            if(transformedData[itemIndex].optionShadow && transformedData[itemIndex].leftBaselineFinish && transformedData[itemIndex].leftBaselineFinish > transformedData[itemIndex].leftFinish){
                transformedData[itemIndex].right = transformedData[itemIndex].leftBaselineFinish
                transformedData[itemIndex].width = transformedData[itemIndex].right - transformedData[itemIndex].left
            }

        }else{

            //UPDATE FINISH
            transformedData[itemIndex].finish = FUNC_FIND_DATE_FROM_LEFT(transformedData[itemIndex].leftFinish, roadmapFirstYear, roadmapMonthWidth);
            transformedData[itemIndex].start =transformedData[itemIndex].finish 
            transformedData[itemIndex].daysFinishMonth = FUNC_NB_OF_DAYS(transformedData[itemIndex].finish)
            transformedData[itemIndex].daysStartMonth = transformedData[itemIndex].daysFinishMonth
            
            //LEFT LOGO + TXT
            transformedData[itemIndex].left = transformedData[itemIndex].leftFinish - (userSettings.roadmapItemHeight / 2)
            if(transformedData[itemIndex].optionShadow && transformedData[itemIndex].leftBaselineFinish && transformedData[itemIndex].leftBaselineFinish > transformedData[itemIndex].leftFinish){
                transformedData[itemIndex].left = transformedData[itemIndex].leftBaselineFinish - (userSettings.roadmapItemHeight / 2)
            }

            //WIDTH
            transformedData[itemIndex].width = userSettings.roadmapItemHeight + transformedData[itemIndex].txtWidth

            //TEST IF OPTION LABEL TRUE
            if(transformedData[itemIndex].optionLabel){
                transformedData[itemIndex].left = transformedData[itemIndex].left - transformedData[itemIndex].txtWidth
            }

            //RIGHT
            transformedData[itemIndex].right = transformedData[itemIndex].left + transformedData[itemIndex].width

        }
        
        //////////////////////////////
        /// GROUP LEVEL MANAGEMENT ///
        //////////////////////////////

        //TROUVER GROUP ITEMS LIST
        //var itemsGroup = transformedData.filter(item => item.groupKey === groupKey);
        var indexMatchTop = transformedData.findIndex(item => itemTopPosition < item.cumuTop - userSettings.roadmapItemSpaceLine/2) - 1;

        //RECTIF SI EN DESSOUS
        if(indexMatchTop === -2){indexMatchTop = transformedData.length -1}
        if(indexMatchTop === -1){indexMatchTop = 0}

        //UPDATE LEVEL & SORT
        transformedData[itemIndex].groupKey = transformedData[indexMatchTop].groupKey
        transformedData[itemIndex].group = transformedData[indexMatchTop].group;
        transformedData[itemIndex].level = transformedData[indexMatchTop].level
        transformedData[itemIndex].sort = transformedData[indexMatchTop].sort

        ////////////////////////////////////////////////////
        /// IF ADD YEAR - ADD LETF RELATED TO ADDED YEAR ///
        ////////////////////////////////////////////////////

        let minDate = new Date(Math.min.apply(Math, transformedData.map(function(o) { return o.start; })));
        let nbYearDiff = roadmapFirstYear - minDate.getFullYear()

        //REPOSITIONNEMENT DES ITEMS
        if(addYear || nbYearDiff < 0){

            transformedData = transformedData.map(item => {

                //MOVE ALL
                item.updateTracker = item.updateTracker + 1;

                //ONLY IF NOT MOVED ID
                if(item.id !== itemId || nbYearDiff < 0){

                    //RECALCUL DES LEFT POSITION
                    if(addYear){
                        item.leftFinish = item.leftFinish + nbYearToSub*(roadmapMonthWidth*12)
                        if(item.leftStart){item.leftStart = item.leftStart + nbYearToSub*(roadmapMonthWidth*12)};
                    }else{
                        item.leftFinish = item.leftFinish + nbYearDiff*(roadmapMonthWidth*12)
                        if(item.leftStart){item.leftStart = item.leftStart + nbYearDiff*(roadmapMonthWidth*12)};
                    }
                    
                    //TEST SI TASK 
                    if(item.type === APP_ITEM_TYPES.task || item.type === APP_ITEM_TYPES.consoTask){


                        //UPDATE LEFT
                        item.left = item.leftStart
                        if(item.optionShadow && item.leftBaselineStart && item.leftBaselineStart < item.leftStart){
                            item.left = item.leftBaselineStart
                        }
                        
                        //UPDATE RIGHT & WIDTH
                        item.right = item.leftFinish
                        item.width = item.right - item.left
                        if(item.optionShadow && item.leftBaselineFinish && item.leftBaselineFinish > item.leftFinish){
                            item.right = item.leftBaselineFinish
                            item.width = item.right - item.left
                        }

                    }else{

                        
                        //LEFT LOGO + TXT
                        item.left = item.leftFinish - (userSettings.roadmapItemHeight / 2)
                        if(item.optionShadow && item.leftBaselineFinish && item.leftBaselineFinish > item.leftFinish){
                            item.left = item.leftBaselineFinish - (userSettings.roadmapItemHeight / 2)
                        }

                        //WIDTH
                        item.width = userSettings.roadmapItemHeight + item.txtWidth

                        //TEST IF OPTION LABEL TRUE
                        if(item.optionLabel){
                            item.left = item.left - item.txtWidth
                        }

                        //RIGHT
                        item.right = item.left + item.width
                    }

                }
                return item
            })

        }


        //RETURN TRANSFORMED DATA
        return ROADMAP_TOP_POSITION(transformedData, userSettings)

    }else{

        //ID NON TROUVE ON RETOURNE SANS MODIFIER
        return transformedData
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// ROADMAP ADD ITEM ///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const ROADMAP_DATA_ADD_ITEM = (data, roadmapFirstYear,roadmapMonthWidth, item, options, specific, userSettings) =>{

    //INIT
    var transformedData = data;
    var transformedItem = JSON.parse(JSON.stringify(item));

    /////////////////////////
    /// TROUVER LE DIFF X ///
    /////////////////////////

    //ADD NORMAL
    var diffX = options.mouseX

    //ADD WITH COPY
    if(!specific){

        //TRI PAR DATE DE DEB
        transformedItem.sort(function(a, b){
            if(a.start < b.start) { return -1; }
            if(a.start > b.start) { return 1; }
            return 0;
        })
        
        //CALCUL
        diffX = options.mouseX - transformedItem[0].left
    }

    //////////////////////////////
    /// GROUP LEVEL MANAGEMENT ///
    //////////////////////////////

    //TROUVER GROUP ITEMS LIST
    var itemsGroup = transformedData.filter(item => item.groupKey === options.groupKey);
    var indexMatchTop = itemsGroup.findIndex(item => options.mouseY < item.top - userSettings.roadmapItemSpaceLine/2) - 1;

    //RECTIF SI EN DESSOUS
    if(indexMatchTop === -2){indexMatchTop = itemsGroup.length -1}
    if(indexMatchTop === -1){indexMatchTop = 0}

    //INDEX
    var indextransformedData = transformedData.findIndex(item => item.id === itemsGroup[indexMatchTop].id);

    //SPECIFIC LEVEL 
    var newLevel;
    if(specific && specific.level){
        newLevel = Number(Math.max.apply(Math, itemsGroup.map(function(o) { return o.level; }))) + 1;
    }else{
        newLevel = itemsGroup[indexMatchTop].level;
    }

    /////////////////
    /// ITEM LOOP ///
    /////////////////
    var newId;
    var indexId;
    for(var i = 0 ; i < transformedItem.length ; i++){

        //UPDATE LEVEL & SORT
        transformedItem[i].groupKey = options.groupKey;
        transformedItem[i].group = itemsGroup[indexMatchTop].group;
        transformedItem[i].sort = itemsGroup[indexMatchTop].sort;
        transformedItem[i].level = newLevel;

        //UPDAT TRACKER
        transformedItem[i].updateTracker = 0;
        
        ////////////////////////
        /// CALCUL UNIQUE ID ///
        ////////////////////////
        newId = APP_TXT_START_TLG_ID + FUNC_CREATE_UNIQUE_ID(6)
        indexId = FUNCT_FIND_INDEX(transformedData, "id", newId)
        while (indexId !== -1) {
            newId = APP_TXT_START_TLG_ID + FUNC_CREATE_UNIQUE_ID(6)
            indexId = FUNCT_FIND_INDEX(transformedData, "id", newId)
        }
        transformedItem[i].id = newId;

        /////////////////////////////////////////////
        /// GESTION DES POSITION LEFT RIGHT WIDTH ///
        /////////////////////////////////////////////

        //TEST SI TASK 
        if(transformedItem[i].type === APP_ITEM_TYPES.task || transformedItem[i].type === APP_ITEM_TYPES.consoTask){

            //IF ADD OR COPY
            if(specific){
                transformedItem[i].leftStart = diffX ;
                transformedItem[i].leftFinish = diffX + transformedItem[i].width ;
            }else{
                transformedItem[i].leftStart = transformedItem[i].leftStart + diffX ;
                transformedItem[i].leftFinish = transformedItem[i].leftFinish + diffX;
            }

            //RECALCUL DES LEFT POSITION
            transformedItem[i].leftBaselineStart = transformedItem[i].leftStart;
            transformedItem[i].left =  transformedItem[i].leftStart;
            transformedItem[i].leftBaselineFinish = transformedItem[i].leftFinish;
            transformedItem[i].right =  transformedItem[i].leftFinish;

            //UPDATE DATE START ET FINISH + NB DAYS
            transformedItem[i].start = FUNC_FIND_DATE_FROM_LEFT(transformedItem[i].leftStart, roadmapFirstYear, roadmapMonthWidth);
            transformedItem[i].finish = FUNC_FIND_DATE_FROM_LEFT(transformedItem[i].leftFinish, roadmapFirstYear, roadmapMonthWidth);
            transformedItem[i].baselineStart = transformedItem[i].start;
            transformedItem[i].baselineFinish = transformedItem[i].finish;
            transformedItem[i].daysStartMonth = FUNC_NB_OF_DAYS(transformedItem[i].start);
            transformedItem[i].daysFinishMonth = FUNC_NB_OF_DAYS(transformedItem[i].finish);
            transformedItem[i].daysBaselineStartMonth = transformedItem[i].daysStartMonth;
            transformedItem[i].daysBaselineFinishMonth = transformedItem[i].daysFinishMonth;

            //SHADOW RESET
            transformedItem[i].optionShadow = false;

        }else{

            //IF ADD OR COPY
            if(specific){
                transformedItem[i].leftFinish = diffX;
            }else{
                transformedItem[i].leftFinish = transformedItem[i].leftFinish + diffX;
            }

            //RECALCUL DES LEFT POSITION
            transformedItem[i].leftStart = transformedItem[i].leftFinish;
            transformedItem[i].leftBaselineStart = transformedItem[i].leftFinish;
            transformedItem[i].leftBaselineFinish = transformedItem[i].leftFinish;

            // //UPDATE FINISH
            transformedItem[i].finish = FUNC_FIND_DATE_FROM_LEFT(transformedItem[i].leftFinish, roadmapFirstYear, roadmapMonthWidth);
            transformedItem[i].start = transformedItem[i].finish;
            transformedItem[i].baselineStart = transformedItem[i].finish;
            transformedItem[i].baselineFinish = transformedItem[i].finish;
            transformedItem[i].daysFinishMonth = FUNC_NB_OF_DAYS(transformedItem[i].finish);
            transformedItem[i].daysStartMonth = transformedItem[i].daysFinishMonth;
            transformedItem[i].daysBaselineStartMonth = transformedItem[i].daysFinishMonth;
            transformedItem[i].daysBaselineFinishMonth = transformedItem[i].daysFinishMonth;
            
            //SHADOW RESET
            transformedItem[i].optionShadow = false;

            //TEST IF OPTION LABEL TRUE
            transformedItem[i].left = transformedItem[i].leftFinish - (userSettings.roadmapItemHeight / 2)
            if(transformedItem[i].optionLabel){
                transformedItem[i].left = transformedItem[i].left - transformedItem[i].txtWidth
            }

            //RIGHT
            transformedItem[i].right = transformedItem[i].left + transformedItem[i].width
        }

        //INTEGRATION
        transformedData.splice(indextransformedData, 0, transformedItem[i])
    }

    //RETURN TRANSFORMED DATA
    return ROADMAP_TOP_POSITION(transformedData, userSettings)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// ROADMAP MOVE ITEM ///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const ROADMAP_DATA_MOVE_ITEM = (data, roadmapFirstYear, roadmapMonthWidth, item, options, userSettings) =>{

    //INIT
    var transformedData = data;
    var transformedItem = item;

    /////////////////////////
    /// TROUVER LE DIFF X ///
    /////////////////////////

    //TRI PAR DATE DE DEB
    transformedItem.sort(function(a, b){
        if(a.start < b.start) { return -1; }
        if(a.start > b.start) { return 1; }
        return 0;
    })

    //CALCUL
    var diffX = options.mouseX - transformedItem[0].left

    //////////////////////////////
    /// GROUP LEVEL MANAGEMENT ///
    //////////////////////////////

    //TROUVER GROUP ITEMS LIST
    var itemsGroup = transformedData.filter(item => item.groupKey === options.groupKey);
    var indexMatchTop = itemsGroup.findIndex(item => options.mouseY < item.top - userSettings.roadmapItemSpaceLine/2) - 1;

    //RECTIF SI EN DESSOUS
    if(indexMatchTop === -2){indexMatchTop = itemsGroup.length -1}
    if(indexMatchTop === -1){indexMatchTop = 0}

    //INDEX
    var indextransformedData ;

    /////////////////
    /// ITEM LOOP ///
    /////////////////
    for(var i = 0 ; i < transformedItem.length ; i++){

        //UPDATE LEVEL & SORT
        transformedItem[i].groupKey = options.groupKey;
        transformedItem[i].group = itemsGroup[indexMatchTop].group;
        transformedItem[i].level = itemsGroup[indexMatchTop].level;
        transformedItem[i].sort = itemsGroup[indexMatchTop].sort;

        /////////////////////////////////////////////
        /// GESTION DES POSITION LEFT RIGHT WIDTH ///
        /////////////////////////////////////////////

        //RECALCUL DES LEFT POSITION
        transformedItem[i].leftFinish = transformedItem[i].leftFinish + diffX
        if(transformedItem[i].leftStart){transformedItem[i].leftStart = transformedItem[i].leftStart + diffX};

        //TEST SI TASK 
        if(transformedItem[i].type === APP_ITEM_TYPES.task || transformedItem[i].type === APP_ITEM_TYPES.consoTask){

            //UPDATE DATE START ET FINISH + NB DAYS
            transformedItem[i].start = FUNC_FIND_DATE_FROM_LEFT(transformedItem[i].leftStart, roadmapFirstYear, roadmapMonthWidth);
            transformedItem[i].finish = FUNC_FIND_DATE_FROM_LEFT(transformedItem[i].leftFinish, roadmapFirstYear, roadmapMonthWidth);
            transformedItem[i].daysStartMonth = FUNC_NB_OF_DAYS(transformedItem[i].start)
            transformedItem[i].daysFinishMonth = FUNC_NB_OF_DAYS(transformedItem[i].finish)

            //UPDATE LEFT
            transformedItem[i].left = transformedItem[i].leftStart
            if(transformedItem[i].optionShadow && transformedItem[i].leftBaselineStart && transformedItem[i].leftBaselineStart < transformedItem[i].leftStart){
                transformedItem[i].left = transformedItem[i].leftBaselineStart
            }
            
            //UPDATE RIGHT & WIDTH
            transformedItem[i].right = transformedItem[i].leftFinish
            transformedItem[i].width = transformedItem[i].right - transformedItem[i].left
            if(transformedItem[i].optionShadow && transformedItem[i].leftBaselineFinish && transformedItem[i].leftBaselineFinish > transformedItem[i].leftFinish){
                transformedItem[i].right = transformedItem[i].leftBaselineFinish
                transformedItem[i].width = transformedItem[i].right - transformedItem[i].left
            }

        }else{

            //UPDATE FINISH
            transformedItem[i].finish = FUNC_FIND_DATE_FROM_LEFT(transformedItem[i].leftFinish, roadmapFirstYear, roadmapMonthWidth);
            transformedItem[i].start = transformedItem[i].finish 
            transformedItem[i].daysFinishMonth = FUNC_NB_OF_DAYS(transformedItem[i].finish)
            transformedItem[i].daysStartMonth = transformedItem[i].daysFinishMonth
            
            //LEFT LOGO + TXT
            transformedItem[i].left = transformedItem[i].leftFinish - (userSettings.roadmapItemHeight / 2)
            if(transformedItem[i].optionShadow && transformedItem[i].leftBaselineFinish && transformedItem[i].leftBaselineFinish > transformedItem[i].leftFinish){
                transformedItem[i].left = transformedItem[i].leftBaselineFinish - (userSettings.roadmapItemHeight / 2)
            }

            //WIDTH
            transformedItem[i].width = userSettings.roadmapItemHeight + transformedItem[i].txtWidth

            //TEST IF OPTION LABEL TRUE
            if(transformedItem[i].optionLabel){
                transformedItem[i].left = transformedItem[i].left - transformedItem[i].txtWidth
            }

            //RIGHT
            transformedItem[i].right = transformedItem[i].left + transformedItem[i].width
        }

        //INTEGRATION
        indextransformedData = FUNCT_FIND_INDEX(transformedData,"id",transformedItem[i].id);
        transformedData.splice(indextransformedData, 1, transformedItem[i]);
    }

    //RETURN TRANSFORMED DATA
    return ROADMAP_TOP_POSITION(transformedData, userSettings)
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// ROADMAP DATE RANGE //////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ROADMAP_DATE_RANGE = (inputData, firstPeriod, lastPeriod, userSettings, firstYear, currentFirstYear, roadmapMonthWidth) =>{

    //Init
    var data = inputData;
    var transformedData = [];

    //DECALAGE
    var diffX = (firstYear - currentFirstYear)*roadmapMonthWidth*12
    console.log(diffX)

    ///////////////////////////////
    /// FIRST LOOP TO INIT DATA ///
    ///////////////////////////////
    var currentLine ;
    for(var i=0 ; i < data.length ; i++){

        //RESET
        currentLine = {};

        //COMMON 
        currentLine = data[i];

        //INTEGRATION DE LA CLES DISPLAY IF SELECTED RANGE PERIODE
        if(firstPeriod && lastPeriod){
            if(currentLine.start >= firstPeriod && currentLine.finish <= lastPeriod ){
                currentLine.display = true
            }else{
                currentLine.display = false
            }
        }else{
            currentLine.display = true
        }

        //RAJOUTER LE DECALLEGE DIFFX POUR TOUS


        
        //!!!!!!
        //!!!!!!
        //!!!!!!




        //PUSH
        transformedData.push(currentLine);
    }

    //RETURN TRANSFORMED DATA
    return ROADMAP_TOP_POSITION(transformedData, userSettings)
}

/////////////////////////////
/// IDENTIFY UNIQUE GROUP ///
/////////////////////////////

export const ROADMAP_GROUP_CREATION = (roadmapData) =>{

    //INIT
    var groupObject = [];

    //RECUP LIST GROUP
    const groupKeyList = [...new Set(roadmapData.map(item => item.groupKey))]; 

    //GET ALL INFO
    var index;
    var currentGroup ={};
    for (var i = 0 ; i < groupKeyList.length ; i++){
        
        //FIND INDEX
        index = FUNCT_FIND_INDEX(roadmapData,"groupKey",groupKeyList[i])
        
        //CREATE LINE
        currentGroup ={};
        currentGroup.key = roadmapData[index].groupKey;
        currentGroup.sort = currentGroup.key;
        currentGroup.name = roadmapData[index].group;
        
        //PUSH
        groupObject.push(currentGroup);
    }
    return groupObject;

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// DEL ITEM ///////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const ROADMAP_DATA_DEL_ITEM = (data, userSettings, itemId) =>{

    //INIT
    var transformedData = data;
    var itemIndex;

    //SI SEULEMENT SELECTIONNE CLICK DROIT 
    if(itemId){

        //FIND INDEX
        itemIndex = FUNCT_FIND_INDEX(transformedData, "id", itemId);

        //DELETE
        transformedData.splice(itemIndex, 1)

    }else{

        //GET ALL SELECTED ITEM
        var items = transformedData.filter(item => item.action === "select")

        //ITEM LOOP 
        for(var i = 0 ; i < items.length ; i++){

            //FIND INDEX
            itemIndex = FUNCT_FIND_INDEX(transformedData, "id", items[i].id);

            //DELETE
            transformedData.splice(itemIndex, 1)
        }
    }


    //RETURN TRANSFORMED DATA
    return ROADMAP_TOP_POSITION(transformedData, userSettings)
}