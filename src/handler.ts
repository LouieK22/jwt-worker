import { generateJWT } from './jwt'

export async function handleRequest(request: Request): Promise<Response> {
	const authHeader = request.headers.get('token')
	if (!authHeader || authHeader !== AUTH_TOKEN) {
		return new Response('401: unauthorized', { status: 401 })
	}

	const jwt = await generateJWT()

	return new Response(jwt)
}
