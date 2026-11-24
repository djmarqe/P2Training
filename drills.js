/* Fresh question generators for the ASE P2 trainer.
   Used by drills.html (the Fresh drills page) and by index.html, which mixes a few into Daily 20 and the mock exam.
   Every question is generated, so numbers, drawings and answer order change each time.
   Self-check after editing a generator:  node drills.js */
var DRILLS=(function(){
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), P=a=>a[R(0,a.length-1)];
const $=n=>"$"+(Math.round(n*100)/100).toFixed(2), pct=n=>n.toFixed(1).replace(".0","")+"%", f=x=>+x.toFixed(4);
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=R(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;}
const svg=(w,h,body)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Drawing for this question">${body}</svg>`;

// Four unique answers: the right one, then trap answers (the common mistakes), then padding if traps collide.
function mc(t,q,right,traps,e,pic,pad){
  const o=[right];
  for(const x of traps)if(o.length<4&&!o.includes(x))o.push(x);
  for(let k=1;o.length<4&&pad&&k<40;k++){const x=pad(k);if(!o.includes(x))o.push(x);}
  shuffle(o);return{t,q,o,c:o.indexOf(right),e,svg:pic};
}
const money=(t,q,v,traps,e)=>mc(t,q,$(v),traps.map($),e,null,k=>$(v*(1+(k%2?.05:-.05)*Math.ceil(k/2))));

/* ---------- math, no calculator ---------- */
function marginPrice(){
  const m=P([20,25,30,40,50]),price=R(4,40)*5,cost=price*(1-m/100);
  return money("Margin to price",`A part costs the store ${$(cost)}. Store policy is a ${m}% gross margin. What is the selling price?`,price,[cost*(1+m/100),cost/(m/100),cost+m],
    `Margin is figured on the selling price, so divide: ${$(cost)} ÷ (1 − ${f(m/100)}) = ${$(price)}. Multiplying by ${f(1+m/100)} gives ${$(cost*(1+m/100))}, which is a ${m}% markup. That is the trap answer.`);
}
function markupPrice(){
  const m=P([20,25,30,40,50]),cost=R(4,40)*5,price=cost*(1+m/100);
  return money("Markup to price",`A part costs the store ${$(cost)}. It is priced at a ${m}% markup. What is the selling price?`,price,[cost/(1-m/100),cost*m/100,cost+m],
    `Markup is figured on cost, so multiply: ${$(cost)} × ${f(1+m/100)} = ${$(price)}. Dividing by ${f(1-m/100)} would give ${$(cost/(1-m/100))}, which is a ${m}% margin.`);
}
function pctQ(){
  const [mg,ratio]=P([[20,.8],[25,.75],[100/3,2/3],[40,.6],[50,.5],[60,.4]]);
  const price=R(2,20)*15,cost=price*ratio,gp=price-cost,mu=gp/cost*100,am=R(0,1),right=am?mg:mu;
  return mc(am?"Margin percent":"Markup percent",`A part costs the store ${$(cost)} and sells for ${$(price)}. What is the ${am?"gross margin":"markup"}?`,pct(right),[pct(am?mu:mg),pct(ratio*100)],
    am?`Gross profit is ${$(gp)}. Margin divides by the selling price: ${$(gp)} ÷ ${$(price)} = ${pct(mg)}. Dividing by cost gives ${pct(mu)}, which is the markup.`
      :`Gross profit is ${$(gp)}. Markup divides by cost: ${$(gp)} ÷ ${$(cost)} = ${pct(mu)}. Dividing by the selling price gives ${pct(mg)}, which is the margin.`,
    null,k=>pct(right+5*k));
}
function stacked(){
  const L=R(2,15)*20,a=P([10,15,20,25,30]),b=P([5,10,15,20]),pay=L*(1-a/100)*(1-b/100),flat=L*(1-(a+b)/100);
  return money("Stacked discounts",`A wholesale customer gets ${a}% off list, then another ${b}% off on top of that. On a ${$(L)} list item, what do they pay?`,pay,[flat,L*(1-a/100),L*(1-b/100)],
    `Stacked discounts multiply: ${$(L)} × ${f(1-a/100)} × ${f(1-b/100)} = ${$(pay)}. Adding them into a flat ${a+b}% off gives ${$(flat)}, which is wrong because the second discount comes off the already reduced price.`);
}
function perMonth(){
  for(;;){
    const ms=shuffle([24,36,48,60,72,84]).slice(0,4).sort((x,y)=>x-y);
    const ps=ms.map(m=>Math.round(m*(1.9+Math.random()*.9))-.05).sort((x,y)=>x-y);
    const b=ms.map((m,i)=>({m,p:ps[i],r:ps[i]/m})),s=b.slice().sort((x,y)=>x.r-y.r);
    if(new Set(ps).size<4||s[1].r-s[0].r<.04)continue;   // need one clear winner
    const lab=x=>`${$(x.p)} with a ${x.m}-month warranty`;
    return mc("Cost per month","Which battery is the best value per month of warranty?",lab(s[0]),s.slice(1).map(lab),
      "Divide price by months: "+b.map(x=>`${$(x.p)} ÷ ${x.m} = ${$(x.r)}`).join(", ")+". The lowest cost per month wins, whatever the sticker says.");
  }
}
function order(){
  const q1=P([2,4]),p1=R(20,90),p2=R(10,60)+.5,d=P([10,15,20]),sub=q1*p1+2*p2,tot=sub*(1-d/100);
  return money("Order total",`A customer buys ${q1} rotors at ${$(p1)} each and 2 pad sets at ${$(p2)} each, with ${d}% off the whole order. What is the total before tax?`,tot,[sub,sub-d,q1*p1*(1-d/100)+2*p2],
    `${q1} × ${$(p1)} + 2 × ${$(p2)} = ${$(sub)}. Then ${$(sub)} × ${f(1-d/100)} = ${$(tot)}.`);
}
const fr=i=>{let d=16;while(i%2==0){i/=2;d/=2;}return i+"/"+d;};
function fraction(){
  const i=R(1,15),near=shuffle([i-1,i+1,i-2,i+2,i-3,i+3].filter(x=>x>0&&x<16)),e=`${fr(i)} = ${i/16}. Sixteenths step by .0625 and eighths by .125, so count up from the nearest one you know.`;
  return R(0,1)?mc("Fractions and decimals",`What is the decimal equivalent of ${fr(i)} inch?`,String(i/16),near.map(x=>String(x/16)),e)
               :mc("Fractions and decimals",`A measurement reads ${i/16} inch. Which fraction is that?`,fr(i),near.map(fr),e);
}
function thou(){
  const [w,r,...t]=P([["one thousandth",".001",".010",".0001",".100"],["two thousandths",".002",".020",".0002",".200"],["ten thousandths",".010",".001",".100",".0001"],["twenty thousandths",".020",".002",".200",".0002"],["thirty thousandths",".030",".003",".300",".0003"]]);
  return mc("Reading thousandths",`A crankshaft is ground ${w} of an inch undersize. Which bearing set matches?`,r+" undersize",t.map(x=>x+" undersize"),
    `Three decimal places is thousandths, so ${w} is ${r}. Count the places every time: .0002, .002, .020 and .200 are four different parts.`);
}
function turns(){
  const inv=R(5,40)*10000,t=P([2,2.5,3,4,5,6]),n=x=>"$"+x.toLocaleString("en-US");
  return mc("Inventory turns",`A store's cost of goods sold for the year is ${n(inv*t)}. Its average inventory is ${n(inv)}. What is the inventory turnover?`,t+" turns",[f(+(1/t).toFixed(2))+" turns",t*2+" turns",(t+1)+" turns"],
    `Turnover = cost of goods sold ÷ average inventory = ${n(inv*t)} ÷ ${n(inv)} = ${t}.`);
}
function load(){
  const c=R(9,17)*50;
  return mc("Battery load test",`A battery is rated at ${c} CCA. What is the correct conventional load test?`,`${c/2} amps for 15 seconds, staying above 9.6 volts`,
    [`${c} amps for 15 seconds, staying above 9.6 volts`,`${c/2} amps for 30 seconds, staying above 7.2 volts`,`25 amps until it drops to 10.5 volts`],
    `Load test at half the CCA rating (${c/2} amps) for 15 seconds. A good battery holds 9.6 volts or more at 70°F, and it must be charged first. The 30 seconds and 7.2 volts belong to the CCA rating itself, and 25 amps down to 10.5 volts is reserve capacity.`);
}
function cap(){
  const p=P([7,13,15,16,18]);
  return mc("Pressure cap",`About how much does a ${p} psi radiator cap raise the coolant's boiling point?`,p*3+"°F",[p+"°F","3°F",p*10+"°F"],`Roughly 3°F per psi: ${p} × 3 = ${p*3}°F.`);
}
function thread(){
  const k=R(0,2);
  if(R(0,1)){
    const [d,p]=P([[6,"1.0"],[8,"1.25"],[10,"1.5"],[12,"1.75"]]),L=P([20,25,30,40,50]),ans=["Thread diameter in millimeters","Distance between threads in millimeters (pitch)","Length in millimeters"];
    return mc("Thread callouts",`A bolt is labeled M${d}-${p} × ${L}. What does the "${[d,p,L][k]}" tell you?`,ans[k],[...ans.filter((_,i)=>i!=k),"Threads per inch"],
      `Metric is diameter, pitch, length: ${d} mm diameter, ${p} mm between threads, ${L} mm long. Metric pitch is a distance, so a smaller number is a finer thread.`);
  }
  const [d,t]=P([["1/4",20],["5/16",18],["3/8",16],["7/16",14],["1/2",13]]),L=P(["1","1-1/2","2","2-1/2"]),ans=["Thread diameter in inches","Threads per inch","Length in inches"];
  return mc("Thread callouts",`A bolt is labeled ${d}-${t} × ${L}. What does the "${[d,t,L][k]}" tell you?`,ans[k],[...ans.filter((_,i)=>i!=k),"Thread pitch in millimeters"],
    `SAE is diameter, threads per inch, length: ${d} inch diameter, ${t} threads per inch, ${L} inch long. More threads per inch is a finer thread.`);
}

/* ---------- picture ID ---------- */
function bolt(){
  const kinds=[["SAE Grade 2",0],["SAE Grade 5",3],["SAE Grade 8",6],["Metric class 8.8","8.8"],["Metric class 10.9","10.9"],["Metric class 12.9","12.9"]],k=P(kinds),sae=typeof k[1]=="number";
  let s=`<polygon points="${[0,1,2,3,4,5].map(i=>f(90+62*Math.cos(i*Math.PI/3))+","+f(75+62*Math.sin(i*Math.PI/3))).join(" ")}" class="m"/><circle cx="90" cy="75" r="50" class="ln"/>`;
  if(sae)for(let i=0;i<k[1];i++){const a=i*2*Math.PI/k[1]-Math.PI/2;s+=`<line x1="${f(90+18*Math.cos(a))}" y1="${f(75+18*Math.sin(a))}" x2="${f(90+44*Math.cos(a))}" y2="${f(75+44*Math.sin(a))}" class="ln w3"/>`;}
  else s+=`<text x="90" y="83" text-anchor="middle" class="big">${k[1]}</text>`;
  return mc("Bolt head markings","What is this bolt?",k[0],[...kinds.filter(x=>x!=k&&(typeof x[1]=="number")==sae).map(x=>x[0]),sae?"Metric class 8.8":"SAE Grade 8"],
    sae?"SAE grades are read from the radial lines on the head: none is grade 2, three is grade 5, six is grade 8. Lines plus 2 equals the grade."
       :"A number stamped on the head is a metric property class, and higher is stronger: 8.8, then 10.9, then 12.9. Roughly, 8.8 compares to grade 5 and 10.9 to grade 8.",svg(180,150,s));
}
function mic(){
  const sl=R(1,19),t=R(3,22),val=sl*.025+t*.001,px=16,x0=24,yc=70,edge=f(x0+(sl+t/25)*px),fx=x=>x.toFixed(3)+" in";
  let s=`<rect x="0" y="${yc-36}" width="${edge}" height="60" class="m"/><line x1="${x0}" y1="${yc}" x2="${edge}" y2="${yc}" class="ln"/>`;
  for(let i=0;i<=sl;i++){const x=x0+i*px,big=i%4==0;s+=`<line x1="${x}" y1="${yc}" x2="${x}" y2="${yc-(big?15:8)}" class="ln"/>`;if(big)s+=`<text x="${x}" y="${yc-20}" text-anchor="middle" class="mic">${i/4}</text>`;}
  s+=`<rect x="${edge}" y="${yc-60}" width="110" height="120" class="g"/>`;
  for(let v=t-5;v<=t+5;v++){const y=yc+(t-v)*10,n=((v%25)+25)%25,big=n%5==0;s+=`<line x1="${edge}" y1="${y}" x2="${edge+(big?20:11)}" y2="${y}" class="ln"/>`;if(big)s+=`<text x="${edge+26}" y="${y+5}" class="mic">${n}</text>`;}
  return mc("Micrometer","What does this micrometer read?",fx(val),[sl*.025,val+.025,val-.025,val+.1].map(fx),
    `The sleeve shows ${(sl*.025).toFixed(3)}: each numbered line is .100 and each small line is .025. The thimble line that meets the sleeve line adds ${t} thousandths. ${(sl*.025).toFixed(3)} + ${(t/1000).toFixed(3)} = ${val.toFixed(3)}.`,svg(460,140,s));
}
function fitting(){
  const w='class="wall"',axis='<line x1="10" y1="70" x2="215" y2="70" class="dash"/>',note=t=>`<text x="120" y="132" text-anchor="middle" class="cap">${t}</text>`;
  const kinds=[
    ["Double (inverted) flare",axis+`<path d="M20 55H170L198 38L202 44L180 57" ${w}/><path d="M20 85H170L198 102L202 96L180 83" ${w}/>`+note("Tube end, cut in half lengthwise"),
      "The tube wall flares out and folds back on itself, giving a double-thick 45° seat. This is the SAE brake line flare. It seals on the flare, not on the threads."],
    ["ISO (bubble) flare",axis+`<path d="M20 55H166C174 36 194 36 200 54" ${w}/><path d="M20 85H166C174 104 194 104 200 86" ${w}/>`+note("Tube end, cut in half lengthwise"),
      "The tube end is formed into a rounded bubble. ISO bubble flares and SAE double flares are both used on brake lines, but they never interchange, so match the original."],
    ["Compression fitting",axis+`<path d="M20 55H205" ${w}/><path d="M20 85H205" ${w}/><path d="M135 51Q157 28 179 51Z" class="m"/><path d="M135 89Q157 112 179 89Z" class="m"/>`+note("Tube end, cut in half lengthwise"),
      "A straight tube with a separate ferrule (sleeve) that the nut squeezes onto it. Low pressure only, and never on a brake line."],
    ["NPT (tapered pipe thread)",`<polygon points="70,40 200,54 200,86 70,100" class="m"/>`+[...Array(12)].map((_,i)=>{const x=78+i*10,d=f((x-70)*14/130);return`<line x1="${x}" y1="${40+d}" x2="${x+5}" y2="${100-d}" class="ln"/>`;}).join("")+`<rect x="20" y="30" width="50" height="80" class="m"/>`+note("Male fitting, side view"),
      "The threads themselves taper, so the fitting wedges tight and seals on the threads with sealant or tape. Flare fittings seal on the flare and get no sealant."]],k=P(kinds);
  return mc("Flares and fittings","Which tube end or fitting is this?",k[0],kinds.filter(x=>x!=k).map(x=>x[0]),k[2],svg(240,140,k[1]));
}
function lug(){
  const hex=`<rect x="60" y="18" width="60" height="55" class="m"/><line x1="80" y1="18" x2="80" y2="73" class="ln"/><line x1="100" y1="18" x2="100" y2="73" class="ln"/><text x="90" y="134" text-anchor="middle" class="cap">Side view, seat at the bottom</text>`;
  const kinds=[
    ["Conical (tapered) seat",`<polygon points="60,73 120,73 102,103 78,103" class="m"/>`,"A straight 60° taper. This is the most common lug nut seat."],
    ["Ball (radius) seat",`<path d="M60 73H120Q120 98 100 103H80Q60 98 60 73Z" class="m"/>`,"A rounded, spherical seat, used on many Honda, Volkswagen, Audi and Mercedes factory wheels. It will not seat properly in a conical wheel."],
    ["Flat (mag) seat with washer",`<rect x="48" y="73" width="84" height="8" class="m"/><rect x="76" y="81" width="28" height="30" class="m"/>`,"A flat washer bears on the wheel and a straight shank goes into the lug hole. Common on Toyota factory alloy wheels."]],k=P(kinds);
  return mc("Lug nut seats","Which lug nut seat type is this?",k[0],[...kinds.filter(x=>x!=k).map(x=>x[0]),"Spline drive"],k[2]+" The seat must match the wheel, or the lug nuts work loose.",svg(180,140,hex+k[1]));
}
function align(){
  const k=R(0,2),d=R(0,1),tire=(x,r)=>`<rect x="${x-14}" y="30" width="28" height="80" rx="8" class="tire" transform="rotate(${r} ${x} 70)"/>`,note=t=>`<text x="120" y="142" text-anchor="middle" class="cap">${t}</text>`;
  const pair=tire(70,d?8:-8)+tire(170,d?-8:8);   // d=1: tops lean toward each other
  const pic=[pair+`<text x="120" y="20" text-anchor="middle" class="cap">FRONT OF VEHICLE ↑</text>`+note("Viewed from above"),
             pair+`<line x1="20" y1="113" x2="220" y2="113" class="ln"/>`+note("Viewed from the front"),
             `<circle cx="120" cy="68" r="44" class="g"/><circle cx="120" cy="68" r="26" class="m"/><line x1="120" y1="8" x2="120" y2="126" class="dash"/><line x1="${d?138:102}" y1="8" x2="${d?102:138}" y2="126" class="ln w3"/><text x="14" y="20" class="cap">← FRONT</text>`+note("Side view, solid line = steering axis")][k];
  const e=[`Toe is seen from above: the fronts of the tires point ${d?"in (toe-in)":"out (toe-out)"}. Toe is the angle that wears tires fastest, in a feathered pattern.`,
           `Camber is seen from the front: the tops of the tires lean ${d?"in (negative camber)":"out (positive camber)"}. Too much wears one edge of the tread.`,
           `Caster is seen from the side: the steering axis tilts ${d?"rearward at the top (positive caster)":"forward at the top (negative caster)"}. It affects steering stability and return, not tire wear.`][k];
  return mc("Alignment angles","Which alignment angle is this drawing showing?",["Toe","Camber","Caster"][k],["Toe","Camber","Caster","Thrust angle"],e,svg(240,150,pic));
}
function bulb(){
  const fil=x=>`<path d="M${x-7} 62l3-9 3 9 3-9 3 9 3-9" class="ln"/><line x1="${x-7}" y1="62" x2="${x-7}" y2="84" class="ln"/><line x1="${x+8}" y1="53" x2="${x+8}" y2="84" class="ln"/>`;
  const shell=`<circle cx="90" cy="50" r="36" class="g"/><rect x="70" y="82" width="40" height="34" class="m"/><line x1="64" y1="100" x2="70" y2="100" class="ln w3"/><line x1="110" y1="100" x2="116" y2="100" class="ln w3"/>`,dot=x=>`<ellipse cx="${x}" cy="119" rx="6" ry="4" class="dot"/>`;
  const kinds=[
    ["1156 (single filament)",shell+fil(90)+dot(90),"One filament and one contact on the bottom of the base: 1156, for a single job such as a backup or turn signal lamp."],
    ["1157 (dual filament)",shell+fil(78)+fil(102)+dot(80)+dot(100),"Two filaments and two contacts on the bottom of the base: 1157, for a combined park and brake or park and turn lamp."],
    ["194 (wedge base)",`<rect x="74" y="16" width="32" height="74" rx="16" class="g"/><rect x="77" y="88" width="26" height="26" class="g"/><line x1="84" y1="60" x2="84" y2="114" class="ln"/><line x1="96" y1="60" x2="96" y2="114" class="ln"/><path d="M84 60l4-8 4 8 4-8" class="ln"/>`,"All glass with a flat wedge base and no metal shell: 194, used for side markers, license plate and instrument lamps."]],k=P(kinds);
  return mc("Bulb numbers","Which bulb is this?",k[0],[...kinds.filter(x=>x!=k).map(x=>x[0]),"H11 (halogen headlamp capsule)"],k[2],svg(180,130,k[1]));
}
function belt(){
  const n=R(4,8),len=R(60,110)*10+P([0,5]),code=`${n}K${len}`,e=`The number is rib count, then K, then length in tenths of an inch: ${n} ribs and ${len/10} inches is ${code}.`;
  if(R(0,1))return mc("Belt numbers",`What does the serpentine belt number ${code} tell you?`,`${n} ribs, ${len/10} inches long`,[`${n} inches wide, ${len} mm long`,`${n} ribs, ${len} mm long`,`For a ${n}-cylinder engine, ${len/10} inches long`],e);
  const x0=120-n*11;let s=`<rect x="${x0}" y="40" width="${n*22}" height="16" class="tire"/>`;
  for(let i=0;i<n;i++){const x=x0+i*22;s+=`<polygon points="${x+2},56 ${x+20},56 ${x+15},82 ${x+7},82" class="tire"/>`;}
  return mc("Belt numbers",`This multi-rib belt, shown in cross-section, is ${len/10} inches long. Which number matches it?`,code,[`${n+1}K${len}`,`${n-1}K${len}`,`${len}K${n}`],"Count the ribs. "+e,svg(240,120,s+`<text x="120" y="108" text-anchor="middle" class="cap">Cross-section, ribs facing down</text>`));
}
const YR="ABCDEFGHJKLMNPRST";   // model years 2010 to 2026; I, O and Q are skipped
function vin(y){
  const c="ABCDEFGHJKLMNPRSTUVWXYZ0123456789";let v=P(["1G1","1FA","2T1","JHM","1HG","3VW","WBA","5YJ"]);
  for(let i=0;i<5;i++)v+=P(c);v+=P("0123456789X")+YR[y-2010]+P(c);for(let i=0;i<6;i++)v+=R(0,9);return v;
}
function vinPic(v,a,b){
  let s="";for(let i=0;i<17;i++){const x=6+i*20,h=i>=a&&i<b;s+=`<text x="${x+9}" y="12" text-anchor="middle" class="sm">${i+1}</text><rect x="${x}" y="18" width="18" height="30" rx="3" class="${h?"hl":"cell"}"/><text x="${x+9}" y="39" text-anchor="middle" class="mono${h?" hlt":""}">${v[i]}</text>`;}
  return svg(352,54,s);
}
function vinYear(){
  const y=R(2010,2026),L=YR[y-2010];
  return mc("VIN model year",`Position 10 of this VIN is ${L}. Which model year is it, in the cycle that started in 2010?`,String(y),[2010+L.charCodeAt(0)-65,y+1,y-1,y+2,y-2].map(String),
    `Position 10 is the model year. A is 2010 and the letters run forward, skipping I, O and Q, so ${L} is ${y}. U, Z and the digit 0 are never year codes either.`,vinPic(vin(y),9,10));
}
function vinPos(){
  const items=[[0,3,"World Manufacturer Identifier (country and maker)",0],[3,8,"Vehicle descriptor (body, engine, restraints, series)",1],[7,8,"Engine code, on most makes",1],[8,9,"Check digit",2],[9,10,"Model year",3],[10,11,"Assembly plant",4],[11,17,"Sequential serial number",5]],it=P(items);
  return mc("VIN positions",it[1]-it[0]>1?"What do the highlighted VIN positions tell you?":"What does the highlighted VIN position tell you?",it[2],shuffle(items.filter(x=>x[3]!=it[3]).map(x=>x[2])),
    "Positions 1 to 3 are the World Manufacturer Identifier, 4 to 8 describe the vehicle (the 8th is usually the engine code), 9 is the check digit, 10 is the model year, 11 is the assembly plant, and 12 to 17 are the serial number.",vinPic(vin(R(2010,2026)),it[0],it[1]));
}

const SETS={math:[marginPrice,markupPrice,pctQ,stacked,perMonth,order,fraction,thou,turns,load,cap,thread],pic:[bolt,mic,fitting,lug,align,bulb,belt,vinYear,vinPos]};
SETS.mix=[...SETS.math,...SETS.pic];
// Which blueprint area each generator counts toward when the trainer mixes it into a session.
const AREA={A:[marginPrice,markupPrice,pctQ,stacked,perMonth,order,fraction,thou,thread,mic],C:[load,cap,bolt,fitting,lug,align,bulb,belt],D:[vinYear,vinPos],F:[turns]};

function selfTest(){
  const eq=(a,b)=>{if(a!==b)throw Error(`expected ${b}, got ${a}`);};
  eq($(48/(1-.4)),"$80.00");eq($(150*.8*.9),"$108.00");eq(pct(100/3),"33.3%");eq(pct(25.000000000000004),"25%");eq(fr(8),"1/2");eq(fr(5),"5/16");eq(YR[2018-2010],"J");eq(YR[2026-2010],"T");
  if(new Set(Object.values(AREA).flat()).size!=SETS.mix.length)throw Error("every generator needs exactly one area");
  for(const g of SETS.mix)for(let i=0;i<2000;i++){
    const q=g(),all=JSON.stringify(q);
    if(q.o.length!=4||new Set(q.o).size!=4||q.c<0||q.c>3||/NaN|undefined|null,|Infinity|\$-/.test(all.replace('"svg":null','')))throw Error(g.name+" made a bad question: "+all);
  }
  return "self-test passed: "+SETS.mix.length+" generators x 2000";
}

// Figure styles. They use the host page's color variables: --card --line --ink --muted --metal --paper --blue --on-blue.
if(typeof document!="undefined")document.head.insertAdjacentHTML("beforeend","<style>"+`
.fig{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px}
.fig svg{display:block;width:100%;max-height:200px;margin:0 auto}
.fig svg text{font-family:inherit;font-size:12px;fill:var(--ink)}
.fig svg .m{fill:var(--metal);stroke:var(--ink);stroke-width:1.5}
.fig svg .g{fill:var(--card);stroke:var(--ink);stroke-width:1.5}
.fig svg .ln{stroke:var(--ink);stroke-width:1.5;fill:none}
.fig svg .w3{stroke-width:4;stroke-linecap:round}
.fig svg .wall{stroke:var(--ink);stroke-width:5;fill:none;stroke-linejoin:round;stroke-linecap:round}
.fig svg .dash{stroke:var(--muted);stroke-width:1.5;stroke-dasharray:6 4;fill:none}
.fig svg .tire{fill:var(--ink)}
.fig svg .dot{fill:var(--ink)}
.fig svg .cell{fill:var(--paper);stroke:var(--line)}
.fig svg .hl{fill:var(--blue);stroke:var(--blue)}
.fig svg text.hlt{fill:var(--on-blue)}
.fig svg text.sm{fill:var(--muted);font-size:9px}
.fig svg text.cap{fill:var(--muted);font-size:11px}
.fig svg text.big{font-size:22px;font-weight:700}
.fig svg text.mono{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:15px;font-weight:600}
.fig svg text.mic{font-size:14px}
`+"</style>");
return{SETS,AREA,shuffle,selfTest};
})();
if(typeof document=="undefined")console.log(DRILLS.selfTest());
