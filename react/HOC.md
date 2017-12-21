Courtesy of [mjackson](https://gist.github.com/mjackson).

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

const withMouse = (Component) => {
  return class extends React.Component {
    state = { x: 0, y: 0 };

    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY
      });
    };

    render() {
      return (
        <div onMouseMove={this.handleMouseMove}>
          <Component {...this.props} mouse={this.state} />
        </div>
      )
    }
  }
}

class App extends Component {
  render() {
    const { x, y } = this.props.mouse;

    return (
      <div style={{ height: '100%' }}>
        <h1>The mouse position is ({x}, {y})</h1>
      </div>
    );
  }
}

// Just wrap your component in withMouse and
// it'll get the mouse prop!
const AppWithMouse = withMouse(App);
```
