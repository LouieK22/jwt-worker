# jwt-worker

Cloudflare Worker to generate JSON Web Tokens. Useful for environments without performant crypto implementations (Roblox). Specifically adapted for Firestore at the moment. 

## Setup
1. Configure wrangler.toml according to the [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/get-started/guide#7-configure-your-project-for-deployment)
2. Grab yourself a service account keyfile from GCP IAM
3. Name the keyfile `gcp-auth.json` and put it in the root directory
4. Run `node ./generateConfig.js`
5. Run `wrangler publish` to deploy and create the worker on the Cloudflare site, it still won't be functional however
6. Copy the `private_key` field from the keyfile into an **encrypted** Worker Environment Variable called `GCP_KEY`
7. Generate a long random string to use as an authentication token, copy into an **encrypted** Worker Environment Variable called `AUTH_TOKEN`
8. The Worker is up and running! Just make a simple GET request to get a fresh GCP JWT. Note: the request must contain a `token` header containing the authentication token set in step 7