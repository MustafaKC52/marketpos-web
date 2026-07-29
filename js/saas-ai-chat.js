/** MarketPOS — Sağ alt AI danışman sohbeti (mock veri, satış odaklı) */
(function () {
  "use strict";

  var RESPONSES = {
    "bugün ne yapmalıyım": {
      text:
        "3 ürününüz kritik stok seviyesinde (Süt 1L, Yumurta 30'lu, Ekmek).\nDün satışlarınız %12 arttı — iyi gidiyorsunuz.\nYoğurt için Cuma akşamı %15 indirim kampanyası başlatabilirsiniz.",
    },
    "kritik stok": {
      text:
        "Kritik stok listesi:\n• Süt 1L — 4 adet (2 gün yetecek)\n• Yumurta 30'lu — 6 koli\n• Domates — 8 kg\n• Ekmek — 12 adet\n\nSüt ve yumurtaya bugün sipariş önerilir.",
    },
    "en çok satan": {
      text:
        "Bu hafta en çok satan 5 ürün:\n1. Su 1.5L — 142 adet\n2. Ekmek — 98 adet\n3. Süt 1L — 76 adet\n4. Çay 1kg — 54 adet\n5. Yoğurt 1kg — 48 adet",
    },
    indir: {
      text:
        "Windows kurulumunu ücretsiz indirebilirsiniz. Kayıt sonrası 14 gün tüm özellikler açık.\n\nİndirmek için sayfadaki «MarketPOS'u İndir» butonunu kullanın — kurulum yaklaşık 10 dakika sürer.",
    },
    fiyat: {
      text:
        "MarketPOS yıllık lisans ile çalışır; bulut senkron ve AI analizler dahildir.\nGüncel fiyat için Fiyatlandırma sayfasına bakın veya WhatsApp'tan yazın.",
    },
    default: {
      text:
        "Örnek Market verilerinize göre: bugün tahmini ciro ₺42.800, dünkü satışın %8 üzerinde.\nStokta 3 kritik kalem var.\n\nMarketPOS'u denemek ister misiniz? «indir» yazın.",
    },
  };

  function normalize(q) {
    return String(q || "")
      .toLowerCase()
      .replace(/[?.!]/g, "")
      .trim();
  }

  function matchResponse(q) {
    var n = normalize(q);
    if (n.includes("indir") || n.includes("kurulum") || n.includes("dene")) return RESPONSES.indir;
    if (n.includes("fiyat") || n.includes("ucret") || n.includes("ücret") || n.includes("lisans")) return RESPONSES.fiyat;
    if (n.includes("bugün") || n.includes("ne yapmalı")) return RESPONSES["bugün ne yapmalıyım"];
    if (n.includes("kritik") || n.includes("stok")) return RESPONSES["kritik stok"];
    if (n.includes("çok satan") || n.includes("en çok")) return RESPONSES["en çok satan"];
    return RESPONSES.default;
  }

  function ensureWidget() {
    if (document.getElementById("aiFloatRoot")) return document.getElementById("aiFloatRoot");

    var root = document.createElement("div");
    root.className = "ai-float-root";
    root.id = "aiFloatRoot";
    root.innerHTML =
      '<div class="ai-float-panel" id="aiChatDemo" hidden aria-hidden="true">' +
      '  <div class="ai-float-panel-head">' +
      '    <span class="ai-float-title"><span class="dot-live"></span> AI İşletme Danışmanı</span>' +
      '    <button type="button" class="ai-float-close" id="aiFloatClose" aria-label="Sohbeti kapat">×</button>' +
      "  </div>" +
      '  <div class="ai-chat-messages" aria-live="polite"></div>' +
      '  <div class="ai-chat-suggestions">' +
      '    <button type="button" data-prompt="Bugün ne yapmalıyım?">Bugün ne yapmalıyım?</button>' +
      '    <button type="button" data-prompt="Kritik stok listesi">Kritik stok</button>' +
      '    <button type="button" data-prompt="MarketPOS indir">İndirme</button>' +
      "  </div>" +
      '  <div class="ai-chat-input-row">' +
      '    <input id="aiChatInput" type="text" placeholder="Sorunuzu yazın…" autocomplete="off" />' +
      '    <button type="button" id="aiChatSend">Gönder</button>' +
      "  </div>" +
      "</div>" +
      '<button type="button" class="ai-float-toggle" id="aiFloatToggle" aria-expanded="false" aria-controls="aiChatDemo">' +
      '  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 .55.9l3.45 1.38a1 1 0 0 0 .74 0L20 17.9a1 1 0 0 0 .55-.9v-2.3A7 7 0 0 0 12 2Zm0 2a5 5 0 0 1 3.5 8.5v1.35l-3.5 1.4-3.5-1.4V12.5A5 5 0 0 1 12 4Zm-1 5h2v2h-2V9Zm0-3h2v2h-2V6Z"/></svg>' +
      "  <span>AI Danışman</span>" +
      "</button>";

    document.body.appendChild(root);
    return root;
  }

  function init() {
    ensureWidget();

    var panel = document.getElementById("aiChatDemo");
    var toggle = document.getElementById("aiFloatToggle");
    var closeBtn = document.getElementById("aiFloatClose");
    if (!panel || !toggle) return;

    var messages = panel.querySelector(".ai-chat-messages");
    var input = panel.querySelector("#aiChatInput");
    var sendBtn = panel.querySelector("#aiChatSend");
    var suggestions = panel.querySelector(".ai-chat-suggestions");
    var greeted = false;

    function setOpen(open) {
      panel.hidden = !open;
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.classList.toggle("is-open", open);
      if (open) {
        if (!greeted && messages && !messages.childElementCount) {
          addBubble(
            "Merhaba! MarketPOS AI danışmanıyım. Stok, satış ve indirme hakkında sorabilirsiniz.",
            "ai",
          );
          greeted = true;
        }
        if (input) input.focus();
      }
    }

    function addBubble(text, role) {
      if (!messages) return;
      var el = document.createElement("div");
      el.className = "ai-chat-bubble " + role;
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    function reply(userText) {
      addBubble(userText, "user");
      if (input) input.value = "";
      if (sendBtn) sendBtn.disabled = true;
      setTimeout(function () {
        addBubble(matchResponse(userText).text, "ai");
        if (sendBtn) sendBtn.disabled = false;
        if (input) input.focus();
      }, 550);
    }

    toggle.addEventListener("click", function () {
      setOpen(panel.hidden);
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        setOpen(false);
      });
    }

    if (sendBtn && input) {
      sendBtn.addEventListener("click", function () {
        var v = input.value.trim();
        if (v) reply(v);
      });

      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          var v = input.value.trim();
          if (v) reply(v);
        }
      });
    }

    if (suggestions) {
      suggestions.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-prompt]");
        if (!btn) return;
        setOpen(true);
        reply(btn.getAttribute("data-prompt"));
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) setOpen(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
