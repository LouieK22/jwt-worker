import jose from 'node-jose'
import config from './config'

export const generateJWT = async () => {
	const iat = new Date().getTime() / 1000
	const payload = {
		...config.payload,
		iat: iat,
		exp: iat + 3600,
	}

	const signingKey = await jose.JWK.asKey(GCP_KEY.replace(/\\n/g, '\n'), 'pem')

	const sign = await jose.JWS.createSign(
		{ fields: { alg: config.algorithm, kid: config.privateKeyID } },
		signingKey,
	)
		.update(JSON.stringify(payload), 'utf8')
		.final()

	const signature = sign.signatures[0]
	return [signature.protected, sign.payload, signature.signature].join('.')
}
