# react-scroll-to-show-cb

React component that fires a callback when the wrapped dom scroll into the visible area

## install
```npm
npm install react-scroll-to-show-cb --save
```
## usage
support:  
  - Before React v16.0 
  - After React v16.0 
  - preact (preact-compat) - need to set alias: **react** -> **preact-compat** , **react-dom** -> **preact-compat** 

```javascript

import React from 'react';
import ReactDOM from 'react-dom';
import ReactScrollToShowCb from'react-scroll-to-show-cb';

class App extends React.Component {
    
    render() {
        return <div>
            <ReactScrollToShowCb 
            onScrollToShow={this.handleShow}
            onInitEnd={this.handleInitEnd}
            once={true} 
            wait={500}>
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
                <div>6</div>
                <div>7</div>
            </ReactScrollToShowCb>
        </div>
    }

    handleShow(index, dom) {
        console.log(`index: ${index}`);
        console.log('dom:', dom);
    }

    handleInitEnd(instance){
        console.log(instance);
    }

}


ReactDOM.render(<App />, document.body);

```

## run the example
```npm
npm install --save
npm run dev
```
The demo app is running at  [http://localhost:8080](http://localhost:8080).

## API
```javascript
<ReactScrollToShowCb
    onScrollToShow={(index, dom) => {}} 
    onInitEnd={(instance) => {}}
    once={Boolean} 
    async={Boolean}
    wait={Number}> 
    {children}     
</ReactScrollToShowCb>
```

#### onScrollToShow

**required**

When the wrapped children are scrolled into visible view, this callback function will be triggered with two parameters : the index of the child and the dom of the child.

#### onInitEnd
When ReactScrollToShowCb is initialized, this function will be triggered with a parameter : the instance of ReactScrollToShowCb.

#### async

**default:false**

When set to true, you can set the children async and the onScrollToShow will be also triggered.

#### once

**default: true** 

When set to false, every time the dom showed, the callback will be triggered.


#### wait

**default: 500**

The throttle wait time for the callback.

#### children

**required**

- HTML elements, such as `div`, `p`, `section` , are supported.

- **Class react component** is supported.

- **Functional react component** is **not** supported.

- If given an Array, every element of the array should **be the same type**(the same html element or the same react component);

## Static Method

#### Update
When you change the children, adding a child or removing a child, the ReactScrollToShowCb will not work anymore unless you call the Update method. Usage:

```
import ReactScrollToShowCb from'react-scroll-to-show-cb';

...
//  ins: the instance of the ReactScrollToShowCb. You can get it the instance by [onInitEnd]
ReactScrollToShowCb.Update(ins);
...

```
Notice that you should call the Update method in the callback of `setState`. You can find the complete example in the `test/index.js`. 

## Note
**Do not replace children of react-scroll-to-show-cb**. Adding or removing a child is allowed. You can consider using more than one react-scroll-to-show-cb instance if you have children with different child types.
















