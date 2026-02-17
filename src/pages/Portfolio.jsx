import { Link } from "react-router-dom";

const FONT_INTER = "'Inter', sans-serif";
const ACCENT = "#0EA5E9";
const ACCENT_RGBA = (o) => `rgba(14,165,233,${o})`;
const WHATSAPP_NUMBER = "393664400722";
const WHATSAPP_MSG = "Buongiorno, vorrei prenotare un'analisi gratuita della mia pizzeria.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MSG)}`;

/* Logo (link to home) */
function PortfolioLogo() {
  return (
    <Link to="/" style={{ textDecoration: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, background: ACCENT, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 12, height: 12, border: "2.5px solid #fff", borderRadius: 3 }} />
        </div>
        <span style={{ fontFamily: FONT_INTER, fontWeight: 800, color: "#ffffff", fontSize: 18 }}>ECF</span>
        <span style={{ fontFamily: FONT_INTER, fontWeight: 400, color: "rgba(255,255,255,0.6)", fontSize: 18 }}>media</span>
      </div>
    </Link>
  );
}

/* Navbar */
function PortfolioNav() {
  return (
    <nav className="portfolio-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, background: "rgba(12,12,12,0.95)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${ACCENT_RGBA(0.2)}`, height: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 1440, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", paddingLeft: "max(36px, env(safe-area-inset-left))", paddingRight: "max(36px, env(safe-area-inset-right))" }}>
        <PortfolioLogo />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link to="/" style={{ fontFamily: FONT_INTER, fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1.5, textDecoration: "none", padding: "8px 13px", transition: "color 0.2s" }}>Home</Link>
          <a href="/#contatti" style={{ fontFamily: FONT_INTER, fontSize: 11, fontWeight: 600, color: "#ffffff", background: ACCENT, textTransform: "uppercase", letterSpacing: 1.5, textDecoration: "none", padding: "10px 18px", borderRadius: 9999, transition: "background-color 0.2s" }}>Contatti</a>
        </div>
      </div>
    </nav>
  );
}

/* Hero */
function PortfolioHero() {
  return (
    <section className="portfolio-hero" style={{ paddingTop: 140, paddingBottom: 80, paddingLeft: 24, paddingRight: 24, background: "#0C0C0C", textAlign: "center" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 5, marginBottom: 20 }}>PORTFOLIO</div>
        <h1 style={{ fontFamily: FONT_INTER, fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, color: "#ffffff", margin: "0 0 16px", lineHeight: 1.1 }}>I Nostri Progetti</h1>
        <div style={{ width: 40, height: 1, background: ACCENT, margin: "0 auto 24px" }} />
        <p style={{ fontFamily: FONT_INTER, fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: 0, fontWeight: 400 }}>Siti e sistemi realizzati per le nostre pizzerie. Design, prenotazioni e ordini online che funzionano.</p>
      </div>
    </section>
  );
}

/* Projects grid - placeholder cards (puoi sostituire con dati reali) */
const PLACEHOLDER_PROJECTS = [
  { id: 1, title: "Pizzeria Bella Napoli", category: "Sito + Ordini", desc: "Sito one-page con menù digitale e ordini via WhatsApp.", url: "#", image: null },
  { id: 2, title: "Pizza & Fantasia", category: "Sito + SEO", desc: "Sito multi-pagina ottimizzato per Google, primo risultato in zona.", url: "#", image: null },
  { id: 3, title: "Pizzeria Da Luigi", category: "Sito + Prenotazioni", desc: "Widget prenotazioni e bot WhatsApp per i tavoli.", url: "#", image: null },
];

function ProjectCard({ project }) {
  return (
    <div className="portfolio-card" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${ACCENT_RGBA(0.2)}`, borderRadius: 12, overflow: "hidden", transition: "transform 0.25s ease, border-color 0.25s ease" }}>
      <div style={{ aspectRatio: "16/10", background: "rgba(14,165,233,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {project.image ? (
          <img src={project.image} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontFamily: FONT_INTER, fontSize: 14, color: ACCENT_RGBA(0.5), fontWeight: 600 }}>Immagine progetto</span>
        )}
      </div>
      <div style={{ padding: "24px 20px" }}>
        <div style={{ fontFamily: FONT_INTER, fontSize: 10, fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>{project.category}</div>
        <h3 style={{ fontFamily: FONT_INTER, fontSize: 20, fontWeight: 800, color: "#ffffff", margin: "0 0 8px" }}>{project.title}</h3>
        <p style={{ fontFamily: FONT_INTER, fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, margin: "0 0 20px" }}>{project.desc}</p>
        {project.url && project.url !== "#" && (
          <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, color: ACCENT, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>Vedi sito →</a>
        )}
      </div>
    </div>
  );
}

function ProjectsSection() {
  return (
    <section className="portfolio-projects" style={{ padding: "0 24px 100px", background: "#0C0C0C" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="portfolio-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28 }}>
          {PLACEHOLDER_PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* CTA */
function PortfolioCTA() {
  return (
    <section className="portfolio-cta" style={{ padding: "80px 24px", background: "#0C0C0C", textAlign: "center", borderTop: `1px solid ${ACCENT_RGBA(0.15)}` }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ fontFamily: FONT_INTER, fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#ffffff", marginBottom: 16 }}>Vuoi il tuo progetto qui?</h2>
        <p style={{ fontFamily: FONT_INTER, fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: 32 }}>Prenota un'analisi gratuita e ti mostriamo come portare la tua pizzeria online.</p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: ACCENT, color: "#0C0C0C", padding: "16px 40px", fontFamily: FONT_INTER, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 3, textDecoration: "none", borderRadius: 8, transition: "background-color 0.2s, transform 0.2s" }}>Analisi Gratuita</a>
      </div>
    </section>
  );
}

/* Footer */
function PortfolioFooter() {
  return (
    <footer className="portfolio-footer" style={{ padding: "48px 24px", background: "#0C0C0C", borderTop: `1px solid ${ACCENT_RGBA(0.15)}` }}>
      <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", gap: 40, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          {[["Telefono", "+39 366 440 0722"], ["Email", "info@ecfmedia.it"]].map(([label, text]) => (
            <div key={label}>
              <div style={{ fontFamily: FONT_INTER, fontSize: 9, fontWeight: 600, color: ACCENT_RGBA(0.5), textTransform: "uppercase", letterSpacing: 2, marginBottom: 6 }}>{label}</div>
              <div style={{ fontFamily: FONT_INTER, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                {label === "Telefono" ? <a href="tel:+393664400722" style={{ color: "inherit", textDecoration: "none" }}>{text}</a> : text}
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: FONT_INTER, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>© 2026 ECF Media · Tutti i diritti riservati</div>
      </div>
    </footer>
  );
}

export default function PortfolioPage() {
  return (
    <div className="portfolio-page" style={{ background: "#0C0C0C", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        .portfolio-page { overflow-x: hidden; }
        .portfolio-nav a:hover { color: ${ACCENT} !important; }
        .portfolio-nav a[style*="background"]:hover { background-color: #0284C7 !important; }
        .portfolio-card:hover { transform: translateY(-4px); border-color: ${ACCENT_RGBA(0.4)} !important; }
        .portfolio-cta a:hover { background-color: #0284C7 !important; transform: scale(1.02); }
        @media (max-width: 768px) {
          .portfolio-grid { grid-template-columns: 1fr !important; }
          .portfolio-hero { padding-top: 120px !important; padding-bottom: 60px !important; }
        }
      `}</style>
      <PortfolioNav />
      <PortfolioHero />
      <ProjectsSection />
      <PortfolioCTA />
      <PortfolioFooter />
    </div>
  );
}
