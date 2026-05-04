// functions/api/fetch-web.js
export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');   // 前端传入要抓取的网页地址
    
    if (!targetUrl) {
        return new Response('缺少 url 参数', { status: 400 });
    }
    
    try {
        // 后端去获取目标网页（没有跨域限制）
        const res = await fetch(targetUrl, {
            headers: { 'User-Agent': 'Cloudflare-Worker' }  // 有些网站需要 UA
        });
        const html = await res.text();
        
        // 返回 HTML 内容，并允许跨域
        return new Response(html, {
            status: res.status,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err) {
        return new Response(`抓取失败: ${err.message}`, { status: 502 });
    }
}

// 处理预检请求
export const onRequestOptions = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': '*'
        }
    });
};