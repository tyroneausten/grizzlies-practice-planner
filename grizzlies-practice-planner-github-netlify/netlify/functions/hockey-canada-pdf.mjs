const ALLOWED_HOST = 'cdn.hockeycanada.ca';

export default async (request) => {
  try {
    const requestUrl = new URL(request.url);
    const raw = requestUrl.searchParams.get('url');
    if (!raw) return new Response('Missing url', { status: 400 });
    const target = new URL(raw);
    if (target.protocol !== 'https:' || target.hostname !== ALLOWED_HOST || !target.pathname.toLowerCase().endsWith('.pdf')) {
      return new Response('URL not allowed', { status: 403 });
    }
    const upstream = await fetch(target.toString(), {
      headers: { 'User-Agent': 'GrizzliesPracticePlanner/1.0' }
    });
    if (!upstream.ok) return new Response('Upstream request failed', { status: upstream.status });
    const body = await upstream.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response('Could not retrieve PDF', { status: 500 });
  }
};
