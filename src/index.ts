export interface Env {
  BUCKET_NAME: string;
}

export default {
  async fetch(request: Request, { BUCKET_NAME }: Env): Promise<Response> {
    if (request.method !== 'GET')
      return new Response('Method not allowed', { status: 405 });

    const url = new URL(request.url);
    const cache = caches.default;
    let response = await cache.match(request);

    if (!response) {
      const BUCKET_URL = `https://storage.googleapis.com/${BUCKET_NAME}`;
      response = await fetch(`${BUCKET_URL}${url.pathname}`);
      const headers = { 'cache-control': 'public, max-age=86400' };
      response = new Response(response.body, { ...response, headers });
      await cache.put(request, response.clone());
    }

    if (response.status > 399)
      response = new Response(response.statusText, { status: response.status });

    return response;
  }
};
