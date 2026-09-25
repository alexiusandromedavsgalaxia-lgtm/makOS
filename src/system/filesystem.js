const KEY="makOS.fs.v1";
export const DEFAULT_FS={
  "/":{type:"dir"},
  "/Applications":{type:"dir"},
  "/Desktop":{type:"dir"},
  "/Documents":{type:"dir"},
  "/Downloads":{type:"dir"},
  "/Library":{type:"dir"},
  "/System":{type:"dir"},
  "/System/Library":{type:"dir"},
  "/System/Library/CoreServices":{type:"dir"},
  "/System/Library/Drivers":{type:"dir"},
  "/System/Library/Frameworks":{type:"dir"},
  "/System/Boot":{type:"dir"},
  "/System/Boot/boot.efi":{type:"file",content:"makOS bootloader 1.0"},
  "/System/Boot/boot.cfg":{type:"file",content:"kernel=makKernel\nroot=/"},
  "/System/Kernel":{type:"file",content:"makKernel 1.0 | browser-native simulation"},
  "/Users":{type:"dir"},
  "/Users/mako":{type:"dir"},
  "/Users/mako/Desktop":{type:"dir"},
  "/Users/mako/Documents":{type:"dir"},
  "/Users/mako/Downloads":{type:"dir"},
  "/Users/mako/Library":{type:"dir"},
  "/Applications/Finder.app":{type:"file",content:"makOS Finder"},
  "/Applications/Terminal.app":{type:"file",content:"makOS Terminal"},
  "/Applications/Settings.app":{type:"file",content:"makOS Settings"},
  "/Applications/Safari.app":{type:"file",content:"makOS Safari"}
};

export function normalizePath(path,cwd="/Users/mako"){
  const raw=path?.startsWith("/")?path:""+cwd+"/"+(path||"");
  const out=[];
  raw.split("/").forEach(p=>{
    if(!p||p===".")return;
    if(p==="..")out.pop();
    else out.push(p);
  });
  return "/"+out.join("/");
}

function cloneDefaultFS(){
  return JSON.parse(JSON.stringify(DEFAULT_FS));
}

export function loadFS(){
  try{
    const v=JSON.parse(localStorage.getItem(KEY)||"null");
    if(v&&v["/"])return v;
  }catch{}
  const fs=cloneDefaultFS();
  try{localStorage.setItem(KEY,JSON.stringify(fs))}catch{}
  return fs;
}

export function saveFS(fs){
  localStorage.setItem(KEY,JSON.stringify(fs));
  return fs;
}

export function children(fs,path){
  const prefix=path==="/"?"":path+"/";
  return Object.keys(fs)
    .filter(p=>p.startsWith(prefix)&&p!==path&&!p.slice(prefix.length).includes("/"))
    .map(p=>({path:p,name:p.slice(prefix.length),...fs[p]}));
}

export function mkdir(fs,path){
  const p=normalizePath(path);
  if(fs[p])throw new Error("File exists");
  fs[p]={type:"dir"};
  return fs;
}

export function touch(fs,path,content=""){
  const p=normalizePath(path);
  if(fs[p]?.type==="dir")throw new Error("Is a directory");
  fs[p]={type:"file",content};
  return fs;
}

export function remove(fs,path){
  const p=normalizePath(path);
  if(p==="/")throw new Error("Permission denied");
  if(!fs[p])throw new Error("No such file or directory");
  Object.keys(fs).filter(x=>x===p||x.startsWith(p+"/")).forEach(x=>delete fs[x]);
  return fs;
}

export function readFile(fs,path){
  const item=fs[normalizePath(path)];
  if(!item)throw new Error("No such file or directory");
  if(item.type!=="file")throw new Error("Is a directory");
  return item.content||"";
}
