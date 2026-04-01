import { useState, useEffect, useRef } from "react";

const C = {
  beige:"#E8E2D9", noir:"#0A0A0A", blanc:"#F5F2ED",
  orange:"#E8622A", rose:"#C4547A", violet:"#7B5EA7", bleu:"#4A6FD4",
  gradient:"linear-gradient(135deg,#E8622A 0%,#C4547A 35%,#7B5EA7 70%,#4A6FD4 100%)",
  gradB:"linear-gradient(135deg,#E8622A 0%,#C4547A 40%,#7B5EA7 75%,#4A6FD4 100%)",
};
const D={fontFamily:"'Bebas Neue',sans-serif",letterSpacing:"0.02em"};
const M={fontFamily:"'Space Mono',monospace"};
const B={fontFamily:"'DM Sans',sans-serif"};

function Grid({op=0.07,col="10,10,10"}){
  return <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:0,
    backgroundImage:`linear-gradient(rgba(${col},${op}) 1px,transparent 1px),linear-gradient(90deg,rgba(${col},${op}) 1px,transparent 1px)`,
    backgroundSize:"28px 28px"}}/>;
}
function Arr({size=40,color="#0A0A0A",style={}}){
  return <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={style}>
    <path d="M8 32 L32 8" stroke={color} strokeWidth="4" strokeLinecap="square"/>
    <path d="M12 8 L32 8 L32 28" stroke={color} strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter"/>
  </svg>;
}

const DJS=[
  {id:"khammix",name:"KHAMMIX",time:"15h00 - 16h30",set:"Nostalkhammix",genre:"Bouncy Trance - Eurodance - 90s/2000s",color:"#E8622A",
   bio:"Bouncy trance, eurodance et nostalgie assumee. Des melodies accrocheuses, des drops energiques et une vibe 90s/2000s revisitee. Un set pense pour te faire sourire et rester en mouvement. Yalla Habibi"},
  {id:"kassl",name:"KASS L",time:"16h30 - 18h00",set:"Tech House Groovy",genre:"Tech House - Groove",color:"#C4547A",
   bio:"Depuis son plus jeune age, la musique est son univers. Kass L vous a concote un set tech house groovy qui va enflammer la piste des les premieres notes."},
  {id:"micropia",name:"MICROPIA",time:"18h00 - 19h30",set:"Deep Atmospheres",genre:"Deep House - Minimal - Hypnotique",color:"#7B5EA7",
   bio:"Nourri par la deep house et les grooves hypnotiques, Micropia vous embarque pour un set aux atmospheres enveloppantes, porte par des kicks bien ronds et des basses profondes."},
  {id:"rexorder",name:"REXORDER",time:"19h30 - 21h00",set:"Club Energy",genre:"Speed Garage - UK Garage - House - DNB",color:"#4A6FD4",
   bio:"Producteur et DJ oscillant entre Speed Garage, UK Garage, House et DNB. Sa musique mele basslines massives et energie rave. Il collabore avec la rappeuse UCCI WHY."},
  {id:"frks",name:"FRKS",time:"21h00 - 22h00",set:"Closing Set",genre:"Techno - Trance - UK Garage",color:"#0A0A0A",
   bio:"Converti de force a la techno par Rita, FRKS a fait ses armes lors de l'anniversaire de cette derniere. Sa philosophie : on n'arrete jamais les 3D."},
];

const EXPOS=[
  {id:"e1",name:"Studio Atelier No1",type:"Illustration et Print",desc:"Serigraphies, risographies et tirages d'art en edition limitee.",color:"#E8622A",code:"1842",photo:null},
  {id:"e2",name:"Ceramiques Libre",type:"Ceramique",desc:"Pieces uniques faconnees a la main, entre utilite et sculpture.",color:"#C4547A",code:"2956",photo:null},
  {id:"e3",name:"Kollectiv Zine",type:"Edition independante",desc:"Zines, livres d'artistes et publications auto-editees.",color:"#7B5EA7",code:"3714",photo:null},
  {id:"e4",name:"Archive Textile",type:"Mode et Upcycling",desc:"Pieces vintage retravaillees et creations textiles contemporaines.",color:"#4A6FD4",code:"4023",photo:null},
  {id:"e5",name:"Labo Photo",type:"Photographie",desc:"Tirages argentiques et numeriques, portraits et documentaires urbains.",color:"#3A8A6A",code:"5678",photo:null},
  {id:"e6",name:"A confirmer",type:"--",desc:"Bientot revele.",color:"#888",code:"6000",photo:null},
  {id:"e7",name:"A confirmer",type:"--",desc:"Bientot revele.",color:"#888",code:"7000",photo:null},
];

const EGGS=["OEUF01","OEUF02","OEUF03","OEUF04","OEUF05","OEUF06","OEUF07","OEUF08","OEUF09","OEUF10"];

const JKEY = import.meta.env.VITE_JSONBIN_KEY || "";
const EGGS_BIN = import.meta.env.VITE_JSONBIN_EGGS_ID || "";
const PHOTOS_BIN = import.meta.env.VITE_JSONBIN_PHOTOS_ID || "";
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY || "";

// Substituir pelos URLs reais do Cloudinary
const DJ_PHOTOS = {
  khammix: import.meta.env.VITE_PHOTO_KHAMMIX || "",
  kassl:   import.meta.env.VITE_PHOTO_KASSL || "",
  micropia:import.meta.env.VITE_PHOTO_MICROPIA || "",
  rexorder:import.meta.env.VITE_PHOTO_REXORDER || "",
  frks:    import.meta.env.VITE_PHOTO_FRKS || "",
};
const LOGO_ROUND = import.meta.env.VITE_LOGO_ROUND || "";
const LOGO_FULL  = import.meta.env.VITE_LOGO_FULL || "";
const JH = {"Content-Type":"application/json","X-Master-Key":JKEY};

async function fetchBin(id){
  try{
    const key = import.meta.env.VITE_JSONBIN_KEY || "";
    const r=await fetch(`https://api.jsonbin.io/v3/b/${id}/latest`,{
      headers:{"X-Master-Key":key}
    });
    if(!r.ok)return null;
    const d=await r.json();
    return d.record;
  }catch(_){return null;}
}

async function putBin(id,data){
  try{
    const key = import.meta.env.VITE_JSONBIN_KEY || "";
    await fetch(`https://api.jsonbin.io/v3/b/${id}`,{
      method:"PUT",
      headers:{"Content-Type":"application/json","X-Master-Key":key},
      body:JSON.stringify(data)
    });
  }catch(_){}
}

export default function App(){
  const [screen,setScreen]=useState("splash");
  const [tab,setTab]=useState("djs");
  const [visitor,setVisitor]=useState(null);
  const [expos,setExpos]=useState(EXPOS);
  const [stamps,setStamps]=useState({});
  const [myEggs,setMyEggs]=useState([]);
  const [globalEggs,setGlobalEggs]=useState(0);
  const [photos,setPhotos]=useState([]);
  const [isAdmin,setIsAdmin]=useState(false);
  const [djs,setDjs]=useState(()=>{
    try{const d=localStorage.getItem("mc2-djs");return d?JSON.parse(d):DJS;}catch(_){return DJS;}
  });
  const [selDJ,setSelDJ]=useState(null);
  const [selExp,setSelExp]=useState(null);
  const [splashDone,setSplashDone]=useState(false);
  const [toast,setToast]=useState(null);

  useEffect(()=>{const t=setTimeout(()=>setSplashDone(true),400);return()=>clearTimeout(t);},[]);
  useEffect(()=>{
    try{
      const v=localStorage.getItem("mc2-v");if(v)setVisitor(JSON.parse(v));
      const s=localStorage.getItem("mc2-s");if(s)setStamps(JSON.parse(s));
      const e=localStorage.getItem("mc2-e");if(e)setMyEggs(JSON.parse(e));
      const p=localStorage.getItem("mc2-p");if(p)setPhotos(JSON.parse(p));
      const x=localStorage.getItem("mc2-x");if(x)setExpos(JSON.parse(x));
    }catch(_){}
    // fetch global egg count from JSONBin
    if(EGGS_BIN){
      fetchBin(EGGS_BIN).then(d=>{
        if(d?.globalEggs!==undefined)setGlobalEggs(d.globalEggs);
      });
    }
    // fetch shared photos from JSONBin and merge with local
if(PHOTOS_BIN){
  fetchBin(PHOTOS_BIN).then(d=>{
    if(!d?.photos?.length)return;
    setPhotos(current=>{
      const localIds=new Set(current.map(p=>String(p.id)));
      const newPhotos=d.photos.filter(p=>!localIds.has(String(p.id)));
      if(newPhotos.length===0)return current;
      const merged=[...current,...newPhotos].sort((a,b)=>a.id-b.id);
      try{localStorage.setItem("mc2-p",JSON.stringify(merged));}catch(_){}
      return merged;
    });
  });
}
  },[]);

  function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(_){}}

  function reg(name){
    const v={name:name.trim()};
    setVisitor(v);sv("mc2-v",v);setScreen("main");
  }

  function stamp(expo){
    const ns={...stamps,[expo.id]:true};
    setStamps(ns);sv("mc2-s",ns);
    const c=Object.values(ns).filter(Boolean).length;
    if(c===1)showToast("Premier tampon !");
    else if(c===3)showToast("3 stands visites !");
  }

  function findEgg(code){
  const n=code.trim().toUpperCase();
  if(!EGGS.includes(n))return "invalid";
  if(myEggs.includes(n))return "already";
  const ne=[...myEggs,n];
  setMyEggs(ne);sv("mc2-e",ne);
  const newGlobal=globalEggs+1;
  setGlobalEggs(newGlobal);
  try{localStorage.setItem("mc2-g",String(newGlobal));}catch(_){}
  if(EGGS_BIN){
    putBin(EGGS_BIN,{globalEggs:newGlobal}).then(()=>{
    }).catch(e=>{
    });
  } else {
  }
  if(ne.length===3)showToast("3 oeufs ! Va chercher ton prix chez eRReur !");
  else showToast("Oeuf #"+ne.length+" trouve !");
  return "found";
}

  function showToast(msg){
    setToast(msg);
    setTimeout(()=>setToast(null),3000);
  }

function addPhoto(url,caption){
  const newPhoto={id:Date.now(),url,caption,author:visitor?.name||"Anon",at:new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})};
  const np=[...photos,newPhoto];
  setPhotos(np);sv("mc2-p",np);
  if(PHOTOS_BIN){
    putBin(PHOTOS_BIN,{photos:np.map(p=>({id:p.id,url:p.url,caption:p.caption,author:p.author,at:p.at}))})
      .then(()=>console.log("Foto sync OK!"))
      .catch(e=>console.log("Foto sync ERRO:", e));
  } else {
  }
}

  function updateExpos(ne){setExpos(ne);sv("mc2-x",ne);}
  function updateDj(updated){
    const nd=djs.map(x=>x.id===updated.id?updated:x);
    setDjs(nd);sv("mc2-djs",nd);
    setSelDJ(updated);
  }

  const eggCount=myEggs.length;
  const stampCount=Object.values(stamps).filter(Boolean).length;

  return(
    <div style={{display:"flex",flexDirection:"column",width:"100%",height:"100vh",background:C.beige,overflow:"hidden",position:"relative"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        button,input,textarea{outline:none;font-family:inherit;}
        textarea{resize:none;}
        ::-webkit-scrollbar{width:2px;}
        ::-webkit-scrollbar-thumb{background:rgba(10,10,10,0.15);}
        .fu{animation:fu 0.35s ease both;}
        @keyframes fu{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
        .pulse{animation:pulse 1.5s infinite;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
        .pop{animation:pop 0.35s cubic-bezier(0.175,0.885,0.32,1.275) both;}
        @keyframes pop{from{opacity:0;transform:scale(0.5);}to{opacity:1;transform:scale(1);}}
      `}</style>

      {toast&&(
        <div style={{position:"absolute",top:70,left:"50%",transform:"translateX(-50%)",background:C.noir,color:C.blanc,...M,fontSize:11,padding:"8px 18px",zIndex:200,whiteSpace:"nowrap",letterSpacing:"0.1em"}}>
          {toast}
        </div>
      )}

      {screen==="splash"&&<Splash done={splashDone} onEnter={()=>setScreen(visitor?"main":"reg")}/>}
      {screen==="reg"&&<Reg onReg={reg}/>}
      {screen==="main"&&visitor&&(
        <>
          <Header visitor={visitor} eggCount={eggCount} stampCount={stampCount} isAdmin={isAdmin} onAdmin={()=>setIsAdmin(v=>!v)}/>
          <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            {tab==="djs"&&!selDJ&&<DJList djs={djs} onSel={setSelDJ}/>}
            {tab==="djs"&&selDJ&&<DJPage dj={selDJ} onBack={()=>setSelDJ(null)} isAdmin={isAdmin} onUpdate={updateDj}/>}
            {tab==="expos"&&!selExp&&<ExpoList expos={expos} stamps={stamps} onSel={setSelExp} onStamp={stamp} isAdmin={isAdmin} onUpdate={updateExpos}/>}
            {tab==="expos"&&selExp&&<ExpoPage exp={selExp} stamped={stamps[selExp.id]} onStamp={()=>{stamp(selExp);setSelExp(null);}} onBack={()=>setSelExp(null)} isAdmin={isAdmin} onUpdate={e=>{updateExpos(expos.map(x=>x.id===e.id?e:x));setSelExp(e);}}/>}
            {tab==="explore"&&<Explore myEggs={myEggs} eggCount={eggCount} globalEggs={globalEggs} onFind={findEgg} photos={photos} onAddPhoto={addPhoto} visitor={visitor}/>}
            {tab==="infos"&&<Infos/>}
            {tab==="novum"&&<Novum/>}
            {tab==="erreur"&&<Erreur/>}
            {tab==="ai"&&<AI visitor={visitor}/>}
          </div>
          <Nav tab={tab} onNav={t=>{setTab(t);setSelDJ(null);setSelExp(null);}} eggCount={eggCount} stampCount={stampCount}/>
        </>
      )}
    </div>
  );
}

function Splash({done,onEnter}){
  const [showInstall,setShowInstall]=useState(true);
  function dismissInstall(){
    try{localStorage.setItem("mc2-install-dismissed","1");}catch(_){}
    setShowInstall(false);
  }
  const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
  const isAndroid=/android/i.test(navigator.userAgent.toLowerCase());
  const isMobile=isIOS||isAndroid;
    return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.beige,position:"relative",overflow:"hidden"}}>
      <Grid op={0.07}/>
      <div style={{position:"absolute",top:-100,left:-100,width:380,height:380,background:C.gradB,borderRadius:"50%",filter:"blur(90px)",opacity:0.5,zIndex:0}}/>
      <div style={{position:"absolute",bottom:-60,right:-40,width:220,height:220,background:C.gradB,borderRadius:"50%",filter:"blur(70px)",opacity:0.3,zIndex:0}}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"52px 28px 44px",position:"relative",zIndex:1}}>
        <div className={done?"fu":""} style={{display:"flex",justifyContent:"space-between"}}>
          <div style={{...M,fontSize:10,color:C.noir,opacity:0.55,letterSpacing:"0.1em",textTransform:"uppercase",lineHeight:1.7}}>NOVUM{"\n"}Bruxelles</div>
          <div style={{...M,fontSize:10,color:C.noir,opacity:0.55,textAlign:"right",lineHeight:1.7}}>05.04.26{"\n"}12h - 22h</div>
        </div>
        <div>
          <div className={done?"fu":""} style={{animationDelay:"0.08s",position:"relative"}}>
            <div style={{...D,fontSize:82,lineHeight:0.88,color:C.noir}}>MARCHE{"\n"}CREATIF</div>
            <div style={{position:"absolute",top:0,right:0}}><Arr size={72} color={C.noir}/></div>
          </div>
          <div className={done?"fu":""} style={{animationDelay:"0.15s",height:4,background:C.gradient,marginTop:18,width:"65%"}}/>
          <div className={done?"fu":""} style={{animationDelay:"0.2s",display:"flex",flexWrap:"wrap",gap:7,marginTop:14}}>
            {["STANDS","EXPOS","DJS","SURPRISES"].map(t=>(
              <div key={t} style={{...M,fontSize:11,fontWeight:700,color:C.noir,border:"1.5px solid #0A0A0A",padding:"4px 11px"}}>{t}</div>
            ))}
          </div>
        </div>
        <div className={done?"fu":""} style={{animationDelay:"0.25s"}}>
          <div style={{...M,fontSize:9,color:C.noir,opacity:0.45,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:8}}>Entree libre - Paye ce que tu peux</div>
          <div style={{display:"flex",gap:8,marginBottom:24}}>
            {["5 EUR","10 EUR","15 EUR"].map(p=><div key={p} style={{...D,fontSize:20,color:C.noir,background:"rgba(10,10,10,0.08)",padding:"4px 12px"}}>{p}</div>)}
          </div>
          <button onClick={onEnter} style={{width:"100%",background:C.noir,color:C.beige,...D,fontSize:30,border:"none",padding:"18px 24px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>ENTRER</span><Arr size={28} color={C.beige}/>
          </button>
          <div style={{...M,fontSize:9,color:C.noir,opacity:0.28,textAlign:"center",marginTop:12,letterSpacing:"0.15em",textTransform:"uppercase"}}>une production eRReurProductions</div>
        </div>
      </div>
      {showInstall&&isMobile&&(
  <div style={{position:"absolute",bottom:0,left:0,right:0,background:C.noir,padding:"14px 18px",zIndex:10,display:"flex",gap:12,alignItems:"flex-start"}}>
    <div style={{flex:1}}>
      <div style={{...M,fontSize:10,color:C.blanc,fontWeight:700,letterSpacing:"0.08em",marginBottom:5}}>
        {isIOS?"Ajouter au menu principal":"Installer sur ton telephone"}
      </div>
      <div style={{...B,fontSize:12,color:"rgba(245,242,237,0.65)",lineHeight:1.5}}>
        {isIOS?"Touche l'icone de partage puis \"Sur l'ecran d'accueil\"":"Touche les 3 points puis \"Ajouter a l'ecran d'accueil\""}
      </div>
    </div>
    <button onClick={dismissInstall} style={{background:"none",border:"none",color:"rgba(245,242,237,0.45)",fontSize:20,cursor:"pointer",flexShrink:0,padding:"0 4px",lineHeight:1}}>X</button>
  </div>
)}
    </div>
  );
}

function Reg({onReg}){
  const [name,setName]=useState("");
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.beige,position:"relative",overflow:"hidden"}}>
      <Grid op={0.07}/>
      <div style={{position:"absolute",top:-80,left:-80,width:280,height:280,background:C.gradB,borderRadius:"50%",filter:"blur(80px)",opacity:0.4,zIndex:0}}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"40px 28px",position:"relative",zIndex:1}}>
        <div style={{...D,fontSize:52,color:C.noir,lineHeight:0.9,marginBottom:4}}>BIENVENUE</div>
        <div style={{...D,fontSize:52,color:C.noir,lineHeight:0.9,marginBottom:4}}>AU MARCHE</div>
        <div style={{height:3,background:C.gradient,width:"50%",marginBottom:28}}/>
        <div style={{...M,fontSize:10,color:C.noir,opacity:0.5,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>Comment tu t'appelles ?</div>
        <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&name.trim())onReg(name);}}
          placeholder="Ton prenom..." maxLength={30}
          style={{width:"100%",background:"none",border:"none",borderBottom:"2px solid #0A0A0A",padding:"12px 0",fontSize:24,...D,color:C.noir,marginBottom:32}}/>
        <button onClick={()=>{if(name.trim())onReg(name);}} disabled={!name.trim()}
          style={{width:"100%",background:name.trim()?C.noir:"#ccc",color:name.trim()?C.blanc:"#999",border:"none",...D,fontSize:28,padding:"16px 24px",cursor:name.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span>C'EST PARTI</span><Arr size={24} color={name.trim()?C.blanc:"#999"}/>
        </button>
      </div>
    </div>
  );
}

function Header({visitor,eggCount,stampCount,isAdmin,onAdmin}){
  const [showA,setShowA]=useState(false);
  const [aCode,setACode]=useState("");
  const [aErr,setAErr]=useState(false);
  function tryA(){
    if(aCode==="ERREUR2026"){onAdmin();setShowA(false);setACode("");}
    else{setAErr(true);setTimeout(()=>setAErr(false),1200);}
  }
  return(
    <>
      <div style={{background:C.noir,padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:C.gradB,opacity:0.12}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{...D,fontSize:18,color:C.blanc,letterSpacing:"0.05em",lineHeight:1}}>MARCHE CREATIF</div>
          <div style={{...M,fontSize:8,color:"rgba(245,242,237,0.65)",letterSpacing:"0.1em",marginTop:1}}>05.04.26 - {visitor?.name}</div>
        </div>
        <div style={{position:"relative",zIndex:1,display:"flex",gap:6,alignItems:"center"}}>
          {eggCount>0&&<div style={{...M,fontSize:9,background:"rgba(245,242,237,0.1)",color:C.blanc,padding:"3px 7px"}}>oeufs: {eggCount}</div>}
          {stampCount>0&&<div style={{...M,fontSize:9,background:"rgba(245,242,237,0.1)",color:C.blanc,padding:"3px 7px"}}>stands: {stampCount}</div>}
          <button onClick={()=>isAdmin?onAdmin():setShowA(v=>!v)}
            style={{background:isAdmin?"rgba(232,98,42,0.3)":"rgba(245,242,237,0.08)",border:isAdmin?"1px solid #E8622A":"1px solid rgba(245,242,237,0.3)",color:C.blanc,...M,fontSize:8,padding:"4px 9px",cursor:"pointer",letterSpacing:"0.1em"}}>
            {isAdmin?"ADMIN OK":"ADMIN"}
          </button>
        </div>
      </div>
      {showA&&(
        <div style={{background:C.noir,borderTop:"1px solid rgba(245,242,237,0.08)",padding:"10px 16px",display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
          <input value={aCode} onChange={e=>setACode(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")tryA();}} placeholder="Code admin..." type="password"
            style={{flex:1,background:"rgba(245,242,237,0.08)",border:aErr?"1px solid #E8622A":"1px solid rgba(245,242,237,0.15)",color:C.blanc,...M,fontSize:13,padding:"7px 11px"}}/>
          <button onClick={tryA} style={{background:C.orange,color:C.blanc,border:"none",...M,fontSize:11,padding:"7px 13px",cursor:"pointer"}}>OK</button>
          <button onClick={()=>setShowA(false)} style={{background:"none",border:"none",color:"rgba(245,242,237,0.4)",...M,fontSize:11,padding:"7px",cursor:"pointer"}}>X</button>
        </div>
      )}
    </>
  );
}

function Nav({tab,onNav,eggCount,stampCount}){
  const items=[
    {id:"djs",label:"DJs"},
    {id:"expos",label:"Expos"},
    {id:"explore",label:"Explorer"},
    {id:"infos",label:"Infos"},
    {id:"novum",label:"NOVUM"},
    {id:"erreur",label:"eRReur"},
    {id:"ai",label:"L Erreur"},
  ];
  return(
    <div style={{display:"flex",background:C.noir,borderTop:"1px solid rgba(245,242,237,0.08)",paddingBottom:14,flexShrink:0}}>
      {items.map(item=>{
        const active=tab===item.id;
        const notif=item.id==="explore"&&(eggCount>0||stampCount>0);
        return(
          <button key={item.id} onClick={()=>onNav(item.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:1,padding:"8px 0 2px",background:"none",border:"none",cursor:"pointer",position:"relative"}}>
            {notif&&<div style={{position:"absolute",top:5,right:"10%",width:6,height:6,background:C.orange,borderRadius:"50%"}}/>}
            <span style={{...M,fontSize:7,letterSpacing:"0.04em",color:active?C.blanc:"rgba(245,242,237,0.65)",fontWeight:active?700:400,textTransform:"uppercase"}}>{item.label}</span>
            {active&&<div style={{width:12,height:2,background:C.gradient,marginTop:2}}/>}
          </button>
        );
      })}
    </div>
  );
}

function DJList({djs,onSel}){
  function status(time){
    const now=new Date();
    const p=time.split(" - ");
    const sh=parseInt(p[0]),sm=parseInt(p[0].split("h")[1])||0;
    const eh=parseInt(p[1]),em=parseInt(p[1].split("h")[1])||0;
    const nm=now.getHours()*60+now.getMinutes();
    if(nm>=sh*60+sm&&nm<eh*60+em)return "live";
    if(nm<sh*60+sm)return "soon";
    return "past";
  }
  return(
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",background:C.beige,position:"relative"}}>
      <Grid op={0.06}/>
      <div style={{padding:"20px 18px",position:"relative",zIndex:1}}>
        <div style={{marginBottom:20}}>
          <div style={{...D,fontSize:48,color:C.noir,lineHeight:0.9,marginBottom:8}}>LINE UP</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{height:2,flex:1,background:C.gradient}}/>
            <div style={{...M,fontSize:9,color:C.noir,opacity:0.4,letterSpacing:"0.15em"}}>05 AVRIL 2026</div>
          </div>
        </div>
        <div style={{position:"relative"}}>
          <div style={{position:"absolute",left:52,top:0,bottom:0,width:1,background:"rgba(10,10,10,0.1)"}}/>
          {djs.map((dj,i)=>{
            const s=status(dj.time);
            return(
              <div key={dj.id} className="fu" style={{animationDelay:`${i*0.06}s`,display:"flex",gap:13,marginBottom:12,cursor:"pointer"}} onClick={()=>onSel(dj)}>
                <div style={{width:48,flexShrink:0,paddingTop:2}}>
                  <div style={{...M,fontSize:9,color:C.noir,opacity:0.4,lineHeight:1.5}}>
                    {dj.time.split(" - ")[0]}<br/><span style={{opacity:0.4}}>v</span><br/>{dj.time.split(" - ")[1]}
                  </div>
                </div>
                <div style={{flex:1,background:C.blanc,border:"1.5px solid rgba(10,10,10,0.07)",padding:"12px 14px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,width:3,bottom:0,background:dj.color}}/>
                  {s==="live"&&<div className="pulse" style={{...M,fontSize:8,background:C.orange,color:C.blanc,padding:"2px 7px",display:"inline-block",marginBottom:5,letterSpacing:"0.1em"}}>EN COURS</div>}
                  <div style={{position:"relative",zIndex:1}}>
                    <div style={{...D,fontSize:24,color:C.noir,lineHeight:1,opacity:s==="past"?0.4:1}}>{dj.name}</div>
                    <div style={{...M,fontSize:8,color:dj.color,letterSpacing:"0.1em",marginTop:3,textTransform:"uppercase"}}>{dj.set}</div>
                    <div style={{...B,fontSize:11,color:"rgba(10,10,10,0.45)",marginTop:3}}>{dj.genre}</div>
                  </div>
                  <Arr size={16} color={C.noir} style={{opacity:0.2,position:"absolute",bottom:10,right:10}}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DJPage({dj,onBack,isAdmin,onUpdate}){
  const [edit,setEdit]=useState(false);
  const [form,setForm]=useState({set:dj.set,genre:dj.genre,bio:dj.bio,time:dj.time});
  const d=dj;
  const photo=typeof DJ_PHOTOS!=="undefined"?DJ_PHOTOS[d.id]:null;
  return(
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",background:C.beige}}>
      {/* Header band */}
      <div style={{position:"relative",overflow:"hidden",background:`linear-gradient(160deg,${d.color}40,${d.color}15)`,padding:"14px 16px 14px"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(10,10,10,0.05) 0%,rgba(232,226,217,0.6) 100%)"}}/>
        <button onClick={onBack} style={{position:"relative",zIndex:1,background:"rgba(10,10,10,0.5)",border:"none",color:C.blanc,...M,fontSize:10,padding:"6px 12px",cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10}}>{"< PROG"}</button>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{...D,fontSize:d.name.length>7?52:68,color:C.noir,lineHeight:0.88,marginBottom:6}}>{d.name}</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{height:3,width:36,background:d.color}}/>
            <div style={{...M,fontSize:9,color:d.color,letterSpacing:"0.12em",textTransform:"uppercase"}}>{d.time}</div>
          </div>
        </div>
      </div>
      {/* Square photo */}
      {photo&&(
        <div style={{width:"100%",aspectRatio:"1",background:`url(${photo}) center/cover`,overflow:"hidden"}}/>
      )}
      <div style={{padding:"18px 20px"}}>
        <div style={{marginBottom:14}}>
          <div style={{...M,fontSize:8,color:C.noir,opacity:0.35,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4}}>Set du soir</div>
          <div style={{...D,fontSize:26,color:d.color}}>{d.set}</div>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
          {d.genre.split(" - ").map(g=><div key={g} style={{...M,fontSize:9,border:`1px solid ${d.color}`,color:d.color,padding:"3px 9px"}}>{g}</div>)}
        </div>
        <div style={{background:C.blanc,border:"1.5px solid rgba(10,10,10,0.07)",padding:"16px",marginBottom:14,position:"relative"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:d.color}}/>
          <div style={{...B,fontSize:14,color:C.noir,lineHeight:1.75,opacity:0.82}}>{d.bio}</div>
        </div>
        <div style={{background:C.noir,padding:"16px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div>
            <div style={{...M,fontSize:8,color:"rgba(245,242,237,0.65)",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:3}}>Sur scene</div>
            <div style={{...D,fontSize:30,color:C.blanc}}>{d.time}</div>
          </div>
          <Arr size={30} color={d.color}/>
        </div>
        {isAdmin&&(
          <>
            <button onClick={()=>setEdit(v=>!v)} style={{width:"100%",background:"rgba(232,98,42,0.08)",border:"1px dashed rgba(232,98,42,0.4)",color:C.orange,...M,fontSize:10,padding:"10px",cursor:"pointer",marginBottom:10,letterSpacing:"0.1em",textTransform:"uppercase"}}>
              {edit?"Fermer":"Modifier (Admin)"}
            </button>
            {edit&&(
              <div style={{background:C.blanc,border:"2px solid #E8622A",padding:"16px",marginBottom:12}}>
                {[["Set","set"],["Horaire","time"],["Genres (- comme separateur)","genre"]].map(([lbl,key])=>(
                  <div key={key} style={{marginBottom:10}}>
                    <div style={{...M,fontSize:8,color:C.noir,opacity:0.4,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:3}}>{lbl}</div>
                    <input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={{width:"100%",background:"rgba(10,10,10,0.04)",border:"1px solid rgba(10,10,10,0.12)",padding:"7px 9px",...B,fontSize:13,color:C.noir}}/>
                  </div>
                ))}
                <div style={{marginBottom:10}}>
                  <div style={{...M,fontSize:8,color:C.noir,opacity:0.4,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:3}}>Bio</div>
                  <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} rows={4} style={{width:"100%",background:"rgba(10,10,10,0.04)",border:"1px solid rgba(10,10,10,0.12)",padding:"7px 9px",...B,fontSize:13,color:C.noir}}/>
                </div>
                <button onClick={()=>{onUpdate({...d,...form});setEdit(false);}} style={{width:"100%",background:C.orange,color:C.blanc,border:"none",...D,fontSize:18,padding:"11px",cursor:"pointer"}}>ENREGISTRER</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ExpoList({expos,stamps,onSel,onStamp,isAdmin,onUpdate}){
  const [showF,setShowF]=useState(false);
  const [form,setForm]=useState({name:"",type:"",desc:"",code:"",color:C.orange,photo:null,instagram:"",web:""});
  const sc=Object.values(stamps).filter(Boolean).length;

  async function compress(file){
    return new Promise(res=>{
      const r=new FileReader();r.readAsDataURL(file);
      r.onload=ev=>{
        const img=new Image();img.src=ev.target.result;
        img.onload=()=>{
          const c=document.createElement("canvas");
          const ratio=Math.min(400/img.width,400/img.height,1);
          c.width=img.width*ratio;c.height=img.height*ratio;
          c.getContext("2d").drawImage(img,0,0,c.width,c.height);
          res(c.toDataURL("image/jpeg",0.75));
        };
      };
    });
  }

  function save(){
    if(!form.name.trim())return;
    onUpdate([...expos,{...form,id:"e"+Date.now()}]);
    setShowF(false);setForm({name:"",type:"",desc:"",code:"",color:C.orange,photo:null,instagram:"",web:""});
  }

  return(
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",background:C.beige,position:"relative"}}>
      <Grid op={0.06}/>
      <div style={{padding:"20px 18px",position:"relative",zIndex:1}}>
        <div style={{marginBottom:18}}>
          <div style={{...D,fontSize:46,color:C.noir,lineHeight:0.9,marginBottom:6}}>STANDS ET EXPOS</div>
          <div style={{height:2,background:C.gradient,width:"55%"}}/>
          {sc>0&&<div style={{...M,fontSize:10,color:C.orange,marginTop:7}}>{sc} stand(s) visite(s)</div>}
        </div>
        <div style={{background:C.blanc,border:"1.5px solid rgba(10,10,10,0.07)",padding:"13px 15px",marginBottom:16}}>
          <div style={{...M,fontSize:9,color:C.noir,opacity:0.38,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>Ton carnet de visite</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
            {expos.filter(e=>e.name!=="A confirmer").map(e=>(
              <div key={e.id} style={{width:34,height:34,background:stamps[e.id]?e.color:"rgba(10,10,10,0.06)",border:"1.5px solid "+(stamps[e.id]?e.color:"rgba(10,10,10,0.09)"),display:"flex",alignItems:"center",justifyContent:"center",color:"white",transition:"all 0.3s"}}>
                {stamps[e.id]&&"V"}
              </div>
            ))}
          </div>
          <div style={{...B,fontSize:11,color:C.noir,opacity:0.45}}>Demande le code a chaque exposant pour tamponner</div>
        </div>
        {isAdmin&&(
          <button onClick={()=>setShowF(v=>!v)} style={{width:"100%",background:"rgba(232,98,42,0.08)",border:"1.5px dashed rgba(232,98,42,0.35)",color:C.orange,...M,fontSize:10,padding:"11px",cursor:"pointer",marginBottom:12,letterSpacing:"0.1em",textTransform:"uppercase"}}>
            {showF?"Fermer":"+ Ajouter un exposant (Admin)"}
          </button>
        )}
        {isAdmin&&showF&&(
          <div style={{background:C.blanc,border:"2px solid #E8622A",padding:"16px",marginBottom:14}}>
            <div style={{...D,fontSize:18,color:C.orange,marginBottom:12}}>NOUVEL EXPOSANT</div>
            <div style={{marginBottom:12}}>
              <div style={{...M,fontSize:8,color:C.noir,opacity:0.4,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5}}>Photo</div>
              <label style={{display:"block",cursor:"pointer"}}>
                <div style={{height:100,background:form.photo?`url(${form.photo}) center/cover`:C.beige,border:"2px dashed "+(form.photo?"transparent":"rgba(10,10,10,0.2)"),display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {!form.photo&&<span style={{...M,fontSize:11,color:C.noir,opacity:0.35}}>Taper pour ajouter photo</span>}
                </div>
                <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{
                  const f=e.target.files[0];if(!f)return;
                  const c=await compress(f);setForm(x=>({...x,photo:c}));
                }}/>
              </label>
              {form.photo&&<button onClick={()=>setForm(x=>({...x,photo:null}))} style={{background:"none",border:"none",color:C.orange,...M,fontSize:10,cursor:"pointer",marginTop:2}}>Supprimer</button>}
            </div>
            {[["Nom","name"],["Type","type"],["Description","desc"],["Code visiteur (4 chiffres)","code"],["Instagram (ex: @stand)","instagram"],["Site web (ex: monsite.be)","web"]].map(([lbl,key])=>(
              <div key={key} style={{marginBottom:10}}>
                <div style={{...M,fontSize:8,color:C.noir,opacity:0.4,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:3}}>{lbl}</div>
                {key==="desc"
                  ?<textarea value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} rows={2} style={{width:"100%",background:"rgba(10,10,10,0.04)",border:"1px solid rgba(10,10,10,0.12)",padding:"7px 9px",...B,fontSize:13,color:C.noir}}/>
                  :<input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={{width:"100%",background:"rgba(10,10,10,0.04)",border:"1px solid rgba(10,10,10,0.12)",padding:"7px 9px",...B,fontSize:13,color:C.noir}}/>
                }
              </div>
            ))}
            <div style={{marginBottom:12}}>
              <div style={{...M,fontSize:8,color:C.noir,opacity:0.4,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5}}>Couleur</div>
              <div style={{display:"flex",gap:8}}>
                {[C.orange,C.rose,C.violet,C.bleu,"#3A8A6A","#0A0A0A"].map(col=>(
                  <div key={col} onClick={()=>setForm({...form,color:col})} style={{width:26,height:26,background:col,cursor:"pointer",border:form.color===col?"3px solid #0A0A0A":"3px solid transparent"}}/>
                ))}
              </div>
            </div>
            <button onClick={save} style={{width:"100%",background:C.orange,color:C.blanc,border:"none",...D,fontSize:18,padding:"11px",cursor:"pointer"}}>ENREGISTRER</button>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {expos.map((e,i)=>(
            <div key={e.id} className="fu" style={{animationDelay:`${i*0.04}s`,background:e.photo?`url(${e.photo}) center/cover`:C.blanc,border:"1.5px solid rgba(10,10,10,0.07)",padding:"14px 13px",cursor:"pointer",position:"relative",overflow:"hidden",minHeight:90}} onClick={()=>onSel(e)}>
              {e.photo&&<div style={{position:"absolute",inset:0,background:"rgba(245,242,237,0.88)"}}/>}
              {stamps[e.id]&&<div style={{position:"absolute",top:8,right:8,width:20,height:20,background:e.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"white",zIndex:2}}>V</div>}
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:e.color}}/>
              <div style={{position:"relative",zIndex:1}}>
                <div style={{...M,fontSize:8,color:e.color,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4,marginTop:3}}>{e.type}</div>
                <div style={{...D,fontSize:15,color:C.noir,lineHeight:1.1,marginBottom:5}}>{e.name}</div>
                <Arr size={13} color={C.noir} style={{opacity:0.2}}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExpoPage({exp,stamped,onStamp,onBack,isAdmin,onUpdate}){
  const [si,setSi]=useState("");
  const [sErr,setSErr]=useState(false);
  const [sOk,setSOk]=useState(false);
  const [edit,setEdit]=useState(false);
  const [form,setForm]=useState({name:exp.name,type:exp.type,desc:exp.desc,code:exp.code,photo:exp.photo,instagram:exp.instagram||"",web:exp.web||""});

  async function compress(file){
    return new Promise(res=>{
      const r=new FileReader();r.readAsDataURL(file);
      r.onload=ev=>{
        const img=new Image();img.src=ev.target.result;
        img.onload=()=>{
          const c=document.createElement("canvas");
          const ratio=Math.min(600/img.width,600/img.height,1);
          c.width=img.width*ratio;c.height=img.height*ratio;
          c.getContext("2d").drawImage(img,0,0,c.width,c.height);
          res(c.toDataURL("image/jpeg",0.75));
        };
      };
    });
  }

  function tryStamp(){
    if(si===exp.code){setSOk(true);onStamp();}
    else{setSErr(true);setTimeout(()=>setSErr(false),1200);}
  }

  return(
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",background:C.beige}}>
      <div style={{padding:"18px 20px"}}>
        <button onClick={onBack} style={{...M,fontSize:9,color:C.noir,opacity:0.4,background:"none",border:"none",cursor:"pointer",marginBottom:14,letterSpacing:"0.1em",textTransform:"uppercase"}}>{"< Exposants"}</button>
        <div style={{...M,fontSize:9,color:exp.color,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:5}}>{exp.type}</div>
        <div style={{...D,fontSize:44,color:C.noir,lineHeight:0.9,marginBottom:10}}>{exp.name}</div>
        <div style={{height:3,width:38,background:exp.color,marginBottom:18}}/>
        <div style={{width:"100%",aspectRatio:"1",background:exp.photo?`url(${exp.photo}) center/cover`:`linear-gradient(160deg,${exp.color}30,${exp.color}10)`,border:"1.5px solid rgba(10,10,10,0.07)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16,position:"relative",overflow:"hidden"}}>
          {!exp.photo&&<div style={{...M,fontSize:9,color:C.noir,opacity:0.25,letterSpacing:"0.1em"}}>PHOTO A VENIR</div>}
          <Arr size={38} color={exp.color} style={{position:"absolute",bottom:10,right:10,opacity:0.3}}/>
        </div>
        <div style={{background:C.blanc,border:"1.5px solid rgba(10,10,10,0.07)",padding:"16px",marginBottom:16}}>
          <div style={{...B,fontSize:14,color:C.noir,lineHeight:1.75,opacity:0.8}}>{exp.desc}</div>
        </div>
        {(exp.instagram||exp.web)&&(
          <div style={{display:"flex",gap:9,marginBottom:16,flexWrap:"wrap"}}>
            {exp.instagram&&(
              <button onClick={()=>window.open("https://instagram.com/"+exp.instagram.replace("@",""))}
                style={{background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",color:"white",border:"none",...M,fontSize:10,padding:"9px 16px",cursor:"pointer",letterSpacing:"0.08em"}}>
                {exp.instagram}
              </button>
            )}
            {exp.web&&(
              <button onClick={()=>window.open(exp.web.startsWith("http")?exp.web:"https://"+exp.web)}
                style={{background:C.noir,color:C.blanc,border:"none",...M,fontSize:10,padding:"9px 16px",cursor:"pointer",letterSpacing:"0.08em"}}>
                SITE WEB
              </button>
            )}
          </div>
        )}
        {!stamped&&!sOk&&(
          <div style={{background:C.noir,padding:"16px",marginBottom:16}}>
            <div style={{...D,fontSize:17,color:C.blanc,marginBottom:3}}>TAMPONNER CE STAND</div>
            <div style={{...B,fontSize:12,color:"rgba(245,242,237,0.5)",marginBottom:12}}>Demande le code a l'exposant</div>
            <div style={{display:"flex",gap:8}}>
              <input value={si} onChange={e=>setSi(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")tryStamp();}} placeholder="Code 4 chiffres" maxLength={4}
                style={{flex:1,background:"rgba(245,242,237,0.08)",border:"1px solid "+(sErr?"#E8622A":"rgba(245,242,237,0.15)"),color:C.blanc,...M,fontSize:18,padding:"9px 11px",textAlign:"center",letterSpacing:"0.2em"}}/>
              <button onClick={tryStamp} style={{background:C.orange,color:C.blanc,border:"none",...M,fontSize:11,padding:"9px 13px",cursor:"pointer"}}>OK</button>
            </div>
            {sErr&&<div style={{...M,fontSize:10,color:C.orange,marginTop:5}}>Code incorrect</div>}
          </div>
        )}
        {(stamped||sOk)&&(
          <div className="pop" style={{background:exp.color,padding:"16px",marginBottom:16,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:4}}>V</div>
            <div style={{...D,fontSize:20,color:C.blanc}}>STAND VISITE !</div>
          </div>
        )}
        {isAdmin&&(
          <>
            <button onClick={()=>setEdit(v=>!v)} style={{width:"100%",background:"rgba(232,98,42,0.08)",border:"1px dashed rgba(232,98,42,0.4)",color:C.orange,...M,fontSize:10,padding:"9px",cursor:"pointer",marginBottom:10,letterSpacing:"0.1em",textTransform:"uppercase"}}>
              {edit?"Fermer":"Modifier (Admin)"}
            </button>
            {edit&&(
              <div style={{background:C.blanc,border:"2px solid #E8622A",padding:"16px",marginBottom:10}}>
                <div style={{marginBottom:12}}>
                  <div style={{...M,fontSize:8,color:C.noir,opacity:0.4,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5}}>Photo</div>
                  <label style={{display:"block",cursor:"pointer"}}>
                    <div style={{height:90,background:form.photo?`url(${form.photo}) center/cover`:C.beige,border:"2px dashed "+(form.photo?"transparent":"rgba(10,10,10,0.2)"),display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {!form.photo&&<span style={{...M,fontSize:11,color:C.noir,opacity:0.35}}>Taper pour photo</span>}
                    </div>
                    <input type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{
                      const f=e.target.files[0];if(!f)return;
                      const c=await compress(f);setForm(x=>({...x,photo:c}));
                    }}/>
                  </label>
                  {form.photo&&<button onClick={()=>setForm(x=>({...x,photo:null}))} style={{background:"none",border:"none",color:C.orange,...M,fontSize:10,cursor:"pointer",marginTop:2}}>Supprimer</button>}
                </div>
                {[["Nom","name"],["Type","type"],["Description","desc"],["Code visiteur","code"],["Instagram (ex: @stand)","instagram"],["Site web (ex: monsite.be)","web"]].map(([lbl,key])=>(
                  <div key={key} style={{marginBottom:10}}>
                    <div style={{...M,fontSize:8,color:C.noir,opacity:0.4,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:3}}>{lbl}</div>
                    {key==="desc"
                      ?<textarea value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} rows={2} style={{width:"100%",background:"rgba(10,10,10,0.04)",border:"1px solid rgba(10,10,10,0.12)",padding:"7px 9px",...B,fontSize:13,color:C.noir}}/>
                      :<input value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={{width:"100%",background:"rgba(10,10,10,0.04)",border:"1px solid rgba(10,10,10,0.12)",padding:"7px 9px",...B,fontSize:13,color:C.noir}}/>
                    }
                  </div>
                ))}
                <button onClick={()=>{onUpdate({...exp,...form});setEdit(false);}} style={{width:"100%",background:C.orange,color:C.blanc,border:"none",...D,fontSize:18,padding:"11px",cursor:"pointer"}}>ENREGISTRER</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Explore({myEggs,eggCount,globalEggs,onFind,photos,onAddPhoto,visitor}){
  const [sec,setSec]=useState("eggs");
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:C.beige}}>
      <div style={{display:"flex",background:C.blanc,borderBottom:"1.5px solid rgba(10,10,10,0.08)",flexShrink:0}}>
        {[["eggs","Chasse aux oeufs"],["mural","Mural photo"]].map(([id,lb])=>(
          <button key={id} onClick={()=>setSec(id)} style={{flex:1,padding:"12px 0",background:"none",border:"none",cursor:"pointer",borderBottom:sec===id?"3px solid #E8622A":"3px solid transparent"}}>
            <span style={{...M,fontSize:10,color:sec===id?C.orange:C.noir,opacity:sec===id?1:0.4,fontWeight:sec===id?700:400,letterSpacing:"0.08em",textTransform:"uppercase"}}>{lb}</span>
          </button>
        ))}
      </div>
      <div style={{flex:1,overflow:"hidden"}}>
        {sec==="eggs"&&<Eggs myEggs={myEggs} eggCount={eggCount} globalEggs={globalEggs} onFind={onFind}/>}
        {sec==="mural"&&<Mural photos={photos} onAddPhoto={onAddPhoto} visitor={visitor}/>}
      </div>
    </div>
  );
}

function Eggs({myEggs,eggCount,globalEggs,onFind}){
  const [code,setCode]=useState("");
  const [res,setRes]=useState(null);
  const [loading,setLoading]=useState(false);
  function go(){
    if(!code.trim())return;
    setLoading(true);
    setTimeout(()=>{
      const r=onFind(code);setRes(r);setLoading(false);
      if(r==="found")setCode("");
    },400);
  }
  return(
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"18px",background:C.beige,position:"relative"}}>
      <Grid op={0.06}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{background:C.noir,padding:"18px",marginBottom:16,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:C.gradB,opacity:0.12}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{...D,fontSize:32,color:C.blanc,lineHeight:0.9,marginBottom:10}}>CHASSE AUX OEUFS</div>
            <div style={{...B,fontSize:13,color:"rgba(245,242,237,0.75)",lineHeight:1.7,marginBottom:12}}>
              Des oeufs en chocolat sont disperses dans le NOVUM. <strong style={{color:C.blanc}}>10 d'entre eux sont speciaux</strong> -- ils portent un code. Tu peux manger les autres !
            </div>
            <div style={{padding:"10px 12px",background:"rgba(232,98,42,0.25)",border:"1px solid rgba(232,98,42,0.4)"}}>
              <div style={{...M,fontSize:10,color:C.orange,fontWeight:700,letterSpacing:"0.1em",marginBottom:3}}>TROUVE 3 OEUFS SPECIAUX</div>
              <div style={{...B,fontSize:12,color:"rgba(245,242,237,0.7)"}}>Va au stand eRReurProductions pour ton prix !</div>
            </div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          <div style={{background:C.blanc,border:"1.5px solid rgba(10,10,10,0.07)",padding:"14px 16px",textAlign:"center"}}>
            <div style={{...M,fontSize:8,color:C.noir,opacity:0.35,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5}}>Mes oeufs</div>
            <div style={{...D,fontSize:48,color:C.orange,lineHeight:1}}>{eggCount}</div>
            <div style={{...M,fontSize:9,color:C.noir,opacity:0.35,marginTop:3}}>sur 10</div>
            {eggCount>=3&&<div style={{...M,fontSize:9,background:C.orange,color:C.blanc,padding:"3px 8px",marginTop:6,letterSpacing:"0.08em"}}>PRIX DISPONIBLE</div>}
          </div>
          <div style={{background:C.noir,padding:"14px 16px",textAlign:"center",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,background:C.gradB,opacity:0.15}}/>
            <div style={{position:"relative",zIndex:1}}>
              <div style={{...M,fontSize:8,color:"rgba(245,242,237,0.4)",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5}}>Total trouves</div>
              <div style={{...D,fontSize:48,color:C.blanc,lineHeight:1}}>{globalEggs}</div>
              <div style={{...M,fontSize:9,color:"rgba(245,242,237,0.35)",marginTop:3}}>par tous</div>
            </div>
          </div>
        </div>
        <div style={{background:C.blanc,border:"1.5px solid rgba(10,10,10,0.07)",padding:"13px 15px",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <div style={{...M,fontSize:9,color:C.noir,opacity:0.38,letterSpacing:"0.1em",textTransform:"uppercase"}}>Ta progression</div>
            <div style={{...M,fontSize:9,color:eggCount>=3?C.orange:C.noir,opacity:eggCount>=3?1:0.38}}>
              {eggCount>=3?"Prix disponible !":eggCount>=1?"encore "+(3-eggCount)+" pour le prix":"Commence la chasse !"}
            </div>
          </div>
          <div style={{background:"rgba(10,10,10,0.07)",height:6,marginBottom:8}}>
            <div style={{width:Math.min(100,(eggCount/3)*100)+"%",height:6,background:eggCount>=3?C.orange:C.gradient,transition:"width 0.5s"}}/>
          </div>
          <div style={{display:"flex",gap:6}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{width:28,height:28,background:myEggs[i]?C.orange:"rgba(10,10,10,0.06)",border:"1.5px solid "+(myEggs[i]?C.orange:"rgba(10,10,10,0.1)"),display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s"}}>
                {myEggs[i]?"-":""}
              </div>
            ))}
          </div>
        </div>
        <div style={{background:C.blanc,border:"1.5px solid rgba(10,10,10,0.07)",padding:"16px",marginBottom:14}}>
          <div style={{...D,fontSize:18,color:C.noir,marginBottom:10}}>ENTRER UN CODE</div>
          <div style={{display:"flex",gap:8}}>
            <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} onKeyDown={e=>{if(e.key==="Enter")go();}} placeholder="Ex: OEUF03" maxLength={8}
              style={{flex:1,background:"rgba(10,10,10,0.04)",border:"1px solid rgba(10,10,10,0.12)",color:C.noir,...M,fontSize:16,padding:"10px 12px",textTransform:"uppercase",letterSpacing:"0.1em"}}/>
            <button onClick={go} style={{background:C.noir,color:C.blanc,border:"none",...D,fontSize:18,padding:"10px 16px",cursor:"pointer"}}>
              {loading?"...":">"}
            </button>
          </div>
        </div>
        {res&&(
          <div className="pop" style={{background:res==="found"?C.orange:"rgba(10,10,10,0.06)",padding:"14px 16px",marginBottom:14}}>
            {res==="found"&&<div style={{...D,fontSize:22,color:C.blanc}}>OEUF SPECIAL TROUVE !</div>}
            {res==="already"&&<div style={{...D,fontSize:18,color:C.noir}}>Deja trouve !</div>}
            {res==="invalid"&&<div style={{...D,fontSize:18,color:C.rose}}>Code invalide</div>}
          </div>
        )}
        {eggCount>0&&(
          <div style={{background:C.blanc,border:"1.5px solid rgba(10,10,10,0.07)",padding:"13px 15px"}}>
            <div style={{...M,fontSize:9,color:C.noir,opacity:0.38,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>Tes oeufs trouves</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {myEggs.map((c,i)=>(
                <div key={c} style={{background:C.orange,padding:"4px 10px"}}>
                  <span style={{...M,fontSize:9,color:C.blanc}}>{"#"+(i+1)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Mural({photos,onAddPhoto,visitor}){
  const [adding,setAdding]=useState(false);
  const [caption,setCaption]=useState("");
  const [preview,setPreview]=useState(null);
  const [cloudUrl,setCloudUrl]=useState(null);
  const [uploading,setUploading]=useState(false);
  const [fs,setFs]=useState(false);

  function save(){
  if(!caption.trim())return;
  if(!cloudUrl){
    alert("Aguarda o fim do upload da foto antes de publicar.");
    return;
  }
  onAddPhoto(cloudUrl,caption);
  setCaption("");setPreview(null);setCloudUrl(null);setAdding(false);
}

  if(fs)return(
    <div style={{position:"fixed",inset:0,background:C.noir,zIndex:500,overflow:"hidden"}}>
      <button onClick={()=>setFs(false)} style={{position:"absolute",top:20,right:20,background:"none",border:"none",color:C.blanc,fontSize:24,cursor:"pointer",zIndex:10}}>X</button>
      <div style={{...D,fontSize:26,color:C.blanc,position:"absolute",top:18,left:18,zIndex:10}}>MURAL LIVE</div>
      <div style={{height:"100%",overflowY:"auto",padding:"56px 8px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:3}}>
          {photos.slice().reverse().map(p=>(
            <div key={p.id} style={{aspectRatio:"1",background:p.url&&p.url!=="placeholder"?`url(${p.url}) center/cover`:`linear-gradient(135deg,${C.orange}44,${C.violet}44)`,position:"relative",overflow:"hidden"}}>
              {(!p.url||p.url==="placeholder")&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:C.blanc,...M,fontSize:10}}>img</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return(
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"18px",background:C.beige,position:"relative"}}>
      <Grid op={0.06}/>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:5}}>
          <div style={{...D,fontSize:34,color:C.noir,lineHeight:0.9}}>MURAL COLLECTIF</div>
          <button onClick={()=>setFs(true)} style={{...M,fontSize:8,background:C.noir,color:C.blanc,border:"none",padding:"6px 11px",cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase"}}>PLEIN ECRAN</button>
        </div>
        <div style={{height:2,background:C.gradient,width:"55%",marginBottom:14}}/>
        <div style={{...B,fontSize:12,color:C.noir,opacity:0.45,marginBottom:14}}>Partage ton regard sur le Marche Creatif.</div>
        {!adding?(
          <button onClick={()=>setAdding(true)} style={{width:"100%",background:C.noir,color:C.blanc,border:"none",...D,fontSize:20,padding:"13px 17px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <span>AJOUTER UNE PHOTO</span>
          </button>
        ):(
          <div style={{background:C.blanc,border:"1.5px solid rgba(10,10,10,0.1)",padding:"16px",marginBottom:16}}>
            <div style={{...D,fontSize:17,color:C.noir,marginBottom:11}}>NOUVELLE PHOTO</div>
            <label style={{display:"block",cursor:"pointer",marginBottom:11}}>
              <div style={{aspectRatio:"1",background:preview&&preview!=="placeholder"?`url(${preview}) center/cover`:C.beige,border:"2px dashed "+(preview?"transparent":"rgba(10,10,10,0.2)"),display:"flex",alignItems:"center",justifyContent:"center"}}>
                {!preview&&<span style={{...M,fontSize:11,color:C.noir,opacity:0.35}}>Prendre ou choisir une photo</span>}
              </div>
              <input type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={async e=>{
  const f=e.target.files[0];if(!f)return;
  // preview local imediato
  setUploading(true);
  setCloudUrl(null);
  const reader=new FileReader();reader.readAsDataURL(f);
  reader.onload=ev=>setPreview(ev.target.result);
  // upload para Cloudinary
  try{
    const blob=await new Promise(res=>{
      const r=new FileReader();r.readAsDataURL(f);
      r.onload=ev=>{
        const img=new Image();img.src=ev.target.result;
        img.onload=()=>{
          const canvas=document.createElement("canvas");
          const ratio=Math.min(1200/img.width,1200/img.height,1);
          canvas.width=img.width*ratio;canvas.height=img.height*ratio;
          canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
          canvas.toBlob(b=>res(b),"image/jpeg",0.8);
        };
      };
    });
    const fd=new FormData();
    fd.append("file",blob,"photo.jpg");
    fd.append("upload_preset",import.meta.env.VITE_CLOUDINARY_PRESET||"marche_photos");
    fd.append("folder","marche_creatif");
    const res=await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD}/image/upload`,{method:"POST",body:fd});
    const data=await res.json();
    if(data.secure_url){
    setPreview(data.secure_url);
    setCloudUrl(data.secure_url);
    }
setUploading(false);
  }catch(err){console.log("Cloudinary erro:",err);}
}}/>
            </label>
            <input value={caption} onChange={e=>setCaption(e.target.value)} placeholder="Decris ce moment..." style={{width:"100%",background:"rgba(10,10,10,0.04)",border:"1px solid rgba(10,10,10,0.12)",padding:"8px 10px",...B,fontSize:13,color:C.noir,marginBottom:10}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={save} disabled={!caption.trim()||!cloudUrl||uploading} style={{flex:1,background:caption.trim()&&cloudUrl&&!uploading?C.orange:"#ccc",color:caption.trim()&&cloudUrl&&!uploading?C.blanc:"#999",border:"none",...D,fontSize:17,padding:"11px",cursor:caption.trim()&&cloudUrl&&!uploading?"pointer":"default"}}>
  {uploading?"A carregar...":!cloudUrl&&preview?"A processar...":"PUBLIER"}
</button>
              <button onClick={()=>{setAdding(false);setCaption("");setPreview(null);}} style={{background:"rgba(10,10,10,0.08)",color:C.noir,border:"none",...M,fontSize:10,padding:"11px 14px",cursor:"pointer"}}>X</button>
            </div>
          </div>
        )}
        {photos.length===0?(
          <div style={{textAlign:"center",padding:"28px 0"}}>
            <div style={{...B,fontSize:13,color:C.noir,opacity:0.35,lineHeight:1.6}}>Le mural est vide. Sois le/la premier(e) a contribuer !</div>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
            {photos.slice().reverse().map((p,i)=>(
              <div key={p.id} className="fu" style={{animationDelay:`${i*0.04}s`,background:C.blanc,border:"1.5px solid rgba(10,10,10,0.07)",overflow:"hidden"}}>
                <div style={{aspectRatio:"1",background:p.url&&p.url!=="placeholder"?`url(${p.url}) center/cover`:`linear-gradient(135deg,${C.orange}33,${C.violet}33)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                </div>
                <div style={{padding:"9px 10px"}}>
                  <div style={{...B,fontSize:11,color:C.noir,lineHeight:1.4,marginBottom:4}}>{p.caption}</div>
                  <div style={{...M,fontSize:9,color:C.noir,opacity:0.3}}>{p.author} - {p.at}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Infos(){
  const rows=[
    {l:"Adresse",v:"Rue Pere Eudore Devroye, 2\n1040 Ixelles, Bruxelles\nQuartier Montgomery"},
    {l:"Date",v:"Dimanche 5 avril 2026"},
    {l:"Horaires",v:"12h00 - 22h00"},
    {l:"Entree",v:"Paye ce que tu peux\n5 EUR - 10 EUR - 15 EUR"},
    {l:"Nous preferons le cash",v:"Merci de privilegier le paiement en especes.\nTerminal disponible si necessaire.",hi:true},
    {l:"Transports",v:"Tram 7 ou 25 - arret Boileau\nMetro - arret Montgomery\nBus 36 - arret Boileau"},
    {l:"Parking",v:"Disponible - Entree via rue Pere Eudore Devroye 12"},
    {l:"Accessibilite",v:"Hall et sanitaires accessibles PMR"},
    {l:"Bar",v:"Bar ouvert toute la journee\nBoissons et Snacks"},
    {l:"Chasse aux oeufs",v:"10 oeufs speciaux dans le NOVUM\nTrouve 3 codes pour un prix !"},
  ];
  return(
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",background:C.beige,position:"relative"}}>
      <Grid op={0.06}/>
      <div style={{padding:"20px 18px",position:"relative",zIndex:1}}>
        <div style={{marginBottom:18}}>
          <div style={{...D,fontSize:42,color:C.noir,lineHeight:0.9,marginBottom:7}}>INFOS PRATIQUES</div>
          <div style={{height:2,background:C.gradient,width:"55%"}}/>
        </div>
        {rows.map((r,i)=>(
          <div key={i} className="fu" style={{animationDelay:`${i*0.03}s`,background:r.hi?"rgba(232,98,42,0.08)":C.blanc,border:r.hi?"1.5px solid rgba(232,98,42,0.25)":"1.5px solid rgba(10,10,10,0.07)",padding:"13px 15px",marginBottom:8,display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:20,height:20,background:r.hi?C.orange:C.noir,borderRadius:2,flexShrink:0,marginTop:2}}/>
            <div>
              <div style={{...M,fontSize:8,color:r.hi?C.orange:C.noir,opacity:r.hi?1:0.33,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:3,fontWeight:r.hi?700:400}}>{r.l}</div>
              <div style={{...B,fontSize:13,color:C.noir,lineHeight:1.6,whiteSpace:"pre-line",fontWeight:r.hi?600:400}}>{r.v}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Novum(){
  const [sec,setSec]=useState("discover");
  const disc=[
    {t:"Art Deco - 1932",d:"Inaugure en 1932, le NOVUM porte encore les ornements Art Deco. Leve les yeux en entrant -- les reliefs en stuc des plafonds datent de l'epoque.",c:"A observer"},
    {t:"Grande salle - 1100 places",d:"Concue pour l'opera classique, son acoustique est exceptionnelle. Ecoute les basses de la salle principale ce soir.",c:"A ressentir"},
    {t:"Le bar historique",d:"Boiseries d'epoque, lumieres tamisees. Le meilleur endroit pour rencontrer les artistes apres leurs sets.",c:"A decouvrir"},
    {t:"Details caches",d:"Regarde les carrelages Art Deco dans les couloirs et les reliefs en stuc. Les batisseurs de 1932 avaient de l'ambition.",c:"A chercher"},
    {t:"La cour interieure",d:"Peu de visiteurs la trouvent : une cour accessible depuis le couloir lateral. Ideale pour une pause.",c:"A explorer"},
    {t:"Acoustique secrete",d:"Dans certains couloirs, les sons resonnent de facon circulaire. Teste en chuchotant contre le mur du fond du hall.",c:"A experimenter"},
  ];
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",background:C.noir}}>
      <div style={{background:C.noir,padding:"18px 18px 0",flexShrink:0,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:C.gradB,opacity:0.12}}/>
        <Grid op={0.08} col="245,242,237"/>
        <div style={{position:"relative",zIndex:1,marginBottom:12}}>
          <div style={{...D,fontSize:58,color:C.blanc,lineHeight:0.88,marginBottom:4}}>NOVUM</div>
          <div style={{height:3,background:C.gradient,width:"35%",marginBottom:7}}/>
          <div style={{...M,fontSize:9,color:"rgba(245,242,237,0.65)",letterSpacing:"0.15em",textTransform:"uppercase"}}>Theatre Art Deco - Bruxelles - Depuis 1932</div>
        </div>
        <div style={{display:"flex",gap:1,position:"relative",zIndex:1}}>
          {[["discover","Decouvrir"],["info","Pratique"],["histoire","Histoire"]].map(([id,lb])=>(
            <button key={id} onClick={()=>setSec(id)} style={{flex:1,background:sec===id?"rgba(245,242,237,0.07)":"transparent",border:"none",borderBottom:sec===id?"2px solid #E8622A":"2px solid transparent",padding:"8px 0 10px",cursor:"pointer"}}>
              <span style={{...M,fontSize:9,color:sec===id?C.blanc:"rgba(245,242,237,0.6)",letterSpacing:"0.08em",textTransform:"uppercase"}}>{lb}</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
        {sec==="discover"&&(
          <div style={{padding:"18px"}}>
            <div style={{...B,fontSize:13,color:"rgba(245,242,237,0.75)",lineHeight:1.7,marginBottom:18}}>Le NOVUM ne se visite pas -- il se decouvre. 6 experiences a vivre ce soir.</div>
            {disc.map((d,i)=>(
              <div key={i} className="fu" style={{animationDelay:`${i*0.06}s`,background:"rgba(245,242,237,0.04)",border:"1px solid rgba(245,242,237,0.07)",padding:"14px",marginBottom:9,position:"relative"}}>
                <div style={{position:"absolute",top:0,left:0,width:3,bottom:0,background:C.gradient}}/>
                <div style={{paddingLeft:10}}>
                  <div style={{...D,fontSize:17,color:C.blanc,marginBottom:4}}>{d.t}</div>
                  <div style={{...B,fontSize:12,color:"rgba(245,242,237,0.75)",lineHeight:1.65,marginBottom:7}}>{d.d}</div>
                  <div style={{...M,fontSize:8,background:"rgba(232,98,42,0.2)",color:C.orange,padding:"3px 8px",display:"inline-block",letterSpacing:"0.1em"}}>{d.c}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {sec==="info"&&(
          <div style={{padding:"18px"}}>
            {[
              {l:"Adresse",v:"Rue Pere Eudore Devroye, 2\n1040 Bruxelles - Quartier Montgomery"},
              {l:"Transports",v:"Tram 7 ou 25 - arret Boileau\nMetro - arret Montgomery ou Thieffry\nBus 36 - arret Boileau"},
              {l:"Parking",v:"Disponible lors des evenements\nEntree via rue Pere Eudore Devroye, 12"},
              {l:"Capacite",v:"Grande salle : 1100 places\nHall festif modulable"},
              {l:"Acces PMR",v:"Hall et sanitaires accessibles"},
              {l:"Bar",v:"Ouvert 1h avant les evenements\nBoissons et Snacks"},
            ].map((r,i)=>(
              <div key={i} style={{background:"rgba(245,242,237,0.04)",border:"1px solid rgba(245,242,237,0.06)",padding:"13px 15px",marginBottom:8}}>
                <div style={{...M,fontSize:8,color:"rgba(245,242,237,0.33)",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:3}}>{r.l}</div>
                <div style={{...B,fontSize:13,color:"rgba(245,242,237,0.88)",lineHeight:1.6,whiteSpace:"pre-line"}}>{r.v}</div>
              </div>
            ))}
            <button onClick={()=>window.open("https://www.novum.brussels")} style={{width:"100%",background:C.orange,border:"none",color:C.blanc,...D,fontSize:19,padding:"13px 18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:6}}>
              <span>SITE DU NOVUM</span><Arr size={18} color={C.blanc}/>
            </button>
          </div>
        )}
        {sec==="histoire"&&(
          <div style={{padding:"18px"}}>
            {[
              {y:"1932",t:"Fondation",v:"Inaugure en 1932 sous le nom de Theatre Saint-Michel, le batiment Art Deco etait destine aux grandes productions lyriques de la capitale belge."},
              {y:"100 ans",t:"Un siecle de spectacles",v:"Pendant pres d'un siecle, le Theatre Saint-Michel a traverse les grandes transformations culturelles de Bruxelles, preservant toujours son ame Art Deco."},
              {y:"Aujourd'hui",t:"NOVUM",v:"Rebaptise NOVUM, le lieu accueille aujourd'hui theatre, musique, expositions et evenements. Ce soir, il accueille le Marche Creatif d'eRReurProductions."},
            ].map((r,i)=>(
              <div key={i} style={{background:"rgba(245,242,237,0.04)",border:"1px solid rgba(245,242,237,0.07)",padding:"18px",marginBottom:12}}>
                <div style={{...D,fontSize:32,color:C.blanc,marginBottom:4}}>{r.y}</div>
                <div style={{...M,fontSize:9,color:"rgba(245,242,237,0.4)",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>{r.t}</div>
                <div style={{...B,fontSize:13,color:"rgba(245,242,237,0.82)",lineHeight:1.75}}>{r.v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Erreur(){
  return(
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",background:C.beige,position:"relative"}}>
      <Grid op={0.06}/>
      <div style={{padding:"22px 20px",position:"relative",zIndex:1}}>
        <div style={{marginBottom:20,position:"relative"}}>
          <div style={{...D,fontSize:46,color:C.noir,lineHeight:0.88,marginBottom:4}}>eRReur Productions</div>
          <Arr size={48} color={C.noir} style={{position:"absolute",top:0,right:0,opacity:0.1}}/>
          <div style={{height:3,background:C.gradient,width:"70%",marginTop:12}}/>
        </div>
        <div style={{background:C.noir,padding:"18px",marginBottom:13,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",inset:0,background:C.gradB,opacity:0.14}}/>
          <div style={{...M,fontSize:9,color:"rgba(245,242,237,0.38)",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:5,position:"relative",zIndex:1}}>Philosophie</div>
          <div style={{...D,fontSize:22,color:C.blanc,lineHeight:1.2,position:"relative",zIndex:1}}>WE DON'T ONLY PRODUCE MISTAKES</div>
        </div>
        <div style={{background:C.blanc,border:"1.5px solid rgba(10,10,10,0.07)",padding:"16px",marginBottom:13}}>
          <div style={{...B,fontSize:14,color:C.noir,lineHeight:1.75,opacity:0.88}}>eRReurProductions est une structure de production independante basee a Bruxelles, fondee par Rita Rodrigues. Elle produit courts metrages, documentaires, clips musicaux et evenements selon une approche d'auteur.</div>
        </div>
        <div style={{background:C.blanc,border:"1.5px solid rgba(10,10,10,0.07)",padding:"16px",marginBottom:13}}>
          <div style={{...M,fontSize:9,color:C.noir,opacity:0.33,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:7}}>Fondatrice</div>
          <div style={{...D,fontSize:26,color:C.noir,marginBottom:7}}>Rita Rodrigues</div>
          <div style={{...B,fontSize:13,color:C.noir,lineHeight:1.75,opacity:0.82}}>Productrice et realisatrice basee a Bruxelles. Avant de fonder eRReurProductions, elle a travaille comme actrice puis comme script supervisor. Son travail est influence par le cinema d'auteur.</div>
        </div>
        <div style={{...M,fontSize:9,color:C.noir,opacity:0.33,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:9}}>Formats de production</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
          {["Courts metrages","Documentaires","Clips musicaux","Evenements"].map(f=>(
            <div key={f} style={{background:C.blanc,border:"1.5px solid rgba(10,10,10,0.07)",padding:"13px 11px"}}>
              <div style={{...B,fontSize:12,color:C.noir,fontWeight:500}}>{f}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:9}}>
          <button onClick={()=>window.open("https://erreurproductions.com")} style={{flex:1,background:C.noir,color:C.blanc,border:"none",...D,fontSize:18,padding:"13px 0",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
            SITE WEB <Arr size={15} color={C.blanc}/>
          </button>
          <button onClick={()=>window.open("https://instagram.com/erreurproductions")} style={{flex:1,background:"none",color:C.noir,border:"2px solid #0A0A0A",...D,fontSize:18,padding:"13px 0",cursor:"pointer"}}>
            INSTAGRAM
          </button>
        </div>
      </div>
    </div>
  );
}

const SYS="Tu es L Erreur -- la voix editoriale du Marche Creatif organise par eRReurProductions au NOVUM a Bruxelles, le 5 avril 2026. Voix editoriale, precise, culturelle, chaleureuse. DJS: 15h KHAMMIX (Bouncy Trance), 16h30 KASS L (Tech House), 18h MICROPIA (Deep House), 19h30 REXORDER (DNB), 21h FRKS (Closing). NOVUM: Theatre Art Deco 1932, Rue Pere Eudore Devroye 2, 1040 Bruxelles. Chasse aux oeufs: 10 oeufs speciaux, 3 = prix chez eRReur. Cash uniquement sur place. Reponds TOUJOURS en francais, 2-5 phrases.";

function AI({visitor}){
  const [msgs,setMsgs]=useState(()=>{
    try{const s=localStorage.getItem("mc2-ai");return s?JSON.parse(s):[];}catch(_){return [];}
  });
  const [inp,setInp]=useState("");
  const [loading,setLoading]=useState(false);
  const [dots,setDots]=useState(".");
  const end=useRef(null);

  useEffect(()=>{end.current?.scrollIntoView({behavior:"smooth"});},[msgs,loading]);
  useEffect(()=>{
    if(!loading)return;
    const t=setInterval(()=>setDots(d=>d.length>=3?".":d+"."),400);
    return()=>clearInterval(t);
  },[loading]);

  const QK=[
    {l:"Quel DJ ecouter ?",m:"Quel DJ recommandes-tu a ce moment de la journee ?"},
    {l:"Par ou commencer ?",m:"Je viens d'arriver. Par ou commencer ?"},
    {l:"Indice pour les oeufs ?",m:"Un indice pour trouver les oeufs speciaux ?"},
    {l:"Le NOVUM ?",m:"Dis-moi quelque chose sur le NOVUM."},
    {l:"eRReur Productions ?",m:"Parle-moi d'eRReurProductions et de Rita Rodrigues."},
    {l:"Paiement ?",m:"Est-ce qu'on peut payer par carte sur place ?"},
  ];

  async function send(text){
    const msg=(text||inp).trim();if(!msg||loading)return;
    setInp("");
    const nm=[...msgs,{role:"user",content:msg}];
    setMsgs(nm);setLoading(true);
    try{
      const r=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json","x-api-key":ANTHROPIC_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:SYS,messages:nm.map(m=>({role:m.role,content:m.content}))}),
      });
      const data=await r.json();
      const reply=data.content?.[0]?.text||"Une erreur est survenue.";
      const finalMsgs=[...nm,{role:"assistant",content:reply}];
      setMsgs(finalMsgs);
      try{localStorage.setItem("mc2-ai",JSON.stringify(finalMsgs));}catch(_){}
    }catch(_){
      const errMsgs=[...nm,{role:"assistant",content:"Connexion interrompue. Reessaie."}];
      setMsgs(errMsgs);
      try{localStorage.setItem("mc2-ai",JSON.stringify(errMsgs));}catch(_){}
    }
    setLoading(false);
  }

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",background:C.noir,overflow:"hidden"}}>
      <div style={{background:C.noir,borderBottom:"1px solid rgba(245,242,237,0.08)",padding:"12px 16px",flexShrink:0,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:C.gradB,opacity:0.1}}/>
        <div style={{position:"relative",zIndex:1,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{...D,fontSize:24,color:C.blanc,lineHeight:1}}>L'ERREUR</div>
            <div style={{...M,fontSize:9,color:"rgba(245,242,237,0.65)",letterSpacing:"0.1em",marginTop:1}}>Voix editoriale - eRReurProductions</div>
          </div>
          <div style={{width:34,height:34,background:C.gradB,display:"flex",alignItems:"center",justifyContent:"center",color:C.blanc,...D,fontSize:20}}>*</div>
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"14px 14px 8px"}}>
          {msgs.length===0&&(
            <div style={{textAlign:"center",padding:"14px 0 18px"}}>
              <div style={{...D,fontSize:20,color:C.blanc,marginBottom:5}}>Bonjour {visitor?.name} !</div>
              <div style={{...B,fontSize:13,color:"rgba(245,242,237,0.5)",lineHeight:1.7,marginBottom:14}}>Je suis L'Erreur -- guide editorial du Marche Creatif. Pose-moi n'importe quelle question.</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
                {QK.map((q,i)=>(
                  <button key={i} onClick={()=>send(q.m)} style={{background:"rgba(245,242,237,0.07)",border:"1px solid rgba(245,242,237,0.2)",color:"rgba(245,242,237,0.85)",...M,fontSize:9,padding:"5px 9px",cursor:"pointer"}}>{q.l}</button>
                ))}
              </div>
            </div>
          )}
          {msgs.map((m,i)=>(
            <div key={i} className="fu" style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start",marginBottom:11}}>
              {m.role==="assistant"&&(
                <div style={{display:"flex",alignItems:"flex-end",gap:7,maxWidth:"88%"}}>
                  <div style={{width:24,height:24,background:C.gradB,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.blanc,flexShrink:0,marginBottom:2,...D}}>*</div>
                  <div style={{background:"rgba(245,242,237,0.06)",border:"1px solid rgba(245,242,237,0.07)",borderRadius:"14px 14px 14px 4px",padding:"10px 13px"}}>
                    <div style={{...B,fontSize:13,color:"rgba(245,242,237,0.92)",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{m.content}</div>
                  </div>
                </div>
              )}
              {m.role==="user"&&(
                <div style={{background:C.orange,borderRadius:"14px 14px 4px 14px",padding:"10px 13px",maxWidth:"80%"}}>
                  <div style={{...B,fontSize:13,color:C.blanc,lineHeight:1.6}}>{m.content}</div>
                </div>
              )}
            </div>
          ))}
          {loading&&(
            <div style={{display:"flex",alignItems:"flex-end",gap:7,marginBottom:11}}>
              <div style={{width:24,height:24,background:C.gradB,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.blanc,flexShrink:0,...D}}>*</div>
              <div style={{background:"rgba(245,242,237,0.06)",border:"1px solid rgba(245,242,237,0.07)",borderRadius:"14px 14px 14px 4px",padding:"10px 13px"}}>
                <div style={{...M,fontSize:11,color:"rgba(245,242,237,0.6)",fontStyle:"italic"}}>L'Erreur reflechit{dots}</div>
              </div>
            </div>
          )}
          <div ref={end}/>
        </div>
        {msgs.length>0&&(
          <div style={{padding:"0 10px 5px",flexShrink:0}}>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {QK.slice(0,3).map((q,i)=>(
                <button key={i} onClick={()=>send(q.m)} style={{background:"rgba(245,242,237,0.05)",border:"1px solid rgba(245,242,237,0.2)",color:"rgba(245,242,237,0.75)",...M,fontSize:8,padding:"4px 8px",cursor:"pointer"}}>{q.l}</button>
              ))}
            </div>
          </div>
        )}
        <div style={{padding:"7px 11px 13px",background:"rgba(245,242,237,0.03)",borderTop:"1px solid rgba(245,242,237,0.06)",flexShrink:0}}>
          <div style={{display:"flex",gap:7,alignItems:"flex-end"}}>
            <div style={{flex:1,background:"rgba(245,242,237,0.06)",border:"1px solid rgba(245,242,237,0.09)",padding:"8px 12px"}}>
              <textarea value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Pose ta question..." rows={1} style={{width:"100%",background:"none",border:"none",fontSize:13,color:C.blanc,...B,lineHeight:1.5,maxHeight:80,overflow:"auto"}}/>
            </div>
            <button onClick={()=>send()} disabled={!inp.trim()||loading} style={{width:40,height:40,background:inp.trim()&&!loading?C.orange:"rgba(245,242,237,0.07)",border:"none",cursor:inp.trim()&&!loading?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,color:C.blanc}}>
              {loading?"...":">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
