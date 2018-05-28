# Doctor

## design goal

```js
import { nodeDoctor, rubyDoctor } from doctor
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