import React from 'react'

///////////////////////
/// ROADMAP SPINNER ///
///////////////////////

export const RoadmapSpinner = ({roadmapInitHeight, roadmapGroupWidth}) => {
    return(
        <div className="roadmapSpinner flexStartStrech" style={{height:roadmapInitHeight + "px"}}>
            
            {/* LEFT */}
            <div className="roadmapLeftSide" style={{minWidth:roadmapGroupWidth + "px",maxWidth:roadmapGroupWidth + "px"}}>
                <div style={{position:"sticky"}}>
                    Loading...
                </div>
            </div>

            {/* RIGHT */}
            <div className="spinner-grow stickyLeft roadmapSpinnerContent" role="status" style={{left:roadmapGroupWidth + 20 + "px", marginTop:"20px"}}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}