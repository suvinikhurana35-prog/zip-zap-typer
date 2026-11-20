/* ===== EDIT ALL TEXT HERE ===== */
const T={
 logo:"Zip Zap Type",
 author:"Suvini Khurana",
 title:"TYPE FAST!",
 lead:"Beat the clock, bag a high score and brag about it.",
 cta:"Start typing",
 marquee:"Type fast ✦ Type loud ✦ Type proud ✦ ",
 playTitle:"Ready? Go!",
 lblTime:"seconds", lblWpm:"WPM", lblBest:"best", lblStreak:"streak",
 histTitle:"Your last 10 rounds",
 ranks:[[0,"Sleepy Snail"],[20,"Steady Turtle"],[35,"Cool Cat"],[50,"Speedy Fox"],[70,"Cheetah"],[90,"Lightning Bolt"]],
 hint:"Tap the box and start typing. The clock starts with your first key. Press Esc to restart.",
 hintLive:"Keep going!",
 restart:"New round",
 resTitle:"Your speed",
 resLine:"{acc}% accurate · best streak {streak} · {secs}s round",
 newBest:"New high score! 🎉",
 share:"Share my result",
 copied:"Copied to clipboard!",
 shareText:"I’m a {rank}! {wpm} WPM at {acc}% accuracy (best streak {streak}) in {secs}s on Zip Zap Type by Suvini Khurana. Beat me!",
 tipsTitle:"Type like a pro",
 tips:[["Eyes on the screen","Looking at your fingers slows you down. Trust them."],["Accuracy first","Mistakes cost more time than slow, steady keys."],["Stay loose","Relax your shoulders and keep your wrists level."]],
 footer:"Made with fast fingers by Suvini Khurana",
 modes:[15,30,60],
 modeLabel:"{n}s",
 words:"the quick brown fox jumps over a lazy dog while bright stars dance above sleepy towns and happy kids chase paper planes through golden fields of tall grass making big plans for tomorrow".split(" ")
};
/* ================================= */
const $=id=>document.getElementById(id);
document.querySelectorAll("[data-t]").forEach(e=>e.textContent=T[e.dataset.t]);
document.title=T.logo;
const h=$("title");h.setAttribute("aria-label",T.title);
T.title.split("").forEach(c=>{const s=document.createElement("span");s.setAttribute("aria-hidden","true");s.textContent=c===" "?"\u00a0":c;h.appendChild(s)});
$("mq").textContent=T.marquee.repeat(8);
$("foot").textContent=T.footer;
$("share").textContent=T.share;
T.tips.forEach(([a,b])=>{const d=document.createElement("div");d.className="tip";d.innerHTML="<h3></h3><p></p>";d.firstChild.textContent=a;d.lastChild.textContent=b;$("tips").appendChild(d)});

let streak=0,bestStreak=0,prev=0,dur=T.modes[1],text="",chars=[],started=false,t0=0,tick=null,done=false;
const best={};
const bk=()=>"zzt-best-"+dur;
const getBest=()=>{try{return +localStorage.getItem(bk())||0}catch(e){return 0}};
const setBest=v=>{try{localStorage.setItem(bk(),v)}catch(e){}};

T.modes.forEach(n=>{const b=document.createElement("button");b.className="btn ghost";b.textContent=T.modeLabel.replace("{n}",n);b.onclick=()=>{dur=n;reset()};b.dataset.n=n;$("modes").appendChild(b)});

function mkText(){let o=[];while(o.join(" ").length<700)o.push(...[...T.words].sort(()=>Math.random()-.5));return o.join(" ")}
function reset(){
 clearInterval(tick);started=false;done=false;streak=bestStreak=prev=0;$("sStreak").textContent=0;text=mkText();
 const p=$("passage");p.innerHTML="";chars=[...text].map(c=>{const s=document.createElement("span");s.textContent=c;p.appendChild(s);return s});
 p.scrollTop=0;$("inp").value="";$("sTime").textContent=dur;$("sWpm").textContent=0;$("sBest").textContent=getBest();
 $("prog").style.transform="scaleX(1)";$("hint").textContent=T.hint;$("result").classList.remove("show");
 document.querySelectorAll("#modes .btn").forEach(b=>b.classList.toggle("on",+b.dataset.n===dur));
 render("");
}
function stats(v){let ok=0;for(let i=0;i<v.length;i++)if(v[i]===text[i])ok++;
 const m=Math.max((Date.now()-t0)/60000,1/600);return{ok,wpm:Math.round(ok/5/m),acc:v.length?Math.round(ok/v.length*100):100}}
function render(v){
 chars.forEach((s,i)=>{s.className=i<v.length?(v[i]===text[i]?"ok":"bad"):i===v.length?"cur":""});
 const c=chars[v.length];if(c){const p=$("passage");p.scrollTop=Math.max(0,c.offsetTop-p.offsetTop-50)}
}
function zap(){const e=$("sStreak").parentNode;e.classList.remove("zap");void e.offsetWidth;e.classList.add("zap")}
function confetti(){for(let i=0;i<40;i++){const c=document.createElement("i");c.className="cf";c.style.cssText=`left:${Math.random()*100}vw;--d:${1.5+Math.random()*1.5}s;--r:${Math.random()*720-360}deg;--w:${6+Math.random()*10}px;animation-delay:${Math.random()*.4}s;border-radius:${i%2?"50%":"2px"}`;document.body.appendChild(c);setTimeout(()=>c.remove(),3500)}}
const fill=(t,o)=>t.replace(/\{(\w+)\}/g,(m,k)=>o[k]);
const rankOf=w=>T.ranks.filter(r=>w>=r[0]).pop()[1];
function finish(){
 done=true;clearInterval(tick);const s=stats($("inp").value),secs=dur;
 const wpm=Math.round(s.ok/5/(dur/60)),nb=wpm>getBest(),rank=rankOf(wpm);
 if(nb){setBest(wpm);$("sBest").textContent=wpm;confetti()}
 let hist=[];try{hist=JSON.parse(localStorage.getItem("zzt-hist")||"[]")}catch(e){}
 hist=hist.concat(wpm).slice(-10);try{localStorage.setItem("zzt-hist",JSON.stringify(hist))}catch(e){}
 const mx=Math.max(...hist,1);
 $("hist").innerHTML=hist.map((v,i)=>`<i title="${v}" style="height:${Math.max(8,v/mx*100)}%" class="${i===hist.length-1?"last":""}"></i>`).join("");
 const o={wpm,acc:s.acc,secs,streak:bestStreak,rank};
 $("rWpm").textContent=wpm;$("rRank").textContent=rank;
 $("rLine").textContent=fill(T.resLine,o)+(nb?"\n"+T.newBest:"");$("rLine").style.whiteSpace="pre-line";
 $("result").dataset.share=fill(T.shareText,o);
 $("result").classList.add("show");$("inp").blur();
 setTimeout(()=>$("result").scrollIntoView({behavior:"smooth",block:"center"}),100);
}
$("inp").addEventListener("input",e=>{
 if(done)return;const v=e.target.value;
 if(!started){started=true;t0=Date.now();$("hint").textContent=T.hintLive;
  tick=setInterval(()=>{const left=Math.max(0,dur-(Date.now()-t0)/1000);
   $("sTime").textContent=Math.ceil(left);$("prog").style.transform="scaleX("+left/dur+")";
   $("sWpm").textContent=stats($("inp").value).wpm;if(left<=0)finish()},100)}
 const last=v.length-1;if(v.length>prev){if(v[last]===text[last]){streak++;if(streak>bestStreak)bestStreak=streak;if(streak%25===0)zap()}else streak=0}prev=v.length;$("sStreak").textContent=streak;if(last>=0&&v[last]!==text[last]){const p=$("passage");p.classList.remove("shake");void p.offsetWidth;p.classList.add("shake")}
 render(v);
});
$("passage").onclick=()=>$("inp").focus();
$("restart").onclick=()=>{reset();$("inp").focus()};
$("share").onclick=async()=>{
 const t=$("result").dataset.share,u=location.href;
 try{if(navigator.share){await navigator.share({text:t,url:u});return}}catch(e){if(e.name==="AbortError")return}
 try{await navigator.clipboard.writeText(t+" "+u);$("share").textContent=T.copied;setTimeout(()=>$("share").textContent=T.share,2000)}catch(e){prompt("",t)}
};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(e=>io.observe(e));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){reset();$("inp").focus()}});
try{const t=localStorage.getItem("zzt-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}
$("theme").onclick=()=>{const d=document.documentElement,dark=(d.dataset.theme||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"))==="dark";d.dataset.theme=dark?"light":"dark";try{localStorage.setItem("zzt-theme",d.dataset.theme)}catch(e){}};
reset();
