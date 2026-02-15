import { useState, useEffect } from "react";

const SECTIONS = ["home", "problema", "soluzione", "risultati", "servizi", "processo", "pricing", "faq", "contatti"];
const NAV_LABELS = { home: "Home", problema: "Problema", soluzione: "Soluzione", risultati: "Risultati", servizi: "Servizi", processo: "Come Funziona", pricing: "Prezzi", faq: "FAQ", contatti: "Contatti" };

const FONT_INTER = "'Inter', sans-serif";
const ACCENT = "#0EA5E9";
const ACCENT_RGBA = (o) => `rgba(14,165,233,${o})`;

/* ───────── ECF MEDIA LOGO ───────── */
function ECFLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 32, height: 32, background: ACCENT, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 12, height: 12, border: "2.5px solid #fff", borderRadius: 3 }} />
      </div>
      <span style={{ fontFamily: FONT_INTER, fontWeight: 800, color: "#fff", fontSize: 18 }}>ECF</span>
      <span style={{ fontFamily: FONT_INTER, fontWeight: 400, color: "rgba(255,255,255,0.5)", fontSize: 18 }}>media</span>
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

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(12,12,12,0.95)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${ACCENT_RGBA(0.15)}`, padding: "0 36px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <ECFLogo />
      <div style={{ display: "flex", gap: 6, alignItems: "center" }} className="desktop-nav-p">
        {SECTIONS.map(id => (
          <button key={id} onClick={() => scrollTo(id)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "8px 13px", fontFamily: FONT_INTER, fontSize: 11, fontWeight: active === id ? 600 : 400, color: active === id ? ACCENT : "rgba(255,255,255,0.45)", transition: "all .3s", textTransform: "uppercase", letterSpacing: 1.5 }}>{NAV_LABELS[id]}</button>
        ))}
      </div>
      <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger-p" style={{ display: "none", background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: 6, padding: 8, zIndex: 1001 }}>
        <span style={{ width: 26, height: 1.5, background: ACCENT, transition: "all .3s", transform: menuOpen ? "rotate(45deg) translate(6px, 6px)" : "none" }} />
        <span style={{ width: 26, height: 1.5, background: ACCENT, transition: "all .3s", opacity: menuOpen ? 0 : 1 }} />
        <span style={{ width: 26, height: 1.5, background: ACCENT, transition: "all .3s", transform: menuOpen ? "rotate(-45deg) translate(6px, -6px)" : "none" }} />
      </button>
      {menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, background: "#0C0C0C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <ECFLogo />
          </div>
          {SECTIONS.map(id => (
            <button key={id} onClick={() => scrollTo(id)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "18px 32px", fontFamily: FONT_INTER, fontSize: 26, fontWeight: active === id ? 600 : 400, color: active === id ? ACCENT : "rgba(255,255,255,0.35)", width: "80%", textAlign: "center", letterSpacing: 1 }}>{NAV_LABELS[id]}</button>
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
  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0C0C0C", padding: "100px 36px 60px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${ACCENT_RGBA(0.06)} 0%, transparent 70%)` }} />
      <div style={{ position: "absolute", top: 120, right: "10%", width: 1, height: 120, background: `linear-gradient(to bottom, transparent, ${ACCENT_RGBA(0.2)}, transparent)` }} />
      <div style={{ position: "absolute", bottom: 120, left: "10%", width: 1, height: 120, background: `linear-gradient(to bottom, transparent, ${ACCENT_RGBA(0.2)}, transparent)` }} />

      <div style={{ maxWidth: 760, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_INTER, fontSize: 11, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 32 }}>WEB AGENCY — ITALIA</div>
        <h1 style={{ fontFamily: FONT_INTER, fontSize: "clamp(38px, 6vw, 72px)", fontWeight: 800, color: "#FAFAFA", lineHeight: 1.1, margin: "0 0 28px", letterSpacing: -0.5 }}>
          Il Tuo Sito Non Converte?<br /><span style={{ color: ACCENT, fontStyle: "italic" }}>Noi Lo Sistemiamo.</span>
        </h1>
        <p style={{ fontFamily: FONT_INTER, fontSize: "clamp(14px, 2vw, 16px)", color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto 44px", lineHeight: 1.9, fontWeight: 400, letterSpacing: 0.3 }}>Creiamo siti web che trasformano visitatori in clienti. Design premium, performance reali, risultati misurabili.</p>
        <div className="cta-hero-wrap" style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{ background: "transparent", color: ACCENT, border: `1px solid ${ACCENT}`, padding: "16px 44px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "all .3s", minWidth: 200 }}>Prenota Consulenza Gratuita</button>
          <button style={{ background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.12)", padding: "16px 44px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 400, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, minWidth: 200 }}>Vedi Portfolio</button>
        </div>
        <div style={{ width: 1, height: 60, background: `linear-gradient(to bottom, transparent, ${ACCENT_RGBA(0.3)})`, margin: "56px auto 0" }} />
        <div style={{ display: "flex", gap: 56, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
          {[["50+", "Progetti"], ["4.9", "Rating"], ["100%", "Soddisfazione"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 32, fontWeight: 800, color: ACCENT }}>{num}</div>
              <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: 4, marginTop: 4 }}>{label}</div>
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
    <section id="problema" style={{ padding: "110px 36px", background: "#111111" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>IL PROBLEMA</div>
          <h2 style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#FAFAFA", marginBottom: 16 }}>Il Tuo Sito Ti Sta Costando Clienti</h2>
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 36 }}>
          {problems.map((p, i) => (
            <div key={i} style={{ textAlign: "center", padding: "0 12px" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 56, fontWeight: 800, color: ACCENT_RGBA(0.15), lineHeight: 1, marginBottom: 16 }}>{i + 1}</div>
              <h3 style={{ fontFamily: FONT_INTER, fontSize: 22, fontWeight: 800, color: "#FAFAFA", marginBottom: 12 }}>{p.title}</h3>
              <p style={{ fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.85, margin: 0, fontWeight: 400 }}>{p.desc}</p>
            </div>
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
    <section id="soluzione" style={{ padding: "110px 36px", background: "#0C0C0C" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>LA SOLUZIONE</div>
          <h2 style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#FAFAFA", marginBottom: 16 }}>Il Nostro <span style={{ color: ACCENT, fontStyle: "italic" }}>Approccio</span></h2>
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
          {benefits.map((b, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${ACCENT_RGBA(0.3)}`, padding: "44px 32px", textAlign: "center" }}>
              <div style={{ width: 48, height: 48, border: `1px solid ${ACCENT_RGBA(0.3)}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontFamily: FONT_INTER, fontSize: 20, color: ACCENT, fontWeight: 800 }}>{i + 1}</div>
              <h3 style={{ fontFamily: FONT_INTER, fontSize: 22, fontWeight: 800, color: "#FAFAFA", marginBottom: 12 }}>{b.title}</h3>
              <p style={{ fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.85, margin: 0, fontWeight: 400 }}>{b.desc}</p>
            </div>
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
    <section id="risultati" style={{ padding: "110px 36px", background: "#111111" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>RISULTATI</div>
          <h2 style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#FAFAFA" }}>Cosa Ottengono i Nostri Clienti</h2>
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "20px auto 0" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ padding: "40px 28px", borderLeft: `1px solid ${ACCENT_RGBA(0.3)}` }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 48, color: ACCENT_RGBA(0.2), lineHeight: 1, marginBottom: 16 }}>"</div>
              <p style={{ fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.9, margin: "0 0 28px", fontWeight: 400, fontStyle: "italic" }}>{t.text}</p>
              <div style={{ width: 24, height: 1, background: ACCENT_RGBA(0.3), marginBottom: 16 }} />
              <div style={{ fontFamily: FONT_INTER, fontWeight: 600, fontSize: 12, color: "#FAFAFA", letterSpacing: 1, textTransform: "uppercase" }}>{t.name}</div>
              <div style={{ fontFamily: FONT_INTER, fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4, letterSpacing: 0.5 }}>{t.role}</div>
            </div>
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
    <section id="servizi" style={{ padding: "110px 36px", background: "#0C0C0C" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>SERVIZI</div>
          <h2 style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#FAFAFA" }}>Cosa Facciamo</h2>
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "20px auto 0" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {services.map((s, i) => (
            <div key={i} style={{ border: `1px solid ${ACCENT_RGBA(0.1)}`, padding: "40px 28px", textAlign: "center", transition: "all .3s", background: "rgba(255,255,255,0.01)" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 40, fontWeight: 800, color: ACCENT_RGBA(0.2), marginBottom: 20 }}>0{i + 1}</div>
              <h3 style={{ fontFamily: FONT_INTER, fontSize: 20, fontWeight: 800, color: "#FAFAFA", marginBottom: 12 }}>{s.name}</h3>
              <p style={{ fontFamily: FONT_INTER, fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.8, margin: 0, fontWeight: 400 }}>{s.desc}</p>
            </div>
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
    <section id="processo" style={{ padding: "110px 36px", background: "#111111" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>PROCESSO</div>
          <h2 style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#FAFAFA" }}>Come Lavoriamo</h2>
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "20px auto 0" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 40, alignItems: "flex-start", padding: "40px 0", borderBottom: i < 2 ? `1px solid ${ACCENT_RGBA(0.1)}` : "none" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 52, fontWeight: 800, color: ACCENT_RGBA(0.15), lineHeight: 1, minWidth: 60, textAlign: "center" }}>{i + 1}</div>
              <div>
                <h3 style={{ fontFamily: FONT_INTER, fontSize: 24, fontWeight: 800, color: "#FAFAFA", margin: "0 0 10px" }}>{s.title}</h3>
                <p style={{ fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.85, margin: 0, fontWeight: 400 }}>{s.desc}</p>
              </div>
            </div>
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
    <section id="pricing" style={{ padding: "110px 36px", background: "#0C0C0C" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>INVESTIMENTO</div>
        <h2 style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#FAFAFA", marginBottom: 16 }}>Quanto Costa un Sito che Funziona</h2>
        <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto 48px" }} />
        <div style={{ border: `1px solid ${ACCENT_RGBA(0.2)}`, padding: "52px 40px", background: "rgba(255,255,255,0.01)" }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 4, marginBottom: 12 }}>Sito Completo</div>
          <div style={{ fontFamily: FONT_INTER, fontSize: 56, fontWeight: 800, color: "#FAFAFA", marginBottom: 32 }}>Da €997<span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}> /progetto</span></div>
          {features.map((f, i) => (
            <div key={i} style={{ fontFamily: FONT_INTER, fontSize: 13, color: "rgba(255,255,255,0.45)", padding: "14px 0", borderBottom: i < 6 ? "1px solid rgba(255,255,255,0.05)" : "none", textAlign: "left", display: "flex", alignItems: "center", gap: 14, fontWeight: 400 }}>
              <span style={{ color: ACCENT, fontSize: 10 }}>◆</span> {f}
            </div>
          ))}
          <button style={{ marginTop: 36, width: "100%", background: "transparent", color: ACCENT, border: `1px solid ${ACCENT}`, padding: "17px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "all .3s" }}>Prenota Consulenza Gratuita</button>
          <div style={{ fontFamily: FONT_INTER, fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 16, fontWeight: 400 }}>Consulenza gratuita · Preventivo personalizzato · Pagamento rateizzabile</div>
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
    <section id="faq" style={{ padding: "110px 36px", background: "#111111" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>FAQ</div>
          <h2 style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#FAFAFA" }}>Domande Frequenti</h2>
          <div style={{ width: 40, height: 1, background: ACCENT, margin: "20px auto 0" }} />
        </div>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${ACCENT_RGBA(0.1)}` }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", textAlign: "left" }}>
              <span style={{ fontFamily: FONT_INTER, fontSize: 19, fontWeight: 600, color: "#FAFAFA" }}>{f.q}</span>
              <span style={{ fontSize: 16, color: ACCENT, transition: "transform .3s", transform: open === i ? "rotate(45deg)" : "none", flexShrink: 0, marginLeft: 20, fontFamily: FONT_INTER, fontWeight: 400 }}>+</span>
            </button>
            {open === i && <div style={{ padding: "0 0 24px", fontFamily: FONT_INTER, fontSize: 13.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.85, fontWeight: 400 }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────── FOOTER CTA ───────── */
function FooterCTA() {
  return (
    <section id="contatti" style={{ padding: "120px 36px", background: "#0C0C0C", textAlign: "center", position: "relative" }}>
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 1, height: 80, background: `linear-gradient(to bottom, ${ACCENT_RGBA(0.3)}, transparent)` }} />
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <ECFLogo />
        </div>
        <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 24 }}>CONTATTI</div>
        <h2 style={{ fontFamily: FONT_INTER, fontSize: "clamp(28px, 4.5vw, 46px)", fontWeight: 800, color: "#FAFAFA", marginBottom: 20 }}>Pronto a Far Crescere il Tuo Business?</h2>
        <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto 28px" }} />
        <p style={{ fontFamily: FONT_INTER, fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 44, lineHeight: 1.9, fontWeight: 400 }}>Prenota una consulenza gratuita di 15 minuti. Analizziamo il tuo sito e ti mostriamo come migliorarlo.</p>
        <button className="cta-footer-btn" style={{ background: ACCENT, color: "#0C0C0C", border: "none", padding: "18px 52px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "uppercase", letterSpacing: 3, transition: "all .3s", maxWidth: 360, margin: "0 auto" }}>Prenota Consulenza Gratuita</button>
        <div style={{ marginTop: 64, display: "flex", gap: 56, justifyContent: "center", flexWrap: "wrap" }}>
          {[["Telefono", "+39 XXX XXX XXXX"], ["Email", "info@ecfmedia.it"], ["Zona", "Italia"]].map(([label, text]) => (
            <div key={text} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 9, fontWeight: 600, color: ACCENT_RGBA(0.5), textTransform: "uppercase", letterSpacing: 3, marginBottom: 8 }}>{label}</div>
              <div style={{ fontFamily: FONT_INTER, fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>{text}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 64, paddingTop: 28, borderTop: `1px solid ${ACCENT_RGBA(0.08)}`, fontFamily: FONT_INTER, fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: 1 }}>© 2026 ECF Media · Tutti i diritti riservati</div>
      </div>
    </section>
  );
}

/* ───────── MAIN ───────── */
export default function PremiumTemplate() {
  return (
    <div style={{ margin: 0, padding: 0, background: "#0C0C0C" }} className="ecf-media-site">
      <style>{`
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
