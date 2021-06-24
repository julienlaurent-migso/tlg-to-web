import React, {useState, useEffect} from 'react'
import { DataStore } from '@aws-amplify/datastore';
import { TEMPLATE, GRID } from '../../models';
import { Auth } from 'aws-amplify'

//////////////////////
/// HOME COMPONENT ///
////////////////////// 
function Home (){


    const [template, setTemplate] = useState();
    const [grid, setGrid] = useState(
        [
        {
            "group": "deuxieme test",
            "level": "Lorem ipsum dolor sit amet",
            "type": "Lorem ipsum dolor sit amet",
            "displayedId": "Lorem ipsum dolor sit amet",
            "globalUniqueId": "Lorem ipsum dolor sit amet",
            "description": "Lorem ipsum dolor sit amet",
            "label": "Lorem ipsum dolor sit amet",
            "status": "Lorem ipsum dolor sit amet",
            "baselineFinish": "1970-01-01T12:30:23.999Z",
            "baselineStart": "1970-01-01T12:30:23.999Z",
            "finish": "1970-01-01T12:30:23.999Z",
            "start": "1970-01-01T12:30:23.999Z",
            "templateID": "d3cfba2d-e584-492f-942b-35537abecd3c"
        },
        {
            "group": "troisieme test",
            "level": "Lorem ipsum dolor sit amet",
            "type": "Lorem ipsum dolor sit amet",
            "displayedId": "Lorem ipsum dolor sit amet",
            "globalUniqueId": "Lorem ipsum dolor sit amet",
            "description": "Lorem ipsum dolor sit amet",
            "label": "Lorem ipsum dolor sit amet",
            "status": "Lorem ipsum dolor sit amet",
            "baselineFinish": "1970-01-01T12:30:23.999Z",
            "baselineStart": "1970-01-01T12:30:23.999Z",
            "finish": "1970-01-01T12:30:23.999Z",
            "start": "1970-01-01T12:30:23.999Z",
            "templateID": "d3cfba2d-e584-492f-942b-35537abecd3c"
        }
    ]
)


    //SET TEMPLATE WITH PROMISE
    const setPromiseTemplate = () => {
        loadTemplate().then(result => setTemplate(result));
    }

    //LOAD ALL TEMPLATE
    const loadTemplate = () =>{
        return DataStore.query(TEMPLATE);
        
    }

    //CREATE NEW TEMPLATE
    const createTemplate = () =>{
       DataStore.save(
            new TEMPLATE({
                "name": "First Test",
                "description": "Lorem ipsum dolor sit amet",
                "public": true,
                "lastUpdateBy": "Lorem ipsum dolor sit amet",
                "lastUpdateDate": "1970-01-01T12:30:23.999Z",
                "GRIDS": []
            })
        );
    }

    //CREATE NEW TEMPLATE
    const queryCreateGrid = (gridLine) =>{
        DataStore.save(
            new GRID(gridLine)
        );
    }

    //CREATE MULTIPLE 
    const createGrid = () =>{

        for (let i = 0 ; i < grid.length ; i++){
            queryCreateGrid(grid[i])
        }

    }

    useEffect(() => {
        const subscription = DataStore.observe(GRID).subscribe((msg) => {
          console.log(msg.model, msg.opType, msg.element);
        });
    
        return () => subscription.unsubscribe();
      }, []);
      

    console.log(Auth.currentUserInfo())

    console.log(template)

    /////////////////////////////
    /// HOME COMPONENT RETURN ///
    /////////////////////////////
    return(
        <section id="appContent" className="homeContent">



            <input type="button" value="Load Template" onClick={setPromiseTemplate} />

            <br/>
            <br/>
            <br/>

            <input type="button" value="Create Template" onClick={createTemplate} />

            <br/>
            <br/>
            <br/>

            <input type="button" value="Create Grid" onClick={createGrid} />




        </section>
    )
}
export default Home