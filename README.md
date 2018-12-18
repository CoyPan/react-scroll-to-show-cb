# react-scroll-to-show-cb

React component that fires a callback when the wrapped dom scroll into the visible area

## install
```npm
npm install react-scroll-to-show-cb --save
```
## usage
```javascript

import React from 'react';
import ReactDOM from 'react-dom';
import ReactScrollToShowCb from'react-scroll-to-show-cb';

class App extends React.Component {
    
    render() {
        return <div>
            <ReactScrollToShowCb
                scrollToShowCb={this.handleShow} once={true} wait={500}>
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

    handleShow(index) {
        console.log(`dom show: ${index}`);
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
    scrollToShowCb={(index) => {}} 
    once={Boolean} 
    wait={Number}>    
    {children}     
</ReactScrollToShowCb>
```

#### scrollToShowCb

**required**

When the wrapped children are scrolled into visible view, this callback function will be called with a parameter that indicates the index of children.

#### once

**default: false** 

When set to true, every time the dom showed, the callback will be called.



#### wait

**default: 500**

The wait time to fire the callback.

#### children

**required**

- Can be HTML elements, such as `div`, `p`, `section` and so on.

- Also, class **react component** is supported.

- Array or single element are all supported.

- If given an Array, every element of the Array should be the same type.

- **Functional react component** is not supported.










