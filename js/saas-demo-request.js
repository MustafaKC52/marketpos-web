/** MarketPOS — 3 adımlı demo talep formu */
(function () {
  "use strict";

  var WA_BASE = "https://wa.me/905510335916?text=";
  var TYPES = ["Market", "Kasap", "Manav", "Bakkal", "Diğer"];

  function init() {
    var form = document.getElementById("demoRequestForm");
    if (!form) return;

    var step = 1;
    var state = { businessType: "", phone: "" };
    var dots = form.querySelectorAll(".demo-step-dot");
    var panels = form.querySelectorAll(".demo-step-panel");
    var typeGrid = form.getElementById("demoTypeGrid");
    var phoneInput = form.getElementById("demoPhone");
    var backBtn = form.getElementById("demoBack");
    var nextBtn = form.getElementById("demoNext");
    var waBtn = form.getElementById("demoWhatsApp");
    var statusEl = form.getElementById("demoFormStatus");

    TYPES.forEach(function (t) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "demo-type-btn";
      btn.textContent = t;
      btn.dataset.type = t;
      btn.addEventListener("click", function () {
        typeGrid.querySelectorAll(".demo-type-btn").forEach(function (b) {
          b.classList.remove("selected");
        });
        btn.classList.add("selected");
        state.businessType = t;
        nextBtn.disabled = false;
      });
      typeGrid.appendChild(btn);
    });

    function showStep(n) {
      step = n;
      panels.forEach(function (p) {
        p.classList.toggle("active", Number(p.dataset.step) === n);
      });
      dots.forEach(function (d, i) {
        d.classList.remove("active", "done");
        if (i + 1 < n) d.classList.add("done");
        if (i + 1 === n) d.classList.add("active");
      });
      backBtn.hidden = n === 1;
      nextBtn.hidden = n === 3;
      if (n === 2) {
        nextBtn.disabled = !phoneInput.value.trim();
      }
      if (n === 1) {
        nextBtn.disabled = !state.businessType;
      }
    }

    phoneInput.addEventListener("input", function () {
      if (step === 2) nextBtn.disabled = phoneInput.value.trim().length < 10;
    });

    backBtn.addEventListener("click", function () {
      if (step > 1) showStep(step - 1);
    });

    nextBtn.addEventListener("click", function () {
      if (step === 1 && state.businessType) showStep(2);
      else if (step === 2) {
        state.phone = phoneInput.value.trim();
        if (state.phone.length < 10) return;
        var msg =
          "Merhaba MarketPOS,%0A%0ADemo talep ediyorum.%0Aİşletme türü: " +
          encodeURIComponent(state.businessType) +
          "%0ATelefon: " +
          encodeURIComponent(state.phone);
        waBtn.href = WA_BASE + msg;
        showStep(3);
        if (statusEl) {
          statusEl.textContent = "";
          statusEl.className = "form-status";
        }
      }
    });

    showStep(1);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
