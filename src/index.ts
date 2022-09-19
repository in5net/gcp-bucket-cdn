export interface Env {
  BUCKET_NAME: string;
}

export default {
  async fetch(
    { method, url }: Request,
    { BUCKET_NAME }: Env
  ): Promise<Response> {
    if (method !== 'GET')
      return new Response('Method not allowed', { status: 405 });
    return Response.redirect(
      `https://storage.googleapis.com/${BUCKET_NAME}${new URL(url).pathname}`
    );
  }
};
