// functions/api/fetch-web.js

export async function onRequest(context) {
  const { request } = context;

  // 只允许 POST
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { 'Allow': 'POST', 'Access-Control-Allow-Origin': 'https://www.magicsong.cn.mt/' }
    });
  }

  // 解析请求体
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response('请求体需为合法 JSON', {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': 'https://www.magicsong.cn.mt/' }
    });
  }

  const targetUrl = body.url;
  if (!targetUrl) {
    return new Response('缺少 url 字段', {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': 'https://www.magicsong.cn.mt/' }
    });
  }

  // 获取客户端自定义 headers，默认为空对象
  const customHeaders = body.headers || {};

  // 合并默认头（可被自定义覆盖）
  const fetchHeaders = {
    'User-Agent': 'Cloudflare-Worker',
    ...customHeaders
  };

  try {
    const res = await fetch(targetUrl, { headers: fetchHeaders });
    const html = await res.text();

    return new Response(html, {
      status: res.status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': 'https://www.magicsong.cn.mt/'
      }
    });
  } catch (err) {
    return new Response(`抓取失败: ${err.message}`, {
      status: 502,
      headers: { 'Access-Control-Allow-Origin': 'https://www.magicsong.cn.mt/' }
    });
  }
}

// 处理 CORS 预检请求
export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://www.magicsong.cn.mt/',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, *'  // 允许所有自定义头
    }
  });
};