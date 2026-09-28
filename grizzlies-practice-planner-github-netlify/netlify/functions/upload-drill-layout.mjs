const SUPABASE_URL = 'https://mmlxdjsmamgdbhgghera.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_BokZ_qVE4MIweAqjA9lySA_LjJcWk3a';
const BUCKET = 'drill-layouts';
const TEAM_ID = '0077dfc7-6c26-4528-afb9-48993ebc2831';
const MAX_BYTES = 5 * 1024 * 1024;

export default async (request) => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }
  try {
    const auth = request.headers.get('authorization') || '';
    if (!auth.startsWith('Bearer ')) {
      return Response.json({ error: 'Missing cloud session' }, { status: 401 });
    }

    const body = await request.json();
    const path = String(body?.path || '');
    const data = String(body?.data || '');
    const requiredPrefix = `${TEAM_ID}/`;
    if (!path.startsWith(requiredPrefix) || !/\/layout-[a-z0-9-]+\.jpg$/i.test(path) || path.includes('..')) {
      return Response.json({ error: 'Invalid layout path' }, { status: 400 });
    }

    const match = data.match(/^data:image\/(?:jpeg|jpg);base64,(.+)$/i);
    if (!match) {
      return Response.json({ error: 'Layout must be a JPEG image' }, { status: 400 });
    }
    const bytes = Buffer.from(match[1], 'base64');
    if (!bytes.length || bytes.length > MAX_BYTES) {
      return Response.json({ error: 'Layout image is too large' }, { status: 413 });
    }

    const target = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`;
    const upstream = await fetch(target, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'apikey': SUPABASE_PUBLISHABLE_KEY,
        'Content-Type': 'image/jpeg',
        'x-upsert': 'false',
        'cache-control': '31536000'
      },
      body: bytes
    });

    if (!upstream.ok) {
      let detail = '';
      try { detail = await upstream.text(); } catch (_e) {}
      console.error('Supabase storage proxy upload failed', upstream.status, detail);
      return Response.json({ error: detail || `Cloud storage rejected the image (${upstream.status})` }, { status: upstream.status });
    }

    return Response.json({ ok: true, path });
  } catch (error) {
    console.error('Layout upload proxy error', error);
    return Response.json({ error: error?.message || 'Could not upload layout image' }, { status: 500 });
  }
};
