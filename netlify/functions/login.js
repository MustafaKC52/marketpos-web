import crypto from 'crypto';

// Basit bir secret key (production'da env variable olmalı)
const JWT_SECRET = process.env.JWT_SECRET || 'marketpos-admin-secret-key-2026';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'marketpos123!';

// Çok basit JWT encode (production'da proper library kullan)
function encodeJWT(payload) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const body = { ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 * 7 };
  
  const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64url');
  const bodyEncoded = Buffer.from(JSON.stringify(body)).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${headerEncoded}.${bodyEncoded}`)
    .digest('base64url');
  
  return `${headerEncoded}.${bodyEncoded}.${signature}`;
}

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { username, password } = body;

    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Username ve password gereklidir' }),
      };
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = encodeJWT({ role: 'admin', user: username });
      
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          token: token,
          message: 'Giriş başarılı'
        }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Geçersiz kullanıcı adı veya şifre' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'İç sunucu hatası' }),
    };
  }
}
