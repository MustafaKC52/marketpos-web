const loginButton = document.getElementById('loginBtn');
const loginStatus = document.getElementById('loginStatus');

function setLoginStatus(text) {
  loginStatus.textContent = text;
}

function hasAdminRole(user) {
  return Boolean(user?.app_metadata?.roles?.includes('admin'));
}

if (window.netlifyIdentity) {
  window.netlifyIdentity.on('init', (user) => {
    if (user && hasAdminRole(user)) {
      window.location.href = '/admin/';
      return;
    }

    if (user && !hasAdminRole(user)) {
      setLoginStatus('Bu hesap giriş yaptı ama admin yetkisi yok.');
    }
  });

  window.netlifyIdentity.on('login', (user) => {
    if (hasAdminRole(user)) {
      window.location.href = '/admin/';
      return;
    }

    setLoginStatus('Bu hesap admin rolüne sahip değil. Netlify panelinden rol ataman gerekiyor.');
    window.netlifyIdentity.close();
  });

  window.netlifyIdentity.on('error', (error) => {
    setLoginStatus(error?.message || 'Giriş sırasında bir hata oluştu.');
  });

  window.netlifyIdentity.init();
}

loginButton.addEventListener('click', () => {
  if (!window.netlifyIdentity) {
    setLoginStatus('Netlify Identity yüklenemedi.');
    return;
  }

  setLoginStatus('Giriş penceresi açılıyor...');
  window.netlifyIdentity.open('login');
});
