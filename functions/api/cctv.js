// functions/api/cctv.js
export async function onRequest(context) {
    const { request } = context;
    
    // 目标 API 基础地址
    const TARGET_BASE = 'https://vdn.apps.cntv.cn/api/getHttpVideoInfo.do';
    
    // 获取前端请求中的查询参数（如 ?pid=xxx&tsp=xxx ...）
    const url = new URL(request.url);
    const queryString = url.search; // 包含 '?' 及之后所有参数
    
    // 构造完整的目标 URL
    const targetUrl = `${TARGET_BASE}${queryString}`;
    
    try {
        // 后端发起请求，无跨域问题
        const apiResponse = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Cloudflare-Worker'  // 模拟浏览器标识，防止被拒
            }
        });
        
        const data = await apiResponse.text();
        
        // 返回给前端，并添加 CORS 头
        return new Response(data, {
            status: apiResponse.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Cache-Control': 'public, max-age=300'  // 可选：缓存5分钟
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: '代理请求失败' }), {
            status: 502,
            headers: { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

// 处理预检请求（OPTIONS）
export const onRequestOptions = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '86400'
        }
    });
};