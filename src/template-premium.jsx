import { useState, useEffect, useRef } from "react";

const SECTIONS = ["home", "problema", "soluzione", "risultati", "loghi", "servizi", "processo", "pricing", "team", "faq", "contatti"];
const NAV_LABELS = { home: "Home", problema: "Problema", soluzione: "Soluzione", risultati: "Risultati", loghi: "Clienti", servizi: "Servizi", processo: "Come Funziona", pricing: "Prezzi", team: "Team", faq: "FAQ", contatti: "Contatti" };

const FONT_INTER = "'Inter', sans-serif";
const ACCENT = "#0EA5E9";
const ACCENT_RGBA = (o) => `rgba(14,165,233,${o})`;
const SCROLL_OFFSET = 80;

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
  const words = text.split(/\s+/);
  return (
    <Tag ref={ref} className={`text-reveal ${visible ? "text-reveal-visible" : ""} ${className}`.trim()} style={style}>
      {words.map((w, i) => (
        <span key={i} className="text-reveal-word" style={{ animationDelay: visible ? `${i * 60}ms` : undefined }}>{w} </span>
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
      <span style={{ fontFamily: FONT_INTER, fontWeight: 800, color: "#111", fontSize: 18 }}>ECF</span>
      <span style={{ fontFamily: FONT_INTER, fontWeight: 400, color: "rgba(0,0,0,0.5)", fontSize: 18 }}>media</span>
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
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(14,165,233,0.2)", padding: "0 36px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <ECFLogo />
      <div style={{ display: "flex", gap: 6, alignItems: "center" }} className="desktop-nav-p">
        {SECTIONS.map(id => (
          <button key={id} onClick={() => scrollTo(id)} className="btn-nav" style={{ background: "transparent", border: "none", cursor: "pointer", padding: "8px 13px", fontFamily: FONT_INTER, fontSize: 11, fontWeight: active === id ? 600 : 400, color: active === id ? ACCENT : "rgba(0,0,0,0.5)", transition: "transform 0.2s ease, color 0.2s ease", textTransform: "uppercase", letterSpacing: 1.5 }}>{NAV_LABELS[id]}</button>
        ))}
      </div>
      <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger-p btn-tap" style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 6, padding: 8, zIndex: 1001, transition: "transform 0.2s ease" }}>
        <span style={{ width: 26, height: 1.5, background: ACCENT, transition: "all .3s", transform: menuOpen ? "rotate(45deg) translate(6px, 6px)" : "none" }} />
        <span style={{ width: 26, height: 1.5, background: ACCENT, transition: "all .3s", opacity: menuOpen ? 0 : 1 }} />
        <span style={{ width: 26, height: 1.5, background: ACCENT, transition: "all .3s", transform: menuOpen ? "rotate(-45deg) translate(6px, -6px)" : "none" }} />
      </button>
      {menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, width: "100%", minHeight: "100vh", zIndex: 9999, backgroundColor: "#ffffff", background: "#ffffff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <ECFLogo />
          </div>
          {SECTIONS.map(id => (
            <button key={id} onClick={() => scrollTo(id)} className="btn-nav-mobile btn-tap" style={{ background: "transparent", border: "none", cursor: "pointer", padding: "18px 32px", fontFamily: FONT_INTER, fontSize: 26, fontWeight: active === id ? 600 : 400, color: active === id ? ACCENT : "rgba(0,0,0,0.5)", width: "80%", textAlign: "center", letterSpacing: 1, transition: "transform 0.2s ease" }}>{NAV_LABELS[id]}</button>
          ))}
        </div>
      )}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        .hamburger-p { display: none !important; }
        @media (max-width: 900px) { .desktop-nav-p { display: none !important; } .hamburger-p { display: flex !important; } }
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
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff", padding: "100px 36px 60px", position: "relative", overflow: "hidden" }}>
      <div ref={meshRef} className="hero-mesh hero-mesh-parallax" aria-hidden="true">
        <div className="hero-blob hero-blob-1" style={{ background: "rgba(14,165,233,0.12)" }} />
        <div className="hero-blob hero-blob-2" style={{ background: "rgba(56,189,248,0.1)" }} />
        <div className="hero-blob hero-blob-3 hero-blob-mobile-hide" style={{ background: "rgba(125,211,252,0.1)" }} />
        <div className="hero-blob hero-blob-4 hero-blob-mobile-hide" style={{ background: "rgba(186,230,253,0.12)" }} />
      </div>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT_RGBA(0.04)} 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 120, right: "10%", width: 1, height: 120, background: `linear-gradient(to bottom, transparent, ${ACCENT_RGBA(0.2)}, transparent)` }} />
      <div style={{ position: "absolute", bottom: 120, left: "10%", width: 1, height: 120, background: `linear-gradient(to bottom, transparent, ${ACCENT_RGBA(0.2)}, transparent)` }} />

      <div style={{ maxWidth: "min(1100px, 92vw)", width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_INTER, fontSize: 11, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 32 }}>WEB AGENCY — ITALIA</div>
        <h1 style={{ fontFamily: FONT_INTER, fontSize: "clamp(38px, 6vw, 72px)", fontWeight: 800, color: "#111", lineHeight: 1.1, margin: "0 0 28px", letterSpacing: -0.5 }}>
          {["Il", "Tuo", "Sito", "Non", "Converte?"].map((word, i) => (
            <span key={i} className="hero-word" style={{ animationDelay: `${300 + i * 80}ms` }}>{word} </span>
          ))}
          <br />
          <span style={{ color: ACCENT, fontStyle: "italic" }}>
            {["Noi", "Lo", "Sistemiamo."].map((word, i) => (
              <span key={i} className="hero-word" style={{ animationDelay: `${300 + (5 + i) * 80}ms` }}>{word} </span>
            ))}
          </span>
        </h1>
        <p className="hero-subtitle" style={{ fontFamily: FONT_INTER, fontSize: "clamp(14px, 2vw, 16px)", color: "rgba(0,0,0,0.5)", maxWidth: 480, margin: "0 auto 44px", lineHeight: 1.9, fontWeight: 400, letterSpacing: 0.3 }}>Creiamo siti web che trasformano visitatori in clienti. Design premium, performance reali, risultati misurabili.</p>
        <div className="cta-hero-wrap" style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => scrollToSection("contatti")} className="btn-primary" style={{ background: ACCENT, color: "#ffffff", border: "none", padding: "16px 44px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease", minWidth: 200 }}>Prenota Consulenza Gratuita</button>
          <button onClick={() => scrollToSection("risultati")} className="btn-outline" style={{ background: "transparent", color: ACCENT, border: `1px solid ${ACCENT}`, padding: "16px 44px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease", minWidth: 200 }}>Vedi Portfolio</button>
        </div>
        <div style={{ width: 1, height: 60, background: `linear-gradient(to bottom, transparent, ${ACCENT_RGBA(0.3)})`, margin: "56px auto 0" }} />
        <div style={{ display: "flex", gap: 56, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
          {[["50+", "Progetti"], ["4.9", "Rating"], ["100%", "Soddisfazione"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <CountUp value={num} duration={2000} style={{ fontFamily: FONT_INTER, fontSize: 32, fontWeight: 800, color: ACCENT }} />
              <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: 4, marginTop: 4 }}>{label}</div>
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
    { title: "Sito Non Ottimizzato", desc: "Il 70% dei tuoi clienti ti cerca dal telefono. Se il tuo sito non è perfetto su mobile, li stai mandando alla concorrenza." },
    { title: "Zero Conversioni", desc: "Hai visite ma nessuno ti contatta? Il problema non è il traffico — è il sito che non guida il visitatore verso l'azione." },
    { title: "Immagine Non Professionale", desc: "Il tuo sito è il tuo biglietto da visita online. Se sembra datato o amatoriale, i clienti scelgono chi appare più affidabile." }
  ];
  return (
    <section id="problema" style={{ padding: "110px 36px", background: "#ffffff" }}>
      <div style={{ maxWidth: "min(1200px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>IL PROBLEMA</div>
          <TextReveal text="Il Tuo Sito Ti Sta Costando Clienti" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#111", marginBottom: 16 }} />
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 36 }}>
          {problems.map((p, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="card-problema" style={{ textAlign: "center", padding: "24px 16px", border: "1px solid transparent", transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 56, fontWeight: 800, color: ACCENT_RGBA(0.2), lineHeight: 1, marginBottom: 16 }}>{i + 1}</div>
              <h3 style={{ fontFamily: FONT_INTER, fontSize: 22, fontWeight: 800, color: "#111", marginBottom: 12 }}>{p.title}</h3>
              <p style={{ fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(0,0,0,0.55)", lineHeight: 1.85, margin: 0, fontWeight: 400 }}>{p.desc}</p>
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
    { title: "Design che Converte", desc: "Ogni elemento del sito è progettato con un obiettivo: trasformare il visitatore in cliente. Niente fronzoli, solo risultati." },
    { title: "Su Misura per Te", desc: "Nessun template. Ogni sito è costruito da zero sulle esigenze specifiche del tuo business e dei tuoi clienti." },
    { title: "Performance Reali", desc: "Siti veloci, ottimizzati per mobile e SEO. Perché un sito bello che nessuno trova non serve a niente." }
  ];
  return (
    <section id="soluzione" style={{ padding: "110px 36px", background: "#fafafa" }}>
      <div style={{ maxWidth: "min(1200px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>LA SOLUZIONE</div>
          <TextReveal text="Il Nostro Approccio" className="text-reveal-accent-last" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#111", marginBottom: 16 }} />
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
          {benefits.map((b, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="card-soluzione" style={{ background: "#ffffff", border: `1px solid ${ACCENT_RGBA(0.25)}`, padding: "44px 32px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease" }}>
              <div style={{ width: 48, height: 48, border: `1px solid ${ACCENT_RGBA(0.3)}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontFamily: FONT_INTER, fontSize: 20, color: ACCENT, fontWeight: 800 }}>{i + 1}</div>
              <h3 style={{ fontFamily: FONT_INTER, fontSize: 22, fontWeight: 800, color: "#111", marginBottom: 12 }}>{b.title}</h3>
              <p style={{ fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(0,0,0,0.55)", lineHeight: 1.85, margin: 0, fontWeight: 400 }}>{b.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SOCIAL PROOF ───────── */
function SocialProof() {
  const testimonials = [
    { name: "Marco R.", role: "Imprenditore", text: "Da quando abbiamo il nuovo sito, le richieste di preventivo sono triplicate nel primo mese." },
    { name: "Laura B.", role: "Titolare Ristorante", text: "Finalmente un sito che rappresenta la qualità del nostro lavoro. I clienti ci dicono sempre che ci hanno scelto per come ci presentiamo online." },
    { name: "Giuseppe M.", role: "Artigiano", text: "In 3 mesi il sito ha generato più contatti di 2 anni di passaparola. Un investimento che si è ripagato in poche settimane." }
  ];
  return (
    <section id="risultati" style={{ padding: "110px 36px", background: "#ffffff" }}>
      <div style={{ maxWidth: "min(1200px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>RISULTATI</div>
          <TextReveal text="Cosa Ottengono i Nostri Clienti" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#111" }} />
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "20px auto 0" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className="card-testimonial" style={{ padding: "40px 28px", borderLeft: `2px solid ${ACCENT}`, transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 48, color: ACCENT_RGBA(0.3), lineHeight: 1, marginBottom: 16 }}>"</div>
              <p style={{ fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(0,0,0,0.6)", lineHeight: 1.9, margin: "0 0 28px", fontWeight: 400, fontStyle: "italic" }}>{t.text}</p>
              <div style={{ width: 24, height: 1, background: ACCENT, marginBottom: 16 }} />
              <div style={{ fontFamily: FONT_INTER, fontWeight: 600, fontSize: 12, color: "#111", letterSpacing: 1, textTransform: "uppercase" }}>{t.name}</div>
              <div style={{ fontFamily: FONT_INTER, fontSize: 11, color: "rgba(0,0,0,0.45)", marginTop: 4, letterSpacing: 0.5 }}>{t.role}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── LOGHI (Clienti) ───────── */
function Loghi() {
  const clients = [
    { name: "Client A", placeholder: "A" },
    { name: "Client B", placeholder: "B" },
    { name: "Client C", placeholder: "C" },
    { name: "Client D", placeholder: "D" },
    { name: "Client E", placeholder: "E" },
  ];
  return (
    <section id="loghi" style={{ padding: "72px 36px", background: "#fafafa" }}>
      <div style={{ maxWidth: "min(1000px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 16 }}>CHI SI FIDA DI NOI</div>
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto" }} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: 48 }}>
          {clients.map((c, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <div className="logo-item" style={{ width: 100, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_INTER, fontSize: 24, fontWeight: 800, color: "rgba(0,0,0,0.25)", transition: "color 0.25s ease, transform 0.25s ease" }} title={c.name}>
                {c.placeholder}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── SERVICES ───────── */
function Services() {
  const services = [
    { name: "Siti Web", desc: "Landing page e siti multi-pagina ottimizzati per convertire. Da zero o rifacimento del sito esistente." },
    { name: "Ottimizzazione", desc: "Audit completo del tuo sito attuale con fix specifici per migliorare conversioni e performance." },
    { name: "SEO & Velocità", desc: "Ottimizzazione tecnica per farti trovare su Google e caricare in meno di 3 secondi." },
    { name: "Manutenzione", desc: "Aggiornamenti, modifiche e supporto continuo. Il tuo sito resta sempre al massimo." },
  ];
  return (
    <section id="servizi" style={{ padding: "110px 36px", background: "#fafafa" }}>
      <div style={{ maxWidth: "min(1200px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>SERVIZI</div>
          <TextReveal text="Cosa Facciamo" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#111" }} />
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "20px auto 0" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {services.map((s, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <div className="card-servizi" style={{ border: `1px solid ${ACCENT_RGBA(0.2)}`, padding: "40px 28px", textAlign: "center", transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease", background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 40, fontWeight: 800, color: ACCENT_RGBA(0.2), marginBottom: 20 }}>0{i + 1}</div>
              <h3 style={{ fontFamily: FONT_INTER, fontSize: 20, fontWeight: 800, color: "#111", marginBottom: 12 }}>{s.name}</h3>
              <p style={{ fontFamily: FONT_INTER, fontSize: 13, color: "rgba(0,0,0,0.55)", lineHeight: 1.8, margin: 0, fontWeight: 400 }}>{s.desc}</p>
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
    { title: "Analisi Gratuita", desc: "Analizziamo il tuo sito attuale (o la tua presenza online) e ti mostriamo esattamente cosa non funziona e cosa si può migliorare. Zero costi, zero impegno." },
    { title: "Proposta Su Misura", desc: "Ti presentiamo una proposta con obiettivi chiari, tempistiche definite e prezzo trasparente. Nessuna sorpresa." },
    { title: "Consegna e Risultati", desc: "Costruiamo, testiamo e lanciamo. Tu vedi il progresso in tempo reale e ricevi un sito pronto a generare clienti." }
  ];
  return (
    <section id="processo" style={{ padding: "110px 36px", background: "#ffffff" }}>
      <div style={{ maxWidth: "min(1000px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>PROCESSO</div>
          <TextReveal text="Come Lavoriamo" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#111" }} />
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "20px auto 0" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {steps.map((s, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div style={{ display: "flex", gap: 40, alignItems: "flex-start", padding: "40px 0", borderBottom: i < 2 ? "1px solid rgba(14,165,233,0.15)" : "none" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 52, fontWeight: 800, color: ACCENT_RGBA(0.15), lineHeight: 1, minWidth: 60, textAlign: "center" }}>{i + 1}</div>
              <div>
                <h3 style={{ fontFamily: FONT_INTER, fontSize: 24, fontWeight: 800, color: "#111", margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(0,0,0,0.55)", lineHeight: 1.85, margin: 0, fontWeight: 400 }}>{s.desc}</p>
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
  const features = [
    "Analisi e consulenza iniziale",
    "Design personalizzato",
    "Sviluppo responsive (mobile-first)",
    "Ottimizzazione SEO base",
    "Form contatto funzionale",
    "Deploy e configurazione dominio",
    "30 giorni di supporto post-lancio"
  ];
  return (
    <section id="pricing" style={{ padding: "110px 36px", background: "#fafafa" }}>
      <div style={{ maxWidth: "min(640px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>INVESTIMENTO</div>
        <TextReveal text="Quanto Costa un Sito che Funziona" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#111", marginBottom: 16 }} />
        <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto 48px" }} />
        <ScrollReveal delay={100}>
          <div className="card-pricing" style={{ border: `1px solid ${ACCENT_RGBA(0.25)}`, padding: "52px 40px", background: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease" }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 4, marginBottom: 12 }}>Sito Completo</div>
          <div style={{ fontFamily: FONT_INTER, fontSize: 56, fontWeight: 800, color: "#111", marginBottom: 32 }}>Da €997<span style={{ fontSize: 16, color: "rgba(0,0,0,0.5)", fontWeight: 400 }}> /progetto</span></div>
          {features.map((f, i) => (
            <div key={i} style={{ fontFamily: FONT_INTER, fontSize: 13, color: "rgba(0,0,0,0.6)", padding: "14px 0", borderBottom: i < 6 ? "1px solid rgba(0,0,0,0.06)" : "none", textAlign: "left", display: "flex", alignItems: "center", gap: 14, fontWeight: 400 }}>
              <span style={{ color: ACCENT, fontSize: 10 }}>◆</span> {f}
            </div>
          ))}
          <button onClick={() => scrollToSection("contatti")} className="btn-outline" style={{ marginTop: 36, width: "100%", background: "transparent", color: ACCENT, border: `1px solid ${ACCENT}`, padding: "17px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease" }}>Prenota Consulenza Gratuita</button>
          <div style={{ fontFamily: FONT_INTER, fontSize: 11, color: "rgba(0,0,0,0.5)", marginTop: 16, fontWeight: 400 }}>Consulenza gratuita · Preventivo personalizzato · Pagamento rateizzabile</div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ───────── TEAM ───────── */
function Team() {
  const members = [
    { name: "Nome Cognome", role: "Fondatore & Lead Developer", placeholder: "N" },
    { name: "Nome Cognome", role: "Design & UX", placeholder: "N" },
    { name: "Nome Cognome", role: "Marketing & Strategia", placeholder: "N" },
  ];
  return (
    <section id="team" style={{ padding: "110px 36px", background: "#ffffff" }}>
      <div style={{ maxWidth: "min(1000px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>IL TEAM</div>
          <TextReveal text="Chi Lavora per Te" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#111" }} />
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "20px auto 0" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 36 }}>
          {members.map((m, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div className="card-team" style={{ textAlign: "center", transition: "transform 0.25s ease, box-shadow 0.25s ease" }}>
              <div style={{ width: 120, height: 120, borderRadius: "50%", background: ACCENT_RGBA(0.12), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontFamily: FONT_INTER, fontSize: 40, fontWeight: 800, color: ACCENT_RGBA(0.5) }}>{m.placeholder}</div>
              <h3 style={{ fontFamily: FONT_INTER, fontSize: 18, fontWeight: 800, color: "#111", marginBottom: 8 }}>{m.name}</h3>
              <div style={{ fontFamily: FONT_INTER, fontSize: 12, color: ACCENT, fontWeight: 600, letterSpacing: 1 }}>{m.role}</div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "Quanto tempo ci vuole?", a: "Dipende dalla complessità del progetto. Un sito landing page è pronto in 5-7 giorni. Un sito multi-pagina in 2-3 settimane. Definiamo le tempistiche insieme prima di iniziare." },
    { q: "E se non sono soddisfatto del risultato?", a: "Lavoriamo con revisioni incluse fino alla tua completa soddisfazione. Non consegniamo un progetto finché non sei felice al 100%." },
    { q: "Ho già un sito, potete migliorarlo senza rifarlo da zero?", a: "Assolutamente sì. Facciamo un audit gratuito e ti diciamo cosa si può migliorare. A volte bastano pochi interventi mirati per trasformare le performance." },
    { q: "Come funziona il pagamento?", a: "50% all'inizio, 50% alla consegna. Per progetti più grandi offriamo pagamento in 3 rate. Nessun pagamento nascosto." },
    { q: "Cosa succede dopo la consegna?", a: "Hai 30 giorni di supporto incluso per qualsiasi modifica o problema. Dopo, offriamo pacchetti di manutenzione mensile a partire da €97/mese." }
  ];
  return (
    <section id="faq" style={{ padding: "110px 36px", background: "#ffffff" }}>
      <div style={{ maxWidth: "min(900px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>FAQ</div>
          <TextReveal text="Domande Frequenti" style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#111" }} />
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "20px auto 0" }} />
        </div>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: "1px solid rgba(14,165,233,0.12)" }}>
            <button onClick={() => setOpen(open === i ? null : i)} className="btn-faq btn-tap" style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", textAlign: "left", transition: "transform 0.2s ease" }}>
              <span style={{ fontFamily: FONT_INTER, fontSize: 19, fontWeight: 600, color: "#111" }}>{f.q}</span>
              <span style={{ fontSize: 16, color: ACCENT, transition: "transform .3s", transform: open === i ? "rotate(45deg)" : "none", flexShrink: 0, marginLeft: 20, fontFamily: FONT_INTER, fontWeight: 400 }}>+</span>
            </button>
            {open === i && <div style={{ padding: "0 0 24px", fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(0,0,0,0.55)", lineHeight: 1.85, fontWeight: 400 }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── FOOTER CTA ───────── */
function FooterCTA() {
  return (
    <section id="contatti" style={{ padding: "120px 36px", background: "#fafafa", textAlign: "center", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 1, height: 80, background: `linear-gradient(to bottom, ${ACCENT_RGBA(0.3)}, transparent)` }} />
      <div style={{ maxWidth: "min(900px, 92vw)", width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: 24 }}>
          <ECFLogo />
        </div>
        <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 24 }}>CONTATTI</div>
        <h2 style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#111", marginBottom: 20 }}>Pronto a Far Crescere il Tuo Business?</h2>
        <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto 28px" }} />
        <p style={{ fontFamily: FONT_INTER, fontSize: 14, color: "rgba(0,0,0,0.55)", marginBottom: 44, lineHeight: 1.9, fontWeight: 400 }}>Prenota una consulenza gratuita di 15 minuti. Analizziamo il tuo sito e ti mostriamo come migliorarlo.</p>
        <button onClick={() => scrollToSection("contatti")} className="btn-primary cta-footer-btn" style={{ background: ACCENT, color: "#0C0C0C", border: "none", padding: "18px 52px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease", maxWidth: 360, margin: "0 auto" }}>Prenota Consulenza Gratuita</button>
        <div style={{ marginTop: 64, display: "flex", gap: 56, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Telefono", "+39 XXX XXX XXXX"], ["Email", "info@ecfmedia.it"], ["Zona", "Italia"]].map(([label, text]) => (
            <div key={text} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 9, fontWeight: 600, color: ACCENT_RGBA(0.5), textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>{label}</div>
              <div style={{ fontFamily: FONT_INTER, fontSize: 13, color: "rgba(0,0,0,0.6)", fontWeight: 400 }}>{text}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 64, paddingTop: 28, borderTop: "1px solid rgba(14,165,233,0.15)", fontFamily: FONT_INTER, fontSize: 11, color: "rgba(0,0,0,0.4)", letterSpacing: 1 }}>© 2026 ECF Media · Tutti i diritti riservati</div>
      </div>
    </section>
  );
}

/* ───────── MAIN ───────── */
export default function PremiumTemplate() {
  return (
    <div style={{ margin: 0, padding: 0, background: "#ffffff" }} className="ecf-media-site">
      <NoiseOverlay />
      <style>{`
        .ecf-media-site section[id] { scroll-margin-top: ${SCROLL_OFFSET}px; }
        html { scroll-behavior: smooth; }
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
        @media (max-width: 768px) {
          .ecf-media-site .hero-blob-mobile-hide { display: none; }
          .ecf-media-site .hero-blob { filter: blur(120px); }
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
        .ecf-media-site .text-reveal-accent-last .text-reveal-word:last-child { font-style: italic; color: #0EA5E9; }
        /* Logo hover */
        @media (hover: hover) {
          .ecf-media-site .logo-item:hover { color: #0EA5E9 !important; transform: scale(1.08); }
          .ecf-media-site .card-team:hover { transform: translateY(-6px); }
        }
        .ecf-media-site .btn-primary:active,
        .ecf-media-site .btn-outline:active,
        .ecf-media-site .btn-nav:active,
        .ecf-media-site .btn-nav-mobile:active,
        .ecf-media-site .btn-faq:active,
        .ecf-media-site .btn-tap:active { transform: scale(0.98); }
        @media (hover: hover) {
          .ecf-media-site .btn-primary:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15), 0 0 20px rgba(14,165,233,0.35);
            background-color: #0284C7 !important;
          }
          .ecf-media-site .btn-primary:hover:active { transform: scale(0.98); }
          .ecf-media-site .btn-outline:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            background-color: rgba(14,165,233,0.08) !important;
          }
          .ecf-media-site .btn-outline:hover:active { transform: scale(0.98); }
          .ecf-media-site .btn-nav:hover {
            transform: scale(1.02);
            color: #0EA5E9 !important;
          }
          .ecf-media-site .btn-nav:hover:active { transform: scale(0.98); }
          .ecf-media-site .card-problema:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.06);
            border-color: rgba(14,165,233,0.2) !important;
          }
          .ecf-media-site .card-soluzione:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
            border-color: rgba(14,165,233,0.4) !important;
          }
          .ecf-media-site .card-testimonial:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.06);
            border-left-color: #0EA5E9 !important;
          }
          .ecf-media-site .card-servizi:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
            border-color: rgba(14,165,233,0.35) !important;
          }
          .ecf-media-site .card-pricing:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 28px rgba(0,0,0,0.1) !important;
            border-color: rgba(14,165,233,0.4) !important;
          }
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
      <SocialProof />
      <BlueLine />
      <Loghi />
      <BlueLine />
      <Services />
      <BlueLine />
      <Process />
      <BlueLine />
      <Pricing />
      <BlueLine />
      <Team />
      <BlueLine />
      <FAQ />
      <BlueLine />
      <FooterCTA />
    </div>
  );
}
