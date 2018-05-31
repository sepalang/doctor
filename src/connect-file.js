const fs = require('fs');

import { 
  get as _get,
  top as _top,
  asArray as _asArray,
  cloneDeep as _cloneDeep
} from 'pado/.src/functions';

import {
  reject as _reject,
  promisify as _promisify
} from 'pado/.src/modules/promise';

const readFile   = _promisify(fs.readFile);
const writeFile  = _promisify(fs.writeFile);

var ODBCObjectConnection = (function(){
  var ODBCObjectConnector = function(object, writeFn){
    this.dataSource      = object;
    this.writeDataSource = function(beforeFn){
      var result;
            
      if(typeof beforeFn === "function"){
        result = beforeFn();
      }
            
      return writeFn(this.dataSource).then(function(resp){
        console.log(`[${Date.now()}] Success write ODBC dataSource`);
        return result;
      });
    }.bind(this);
  };
    
  ODBCObjectConnector.prototype = {
    all:function(){
      return _cloneDeep(this.dataSource);
    },
    table:function(tableName){
      return new ODBCObjectTable(this, tableName);
    },
    createTable:function(modelKey){
      if(!this.dataSource[modelKey]){
        this.dataSource[modelKey] = [];
      }
      return this.dataSource[modelKey];
    },
    dropTable:function(modelKey){
      var droped = this.dataSource[modelKey] || [];
      if(this.dataSource.hasOwnProperty(modelKey)){
        delete this.dataSource[modelKey];
      }
      return droped;
    }
  };
    
  var ODBCObjectTable = function(driver, tableName){
    this.tableName    = tableName;
    this.handleSource = function(handle){
      if(!driver.dataSource[this.tableName]) driver.dataSource[this.tableName] = [];
      return handle(driver.dataSource[this.tableName]);
    };
    this.dataSoruce = function(where){
      if(!driver.dataSource[this.tableName]) driver.dataSource[this.tableName] = [];
      return _cloneDeep(where ? _asArray(driver.dataSource[this.tableName]).filter(where) : driver.dataSource[this.tableName]);
    };
  };
    
  ODBCObjectTable.prototype = {
    all:function(){
      return this.dataSoruce();
    },
    where:function(query){
      return this.dataSoruce(query);
    },
    id:function(id){
      return this.dataSoruce({id:~~id})[0];
    },
    insert:function(datum){
      return typeof datum === "object" ? this.handleSource(function(dataSource){
        var maxId = _get(_top(dataSource,"id"),"id");
        
        if(typeof maxId === "number"){
          maxId++;
        } else {
          maxId = 1;
        }
            
        datum.id = maxId;
        dataSource.push(datum);
                
        return datum;
      }) : null;
    },
    deleteBy:function(yieldFn){
      return this.handleSource(function(dataSource){
        var deleted = [];
        var saveData = _asArray(dataSource).filter((d,i)=>{ 
          if(!yieldFn(d,i)){
            return true;
          } else {
            deleted.push(d);
          }
        })
        Array.prototype.splice.apply(dataSource,[0,dataSource.length].concat(saveData));
        return deleted;
      });
    },
    updateBy:function(filterFn,yieldFn){
      this.handleSource(function(dataSource){
        asArray(dataSource).filter(filterFn).forEach(datum=>{
          yieldFn(datum);
        })
      });
    }
  };
    
  return function(object,writeFn){
    return new ODBCObjectConnector(object,writeFn);
  };
    
}());

var ODBC = (function(){
  var ODBCWriterFactory = function(path){
    return function(data){
      return writeFile(path, JSON.stringify(data))
      .then(function(){ return data; });
    }
  }
    
  return {
    open:function(raw,option){
      var object;
        
      if(typeof raw === "object"){
        object = raw;
      } else {
        try {
          object = JSON.parse(raw);
        } catch(e) {
          _reject(new Error("odbc data source is borken"));
        }
      }

      return ODBCObjectConnection(object,option);
    },
    read:function(path){
      return readFile(path, 'utf8').then(function(raw){
        return ODBC.open(raw,ODBCWriterFactory(path));
      });
    },
    createFrom:function(path, data){
      switch(typeof data){
      case "object":
      case "undefined":
        data = (data || {});
        return writeFile(path, data).then(function(){
          return ODBC.open(data,ODBCWriterFactory(path));
        });
        break;
      case "string":
        return readFile(data, 'utf8').then(function(data){
          return writeFile(path, data).then(function(){
            return ODBC.open(data,ODBCWriterFactory(path))
          });
        });
        break;
      default:
        return _reject(new Error("Unknown db create data type"));
        break;
      }
    }
  };
}());



module.exports = ODBC;