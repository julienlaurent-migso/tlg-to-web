////////////////////////////////////////////////////////////////////////
// APPLICATION SET /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

//APP STANDARD
export const APP_STANDARDS ={ 
    roadmapZoomIncrement : 0.25,
    roadmapHeaderLineHeight:32,
    roadmapViewerHeight:25,
    roadmapViewerWidth: 80,
    roadmapContextMenuGroupHeight:165,
    roadmapContextMenuItemHeight:232,
    roadmapGroupWidth : 200,
    roadmapMinMonthWidth : 6,
    roadmapMaxMonthWidth : 1500,
    roadmapInitMonthWidth : 50,
    roadmapMinDisplayQuater : 10,
    roadmapMinDisplayMonth : 19,
    roadmapMinDisplayWeek : 160,
    roadmapMinDisplayDay : 550,
    roadmapItemSpace : 20,
    roadmapInitHeight : 300,
    itemTaskBackground : "#ffff00",
    itemTaskColorIcon : "#e55563",
    itemTaskColorTxt : "#333333",
    itemTaskBorder : true,
    itemTaskBorderRadius : true,
    itemBorderColor : "#333333",
    itemMilestoneColorIcon : "#333333",
    itemMilestoneColorTxt : "#333333",
};

//CAN BE SET BY USER
export const APP_USER_SETTINGS ={
    roadmapItemSpaceLine: 6,
    roadmapItemHeight : 25,
    roadmapItemFontSize : 14,
}

//HEADER SETTINGS
export const APP_ROADMAP_HEADER_SETTINGS={
    isRoadmapQuaters:false,
    isRoadmapMonths:true,
    isRoadmapWeeks:false,
    isRoadmapDays:false,
}

//APP STATE 
export const APP_INIT_SETTINGS={
    actionModal:null,
    isOnEditMode:false,
    isLinksDisplayed:false,
    roadmapMonthWidth:50,
    roadmapNewItemOption:null,
}

//APP PERIOD
export const APP_ROADMAP_PERIOD={
    roadmapFirstPeriod:null,
    roadmapFirstYear:2020,
    roadmapLastPeriod:null,
    roadmapLastYear:2022,
}

//ACTIONS
export const APP_INIT_ACTIONS={
    isItemsSelected:false,
    isItemsCopied:false,
}

//TXT
export const APP_TXT_START_TLG_ID = "TLG";
export const APP_TXT_TBD = "To Be Defined";

//LOGO
export const APP_LOGO ={
    icon:"flag",
    iconAbr:"TLG",
    iconColor:"#FFFFFF",
    iconBgColor:"#007BFF",
    logoTxt:"Time Line Generator",
}

//NAVIGATION
export const APP_NAV = [
    {
        id:"import",
        name:"Import",
        icon:"cloud_download",
        url:"/import"
    },
    {
        id:"grid",
        name:"Grid",
        icon:"auto_awesome_mosaic",
        url:"/grid"
    },
 
    {
        id:"roadmap",
        name:"Roadmap",
        icon:"category",
        url:"/roadmap"
    },
    {
        id:"settings",
        name:"Settings",
        icon:"settings",
        url:"/settings"
    },

];

//MONTH NAME
export const APP_MONTH_NAMES = {
    small:["01","02","03","04","05","06","07","08","09","10","11","12"],
    medium:["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    big:["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"]
};

//TYPE
export const APP_ITEM_TYPES={
    consoTask: "Consolidated Task",
    task: "Task",
    milestone: "Milestone",
    input: "Input",
    output: "Output",
}

//TYPE ENRICH
export const APP_ITEM_TYPES_ENRICH=[
    {type: "Consolidated Task", icon:"lens"},
    {type: "Task", icon:"lens"},
    {type: "Milestone", icon:"play_arrow", rotate:"270deg"},
    {type: "Input", icon:"forward", rotate : "90deg"},
    {type: "Output", icon:"forward", rotate: "270deg"},
    {type: "Target", icon:"grade"},
];

////////////////////
/// CONTEXT MENU ///
////////////////////

//ROADMAP GROUP
export const CONTEXT_MENU_ROADMAP_GROUP=[
    {sort:1, name: "Paste", icon: "content_paste", parameter:"roadmapGroupPaste"},
    {sort:2, name: "Move here", icon: "download", parameter:"roadmapGroupMove"},
    {sort:3, name: "Add Item", icon: "add", parameter:"roadmapGroupOpenAddModal"},
    {sort:4, name: "separator"},
    {sort:5, name: "Edit Color", icon: "palette", parameter:"roadmapGroupEditColor"},
    {sort:6, name: "Manage Settings", icon: "settings", parameter:"roadmapGroupSettings"},
];

//ROADMAP ITEM
export const CONTEXT_MENU_ROADMAP_ITEM=[
    {sort:1, name: "Copy", icon: "content_copy", parameter:"roadmapItemCopy"},
    {sort:2, name: "Edit Color", icon: "palette", parameter:"roadmapItemOpenColorModal"},
    {sort:3, name: "separator"},
    {sort:4, name: "Manage options", icon: "link", parameter:"roadmapItemOptions"},
    {sort:5, name: "Manage Links", icon: "create", parameter:"roadmapItemLinks"},
    {sort:6, name: "separator"},
    {sort:7, name: "Delete item(s)", icon: "delete", parameter:"roadmapItemDelete"},
];

//ROADMAP HEADER
export const CONTEXT_MENU_ROADMAP_HEADER=[
    {sort:3, name: "Quaters", icon: "visibility", parameter:"isRoadmapQuaters"},
    {sort:4, name: "Months", icon: "visibility", parameter:"isRoadmapMonths"},
    {sort:5, name: "Weeks", icon: "visibility", parameter:"isRoadmapWeeks"},
    {sort:6, name: "Days", icon: "visibility", parameter:"isRoadmapDays"},
];
