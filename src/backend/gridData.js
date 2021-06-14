import {
    FUNC_TXT_TO_DATE_2
} from '../core/standards'

///////////////////////////////
/// IMPORT DATA > GRID DATA ///
///////////////////////////////
export const GRID_DATA_CREATION = (data) =>{

    //Init
    var transformedData = [];

    //LOOP
    var currentLine ;
    for(var i=0 ; i < data.length ; i++){

        //RESET
        currentLine = data[i];

        //DATE TRAITMENT
        
        currentLine.start = FUNC_TXT_TO_DATE_2(currentLine.start);
        currentLine.finish = FUNC_TXT_TO_DATE_2(currentLine.finish);
        currentLine.baselineStart = FUNC_TXT_TO_DATE_2(currentLine.baselineStart);
        currentLine.baselineFinish = FUNC_TXT_TO_DATE_2(currentLine.baselineFinish);
         
        //OPTION MNGT
        currentLine.optionLabel = false;
        currentLine.optionShadow = false;


        //PUSH
        transformedData.push(currentLine);

    }

    //RETURN TRANSFORMED DATA
    return transformedData

}
