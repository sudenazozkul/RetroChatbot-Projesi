const chatlog = document.getElementById("chatlog");
const chatform = document.getElementById("chatform");
const userinput = document.getElementById("userinput");
const counter = document.getElementById("counter");
const modeToggleBtn = document.getElementById("modeToggleBtn");

const texts = {
  retro: {
    pageTitle: "~*~ RetroBot 3000 ~*~ Zamanda Yolculuk Sohbet Botu ~*~",
    marquee: "*** RetroBot 3000'e HOSGELDINIZ *** Bu site en iyi 800x600 cozunurlukte ve Netscape Navigator ile goruntulenir *** Sayfamiz her zaman YAPIM ASAMASINDA'dir ***",
    blinkLeft: "*NEW*",
    blinkRight: "*HOT*",
    mainTitle: "~*~ R E T R O B O T  3 0 0 0 ~*~",
    subTitle: "\"Zihni sonsuza dek 1990'larda kalan yapay zeka\"",
    sidebarTitle: "WEB HALKASI",
    badge1: "Best viewed<br>800x600",
    badge2: "Netscape<br>Now!",
    counterLabel: "Ziyaretci sayisi:",
    chatTitle: "RetroBot ile Sohbet ~ IRC Kanali #1990lar",
    promptLabel: "SEN&gt;",
    sendBtn: "GONDER",
    placeholder: "mesajini yaz...",
    ucBox: "🚧 YAPIM ASAMASINDA 🚧",
    footerCopy: "&copy; 1998 RetroBot Industries. Tum haklari saklidir.",
    footerOptimized: "Bu sayfa <b>Internet Explorer 4.0</b> ve <b>Netscape Navigator 3.0</b> icin optimize edilmistir.",
    footerBlink: "E-postami imzala &gt;&gt;&gt; webmaster@retrobot.geocities.com",
    modeBtn: "🚀 2030'A MODERNLESTIR",
    botNick: "RetroBot",
    intro: "Selam! Ben RetroBot, bilgisayarina disket takip beni calistirdigin icin tesekkurler :) Bugun 199x, ne sormak istersin?",
    thinking: "yaziyor... (14.4k modem baglaniyor)",
    navLinks: ["Ana Sayfa", "Misafir Defteri", "Webmaster'a Yaz", "Sayac", "Baglantilar"],
  },
  future: {
    pageTitle: "~ NEXUS-30 ~ 2030 Yapay Zeka Terminali ~",
    marquee: "NEXUS-30 CEVRIMICI // NORO-ARAYUZ BAGLANTISI STABIL // KUANTUM CEKIRDEK %100 // GELECEGE HOSGELDINIZ",
    blinkLeft: "AI",
    blinkRight: "LIVE",
    mainTitle: "N E X U S – 3 0",
    subTitle: "2030'un yapay genel zeka asistani",
    sidebarTitle: "KONTROL PANELI",
    badge1: "Noro-Arayuz<br>Aktif",
    badge2: "Kuantum Cekirdek<br>Cevrimici",
    counterLabel: "Aktif baglanti sayisi:",
    chatTitle: "NEXUS-30 ile Sohbet ~ Noro-Ag Kanali #2030",
    promptLabel: "SEN&gt;",
    sendBtn: "GONDER",
    placeholder: "mesajini yaz veya dusun...",
    ucBox: "⚡ SUREKLI GELISIYOR ⚡",
    footerCopy: "&copy; 2030 NEXUS Industries. Tum haklari saklidir.",
    footerOptimized: "Bu terminal <b>Noro-Arayuz v12</b> ve <b>Kuantum Tarayici</b> icin optimize edilmistir.",
    footerBlink: "Beni imzala &gt;&gt;&gt; nexus30@neural.net",
    modeBtn: "⏪ 1990'LARA DON",
    botNick: "NEXUS-30",
    intro: "Merhaba! Ben NEXUS-30, noro-arayuzunle baglanti kurdum. Su an 2030 yilindayiz, kuantum cekirdegim hazir. Ne sormak istersin?",
    thinking: "isleniyor... (kuantum cekirdek senkronize ediliyor)",
    navLinks: ["Ana Panel", "Noro-Gunluk", "NEXUS'a Yaz", "Baglanti Sayaci", "Ag Haritasi"],
  },
};

let mode = "retro";
let history = [];

function applyTexts(t) {
  document.title = t.pageTitle;
  document.getElementById("pageTitle").textContent = t.pageTitle;
  document.getElementById("topMarquee").textContent = t.marquee;
  document.getElementById("blinkLeft").textContent = t.blinkLeft;
  document.getElementById("blinkRight").textContent = t.blinkRight;
  document.getElementById("mainTitle").textContent = t.mainTitle;
  document.getElementById("subTitle").textContent = t.subTitle;
  document.getElementById("sidebarTitle").textContent = t.sidebarTitle;
  document.getElementById("badge1").innerHTML = t.badge1;
  document.getElementById("badge2").innerHTML = t.badge2;
  document.getElementById("counterLabel").textContent = t.counterLabel;
  document.getElementById("chatTitle").textContent = t.chatTitle;
  document.getElementById("promptLabel").innerHTML = t.promptLabel;
  document.getElementById("sendBtn").textContent = t.sendBtn;
  document.getElementById("userinput").placeholder = t.placeholder;
  document.getElementById("ucBox").textContent = t.ucBox;
  document.getElementById("footerCopy").innerHTML = t.footerCopy;
  document.getElementById("footerOptimized").innerHTML = t.footerOptimized;
  document.getElementById("footerBlink").innerHTML = t.footerBlink;
  modeToggleBtn.textContent = t.modeBtn;

  const navList = document.getElementById("navList");
  navList.innerHTML = t.navLinks.map((label) => `<li><a href="#">${label}</a></li>`).join("");
}

function resetChat(t) {
  chatlog.innerHTML = "";
  history = [];
  appendMessage(t.botNick, t.intro, "bot");
}

function bumpCounter() {
  const n = parseInt(counter.textContent, 10) + 1;
  counter.textContent = String(n).padStart(7, "0");
}

function appendMessage(nick, text, cssClass) {
  const div = document.createElement("div");
  div.className = `msg ${cssClass}`;
  const nickSpan = document.createElement("span");
  nickSpan.className = "nick";
  nickSpan.textContent = `${nick}:`;
  div.appendChild(nickSpan);
  div.appendChild(document.createTextNode(text));
  chatlog.appendChild(div);
  chatlog.scrollTop = chatlog.scrollHeight;
  return div;
}

modeToggleBtn.addEventListener("click", () => {
  mode = mode === "retro" ? "future" : "retro";
  document.body.classList.toggle("modern-theme", mode === "future");
  const t = texts[mode];
  applyTexts(t);
  resetChat(t);
});

chatform.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = userinput.value.trim();
  if (!message) return;

  const t = texts[mode];

  appendMessage("SEN", message, "user");
  userinput.value = "";
  userinput.disabled = true;
  bumpCounter();

  const thinking = appendMessage(t.botNick, t.thinking, "bot");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, mode }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `HTTP ${response.status}`);
    }

    const data = await response.json();
    thinking.remove();
    appendMessage(t.botNick, data.reply, "bot");

    history.push({ role: "user", text: message });
    history.push({ role: "model", text: data.reply });
  } catch (error) {
    thinking.remove();
    appendMessage("SISTEM HATASI", `Baglanti koptu! (${error.message})`, "error");
  } finally {
    userinput.disabled = false;
    userinput.focus();
  }
});
