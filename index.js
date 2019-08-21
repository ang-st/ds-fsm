const inspect = require("util").inspect

function Fsm(events, initstate){
  this.state = initstate
  //this.events = events
  this.transitions = {}
  for ( let e of events){
    let action = this[e.action]
    if (!action){
      this[e.action] = function(){ console.log(e.action)}
    }
    let transit = this.transitions[e.from]
    if (transit){
      transit[e.to] =this[e.action]
    }
    else{
      transit = {}
      transit[e.to] =this[e.action]
    }
    this.transitions[e.from]=transit
      
  }
 
}

Fsm.prototype.transit = function (to){
  let handler = this.transitions[this.state][to]
  if(handler)
    handler()
  else
    throw new Error(`Invalid transition  from : ${this.state} ->  ${to}`)
  this.state= to  
}
let states = [
  "waiting",
  "created",
  "finalized",
  "paid",
  "delivered",
  "canceled"
]

let event = [
  {action : "onCancelComplete", from:"canceled",to:"waiting"},
  {action :"onCreated", from:"waiting", to:"created" },
  {action:"onFinalise", from:"created", to:"finalised"},
  {action:"onPaid", from:"finalized", to :"paid"},
  {action :"onCancel", from:"created", to: "canceled"},
  {action :"onCancel", from:"finalized", to: "canceled"},
]

var b = new Fsm(event,"waiting")
console.log(inspect(b))
b.transit('created')
b.transit('waiting')

module.exports=Fsm
