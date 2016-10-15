/*
*
*  Wired System solution implementation in TypeScript
*
*/

export class Node {}


class NodeCanHaveChild extends Node {
  
  children: Node[] = [];
  
  attach(nodeToAttach: Node): NodeCanHaveChild {
    if (!(nodeToAttach instanceof Node)) {
      throw new TypeError("Can only attach nodes");
    }
    this.children.push(nodeToAttach);        
    return this;      
  }
  
  getChild(index: number): any {
    if (index > this.children.length - 1) {
      throw new RangeError("Child not found at index " + index);
    }
    return this.children[index];
  }
  
  get childrenCount(): number {
    return this.children.length;
  }
}


class GateNode extends NodeCanHaveChild {
  
  attach(nodeToAttach: Node): GateNode {
    if (this.childrenCount === 2) {
      throw new RangeError("Cannot attach more than 2 nodes to this gate");
    }
    super.attach(nodeToAttach);
    return this;
  }
}


class LampNode extends NodeCanHaveChild {

  attach(nodeToAttach: Node): LampNode {
    if (this.childrenCount === 1) {
      throw new RangeError("Cannot attach more than 1 node to a lamp");
    }
    super.attach(nodeToAttach);  
    return this;    
  }
  
  valueOf(): number {
    return this.getChild(0).valueOf();
  }
}  


class SwitchNode extends Node {  
  
  value: number;    
  
  constructor(signal: number) {
    super();
    this.value = signal;  
  }
  
  valueOf(): number {
    return this.value;
  }
}


class GateXorNode extends GateNode {
  valueOf(): number {
    return this.getChild(0).valueOf() ^ this.getChild(1).valueOf();
  }
}


class GateOrNode extends GateNode {
  valueOf(): number {
    return this.getChild(0).valueOf() | this.getChild(1).valueOf();
  }; 
}


class GateAndNode extends GateNode {
  valueOf(): number {
    return this.getChild(0).valueOf() & this.getChild(1).valueOf();
  };   
}


class GateNotNode extends GateNode {
  valueOf(): number { 
    return +!this.getChild(0).valueOf();
  };   
}


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


console.log('Wired system:');

console.log(lamp.valueOf()); // 0
console.log(lamp.getChild(0) instanceof GateNode); // true
console.log(lamp.getChild(0) instanceof Node); // true
try {
  lamp.getChild(2);
} catch (e) {
  console.log(e instanceof RangeError, e.message) // true, "Child not found at index 2";
}
try {
  lamp.attach(new GateXorNode());
} catch (e) {
  console.log(e instanceof RangeError, e.message) // true, "Cannot attach more than 1 node to a lamp";
}
try {
  lamp.getChild(0).attach(new GateXorNode());
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
