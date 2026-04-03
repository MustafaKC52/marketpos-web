const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginStatus = document.getElementById('loginStatus');

const JWT_TOKEN_KEY = 'marketpos-admin-token';

function setLoginStatus(text, isError = false) {
  loginStatus.textContent = text;
  loginStatus.className = isError ? 'login-status error' : 'login-status';
}

function saveToken(token) {
  localStorage.setItem(JWT_TOKEN_KEY, token);
}

function getToken() {
  return localStorage.getItem(JWT_TOKEN_KEY);
}

function isTokenValid(token) {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Token'ın validity'sini check et (basitçe parse et)
    const body = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    return body.exp > now;
  } catch {
    return false;
  }
}

// Sayfa yüklendiğinde token varsa doğrudan admin paneline yönlendir
window.addEventListener('DOMContentLoaded', () => {
  const existingToken = getToken();
  if (existingToken && isTokenValid(existingToken)) {
    window.location.href = '/admin/';
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  
  if (!username || !password) {
    setLoginStatus('Lütfen kullanıcı adı ve şifre girin', true);
    return;
  }
  
  setLoginStatus('Giriş yapılıyor...');
  
  try {
    const response = await fetch('/.netlify/functions/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      saveToken(data.token);
      setLoginStatus('Giriş başarılı! Yönlendiriliyorsunuz...');
      setTimeout(() => {
        window.location.href = '/admin/';
      }, 500);
    } else {
      setLoginStatus(data.error || 'Giriş başarısız oldu', true);
      passwordInput.value = '';
    }
  } catch (error) {
    setLoginStatus('Bağlantı hatası: ' + error.message, true);
  }
});
