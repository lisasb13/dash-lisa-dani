import { useState, useEffect } from "react";

const ISG = {
  orange: "#F47B20",
  orange100: "#FEF3EC",
  orange200: "#FDDEC5",
  purple: "#6B3FA0",
  purple100: "#F0EAF8",
  purple200: "#D4C0EE",
  text: "#1C1B1F",
  textMid: "#49454F",
  textMuted: "#79747E",
  bg: "#FAF8FF",
  surface: "#FFFFFF",
  border: "#E8E0F0",
  borderLight: "#F3EFF8",
  success: "#1A7A4A",
  successBg: "#E8F5ED",
  warning: "#92601A",
  warningBg: "#FEF3DC",
  danger: "#B3261E",
  dangerBg: "#FDECEA",
};

const FONT_URL = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";

const DEFAULT_PRIORIDADES = [
  { id: 1, texto: "Finalizar PPT Pesquisa Egressos MA", nivel: 3, tipo: "Entrega crítica" },
  { id: 2, texto: "Reunião de alinhamento Seduc MG — 15/05", nivel: 2, tipo: "Reunião importante" },
  { id: 3, texto: "Enviar relatório diagnóstico AL", nivel: 2, tipo: "Entrega crítica" },
  { id: 4, texto: "Acompanhar retorno professores mobilizadores MA", nivel: 3, tipo: "Risco" },
  { id: 5, texto: "Confirmar cronograma formação MS", nivel: 1, tipo: "Acompanhamento" },
];

const DEFAULT_PROJETOS = [
  { id: 1, nome: "Pesquisa Egressos", estado: "MA", tipo: "Condução Operacional", fase: "Em execução", risco: "Alto", fatores: ["Prazo", "Engajamento parceiro"], marco: "22/05", energia: 3, pendente: true,  obs: "Baixo retorno de professores mobilizadores. Prazo crítico em 22/05." },
  { id: 2, nome: "Implementação ETI", estado: "MG", tipo: "Acompanhamento Estratégico", fase: "Em execução", risco: "Médio", fatores: ["Dependência externa"], marco: "30/05", energia: 2, pendente: false, obs: "Aguardando confirmação de data da Seduc para próxima formação." },
  { id: 3, nome: "Formação de Gestores", estado: "MS", tipo: "Acompanhamento Estratégico", fase: "Planejamento", risco: "Baixo", fatores: [], marco: "10/06", energia: 1, pendente: true,  obs: "Planejamento em dia. Sem gargalos identificados." },
  { id: 4, nome: "Revisão Curricular ETI", estado: "AL", tipo: "Acompanhamento Estratégico", fase: "Em execução", risco: "Médio", fatores: ["Recurso interno", "Comunicação"], marco: "05/06", energia: 2, pendente: false, obs: "Alinhamento com equipe técnica pendente. Monitorando evolução." },
  { id: 5, nome: "Diagnóstico de Implementação", estado: "MA", tipo: "Condução Operacional", fase: "Entrega", risco: "Baixo", fatores: [], marco: "17/05", energia: 1, pendente: false, obs: "Relatório em fase final. Entrega prevista para 17/05." },
];

const DEFAULT_REUNIOES = [
  { id: 1, nome: "PPT Pesquisa Egressos MA", cat: "PPT", prio: "Urgente", esforco: "Dia inteiro", status: "Em andamento", prazo: "22/05", projeto: "Pesquisa Egressos" },
  { id: 2, nome: "Revisão material formação MG", cat: "Documento", prio: "Esta semana", esforco: "1–3h", status: "Backlog", prazo: "16/05", projeto: "Implementação ETI" },
  { id: 3, nome: "Reunião alinhamento Seduc MG", cat: "Reunião", prio: "Esta semana", esforco: "< 1h", status: "A fazer", prazo: "15/05", projeto: "Implementação ETI" },
  { id: 4, nome: "Relatório Diagnóstico AL", cat: "Documento", prio: "Esta semana", esforco: "Meio dia", status: "Em andamento", prazo: "17/05", projeto: "Diagnóstico de Implementação" },
  { id: 5, nome: "Apoio formação gestores MS", cat: "Apoio", prio: "Pode esperar", esforco: "Meio dia", status: "Backlog", prazo: "10/06", projeto: "Formação de Gestores" },
];

const DEFAULT_CONTEXTO = "Semana de atenção prioritária para MA (prazo crítico da Pesquisa Egressos em 22/05) e MG (formação aguardando confirmação da Seduc). Foco principal: finalização do PPT e mobilização de professores no MA.";
const DEFAULT_SEMANA = "12/05 – 16/05";

const ESTADOS = ["MA", "MG", "MS", "AL"];

const riscoMap = {
  Alto:  { cor: ISG.danger,  bg: ISG.dangerBg,  label: "Alto"  },
  Médio: { cor: ISG.warning, bg: ISG.warningBg, label: "Médio" },
  Baixo: { cor: ISG.success, bg: ISG.successBg, label: "Baixo" },
};

const prioMap = {
  Urgente:        { cor: ISG.danger,  bg: ISG.dangerBg  },
  "Esta semana":  { cor: ISG.warning, bg: ISG.warningBg },
  "Pode esperar": { cor: ISG.success, bg: ISG.successBg },
};

const statusMap = {
  "Em andamento": { cor: ISG.orange,   bg: ISG.orange100 },
  "A fazer":      { cor: ISG.purple,   bg: ISG.purple100 },
  Backlog:        { cor: ISG.textMuted, bg: "#F3F0F8" },
  Concluído:      { cor: ISG.success,  bg: ISG.successBg },
};

const tipoMap = {
  "Entrega crítica":    { cor: ISG.orange, bg: ISG.orange100 },
  "Reunião importante": { cor: ISG.purple, bg: ISG.purple100 },
  "Risco":              { cor: ISG.danger, bg: ISG.dangerBg  },
  "Acompanhamento":     { cor: ISG.success, bg: ISG.successBg },
};

const estadoCores = { MA: ISG.orange, MG: ISG.purple, MS: "#1565C0", AL: "#1A7A4A" };

const nivelConfig = [
  { cor: ISG.success, bg: ISG.successBg, label: "Baixo esforço" },
  { cor: ISG.warning, bg: ISG.warningBg, label: "Médio esforço" },
  { cor: ISG.danger,  bg: ISG.dangerBg,  label: "Alto esforço"  },
];

function Pill({ label, cor, bg }) {
  return (
    <span style={{ background: bg, color: cor, borderRadius: 99, padding: "3px 9px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", letterSpacing: 0.2 }}>
      {label}
    </span>
  );
}

function DemandMeter({ nivel, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      {[1, 2, 3].map(i => {
        const active = i <= nivel;
        const cfg = nivelConfig[nivel - 1];
        return (
          <div key={i} onClick={() => onChange && onChange(i)} style={{
            width: 26, height: 8, borderRadius: 99,
            background: active ? cfg.cor : ISG.border,
            opacity: active ? 1 : 0.5,
            cursor: onChange ? "pointer" : "default",
            transition: "background 0.2s",
          }} />
        );
      })}
      <span style={{ fontSize: 11, color: nivelConfig[nivel - 1].cor, fontWeight: 600, marginLeft: 4 }}>
        {nivelConfig[nivel - 1].label}
      </span>
    </div>
  );
}

function StatCard({ icon, value, label, cor, bg }) {
  return (
    <div style={{ background: bg || ISG.surface, border: `1px solid ${ISG.border}`, borderRadius: 16, padding: "18px 20px", flex: 1, minWidth: 120, display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 20, marginBottom: 4 }}>{icon}</span>
      <span style={{ fontSize: 28, fontWeight: 800, color: cor || ISG.text, lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 12, color: ISG.textMuted, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function ProjetoCard({ p, open, onToggle }) {
  const rc = riscoMap[p.risco];
  const isCond = p.tipo === "Condução Operacional";
  return (
    <div onClick={onToggle} style={{
      background: ISG.surface, border: `1px solid ${open ? ISG.orange : ISG.border}`,
      borderRadius: 14, padding: "14px 18px", cursor: "pointer",
      boxShadow: open ? `0 0 0 3px ${ISG.orange200}` : "none",
      transition: "all 0.18s", display: "flex", flexDirection: "column", gap: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: estadoCores[p.estado] || ISG.purple, color: "#fff", borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 800, letterSpacing: 0.8 }}>{p.estado}</div>
          <span style={{ fontWeight: 700, fontSize: 14, color: ISG.text }}>{p.nome}</span>
          {p.pendente && (
            <Pill label="⏳ Pendente Dani" cor={ISG.warning} bg={ISG.warningBg} />
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Pill label={`Risco ${rc.label}`} cor={rc.cor} bg={rc.bg} />
          <span style={{ color: ISG.textMuted, fontSize: 16, display: "inline-block", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <Pill
          label={isCond ? "🔧 Condução" : "🔭 Acompanhamento"}
          cor={isCond ? ISG.orange : ISG.purple}
          bg={isCond ? ISG.orange100 : ISG.purple100}
        />
        <Pill label={p.fase} cor={ISG.textMuted} bg="#F3F0F8" />
        {p.fatores.map(f => <Pill key={f} label={f} cor={ISG.textMuted} bg={ISG.borderLight} />)}
        <span style={{ marginLeft: "auto", fontSize: 12, color: ISG.textMuted }}>
          Marco: <strong style={{ color: ISG.text }}>{p.marco}</strong>
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: ISG.textMuted }}>Energia</span>
        <div style={{ display: "flex", gap: 4 }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= p.energia ? ISG.orange : ISG.border }} />
          ))}
        </div>
      </div>

      {open && (
        <div style={{ background: ISG.orange100, borderRadius: 10, padding: "10px 14px", borderLeft: `3px solid ${ISG.orange}`, fontSize: 13, color: ISG.textMid, lineHeight: 1.6, marginTop: 2 }}>
          {p.obs}
        </div>
      )}
    </div>
  );
}

function ReuniaoRow({ e }) {
  const pc = prioMap[e.prio] || prioMap["Pode esperar"];
  const sc = statusMap[e.status] || statusMap["Backlog"];
  const icons = { PPT: "📊", Documento: "📄", Reunião: "🤝", Apoio: "🙌", Pesquisa: "🔍" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: ISG.surface, border: `1px solid ${ISG.border}` }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>{icons[e.cat] || "📋"}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13, color: ISG.text, marginBottom: 2 }}>{e.nome}</div>
        <div style={{ fontSize: 11, color: ISG.textMuted }}>{e.projeto} · {e.esforco}</div>
      </div>
      <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
        <Pill label={e.prio} cor={pc.cor} bg={pc.bg} />
        <Pill label={e.status} cor={sc.cor} bg={sc.bg} />
        <Pill label={`📅 ${e.prazo}`} cor={ISG.textMuted} bg="#F3F0F8" />
      </div>
    </div>
  );
}

function PrioCard({ item, editMode, onUpdate, onDelete }) {
  const cfg = nivelConfig[item.nivel - 1];
  const tc = tipoMap[item.tipo] || { cor: ISG.textMuted, bg: "#F3F0F8" };
  const tipos = ["Entrega crítica", "Reunião importante", "Risco", "Acompanhamento"];
  return (
    <div style={{ background: ISG.surface, border: `1px solid ${ISG.border}`, borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: 16, borderLeft: `4px solid ${cfg.cor}` }}>
      <div style={{ flex: 1 }}>
        {editMode ? (
          <input value={item.texto} onChange={e => onUpdate("texto", e.target.value)}
            style={{ width: "100%", border: `1px solid ${ISG.border}`, borderRadius: 8, padding: "7px 10px", fontSize: 13, fontWeight: 600, color: ISG.text, background: ISG.bg, outline: `2px solid ${ISG.orange}`, boxSizing: "border-box" }} />
        ) : (
          <p style={{ fontWeight: 600, fontSize: 14, color: ISG.text, margin: "0 0 10px" }}>{item.texto}</p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: editMode ? 10 : 0 }}>
          {editMode ? (
            <select value={item.tipo} onChange={e => onUpdate("tipo", e.target.value)}
              style={{ border: `1px solid ${ISG.border}`, borderRadius: 8, padding: "4px 8px", fontSize: 12, color: ISG.textMid, background: ISG.surface, cursor: "pointer" }}>
              {tipos.map(t => <option key={t}>{t}</option>)}
            </select>
          ) : (
            <Pill label={item.tipo} cor={tc.cor} bg={tc.bg} />
          )}
          <DemandMeter nivel={item.nivel} onChange={editMode ? v => onUpdate("nivel", v) : null} />
        </div>
      </div>
      {editMode && (
        <button onClick={onDelete} style={{ background: ISG.dangerBg, border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: ISG.danger, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✕</button>
      )}
    </div>
  );
}

function FilterBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "5px 13px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${active ? ISG.orange : ISG.border}`, background: active ? ISG.orange : ISG.surface, color: active ? "#fff" : ISG.textMuted, transition: "all 0.15s", fontFamily: "inherit" }}>
      {label}
    </button>
  );
}

export default function Dashboard() {
  const [openProjeto, setOpenProjeto]   = useState(null);
  const [filtroRisco, setFiltroRisco]   = useState("Todos");
  const [filtroTipo, setFiltroTipo]     = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [editMode, setEditMode]         = useState(false);
  const [loading, setLoading]           = useState(true);
  const [contexto, setContexto]         = useState(DEFAULT_CONTEXTO);
  const [semana, setSemana]             = useState(DEFAULT_SEMANA);
  const [prioridades, setPrioridades]   = useState(DEFAULT_PRIORIDADES);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = FONT_URL;
    document.head.appendChild(link);
    async function load() {
      try {
        const c = await window.storage.get("isg-contexto"); if (c) setContexto(c.value);
        const s = await window.storage.get("isg-semana");   if (s) setSemana(s.value);
        const p = await window.storage.get("isg-prios");    if (p) setPrioridades(JSON.parse(p.value));
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  async function salvar() {
    try {
      await window.storage.set("isg-contexto", contexto);
      await window.storage.set("isg-semana", semana);
      await window.storage.set("isg-prios", JSON.stringify(prioridades));
    } catch {}
    setEditMode(false);
  }

  function updatePrio(id, key, val) {
    setPrioridades(prev => prev.map(p => p.id === id ? { ...p, [key]: val } : p));
  }

  const projetosFiltrados = DEFAULT_PROJETOS.filter(p => {
    const r = filtroRisco === "Todos" || p.risco === filtroRisco;
    const t = filtroTipo === "Todos"
      || (filtroTipo === "Condução"       && p.tipo === "Condução Operacional")
      || (filtroTipo === "Acompanhamento" && p.tipo === "Acompanhamento Estratégico");
    const e = filtroEstado === "Todos" || p.estado === filtroEstado;
    return r && t && e;
  });

  const pendenteCount = DEFAULT_PROJETOS.filter(p => p.pendente).length;

  if (loading) return (
    <div style={{ fontFamily: "Plus Jakarta Sans, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: ISG.textMuted }}>
      Carregando…
    </div>
  );

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif", background: ISG.bg, minHeight: "100vh", paddingBottom: 48 }}>

      {/* ── HEADER ─────────────────────────────── */}
      <div style={{ background: ISG.surface, borderBottom: `1px solid ${ISG.border}`, padding: "24px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>

          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: ISG.text, letterSpacing: -0.5 }}>
              Dash Lisa{" "}
              <span style={{ color: ISG.orange }}>&lt;&gt;</span>
              {" "}Dani
            </h1>
            <p style={{ margin: "5px 0 0", fontSize: 12, color: ISG.textMuted }}>Semana {semana}</p>
          </div>

          <div style={{ flex: 1, maxWidth: 420, background: ISG.orange100, border: `1px solid ${ISG.orange200}`, borderRadius: 14, padding: "14px 18px" }}>
            <div style={{ fontSize: 10, color: ISG.orange, fontWeight: 800, letterSpacing: 1.2, marginBottom: 6 }}>CONTEXTO DA SEMANA</div>
            {editMode ? (
              <>
                <textarea value={contexto} onChange={e => setContexto(e.target.value)} rows={3}
                  style={{ width: "100%", border: `1px solid ${ISG.orange200}`, borderRadius: 8, padding: "8px 10px", fontSize: 12, color: ISG.text, background: "#fff", resize: "none", outline: "none", lineHeight: 1.6, boxSizing: "border-box" }} />
                <input value={semana} onChange={e => setSemana(e.target.value)} placeholder="Ex: 12/05 – 16/05"
                  style={{ marginTop: 8, width: "100%", border: `1px solid ${ISG.orange200}`, borderRadius: 8, padding: "6px 10px", fontSize: 12, color: ISG.text, background: "#fff", outline: "none", boxSizing: "border-box" }} />
              </>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: ISG.textMid, lineHeight: 1.6 }}>{contexto}</p>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            {editMode ? (
              <>
                <button onClick={salvar} style={{ background: ISG.orange, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                  Salvar alterações
                </button>
                <button onClick={() => setEditMode(false)} style={{ background: "transparent", color: ISG.textMuted, border: `1px solid ${ISG.border}`, borderRadius: 10, padding: "8px 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                  Cancelar
                </button>
              </>
            ) : (
              <button onClick={() => setEditMode(true)} style={{ background: ISG.purple100, color: ISG.purple, border: `1.5px solid ${ISG.purple200}`, borderRadius: 10, padding: "10px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                ✏️ Editar dashboard
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "28px 36px", display: "flex", flexDirection: "column", gap: 32 }}>

        {/* ── STATS ─────────────────────────────── */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <StatCard icon="⏳" value={pendenteCount}    label="Pendente validação Daniela" cor={ISG.warning} bg={ISG.warningBg} />
          <StatCard icon="🔴" value={DEFAULT_PROJETOS.filter(p => p.risco === "Alto").length}  label="Riscos altos"  cor={ISG.danger}  bg={ISG.dangerBg}  />
          <StatCard icon="🟡" value={DEFAULT_PROJETOS.filter(p => p.risco === "Médio").length} label="Riscos médios" cor={ISG.warning} bg={ISG.warningBg} />
          <StatCard icon="🎯" value={DEFAULT_REUNIOES.filter(e => e.prio === "Urgente").length} label="Urgentes" cor={ISG.orange} bg={ISG.orange100} />
        </div>

        {/* ── PRIORIDADES DA SEMANA ──────────────── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: ISG.text }}>🎯 Prioridades da Semana</h2>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: ISG.textMuted }}>{semana}</p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 14, background: ISG.surface, border: `1px solid ${ISG.border}`, borderRadius: 10, padding: "8px 16px" }}>
                {nivelConfig.map((n, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 22, height: 7, borderRadius: 99, background: n.cor }} />
                    <span style={{ fontSize: 11, color: ISG.textMuted }}>{n.label}</span>
                  </div>
                ))}
              </div>
              {editMode && (
                <button onClick={() => setPrioridades(p => [...p, { id: Date.now(), texto: "Nova prioridade…", nivel: 1, tipo: "Acompanhamento" }])}
                  style={{ background: ISG.orange, color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                  + Adicionar
                </button>
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {prioridades.map(item => (
              <PrioCard key={item.id} item={item} editMode={editMode}
                onUpdate={(k, v) => updatePrio(item.id, k, v)}
                onDelete={() => setPrioridades(p => p.filter(x => x.id !== item.id))} />
            ))}
          </div>
          {editMode && <p style={{ fontSize: 11, color: ISG.textMuted, margin: "10px 0 0" }}>Clique nos segmentos para ajustar o nível de esforço.</p>}
        </div>

        {/* ── PRATINHOS ─────────────────────────── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: ISG.text }}>🍽️ Pratinhos</h2>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              {/* Filtro por estado */}
              {["Todos", ...ESTADOS].map(v => (
                <FilterBtn key={v} label={v} active={filtroEstado === v} onClick={() => setFiltroEstado(v)} />
              ))}
              <div style={{ width: 1, background: ISG.border, margin: "0 4px", alignSelf: "stretch" }} />
              {/* Filtro por risco */}
              {["Todos","Alto","Médio","Baixo"].map(v => (
                <FilterBtn key={v} label={v === "Todos" ? "Todos os riscos" : `Risco ${v}`} active={filtroRisco === v} onClick={() => setFiltroRisco(v)} />
              ))}
              <div style={{ width: 1, background: ISG.border, margin: "0 4px", alignSelf: "stretch" }} />
              {/* Filtro por tipo */}
              {["Todos","Condução","Acompanhamento"].map(v => (
                <FilterBtn key={v} label={v === "Todos" ? "Todos os tipos" : v} active={filtroTipo === v} onClick={() => setFiltroTipo(v)} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {projetosFiltrados.length > 0 ? projetosFiltrados.map(p => (
              <ProjetoCard key={p.id} p={p} open={openProjeto === p.id}
                onToggle={() => setOpenProjeto(prev => prev === p.id ? null : p.id)} />
            )) : (
              <div style={{ textAlign: "center", color: ISG.textMuted, padding: "32px 0", fontSize: 14 }}>
                Nenhum projeto com esses filtros.
              </div>
            )}
          </div>
          <p style={{ fontSize: 11, color: ISG.textMuted, margin: "10px 0 0" }}>Clique em um projeto para ver observações executivas.</p>
        </div>

        {/* ── REUNIÕES E MATERIAIS ──────────────── */}
        <div>
          <h2 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 800, color: ISG.text }}>📅 Reuniões e materiais</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DEFAULT_REUNIOES.map(e => <ReuniaoRow key={e.id} e={e} />)}
          </div>
        </div>

      </div>
    </div>
  );
}
