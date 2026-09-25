import React,{useState}from"react";
import{ChevronLeft,ChevronRight,Plus,Trash2}from"lucide-react";

const KEY="makOS.calendar.v2";

function dateKey(d){
  return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
}

export default function Calendar(){
  const now=new Date();
  const[month,setMonth]=useState(new Date(now.getFullYear(),now.getMonth(),1));
  const[selected,setSelected]=useState(now.getDate());
  const[events,setEvents]=useState(()=>{
    try{return JSON.parse(localStorage.getItem(KEY))||{}}
    catch{return{}}
  });

  const days=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
  const start=new Date(month.getFullYear(),month.getMonth(),1).getDay();
  const safeSelected=Math.min(selected,days);
  const sel=new Date(month.getFullYear(),month.getMonth(),safeSelected);
  const k=dateKey(sel);

  const changeMonth=offset=>{
    const next=new Date(month.getFullYear(),month.getMonth()+offset,1);
    setMonth(next);
    setSelected(Math.min(safeSelected,new Date(next.getFullYear(),next.getMonth()+1,0).getDate()));
  };

  const updateEvents=n=>{
    setEvents(n);
    localStorage.setItem(KEY,JSON.stringify(n));
  };

  const add=()=>{
    const title=window.prompt("Event title");
    if(!title?.trim())return;
    updateEvents({...events,[k]:[...(events[k]||[]),title.trim()]});
  };

  const del=()=>{
    if(!events[k]?.length)return;
    const next=[...events[k]];
    next.pop();
    const n={...events};
    if(next.length)n[k]=next;
    else delete n[k];
    updateEvents(n);
  };

  return <div className="calendar">
    <div className="calHead">
      <button onClick={()=>changeMonth(-1)}><ChevronLeft/></button>
      <h1>{month.toLocaleString([],{month:"long",year:"numeric"})}</h1>
      <button onClick={()=>changeMonth(1)}><ChevronRight/></button>
      <button onClick={()=>{setMonth(new Date(now.getFullYear(),now.getMonth(),1));setSelected(now.getDate())}}>Today</button>
    </div>
    <div className="week">
      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(x=><b key={x}>{x}</b>)}
      {Array.from({length:start},(_,i)=><span className="muted" key={"e"+i}/>)}
      {Array.from({length:days},(_,i)=>{
        const d=i+1;
        const dd=new Date(month.getFullYear(),month.getMonth(),d);
        return <button className={d===safeSelected?"day selected":"day"} key={d} onClick={()=>setSelected(d)}>{d}{events[dateKey(dd)]?.length?<i/>:null}</button>;
      })}
    </div>
    <div className="calEvents">
      <b>{sel.toLocaleDateString([], {weekday:"long",day:"numeric",month:"long"})}</b>
      {(events[k]||[]).map((e,i)=><div key={i}>{e}</div>)}
      <button onClick={add}><Plus/> Add event</button>
      <button onClick={del} disabled={!events[k]?.length}><Trash2/></button>
    </div>
  </div>;
}
