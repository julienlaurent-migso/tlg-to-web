import React from 'react';
import { 
    FUNC_GET_ROADMAP_HEADER_HEIGHT
} from '../../core/standards'
import {YearsBlock} from '../../core/calendar' 

////////////////////////
/// IMPORT COMPONENT ///
//////////////////////// 
export class RoadmapContentLines extends React.PureComponent{

    ///////////////////////////////
    /// IMPORT COMPONENT RENDER ///
    ///////////////////////////////
    render(){

        console.log("RENDER : CONTENT LINES")

        //INIT
        const {
            isGlobal, 
            roadmapHeight,
            roadmapPeriod,
            headerOption, 
            roadmapMonthWidth
        } = this.props

        //CLASS IF GROUP OR GLOBAL
        var blockClass = "roadmapRightSide flexStartCenter"
        var topContentLines = 0;
        if(isGlobal){
            blockClass = "roadmapContentLines flexStartCenter"
            topContentLines = FUNC_GET_ROADMAP_HEADER_HEIGHT(headerOption,roadmapMonthWidth) ;
        }

        /////////////////////////////
        /// GRID COMPONENT RETURN ///
        /////////////////////////////
        return(
            <div 
                className={blockClass} 
                style={{height:roadmapHeight + topContentLines}}
            >
                {/* YEAR BLOCK */}
                <YearsBlock  
                    type="line"
                    roadmapPeriod={roadmapPeriod}
                    options={{
                        display: headerOption, 
                        roadmapMonthWidth: roadmapMonthWidth
                    }}
                />
            </div>
        )
    }
}
export default RoadmapContentLines
