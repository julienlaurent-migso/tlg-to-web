import React from 'react';
import {specGrid} from '../../core/specifications'

/////////////////////////////////////////////////////////////////
/// BACKEND FUNCTION - TO BE MOVE WHEN DONE IN BACKEND / GRID ///
////////////////////// //////////////////////////////////////////
const BACKEND_GRID = (importedData) => {

  //INIT
  var gridData = importedData;

  //-- >>>> MODIFICATION

  ///////////////////////////
  /// BACKEND GRID RETURN ///
  ///////////////////////////
  return gridData

} 
  
//////////////////////
/// GRID COMPONENT ///
////////////////////// 
class Grid extends React.Component{

    /////////////////////////
    /// INITIAL STATEMENT ///
    /////////////////////////
    constructor(props) {
        super(props);
        this.state={
          grid:BACKEND_GRID(this.props.importedData),
        }
    }


    /////////////////////////////
    /// GRID COMPONENT RENDER ///
    /////////////////////////////
    render(){

        console.log("IMPORTED DATA")
        console.log(this.props.importedData)

        console.log("RESULT BACKEND")
        console.log(this.state.grid)

        //EXAMPLE TO GET FIELD NAME
        console.log(Object.keys(this.state.grid[0]))


        //////////////////
        /// MAP FIELDS ///
        //////////////////

        //-->> Here code to map fields 

        ////////////////
        /// MAP BODY ///
        ////////////////

        //-->> here code to map row

        /////////////////////////////
        /// GRID COMPONENT RETURN ///
        /////////////////////////////
        return(
          <section id="appContent" className="gridContent">

              {/* SPECIFICATIONS */}
              <div className="specificationContent">
                <span className="badge bg-primary">SPECIFICATIONS</span>
                {specGrid}
              </div>

              {/* CALL REACT DATA SHEET COMPONENT */}
                <span className="badge bg-success">RESULTS</span>

              {/* 
                  ------------------------------------------------------------------------------------
                  WORK FROM HERE 
                  ------------------------------------------------------------------------------------
              */}

              <table>
                <thead>
                  <tr>
                    <th>fields 1</th>
                    <th>fields 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>The table body</td>
                    <td>with two columns</td>
                  </tr>
                </tbody>
              </table>

          </section>
        )
    }
}
export default Grid