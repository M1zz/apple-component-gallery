/**
 * Apple Component Gallery — Main Application
 * React 18 + JSX (Babel standalone)
 */

const { useState, useMemo, useRef, useEffect, useCallback } = React;

function DonationButton({ t }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <button
        className="donation-fab"
        onClick={() => setOpen(true)}
        title={t("donationFab")}
      >
        ☕ {t("donationFab")}
      </button>

      {open && (
        <div className="donation-overlay" onClick={() => setOpen(false)}>
          <div className="donation-modal" onClick={e => e.stopPropagation()}>
            <button className="donation-close" onClick={() => setOpen(false)}>✕</button>
            <p className="donation-title">{t("donationTitle")}</p>
            <img
              src="assets/kakao-pay-qr.jpg"
              alt="카카오페이 QR 코드"
              className="donation-qr"
            />
            <p className="donation-name">{t("donationName")}</p>
          </div>
        </div>
      )}
    </>
  );
}

const { COMPONENTS, CATEGORIES, PLATFORMS, CAT_COLORS, PLAT_ICONS } = window.APP_DATA;

function App({ lang, changeLang, t, getDesc }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [plat, setPlat] = useState("All");
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const detailRef = useRef(null);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  /* ── Filtering ── */
  const filtered = useMemo(() =>
    COMPONENTS.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.swiftUI.toLowerCase().includes(q) ||
        c.uiKit.toLowerCase().includes(q) ||
        c.aliases.some(a => a.toLowerCase().includes(q)) ||
        c.desc.includes(search);
      const matchCat = cat === "All" || c.cat === cat;
      const matchPlat = plat === "All" || c.plat.includes(plat);
      return matchSearch && matchCat && matchPlat;
    })
  , [search, cat, plat]);

  const comp = COMPONENTS.find(c => c.id === selected);

  const catCounts = useMemo(() => {
    const base = COMPONENTS.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        c.name.toLowerCase().includes(q) ||
        c.swiftUI.toLowerCase().includes(q) ||
        c.uiKit.toLowerCase().includes(q) ||
        c.aliases.some(a => a.toLowerCase().includes(q)) ||
        c.desc.includes(search);
      const matchPlat = plat === "All" || c.plat.includes(plat);
      return matchSearch && matchPlat;
    });
    const counts = {};
    CATEGORIES.forEach(c => counts[c] = c === "All" ? base.length : 0);
    base.forEach(c => { if (counts[c.cat] !== undefined) counts[c.cat]++; });
    return counts;
  }, [search, plat]);

  /* ── Effects ── */
  useEffect(() => {
    if (comp && detailRef.current) detailRef.current.scrollTop = 0;
  }, [selected]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setSelected(null);
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector(".search-box input")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ── Handlers ── */
  const copyCode = useCallback((code) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }, []);

  const resetFilters = () => { setSearch(""); setCat("All"); setPlat("All"); };

  /* ── Render ── */
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh" }}>

      {/* ═══ HEADER ═══ */}
      <header className="header">
        <div className="header-inner">
          <div className="header-top">
            <div className="logo-group">
              <div className="logo-icon">⌘</div>
              <div className="logo-text">
                <h1>Apple Component Gallery</h1>
                <p>{t("componentCount", COMPONENTS.length)}</p>
              </div>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0 }}>
              <div className="search-box">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <circle cx="9" cy="9" r="6.5" stroke="#6e6e73" strokeWidth="1.5" />
                  <line x1="13.5" y1="13.5" x2="18" y2="18" stroke="#6e6e73" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                />
                {search && (
                  <button className="search-clear" onClick={() => setSearch("")}>✕</button>
                )}
              </div>

              <div className="lang-switcher">
                {["ko", "en", "ja", "zh"].map(l => (
                  <button
                    key={l}
                    className={`lang-btn ${lang === l ? "active" : ""}`}
                    onClick={() => changeLang(l)}
                  >
                    {l === "ko" ? "한" : l === "en" ? "EN" : l === "ja" ? "日" : "中"}
                  </button>
                ))}
              </div>

              <button
                className="theme-toggle"
                onClick={() => setDark(d => !d)}
                title={dark ? t("lightMode") : t("darkMode")}
              >
                {dark ? "☀️" : "🌙"}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-row">
            <div className="filter-group">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`filter-btn ${cat === c ? "active" : ""}`}
                  onClick={() => setCat(c)}
                >
                  {c} ({catCounts[c] ?? 0})
                </button>
              ))}
            </div>
            <div className="filter-divider" />
            <div className="filter-group">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  className={`plat-btn ${plat === p ? "active" : ""}`}
                  onClick={() => setPlat(p)}
                >
                  {PLAT_ICONS[p] || ""} {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ═══ MAIN ═══ */}
      <div className="main-content">

        {/* Grid */}
        <div className="grid-area">
          {filtered.length > 0 ? (
            <div className={`component-grid ${selected ? "collapsed" : "expanded"}`}>
              {filtered.map((c, i) => (
                <button
                  key={c.id}
                  className={`comp-card fade-up ${selected === c.id ? "selected" : ""}`}
                  style={{ animationDelay: `${Math.min(i * 15, 300)}ms` }}
                  onClick={() => setSelected(selected === c.id ? null : c.id)}
                >
                  <div className="card-header">
                    <span className="card-emoji">{c.emoji}</span>
                    <span className="card-name">{c.name}</span>
                  </div>
                  <div
                    className="card-api"
                    style={{
                      color: CAT_COLORS[c.cat]?.text || "#0a84ff",
                      background: CAT_COLORS[c.cat]?.bg || "var(--accent-bg)",
                    }}
                  >
                    {c.swiftUI}
                  </div>
                  <p className="card-desc">{getDesc(c)}</p>
                  <div className="card-tags">
                    {c.plat.map(p => (
                      <span key={p} className="tag-plat">{PLAT_ICONS[p]} {p}</span>
                    ))}
                    <span className="tag-avail">{c.avail}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="icon">🔍</div>
              <p className="title">{t("noResults")}</p>
              <p className="subtitle">{t("noResultsHint")}</p>
              <button className="reset-btn" onClick={resetFilters}>{t("resetFilters")}</button>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {comp && (
          <div ref={detailRef} className="detail-panel slide-in">
            <div className="detail-inner">

              {/* Header */}
              <div className="detail-header">
                <div>
                  <div className="detail-emoji">{comp.emoji}</div>
                  <h2 className="detail-name">{comp.name}</h2>
                  <div
                    className="detail-cat-badge"
                    style={{
                      background: CAT_COLORS[comp.cat]?.bg,
                      color: CAT_COLORS[comp.cat]?.text,
                      border: `1px solid ${CAT_COLORS[comp.cat]?.border}`,
                    }}
                  >
                    {comp.cat}
                  </div>
                </div>
                <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
              </div>

              {/* Description */}
              <p className="detail-desc">{getDesc(comp)}</p>

              {/* Preview */}
              {window.PREVIEWS?.[comp.id] && (
                <div style={{ marginBottom: 24 }}>
                  <div className="section-label">{t("preview")}</div>
                  <div
                    className="component-preview"
                    dangerouslySetInnerHTML={{ __html: window.PREVIEWS[comp.id] }}
                  />
                </div>
              )}

              {/* API Boxes */}
              <div className="api-boxes">
                <div className="api-box swiftui">
                  <div className="api-box-label">SwiftUI</div>
                  <div className="api-box-value">{comp.swiftUI}</div>
                </div>
                <div className="api-box uikit">
                  <div className="api-box-label">UIKit</div>
                  <div className="api-box-value">{comp.uiKit}</div>
                </div>
              </div>

              {/* Aliases */}
              {comp.aliases.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div className="section-label">{t("alsoKnownAs")}</div>
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                    {comp.aliases.map(a => (
                      <span key={a} className="alias-tag">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Platforms */}
              <div style={{ marginBottom: 24 }}>
                <div className="section-label">{t("platforms")}</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {comp.plat.map(p => (
                    <span key={p} className="plat-tag">{PLAT_ICONS[p]} {p}</span>
                  ))}
                  <span className="avail-tag">{comp.avail}</span>
                </div>
              </div>

              {/* Code */}
              <div>
                <div className="code-header">
                  <div className="section-label" style={{ marginBottom: 0 }}>{t("codeExample")}</div>
                  <button
                    className={`copy-btn ${copied ? "copied" : ""}`}
                    onClick={() => copyCode(comp.code)}
                  >
                    {copied ? t("copied") : t("copy")}
                  </button>
                </div>
                <pre
                  className="code-block"
                  dangerouslySetInnerHTML={{ __html: window.highlightSwift(comp.code) }}
                />
              </div>

              {/* Cross-Platform Names */}
              {window.CROSS_PLATFORM?.[comp.id] && (() => {
                const cp = window.CROSS_PLATFORM[comp.id];
                const rows = [
                  { icon: "🌐", label: "Web",     value: cp.web },
                  { icon: "🤖", label: "Android", value: cp.android },
                  { icon: "🐦", label: "Flutter", value: cp.flutter },
                  { icon: "⚛️", label: "React",   value: cp.react },
                ].filter(r => r.value);
                return (
                  <div style={{ marginTop: 24, marginBottom: 24 }}>
                    <div className="section-label">{t("otherPlatforms")}</div>
                    <div className="cross-platform-table">
                      {rows.map(r => (
                        <div key={r.label} className="cp-row">
                          <span className="cp-platform">
                            <span className="cp-icon">{r.icon}</span>
                            {r.label}
                          </span>
                          <span className="cp-value">{r.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* References */}
              {window.REFERENCES?.[comp.id]?.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <div className="section-label">{t("appleDocs")}</div>
                  <div className="ref-list">
                    {window.REFERENCES[comp.id].map(ref => (
                      <a
                        key={ref.url}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ref-link"
                      >
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ flexShrink:0 }}>
                          <circle cx="10" cy="10" r="8" stroke="#007AFF" strokeWidth="1.5"/>
                          <path d="M10 6v4l2.5 2.5" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        <span>{ref.label}</span>
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ flexShrink:0, marginLeft:"auto", opacity:0.4 }}>
                          <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="footer">
        <div className="footer-inner">
          <span>
            Inspired by <a href="https://component.gallery" target="_blank" rel="noopener">component.gallery</a> · {t("footerRemix")}
          </span>
          <span>{t("footerFor")}</span>
        </div>
      </footer>

    </div>
  );
}

function Root() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "ko");

  const changeLang = useCallback((l) => {
    setLang(l);
    localStorage.setItem("lang", l);
  }, []);

  const t = useCallback((key, ...args) => {
    const strings = window.I18N_STRINGS?.[lang] || window.I18N_STRINGS?.["ko"];
    const val = strings?.[key];
    if (typeof val === "function") return val(...args);
    return val ?? key;
  }, [lang]);

  const getDesc = useCallback((comp) => {
    if (lang === "ko") return comp.desc;
    return window.I18N_DESC?.[lang]?.[comp.id] || comp.desc;
  }, [lang]);

  return (
    <>
      <App lang={lang} changeLang={changeLang} t={t} getDesc={getDesc} />
      <DonationButton t={t} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
