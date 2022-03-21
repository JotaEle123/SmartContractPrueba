
/* /web/static/lib/es6-promise/es6-promise-polyfill.js defined in bundle 'web.assets_common_minimal' */
(function(global,factory){typeof exports==='object'&&typeof module!=='undefined'?module.exports=factory():typeof define==='function'&&define.amd?define(factory):(global.ES6Promise=factory());}(this,(function(){'use strict';function objectOrFunction(x){var type=typeof x;return x!==null&&(type==='object'||type==='function');}
function isFunction(x){return typeof x==='function';}
var _isArray=void 0;if(Array.isArray){_isArray=Array.isArray;}else{_isArray=function(x){return Object.prototype.toString.call(x)==='[object Array]';};}
var isArray=_isArray;var len=0;var vertxNext=void 0;var customSchedulerFn=void 0;var asap=function asap(callback,arg){queue[len]=callback;queue[len+1]=arg;len+=2;if(len===2){if(customSchedulerFn){customSchedulerFn(flush);}else{scheduleFlush();}}};function setScheduler(scheduleFn){customSchedulerFn=scheduleFn;}
function setAsap(asapFn){asap=asapFn;}
var browserWindow=typeof window!=='undefined'?window:undefined;var browserGlobal=browserWindow||{};var BrowserMutationObserver=browserGlobal.MutationObserver||browserGlobal.WebKitMutationObserver;var isNode=false;var isWorker=typeof Uint8ClampedArray!=='undefined'&&typeof importScripts!=='undefined'&&typeof MessageChannel!=='undefined';function useNextTick(){return function(){return process.nextTick(flush);};}
function useVertxTimer(){if(typeof vertxNext!=='undefined'){return function(){vertxNext(flush);};}
return useSetTimeout();}
function useMutationObserver(){var iterations=0;var observer=new BrowserMutationObserver(flush);var node=document.createTextNode('');observer.observe(node,{characterData:true});return function(){node.data=iterations=++iterations%2;};}
function useMessageChannel(){var channel=new MessageChannel();channel.port1.onmessage=flush;return function(){return channel.port2.postMessage(0);};}
function useSetTimeout(){var globalSetTimeout=setTimeout;return function(){return globalSetTimeout(flush,1);};}
var queue=new Array(1000);function flush(){for(var i=0;i<len;i+=2){var callback=queue[i];var arg=queue[i+1];callback(arg);queue[i]=undefined;queue[i+1]=undefined;}
len=0;}
function attemptVertx(){try{var vertx=Function('return this')().require('vertx');vertxNext=vertx.runOnLoop||vertx.runOnContext;return useVertxTimer();}catch(e){return useSetTimeout();}}
var scheduleFlush=void 0;if(isNode){scheduleFlush=useNextTick();}else if(BrowserMutationObserver){scheduleFlush=useMutationObserver();}else if(isWorker){scheduleFlush=useMessageChannel();}else if(browserWindow===undefined&&typeof require==='function'){scheduleFlush=attemptVertx();}else{scheduleFlush=useSetTimeout();}
function then(onFulfillment,onRejection){var parent=this;var child=new this.constructor(noop);if(child[PROMISE_ID]===undefined){makePromise(child);}
var _state=parent._state;if(_state){var callback=arguments[_state-1];asap(function(){return invokeCallback(_state,child,callback,parent._result);});}else{subscribe(parent,child,onFulfillment,onRejection);}
return child;}
function resolve$1(object){var Constructor=this;if(object&&typeof object==='object'&&object.constructor===Constructor){return object;}
var promise=new Constructor(noop);resolve(promise,object);return promise;}
var PROMISE_ID=Math.random().toString(36).substring(2);function noop(){}
var PENDING=void 0;var FULFILLED=1;var REJECTED=2;var TRY_CATCH_ERROR={error:null};function selfFulfillment(){return new TypeError("You cannot resolve a promise with itself");}
function cannotReturnOwn(){return new TypeError('A promises callback cannot return that same promise.');}
function getThen(promise){try{return promise.then;}catch(error){TRY_CATCH_ERROR.error=error;return TRY_CATCH_ERROR;}}
function tryThen(then$$1,value,fulfillmentHandler,rejectionHandler){try{then$$1.call(value,fulfillmentHandler,rejectionHandler);}catch(e){return e;}}
function handleForeignThenable(promise,thenable,then$$1){asap(function(promise){var sealed=false;var error=tryThen(then$$1,thenable,function(value){if(sealed){return;}
sealed=true;if(thenable!==value){resolve(promise,value);}else{fulfill(promise,value);}},function(reason){if(sealed){return;}
sealed=true;reject(promise,reason);},'Settle: '+(promise._label||' unknown promise'));if(!sealed&&error){sealed=true;reject(promise,error);}},promise);}
function handleOwnThenable(promise,thenable){if(thenable._state===FULFILLED){fulfill(promise,thenable._result);}else if(thenable._state===REJECTED){reject(promise,thenable._result);}else{subscribe(thenable,undefined,function(value){return resolve(promise,value);},function(reason){return reject(promise,reason);});}}
function handleMaybeThenable(promise,maybeThenable,then$$1){if(maybeThenable.constructor===promise.constructor&&then$$1===then&&maybeThenable.constructor.resolve===resolve$1){handleOwnThenable(promise,maybeThenable);}else{if(then$$1===TRY_CATCH_ERROR){reject(promise,TRY_CATCH_ERROR.error);TRY_CATCH_ERROR.error=null;}else if(then$$1===undefined){fulfill(promise,maybeThenable);}else if(isFunction(then$$1)){handleForeignThenable(promise,maybeThenable,then$$1);}else{fulfill(promise,maybeThenable);}}}
function resolve(promise,value){if(promise===value){reject(promise,selfFulfillment());}else if(objectOrFunction(value)){handleMaybeThenable(promise,value,getThen(value));}else{fulfill(promise,value);}}
function publishRejection(promise){if(promise._onerror){promise._onerror(promise._result);}
publish(promise);}
function fulfill(promise,value){if(promise._state!==PENDING){return;}
promise._result=value;promise._state=FULFILLED;if(promise._subscribers.length!==0){asap(publish,promise);}}
function reject(promise,reason){if(promise._state!==PENDING){return;}
promise._state=REJECTED;promise._result=reason;asap(publishRejection,promise);}
function subscribe(parent,child,onFulfillment,onRejection){var _subscribers=parent._subscribers;var length=_subscribers.length;parent._onerror=null;_subscribers[length]=child;_subscribers[length+FULFILLED]=onFulfillment;_subscribers[length+REJECTED]=onRejection;if(length===0&&parent._state){asap(publish,parent);}}
function publish(promise){var subscribers=promise._subscribers;var settled=promise._state;if(subscribers.length===0){return;}
var child=void 0,callback=void 0,detail=promise._result;for(var i=0;i<subscribers.length;i+=3){child=subscribers[i];callback=subscribers[i+settled];if(child){invokeCallback(settled,child,callback,detail);}else{callback(detail);}}
promise._subscribers.length=0;}
function tryCatch(callback,detail){try{return callback(detail);}catch(e){TRY_CATCH_ERROR.error=e;return TRY_CATCH_ERROR;}}
function invokeCallback(settled,promise,callback,detail){var hasCallback=isFunction(callback),value=void 0,error=void 0,succeeded=void 0,failed=void 0;if(hasCallback){value=tryCatch(callback,detail);if(value===TRY_CATCH_ERROR){failed=true;error=value.error;value.error=null;}else{succeeded=true;}
if(promise===value){reject(promise,cannotReturnOwn());return;}}else{value=detail;succeeded=true;}
if(promise._state!==PENDING){}else if(hasCallback&&succeeded){resolve(promise,value);}else if(failed){reject(promise,error);}else if(settled===FULFILLED){fulfill(promise,value);}else if(settled===REJECTED){reject(promise,value);}}
function initializePromise(promise,resolver){try{resolver(function resolvePromise(value){resolve(promise,value);},function rejectPromise(reason){reject(promise,reason);});}catch(e){reject(promise,e);}}
var id=0;function nextId(){return id++;}
function makePromise(promise){promise[PROMISE_ID]=id++;promise._state=undefined;promise._result=undefined;promise._subscribers=[];}
function validationError(){return new Error('Array Methods must be provided an Array');}
var Enumerator=function(){function Enumerator(Constructor,input){this._instanceConstructor=Constructor;this.promise=new Constructor(noop);if(!this.promise[PROMISE_ID]){makePromise(this.promise);}
if(isArray(input)){this.length=input.length;this._remaining=input.length;this._result=new Array(this.length);if(this.length===0){fulfill(this.promise,this._result);}else{this.length=this.length||0;this._enumerate(input);if(this._remaining===0){fulfill(this.promise,this._result);}}}else{reject(this.promise,validationError());}}
Enumerator.prototype._enumerate=function _enumerate(input){for(var i=0;this._state===PENDING&&i<input.length;i++){this._eachEntry(input[i],i);}};Enumerator.prototype._eachEntry=function _eachEntry(entry,i){var c=this._instanceConstructor;var resolve$$1=c.resolve;if(resolve$$1===resolve$1){var _then=getThen(entry);if(_then===then&&entry._state!==PENDING){this._settledAt(entry._state,i,entry._result);}else if(typeof _then!=='function'){this._remaining--;this._result[i]=entry;}else if(c===Promise$2){var promise=new c(noop);handleMaybeThenable(promise,entry,_then);this._willSettleAt(promise,i);}else{this._willSettleAt(new c(function(resolve$$1){return resolve$$1(entry);}),i);}}else{this._willSettleAt(resolve$$1(entry),i);}};Enumerator.prototype._settledAt=function _settledAt(state,i,value){var promise=this.promise;if(promise._state===PENDING){this._remaining--;if(state===REJECTED){reject(promise,value);}else{this._result[i]=value;}}
if(this._remaining===0){fulfill(promise,this._result);}};Enumerator.prototype._willSettleAt=function _willSettleAt(promise,i){var enumerator=this;subscribe(promise,undefined,function(value){return enumerator._settledAt(FULFILLED,i,value);},function(reason){return enumerator._settledAt(REJECTED,i,reason);});};return Enumerator;}();function all(entries){return new Enumerator(this,entries).promise;}
function race(entries){var Constructor=this;if(!isArray(entries)){return new Constructor(function(_,reject){return reject(new TypeError('You must pass an array to race.'));});}else{return new Constructor(function(resolve,reject){var length=entries.length;for(var i=0;i<length;i++){Constructor.resolve(entries[i]).then(resolve,reject);}});}}
function reject$1(reason){var Constructor=this;var promise=new Constructor(noop);reject(promise,reason);return promise;}
function needsResolver(){throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');}
function needsNew(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");}
var Promise$2=function(){function Promise(resolver){this[PROMISE_ID]=nextId();this._result=this._state=undefined;this._subscribers=[];if(noop!==resolver){typeof resolver!=='function'&&needsResolver();this instanceof Promise?initializePromise(this,resolver):needsNew();}}
Promise.prototype.catch=function _catch(onRejection){return this.then(null,onRejection);};Promise.prototype.finally=function _finally(callback){var promise=this;var constructor=promise.constructor;if(isFunction(callback)){return promise.then(function(value){return constructor.resolve(callback()).then(function(){return value;});},function(reason){return constructor.resolve(callback()).then(function(){throw reason;});});}
return promise.then(callback,callback);};return Promise;}();Promise$2.prototype.then=then;Promise$2.all=all;Promise$2.race=race;Promise$2.resolve=resolve$1;Promise$2.reject=reject$1;Promise$2._setScheduler=setScheduler;Promise$2._setAsap=setAsap;Promise$2._asap=asap;function polyfill(){var local=void 0;try{local=Function('return this')();}catch(e){throw new Error('polyfill failed because global object is unavailable in this environment');}
var P=local.Promise;if(P){var promiseToString=null;try{promiseToString=Object.prototype.toString.call(P.resolve());}catch(e){}
if(promiseToString==='[object Promise]'&&!P.cast){return;}}
local.Promise=Promise$2;}
Promise$2.polyfill=polyfill;Promise$2.Promise=Promise$2;Promise$2.polyfill();return Promise$2;})));;

/* /web/static/src/legacy/js/promise_extension.js defined in bundle 'web.assets_common_minimal' */
(function(){var _catch=Promise.prototype.catch;Promise.prototype.guardedCatch=function(onRejected){return _catch.call(this,function(reason){if(!reason||!(reason instanceof Error)){if(onRejected){onRejected.call(this,reason);}}
return Promise.reject(reason);});};})();;

/* /web/static/src/boot.js defined in bundle 'web.assets_common_minimal' */
(function(){"use strict";var jobUID=Date.now();var jobs=[];var factories=Object.create(null);var jobDeps=[];var jobPromises=[];var services=Object.create({});var commentRegExp=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm;var cjsRequireRegExp=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;if(!window.odoo){window.odoo={};}
var odoo=window.odoo;var debug=odoo.debug;var didLogInfoResolve;var didLogInfoPromise=new Promise(function(resolve){didLogInfoResolve=resolve;});odoo.testing=typeof QUnit==="object";odoo.remainingJobs=jobs;odoo.__DEBUG__={didLogInfo:didLogInfoPromise,getDependencies:function(name,transitive){var deps=name instanceof Array?name:[name];var changed;do{changed=false;jobDeps.forEach(function(dep){if(deps.indexOf(dep.to)>=0&&deps.indexOf(dep.from)<0){deps.push(dep.from);changed=true;}});}while(changed&&transitive);return deps;},getDependents:function(name){return jobDeps.filter(function(dep){return dep.from===name;}).map(function(dep){return dep.to;});},getWaitedJobs:function(){return jobs.map(function(job){return job.name;}).filter(function(item,index,self){return self.indexOf(item)===index;});},getMissingJobs:function(){var self=this;var waited=this.getWaitedJobs();var missing=[];waited.forEach(function(job){self.getDependencies(job).forEach(function(job){if(!(job in self.services)){missing.push(job);}});});return missing.filter(function(item,index,self){return self.indexOf(item)===index;}).filter(function(item){return waited.indexOf(item)<0;}).filter(function(job){return!job.error;});},getFailedJobs:function(){return jobs.filter(function(job){return!!job.error;});},factories:factories,services:services,};odoo.define=function(){var args=Array.prototype.slice.call(arguments);var name=typeof args[0]==="string"?args.shift():"__odoo_job"+jobUID++;var factory=args[args.length-1];var deps;if(args[0]instanceof Array){deps=args[0];}else{deps=[];factory.toString().replace(commentRegExp,"").replace(cjsRequireRegExp,function(match,dep){deps.push(dep);});}
if(!(deps instanceof Array)){throw new Error("Dependencies should be defined by an array",deps);}
if(typeof factory!=="function"){throw new Error("Factory should be defined by a function",factory);}
if(typeof name!=="string"){throw new Error("Invalid name definition (should be a string",name);}
if(name in factories){throw new Error("Service "+name+" already defined");}
factory.deps=deps;factories[name]=factory;jobs.push({name:name,factory:factory,deps:deps,});deps.forEach(function(dep){jobDeps.push({from:dep,to:name});});this.processJobs(jobs,services);};odoo.log=function(){var missing=[];var failed=[];var cycle=null;if(jobs.length){var debugJobs={};var rejected=[];var rejectedLinked=[];var job;var jobdep;for(var k=0;k<jobs.length;k++){debugJobs[jobs[k].name]=job={dependencies:jobs[k].deps,dependents:odoo.__DEBUG__.getDependents(jobs[k].name),name:jobs[k].name,};if(jobs[k].error){job.error=jobs[k].error;}
if(jobs[k].rejected){job.rejected=jobs[k].rejected;rejected.push(job.name);}
var deps=odoo.__DEBUG__.getDependencies(job.name);for(var i=0;i<deps.length;i++){if(job.name!==deps[i]&&!(deps[i]in services)){jobdep=debugJobs[deps[i]];if(!jobdep&&deps[i]in factories){for(var j=0;j<jobs.length;j++){if(jobs[j].name===deps[i]){jobdep=jobs[j];break;}}}
if(jobdep&&jobdep.rejected){if(!job.rejected){job.rejected=[];rejectedLinked.push(job.name);}
job.rejected.push(deps[i]);}else{if(!job.missing){job.missing=[];}
job.missing.push(deps[i]);}}}}
missing=odoo.__DEBUG__.getMissingJobs();failed=odoo.__DEBUG__.getFailedJobs();var unloaded=Object.keys(debugJobs).map(function(key){return debugJobs[key];}).filter(function(job){return job.missing;});if(debug||failed.length||unloaded.length){var log=window.console[!failed.length||!unloaded.length?"info":"error"].bind(window.console);log((failed.length?"error":unloaded.length?"warning":"info")+": Some modules could not be started");if(missing.length){log("Missing dependencies:    ",missing);}
if(failed.length){log("Failed modules:          ",failed.map(function(fail){return fail.name;}));}
if(rejected.length){log("Rejected modules:        ",rejected);}
if(rejectedLinked.length){log("Rejected linked modules: ",rejectedLinked);}
if(unloaded.length){cycle=findCycle(unloaded);if(cycle){console.error("Cyclic dependencies: "+cycle);}
log("Non loaded modules:      ",unloaded.map(function(unload){return unload.name;}));}
if(debug&&Object.keys(debugJobs).length){log("Debug:                   ",debugJobs);}}}
odoo.__DEBUG__.jsModules={missing:missing,failed:failed.map((mod)=>mod.name),unloaded:unloaded?unloaded.map((mod)=>mod.name):[],cycle,};didLogInfoResolve(true);};odoo.processJobs=function(jobs,services){var job;function processJob(job){var require=makeRequire(job);var jobExec;function onError(e){job.error=e;console.error(`Error while loading ${job.name}: ${e.message}`,e);}
var def=new Promise(function(resolve){try{jobExec=job.factory.call(null,require);jobs.splice(jobs.indexOf(job),1);}catch(e){onError(e);}
if(!job.error){Promise.resolve(jobExec).then(function(data){services[job.name]=data;resolve();odoo.processJobs(jobs,services);}).guardedCatch(function(e){job.rejected=e||true;jobs.push(job);}).catch(function(e){if(e instanceof Error){onError(e);}
resolve();});}else{resolve();}});jobPromises.push(def);}
function isReady(job){return(!job.error&&!job.rejected&&job.factory.deps.every(function(name){return name in services;}));}
function makeRequire(job){var deps={};Object.keys(services).filter(function(item){return job.deps.indexOf(item)>=0;}).forEach(function(key){deps[key]=services[key];});return function require(name){if(!(name in deps)){console.error("Undefined dependency: ",name);}
return deps[name];};}
while(jobs.length){job=undefined;for(var i=0;i<jobs.length;i++){if(isReady(jobs[i])){job=jobs[i];break;}}
if(!job){break;}
processJob(job);}
return services;};window.addEventListener("load",function logWhenLoaded(){setTimeout(function(){var len=jobPromises.length;Promise.all(jobPromises).then(function(){if(len===jobPromises.length){odoo.log();}else{logWhenLoaded();}});},5000);});function findCycle(jobs){const dependencyGraph=new Map();for(let job of jobs){dependencyGraph.set(job.name,job.dependencies);}
function visitJobs(jobs,visited=new Set()){for(let job of jobs){const result=visitJob(job,visited);if(result){return result;}}
return null;}
function visitJob(job,visited){if(visited.has(job)){const jobs=Array.from(visited).concat([job]);const index=jobs.indexOf(job);return jobs.slice(index).map((j)=>`"${j}"`).join(" => ");}
const deps=dependencyGraph.get(job);return deps?visitJobs(deps,new Set(visited).add(job)):null;}
return visitJobs(jobs.map((j)=>j.name));}})();;

/* /web/static/src/session.js defined in bundle 'web.assets_common_minimal' */
odoo.define('@web/session',async function(require){'use strict';let __exports={};const session=__exports.session=odoo.__session_info__||{};delete odoo.__session_info__;return __exports;});;

/* /web/static/src/legacy/js/core/cookie_utils.js defined in bundle 'web.assets_common_minimal' */
odoo.define('web.utils.cookies',function(require){"use strict";return{get_cookie(cookieName){var cookies=document.cookie?document.cookie.split('; '):[];for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split('=');var name=parts.shift();var cookie=parts.join('=');if(cookieName&&cookieName===name){return cookie;}}
return"";},set_cookie(name,value,ttl){ttl=ttl||24*60*60*365;document.cookie=[`${name}=${value}`,'path=/',`max-age=${ttl}`,`expires=${new Date(new Date().getTime() + ttl * 1000).toGMTString()}`].join(';');},};});;

/* /web/static/src/legacy/js/core/menu.js defined in bundle 'web.assets_common_minimal' */
odoo.define('@web/legacy/js/core/menu',async function(require){'use strict';let __exports={};__exports.initAutoMoreMenu=initAutoMoreMenu;async function initAutoMoreMenu(el,options){if(!el){return;}
options=Object.assign({unfoldable:'none',maxWidth:false,minSize:'767',images:[],loadingStyleClasses:[],},options||{});const isUserNavbar=el.parentElement.classList.contains('o_main_navbar');const dropdownSubMenuClasses=['show','border-0','position-static'];const dropdownToggleClasses=['h-auto','py-2','text-secondary'];var autoMarginLeftRegex=/\bm[lx]?(?:-(?:sm|md|lg|xl))?-auto\b/;var autoMarginRightRegex=/\bm[rx]?(?:-(?:sm|md|lg|xl))?-auto\b/;var extraItemsToggle=null;let debounce;const afterFontsloading=new Promise((resolve)=>{if(document.fonts){document.fonts.ready.then(resolve);}else{setTimeout(resolve,150);}});afterFontsloading.then(_adapt);if(options.images.length){await _afterImagesLoading(options.images);_adapt();}
const debouncedAdapt=()=>{clearTimeout(debounce);debounce=setTimeout(_adapt,250);};window.addEventListener('resize',debouncedAdapt);el.addEventListener('dom:autoMoreMenu:adapt',_adapt);el.addEventListener('dom:autoMoreMenu:destroy',destroy,{once:true});function _restore(){if(!extraItemsToggle){return;}
[...extraItemsToggle.querySelector('.dropdown-menu').children].forEach((item)=>{if(!isUserNavbar){item.classList.add('nav-item');const itemLink=item.querySelector('.dropdown-item');itemLink.classList.remove('dropdown-item');itemLink.classList.add('nav-link');}else{item.classList.remove('dropdown-item');const dropdownSubMenu=item.querySelector('.dropdown-menu');const dropdownSubMenuButton=item.querySelector('.dropdown-toggle');if(dropdownSubMenu){dropdownSubMenu.classList.remove(...dropdownSubMenuClasses);}
if(dropdownSubMenuButton){dropdownSubMenuButton.classList.remove(...dropdownToggleClasses);}}
el.insertBefore(item,extraItemsToggle);});extraItemsToggle.remove();extraItemsToggle=null;}
function _adapt(){if(options.loadingStyleClasses.length){el.classList.add(...options.loadingStyleClasses);}
_restore();if(!el.getClientRects().length||el.closest('.show')||window.matchMedia(`(max-width: ${options.minSize}px)`).matches){return _endAutoMoreMenu();}
let unfoldableItems=[];const items=[...el.children].filter((node)=>{if(node.matches&&!node.matches(options.unfoldable)){return true;}
unfoldableItems.push(node);return false;});var nbItems=items.length;var menuItemsWidth=items.reduce((sum,el)=>sum+computeFloatOuterWidthWithMargins(el,true,true,false),0);let maxWidth=0;if(options.maxWidth){maxWidth=options.maxWidth();}
if(!maxWidth){maxWidth=computeFloatOuterWidthWithMargins(el,true,true,true);var style=window.getComputedStyle(el);maxWidth-=(parseFloat(style.paddingLeft)+parseFloat(style.paddingRight)+parseFloat(style.borderLeftWidth)+parseFloat(style.borderRightWidth));maxWidth-=unfoldableItems.reduce((sum,el)=>sum+computeFloatOuterWidthWithMargins(el,true,true,false),0);}
if(maxWidth-menuItemsWidth>=-0.001){return _endAutoMoreMenu();}
const dropdownMenu=_addExtraItemsButton(items[nbItems-1].nextElementSibling);menuItemsWidth+=computeFloatOuterWidthWithMargins(extraItemsToggle,true,true,false);do{menuItemsWidth-=computeFloatOuterWidthWithMargins(items[--nbItems],true,true,false);}while(!(maxWidth-menuItemsWidth>=-0.001)&&(nbItems>0));const extraItems=items.slice(nbItems);extraItems.forEach((el)=>{if(!isUserNavbar){const navLink=el.querySelector('.nav-link, a');el.classList.remove('nav-item');navLink.classList.remove('nav-link');navLink.classList.add('dropdown-item');navLink.classList.toggle('active',el.classList.contains('active'));}else{const dropdownSubMenu=el.querySelector('.dropdown-menu');const dropdownSubMenuButton=el.querySelector('.dropdown-toggle');el.classList.add('dropdown-item','p-0');if(dropdownSubMenu){dropdownSubMenu.classList.add(...dropdownSubMenuClasses);}
if(dropdownSubMenuButton){dropdownSubMenuButton.classList.add(...dropdownToggleClasses);}}
dropdownMenu.appendChild(el);});_endAutoMoreMenu();}
function computeFloatOuterWidthWithMargins(el,mLeft,mRight,considerAutoMargins){var rect=el.getBoundingClientRect();var style=window.getComputedStyle(el);var outerWidth=rect.right-rect.left;if(mLeft!==false&&(considerAutoMargins||!autoMarginLeftRegex.test(el.getAttribute('class')))){outerWidth+=parseFloat(style.marginLeft);}
if(mRight!==false&&(considerAutoMargins||!autoMarginRightRegex.test(el.getAttribute('class')))){outerWidth+=parseFloat(style.marginRight);}
return isNaN(outerWidth)?0:outerWidth;}
function _addExtraItemsButton(target){let dropdownMenu=document.createElement('div');extraItemsToggle=dropdownMenu.cloneNode();const extraItemsToggleIcon=document.createElement('i');const extraItemsToggleLink=document.createElement('a');dropdownMenu.className='dropdown-menu';extraItemsToggle.className='nav-item dropdown o_extra_menu_items';extraItemsToggleIcon.className='fa fa-plus';Object.entries({role:'button',href:'#',class:'nav-link dropdown-toggle o-no-caret','data-toggle':'dropdown','aria-expanded':false,}).forEach(([key,value])=>{extraItemsToggleLink.setAttribute(key,value);});extraItemsToggleLink.appendChild(extraItemsToggleIcon);extraItemsToggle.appendChild(extraItemsToggleLink);extraItemsToggle.appendChild(dropdownMenu);el.insertBefore(extraItemsToggle,target);return dropdownMenu;}
function destroy(){_restore();window.removeEventListener('resize',debouncedAdapt);el.removeEventListener('dom:autoMoreMenu:adapt',_adapt);}
function _afterImagesLoading(images){const defs=images.map((image)=>{if(image.complete||!image.getClientRects().length){return null;}
return new Promise(function(resolve,reject){if(!image.width){image.classList.add('o_menu_image_placeholder');}
image.addEventListener('load',()=>{image.classList.remove('o_menu_image_placeholder');resolve();});});});return Promise.all(defs);}
function _endAutoMoreMenu(){el.classList.remove(...options.loadingStyleClasses);}}
__exports.destroyAutoMoreMenu=destroyAutoMoreMenu;function destroyAutoMoreMenu(el){el.dispatchEvent(new Event('dom:autoMoreMenu:destroy'));}
return __exports;});