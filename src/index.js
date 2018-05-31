import connectFile from './connect-file'
import { newPromise as _promise } from 'pado/.src/modules/promise';

const doctor = function(rootPath, asyncFn){
  const file = {
    parseJSON:(path)=>_promise((resolve,reject)=>{
      
    }),
    write:(path,content)=>_promise((resolve,reject)=>{
      
    })
  };
  asyncFn({
    file
  })
}

exports.module = doctor;