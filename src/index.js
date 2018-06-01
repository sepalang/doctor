import connectFile from './connect-file'
import { newPromise as _promise } from 'pado/.src/modules/promise';

export default function(rootPath, asyncFn){
  const file = {
    open:async (path,charset='utf-8')=>{
      return await connectFile(path,charset).open();
    },
    touch:async (path,charset='utf-8')=>{
      return await connectFile(path,charset)
      .open()
      .catch(()=>file.write(path,"",charset='utf-8'));
    },
    write:async (path,content,charset='utf-8')=>{
      const connectedFile = await connectFile(path,charset).open();
      return await connectedFile.setContent(content).write();
    }
  };
  
  asyncFn({
    file
  });
}