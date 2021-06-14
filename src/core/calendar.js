import React from 'react';
import { 
    FUNC_GET_MONTH_NAME,
    FUNC_ZERO_FORMAT_TO_NUM,
    FUNC_GET_WEEK_NUMBER
} from './standards'
import {
    APP_STANDARDS,
} from './constants'

////////////
/// DAYS ///
////////////
const DaysBlock = (
    {type,
    month, 
    dayWidth, 
    nbDaysMonth, 
    currentYear
}) =>{

    //INIT
    var daysBlockContent = [];
    for(var day = 0 ; day < nbDaysMonth ; day++){
        daysBlockContent.push(
            <div
                key={"dayBlock-" + day + "-" + month + "-" + currentYear} 
                className="roadmapBlockTxt flexCenterCenter flex-fill roadmapBlockBg roadmapBlockTxtBorderRightLight" 
                style={{
                    width: dayWidth + "px",
                    height: type === "header" ? APP_STANDARDS.roadmapHeaderLineHeight + "px" : null,
                    fontSize: type === "header" ? "11px" : null
                }}
            >
                {type === "header" ? FUNC_ZERO_FORMAT_TO_NUM(day + 1 ,2) : null}
            </div>
        ); 
    }
    return daysBlockContent;
}

/////////////
/// WEEKS ///
/////////////
const WeeksBlock = (
    {type,
    month, 
    dayWidth, 
    nbDaysMonth, 
    currentYear, 
    daysToBeDisplayed
}) =>{

    //INIT
    var weeksBlockContent = [];
    var nbOfDays = 1;
    var testWeek;
    var currentWeek=FUNC_GET_WEEK_NUMBER(new Date(currentYear, month, 1));

    //LOOP
    for(var day = 1 ; day < nbDaysMonth  ; day++){

        //COMPTEUR
        nbOfDays = nbOfDays +1;
        testWeek = FUNC_GET_WEEK_NUMBER(new Date(currentYear, month, day + 1));

        //TEST SI NOUVELLE WEEK ET DIFF DE O 
        if(day === nbDaysMonth - 1  || currentWeek !== testWeek){
            
            //PUSH
            weeksBlockContent.push(
                <div
                    key={"weekBlock-" + currentWeek + "-" + month + "-" + currentYear} 
                    className={!daysToBeDisplayed?
                        "roadmapBlockTxt flexCenterCenter flex-fill roadmapBlockBg roadmapBlockTxtBorderRightLight"
                    :
                        "roadmapBlockTxt flexCenterCenter flex-fill roadmapBlockTxtBorderRightLight"
                    }
                    style={{
                        width: (nbOfDays*dayWidth) + "px",
                        height: type === "header" ? APP_STANDARDS.roadmapHeaderLineHeight + "px" : null,
                        fontSize: type === "header" ? "12px" : null
                    }}
                >
                    {type === "header" && nbOfDays > 3 ?
                        <span className="roadmapBlockTxtEllipsi">
                            {"W" + currentWeek}
                        </span>
                    :null}
                </div>
            ); 

            //RESET COMPTEUR
            currentWeek = testWeek
            nbOfDays = 0;
        }
    }
    return weeksBlockContent;
}

//////////////
/// MONTHS ///
//////////////
const MonthsBlock = (
    {type,
    monthWidth,
    currentYear, 
    isRoadmapWeeks, 
    isRoadmapDays,
}) => {

    //INIT
    var monthsBlockContent = [];
    var weeksToBeDisplayed = isRoadmapWeeks && monthWidth >= APP_STANDARDS.roadmapMinDisplayWeek;
    var daysToBeDisplayed =  isRoadmapDays && monthWidth >= APP_STANDARDS.roadmapMinDisplayDay;

    //QUATER TEST WITH LINE
    var weeksTest;
    if(type === "header"){
        weeksTest = weeksToBeDisplayed;
    }else{
        weeksTest = weeksToBeDisplayed && !daysToBeDisplayed ;
    }

    //CSS POUR LINE
    var cssLine = type === "header" ? null : "flex-fill";

    //////////////
    /// MONTHS ///
    /////////////
    var nbDaysCurrentMonth;
    var currentDayWidth;
    for (var month = 0 ; month < 12 ; month++){

        //DAYS WIDTH
        nbDaysCurrentMonth = new Date(currentYear,month + 1,0).getDate();
        currentDayWidth = monthWidth / nbDaysCurrentMonth;
        

        //PUSH MONTH
        monthsBlockContent.push(
            <div 
                key={"monthBlock-" + month + "-" + currentYear} 
                className={!weeksToBeDisplayed && !daysToBeDisplayed?
                    "roadmapBlockTxt flexColCenterCenter roadmapBlockBg " + cssLine
                    :
                    "roadmapBlockTxt flexColCenterCenter " + cssLine
                }
                style={{width: monthWidth + "px"}}
            >
                {/* SEULEMENT AVEC HEADER */}
                {type === "header" ?
                    <div 
                        className=" flexCenterCenter"
                        style={{
                            fontSize:"13px",
                            height: APP_STANDARDS.roadmapHeaderLineHeight +"px"
                        }}
                    >
                        {FUNC_GET_MONTH_NAME(monthWidth, month)}
                    </div>
                :null}

                {/* WEEKS */}
                {weeksTest?
                    <div className="roadmapBlock flexCenterCenter roadmapTopSeparator" >
                        <WeeksBlock 
                            type={type}
                            month={month}
                            dayWidth={currentDayWidth}
                            nbDaysMonth={nbDaysCurrentMonth}
                            currentYear={currentYear}
                            daysToBeDisplayed={daysToBeDisplayed}
                        />
                    </div>
                :null}

                {/* DAYS */}
                {daysToBeDisplayed?
                    <div className="roadmapBlock flexCenterCenter roadmapTopSeparator" >
                        <DaysBlock 
                            type={type}
                            month={month}
                            dayWidth={currentDayWidth}
                            nbDaysMonth={nbDaysCurrentMonth}
                            currentYear={currentYear}
                        />
                    </div>
                :null}
            </div>
        );
    }
    return monthsBlockContent;
}

////////////////////
/// QUATERS LOOP ///
////////////////////
const QuatersBlock = (
    {type,
    monthWidth, 
    currentYear, 
    monthsToBeDisplayed
}) =>{

    //INIT
    var quartersBlockContent = [];
    var quarterWidth = monthWidth*3;
    var cssLine = type === "header" ? null : "flex-fill";

    //LOOP QUATER
    for (var i = 1 ; i < 5 ; i++){
        quartersBlockContent.push(
            <div 
                key={"quaterTxt-" + currentYear + "-" + i}
                className={!monthsToBeDisplayed?
                    "roadmapBlockTxt flexCenterCenter roadmapBlockBg " + cssLine
                    :
                    "roadmapBlockTxt flexCenterCenter " + cssLine
                }
                style={{
                    width:quarterWidth +"px",
                    height: type === "header" ? APP_STANDARDS.roadmapHeaderLineHeight + "px" : null
                }}
            >
                {type === "header" ? "Q" + i : null}
            </div>
        );
    }
    return quartersBlockContent;
}

/////////////////
/// YEAR LOOP /// 
/////////////////
export const YearsBlock = (
    {type, 
    roadmapPeriod, 
    options
}) => {

    //TEST SI DISPLAY 
    var quatersToBeDisplayed = options.display.isRoadmapQuaters && options.roadmapMonthWidth >= APP_STANDARDS.roadmapMinDisplayQuater;
    var monthsToBeDisplayed = options.display.isRoadmapMonths && options.roadmapMonthWidth >= APP_STANDARDS.roadmapMinDisplayMonth;

    //QUATER TEST WITH LINE
    var quatersTest;
    if(type === "header"){
        quatersTest = quatersToBeDisplayed;
    }else{
        quatersTest = quatersToBeDisplayed && !monthsToBeDisplayed ;
    }

    //LOOP FROM START TO FINISH YEAR
    var yearsBlokContent = [];
    for (var year = roadmapPeriod.roadmapFirstYear; year <= roadmapPeriod.roadmapLastYear ; year++ ){
        yearsBlokContent.push(
            <div 
                key={"yearBlock-" + year} 
                className={!quatersToBeDisplayed && !monthsToBeDisplayed ? 
                    "roadmapYearBlock flexColCenterCenter roadmapBlockBg"
                    :
                    "roadmapYearBlock flexColCenterCenter"
                }
                style={{
                    minWidth: options.roadmapMonthWidth*12 + "px",
                    maxWidth: options.roadmapMonthWidth*12 + "px"
                }}
            >

                {/* YEAR ---------------------------------------------- */}
                {type === "header" ?
                    <div 
                        className="roadmapBlockTxt flexStartCenter"
                        style={{
                            width: options.roadmapMonthWidth*12 + "px",
                            height: APP_STANDARDS.roadmapHeaderLineHeight + "px",
                            position: "relative",
                            borderRight:"none"
                        }}
                    >
                        <div 
                            className="stickyLeft roadmapYearTxtContent" 
                            style={{left: APP_STANDARDS.roadmapGroupWidth}}
                        >
                            {year}
                        </div>
                    </div>
                :null}


                {/* QUATERS */}
                {quatersTest? 
                    <div className="roadmapBlock flexCenterCenter roadmapTopSeparator" >
                        <QuatersBlock 
                            type={type}
                            monthWidth={options.roadmapMonthWidth}
                            currentYear={year}
                            monthsToBeDisplayed={monthsToBeDisplayed}
                        />
                    </div>
                :null}

                {/* MONTH : MANDATORY TO DISPLAY WEEKS AND DAYS */}
                {monthsToBeDisplayed?
                    <div className="roadmapBlock flexCenterCenter roadmapTopSeparator">
                        <MonthsBlock 
                            type={type}
                            monthWidth={options.roadmapMonthWidth}
                            currentYear={year}
                            isRoadmapWeeks={options.display.isRoadmapWeeks}
                            isRoadmapDays={options.display.isRoadmapDays}
                        />
                    </div>
                :null}
            </div>
        );
    } 
    return yearsBlokContent;
}
 