import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SECTIONS = ["home", "problema", "soluzione", "portfolio", "risultati", "servizi", "processo", "pricing", "faq", "contatti"];
const NAV_LABELS = { home: "Home", problema: "Problema", soluzione: "Soluzione", risultati: "Risultati", portfolio: "Portfolio", servizi: "Servizi", processo: "Come Funziona", pricing: "Prezzi", faq: "FAQ", contatti: "Contatti" };

const FONT_INTER = "'Inter', sans-serif";
const ACCENT = "#EF4444";
const ACCENT_RGBA = (o) => `rgba(239,68,68,${o})`;
const SCROLL_OFFSET = 80;
const WHATSAPP_NUMBER = "393664400722";
const WHATSAPP_PRENOTA_MSG = "Buongiorno, vorrei prenotare un'analisi gratuita della mia pizzeria.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_PRENOTA_MSG)}`;

/* ───────── SMOOTH SCROLL ───────── */
function scrollToSection(id, onAfterScroll) {
  const el = document.getElementById(id);
  if (!el) return;
  history.replaceState(null, "", `#${id}`);
  const targetY = el.getBoundingClientRect().top + window.pageYOffset - SCROLL_OFFSET;
  const supportsSmooth = "scrollBehavior" in document.documentElement.style;
  if (supportsSmooth) {
    window.scrollTo({ top: targetY, behavior: "smooth" });
  } else {
    const start = window.pageYOffset;
    const diff = targetY - start;
    const duration = 500;
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress * (2 - progress);
      window.scrollTo(0, start + diff * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  onAfterScroll?.();
}

/* ───────── SCROLL REVEAL ───────── */
function ScrollReveal({ children, className = "", style = {}, delay = 0, once = true }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
        else if (!once) setVisible(false);
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);
  return (
    <div ref={ref} className={`scroll-reveal ${visible ? "scroll-reveal-visible" : ""} ${className}`} style={{ ...style, animationDelay: visible ? `${delay}ms` : undefined }}>
      {children}
    </div>
  );
}

/* ───────── TEXT REVEAL ───────── */
function TextReveal({ text, tag: Tag = "h2", style = {}, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag ref={ref} className={`text-reveal ${visible ? "text-reveal-visible" : ""} ${className}`.trim()} style={style}>
      {words.map((w, i) => (
        <span key={i}>
          {i > 0 && " "}
          <span className="text-reveal-word" style={{ animationDelay: visible ? `${i * 60}ms` : undefined }}>{w}</span>
        </span>
      ))}
    </Tag>
  );
}

/* ───────── COUNT UP ANIMATION ───────── */
function parseValue(value) {
  const str = String(value).trim();
  const match = str.match(/^([\d.,]+)(.*)$/);
  if (!match) return { num: 0, suffix: str };
  const numStr = match[1].replace(",", ".");
  const num = parseFloat(numStr) || 0;
  const suffix = match[2] || "";
  return { num, suffix };
}
function easeOutQuad(t) {
  return t * (2 - t);
}
function CountUp({ value, duration = 2000, style }) {
  const { num: target, suffix: suf } = parseValue(value);
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const animated = useRef(false);
  const suffix = suf;
  useEffect(() => {
    const el = ref.current;
    if (!el || animated.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return;
        animated.current = true;
        const start = performance.now();
        const decimals = target % 1 !== 0 ? 1 : 0;
        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutQuad(progress);
          const current = target * eased;
          setDisplay(current.toFixed(decimals));
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            setDisplay(target % 1 !== 0 ? target.toFixed(1) : String(Math.round(target)));
          }
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.2, rootMargin: "0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration, target]);
  return (
    <span ref={ref} style={style}>
      {display}{suffix}
    </span>
  );
}

/* ───────── NOISE OVERLAY ───────── */
function NoiseOverlay() {
  const noiseSvg = `data:image/svg+xml,<svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)"/></svg>`;
  return (
    <div
      className="noise-overlay"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9998,
        opacity: 0.03,
        backgroundImage: `url("${noiseSvg}")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}

/* ───────── ECF MEDIA LOGO ───────── */
function ECFLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 32, height: 32, background: ACCENT, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 12, height: 12, border: "2.5px solid #fff", borderRadius: 3 }} />
      </div>
      <span style={{ fontFamily: FONT_INTER, fontWeight: 800, color: "#ffffff", fontSize: 18 }}>ECF</span>
      <span style={{ fontFamily: FONT_INTER, fontWeight: 400, color: "rgba(255,255,255,0.6)", fontSize: 18 }}>media</span>
    </div>
  );
}

/* ───────── NAVBAR ───────── */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => {
      const offsets = SECTIONS.map(id => { const el = document.getElementById(id); return el ? { id, top: el.offsetTop - 100 } : null; }).filter(Boolean);
      for (let i = offsets.length - 1; i >= 0; i--) { if (window.scrollY >= offsets[i].top) { setActive(offsets[i].id); break; } }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);

  const scrollTo = (id) => { scrollToSection(id, () => setMenuOpen(false)); };

  return (
    <nav className="nav-ecf" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(12,12,12,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(239,68,68,0.2)", height: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="nav-inner" style={{ width: "100%", maxWidth: 1440, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <ECFLogo />
      <div style={{ display: "flex", gap: 6, alignItems: "center" }} className="desktop-nav-p">
        {SECTIONS.map(id => (
          <button key={id} onClick={() => scrollTo(id)} className={`btn-nav ${id === "contatti" ? "btn-nav-cta" : ""}`} style={id === "contatti" ? { background: ACCENT, color: "#ffffff", border: "none", cursor: "pointer", padding: "10px 18px", fontFamily: FONT_INTER, fontSize: 11, fontWeight: 600, transition: "transform 0.2s ease, color 0.2s ease, background-color 0.2s ease", textTransform: "uppercase", letterSpacing: 1.5, borderRadius: 9999 } : { background: "transparent", border: "none", cursor: "pointer", padding: "8px 13px", fontFamily: FONT_INTER, fontSize: 11, fontWeight: active === id ? 600 : 400, color: active === id ? ACCENT : "rgba(255,255,255,0.6)", transition: "transform 0.2s ease, color 0.2s ease", textTransform: "uppercase", letterSpacing: 1.5 }}>{NAV_LABELS[id]}</button>
        ))}
      </div>
      <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger-p hamburger-btn btn-tap" style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 6, padding: 10, zIndex: 1001, transition: "transform 0.2s ease", alignItems: "center", justifyContent: "center" }}>
        <span style={{ width: 26, height: 1.5, background: ACCENT, transition: "all .3s", transform: menuOpen ? "rotate(45deg) translate(6px, 6px)" : "none" }} />
        <span style={{ width: 26, height: 1.5, background: ACCENT, transition: "all .3s", opacity: menuOpen ? 0 : 1 }} />
        <span style={{ width: 26, height: 1.5, background: ACCENT, transition: "all .3s", transform: menuOpen ? "rotate(-45deg) translate(6px, -6px)" : "none" }} />
      </button>
      </div>
      {menuOpen && (
        <div className="mobile-menu-overlay" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100%", minHeight: "100vh", minHeight: "100dvh", zIndex: 9999, backgroundColor: "#0C0C0C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 40px", boxSizing: "border-box", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ marginBottom: 32, flexShrink: 0 }}>
            <ECFLogo />
          </div>
          <nav className="mobile-menu-nav" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", maxWidth: 320 }}>
            {SECTIONS.map(id => (
              <button key={id} onClick={() => scrollTo(id)} className={`btn-nav-mobile btn-tap ${id === "contatti" ? "btn-nav-mobile-cta" : ""}`} style={id === "contatti" ? { background: ACCENT, color: "#ffffff", border: "none", cursor: "pointer", padding: "16px 28px", fontFamily: FONT_INTER, fontSize: 18, fontWeight: 600, width: "100%", maxWidth: 280, textAlign: "center", letterSpacing: 1, transition: "transform 0.2s ease, background-color 0.2s ease", borderRadius: 9999 } : { background: "transparent", border: "none", cursor: "pointer", padding: "16px 28px", fontFamily: FONT_INTER, fontSize: 18, fontWeight: active === id ? 600 : 500, color: active === id ? ACCENT : "#ffffff", width: "100%", maxWidth: 280, textAlign: "center", letterSpacing: 0.5, transition: "transform 0.2s ease, color 0.2s ease" }}>{NAV_LABELS[id]}</button>
            ))}
          </nav>
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        .hamburger-p { display: none !important; }
        @media (max-width: 900px) { .desktop-nav-p { display: none !important; } .hamburger-p { display: flex !important; } }
        .nav-ecf .nav-inner { padding-left: max(36px, env(safe-area-inset-left)); padding-right: max(36px, env(safe-area-inset-right)); }
        .hamburger-btn { min-width: 44px; min-height: 44px; }
        @media (max-width: 480px) { .nav-ecf .nav-inner { padding-left: max(16px, env(safe-area-inset-left)); padding-right: max(16px, env(safe-area-inset-right)); } }
        .mobile-menu-overlay {
          padding-top: max(80px, env(safe-area-inset-top));
          padding-left: max(24px, env(safe-area-inset-left));
          padding-right: max(24px, env(safe-area-inset-right));
          padding-bottom: max(40px, env(safe-area-inset-bottom));
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .mobile-menu-overlay::-webkit-scrollbar { display: none; }
        .mobile-menu-overlay .btn-nav-mobile { white-space: nowrap; }
        .mobile-menu-overlay .btn-nav-mobile:not(.btn-nav-mobile-cta):hover { color: #EF4444 !important; }
      `}</style>
    </nav>
  );
}

/* ───────── HERO ───────── */
function Hero() {
  const meshRef = useRef(null);
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const onScroll = () => {
      const y = window.scrollY;
      const rate = Math.min(y * 0.08, 40);
      mesh.style.transform = `translateY(${rate}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <section id="home" className="hero-section" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0C0C0C", position: "relative", overflow: "hidden" }}>
      <div ref={meshRef} className="hero-mesh hero-mesh-parallax" aria-hidden="true">
        <div className="hero-blob hero-blob-1" style={{ background: "rgba(239,68,68,0.12)" }} />
        <div className="hero-blob hero-blob-2" style={{ background: "rgba(56,189,248,0.1)" }} />
        <div className="hero-blob hero-blob-3 hero-blob-mobile-hide" style={{ background: "rgba(125,211,252,0.1)" }} />
        <div className="hero-blob hero-blob-4 hero-blob-mobile-hide" style={{ background: "rgba(186,230,253,0.12)" }} />
      </div>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT_RGBA(0.06)} 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div className="hero-line-mobile-hide" style={{ position: "absolute", top: 120, right: "10%", width: 1, height: 120, background: `linear-gradient(to bottom, transparent, ${ACCENT_RGBA(0.2)}, transparent)` }} />
      <div className="hero-line-mobile-hide" style={{ position: "absolute", bottom: 120, left: "10%", width: 1, height: 120, background: `linear-gradient(to bottom, transparent, ${ACCENT_RGBA(0.2)}, transparent)` }} />

      <div className="hero-content-inner" style={{ maxWidth: "min(1100px, 92vw)", width: "100%", marginLeft: "auto", marginRight: "auto", textAlign: "center", position: "relative", zIndex: 1, boxSizing: "border-box" }}>
        <div style={{ fontFamily: FONT_INTER, fontSize: 11, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 32 }}>L'AGENZIA WEB PER PIZZERIE</div>
        <h1 style={{ fontFamily: FONT_INTER, fontSize: "clamp(38px, 6vw, 72px)", fontWeight: 800, color: "#ffffff", lineHeight: 1.1, margin: "0 0 28px", letterSpacing: -0.5 }}>
          {["La", "Tua", "Pizzeria", "Merita"].map((word, i) => (
            <span key={i}>
              {i > 0 && " "}
              <span className="hero-word" style={{ animationDelay: `${300 + i * 80}ms` }}>{word}</span>
            </span>
          ))}
          <br />
          <span style={{ color: ACCENT, fontStyle: "italic" }}>
            <span className="hero-word" style={{ animationDelay: "940ms" }}>Più Clienti.</span>
          </span>
        </h1>
        <p className="hero-subtitle" style={{ fontFamily: FONT_INTER, fontSize: "clamp(14px, 2vw, 16px)", color: "rgba(255,255,255,0.6)", maxWidth: 520, margin: "0 auto 44px", lineHeight: 1.9, fontWeight: 400, letterSpacing: 0.3 }}>Creiamo siti web, sistemi di prenotazione e ordini online che riempiono i tavoli e aumentano gli asporti. Specializzati solo in pizzerie.</p>
        <div className="cta-hero-wrap" style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")} className="btn-primary btn-hero-cta-primary" style={{ background: "transparent", color: ACCENT, border: `1px solid ${ACCENT}`, padding: "16px 44px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease", minWidth: 200 }}>Analisi Gratuita della Tua Pizzeria</button>
          <button onClick={() => scrollToSection("portfolio")} className="btn-outline btn-hero-cta-secondary" style={{ background: "transparent", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.12)", padding: "16px 44px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease", minWidth: 200 }}>Vedi Esempi</button>
        </div>
        <div style={{ width: 1, height: 60, background: `linear-gradient(to bottom, transparent, ${ACCENT_RGBA(0.3)})`, margin: "56px auto 0" }} />
        <div className="hero-stats-wrap" style={{ display: "flex", gap: 56, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
          {[["50+", "Pizzerie Online"], ["4.9", "Rating"], ["40", "Ordini Medi", true]].map(([num, label, isPercent]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <span style={{ fontFamily: FONT_INTER, fontSize: 32, fontWeight: 800, color: ACCENT }}>
                {isPercent ? <>+<CountUp value={num} duration={2000} />%</> : <CountUp value={num} duration={2000} />}
              </span>
              <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 4, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── BLUE LINE ───────── */
function BlueLine() {
  return <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${ACCENT_RGBA(0.2)}, transparent)` }} />;
}

/* ───────── PROBLEM ───────── */
function Problem() {
  const problems = [
    { title: "Nessuno Ti Trova", desc: "Quando qualcuno cerca 'pizzeria [tua zona]' su Google, trova i tuoi concorrenti. Tu non ci sei. Ogni ricerca è un cliente perso che va da un'altra parte." },
    { title: "Telefono Sempre Occupato", desc: "È venerdì sera, il telefono squilla a vuoto, i clienti rinunciano e ordinano altrove. Stai perdendo ordini perché non hai un sistema di prenotazione automatico." },
    { title: "Solo Passaparola", desc: "Il passaparola funziona, ma non scala. Senza presenza online, i turisti, i nuovi residenti e chi non ti conosce vanno sempre dai concorrenti che trovano su Google." }
  ];
  return (
    <section id="problema" className="section-padding" style={{ background: "#0C0C0C" }}>
      <div style={{ maxWidth: "min(1200px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>IL PROBLEMA</div>
          <TextReveal text="La Tua Pizzeria Sta Perdendo Clienti Ogni Giorno" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#ffffff", marginBottom: 16 }} />
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 36 }}>
          {problems.map((p, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="card-problema" style={{ textAlign: "center", padding: "24px 16px", border: "1px solid rgba(255,255,255,0.06)", transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 56, fontWeight: 800, color: ACCENT_RGBA(0.2), lineHeight: 1, marginBottom: 16 }}>{i + 1}</div>
              <h3 style={{ fontFamily: FONT_INTER, fontSize: 22, fontWeight: 800, color: "#ffffff", marginBottom: 12 }}>{p.title}</h3>
              <p style={{ fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.85, margin: 0, fontWeight: 400 }}>{p.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SOLUTION ───────── */
function Solution() {
  const benefits = [
    { title: "Sito che Converte", desc: "Non un sito vetrina. Un sito che fa venire fame, mostra il menù, fa prenotare il tavolo e ordinare l'asporto. Ogni visitatore diventa un cliente." },
    { title: "Prenotazioni Automatiche", desc: "I clienti prenotano dal sito o da WhatsApp, 24/7, senza che tu debba rispondere al telefono. Le prenotazioni arrivano organizzate, zero confusione." },
    { title: "Ordini Online", desc: "Asporto e delivery direttamente dal tuo sito. Il cliente sceglie le pizze, manda l'ordine, tu lo prepari. Niente telefonate, niente errori, più ordini." }
  ];
  return (
    <section id="soluzione" className="section-padding" style={{ background: "#0C0C0C" }}>
      <div style={{ maxWidth: "min(1200px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>LA SOLUZIONE</div>
          <h2 style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#ffffff", marginBottom: 16 }}>
            Tutto Quello che Serve alla Tua{" "}
            <span style={{ color: ACCENT, fontStyle: "italic" }}>Pizzeria</span>
          </h2>
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
          {benefits.map((b, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="card-soluzione" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${ACCENT_RGBA(0.25)}`, padding: "44px 32px", textAlign: "center", transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease" }}>
              <div style={{ width: 48, height: 48, border: `1px solid ${ACCENT_RGBA(0.3)}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontFamily: FONT_INTER, fontSize: 20, color: ACCENT, fontWeight: 800 }}>{i + 1}</div>
              <h3 style={{ fontFamily: FONT_INTER, fontSize: 22, fontWeight: 800, color: "#ffffff", marginBottom: 12 }}>{b.title}</h3>
              <p style={{ fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, margin: 0, fontWeight: 400 }}>{b.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── RESULTS (SOCIAL PROOF) ───────── */
function Results() {
  const testimonials = [
    { quote: "Da quando abbiamo il sito con il sistema ordini, gli asporti sono aumentati del 40%. Il venerdì sera non perdiamo più neanche un ordine.", author: "Marco R.", place: "Pizzeria Bella Napoli" },
    { quote: "Il widget prenotazioni ci ha cambiato la vita. I clienti prenotano da soli, noi non dobbiamo più stare al telefono. Tutto organizzato.", author: "Laura B.", place: "Pizzeria Da Luigi" },
    { quote: "Eravamo invisibili su Google. Ora siamo il primo risultato per 'pizzeria' nella nostra zona. I nuovi clienti arrivano ogni giorno.", author: "Giuseppe M.", place: "Pizza & Fantasia" }
  ];
  return (
    <section id="risultati" className="section-padding" style={{ background: "#0C0C0C" }}>
      <div style={{ maxWidth: "min(1000px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>RISULTATI</div>
          <TextReveal text="Cosa Ottengono le Nostre Pizzerie" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#ffffff" }} />
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "20px auto 0" }} />
        </div>
        <div className="results-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28, alignItems: "stretch" }}>
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 80} style={{ display: "flex" }}>
              <div className="card-testimonial" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(239,68,68,0.2)", padding: "32px 28px", borderRadius: 12, transition: "transform 0.25s ease, border-color 0.25s ease", flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ fontFamily: FONT_INTER, fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.8, margin: "0 0 20px", fontWeight: 400, fontStyle: "italic", flex: 1 }}>"{t.quote}"</p>
                <div style={{ fontFamily: FONT_INTER, fontSize: 13, fontWeight: 600, color: ACCENT }}>{t.author}</div>
                <div style={{ fontFamily: FONT_INTER, fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{t.place}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── PORTFOLIO ───────── */
function Portfolio() {
  return (
    <section id="portfolio" className="section-padding" style={{ background: "#0C0C0C" }}>
      <div style={{ maxWidth: "min(800px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>PORTFOLIO</div>
        <TextReveal text="I Nostri Progetti" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#ffffff", marginBottom: 16 }} />
        <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto 24px" }} />
        <p style={{ fontFamily: FONT_INTER, fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 40, lineHeight: 1.8, fontWeight: 400 }}>Siti e sistemi realizzati per le nostre pizzerie. Esempi concreti di cosa possiamo fare per te.</p>
        <Link to="/portfolio" className="btn-outline" style={{ display: "inline-block", background: "transparent", color: ACCENT, border: `1px solid ${ACCENT}`, padding: "16px 44px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease", textDecoration: "none" }}>Vedi tutti i progetti</Link>
      </div>
    </section>
  );
}

/* ───────── SERVICES ───────── */
function Services() {
  const services = [
    { name: "Sito Web per Pizzerie", desc: "Sito professionale con il tuo menù, foto, orari, mappa e contatti. Ottimizzato per mobile (dove il 75% dei tuoi clienti ti cerca) e per Google (per farti trovare).", included: ["Menù interattivo", "Design personalizzato", "Mobile-first", "SEO locale", "Google Maps", "Bottone WhatsApp"] },
    { name: "Sistema Prenotazioni", desc: "Widget di prenotazione tavoli sul tuo sito + bot WhatsApp che gestisce le prenotazioni automaticamente. I clienti prenotano 24/7, tu ricevi tutto organizzato.", included: ["Widget prenotazione sul sito", "Bot WhatsApp", "Conferma automatica", "Promemoria clienti", "Dashboard prenotazioni"] },
    { name: "Ordini Online", desc: "Menù interattivo dove i clienti scelgono le pizze, personalizzano l'ordine e inviano tutto via WhatsApp. Asporto e delivery senza telefonate.", included: ["Menù digitale interattivo", "Carrello ordini", "Invio ordine WhatsApp", "Gestione asporto/delivery", "Nessuna commissione (è TUO, non di JustEat)"] }
  ];
  return (
    <section id="servizi" className="section-padding" style={{ background: "#0C0C0C" }}>
      <div style={{ maxWidth: "min(1200px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>SERVIZI</div>
          <TextReveal text="Cosa Offriamo" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#ffffff" }} />
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "20px auto 0" }} />
        </div>
        <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {services.map((s, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="card-servizi" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${ACCENT_RGBA(0.2)}`, padding: "40px 28px", borderRadius: 12, transition: "transform 0.25s ease, border-color 0.25s ease" }}>
                <div style={{ fontFamily: FONT_INTER, fontSize: 40, fontWeight: 800, color: ACCENT_RGBA(0.2), marginBottom: 20 }}>0{i + 1}</div>
                <h3 style={{ fontFamily: FONT_INTER, fontSize: 20, fontWeight: 800, color: "#ffffff", marginBottom: 12 }}>{s.name}</h3>
                <p style={{ fontFamily: FONT_INTER, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: "0 0 20px", fontWeight: 400 }}>{s.desc}</p>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 16 }}>
                  {s.included.map((item, j) => (
                    <div key={j} style={{ fontFamily: FONT_INTER, fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: ACCENT, fontSize: 8 }}>◆</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── PROCESS ───────── */
function Process() {
  const steps = [
    { title: "Analisi Gratuita", desc: "Guardiamo la tua situazione online: hai un sito? Come ti trovano i clienti? Cosa fanno i tuoi concorrenti? Ti mostriamo tutto in 15 minuti. Gratis." },
    { title: "Creiamo il Tuo Sistema", desc: "Costruiamo il sito, il sistema prenotazioni e gli ordini online. Tu ci dai il menù e le foto, noi facciamo tutto il resto in 7 giorni." },
    { title: "I Clienti Arrivano", desc: "Il sito va online, i clienti ti trovano su Google, prenotano e ordinano. Tu ti concentri sulla pizza, il sistema lavora per te." }
  ];
  return (
    <section id="processo" className="section-padding" style={{ background: "#0C0C0C" }}>
      <div style={{ maxWidth: "min(1000px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>COME FUNZIONA</div>
          <TextReveal text="3 Step per Riempire la Tua Pizzeria" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#ffffff" }} />
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "20px auto 0" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {steps.map((s, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="process-step" style={{ display: "flex", gap: 40, alignItems: "flex-start", padding: "40px 0", borderBottom: i < 2 ? "1px solid rgba(239,68,68,0.15)" : "none" }}>
              <div className="process-step-num" style={{ fontFamily: FONT_INTER, fontSize: 52, fontWeight: 800, color: ACCENT_RGBA(0.2), lineHeight: 1, minWidth: 60, textAlign: "center" }}>{i + 1}</div>
              <div>
                <h3 style={{ fontFamily: FONT_INTER, fontSize: 24, fontWeight: 800, color: "#ffffff", margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, margin: 0, fontWeight: 400 }}>{s.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── PRICING ───────── */
function Pricing() {
  const baseFeatures = [
    "Sito one-page professionale",
    "Menù completo con prezzi",
    "Foto e descrizione pizze",
    "Mobile-first responsive",
    "SEO locale (Google My Business)",
    "Mappa + orari + contatti",
    "Bottone WhatsApp / Chiama",
    "Deploy e messa online",
    "15 giorni di supporto"
  ];
  const proFeatures = [
    "Tutto quello del Base, più:",
    "Sito multi-pagina completo",
    "Widget prenotazione tavoli integrato",
    "Bot WhatsApp prenotazioni 24/7",
    "Conferma e promemoria automatici",
    "Gallery foto professionale",
    "Sezione recensioni Google",
    "Integrazione Google Analytics",
    "30 giorni di supporto",
    "Manutenzione mensile inclusa"
  ];
  const premiumFeatures = [
    "Tutto quello del Pro, più:",
    "Sistema ordini asporto/delivery",
    "Menù interattivo con carrello",
    "Ordini via WhatsApp automatizzati",
    "Gestione delivery zone",
    "Nessuna commissione (tuo al 100%)",
    "Design premium personalizzato",
    "Report mensile performance",
    "Supporto prioritario WhatsApp",
    "Manutenzione + aggiornamenti inclusi"
  ];
  const textMuted = "rgba(255,255,255,0.5)";
  const textMutedLight = "rgba(255,255,255,0.45)";
  const borderCard = "1px solid rgba(239,68,68,0.2)";
  return (
    <section id="pricing" className="section-padding pricing-section-dark" style={{ background: "#0C0C0C" }}>
      <div style={{ maxWidth: "min(1200px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>INVESTIMENTO</div>
        <TextReveal text="Scegli il Piano Giusto per Te" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#ffffff", marginBottom: 16 }} />
        <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto 16px" }} />
        
        <div className="pricing-cards-wrapper" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignItems: "stretch", marginBottom: 36 }}>
          {/* CARD 1 - Base */}
          <ScrollReveal delay={0}>
            <div className="card-pricing-starter" style={{ position: "relative", background: "rgba(255,255,255,0.03)", border: borderCard, padding: "44px 32px", borderRadius: 12, display: "flex", flexDirection: "column", transition: "transform 0.25s ease, border-color 0.25s ease" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 4, marginBottom: 8 }}>Base</div>
              <div style={{ fontFamily: FONT_INTER, fontSize: 12, color: textMuted, marginBottom: 24, fontWeight: 400 }}>Vai online e fatti trovare</div>
              <div className="card-pricing-price" style={{ fontFamily: FONT_INTER, fontSize: 48, fontWeight: 300, color: "#ffffff", marginBottom: 32, lineHeight: 1 }}>
                €297<span style={{ fontSize: 14, color: textMutedLight, fontWeight: 300, marginLeft: 4 }}>/una tantum</span>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {baseFeatures.map((f, i) => (
                  <div key={i} style={{ fontFamily: FONT_INTER, fontSize: 13, color: textMuted, padding: "12px 0", borderBottom: i < baseFeatures.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 14, fontWeight: 300 }}>
                    <span style={{ color: ACCENT, fontSize: 10, flexShrink: 0, marginTop: 2 }}>◆</span> <span>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")} className="btn-pricing-outline" style={{ marginTop: 32, width: "100%", background: "transparent", color: ACCENT, border: "1px solid rgba(239,68,68,0.4)", padding: "17px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "all 0.3s ease", borderRadius: 8 }}>Parti con il Sito</button>
              <div style={{ fontFamily: FONT_INTER, fontSize: 11, color: textMutedLight, marginTop: 12, fontWeight: 400 }}>Perfetto per chi non ha ancora un sito</div>
            </div>
          </ScrollReveal>
          
          {/* CARD 2 - Pro (HIGHLIGHT) */}
          <ScrollReveal delay={100}>
            <div className="card-pricing-rifacimento" style={{ position: "relative", background: "rgba(239,68,68,0.05)", border: "1.5px solid #EF4444", padding: "44px 32px", borderRadius: 12, display: "flex", flexDirection: "column", transition: "transform 0.25s ease, box-shadow 0.25s ease", boxShadow: "0 0 40px rgba(239,68,68,0.12)", overflow: "visible" }}>
              <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: ACCENT, color: "#0C0C0C", fontFamily: FONT_INTER, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, padding: "6px 16px", borderRadius: 6 }}>Più Scelto</div>
              <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 4, marginBottom: 8, marginTop: 8 }}>Pro</div>
              <div style={{ fontFamily: FONT_INTER, fontSize: 12, color: textMuted, marginBottom: 24, fontWeight: 400 }}>Sito + Prenotazioni automatiche</div>
              <div className="card-pricing-price" style={{ fontFamily: FONT_INTER, fontSize: 48, fontWeight: 300, color: "#ffffff", marginBottom: 32, lineHeight: 1 }}>
                €597<span style={{ fontSize: 14, color: textMutedLight, fontWeight: 300, marginLeft: 4 }}>/una tantum</span>
              </div>
              <div style={{ fontFamily: FONT_INTER, fontSize: 13, color: textMuted, marginBottom: 16 }}>+ €47/mese</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {proFeatures.map((f, i) => (
                  <div key={i} style={{ fontFamily: FONT_INTER, fontSize: 13, color: i === 0 ? ACCENT : textMuted, padding: "12px 0", borderBottom: i < proFeatures.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 14, fontWeight: i === 0 ? 500 : 300, marginBottom: i === 0 ? 8 : 0 }}>
                    {i > 0 && <span style={{ color: ACCENT, fontSize: 10, flexShrink: 0, marginTop: 2 }}>◆</span>} <span>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")} className="btn-pricing-filled" style={{ marginTop: 32, width: "100%", background: ACCENT, color: "#0C0C0C", border: "none", padding: "17px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "all 0.3s ease", borderRadius: 8 }}>Scegli Pro</button>
              <div style={{ fontFamily: FONT_INTER, fontSize: 11, color: textMutedLight, marginTop: 12, fontWeight: 400 }}>Per chi vuole riempire i tavoli senza il telefono</div>
            </div>
          </ScrollReveal>
          
          {/* CARD 3 - Premium */}
          <ScrollReveal delay={200}>
            <div className="card-pricing-premium" style={{ position: "relative", background: "rgba(255,255,255,0.03)", border: borderCard, padding: "44px 32px", borderRadius: 12, display: "flex", flexDirection: "column", transition: "transform 0.25s ease, border-color 0.25s ease" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 4, marginBottom: 8 }}>Premium</div>
              <div style={{ fontFamily: FONT_INTER, fontSize: 12, color: textMuted, marginBottom: 24, fontWeight: 400 }}>Il sistema completo per la tua pizzeria</div>
              <div className="card-pricing-price" style={{ fontFamily: FONT_INTER, fontSize: 48, fontWeight: 300, color: "#ffffff", marginBottom: 32, lineHeight: 1 }}>
                €997<span style={{ fontSize: 14, color: textMutedLight, fontWeight: 300, marginLeft: 4 }}>/una tantum</span>
              </div>
              <div style={{ fontFamily: FONT_INTER, fontSize: 13, color: textMuted, marginBottom: 16 }}>+ €97/mese</div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {premiumFeatures.map((f, i) => (
                  <div key={i} style={{ fontFamily: FONT_INTER, fontSize: 13, color: i === 0 ? ACCENT : textMuted, padding: "12px 0", borderBottom: i < premiumFeatures.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 14, fontWeight: i === 0 ? 500 : 300, marginBottom: i === 0 ? 8 : 0 }}>
                    {i > 0 && <span style={{ color: ACCENT, fontSize: 10, flexShrink: 0, marginTop: 2 }}>◆</span>} <span>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")} className="btn-pricing-outline" style={{ marginTop: 32, width: "100%", background: "transparent", color: ACCENT, border: "1px solid rgba(239,68,68,0.4)", padding: "17px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "all 0.3s ease", borderRadius: 8 }}>Vai Premium</button>
              <div style={{ fontFamily: FONT_INTER, fontSize: 11, color: textMutedLight, marginTop: 12, fontWeight: 400 }}>Per chi vuole il sistema completo senza commissioni</div>
            </div>
          </ScrollReveal>
        </div>
        
        <div style={{ fontFamily: FONT_INTER, fontSize: 12, color: textMutedLight, marginTop: 24, fontWeight: 400 }}>Tutti i piani includono analisi gratuita · Pagamento rateizzabile · Nessun vincolo</div>
        <div style={{ fontFamily: FONT_INTER, fontSize: 13, color: ACCENT, fontWeight: 600, marginTop: 16, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>Confronta: JustEat e Deliveroo prendono il 15-30% su ogni ordine. Il nostro sistema è TUO, zero commissioni.</div>
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "Quanto tempo ci vuole?", a: "Il sito Base è pronto in 5 giorni. Il Pro con prenotazioni in 7-10 giorni. Il Premium completo in 2 settimane. Tempi garantiti." },
    { q: "Devo fornire le foto?", a: "Se le hai, perfetto. Se non le hai, ti guidiamo su come fare foto perfette delle tue pizze con il telefono. Bastano 30 minuti." },
    { q: "Quanto costa il bot WhatsApp al mese?", a: "Il bot è incluso nel piano Pro (€47/mese) e Premium (€97/mese). Incluso manutenzione, aggiornamenti e supporto." },
    { q: "Posso iniziare col Base e aggiungere dopo?", a: "Assolutamente sì. Il sistema è modulare. Parti col sito, poi aggiungi prenotazioni e ordini quando vuoi. Upgrade facile." },
    { q: "E se non funziona?", a: "Se in 30 giorni non sei soddisfatto, ti rimborsiamo. Ma non è mai successo." },
    { q: "È meglio di JustEat/Deliveroo?", a: "Sono cose diverse. JustEat ti porta visibilità ma prende il 15-30% su ogni ordine. Il nostro sistema è TUO — zero commissioni, i clienti restano tuoi." }
  ];
  return (
    <section id="faq" className="section-padding" style={{ background: "#0C0C0C" }}>
      <div style={{ maxWidth: "min(900px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>FAQ</div>
          <TextReveal text="Domande Frequenti" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#ffffff" }} />
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "20px auto 0" }} />
        </div>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid rgba(239,68,68,0.15)" }}>
            <button onClick={() => setOpen(open === i ? null : i)} className="btn-faq btn-tap" style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", textAlign: "left", transition: "transform 0.2s ease" }}>
              <span className="faq-question" style={{ fontFamily: FONT_INTER, fontSize: 19, fontWeight: 600, color: "#ffffff" }}>{f.q}</span>
              <span style={{ fontSize: 16, color: ACCENT, transition: "transform .3s", transform: open === i ? "rotate(45deg)" : "none", flexShrink: 0, marginLeft: 20, fontFamily: FONT_INTER, fontWeight: 400 }}>+</span>
            </button>
            {open === i && <div style={{ padding: "0 0 24px", fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.85, fontWeight: 400 }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── FOOTER CTA ───────── */
function FooterCTA() {
  return (
    <section id="contatti" className="section-padding-footer" style={{ background: "#0C0C0C", textAlign: "center", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 1, height: 80, background: `linear-gradient(to bottom, ${ACCENT_RGBA(0.3)}, transparent)` }} />
      <div style={{ maxWidth: "min(900px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 24 }}>CONTATTI</div>
        <h2 style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#ffffff", marginBottom: 20 }}>Pronto a Riempire la Tua Pizzeria?</h2>
        <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto 28px" }} />
        <p style={{ fontFamily: FONT_INTER, fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 44, lineHeight: 1.9, fontWeight: 400 }}>Prenota un'analisi gratuita di 15 minuti. Ti mostriamo esattamente come i tuoi clienti ti cercano online e cosa puoi fare per non perderli.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary cta-footer-btn" style={{ display: "inline-block", background: ACCENT, color: "#0C0C0C", border: "none", padding: "18px 52px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease", maxWidth: 360, margin: "0 auto", textDecoration: "none" }}>Analisi Gratuita della Tua Pizzeria</a>
        <div className="footer-contacts-wrap" style={{ marginTop: 64, display: "flex", gap: 56, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Telefono", "+39 366 440 0722"], ["Email", "info@ecfmedia.it"], ["Zona", "Italia"]].map(([label, text]) => (
            <div key={text} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 9, fontWeight: 600, color: ACCENT_RGBA(0.5), textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>{label}</div>
              <div style={{ fontFamily: FONT_INTER, fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 400 }}>
                {label === "Telefono" ? <a href="tel:+393664400722" style={{ color: "inherit", textDecoration: "none" }}>{text}</a> : text}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 64, paddingTop: 28, borderTop: "1px solid rgba(239,68,68,0.15)", fontFamily: FONT_INTER, fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>© 2026 ECF Media · Tutti i diritti riservati</div>
      </div>
    </section>
  );
}

/* ───────── MAIN ───────── */
export default function PremiumTemplate() {
  return (
    <div style={{ margin: 0, padding: 0, background: "#0C0C0C" }} className="ecf-media-site">
      <NoiseOverlay />
      <style>{`
        .ecf-media-site { max-width: 1440px; margin-left: auto; margin-right: auto; width: 100%; overflow-x: hidden; }
        @media (max-width: 768px) {
          .ecf-media-site { max-width: 100%; }
          .ecf-media-site .hero-section { display: flex !important; justify-content: center !important; align-items: center !important; }
          .ecf-media-site .hero-section > div:last-of-type { margin-left: auto !important; margin-right: auto !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; }
        }
        .ecf-media-site section[id] { scroll-margin-top: ${SCROLL_OFFSET}px; }
        html { scroll-behavior: smooth; }
        .ecf-media-site section.section-padding { padding: 110px 36px; }
        .ecf-media-site section.section-padding-tight { padding: 72px 36px; }
        .ecf-media-site section.section-padding-footer { padding: 120px 36px; }
        @media (max-width: 768px) {
          .ecf-media-site section.section-padding { padding: 72px 24px !important; }
          .ecf-media-site section.section-padding-tight { padding: 56px 24px !important; }
          .ecf-media-site section.section-padding-footer { padding: 80px 24px !important; }
        }
        @media (max-width: 480px) {
          .ecf-media-site section.section-padding { padding: 56px 16px !important; }
          .ecf-media-site section.section-padding-tight { padding: 48px 16px !important; }
          .ecf-media-site section.section-padding-footer { padding: 72px 16px !important; }
        }
        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ecf-media-site .hero-word {
          opacity: 0;
          display: inline-block;
          animation: heroReveal 0.5s ease forwards;
        }
        .ecf-media-site .hero-subtitle,
        .ecf-media-site .cta-hero-wrap {
          opacity: 0;
          animation: heroReveal 0.5s ease 1260ms forwards;
        }
        /* Hero gradient mesh */
        .ecf-media-site .hero-mesh {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 0;
        }
        .ecf-media-site .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          mix-blend-mode: soft-light;
          will-change: transform;
          width: 320px;
          height: 320px;
        }
        .ecf-media-site .hero-blob-1 {
          top: 10%; left: 15%;
          animation: heroBlob1 18s ease-in-out infinite;
        }
        .ecf-media-site .hero-blob-2 {
          bottom: 5%; right: 10%;
          animation: heroBlob2 20s ease-in-out infinite;
        }
        .ecf-media-site .hero-blob-3 {
          top: 40%; right: 25%;
          animation: heroBlob3 16s ease-in-out infinite;
        }
        .ecf-media-site .hero-blob-4 {
          bottom: 30%; left: 20%;
          animation: heroBlob4 17s ease-in-out infinite;
        }
        @keyframes heroBlob1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, 30px) scale(1.05); }
          66% { transform: translate(-20px, 50px) scale(0.95); }
        }
        @keyframes heroBlob2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, -40px) scale(0.98); }
          66% { transform: translate(-30px, 20px) scale(1.08); }
        }
        @keyframes heroBlob3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -35px) scale(1.02); }
        }
        @keyframes heroBlob4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -25px) scale(1.06); }
        }
        .ecf-media-site .hero-section { padding: 100px 36px 60px; width: 100%; box-sizing: border-box; }
        .ecf-media-site .hero-content-inner { margin-left: auto !important; margin-right: auto !important; display: block !important; }
        @media (max-width: 768px) {
          .ecf-media-site .hero-section { padding: 80px 24px 48px; overflow-x: hidden; }
          .ecf-media-site .hero-blob-mobile-hide { display: none; }
          .ecf-media-site .hero-blob { filter: blur(120px); }
        }
        @media (max-width: 480px) {
          .ecf-media-site .hero-section { padding: 72px 16px 40px; }
          .ecf-media-site .hero-line-mobile-hide { display: none; }
        }
        @media (max-width: 640px) {
          .ecf-media-site .hero-stats-wrap { gap: 24px !important; flex-wrap: nowrap !important; }
        }
        @media (max-width: 480px) {
          .ecf-media-site .hero-stats-wrap { gap: 16px !important; flex-wrap: nowrap !important; }
          .ecf-media-site .hero-stats-wrap > div { min-width: 0; flex: 1; }
        }
        @media (max-width: 640px) {
          .ecf-media-site .process-step { flex-direction: column !important; align-items: flex-start !important; gap: 12 !important; }
          .ecf-media-site .process-step-num { font-size: 40px !important; min-width: unset !important; }
        }
        .pricing-section-dark { overflow: visible; }
        .pricing-cards-wrapper { overflow: visible; }
        @media (max-width: 900px) {
          .pricing-cards-wrapper { grid-template-columns: repeat(3, 1fr) !important; gap: 20px !important; }
        }
        @media (max-width: 768px) {
          .pricing-cards-wrapper { grid-template-columns: 1fr !important; gap: 20px !important; }
          .ecf-media-site .card-pricing-starter,
          .ecf-media-site .card-pricing-rifacimento,
          .ecf-media-site .card-pricing-premium { padding: 36px 24px !important; }
          .ecf-media-site .card-pricing-price { font-size: 40px !important; }
        }
        @media (max-width: 480px) {
          .ecf-media-site .card-pricing-starter,
          .ecf-media-site .card-pricing-rifacimento,
          .ecf-media-site .card-pricing-premium { padding: 32px 20px !important; }
        }
        @media (max-width: 480px) {
          .ecf-media-site .faq-question { font-size: 16px !important; }
          .ecf-media-site .btn-faq { min-height: 44px; padding: 20px 0 !important; }
        }
        @media (max-width: 768px) {
          .ecf-media-site .services-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .ecf-media-site .footer-contacts-wrap { gap: 28 !important; }
        }
        .ecf-media-site .hero-mesh-parallax { transition: none; will-change: transform; }
        /* Scroll Reveal */
        @keyframes scrollRevealIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ecf-media-site .scroll-reveal { opacity: 0; }
        .ecf-media-site .scroll-reveal-visible { animation: scrollRevealIn 0.6s ease forwards; }
        /* Text Reveal */
        .ecf-media-site .text-reveal-word { display: inline-block; opacity: 0; transform: translateY(12px); }
        .ecf-media-site .text-reveal-visible .text-reveal-word { animation: scrollRevealIn 0.5s ease forwards; }
        .ecf-media-site .text-reveal-accent-last .text-reveal-word:last-child { font-style: italic; color: #EF4444; }
        .ecf-media-site .btn-primary,
        .ecf-media-site .btn-outline,
        .ecf-media-site .btn-nav,
        .ecf-media-site .btn-nav-mobile,
        .ecf-media-site .btn-faq,
        .ecf-media-site .btn-tap { -webkit-tap-highlight-color: transparent; }
        .ecf-media-site .btn-primary:active,
        .ecf-media-site .btn-outline:active,
        .ecf-media-site .btn-nav:active,
        .ecf-media-site .btn-nav-mobile:active,
        .ecf-media-site .btn-faq:active,
        .ecf-media-site .btn-tap:active { transform: scale(0.98); }
        @media (hover: hover) {
          .ecf-media-site .btn-primary:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 20px rgba(239,68,68,0.35);
            background-color: #DC2626 !important;
          }
          .ecf-media-site .btn-primary:hover:active { transform: scale(0.98); }
          .ecf-media-site .btn-outline:hover,
          .ecf-media-site .btn-hero-cta-primary:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            background-color: rgba(239,68,68,0.08) !important;
          }
          .ecf-media-site .btn-hero-cta-secondary:hover {
            transform: scale(1.02);
            border-color: rgba(255,255,255,0.25) !important;
            background-color: rgba(255,255,255,0.05) !important;
          }
          .ecf-media-site .btn-outline:hover:active,
          .ecf-media-site .btn-hero-cta-primary:hover:active,
          .ecf-media-site .btn-hero-cta-secondary:hover:active { transform: scale(0.98); }
          .ecf-media-site .btn-nav:hover {
            transform: scale(1.02);
            color: #EF4444 !important;
          }
          .ecf-media-site .btn-nav-cta:hover {
            transform: scale(1.02);
            background-color: #DC2626 !important;
            color: #ffffff !important;
          }
          .ecf-media-site .btn-nav-mobile-cta:hover {
            background-color: #DC2626 !important;
            color: #ffffff !important;
          }
          .ecf-media-site .btn-nav:hover:active,
          .ecf-media-site .btn-nav-cta:hover:active { transform: scale(0.98); }
          .ecf-media-site .card-problema:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.06);
            border-color: rgba(239,68,68,0.2) !important;
          }
          .ecf-media-site .card-soluzione:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            border-color: rgba(239,68,68,0.4) !important;
          }
          .ecf-media-site .card-servizi:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
            border-color: rgba(239,68,68,0.35) !important;
          }
          .ecf-media-site .card-pricing-starter:hover,
          .ecf-media-site .card-pricing-premium:hover {
            transform: translateY(-4px);
            border-color: rgba(239,68,68,0.3) !important;
          }
          .ecf-media-site .card-pricing-rifacimento:hover {
            transform: translateY(-4px);
            box-shadow: 0 0 50px rgba(239,68,68,0.12) !important;
          }
          .ecf-media-site .btn-pricing-outline:hover {
            border-color: #EF4444 !important;
            color: #EF4444 !important;
          }
          .ecf-media-site .btn-pricing-filled:hover {
            background-color: #DC2626 !important;
            transform: scale(1.02);
          }
          .ecf-media-site .btn-pricing-outline:hover:active,
          .ecf-media-site .btn-pricing-filled:hover:active { transform: scale(0.98); }
        }
        @media (max-width: 640px) {
          .ecf-media-site .cta-hero-wrap { flex-direction: column !important; width: 100% !important; }
          .ecf-media-site .cta-hero-wrap button { width: 100% !important; min-width: unset !important; }
          .ecf-media-site .cta-footer-btn { width: 100% !important; max-width: 100% !important; }
        }
      `}</style>
      <Navbar />
      <Hero />
      <BlueLine />
      <Problem />
      <BlueLine />
      <Solution />
      <BlueLine />
      <Portfolio />
      <BlueLine />
      <Results />
      <BlueLine />
      <Services />
      <BlueLine />
      <Process />
      <BlueLine />
      <Pricing />
      <BlueLine />
      <FAQ />
      <BlueLine />
      <FooterCTA />
    </div>
  );
}
