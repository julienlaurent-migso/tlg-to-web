import React from 'react'
import {RoadmapHeader} from './roadmapHeader'
import RoadmapGroup from './roadmapGroup'
import RoadmapContentLines from './roadmapContentLines' 
import {RoadmapSpinner} from '../../core/spinner'
import {APP_STANDARDS} from '../../core/constants'
import {
    FUNC_ARRAY_SUM_ATTRIBUT
} from '../../core/standards'


/////////////////////////
/// ROADMAP COMPONENT ///
///////////////////////// 
class Roadmap extends React.Component{

    ////////////////////////////////
    /// ROADMAP COMPONENT RENDER ///
    ////////////////////////////////
    render(){

        console.log("Render: ROADMAP")

        //PROPS
        const {
            isOnEditMode,
            roadmapMonthWidth,
            userSettings,
            groupSettings,
            updateState,
            roadmapData, 
            launchAppFunctions,
            headerOption,
            roadmapPeriod,
            actions,
            roadmapSizeInfo,
        } = this.props;

        ////////////////////////////////////////////////////
        /// FIND GLOBAL HEIGHT ONLY IF UPDATE ROADMAP OK ///
        ////////////////////////////////////////////////////
        
        //INIT
        var groupData;

        //NEED FOR CONTENT LINE PURE COMPONENT / COUNT IF MODIF ON HEADER OPTION
        var headerOptionString =  
        headerOption.isRoadmapQuaters +
        headerOption.isRoadmapMonths + 
        headerOption.isRoadmapWeeks + 
        headerOption.isRoadmapDays ;

        ////////////////////////////////
        /// ROADMAP COMPONENT RETURN /// !HERE DRAG SELECT !! 
        ////////////////////////////////
        return(
            <section 
                id="appContent" 
                className="roadmapContent"
            >

                {/* ROADMAP HEADER ------------------------------- OK -----------------------*/}
                <RoadmapHeader 
                    roadmapPeriod={roadmapPeriod}
                    headerOption={headerOption}
                    roadmapMonthWidth={roadmapMonthWidth}
                    launchAppFunctions={launchAppFunctions}
                />

                {/* CONTENT LINES ----------------------------- OK ----------------------*/}
                <RoadmapContentLines 
                    isGlobal={true}
                    roadmapHeight={groupSettings.roadmapHeight}
                    roadmapPeriod={roadmapPeriod}
                    headerOption={headerOption}
                    roadmapMonthWidth={roadmapMonthWidth}
                    headerOptionString={headerOptionString}
                />

                {/* CREATION DES GROUPES / SPINNER -------------------------------------------*/}
                {!roadmapData ? 
                    <RoadmapSpinner 
                        roadmapInitHeight={APP_STANDARDS.roadmapInitHeight}
                        roadmapGroupWidth={APP_STANDARDS.roadmapGroupWidth}
                    />
                :
                    groupSettings.group.map(group =>{

                        //GET GROUP DATA
                        groupData = roadmapData.filter(item => item.groupKey === group.key)

                        //RETURN
                        return(
                            <RoadmapGroup 
                                key={"group-" + group.key}
                                updateTracker={FUNC_ARRAY_SUM_ATTRIBUT(groupData, "updateTracker")}
                                isOnEditMode={isOnEditMode}
                                userSettings={userSettings}
                                groupSettings={group}
                                roadmapFirstYear={roadmapPeriod.roadmapFirstYear}
                                sizeInfo={roadmapSizeInfo}
                                actions={actions}
                                roadmapMonthWidth={roadmapMonthWidth}
                                updateState={updateState}
                                groupData={groupData}
                                launchAppFunctions={launchAppFunctions}
                            />
                        )
                    })
                }
            </section>
        )
    }
}
export default Roadmap

