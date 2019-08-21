const util = require("util")
const EventEmitter = require('events').EventEmitter

function Fsm(events, initstate){
  this.state = initstate
  //this.events = events
  this.transitions = {}
  for ( let e of events){
    let transit = this.transitions[e.from]
    if (transit){
      transit[e.to] =e.action
    }
    else{
      transit = {}
      transit[e.to] =e.action
    }
    this.transitions[e.from]=transit
      
  }
 
}

util.inherits(Fsm, EventEmitter)

Fsm.prototype.transit = function (to){
  let handler = this.transitions[this.state][to]
  console.log(handler)
  if(handler){
    this.state= to  
     this.emit(handler)
  }
  else
    throw new Error(`Invalid transition  from : ${this.state} ->  ${to}`)
}

Fsm.prototype.toDot= function (){
  console.log("digraph G {")
  let keys  = Object.keys(this.transitions)
  for (let key of keys){
    let subkeys =  Object.keys(this.transitions[key])
    for (let subkey of subkeys) { 
      console.log(`   ${ key } -> ${subkey} [label = "${this.transitions[key][subkey]}"]; ` )  
    }
  }
  console.log("}")
}

module.exports=Fsm
