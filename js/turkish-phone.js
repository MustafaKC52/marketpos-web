/**
 * Türkiye cep telefonu — +90 sabit, görünüm: 0551 033 59 16
 */
(function (global) {
  "use strict";

  function normalizeTurkishPhoneDigits(raw) {
    var digits = String(raw || "").replace(/\D/g, "");
    if (digits.indexOf("90") === 0) {
      digits = "0" + digits.slice(2);
    } else if (digits.length > 0 && digits.indexOf("0") !== 0) {
      digits = "0" + digits;
    }
    return digits.slice(0, 11);
  }

  function formatTurkishPhoneDisplay(raw) {
    var d = normalizeTurkishPhoneDigits(raw);
    if (!d) return "";
    var parts = [];
    if (d.length > 0) parts.push(d.slice(0, 4));
    if (d.length > 4) parts.push(d.slice(4, 7));
    if (d.length > 7) parts.push(d.slice(7, 9));
    if (d.length > 9) parts.push(d.slice(9, 11));
    return parts.join(" ");
  }

  function validateTurkishMobilePhone(raw) {
    var d = normalizeTurkishPhoneDigits(raw);
    if (d.length !== 11) {
      return "Telefon numarası 11 haneli olmalıdır (05XX XXX XX XX).";
    }
    if (d.indexOf("05") !== 0) {
      return "Geçerli bir cep telefonu numarası girin (05 ile başlamalı).";
    }
    return null;
  }

  function formatTurkishPhoneForStorage(raw) {
    return formatTurkishPhoneDisplay(raw);
  }

  function parseStoredTurkishPhone(stored) {
    if (!stored || !String(stored).trim()) return "";
    return formatTurkishPhoneDisplay(stored);
  }

  /** Mevcut input'u +90 önekli alana dönüştürür; input referansını döner. */
  function wrapPhoneInput(input) {
    if (!input || input.dataset.phoneWrapped === "1") return input;

    input.dataset.phoneWrapped = "1";
    input.type = "tel";
    input.inputMode = "tel";
    input.autocomplete = "tel-national";
    input.placeholder = input.placeholder || "0551 033 59 16";
    input.classList.add("portal-phone-input");

    var wrap = document.createElement("div");
    wrap.className = "portal-phone-wrap";
    input.parentNode.insertBefore(wrap, input);

    var prefix = document.createElement("span");
    prefix.className = "portal-phone-prefix";
    prefix.setAttribute("aria-hidden", "true");
    prefix.textContent = "+90";

    wrap.appendChild(prefix);
    wrap.appendChild(input);

    if (input.value) {
      input.value = parseStoredTurkishPhone(input.value);
    }

    input.addEventListener("input", function () {
      var formatted = formatTurkishPhoneDisplay(input.value);
      if (input.value !== formatted) input.value = formatted;
    });

    return input;
  }

  function getPhoneInputValue(input) {
    return input ? input.value.trim() : "";
  }

  global.TurkishPhone = {
    normalizeTurkishPhoneDigits: normalizeTurkishPhoneDigits,
    formatTurkishPhoneDisplay: formatTurkishPhoneDisplay,
    validateTurkishMobilePhone: validateTurkishMobilePhone,
    formatTurkishPhoneForStorage: formatTurkishPhoneForStorage,
    parseStoredTurkishPhone: parseStoredTurkishPhone,
    wrapPhoneInput: wrapPhoneInput,
    getPhoneInputValue: getPhoneInputValue,
  };
})(window);
