import React from 'react'

/////////////////////////////////////////////////////////////////////////////////
/// UPDATER /////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

export class UpdaterWithInput extends React.PureComponent{

    //Contructor
    constructor(props) {
      super(props);
      this.state={
        inputText : this.props.item.name,
        displayInput : false,
      }
    }
  
    //Display Input
    toggleDisplay(e) {
      e.preventDefault();
      e.stopPropagation();
      this.setState(prevState => ({displayInput: !prevState.displayInput}));
    }
  
    //Handle Chane 
    handleChange(e){
      e.preventDefault(); 
      e.stopPropagation();
      this.setState({inputText: this.newText.value});
    }
  
    //update TO SOURCE
    sendToUpdateSource(e, id){
      e.preventDefault();
      e.stopPropagation();
      this.setState(prevState => ({displayInput: !prevState.displayInput}));

      //TEST SI DIFF DU PROPS
      if(this.state.inputText !== this.props.item.name){

        //SEND TO ROADMAP DATA
        var options={
          id: id,
          isTask: this.props.isTask,
          newTxt: this.state.inputText,
        }

        //SEND TO APP FUNCTION
        this.props.launchAppFunctions(e, "roadmapItemUpdateTxt", options)
      }
    }

    //CLICK TO SELECT
    handleClick(e,id,action){

      //INIT
      e.preventDefault();
      e.stopPropagation();

      //SI CTRL PRESS ALORS ON EST SUR QUE PAS DE DOUBLE CLICK
      var setTime = e.ctrlKey ? 0 : 300;

      //TEST IF WEE NEED TO DIRE 1 click 
      setTimeout(() => {
          if(!this.state.displayInput){

            //INIT
            var value = "select";
            if(action){value = null}

            //OPTIONS
            var options={
              id:id,
              object:{action:value},
              option:{type:"select", isCtrlPressed: e.ctrlKey}
            }

            //PASS TO APP FUNCTIONS
            this.props.launchAppFunctions(e,"roadmapItemSelect",options)

          }
      }, setTime);
    }
  
    //////////////
    /// RENDER ///
    //////////////
    render(){

      //GET PROPS
      //PROPS
      const {
        isOnEditMode, 
        item, 
        inputName,
        inputType,
    } = this.props;

      //Selection du type
      const displayedInput = (type) =>{
  
        //SWITCH TYPE
        var inputBox = [];
        switch (type) {

          //TEXTAREA 
          case 'textarea':
            inputBox =  
            <textarea 
              rows="4"
              className="updaterInput flex-fill" 
              name={inputName} 
              id={item.id} 
              autoFocus 
              value={this.state.inputText} 
              ref={input => this.newText = input}
              onChange={(e) => this.handleChange(e)}
              onBlur={(e) => this.sendToUpdateSource(e, item.id)}
            />
            break;
  
          //INPUT 
          case 'input':
            inputBox =  
            <input 
              type="text"
              className="updaterInput flex-fill" 
              name={inputName} 
              id={item.id} 
              autoFocus 
              value={this.state.inputText} 
              ref={input => this.newText = input}
              onChange={(e) => this.handleChange(e)}
              onBlur={(e) => this.sendToUpdateSource(e, item.id)}
            />
            break;


          //BUG
          default:
            inputBox = [];
        }
  
        //return
        return inputBox
  
      }

      //Return
      return(
        <React.Fragment>
          {
          isOnEditMode ?
            this.state.displayInput ? 
              displayedInput(inputType)
            :
              <div 
                onMouseDown={(e) => e.stopPropagation()}
                onDoubleClick={(e) => this.toggleDisplay(e)} 
                onClick={(e) => this.handleClick(e, item.id, item.action)}
                className= "roadmapItemsContent flex-fill" 
              >
                {this.state.inputText}
              </div>
          :
            <div 
              className="roadmapItemsContent flex-fill" 
            >
                  {this.state.inputText}
            </div>
          } 
        </React.Fragment>
  
      )
  
    }
  
  }