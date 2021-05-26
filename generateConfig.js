const fs = require("fs")
const { resolve } = require("path")
const { inspect } = require("util")
const https = require("https")
const yaml = require("yaml-js")

function getFirestoreApiDefinition() {
  return new Promise((resolve, reject) => {
    let data = ""

    const req = https.get("https://raw.githubusercontent.com/googleapis/googleapis/master/google/firestore/firestore_v1.yaml", (res) => {
      res.on("data", chunk => data+=chunk)
      res.on("end", () => {
        resolve(yaml.load(data))
      })
    })
  })
}

async function main() {
  const serviceDefinition = await getFirestoreApiDefinition()
  const serviceAccountConfig = require("./gcp-auth.json")

  const payload = {
    aud: `https://${serviceDefinition.name}/${serviceDefinition.apis[0].name}`,
    iss: serviceAccountConfig.client_email,
    sub: serviceAccountConfig.client_email,
  }
  const privateKeyID = serviceAccountConfig.private_key_id
  const algorithm = "RS256"
  const url = `https://firestore.googleapis.com/v1beta1/projects/${serviceAccountConfig.project_id}/databases/(default)/documents`

  const output = {
    payload,
    privateKeyID,
    algorithm,
    url,
  }
  
  const file = fs.createWriteStream(resolve(__dirname, "./src", "config.ts"))
  file.write("/*\n\tAuto-generated file, private key stripped from GCP service account keyfile\n*/\n\nconst config = {\n")
  
  for (const key in output) {
    if (Object.hasOwnProperty.call(output, key)) {
      const value = output[key];
      
      if (typeof value === "string") {
        file.write(`\t${key}: "${value}",\n`)
      } else if (typeof value === "object") {
        file.write(`\t${key}: ${inspect(value, false, null).replace(/^/gm, '\t')},\n`)
      }
    }
  }
  
  file.write("}\n\nexport = config")
  
  file.end()
}

main()