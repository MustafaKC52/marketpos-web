/** MarketPOS — Ana sayfa AI sohbet demosu (mock veri) */
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
    "satış düşüş": {
      text:
        "Satışı düşen ürünler (son 7 gün):\n• Cips aile boy — %35 düşüş\n• Kola 1L — %18 düşüş\n• Bisküvi — %12 düşüş\n\nCips için raf önü yerleşim veya paket kampanyası deneyin.",
    },
    default: {
      text:
        "Örnek Market verilerinize göre: bugün tahmini ciro ₺42.800, dünkü satışın %8 üzerinde.\nStokta 3 kritik kalem var. Detay için «kritik stok» veya «bugün ne yapmalıyım» yazabilirsiniz.",
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
    if (n.includes("bugün") || n.includes("ne yapmalı")) return RESPONSES["bugün ne yapmalıyım"];
    if (n.includes("kritik") || n.includes("stok")) return RESPONSES["kritik stok"];
    if (n.includes("çok satan") || n.includes("en çok")) return RESPONSES["en çok satan"];
    if (n.includes("düş") || n.includes("dusus")) return RESPONSES["satış düşüş"];
    return RESPONSES.default;
  }

  function init() {
    var root = document.getElementById("aiChatDemo");
    if (!root) return;

    var messages = root.querySelector(".ai-chat-messages");
    var input = root.querySelector("#aiChatInput");
    var sendBtn = root.querySelector("#aiChatSend");
    var suggestions = root.querySelector(".ai-chat-suggestions");

    function addBubble(text, role) {
      var el = document.createElement("div");
      el.className = "ai-chat-bubble " + role;
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
    }

    function reply(userText) {
      addBubble(userText, "user");
      input.value = "";
      sendBtn.disabled = true;
      setTimeout(function () {
        var res = matchResponse(userText);
        addBubble(res.text, "ai");
        sendBtn.disabled = false;
        input.focus();
      }, 600);
    }

    addBubble(
      "Merhaba! Örnek Market için AI işletme danışmanıyım. «Bugün ne yapmalıyım?» diye sorabilirsiniz.",
      "ai",
    );

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

    if (suggestions) {
      suggestions.addEventListener("click", function (e) {
        var btn = e.target.closest("button[data-prompt]");
        if (!btn) return;
        reply(btn.getAttribute("data-prompt"));
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
