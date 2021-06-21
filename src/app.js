import React from 'react'
import './css/timeLineGenerator.css';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Header from './components/structure/header'
import Home from './components/home/home'
import HomeSideBar from './components/home/homeSideBar'
import {Import} from './components/import/import'
import ImportSideBar from './components/import/importSideBar'
import Grid from './components/grid/grid'
import GridSideBar from './components/grid/gridSideBar'
import Roadmap from './components/roadmap/roadmap'
import RoadmapSideBar from './components/roadmap/roadmapSideBar'
import Settings from './components/settings/settings'
import SettingsSideBar from './components/settings/settingsSideBar'
import initialData from './backend/initialData'
import {
  APP_INIT_SETTINGS,
  APP_USER_SETTINGS,
  APP_ROADMAP_HEADER_SETTINGS,
  APP_INIT_ACTIONS,
  APP_ROADMAP_PERIOD,
} from './core/constants'
import {
  ROADMAP_DATA_CREATION, 
  ROADMAP_DATA_ZOOM, 
  ROADMAP_DATA_RESIZE,
  ROADMAP_DATA_DRAG_DROP,
  ROADMAP_DATA_ADD_ITEM,
  ROADMAP_DATA_MOVE_ITEM,
  ROADMAP_DATE_RANGE,
  ROADMAP_GROUP_CREATION,
  ROADMAP_DATA_DEL_ITEM,
  ROADMAP_DATA_ITEM_TXT,
} from './backend/roadmapData'
import {
  AddItemsModal,
  ColorsItemsModal
} from './core/modal'
import {
  FUNC_ARRAY_MIN_MAX,
  FUNC_ROADMAP_SIZE_INFO,
  FUNC_ROADMAP_GROUP_HEIGHT,
  FUNCT_FIND_INDEX_ARRAY,
  FUNC_FIND_INTERSECTE
} from './core/standards'
import { withAuthenticator } from '@aws-amplify/ui-react'

//////////////////////////////////////////////////////////////////////////
/// APP COMPONENT ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
class App extends React.Component{

  /////////////////////////
  /// INITIAL STATEMENT ///
  /////////////////////////
  constructor(props) {
    super(props);
    this.state={
      importedData: initialData[0].importedData,
      roadmapData: null, 
      userSettings: APP_USER_SETTINGS,
      groupSettings: null,
      appSettings: APP_INIT_SETTINGS,
      roadmapPeriod: APP_ROADMAP_PERIOD,
      headerOption: APP_ROADMAP_HEADER_SETTINGS,
      actions: APP_INIT_ACTIONS,
    }
    this.updateState = this.updateState.bind(this);
    this.launchAppFunctions = this.launchAppFunctions.bind(this);
  }

  //////////////////////////////////////
  /// UPDATE STATE | SOURCE | OBJECT ///
  //////////////////////////////////////
  updateState(source, object){

    //Keep object reference
    var updates = this.state[source];
    
    //GET ALL OBJECTS ATTRIBUTS TO UPDATE
    const attributs = Object.keys(object);

    //UPDATE REFERNECE OBJECT WITH NEW VALUES
    for(var i=0 ; i < attributs.length ; i++){
      updates[attributs[i]] = object[attributs[i]];
    }

    //SET UPDATED STATE
    this.setState({[source] : updates})
  }

  /////////////////////////////////////////////
  /// UPDATE ROADMAP DATA | OBJECT | OPTION ///
  /////////////////////////////////////////////                            
  updateRoadmapData(ids, object, option){

    //GET ALL OBJECTS ATTRIBUTS TO UPDATE
    var attributs;
    if(object){attributs = Object.keys(object);}

    //SET STATE
    this.setState(prevState => {

      //ROADMAP
      let roadmapData = [...prevState.roadmapData].map(item => {

        //ON UPDATE SEUELEMNT SUR ITEM ID
        if(FUNCT_FIND_INDEX_ARRAY(ids,item.id) !== -1){

          //UPDATE REFERNECE OBJECT WITH NEW VALUES
          for(var i=0 ; i < attributs.length ; i++){
            item[attributs[i]] = object[attributs[i]];
          }

          //TRACK MODIFICATION FOR PURE COMPONENT
          item.updateTracker = item.updateTracker + 1
        
        //UPDATE SUR AUTRE LIGNE SI BESOIN
        }else{

          //OPTION SUR AUTRE LIGFNE SI BESOIN
          if(option){
          
            //RESET ACTION SI CTRL NON PRESSE POUR UNE SELECTION
            if(option.type === "select" && !option.isCtrlPressed && item.action){
              item.action = null;
              item.updateTracker = item.updateTracker + 1;
            }

            //CHANGE select to copy
            if(option.type === "copy" && item.action === "select"){
              item.action = "copy";
              item.updateTracker = item.updateTracker + 1;
            }

            //RESET ALL
            if(option.type === "actionReset" && item.action){
              item.action = null;
              item.updateTracker = item.updateTracker + 1;
            }
          }
        }
        return item
      })

      //ACTIONS
      let actions = {...prevState.actions};
      if(option){
        if(option.type === "select" && object.action){
          actions.isItemsSelected = true;
          actions.isItemsCopied = false;
        }
        if(option.type === "copy"){
          actions.isItemsSelected = false;
          actions.isItemsCopied = true;
        }
        if(option.type === "actionReset"){
          actions.isItemsSelected = false;
          actions.isItemsCopied = false;
        }
      }

      //RETURN
      return { roadmapData, actions }; 
    })

  }


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  //!!!!!!!!!!!! SIMPLIFIER LES FONCTIONS EN LES CONCTENANT !!!!!!!!!!!!!!!!!!!!

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



  ////////////////////////////////////////
  /// ACTION : DELETE SELECTED ITEM(S) ///
  ////////////////////////////////////////
  actionDeleteItems(itemId){
    this.setState(prevState => {
      let prevRoadmapData = [...prevState.roadmapData];
      let roadmapData = ROADMAP_DATA_DEL_ITEM(prevRoadmapData, this.state.userSettings,itemId);
      let actions = {...prevState.actions}
      actions.isItemsSelected = false;
      actions.isItemsCopied = false;
      return { roadmapData, actions }; 
    })
  }

  ///////////////////////////
  /// CREATE ROADMAP DATA ///
  ///////////////////////////
  createRoadmapData(){
    if(!this.state.roadmapData){
      this.setState(() =>{
        let roadmapData = ROADMAP_DATA_CREATION(initialData[0].gridData, this.state.roadmapPeriod.roadmapFirstYear, this.state.appSettings.roadmapMonthWidth, this.state.userSettings);
        let groupSettings = ROADMAP_GROUP_CREATION(roadmapData);
        return {roadmapData, groupSettings}
      });
    }
  }

  /////////////////////////
  /// UPDATE DATE RANGE ///
  /////////////////////////
  updateDateRangeRoadmapData(firstPeriod, lastPeriod, firstYear, lastYear){
    this.setState(prevState => {
      let prevRoadmapData = [...prevState.roadmapData];
      let roadmapData = ROADMAP_DATE_RANGE(prevRoadmapData, firstPeriod, lastPeriod, this.state.userSettings);
      let roadmapPeriod = {...prevState.roadmapPeriod};
      roadmapPeriod.roadmapFirstPeriod = firstPeriod;
      roadmapPeriod.roadmapLastPeriod = lastPeriod;
      roadmapPeriod.roadmapFirstYear = firstYear;
      roadmapPeriod.roadmapLastYear = lastYear;
      return { roadmapData, roadmapPeriod }; 
    })
  }

  
  ///////////////////
  /// ADD ITEM(S) ///
  ///////////////////
  actionAddItems(item, options, specific){
    this.setState(prevState => {
      let prevRoadmapData = [...prevState.roadmapData];
      let roadmapData = ROADMAP_DATA_ADD_ITEM(
        prevRoadmapData, 
        this.state.roadmapPeriod.roadmapFirstYear, 
        this.state.appSettings.roadmapMonthWidth, 
        item, 
        options, 
        specific, 
        this.state.userSettings
      );
      let appSettings = {...prevState.appSettings};
      appSettings.actionModal = null;
      let actions = {...prevState.actions}
      actions.isItemsSelected = false;
      actions.isItemsCopied = false;
      return { roadmapData, appSettings, actions }; 
    })
  } 

  ///////////////////////////////////////
  /// LEFT AND TOP POSITION WITH ZOOM ///
  ///////////////////////////////////////
  updateZoomRoadmapData(newWidth){
    this.setState(prevState => {
      let prevRoadmapData = [...prevState.roadmapData];
      let roadmapData = ROADMAP_DATA_ZOOM(
        prevRoadmapData,
        this.state.roadmapPeriod.roadmapFirstYear,
        newWidth, 
        this.state.userSettings
      );
      let appSettings = {...prevState.appSettings}
      appSettings.roadmapMonthWidth = newWidth
      return { roadmapData, appSettings }; 
    })
  }

  ///////////////////////////////////
  /// MOVE DRAG AND DROP & RESIZE ///
  ///////////////////////////////////
  updateMoveRoadmapData(type, itemId, diffX, positionY, groupKey){
      this.setState(prevState => {
        let prevRoadmapData = [...prevState.roadmapData];
        let roadmapData;

        //RESIZE ----------------------------------------------
        if(type === "resize"){
          roadmapData = ROADMAP_DATA_RESIZE(
            prevRoadmapData, 
            this.state.roadmapPeriod.roadmapFirstYear, 
            this.state.appSettings.roadmapMonthWidth, 
            itemId, 
            diffX, 
            this.state.userSettings
          );
        
        //DRAG & DROP ------------------------------------------
        }else{
          roadmapData = ROADMAP_DATA_DRAG_DROP(
            prevRoadmapData, 
            this.state.roadmapPeriod.roadmapFirstYear, 
            this.state.appSettings.roadmapMonthWidth, 
            itemId, 
            diffX, 
            positionY,
            groupKey,  
            this.state.userSettings
          );
        }

        //RETUNR
        return { roadmapData }; 
      })
  }

  ///////////////
  /// MOVE TO ///
  ///////////////
  moveItemToGroupRoadmapData(item, options){
    this.setState(prevState => {
      let prevRoadmapData = [...prevState.roadmapData];
      let roadmapData = ROADMAP_DATA_MOVE_ITEM(
        prevRoadmapData, 
        this.state.roadmapPeriod.roadmapFirstYear, 
        this.state.appSettings.roadmapMonthWidth, 
        item, 
        options, 
        this.state.userSettings
      );
      let actions = {...prevState.actions}
      actions.isItemsSelected = false;
      actions.isItemsCopied = false;
      return { roadmapData, actions }; 
    })
  }

  ///////////////////////
  /// ITEM TXT UPDATE ///
  ///////////////////////
  updateItemTxt(itemId, isTask, newTxt){
    this.setState(prevState => {
      let prevRoadmapData = [...prevState.roadmapData];
      let roadmapData = ROADMAP_DATA_ITEM_TXT(
        prevRoadmapData, 
        itemId, 
        isTask, 
        newTxt, 
        this.state.userSettings
      );
      return { roadmapData }; 
    })
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////
  /// APP FUNCTIONS LAUNCHER ////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////

  //CONTEXT MENU LAUCNH
  launchAppFunctions(e, functionName, options){

    //INIT
    var addItem;

    //SWITCH FUNCTION
    switch (functionName) {

      //////////////
      /// GLOBAL ///
      //////////////

      //CREATE ROADMAP/GRID DATA FROM INPUT / TEMPLATE ---------------------------------------------
      case "globalCreateRoadmapData":
        this.createRoadmapData();
        break;

      //////////////
      /// HEADER ///
      //////////////

      //ROADMAP DISPLAY DAYS WITH MIN WIDTH --------------------------------------------------------
      case "roadmapHeader":
        this.updateState(
          "headerOption", 
          {[options.parameter]: !this.state.headerOption[options.parameter]}
        )
        break;

      //UPDATE RANGE PERIOD ------------------------------------------------------------------------
      case "roadmapHeaderRangePeriod":
        this.updateDateRangeRoadmapData(
          options.startDate, 
          options.finishDate, 
          options.startYear, 
          options.finishYear
        )
        break;

      //MANAGE ZOOM ---------------------------------------------------------------------------------
      case "roadmapHeaderZoom":
        this.updateZoomRoadmapData(options.width)
        break;

      ////////////
      /// ITEM ///
      ////////////

      //ROADMAP ITEM COPY -----------------------------------------------------------------------------
      case "roadmapItemCopy":
        this.updateRoadmapData(
          [options.id], 
          {action: "copy"}, 
          {type:"copy"}
        )
        break;

      //ROADMAP ITEM DELETE --------------------------------------------------------------------------
      case "roadmapItemDelete":
        e.preventDefault();
        e.stopPropagation();

        //TESTER SI AUCUN SELECTIONNE ET JUSTE CLICK DROIT ---------------------------------------------
        var itemId = null;
        if(!this.state.actions.isItemsSelected){
          itemId = options.id;
        }
        this.actionDeleteItems(itemId);
        break;

      //SELECT ITEM  -----------------------------------------------------------------------------------
      case "roadmapItemSelect":
        this.updateRoadmapData(
          [options.id], 
          options.object, 
          options.option
        )
        break;
      
      //UPDATE ITEM COLOR  -----------------------------------------------------------------------------------
      case "roadmapItemColor":
        console.log(options)
        this.updateRoadmapData(
          options.itemId, 
          options.colorsOject,
          {type:"actionReset"}
        )
        break;

      //UPDATE TXT AND KNOW IF IT'S MILESTONES TO RECAL TXT WIDTH -------------------------------------
      case "roadmapItemUpdateTxt":
        this.updateItemTxt(
          options.id,
          options.isTask,
          options.newTxt,
        )
        break;

      //ITEM RESIZE OR DRAG AND DROP UPDATE WIDTH AND TOP POSITION ------------------------------------
      case "roadmapItemResizeDragDrop":
        this.updateMoveRoadmapData(
          options.action, 
          options.id, 
          options.diffX, 
          options.positionY, 
          options.groupKey
        )
        break;

      //OPEN ADD MODAL ----------------------------------------------------------------------------------
      case "roadmapItemOpenColorModal":
        addItem = {
          roadmapNewItemOption: options,
          actionModal: "itemColor",
        }
        this.updateState("appSettings", addItem);
        break;

      /////////////
      /// GROUP ///
      /////////////

      //OPEN ADD MODAL ----------------------------------------------------------------------------------
      case "roadmapGroupSelection":
        console.log(FUNC_FIND_INTERSECTE(this.state.roadmapData, options, this.state.userSettings.roadmapItemHeight))
        this.updateRoadmapData(
          FUNC_FIND_INTERSECTE(this.state.roadmapData, options, this.state.userSettings.roadmapItemHeight), 
          {action: "select"}, 
          {type:"select", isCtrlPressed: e.ctrlKey},
        )
        break;

      //OPEN ADD MODAL ----------------------------------------------------------------------------------
      case "roadmapGroupOpenAddModal":
        addItem = {
          roadmapNewItemOption: options,
          actionModal: "addItem",
        }
        this.updateState("appSettings", addItem);
        break;

      //ADD ITEM ---------------------------------------------------------------------------------------
      case "roadmapGroupAddItem":
        this.actionAddItems(
          options.itemOject, 
          options.roadmapNewItemOption, 
          options.specific
        );
        break;
      
      //PASTE ------------------------------------------------------------------------------------------
      case "roadmapGroupPaste":
        var itemsCopied = this.state.roadmapData.filter(item => item.action === "copy");
        this.actionAddItems(
          itemsCopied, 
          options
        );
        break;

      //MOVE TO ----------------------------------------------------------------------------------------
      case "roadmapGroupMove":
        var itemsSelected = this.state.roadmapData.filter(item => item.action === "select");
        this.moveItemToGroupRoadmapData(
          itemsSelected, 
          options
        );
        break;

      //TO BE CREATED ---------------------------------------------------------------------------------
      default:
        console.log("function to be created : " + functionName);
    }
  }

  ////////////////////////////
  /// APP COMPONENT RENDER ///
  ////////////////////////////
  render(){

    console.log("Render: APP")

    //STATE
    const {
      appSettings,
      roadmapPeriod, 
      headerOption, 
      roadmapData,
      userSettings,
    } = this.state;

    ////////////////////////////
    /// APP COMPONENT RETURN ///
    ////////////////////////////
    return(
      <main id="appMain" >
        <BrowserRouter>

          {/* HEADER */}
          <Header />

          {/* BODY */}
          <section id="appBody" className="flexStartStrech" >

              {/* CONTENT + ROUTE */}
              <Switch>

                {/* IMPORT ----------------------------------------------------------- */}
                <Route 
                  exact path="/import" 
                  render={(props) => 
                    <React.Fragment>
                      <ImportSideBar />
                      <Import {...props} />
                    </React.Fragment>
                  } 
                />

                {/* GRID --------------------------------------------------------------- */}
                <Route 
                  exact path="/grid" 
                  render={(props) => 
                    <React.Fragment>
                      <GridSideBar />
                      <Grid {...props} 
                        importedData={this.state.importedData} 
                      />
                    </React.Fragment>
                  } 
                />
                
                {/* ROADMAP ------------------------------------------------------------ */}
                <Route 
                  exact path="/roadmap" 
                  render={() => 
                    <React.Fragment>

                      {/* ROADMAP SIDE BAR -----------OK---------------------------------------------------------------- */}
                      <RoadmapSideBar 
                        roadmapMonthWidth={appSettings.roadmapMonthWidth}
                        isOnEditMode={this.state.appSettings.isOnEditMode}
                        updateState={this.updateState}
                        isRoadmapData={roadmapData ? true : false}
                        roadmapMinMaxDate={roadmapData ? FUNC_ARRAY_MIN_MAX(roadmapData, "start", "finish") : null}
                        roadmapFirstPeriod={this.state.roadmapPeriod.roadmapFirstPeriod}
                        roadmapLastPeriod={this.state.roadmapPeriod.roadmapLastPeriod}
                        isLinksDisplayed={this.state.isLinksDisplayed}
                        launchAppFunctions={this.launchAppFunctions}
                      />

                      {/* ROADMAP  */}
                      <Roadmap 
                        roadmapMonthWidth={appSettings.roadmapMonthWidth}
                        isOnEditMode={this.state.appSettings.isOnEditMode}
                        groupSettings={FUNC_ROADMAP_GROUP_HEIGHT(roadmapData,this.state.groupSettings,userSettings)}
                        updateState={this.updateState}
                        userSettings={userSettings}
                        headerOption={this.state.headerOption}
                        roadmapData={roadmapData}
                        launchAppFunctions={this.launchAppFunctions}
                        roadmapPeriod={roadmapPeriod}
                        roadmapSizeInfo={FUNC_ROADMAP_SIZE_INFO(appSettings,headerOption,roadmapPeriod)}
                        actions={this.state.actions}
                      />
                    </React.Fragment>
                  } 
                />

                {/* SETTINGS ----------------------------------------------------------- */}
                <Route 
                  exact path="/settings" 
                  render={(props) => 
                    <React.Fragment>
                      <SettingsSideBar />
                      <Settings {...props} />
                    </React.Fragment>
                  } 
                />
               
                {/* IMPORT ------------------------------------------------------------- */}
                <Route 
                  path="/" 
                  render={(props) => 
                    <React.Fragment>
                      <HomeSideBar />
                      <Home {...props} />
                    </React.Fragment>
                  } 
                />
              </Switch>
          </section>


          {/* ADD MODAL ------------------OK---------------------------------------------------------------*/}
          {this.state.appSettings.actionModal === "itemColor" ?
            <ColorsItemsModal 
              updateState={this.updateState}
              roadmapNewItemOption={this.state.appSettings.roadmapNewItemOption}
              launchAppFunctions={this.launchAppFunctions}
              itemList={this.state.roadmapData.filter(item => item.action === "select")}
            />
          :null}


          {/* ADD MODAL ------------------OK---------------------------------------------------------------*/}
          {this.state.appSettings.actionModal === "addItem" ?
            <AddItemsModal 
              updateState={this.updateState}
              roadmapNewItemOption={this.state.appSettings.roadmapNewItemOption}
              userSettings={userSettings}
              launchAppFunctions={this.launchAppFunctions}
            />
          :null}


          {/*!---------- LINK PREDECESSORS ONLY PER GROUP  ------------------------*/}
          {/* {itemsList[0].group === "A" ? 
                    <Xarrow
                        start="xxx0003" //can be react ref
                        end="xxx0020" //or an id
                    />
                :null} */}
        
          {/* FOOTER */}
          {/* <footer id="appFooter">
            Footer
          </footer> */}
        
        </BrowserRouter>
      </main> 
    )
  }
}

export default withAuthenticator(App);
