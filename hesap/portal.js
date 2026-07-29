/**
 * MarketPOS — Web müşteri hesabı (hesap.marketposs.com / www.marketposs.com/hesap)
 * Bearer oturum; POS ile aynı API, fakat clientChannel=web ile ayrı oturum kanalı.
 */
(function (global) {
  "use strict";

  var API_BASE = "https://api.marketposs.com";
  var STORAGE = {
    token: "marketpos:portal:token",
    storeId: "marketpos:portal:storeId",
    userName: "marketpos:portal:userName",
    userEmail: "marketpos:portal:userEmail",
    storeName: "marketpos:portal:storeName",
  };

  function read(key) {
    try {
      return localStorage.getItem(key) || "";
    } catch (_) {
      return "";
    }
  }

  function write(key, val) {
    try {
      if (val) localStorage.setItem(key, val);
      else localStorage.removeItem(key);
    } catch (_) {}
  }

  function getToken() {
    return read(STORAGE.token);
  }

  function getStoreId() {
    return read(STORAGE.storeId);
  }

  function getSession() {
    return {
      token: getToken(),
      storeId: getStoreId(),
      userName: read(STORAGE.userName),
      userEmail: read(STORAGE.userEmail),
      storeName: read(STORAGE.storeName),
    };
  }

  function saveSession(data) {
    write(STORAGE.token, data.token || "");
    write(STORAGE.storeId, (data.store && data.store.id) || data.storeId || "");
    write(STORAGE.userName, (data.user && data.user.name) || "");
    write(STORAGE.userEmail, (data.user && data.user.email) || "");
    write(
      STORAGE.storeName,
      (data.store && data.store.name) || data.storeName || "",
    );
  }

  function clearSession() {
    Object.keys(STORAGE).forEach(function (k) {
      write(STORAGE[k], "");
    });
  }

  function isLoggedIn() {
    return Boolean(getToken() && getStoreId());
  }

  async function apiFetch(path, opts) {
    opts = opts || {};
    var headers = { Accept: "application/json" };
    if (opts.json) headers["Content-Type"] = "application/json";
    if (opts.auth) {
      var token = getToken();
      if (!token) throw { status: 401, error: "Oturum bulunamadı." };
      headers.Authorization = "Bearer " + token;
    }
    var res = await fetch(API_BASE + path, {
      method: opts.method || "GET",
      headers: headers,
      body: opts.json ? JSON.stringify(opts.json) : undefined,
      cache: "no-store",
      credentials: "omit",
    });
    var body = {};
    try {
      body = await res.json();
    } catch (_) {}
    if (!res.ok) {
      if (res.status === 401 && (body.code === "SESSION_REVOKED" || body.message === "Yetkisiz")) {
        var currentToken = getToken();
        if (currentToken && headers.Authorization === "Bearer " + currentToken) {
          clearSession();
        }
      }
      throw {
        status: res.status,
        error: body.error || body.message || "İstek başarısız (" + res.status + ")",
        body: body,
      };
    }
    return body;
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(ms) {
    if (!ms) return "—";
    try {
      return new Intl.DateTimeFormat("tr-TR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(ms));
    } catch (_) {
      return "—";
    }
  }

  function formatDateShort(ms) {
    if (!ms) return "—";
    try {
      return new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(
        new Date(ms),
      );
    } catch (_) {
      return "—";
    }
  }

  function licensePhaseLabel(phase) {
    if (phase === "trial") return "Deneme";
    if (phase === "licensed") return "Lisanslı";
    if (phase === "expired") return "Süresi doldu";
    return phase || "—";
  }

  function licensePhaseClass(phase) {
    if (phase === "trial") return "portal-badge portal-badge-trial";
    if (phase === "licensed") return "portal-badge portal-badge-ok";
    if (phase === "expired") return "portal-badge portal-badge-warn";
    return "portal-badge";
  }

  function requireAuth() {
    if (!isLoggedIn()) {
      window.location.replace("giris.html?next=" + encodeURIComponent(window.location.pathname.split("/").pop() || "index.html"));
      return false;
    }
    return true;
  }

  function redirectIfAuthed() {
    if (isLoggedIn()) {
      window.location.replace("index.html");
      return true;
    }
    return false;
  }

  function logout() {
    clearSession();
    window.location.href = "giris.html";
  }

  var NAV = [
    { id: "index", href: "index.html", label: "Özet", icon: "◉" },
    { id: "profil", href: "profil.html", label: "Profil", icon: "👤" },
    { id: "magaza", href: "magaza.html", label: "Mağaza", icon: "🏪" },
    { id: "lisans", href: "lisans.html", label: "Lisans", icon: "🔑" },
    { id: "cihazlar", href: "cihazlar.html", label: "Cihazlar", icon: "💻" },
  ];

  function renderShell(activeId, title, mainHtml) {
    var session = getSession();
    var navHtml = NAV.map(function (item) {
      var cls = item.id === activeId ? "portal-nav-link active" : "portal-nav-link";
      return (
        '<a class="' +
        cls +
        '" href="' +
        item.href +
        '"><span class="portal-nav-ico" aria-hidden="true">' +
        item.icon +
        "</span>" +
        escapeHtml(item.label) +
        "</a>"
      );
    }).join("");

    document.title = (title ? title + " — " : "") + "Hesabım — MarketPOS";
    document.body.innerHTML =
      '<div class="bg-aurora" aria-hidden="true"><span class="aurora a1"></span><span class="aurora a2"></span></div>' +
      '<div class="bg-grid" aria-hidden="true"></div>' +
      '<div class="portal-layout">' +
      '<aside class="portal-sidebar" aria-label="Hesap menüsü">' +
      '<a href="../index.html" class="portal-brand">' +
      '<img src="../assets/logo-lockup.png?v=20260530" alt="MarketPOS" width="160" height="24" />' +
      "</a>" +
      '<p class="portal-sidebar-user">' +
      escapeHtml(session.storeName || "Mağazam") +
      "</p>" +
      '<p class="portal-sidebar-email">' +
      escapeHtml(session.userEmail) +
      "</p>" +
      '<nav class="portal-nav">' +
      navHtml +
      "</nav>" +
      '<div class="portal-sidebar-foot">' +
      '<a class="portal-nav-link" href="../index.html#download">⬇ Uygulamayı indir</a>' +
      '<button type="button" class="portal-nav-link portal-logout-btn" id="portalLogout">Çıkış yap</button>' +
      "</div>" +
      "</aside>" +
      '<main class="portal-main">' +
      '<header class="portal-topbar">' +
      "<h1>" +
      escapeHtml(title) +
      "</h1>" +
      '<a class="btn btn-ghost btn-sm" href="../index.html">Ana site</a>' +
      "</header>" +
      '<div class="portal-content">' +
      mainHtml +
      "</div>" +
      "</main>" +
      "</div>";

    var logoutBtn = document.getElementById("portalLogout");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
  }

  function showAlert(el, msg, type) {
    if (!el) return;
    el.hidden = false;
    el.className = "portal-alert portal-alert-" + (type || "error");
    el.textContent = msg;
  }

  function hideAlert(el) {
    if (!el) return;
    el.hidden = true;
  }

  function setLoading(btn, loading, label) {
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.dataset.prevLabel = btn.textContent;
      btn.textContent = label || "Bekleyin…";
    } else if (btn.dataset.prevLabel) {
      btn.textContent = btn.dataset.prevLabel;
    }
  }

  async function login(email, password) {
    return apiFetch("/api/auth/login", {
      method: "POST",
      json: { email: email.trim(), password: password, clientChannel: "web" },
    });
  }

  async function register(payload) {
    return apiFetch("/api/auth/register", {
      method: "POST",
      json: Object.assign({}, payload, { clientChannel: "web" }),
    });
  }

  async function fetchMe() {
    return apiFetch("/api/auth/me", { auth: true });
  }

  async function fetchLicense() {
    return apiFetch("/api/auth/license", { auth: true });
  }

  async function fetchStore(storeId) {
    return apiFetch("/api/stores/" + encodeURIComponent(storeId), { auth: true });
  }

  async function updateStore(storeId, payload) {
    return apiFetch("/api/stores/" + encodeURIComponent(storeId), {
      method: "PUT",
      auth: true,
      json: payload,
    });
  }

  async function updateUser(payload) {
    return apiFetch("/api/auth/update-user", {
      method: "PUT",
      auth: true,
      json: payload,
    });
  }

  async function fetchCloudStats(storeId) {
    return apiFetch("/api/stores/" + encodeURIComponent(storeId) + "/cloud-stats", {
      auth: true,
    });
  }

  async function fetchDevices(storeId) {
    return apiFetch("/api/stores/" + encodeURIComponent(storeId) + "/devices", {
      auth: true,
    });
  }

  async function setMainDevice(storeId, deviceId) {
    return apiFetch("/api/stores/" + encodeURIComponent(storeId) + "/devices/main", {
      method: "PUT",
      auth: true,
      json: { deviceId: deviceId },
    });
  }

  async function blockDevice(storeId, deviceId) {
    return apiFetch(
      "/api/stores/" +
        encodeURIComponent(storeId) +
        "/devices/" +
        encodeURIComponent(deviceId) +
        "/block",
      { method: "PUT", auth: true, json: {} },
    );
  }

  async function unblockDevice(storeId, deviceId) {
    return apiFetch(
      "/api/stores/" +
        encodeURIComponent(storeId) +
        "/devices/" +
        encodeURIComponent(deviceId) +
        "/unblock",
      { method: "PUT", auth: true, json: {} },
    );
  }

  async function removeDevice(storeId, deviceId) {
    return apiFetch(
      "/api/stores/" +
        encodeURIComponent(storeId) +
        "/devices/" +
        encodeURIComponent(deviceId),
      { method: "DELETE", auth: true },
    );
  }

  async function fetchPublicConfig() {
    return apiFetch("/api/public-config");
  }

  async function forgotPassword(payload) {
    return apiFetch("/api/auth/forgot-password", {
      method: "POST",
      json: payload,
    });
  }

  async function forgotPasswordHint(email) {
    return apiFetch("/api/auth/forgot-password/hint", {
      method: "POST",
      json: { email: String(email || "").trim() },
    });
  }

  async function forgotPasswordVerify(payload) {
    return apiFetch("/api/auth/forgot-password/verify", {
      method: "POST",
      json: payload,
    });
  }

  async function forgotPasswordComplete(payload) {
    return apiFetch("/api/auth/forgot-password/complete", {
      method: "POST",
      json: payload,
    });
  }

  async function sendPhoneVerifyCode() {
    return apiFetch("/api/auth/phone/send-code", {
      method: "POST",
      auth: true,
      json: {},
    });
  }

  async function verifyPhoneCode(code) {
    return apiFetch("/api/auth/phone/verify-code", {
      method: "POST",
      auth: true,
      json: { code: String(code || "").trim() },
    });
  }

  /** Mağaza telefon doğrulama paneli (magaza.html vb.) */
  function mountPhoneVerifyPanel(container, opts) {
    opts = opts || {};
    var phoneVerified = Boolean(opts.phoneVerified);
    var disabled = Boolean(opts.disabled);
    var onVerified = typeof opts.onVerified === "function" ? opts.onVerified : function () {};

    if (!container) return;

    function render() {
      if (phoneVerified) {
        container.className = "portal-phone-verify is-verified";
        container.innerHTML = "✓ Telefon numaranız doğrulandı.";
        return;
      }

      container.className = "portal-phone-verify";
      container.innerHTML =
        "<p>Telefon numaranızı doğrulamak için 6 haneli kod <strong>kayıtlı e-posta adresinize</strong> gönderilir.</p>" +
        '<div class="portal-phone-verify-actions">' +
        '<button type="button" class="btn btn-ghost btn-sm" id="phoneVerifySend">Doğrulama kodu gönder</button>' +
        "</div>" +
        '<div class="portal-phone-verify-code" id="phoneVerifyCodeRow" hidden>' +
        '<input id="phoneVerifyCode" inputmode="numeric" maxlength="6" placeholder="6 haneli kod" />' +
        '<button type="button" class="btn btn-primary btn-sm" id="phoneVerifyBtn">Doğrula</button>' +
        "</div>";

      var sendBtn = container.querySelector("#phoneVerifySend");
      var codeRow = container.querySelector("#phoneVerifyCodeRow");
      var codeInput = container.querySelector("#phoneVerifyCode");
      var verifyBtn = container.querySelector("#phoneVerifyBtn");

      sendBtn.addEventListener("click", async function () {
        if (disabled) return;
        sendBtn.disabled = true;
        sendBtn.textContent = "Gönderiliyor…";
        try {
          var result = await sendPhoneVerifyCode();
          if (result.alreadyVerified) {
            phoneVerified = true;
            onVerified();
            render();
            return;
          }
          codeRow.hidden = false;
          sendBtn.textContent = "Kodu tekrar gönder";
        } catch (err) {
          alert(err.error || "Kod gönderilemedi.");
          sendBtn.textContent = "Doğrulama kodu gönder";
        } finally {
          sendBtn.disabled = disabled;
        }
      });

      verifyBtn.addEventListener("click", async function () {
        if (disabled || !codeInput.value.trim()) return;
        verifyBtn.disabled = true;
        verifyBtn.textContent = "Doğrulanıyor…";
        try {
          await verifyPhoneCode(codeInput.value.trim());
          phoneVerified = true;
          onVerified();
          render();
        } catch (err) {
          alert(err.error || "Doğrulama başarısız.");
        } finally {
          verifyBtn.disabled = false;
          verifyBtn.textContent = "Doğrula";
        }
      });
    }

    render();
    return {
      setVerified: function (v) {
        phoneVerified = Boolean(v);
        render();
      },
    };
  }

  var EYE_OPEN =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>';
  var EYE_CLOSED =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>';

  function enhancePasswordFields(root) {
    var scope = root || document;
    scope.querySelectorAll('input[type="password"]').forEach(function (input) {
      if (input.dataset.passwordEnhanced === "1") return;
      if (input.closest(".portal-password-wrap")) return;
      input.dataset.passwordEnhanced = "1";
      var wrap = document.createElement("div");
      wrap.className = "portal-password-wrap";
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "portal-password-toggle";
      btn.setAttribute("aria-label", "Şifreyi göster");
      btn.innerHTML = EYE_OPEN;
      btn.addEventListener("click", function () {
        var visible = input.type === "text";
        input.type = visible ? "password" : "text";
        btn.innerHTML = visible ? EYE_OPEN : EYE_CLOSED;
        btn.setAttribute("aria-label", visible ? "Şifreyi göster" : "Şifreyi gizle");
      });
      wrap.appendChild(btn);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      enhancePasswordFields(document);
    });
  } else {
    enhancePasswordFields(document);
  }

  global.MarketPortal = {
    API_BASE: API_BASE,
    getToken: getToken,
    getStoreId: getStoreId,
    getSession: getSession,
    saveSession: saveSession,
    clearSession: clearSession,
    isLoggedIn: isLoggedIn,
    apiFetch: apiFetch,
    escapeHtml: escapeHtml,
    formatDate: formatDate,
    formatDateShort: formatDateShort,
    licensePhaseLabel: licensePhaseLabel,
    licensePhaseClass: licensePhaseClass,
    requireAuth: requireAuth,
    redirectIfAuthed: redirectIfAuthed,
    logout: logout,
    renderShell: renderShell,
    showAlert: showAlert,
    hideAlert: hideAlert,
    setLoading: setLoading,
    login: login,
    register: register,
    fetchMe: fetchMe,
    fetchLicense: fetchLicense,
    fetchStore: fetchStore,
    updateStore: updateStore,
    updateUser: updateUser,
    fetchCloudStats: fetchCloudStats,
    fetchDevices: fetchDevices,
    setMainDevice: setMainDevice,
    blockDevice: blockDevice,
    unblockDevice: unblockDevice,
    removeDevice: removeDevice,
    fetchPublicConfig: fetchPublicConfig,
    forgotPassword: forgotPassword,
    forgotPasswordHint: forgotPasswordHint,
    forgotPasswordVerify: forgotPasswordVerify,
    forgotPasswordComplete: forgotPasswordComplete,
    sendPhoneVerifyCode: sendPhoneVerifyCode,
    verifyPhoneCode: verifyPhoneCode,
    mountPhoneVerifyPanel: mountPhoneVerifyPanel,
    enhancePasswordFields: enhancePasswordFields,
  };
})(window);
