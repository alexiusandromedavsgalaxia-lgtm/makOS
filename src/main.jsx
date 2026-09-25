import React,{useEffect,useState}from"react";
import{createRoot}from"react-dom/client";
import{Apple,Search,Wifi,Volume2,BatteryFull,Folder,HardDrive,Trash2,Grid2X2,Settings,Globe,Terminal as TerminalIcon,Plus,Monitor,CalendarDays,StickyNote,Music2,Image as ImageIcon,Calculator,ChevronLeft,ChevronRight,Minimize2,Maximize2,X}from"lucide-react";
import"./styles.css";
import Finder from"./apps/Finder.jsx";import Safari from"./apps/Safari.jsx";import Terminal from"./apps/Terminal.jsx";import SettingsApp from"./apps/Settings.jsx";import Calendar from"./apps/Calendar.jsx";import Notes from"./apps/Notes.jsx";import Calc from"./apps/Calculator.jsx";import Music from"./apps/Music.jsx";import Photos from"./apps/Photos.jsx";import System from"./apps/System.jsx";import{APPS,Icon}from"./apps/catalog.js";import{BOOT_STAGES,BOOT_LABELS}from"./system/boot.js";

function useClock(){const[d,setD]=useState(new Date());useEffect(()=>{const t=setInterval(()=>setD(new Date()),1000);return()=>clearInterval(t)},[]);return d}
function App(){
 const date=useClock(),[boot,setBoot]=useState(true),[windows,setWindows]=useState([]),[active,setActive]=useState(null),[spot,setSpot]=useState(false),[launch,setLaunch]=useState(false),[dark,setDark]=useState(true),[context,setContext]=useState(null);
 useEffect(()=>{const t=setTimeout(()=>setBoot(false),1800);return()=>clearTimeout(t)},[]);
 useEffect(()=>{const close=()=>setContext(null);window.addEventListener("click",close);return()=>window.removeEventListener("click",close)},[]);
 if(boot)return <BootScreen/>;
 const open=a=>{setWindows(w=>w.includes(a)?w:[...w,a]);setActive(a);setLaunch(false);setContext(null)};
 const close=a=>setWindows(w=>w.filter(x=>x!==a));
 const toggle=a=>windows.includes(a)?setActive(a):open(a);
 const apps=Object.keys(APPS).filter(x=>x!=="System");
 const desktop=[["Macintosh HD","Finder",HardDrive],["Applications","Finder",Folder],["Downloads","Finder",Folder],["dumbNavigator","Safari",Globe]];
 return <div className={"os "+(dark?"dark":"light")} onContextMenu={e=>{e.preventDefault();setContext({x:e.clientX,y:e.clientY})}}>
  <header className="menubar"><div className="menuLeft"><button onClick={()=>open("System")}><Apple size={18} fill="currentColor"/></button><b>makOS</b><span>File</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span></div><div className="menuRight"><button onClick={()=>setSpot(true)}><Search size={16}/></button><Wifi size={16}/><Volume2 size={16}/><BatteryFull size={18}/><span>{date.toLocaleDateString([],{weekday:"short",month:"short",day:"numeric"})}</span><b>{date.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</b></div></header>
  <main className="desktop" onDoubleClick={()=>setContext(null)}>
   <div className="desktopGlow"/><div className="desktopBrand"><div className="brandOrb">M</div><strong>makOS</strong><small>Tahoe edition</small></div>
   <div className="desktopIcons">{desktop.map(([label,app,I])=><button key={label} onDoubleClick={()=>open(app)}><span className="desktopFileIcon"><I size={29}/></span><span>{label}</span></button>)}</div>
   <div className="desktopWidgets"><div><b>{date.toLocaleDateString([],{weekday:"long"})}</b><strong>{date.getDate()}</strong><span>{date.toLocaleDateString([],{month:"long",year:"numeric"})}</span></div><div><span>makOS</span><b>Everything is ready.</b><small>Local apps · makFS · makKernel</small></div></div>
   {windows.map((app,i)=><Window key={app} app={app} index={i} active={active===app} onFocus={()=>setActive(app)} onClose={()=>close(app)} dark={dark} setDark={setDark}/>)}
  </main>
  {context&&<div className="desktopContext" style={{left:context.x,top:context.y}} onClick={e=>e.stopPropagation()}><button onClick={()=>open("Finder")}>New Finder window</button><button onClick={()=>setSpot(true)}>Search with Spotlight</button><button onClick={()=>open("Settings")}>Desktop Settings</button><button onClick={()=>location.reload()}>Refresh Desktop</button></div>}
  <Dock apps={apps} windows={windows} active={active} open={toggle} launch={()=>setLaunch(v=>!v)} trash={()=>open("Finder")}/>
  {spot&&<Spotlight apps={apps} onClose={()=>setSpot(false)} open={open}/>}
  {launch&&<Launchpad apps={apps} open={open} onClose={()=>setLaunch(false)}/>}
 </div>
}
function Window({app,index,active,onFocus,onClose,dark,setDark}){const[max,setMax]=useState(false);return <section className={"window "+(active?"focused ":"")+(max?"maximized":"")} style={max?{}:{left:(6+index*3)+"%",top:(8+index*2)+"%"}} onMouseDown={onFocus}><div className="titlebar"><div className="traffic"><button className="red" onClick={onClose}><X size={10}/></button><button className="yellow" onClick={()=>setMax(false)}><Minimize2 size={9}/></button><button className="green" onClick={()=>setMax(v=>!v)}><Maximize2 size={9}/></button></div><strong>{app}</strong><span/></div><div className="windowBody">{app==="Finder"?<Finder/>:app==="Safari"?<Safari/>:app==="Terminal"?<Terminal/>:app==="Settings"?<SettingsApp dark={dark} setDark={setDark}/>:app==="Calendar"?<Calendar/>:app==="Notes"?<Notes/>:app==="Calculator"?<Calc/>:app==="Music"?<Music/>:app==="Photos"?<Photos/>:<System/>}</div></section>}
function Dock({apps,windows,active,open,launch,trash}){return <nav className="dock">{apps.map(x=><button key={x} className={active===x?"dockActive":""} onClick={()=>open(x)} title={x}><Icon name={x} size={25}/>{windows.includes(x)&&<i/>}</button>)}<span className="dockSep"/><button onClick={launch} title="Launchpad"><Grid2X2 size={25}/></button><button onClick={trash} title="Finder"><Trash2 size={25}/></button></nav>}
function Spotlight({apps,onClose,open}){const[q,setQ]=useState("");return <div className="overlay" onClick={onClose}><div className="spotlight" onClick={e=>e.stopPropagation()}><div className="spotInput"><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search makOS"/></div>{apps.filter(x=>x.toLowerCase().includes(q.toLowerCase())).map(x=><button key={x} onClick={()=>{open(x);onClose()}}><Icon name={x} size={24}/><span>{x}</span></button>)}</div></div>}
function Launchpad({apps,open,onClose}){return <div className="overlay launchOverlay" onClick={onClose}><div className="launchpad" onClick={e=>e.stopPropagation()}><div className="launchGrid">{apps.map(x=><button key={x} onClick={()=>{open(x);onClose()}}><Icon name={x} size={42}/><b>{x}</b></button>)}</div></div></div>}
function BootScreen(){const[stage,setStage]=useState(0);useEffect(()=>{const t=setInterval(()=>setStage(s=>Math.min(s+1,BOOT_STAGES.length-1)),360);return()=>clearInterval(t)},[]);return <div className="bootScreen"><div className="bootLogo">M</div><h1>makOS</h1><p>{BOOT_LABELS[BOOT_STAGES[stage]]}</p><div className="bootTrack"><i style={{width:((stage+1)/BOOT_STAGES.length)*100+"%"}}/></div><small>{BOOT_STAGES[stage]} · {stage+1}/{BOOT_STAGES.length}</small></div>}
createRoot(document.getElementById("root")).render(<App/>);