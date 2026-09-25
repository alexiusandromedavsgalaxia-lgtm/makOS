import React,{useEffect,useMemo,useRef,useState}from"react";
import{createRoot}from"react-dom/client";
import{Apple,Search,Wifi,Volume2,BatteryFull,Folder,HardDrive,Trash2,Grid2X2,Settings,Globe,Terminal as TerminalIcon,Monitor,CalendarDays,StickyNote,Music2,Image as ImageIcon,Calculator,ChevronLeft,ChevronRight,Minimize2,Maximize2,X,Wrench,Bell,SlidersHorizontal,Power,Sun,Moon,Command,RotateCcw}from"lucide-react";
import"./styles.css";
import Finder from"./apps/Finder.jsx";import Safari from"./apps/Safari.jsx";import Terminal from"./apps/Terminal.jsx";import SettingsApp from"./apps/Settings.jsx";import Calendar from"./apps/Calendar.jsx";import Notes from"./apps/Notes.jsx";import Calc from"./apps/Calculator.jsx";import Music from"./apps/Music.jsx";import Photos from"./apps/Photos.jsx";import System from"./apps/System.jsx";import PartsService from"./apps/PartsService.jsx";import{APPS,Icon}from"./apps/catalog.js";import{BOOT_STAGES,BOOT_LABELS}from"./system/boot.js";

function useClock(){const[d,setD]=useState(new Date());useEffect(()=>{const t=setInterval(()=>setD(new Date()),1000);return()=>clearInterval(t)},[]);return d}
const APP_SIZES={Finder:{w:920,h:650},Safari:{w:980,h:680},Terminal:{w:820,h:560},Settings:{w:900,h:620},Calendar:{w:820,h:650},Notes:{w:900,h:650},Calculator:{w:720,h:560},Music:{w:900,h:620},Photos:{w:900,h:650},System:{w:850,h:620},PartsService:{w:980,h:680}};
function App(){
 const date=useClock(),[boot,setBoot]=useState(true),[windows,setWindows]=useState([]),[active,setActive]=useState(null),[spot,setSpot]=useState(false),[launch,setLaunch]=useState(false),[control,setControl]=useState(false),[notice,setNotice]=useState(false),[dark,setDark]=useState(true),[context,setContext]=useState(null),[menu,setMenu]=useState(null),[space,setSpace]=useState(1);
 const nextZ=useRef(20);
 useEffect(()=>{const t=setTimeout(()=>setBoot(false),1800);return()=>clearTimeout(t)},[]);
 useEffect(()=>{const handler=e=>{if(e.key==="Escape"){setSpot(false);setLaunch(false);setControl(false);setNotice(false);setMenu(null);setContext(null)}const mod=e.metaKey||e.ctrlKey;if(mod&&e.code==="Space"){e.preventDefault();setSpot(v=>!v)}if(mod&&e.key.toLowerCase()==="w"){e.preventDefault();if(active)setWindows(ws=>ws.filter(x=>x.id!==active))}if(mod&&e.key.toLowerCase()==="m"){e.preventDefault();if(active)setWindows(ws=>ws.map(x=>x.id===active?{...x,minimized:true}:x))}};window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler)},[active]);
 const open=app=>{setWindows(ws=>{const found=ws.find(x=>x.app===app);if(found){nextZ.current+=1;return ws.map(x=>x.id===found.id?{...x,minimized:false,z:nextZ.current}:x)}nextZ.current+=1;const i=ws.length;const s=APP_SIZES[app]||{w:850,h:600};return[...ws,{id:crypto.randomUUID(),app,x:Math.min(8+i*3,45),y:Math.min(8+i*2,30),w:s.w,h:s.h,minimized:false,maximized:false,z:nextZ.current}]});setActive(app);setLaunch(false);setContext(null);setMenu(null)};
 const close=app=>{setWindows(ws=>ws.filter(x=>x.app!==app));setActive(a=>a===app?null:a)};
 const focus=app=>{nextZ.current+=1;setWindows(ws=>ws.map(x=>x.app===app?{...x,minimized:false,z:nextZ.current}:x));setActive(app)};
 const toggle=app=>{const w=windows.find(x=>x.app===app);if(!w||w.minimized)open(app);else focus(app)};
 const apps=Object.keys(APPS).filter(x=>x!=="System");
 const desktop=[["Macintosh HD","Finder",HardDrive],["Applications","Finder",Folder],["Downloads","Finder",Folder],["dumbNavigator","Safari",Globe],["Parts & Service","PartsService",Wrench]];
 if(boot)return <BootScreen/>;
 return <div className={"os "+(dark?"dark":"light")} onClick={()=>{setContext(null);setMenu(null)}} onContextMenu={e=>{e.preventDefault();setContext({x:e.clientX,y:e.clientY});setMenu(null)}}>
  <header className="menubar">
   <div className="menuLeft"><MenuButton icon onClick={()=>setMenu(menu==="apple"?null:"apple")}><Apple size={17} fill="currentColor"/></MenuButton><MenuButton label="makOS" onClick={()=>setMenu(menu==="mako"?null:"mako")}/><MenuButton label="File" onClick={()=>setMenu(menu==="file"?null:"file")}/><MenuButton label="Edit" onClick={()=>setMenu(menu==="edit"?null:"edit")}/><MenuButton label="View" onClick={()=>setMenu(menu==="view"?null:"view")}/><MenuButton label="Window" onClick={()=>setMenu(menu==="window"?null:"window")}/><MenuButton label="Help" onClick={()=>setMenu(menu==="help"?null:"help")}/></div>
   <div className="menuRight"><button title="Spotlight" onClick={e=>{e.stopPropagation();setSpot(true)}}><Search size={15}/></button><button title="Control Center" onClick={e=>{e.stopPropagation();setControl(v=>!v);setNotice(false)}}><SlidersHorizontal size={15}/></button><button title="Notifications" onClick={e=>{e.stopPropagation();setNotice(v=>!v);setControl(false)}}><Bell size={15}/></button><Wifi size={15}/><Volume2 size={15}/><BatteryFull size={17}/><span>{date.toLocaleDateString([],{weekday:"short",month:"short",day:"numeric"})}</span><b>{date.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</b></div>
  </header>
  {menu&&<MenuBarMenu type={menu} close={()=>setMenu(null)} open={open} closeApp={()=>active&&close(active)} windows={windows} focus={focus} dark={dark} setDark={setDark}/>}
  {control&&<ControlCenter dark={dark} setDark={setDark} close={()=>setControl(false)} />}
  {notice&&<NotificationCenter close={()=>setNotice(false)} />}
  <main className="desktop" onDoubleClick={()=>setContext(null)}>
   <div className="desktopGlow"/>
   <div className="desktopBrand"><div className="brandOrb">M</div><strong>makOS</strong><small>Tahoe edition</small></div>
   <div className="desktopIcons">{desktop.map(([label,app,I])=><button key={label} onDoubleClick={()=>open(app)}><span className="desktopFileIcon"><I size={29}/></span><span>{label}</span></button>)}</div>
   <DesktopWidgets date={date}/>
   {windows.map(w=><Window key={w.id} data={w} active={active===w.app} onFocus={()=>focus(w.app)} onClose={()=>close(w.app)} update={patch=>setWindows(ws=>ws.map(x=>x.id===w.id?{...x,...patch}:x))} dark={dark} setDark={setDark}/>)}
  </main>
  {context&&<ContextMenu x={context.x} y={context.y} open={open} spotlight={()=>setSpot(true)} settings={()=>open("Settings")}/>}
  <TouchMouse/>
  <Dock apps={apps} windows={windows} active={active} open={toggle} launch={()=>setLaunch(v=>!v)} trash={()=>open("Finder")}/>
  {spot&&<Spotlight apps={apps} onClose={()=>setSpot(false)} open={open}/>}
  {launch&&<Launchpad apps={apps} open={open} onClose={()=>setLaunch(false)}/>}
  <div className="spaceSwitcher"><button className={space===1?"sel":""} onClick={()=>setSpace(1)}>1</button><button className={space===2?"sel":""} onClick={()=>setSpace(2)}>2</button></div>
 </div>
}
function MenuButton({label,icon,onClick}){return <button className={label==="makOS"?"menuTitle":""} onClick={e=>{e.stopPropagation();onClick?.()}}>{icon||label}</button>}
function MenuBarMenu({type,close,open,closeApp,windows,focus,dark,setDark}){const items={apple:[["About This Mac",()=>open("System")],["System Settings…",()=>open("Settings")],["Sleep",()=>{}],["Restart…",()=>location.reload()],["Shut Down…",()=>{}]],mako:[["About makOS",()=>open("System")],["System Settings…",()=>open("Settings")]],file:[["New Finder Window",()=>open("Finder")],["Open…",()=>open("Finder")],["Close Window",closeApp]],edit:[["Undo",()=>{}],["Cut",()=>{}],["Copy",()=>{}],["Paste",()=>{}]],view:[["Show All Windows",()=>windows.forEach(w=>focus(w.app))],["Enter Full Screen",()=>{}]],window:[["Minimize",()=>{}],["Bring All to Front",()=>windows.forEach(w=>focus(w.app))]],help:[["makOS Help",()=>open("Safari")],["Parts & Service",()=>open("PartsService")]]};return <div className="topMenu" onClick={e=>e.stopPropagation()}><div className="topMenuInner">{(items[type]||[]).map(([label,fn])=><button key={label} onClick={()=>{fn();close()}}>{label}<span/></button>)}</div></div>}
function DesktopWidgets({date}){return <div className="desktopWidgets"><div><b>{date.toLocaleDateString([],{weekday:"long"})}</b><strong>{date.getDate()}</strong><span>{date.toLocaleDateString([],{month:"long",year:"numeric"})}</span></div><div><span>makOS</span><b>Everything is ready.</b><small>Local apps · makFS · makKernel</small></div></div>}
function Window({data,active,onFocus,onClose,update,dark,setDark}){
 const ref=useRef(null),drag=useRef(null),resize=useRef(null);
 const startDrag=e=>{if(e.button!==0||data.maximized||e.target.closest("button"))return;drag.current={sx:e.clientX,sy:e.clientY,x:data.x,y:data.y};window.addEventListener("mousemove",moveDrag);window.addEventListener("mouseup",endDrag)};
 const moveDrag=e=>{if(!drag.current)return;update({x:Math.max(0,Math.min(100-data.w/window.innerWidth*100,drag.current.x+(e.clientX-drag.current.sx)/window.innerWidth*100)),y:Math.max(3,Math.min(100-data.h/window.innerHeight*100,drag.current.y+(e.clientY-drag.current.sy)/window.innerHeight*100))})};
 const endDrag=()=>{drag.current=null;window.removeEventListener("mousemove",moveDrag);window.removeEventListener("mouseup",endDrag)};
 const startResize=e=>{e.preventDefault();e.stopPropagation();resize.current={sx:e.clientX,sy:e.clientY,w:data.w,h:data.h};window.addEventListener("mousemove",moveResize);window.addEventListener("mouseup",endResize)};
 const moveResize=e=>{if(!resize.current)return;update({w:Math.max(560,Math.min(window.innerWidth-30,resize.current.w+e.clientX-resize.current.sx)),h:Math.max(360,Math.min(window.innerHeight-55,resize.current.h+e.clientY-resize.current.sy))})};
 const endResize=()=>{resize.current=null;window.removeEventListener("mousemove",moveResize);window.removeEventListener("mouseup",endResize)};
 if(data.minimized)return null;
 const body=data.app==="Finder"?<Finder/>:data.app==="Safari"?<Safari/>:data.app==="Terminal"?<Terminal/>:data.app==="Settings"?<SettingsApp dark={dark} setDark={setDark}/>:data.app==="Calendar"?<Calendar/>:data.app==="Notes"?<Notes/>:data.app==="Calculator"?<Calc/>:data.app==="Music"?<Music/>:data.app==="Photos"?<Photos/>:data.app==="PartsService"?<PartsService/>:<System/>;
 return <section ref={ref} className={"window "+(active?"focused ":"")+(data.maximized?"maximized":"")} style={data.maximized?{zIndex:data.z}:{left:data.x+"%",top:data.y+"%",width:data.w+"px",height:data.h+"px",zIndex:data.z}} onMouseDown={onFocus}>
  <div className="titlebar" onMouseDown={startDrag} onDoubleClick={()=>update({maximized:!data.maximized})}><div className="traffic"><button className="red" onMouseDown={e=>e.stopPropagation()} onClick={onClose}><X size={9}/></button><button className="yellow" onMouseDown={e=>e.stopPropagation()} onClick={()=>update({minimized:true})}><Minimize2 size={8}/></button><button className="green" onMouseDown={e=>e.stopPropagation()} onClick={()=>update({maximized:!data.maximized})}><Maximize2 size={8}/></button></div><strong>{data.app}</strong><span/></div>
  <div className="windowBody">{body}</div>{!data.maximized&&<div className="resizeHandle" onMouseDown={startResize}/>}
 </section>
}
function TouchMouse(){
 const[pos,setPos]=useState({x:-100,y:-100,visible:false,down:false});
 const timer=useRef(null);
 useEffect(()=>{
  const move=e=>{
   if(e.pointerType!=="touch")return;
   setPos({x:e.clientX+14,y:e.clientY+14,visible:true,down:false});
   clearTimeout(timer.current);
   timer.current=setTimeout(()=>setPos(p=>({...p,visible:false,down:false})),1400);
  };
  const down=e=>{if(e.pointerType!=="touch")return;setPos({x:e.clientX+14,y:e.clientY+14,visible:true,down:true});clearTimeout(timer.current)};
  const up=e=>{if(e.pointerType!=="touch")return;setPos(p=>({...p,x:e.clientX+14,y:e.clientY+14,down:false}));clearTimeout(timer.current);timer.current=setTimeout(()=>setPos(p=>({...p,visible:false,down:false})),900)};
  window.addEventListener("pointermove",move,{passive:true});window.addEventListener("pointerdown",down,{passive:true});window.addEventListener("pointerup",up,{passive:true});
  return()=>{window.removeEventListener("pointermove",move);window.removeEventListener("pointerdown",down);window.removeEventListener("pointerup",up);clearTimeout(timer.current)};
 },[]);
 return <div className={"touchMouse "+(pos.visible?"show ":"")+(pos.down?"pressed":"")} style={{left:pos.x,top:pos.y}} aria-hidden="true"><span className="touchMouseArrow"/><span className="touchMouseRing"/></div>
}
function Dock({apps,windows,active,open,launch,trash}){return <nav className="dock">{apps.map(x=><button key={x} className={active===x?"dockActive":""} onClick={()=>open(x)} title={x}><Icon name={x} size={25}/>{windows.some(w=>w.app===x)&&<i/>}</button>)}<span className="dockSep"/><button onClick={launch} title="Launchpad"><Grid2X2 size={25}/></button><button onClick={trash} title="Trash"><Trash2 size={25}/></button></nav>}
function Spotlight({apps,onClose,open}){const[q,setQ]=useState("");const results=useMemo(()=>apps.filter(x=>x.toLowerCase().includes(q.toLowerCase())),[apps,q]);return <div className="overlay" onClick={onClose}><div className="spotlight" onClick={e=>e.stopPropagation()}><div className="spotInput"><Search/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search makOS"/></div>{results.map(x=><button key={x} onClick={()=>{open(x);onClose()}}><Icon name={x} size={24}/><span>{x}</span></button>)}</div></div>}
function Launchpad({apps,open,onClose}){return <div className="overlay launchOverlay" onClick={onClose}><div className="launchpad" onClick={e=>e.stopPropagation()}><div className="launchGrid">{apps.map(x=><button key={x} onClick={()=>{open(x);onClose()}}><Icon name={x} size={42}/><b>{x}</b></button>)}</div></div></div>}
function ContextMenu({x,y,open,spotlight,settings}){return <div className="desktopContext" style={{left:x,top:y}} onClick={e=>e.stopPropagation()}><button onClick={()=>open("Finder")}>New Finder window</button><button onClick={spotlight}>Search with Spotlight</button><button onClick={settings}>Desktop Settings</button><button onClick={()=>location.reload()}>Refresh Desktop</button></div>}
function ControlCenter({dark,setDark,close}){return <div className="popover controlPopover" onClick={e=>e.stopPropagation()}><div className="popoverHead"><b>Control Center</b><button onClick={close}><X size={15}/></button></div><div className="controlGrid"><button><Wifi/><span>Wi-Fi</span><small>Connected</small></button><button><Volume2/><span>Sound</span><small>On</small></button><button onClick={()=>setDark(v=>!v)}>{dark?<Moon/>:<Sun/>}<span>Appearance</span><small>{dark?"Dark":"Light"}</small></button><button><BatteryFull/><span>Battery</span><small>100%</small></button></div><div className="controlSlider"><Sun size={15}/><input type="range" min="10" max="100" defaultValue="80"/></div></div>}
function NotificationCenter({close}){return <div className="popover noticePopover" onClick={e=>e.stopPropagation()}><div className="popoverHead"><b>Notification Center</b><button onClick={close}><X size={15}/></button></div><div className="notificationCard"><Bell size={18}/><div><b>makOS</b><span>Everything is ready.</span><small>Just now</small></div></div><div className="notificationCard"><Command size={18}/><div><b>Keyboard shortcuts</b><span>⌘ Space opens Spotlight.</span><small>System</small></div></div></div>}
function BootScreen(){const[stage,setStage]=useState(0);useEffect(()=>{const t=setInterval(()=>setStage(s=>Math.min(s+1,BOOT_STAGES.length-1)),360);return()=>clearInterval(t)},[]);return <div className="bootScreen"><div className="bootLogo">M</div><h1>makOS</h1><p>{BOOT_LABELS[BOOT_STAGES[stage]]}</p><div className="bootTrack"><i style={{width:((stage+1)/BOOT_STAGES.length)*100+"%"}}/></div><small>{BOOT_STAGES[stage]} · {stage+1}/{BOOT_STAGES.length}</small></div>}
createRoot(document.getElementById("root")).render(<App/>);