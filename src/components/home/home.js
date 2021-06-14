import React from 'react'

// const initItems = [
//     {id: 1, name: "item 01"},
//     {id: 2, name: "item 02"},
//     {id: 3, name: "item 03"},
//     {id: 4, name: "item 04"},
// ]




// //////////////////////
// /// HOME COMPONENT ///
// ////////////////////// 
// class ItemForm extends React.Component{

//     /////////////////////////
//     /// INITIAL STATEMENT ///
//     /////////////////////////
//     constructor(props) {
//         super(props);
//         this.state={
            
//         }

//     }

//     handleSubmit(e){
//         e.preventDefault();
//         this.props.onSubmitForm(e.target.name.value)
//     }

//     /////////////////////////////
//     /// HOME COMPONENT RENDER ///
//     /////////////////////////////
//     render(){


//         /////////////////////////////
//         /// HOME COMPONENT RETURN ///
//         /////////////////////////////
//         return(
//             <form onSubmit={(e) => this.handleSubmit(e)}>
//                 <label>
//                     Nom :
//                     <input type="text" name="name" />
//                 </label>
//                 <input type="submit" value="Envoyer" />
//             </form>
//         )
//     }
// }


// ////////////////////// 
// class Item extends React.Component{

//     constructor(props) {
//         super(props);
//         this.state={
//             name : this.props.item.name,
//             displayInput: false,
//         }
//     }

//     handleDelete(e, id, ){
//         e.preventDefault();
//         this.props.deleteItem(id);
//     }

//     handleChange(e){
//         e.preventDefault()
//         this.setState({name:e.target.value})
//     }

//     handleInput(e){
//         e.preventDefault()
//         this.setState({displayInput:!this.state.displayInput})
//     }

//     handleSubmit(e, id){
//         e.preventDefault()
//         this.props.updateItem(id, e.target.value);
//     }


//     /////////////////////////////
//     /// HOME COMPONENT RENDER ///
//     /////////////////////////////
//     render(){

//         const {item} = this.props;

//         /////////////////////////////
//         /// HOME COMPONENT RETURN ///
//         /////////////////////////////
//         return(
//             <li 
//             key={item.id} 
//             onDoubleClick={(e) => this.handleInput(e)} 
//             >
//                 {this.state.displayInput ?
//                     <input 
//                         onChange={(e) => this.handleChange(e)} 
//                         value={this.state.name}
//                         onBlur={(e) => this.handleSubmit(e,item.id)}
//                     />
//                 :
//                     <React.Fragment>
//                         {item.name} , id: {item.id}
//                     </React.Fragment>
//                 }
//                 <button onClick={(e) => this.handleDelete(e, item.id)}>Delete</button>
//             </li>
//         )
//     }
// }

// function ItemsList ({items, deleteItem, updateItem}) {

//     return(
//         <ul>
//             {items.map(item => {
//                 return (
//                    <Item 
//                     key={"item-" + item.id}
//                     item={item}
//                     deleteItem={deleteItem}
//                     updateItem={updateItem}
//                    />
//                 )
//             })}
//         </ul>
//     )

// }

//////////////////////
/// HOME COMPONENT ///
////////////////////// 
class Home extends React.Component{

    /////////////////////////
    /// INITIAL STATEMENT ///
    /////////////////////////
    // constructor(props) {
    //     super(props);
    //     this.state={
    //         items : initItems,
    //     }
    //     this.onSubmitForm = this.onSubmitForm.bind(this);
    //     this.deleteItem = this.deleteItem.bind(this);
    //     this.updateItem = this.updateItem.bind(this);
    // }

    // onSubmitForm(name){
    //     var uniqueId = new Date();
    //     var newItem ={
    //         id: uniqueId.getTime() ,
    //         name: name,
    //     }
    //     var items = [...this.state.items, newItem]
    //     this.setState({items: items})
    // }

    // deleteItem(id){
    //     var itemIndex = this.state.items.findIndex(item => item.id === id);
    //     var items = [...this.state.items];
    //     items.splice(itemIndex, 1)
    //     this.setState({items: items})
    // }

    // updateItem(id, name){
    //     var itemIndex = this.state.items.findIndex(item => item.id === id);
    //     var items = [...this.state.items];
    //     items[itemIndex].name = name;
    //     this.setState({items: items})
    // }

    /////////////////////////////
    /// HOME COMPONENT RENDER ///
    /////////////////////////////
    render(){


        /////////////////////////////
        /// HOME COMPONENT RETURN ///
        /////////////////////////////
        return(
            <section id="appContent" className="homeContent">
                    {/* <ItemForm 
                        onSubmitForm={this.onSubmitForm}
                    />
                    <ItemsList 
                        items={this.state.items}
                        deleteItem={this.deleteItem}
                        updateItem={this.updateItem}
                    /> */}

            </section>
        )
    }
}
export default Home