import React from "react";

function Item(props){
    return (<div><li><p style={{marginRight:"10px",display:"inline"}}>{props.item}</p><button><i class="fa-sharp fa-solid fa-trash" onClick={()=>{props.delitem(props.index,props.item)}} /></button></li></div>)
};

export default Item;