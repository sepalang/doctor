const fs = require('fs');

import { 
  //get as _get,
  //top as _top,
  //asArray as _asArray,
  //cloneDeep as _cloneDeep
} from 'pado/.src/functions';

import {
  reject as _reject,
  promisify as _promisify
} from 'pado/.src/modules/promise';

const readFile   = _promisify(fs.readFile);
const writeFile  = _promisify(fs.writeFile);

export default (function(){
  
  const QuerySymbol = Symbol("FileConnection::QueryConnection");
  
  const FileConnection = function(path, charset='utf-8'){
    this.path    = path;
    this.charset = charset;
    this.opened  = false;
    this.content = undefined;
  };
    
  FileConnection.prototype = {
    open:async function(){
      this.content = await readFile(this.path)
    },
    is:function(type){
      
    },
    query:function(type,handle){
      
    }
  };
  
  function factoryQuery(type,{ methods }={}){
    const QueryConnection = function(parent){
      
    };
    
    const QueryConnectionPrototype = {
      [QuerySymbol]:true,
    };
    
    if(typeof methods === "object"){
      Object.assign(QueryConnection.prototype, methods);
    }
    
    QueryConnection.prototype = QueryConnectionPrototype;
  }
  
  
  
  const JSONConnection = factoryQuery("json",{
    methods:{
      setDefault:function(){
        
      }
    }
  });
  
  return function(object,writeFn){
    return new FileConnection(object,writeFn);
  };
    
}());