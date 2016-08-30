"use strict"

function Node() {
  var children = [];    
  this.childrenCount = 0;
  var self = this;
     
  this.attach = function(nodeToAttach) {    
    if (!(nodeToAttach instanceof Node)) {
      throw new TypeError("Can only attach nodes");
    }
    children.push(nodeToAttach);    
    self.childrenCount++;
    return this;
  };    
  
  this.child = function(index) {
    if (index > children.length-1) {
      throw new RangeError("Child not found at index "+index);
    }
    return children[index];
  };   
}

function GateNode() {
  Node.apply(this, arguments);  
  
  var parentAttach = this.attach;      
  this.attach = function(newNode) {
    if (this.childrenCount === 2) {
      throw new RangeError("Cannot attach more than 2 nodes to this gate");
    }
    parentAttach(newNode);
    return this;
  }; 
}

GateNode.prototype = Object.create(Node.prototype);

function LampNode() {
  Node.apply(this, arguments);
  var parentAttach = this.attach;  
  
  this.attach = function(newNode) {
    if (this.childrenCount === 1) {
      throw new RangeError("Cannot attach more than 1 node to a lamp");
    }
    parentAttach(newNode);
    return this;
  };
  
  this.valueOf = function() {  	
    return this.child(0).valueOf();
  };  
}

LampNode.prototype = Object.create(Node.prototype);

function SwitchNode(signal) {  
  var value = signal;  
  this.valueOf = function() {  	
    return value;
  };
}

SwitchNode.prototype = Object.create(Node.prototype);

function GateXorNode() {
  GateNode.call(this);

  this.valueOf = function() {  	    
    return this.child(0).valueOf() ^ this.child(1).valueOf();
  }; 
}

GateXorNode.prototype = Object.create(GateNode.prototype);

function GateOrNode() {
  GateNode.call(this);

  this.valueOf = function() {  	    
    return this.child(0).valueOf() | this.child(1).valueOf();
  }; 
}

GateOrNode.prototype = Object.create(GateNode.prototype);

function GateAndNode() {
  GateNode.call(this);

  this.valueOf = function() {  	
    return this.child(0).valueOf() & this.child(1).valueOf();
  }; 
}

GateAndNode.prototype = Object.create(GateNode.prototype);

function GateNotNode() {
  GateNode.call(this);

  this.valueOf = function() {  	       
    return +!this.child(0).valueOf();
  }; 
}

GateNotNode.prototype = Object.create(GateNode.prototype);


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

