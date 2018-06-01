# Doctor

## design goal

### file control
```js
const doctor = require('@sepalang/doctor')

doctor(require("path").resolve(__dirname, "../"),async ({ file, prompt })=>{
  await file
  .touch("./config/config.json")
  .query("JSON",async ({ getProperty, setProperty , write })=>{
    const shouldSetToken = await prompt(!getProperty("[domain.name].token") ? 'new token?' : "modify token?")
    if(shouldSetToken){
      const propertyValue = await prompt('please enter token');
      setProperty("[domain.name].token",propertyValue);
    }
    await write();
  })
})
.catch((e)=>{
  console.log(`exit`)
  process.exit(1)
})
```

### language control
```js
import { nodeDoctor, rubyDoctor } from '@sepalang/doctor'

(await ()=>{
  nodeDoctor
  .version("lts/*")
  .catch(async ()=>{
    await nodeDoctor.install("lts/*","nvm")
  })

  rubyDoctor
  .version("2.5.1")
  .catch(async ()=>{
    await rubyDoctor.install("2.5.1","rvm")
  })

  nodeDoctor(__dirname, async ({ npm, cd })=>{
    npm.isInstall().catch(async ({ run })=>{
      await run("npm install")
    })
    
    npm.isInstall("express").catch(async ({ run })=>{
      await run("npm install express")
    })
    
    
    cd("./subpackage",async ({ npm })=>{
      npm.isInstall().catch(async ({ run })=>{
        await run("npm install")
      })
    })
  })

  rubyDoctor(__dirname, async ({ gem })=>{
    gem.isInstall("rails").catch(async ({ gem })=>{
      await gem.install("rails")
    })
  })
  
}())
```