/* Tokenscope FX - drop-in glow + animation layer.
   Add before </body>:  <script src="tokenscope-fx.js"></script>
   Optional accent override (put above the script tag):  <script>window.TS_FX_ACCENT="#00e5ff"</script> */
(function () {
  if (window.__tsfx) return;
  window.__tsfx = 1;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var root = document.documentElement;
  var cs = getComputedStyle(root);
  var acc = window.TS_FX_ACCENT || cs.getPropertyValue("--accent").trim() || cs.getPropertyValue("--primary").trim() || "#2be3a6";
  root.style.setProperty("--fx", acc);

  var css = `
:root{--fxg:color-mix(in srgb,var(--fx) 55%,transparent);--fxs:color-mix(in srgb,var(--fx) 22%,transparent)}
.fx-orb{position:fixed;width:46vmax;height:46vmax;border-radius:50%;pointer-events:none;z-index:0;opacity:.16;mix-blend-mode:screen;filter:blur(70px);background:radial-gradient(circle,var(--fx),transparent 65%);animation:fxFloat 22s ease-in-out infinite alternate}
.fx-orb.b{right:-15vmax;bottom:-15vmax;left:auto;top:auto;animation-duration:29s;animation-delay:-8s;background:radial-gradient(circle,#7a5cff,transparent 65%)}
.fx-orb.a{left:-15vmax;top:-15vmax}
@keyframes fxFloat{to{transform:translate(8vmax,6vmax) scale(1.2)}}
.fx-cursor{position:fixed;left:0;top:0;width:420px;height:420px;margin:-210px 0 0 -210px;border-radius:50%;pointer-events:none;z-index:0;opacity:.14;mix-blend-mode:screen;background:radial-gradient(circle,var(--fx),transparent 62%);transition:opacity .3s;will-change:transform}
.fx-bar{position:fixed;left:0;top:0;height:3px;width:100%;transform-origin:0 50%;transform:scaleX(0);background:linear-gradient(90deg,var(--fx),#7a5cff);box-shadow:0 0 12px var(--fxg);z-index:9999;pointer-events:none}
h1{animation:fxHead 3.4s ease-in-out infinite}
@keyframes fxHead{0%,100%{text-shadow:0 0 12px var(--fxs)}50%{text-shadow:0 0 28px var(--fxg),0 0 60px var(--fxs)}}
.fx-logo{background:linear-gradient(90deg,var(--fx),#fff,#7a5cff,var(--fx));background-size:300% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;animation:fxShine 5s linear infinite}
@keyframes fxShine{to{background-position:300% 0}}
button,.btn,input[type=submit],a.btn{transition:transform .18s,box-shadow .25s,filter .25s;position:relative;overflow:hidden}
button:hover,.btn:hover,a.btn:hover{transform:translateY(-2px);box-shadow:0 0 18px var(--fxg);filter:brightness(1.12)}
button:active,.btn:active{transform:translateY(0) scale(.97)}
.fx-cta{animation:fxPulse 2.2s ease-in-out infinite}
@keyframes fxPulse{0%,100%{box-shadow:0 0 0 0 var(--fxg),0 0 14px var(--fxs)}50%{box-shadow:0 0 0 9px transparent,0 0 30px var(--fxg)}}
.fx-rip{position:absolute;border-radius:50%;pointer-events:none;background:var(--fxg);transform:scale(0);animation:fxRip .6s ease-out forwards}
@keyframes fxRip{to{transform:scale(3.2);opacity:0}}
input:focus,textarea:focus,select:focus{outline:none;box-shadow:0 0 0 2px var(--fxs),0 0 24px var(--fxg);transition:box-shadow .25s}
.fx-card{transition:transform .28s cubic-bezier(.2,.8,.2,1),box-shadow .3s,border-color .3s}
.fx-card:hover{transform:translateY(-5px);box-shadow:0 8px 34px var(--fxs),0 0 0 1px var(--fxg);border-color:var(--fx)}
.fx-rv{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.8,.2,1);transition-delay:var(--d,0ms)}
.fx-rv.fx-in{opacity:1;transform:none}
.fx-pop{animation:fxPop .55s cubic-bezier(.2,.8,.2,1) both;animation-delay:var(--d,0ms)}
@keyframes fxPop{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}
[class*="score"]{animation:fxScore 3s ease-in-out infinite}
@keyframes fxScore{0%,100%{text-shadow:0 0 6px var(--fxs)}50%{text-shadow:0 0 18px var(--fxg)}}
a{transition:text-shadow .25s,color .25s}
a:hover{text-shadow:0 0 10px var(--fxg)}
`;
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function mk(c) { var d = document.createElement("div"); d.className = c; document.body.appendChild(d); return d; }
  mk("fx-orb a"); mk("fx-orb b");
  var bar = mk("fx-bar");

  // scroll progress
  function prog() {
    var h = root.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, scrollY / h) : 0) + ")";
  }
  addEventListener("scroll", prog, { passive: true }); prog();

  // cursor glow (mouse devices only)
  if (matchMedia("(pointer:fine)").matches) {
    var cur = mk("fx-cursor"), tx = 0, ty = 0, raf = 0;
    addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(function () { cur.style.transform = "translate(" + tx + "px," + ty + "px)"; raf = 0; });
    }, { passive: true });
  }

  // logo shimmer
  document.querySelectorAll("header b,header strong,nav b,nav strong,.logo b,.logo strong,.logo span,.brand b,.brand strong").forEach(function (n) { n.classList.add("fx-logo"); });

  // cards: parents of h3 inside sections, plus details/faq items
  document.querySelectorAll("section h3").forEach(function (h) {
    var p = h.parentElement;
    if (p && p.tagName !== "SECTION" && p !== document.body) p.classList.add("fx-card");
  });
  document.querySelectorAll("details,[class*='card'],[class*='faq'] > *").forEach(function (n) { n.classList.add("fx-card"); });

  // main scan button gets the pulse
  document.querySelectorAll("button,input[type=submit],.btn").forEach(function (b) {
    if (/scan/i.test(b.textContent || b.value || "")) b.classList.add("fx-cta");
  });

  // click ripple
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("button,.btn,input[type=submit]");
    if (!b || b.tagName === "INPUT") return;
    var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), d = document.createElement("span");
    d.className = "fx-rip";
    d.style.cssText = "width:" + s + "px;height:" + s + "px;left:" + (e.clientX - r.left - s / 2) + "px;top:" + (e.clientY - r.top - s / 2) + "px";
    b.appendChild(d);
    setTimeout(function () { d.remove(); }, 650);
  });

  // scroll reveal with stagger
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("fx-in"); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  var revealSel = "section h2,section > p,.fx-card,[class*='step'],[class*='chain'] > *,dl > *";
  var seen = new Set();
  function reveal(scope) {
    var i = 0;
    scope.querySelectorAll(revealSel).forEach(function (n) {
      if (seen.has(n)) return;
      seen.add(n);
      n.style.setProperty("--d", (i++ % 6) * 70 + "ms");
      n.classList.add("fx-rv");
      io.observe(n);
    });
  }
  reveal(document);

  // animate scan results as they are rendered
  var mo = new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType !== 1 || /^(SCRIPT|STYLE|SPAN)$/.test(n.tagName) || /^fx-/.test(n.className || "")) return;
        if (n.classList.contains("fx-rip") || n.classList.contains("fx-orb")) return;
        if (!(n.textContent || "").trim()) return;
        n.classList.add("fx-pop");
        Array.prototype.slice.call(n.children, 0, 14).forEach(function (c, i) {
          c.style.setProperty("--d", (i + 1) * 60 + "ms");
          c.classList.add("fx-pop");
        });
        setTimeout(function () { n.classList.remove("fx-pop"); }, 1800);
      });
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();
