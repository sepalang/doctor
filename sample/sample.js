import doctor from '../src';

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
});

export default doctor;
