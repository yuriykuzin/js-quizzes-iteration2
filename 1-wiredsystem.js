"use strict"

// Basic Node class declaration:

function Node() {}


// NodeCanGaveChild class declaration with inheritance and getter:

function NodeCanHaveChild() {
  this._children = [];        
}

NodeCanHaveChild.prototype = Object.create(Node.prototype);
NodeCanHaveChild.prototype.constructor = NodeCanHaveChild;

Object.defineProperty(NodeCanHaveChild.prototype, "childrenCount", {
    get: function() {
        return this._children.length;
    }
});

NodeCanHaveChild.prototype.attach = function(nodeToAttach) {    
  if (!(nodeToAttach instanceof Node)) {
    throw new TypeError("Can only attach nodes");
  }
  this._children.push(nodeToAttach);        
  return this;
};   

NodeCanHaveChild.prototype.child = function(index) {
  if (index > this._children.length-1) {
    throw new RangeError("Child not found at index " + index);
  }
  return this._children[index];
};     


// GateNode class declaration:

function GateNode() {
  NodeCanHaveChild.apply(this, arguments);       
}

GateNode.prototype = Object.create(NodeCanHaveChild.prototype);
GateNode.prototype.constructor = GateNode;

GateNode.prototype.attach = function(newNode) {  
  if (this.childrenCount === 2) {
    throw new RangeError("Cannot attach more than 2 nodes to this gate");
  }
  NodeCanHaveChild.prototype.attach.apply(this, arguments);  
  return this;
}; 


// LampNode class declaration

function LampNode() {
  NodeCanHaveChild.apply(this, arguments);
}  

LampNode.prototype = Object.create(NodeCanHaveChild.prototype);
LampNode.prototype.constructor = LampNode;

LampNode.prototype.attach = function(newNode) {
  if (this.childrenCount === 1) {
    throw new RangeError("Cannot attach more than 1 node to a lamp");
  }
  NodeCanHaveChild.prototype.attach.apply(this, arguments);  
  return this;
};

LampNode.prototype.valueOf = function() {  	
  return this.child(0).valueOf();
};  


// SwitchNode class declaration:

function SwitchNode(signal) {  
  this._value = signal;    
}

SwitchNode.prototype = Object.create(Node.prototype);
SwitchNode.prototype.constructor = SwitchNode;

SwitchNode.prototype.valueOf = function() {  	
  return this._value;
};


// GateXorNode class declaration:

function GateXorNode() {
  GateNode.apply(this, arguments);
}

GateXorNode.prototype = Object.create(GateNode.prototype);
GateXorNode.prototype.constructor = GateXorNode;

GateXorNode.prototype.valueOf = function() {  	    
  return this.child(0).valueOf() ^ this.child(1).valueOf();
}; 


// GateOrNode class declaration:

function GateOrNode() {
  GateNode.call(this);
}

GateOrNode.prototype = Object.create(GateNode.prototype);
GateOrNode.prototype.constructor = GateOrNode;

GateOrNode.prototype.valueOf = function() {  	    
  return this.child(0).valueOf() | this.child(1).valueOf();
}; 


// GateAndNode class declaration:

function GateAndNode() {
  GateNode.call(this);
}

GateAndNode.prototype = Object.create(GateNode.prototype);
GateAndNode.prototype.constructor = GateAndNode;

GateAndNode.prototype.valueOf = function() {  	
  return this.child(0).valueOf() & this.child(1).valueOf();
}; 


// GateNotNode class declaration

function GateNotNode() {
  GateNode.call(this);
}

GateNotNode.prototype = Object.create(GateNode.prototype);
GateNotNode.prototype.constructor = GateNotNode;

GateNotNode.prototype.valueOf = function() {  	       
  return +!this.child(0).valueOf();
}; 


// Test

var lamp = new LampNode();


lamp.attach(
  new GateXorNode()
  .attach(
    new GateAndNode()
    .attach(new SwitchNode(0))
    .attach(new SwitchNode(1))
  )
  .attach(
    new GateNotNode()
    .attach(new SwitchNode(1))
  )
);


console.log(lamp.valueOf()); // 0
console.log(lamp.child(0) instanceof GateNode); // true
console.log(lamp.child(0) instanceof Node); // true
try {
  lamp.child(2);
} catch (e) {
  console.log(e instanceof RangeError, e.message) // true, "Child not found at index 2";
}
try {
  lamp.attach(new GateXorNode());
} catch (e) {
  console.log(e instanceof RangeError, e.message) // true, "Cannot attach more than 1 node to a lamp";
}
try {
  lamp.child(0).attach(new GateXorNode());
} catch (e) {
  console.log(e instanceof RangeError, e.message) // true, "Cannot attach more than 2 nodes to this gate";
}
try {
  new GateXorNode().valueOf()
} catch(e) {
  console.log(e instanceof RangeError, e.message) // true, "Child not found at index 0";
}
try {
  new GateXorNode().attach(new Number(10));
} catch(e) {
  console.log(e instanceof TypeError, e.message) // true, "Can only attach nodes";
}
