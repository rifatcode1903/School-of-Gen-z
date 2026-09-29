const canvas=document.getElementById("frameCanvas"),ctx=canvas.getContext("2d");

const photoInput=document.getElementById("photoInput"),
dropzone=document.getElementById("dropzone"),
emptyState=document.getElementById("emptyState"),
message=document.getElementById("message"),
removeBg=document.getElementById("removeBg");


const photoTools=document.getElementById("photoTools"),
zoomRange=document.getElementById("zoomRange"),
xRange=document.getElementById("xRange"),
yRange=document.getElementById("yRange"),
zoomValue=document.getElementById("zoomValue"),
xValue=document.getElementById("xValue"),
yValue=document.getElementById("yValue"),
photoReset=document.getElementById("photoReset"),
canvasWrap=document.querySelector(".canvas-wrap");

const inputs={
  nameBn:document.getElementById("nameBn"),
  nameEn:document.getElementById("nameEn"),
  designation:document.getElementById("designation"),
  organization:document.getElementById("organization")
};

let frameImg=new Image(),
userImg=new Image(),
userImageLoaded=false,
rawFile=null,processedBlob=null;
let person={scale:1,x:0,y:0};
let drag={
  active:false,startX:0,startY:0,startPersonX:0,startPersonY:0
};

frameImg.onload=()=>{
  canvas.width=frameImg.naturalWidth;
  canvas.height=frameImg.naturalHeight;
  document.getElementById("canvasSize").textContent=`${canvas.width} × ${canvas.height}px`;
  render()
};
frameImg.onerror=()=>setMessage("Frame image পাওয়া যায়নি। assets/image_5.png ফাইলটি আছে কি না দেখুন.");
frameImg.src="assets/image_5.png";

photoInput.addEventListener(
  "change",e=>handleFile(e.target.files[0]
));

["dragenter","dragover"].forEach(
  ev=>dropzone.addEventListener(ev,e=>
    {e.preventDefault();
  dropzone.style.borderColor="#111827"}
));
["dragleave","drop"].forEach(ev=>
  dropzone.addEventListener(ev,e=>{
  e.preventDefault();
  dropzone.style.borderColor=""}
));
dropzone.addEventListener("drop",e=>handleFile(e.dataTransfer.files[0]));
Object.values(inputs).forEach(i=>i.addEventListener("input",render));
removeBg.addEventListener("change",()=>{
  if(rawFile) processUploadedFile()
});

function handleFile(file){
  if(!file)return;
  if(!file.type.startsWith("image/"))return setMessage("শুধু JPG, PNG বা WebP image দিন।");
  if(file.size>10*1024*1024)return setMessage("ছবির size 10MB-এর বেশি হতে পারবে না।");
  rawFile=file; 
  resetPerson(); 
  processUploadedFile();
}

async function processUploadedFile(){
  setMessage(removeBg.checked?"Background remove হচ্ছে… প্রথমবার একটু সময় লাগতে পারে।":"ছবি load হচ্ছে…");
  try{
    let blob=rawFile;
    if(removeBg.checked){
const mod=await import("https://esm.sh/@imgly/background-removal@1.7.0?bundle");
      blob=await mod.removeBackground(rawFile,
        {progress:(key,current,total)=>{
          if(total)setMessage(`Background remove হচ্ছে… ${Math.round(current/total*100)}%`
    )}
  });
    }
    processedBlob=blob;
const url=URL.createObjectURL(blob);
    userImg.onload=()=>{userImageLoaded=true;
      photoTools.classList.add("visible");
      emptyState.style.display="none";
      URL.revokeObjectURL(url);
      setMessage(removeBg.checked?"Background successfully removed. এখন ছবির size/position ঠিক করুন।":"ছবি successfully loaded. এখন ছবির size/position ঠিক করুন।");
      render()};
    userImg.src=url;
  }catch(err){
    console.error(err);processedBlob=rawFile;
    const url=URL.createObjectURL(rawFile);
    userImg.onload=()=>{userImageLoaded=true;
      photoTools.classList.add("visible");
      emptyState.style.display="none";
      URL.revokeObjectURL(url);
      setMessage("Background removal কাজ করেনি; original photo দিয়ে preview দেখানো হয়েছে।");
      render()
    };
    userImg.src=url;
  }
}

function getBasePersonRect(){
  const area={x:150,y:125,width:725,height:485};
  const scale=Math.min(area.width/userImg.naturalWidth,
    area.height/userImg.naturalHeight);
  const dw=userImg.naturalWidth*scale,
  dh=userImg.naturalHeight*scale;
  return {
    x:area.x+(area.width-dw)/2,
    y:area.y+(area.height-dh)/2,
    width:dw,
    height:dh
  };
}

function getPersonRect(){
  const b=getBasePersonRect();
  const dw=b.width*person.scale,
  dh=b.height*person.scale;
  return {x:b.x+(b.width-dw)/2+person.x,
    y:b.y+(b.height-dh)/2+person.y,
    width:dw,
    height:dh};
}

function render(){
  if(!frameImg.complete||!frameImg.naturalWidth)return;
  ctx.clearRect(0,0,canvas.width,
    canvas.height);
ctx.drawImage(frameImg,0,0,canvas.width,canvas.height);
  if(userImageLoaded)drawPerson();
  // Restore the foreground title/footer from the supplied frame so the portrait stays behind them.
  ctx.drawImage(frameImg,0,570,1024,454,0,570,1024,454);
  drawDetails();
}

function drawPerson(){
  const r=getPersonRect();
  ctx.drawImage(userImg,r.x,r.y,r.width,r.height);
}

function drawDetails(){
  const w=canvas.width;
  const x=w*.735,max=w*.40,baseY=875;
  ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillStyle="#fff";ctx.shadowColor="rgba(0,0,0,.18)";ctx.shadowBlur=2;
const bn=inputs.nameBn.value.trim(),en=inputs.nameEn.value.trim(),des=inputs.designation.value.trim(),org=inputs.organization.value.trim();
let y=baseY;
  if(bn){ctx.font=`800 ${fitFont(bn,max,31,18,"Noto Sans Bengali")}px "Noto Sans Bengali",sans-serif`;ctx.fillText(bn,x,y);y+=36}
  if(en){ctx.font=`700 ${fitFont(en,max,19,13,"Inter")}px Inter,sans-serif`;ctx.fillText(en,x,y);y+=27}
  if(des){ctx.font=`600 ${fitFont(des,max,18,12,"Noto Sans Bengali")}px "Noto Sans Bengali",Inter,sans-serif`;ctx.fillText(des,x,y);y+=25}
  if(org){ctx.font=`500 ${fitFont(org,max,16,10,"Noto Sans Bengali")}px "Noto Sans Bengali",Inter,sans-serif`;ctx.fillText(org,x,y)}
  ctx.shadowBlur=0;
}
function fitFont(text,maxWidth,max,min,family){let s=max;while(s>min){ctx.font=`600 ${s}px ${family},sans-serif`;if(ctx.measureText(text).width<=maxWidth)break;s--}return s}

function syncControls(){
  zoomRange.value=Math.round(person.scale*100);xRange.value=Math.round(person.x);yRange.value=Math.round(person.y);
  zoomValue.textContent=`${Math.round(person.scale*100)}%`;xValue.textContent=Math.round(person.x);yValue.textContent=Math.round(person.y);
}
function resetPerson(){
  person={scale:1,x:0,y:0};
syncControls()
}
zoomRange.addEventListener("input",()=>{person.scale=Number(zoomRange.value)/100;
  syncControls();
  render()
});
xRange.addEventListener("input",()=>{person.x=Number(xRange.value);
  syncControls();
  render()
});
yRange.addEventListener("input",()=>{person.y=Number(yRange.value);
  syncControls();
  render()
});
photoReset.addEventListener("click",()=>{resetPerson();
  render()
});

// Drag the uploaded person directly on the preview.
canvas.addEventListener("pointerdown",e=>{
  if(!userImageLoaded)return;
  const p=canvasPoint(e);
  const r=getPersonRect();
  if(p.x>=r.x&&p.x<=r.x+r.width&&p.y>=r.y&&p.y<=r.y+r.height){
    drag={active:true,startX:p.x,startY:p.y,startPersonX:person.x,startPersonY:person.y};
    canvas.setPointerCapture(e.pointerId);canvasWrap.classList.add("dragging");
  }
});
canvas.addEventListener("pointermove",e=>{
  if(!drag.active)return;
  const p=canvasPoint(e);
  person.x=clamp(drag.startPersonX+p.x-drag.startX,-400,400);
  person.y=clamp(drag.startPersonY+p.y-drag.startY,-400,400);
  syncControls();render();
});
["pointerup","pointercancel"].forEach(ev=>canvas.addEventListener(ev,e=>{
  drag.active=false;
  canvasWrap.classList.remove("dragging")

}));
canvas.addEventListener("wheel",e=>{
  if(!userImageLoaded)return;
  e.preventDefault();
const step=e.deltaY<0?0.05:-0.05;
  person.scale=clamp(person.scale+step,.3,1.8);
  syncControls();
  render();
},{passive:false});
function canvasPoint(e)
{const r=canvas.getBoundingClientRect();
  return{x:(e.clientX-r.left)*(canvas.width/r.width),y:(e.clientY-r.top)*
  (canvas.height/r.height)

}}
function clamp(v,min,max){return Math.min(max,Math.max(min,v))}

syncControls();
setTimeout(render,50);

document.getElementById("downloadBtn").addEventListener("click",()=>{
  if(!userImageLoaded)return setMessage("আগে একজন ব্যক্তির ছবি upload করুন।");
render();
  canvas.toBlob(blob=>{const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="school-of-genji-personal-frame.png";
    a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setMessage("Frame generated & download started.")},"image/png");
});

document.getElementById("resetBtn").addEventListener("click",()=>{
  Object.values(inputs).forEach(i=>i.value="");
  photoInput.value="";
  rawFile=null;
  processedBlob=null;
  userImageLoaded=false;
  userImg.src="";
  photoTools.classList.remove("visible");
  emptyState.style.display="";
  resetPerson();setMessage("");
  render();
});
function setMessage(t){message.textContent=t}
