const scene = document.getElementById("scene");
const roomImage = document.getElementById("roomImage");
const glowLayer = document.getElementById("glowLayer");
const bubble = document.getElementById("speechBubble");
const bubbleTitle = document.getElementById("bubbleTitle");
const bubbleText = document.getElementById("bubbleText");
const visitedCountEl = document.getElementById("visitedCount");
const totalCountEl = document.getElementById("totalCount");
const hintButton = document.getElementById("hintButton");

const ROOM_WIDTH = 1695;
const ROOM_HEIGHT = 928;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2.4;
const PAN_STEP = 42;

const hotspots = [
  {
    id: "paddle",
    title: "Masa tenisi raketi",
    text: "Masa tenisi küçüklüğümden bu yana sıkılmadan oynayıp turnuvalara katıldığım spor aktivitelerimden biri.",
    x: 540,
    y: 283,
    w: 95,
    h: 115,
    cutout: "assets/cutouts/paddle_cutout.png",
    priority: 5
  },
  {
    id: "computer",
    title: "Bilgisayar",
    text: "Bilgisayarla içli dışlı büyüdüğüm için haliyle kodlama merakı oluştu. Balıkesir Üniversitesi Bilgisayar mühendisliği 2. sınıf öğrencisiyim. öğrendiğim yazılım dilleri : C# , Python , HTML / CSS / JavaScript",
    x: 920,
    y: 470,
    w: 310,
    h: 250,
    cutout: "assets/cutouts/computer_cutout.png",
    priority: 4
  },
  {
    id: "fish",
    title: "Balık",
    text: "Hafif serin bir havada nehrin kenarında kamp yapıp balık tutmak, en sevdiğim aktivite olabilir.",
    x: 492,
    y: 209,
    w: 78,
    h: 272,
    cutout: "assets/cutouts/fish_cutout.png",
    priority: 3
  },
  {
    id: "butterfly",
    title: "Kelebek çerçevesi",
    text: "Masamın üzerinde bu tarz koleksiyon eşyaları olmasını severim. Arka planı doğal gösteriyor.",
    x: 760,
    y: 560,
    w: 95,
    h: 130,
    cutout: "assets/cutouts/butterfly_cutout.png",
    priority: 2
  },
  {
    id: "filmProjector",
    title: "Film makinesi",
    text: "Favori Filmler : Lord Of The Rings , Jurassic world , Avatar , The NorthMan , Hobbit , X-Men .",
    x: 410,
    y: 60,
    w: 270,
    h: 200,
    cutout: "assets/cutouts/film_projector_cutout.png",
    priority: 9
  },
  {
    id: "seriesFrame",
    title: "Dizi çerçevesi",
    text: "Favori Diziler : Viking , The Walking Dead , From , Dark , Rick And Morty , Game Of Thrones .",
    x: 90,
    y: 70,
    w: 180,
    h: 270,
    cutout: "assets/cutouts/series_frame_cutout.png",
    priority: 8
  },
  {
    id: "ps5",
    title: "PS5 kolu",
    text: "Favori oyunlar : CS2 , Elden Ring , The Last Of Us , Skyrim , God Of War",
    x: 610,
    y: 690,
    w: 150,
    h: 140,
    cutout: "assets/cutouts/ps5_cutout.png",
    priority: 7
  },
  {
    id: "horse",
    title: "Ahşap at figürü",
    text: "Rafımın üzerinde bu tarz ahşap el işçiliği figürlere yer veririm. Kendim anlamasam da bu tarz kaliteli işçilikleri toplayıp koleksiyon yapmayı zevkli buluyorum.",
    x: 755,
    y: 650,
    w: 180,
    h: 185,
    cutout: "assets/cutouts/horse_cutout.png",
    priority: 6
  },
  {
    id: "jersey",
    title: "Beşiktaş forması",
    text: `Şenol Güneş :                                                                                                                                    karanlık aydınlıktan, yalan doğrudan kaçar 
güneş yalnız da olsa etrafa ışık saçar
üzülme, doğruların kaderidir yalnızlık
kargalar sürüyle kartallar yalnız uçar.`,
    x: 123,
    y: 334,
    w: 155,
    h: 260,
    cutout: "assets/cutouts/jersey_cutout.png",
    priority: 1
  }
].sort((a, b) => b.priority - a.priority);

let currentHover = null;
let activeHotspot = null;
let debugMode = false;
let hintMode = false;
let zoom = 1;
let panX = 0;
let panY = 0;
const visitedHotspots = new Set();

function updateCounter(){
  if(visitedCountEl) visitedCountEl.textContent = String(visitedHotspots.size);
  if(totalCountEl) totalCountEl.textContent = String(hotspots.length);
}

function markVisited(item){
  if(!item || visitedHotspots.has(item.id)) return;
  visitedHotspots.add(item.id);
  updateCounter();
}

function updateHintMode(){
  hotspots.forEach(h => h.glowEl?.classList.toggle("hint-visible", hintMode));
  if(hintButton){
    hintButton.classList.toggle("is-active", hintMode);
    hintButton.setAttribute("aria-pressed", hintMode ? "true" : "false");
  }
}

function clampPan(baseScale){
  const rect = scene.getBoundingClientRect();
  const imgW = ROOM_WIDTH * baseScale * zoom;
  const imgH = ROOM_HEIGHT * baseScale * zoom;
  const maxX = Math.max(0, (imgW - rect.width) / 2 + 40);
  const maxY = Math.max(0, (imgH - rect.height) / 2 + 40);
  panX = Math.max(-maxX, Math.min(maxX, panX));
  panY = Math.max(-maxY, Math.min(maxY, panY));
}

function getImageRect(){
  const rect = scene.getBoundingClientRect();
  const baseScale = Math.min(rect.width / ROOM_WIDTH, rect.height / ROOM_HEIGHT);
  clampPan(baseScale);
  const scale = baseScale * zoom;
  const width = ROOM_WIDTH * scale;
  const height = ROOM_HEIGHT * scale;
  const left = rect.left + (rect.width - width) / 2 + panX;
  const top = rect.top + (rect.height - height) / 2 + panY;
  return { left, top, width, height, scale, baseScale };
}

function positionRoomImage(){
  const r = getImageRect();
  roomImage.style.left = `${r.left}px`;
  roomImage.style.top = `${r.top}px`;
  roomImage.style.width = `${r.width}px`;
  roomImage.style.height = `${r.height}px`;
}

function naturalFromPointer(clientX, clientY){
  const r = getImageRect();
  const x = (clientX - r.left) / r.scale;
  const y = (clientY - r.top) / r.scale;
  if(x < 0 || y < 0 || x > ROOM_WIDTH || y > ROOM_HEIGHT) return null;
  return { x, y, rect: r };
}

function createGlowImages(){
  hotspots.forEach(item => {
    const img = new Image();
    img.src = item.cutout;
    img.alt = "";
    img.className = item.id === "jersey" ? "object-glow jersey-hover-glow" : "object-glow";
    img.dataset.id = item.id;
    glowLayer.appendChild(img);
    item.glowEl = img;
  });
}

function positionGlowImages(){
  const r = getImageRect();
  hotspots.forEach(item => {
    const el = item.glowEl;
    if(!el) return;
    el.style.left = `${r.left + item.x * r.scale}px`;
    el.style.top = `${r.top + item.y * r.scale}px`;
    el.style.width = `${item.w * r.scale}px`;
    el.style.height = `${item.h * r.scale}px`;
  });
}

function alphaHit(item, nx, ny){
  const localX = Math.floor(nx - item.x);
  const localY = Math.floor(ny - item.y);
  if(localX < 0 || localY < 0 || localX >= item.w || localY >= item.h) return false;
  const mask = window.HIT_MASKS && window.HIT_MASKS[item.id];
  if(!mask) return true;
  const row = mask.rows[localY];
  if(!row || row.length === 0) return false;
  for(const seg of row){
    if(localX >= seg[0] && localX <= seg[1]) return true;
    if(localX < seg[0]) return false;
  }
  return false;
}

function findHotspotAt(clientX, clientY){
  const p = naturalFromPointer(clientX, clientY);
  if(!p) return null;
  for(const item of hotspots){
    if(alphaHit(item, p.x, p.y)) return item;
  }
  return null;
}

function setHover(item){
  if(currentHover === item) return;
  hotspots.forEach(h => h.glowEl?.classList.remove("is-visible"));
  currentHover = item;
  if(item){
    item.glowEl?.classList.add("is-visible");
    scene.style.cursor = "pointer";
  } else {
    scene.style.cursor = "default";
  }
}

function closeBubble(){
  bubble.style.display = "none";
  bubble.setAttribute("aria-hidden", "true");
  activeHotspot = null;
}

function openBubble(item){
  activeHotspot = item;
  markVisited(item);
  bubbleTitle.textContent = item.title;
  bubbleText.textContent = item.text;
  bubble.style.display = "block";
  bubble.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => {
    const r = getImageRect();
    const centerX = r.left + (item.x + item.w / 2) * r.scale;
    const topY = r.top + item.y * r.scale - 14;
    const bubbleRect = bubble.getBoundingClientRect();
    const margin = 12;
    let x = centerX;
    let y = topY;
    const half = bubbleRect.width / 2;
    if(x - half < margin) x = margin + half;
    if(x + half > window.innerWidth - margin) x = window.innerWidth - margin - half;
    if(y - bubbleRect.height < margin) y = r.top + (item.y + item.h) * r.scale + bubbleRect.height + 20;
    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;
  });
}

function updateDebugMode(){
  hotspots.forEach(h => h.glowEl?.classList.toggle("debug-visible", debugMode));
}

function refreshScene(){
  positionRoomImage();
  positionGlowImages();
  if(activeHotspot) openBubble(activeHotspot);
}

function adjustZoom(delta){
  const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta));
  if(next === zoom) return;
  zoom = next;
  refreshScene();
}

function init(){
  createGlowImages();
  updateCounter();
  updateHintMode();
  refreshScene();

  scene.addEventListener("pointermove", event => {
    setHover(findHotspotAt(event.clientX, event.clientY));
  });

  scene.addEventListener("pointerleave", () => setHover(null));

  scene.addEventListener("click", event => {
    const item = findHotspotAt(event.clientX, event.clientY);
    if(item){
      event.stopPropagation();
      openBubble(item);
    } else {
      closeBubble();
    }
  });

  scene.addEventListener("wheel", event => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? -0.12 : 0.12;
    adjustZoom(direction);
  }, { passive:false });

  document.addEventListener("click", closeBubble);
  bubble.addEventListener("click", event => event.stopPropagation());

  hintButton?.addEventListener("click", event => {
    event.stopPropagation();
    hintMode = !hintMode;
    updateHintMode();
  });

  document.addEventListener("keydown", event => {
    const key = event.key;
    if(key === "Escape") closeBubble();
    if(key.toLowerCase() === "d"){
      debugMode = !debugMode;
      updateDebugMode();
    }
    if(key === "ArrowLeft"){ panX += PAN_STEP; refreshScene(); event.preventDefault(); }
    if(key === "ArrowRight"){ panX -= PAN_STEP; refreshScene(); event.preventDefault(); }
    if(key === "ArrowUp"){ panY += PAN_STEP; refreshScene(); event.preventDefault(); }
    if(key === "ArrowDown"){ panY -= PAN_STEP; refreshScene(); event.preventDefault(); }
    if(key === "+" || key === "="){ adjustZoom(0.12); event.preventDefault(); }
    if(key === "-" || key === "_"){ adjustZoom(-0.12); event.preventDefault(); }
  });

  window.addEventListener("resize", refreshScene);
}

init();
