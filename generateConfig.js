const fs = require("fs")
const { resolve } = require("path")

const input = require("./gcp-auth.json")

const output = Object.assign({}, input)

delete output.private_key

const file = fs.createWriteStream(resolve(__dirname, "./src", "config.ts"))
file.write("/*\n\tAuto-generated file, private key stripped from GCP service account keyfile\n*/\nconst config = {\n")

for (const key in output) {
  if (Object.hasOwnProperty.call(output, key)) {
    const value = output[key];
    
    if (typeof value === "string") {
      file.write(`\t${key}: "${value}",\n`)
    }
  }
}

file.write("}\n\nexport = config")

file.end()