import React from 'react'
import {createPortal} from 'react-dom';
import {FUNC_FIND_DATE_FROM_LEFT, FUNC_ZERO_FORMAT_TO_NUM} from './standards'

/////////////////////////////////////////////////////////////
/// DATE VIEWER /////////////////////////////////////////////
/////////////////////////////////////////////////////////////

export function DateViewer ({height, width, left, top, roadmapFirstYear, roadmapMonthWidth}) {

    //VIEWVER
    var roadmapHeader = document.getElementById("roadmapHeaderRight").getBoundingClientRect();
    var newLeft = left;

    //MAX LEFT RIGHT SIDE
    if(left + width/2 < roadmapHeader.left){newLeft= roadmapHeader.left - width/2};
    if(left + width/2 > roadmapHeader.left + roadmapHeader.width){newLeft= roadmapHeader.left + roadmapHeader.width - width/2}

    //GET DATE
    var newDate = FUNC_FIND_DATE_FROM_LEFT(left - roadmapHeader.left + width/2, roadmapFirstYear, roadmapMonthWidth);
    var newDateTxt = FUNC_ZERO_FORMAT_TO_NUM(newDate.getDate(),2) + "/" + FUNC_ZERO_FORMAT_TO_NUM(newDate.getMonth() + 1,2)  + "/" + newDate.getFullYear();
    
    //////////////////////////
    /// DATE VIEWER RENDER ///
    //////////////////////////
    return createPortal(
      <div 
        className="roadmapDragDateViewer flexCenterCenter" 
        style={{
          height: height +"px",
          width: width + "px",
          left: newLeft + "px",
          top: top - 8 + "px",
        }}
      >
        {newDateTxt}
        <div className="roadmapDragDateViewerTriangle"></div>
      </div>, document.body
    );
}