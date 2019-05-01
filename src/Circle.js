import React, { Component } from 'react';


class Circle extends Component {
  render() {
    return (
      <circle
        r="15"
        stroke="black"
        strokeWidth="1"
        fill="red"
        cx={this.props.cx}
        cy={this.props.cy}
        className={this.props.className}
        style={this.props.style}
        onMouseDown={(e) => this.props.handleMouseDown(e)}
        onMouseUp={(e) => this.props.handleMouseUp(e)}
      />
    );
  }
}
export default Circle;
