//////////////////////////////////////////////////////////////////////
/// SELECTOR //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

//INIT
export const SELECTOR_INIT = {
    display:false,
    left:0,
    top:0,
    width:0,
    height:0,
    initX:0,
    initY:0,
    parentX:0,
    parentY:0,
    scrollLeft:0,
    scrollTop:0,
} 

//SELECTOR START
export const FUNC_SELECTOR_START = (state, mouseX, mouseY) => {

    //INIT
    var newState = state;
    const appContent = document.getElementById("appContent")
    const appContentBlock = appContent.getBoundingClientRect();

    //NEW VALUE
    newState.display = true;
    newState.initX = mouseX - appContentBlock.left;
    newState.initY = mouseY - appContentBlock.top;
    newState.left = mouseX - appContentBlock.left + appContent.scrollLeft;
    newState.top = mouseY - appContentBlock.top + appContent.scrollTop;
    newState.parentX = appContentBlock.left;
    newState.parentY = appContentBlock.top;
    newState.scrollLeft = appContent.scrollLeft;
    newState.scrollTop = appContent.scrollTop;

    //RETURN
    return newState

}

//MOUSE MOVE
export const FUNC_SELECTOR_MOVE = (state, mouseX, mouseY) =>{

    //INIT
    const {
        initX, 
        initY, 
        parentX, 
        parentY, 
        scrollLeft, 
        scrollTop, 
    } = state
    const clientX = mouseX - parentX;
    const clientY = mouseY - parentY;
    var newState = state;

    //CASE > initX && > initY
    if (clientX >= initX && clientY >= initY){
        newState.width = clientX - initX;
        newState.height = clientY - initY;
    }

    //CASE < initX && < initY
    if (clientX < initX && clientY < initY){
        newState.width = initX - clientX ;
        newState.height = initY - clientY ;
        newState.left = clientX + scrollLeft ;
        newState.top = clientY + scrollTop;
    }

    //CASE < initX && > initY
    if (clientX < initX && clientY >= initY){
        newState.width = initX - clientX ;
        newState.height = clientY - initY;
        newState.left = clientX + scrollLeft;
    }

    //CASE < initX && > initY
    if (clientX >= initX && clientY < initY){
        newState.width = clientX - initX ;
        newState.height = initY - clientY ;
        newState.top = clientY + scrollTop;
    }

    //RETURN
    return newState;

}

//FIND ITEM INTERSECTION
export const FUNC_SELECTOR_FIND_INTERSECTE = (itemList, selectionRect, roadmapItemHeight) => {

    //DEEP CLONE
    var findItem = JSON.parse(JSON.stringify(itemList))
  
    //FILTER RELATED TO INTERSECTE
    findItem = findItem.filter(
      item => 
        ((item.cumuTop + roadmapItemHeight) > selectionRect.selectionTop)
        && (item.cumuTop < (selectionRect.selectionTop + selectionRect.selectionHeight))
        && ((item.left + item.width) > (selectionRect.selectionLeft ))
        && (item.left < (selectionRect.selectionLeft  + selectionRect.selectionWidth))
    )
  
    //CREATION ID LIST
    var idList = findItem.map(item => item.id)
    return idList
  
  }
