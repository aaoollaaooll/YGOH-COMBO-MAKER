// Configuración global para Yu-Gi-Oh! Combo Maker

// Reporte de problemas / sugerencias
// Abre directamente la página de Issues del repositorio
window.REPORT_CONFIG = {
  github: { owner: "aaoollaaooll", repo: "YGOH-COMBO-MAKER" }
};

// Ocultar botones por texto (minúsculas)
window.HIDE_BUTTONS_BY_TEXT = [];

// Ocultar botones por id
window.HIDE_BUTTON_IDS = [];
// ====== OVERRIDES DE TEXTO SIN TOCAR index.html ======
(function () {
  // 1) Si tu app usa claves i18n como data-i18n-key="finalBoardTitle",
  //    esto lo reemplaza de forma directa.
  const KEY_OVERRIDES = {
    finalBoardTitle: "End Board",  // <- cambia aquí si quieres otro texto
  };

  // 2) Reemplazos por TEXTO visible (por si no existen data-keys)
  //    Puedes añadir más entradas si lo necesitas.
  const TEXT_OVERRIDES = [
    { from: /^final board$/i, to: "End Board" },
    { from: /^tablero final$/i, to: "End Board" },
  ];

  // Qué nodos examinamos (títulos, botones, etc.)
  const TARGETS =
    'h1,h2,h3,h4,h5,h6,[role="heading"],.section-title,.panel-title,.header-title,.title,label,.tab-title,.section-header,button,.btn';

  const norm = (s) => (s || "").replace(/[\s\u00A0]+/g, " ").trim();

  function applyTextOverrides(root = document) {
    // 2.a) Por data-i18n-key (si existe)
    root.querySelectorAll("[data-i18n-key]").forEach((el) => {
      const k = el.getAttribute("data-i18n-key");
      if (k && KEY_OVERRIDES[k]) el.textContent = KEY_OVERRIDES[k];
    });

    // 2.b) Por texto visible
    root.querySelectorAll(TARGETS).forEach((el) => {
      const txt = norm(el.textContent);
      for (const rule of TEXT_OVERRIDES) {
        if (rule.from.test(txt)) {
          el.textContent = txt.replace(rule.from, rule.to);
          break;
        }
      }
    });
  }

  function start() {
    applyTextOverrides();
    // Observamos cambios por si React repinta
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes &&
          m.addedNodes.forEach((n) => {
            if (n.nodeType === 1) applyTextOverrides(n);
          });
        if (m.type === "characterData") applyTextOverrides(document);
      }
    });
    try {
      mo.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    } catch (_) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
