const fs = require('fs')
var text = `GOOGLE_SERVICE_ACCOUNT_EMAIL=${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}\GOOGLE_PRIVATE_KEY=${process.env.GOOGLE_PRIVATE_KEY}\n`
fs.writeFileSync('./.env', )