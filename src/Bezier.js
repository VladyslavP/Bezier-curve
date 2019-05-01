import React, { Component } from 'react';
import Circle from './Circle';
import { COORDINATES, CIRCLES, LINES } from './constants';

class Bezier extends Component {
  constructor() {
    super();

    this.state = {
      coordinates: {
        xAnchorStart: 711,
        yAnchorStart: 459,
        xHandleStart: 523,
        yHandleStart: 200,
        xHandleEnd: 1106,
        yHandleEnd: 200,
        xAnchorEnd: 891,
        yAnchorEnd: 459,
      },
      moveObject: {
        xAnchorStart: 711,
        yAnchorStart: 459,
        xHandleStart: 523,
        yHandleStart: 200,
        xHandleEnd: 1106,
        yHandleEnd: 200,
        xAnchorEnd: 891,
        yAnchorEnd: 459,
      },
    };
    this.handleMove = this.handleMove.bind(this);
    this.performAnimation = this.performAnimation.bind(this);
  }

  componentDidMount() {
    const { d } = this.interpolateCurve(0, 1, this.state.coordinates);
    this.elem.setAttribute( 'd' , d );
  }

  interpolateCurve(
    lambdaStart,
    lambdaEnd,
    {
      xAnchorStart,
      yAnchorStart,
      xHandleStart,
      yHandleStart,
      xHandleEnd,
      yHandleEnd,
      xAnchorEnd,
      yAnchorEnd
    }
  ) {
    const path = this.elem;

    const d = `M${xAnchorStart} ${yAnchorStart}C${xHandleStart} ${yHandleStart} ${xHandleEnd} ${yHandleEnd} ${xAnchorEnd} ${yAnchorEnd}`;

    path.setAttribute('class', 'path');
    path.setAttribute( 'd' , d );
    path.setAttribute( 'stroke' , 'white' );
    path.setAttribute( 'strokeWidth' , 10.0 );
    path.setAttribute( 'fill' , 'none' );

    return { path, d };
  }

  static getMovePoint(first, second) {
    const result = {};
    for (const key in first) {
      if (first[key] < second[key]) {
        result[key] = first[key] + 1;
      } else if (first[key] > second[key]) {
        result[key] = first[key] - 1;
      } else {
        result[key] = second[key];
      }
    }

    return result;
  }

  performAnimation(value) {
    const { d } = this.interpolateCurve(0, 1, value);
    this.elem.setAttribute( 'd' , d );
  }

  onChange(key, data) {
    const moveObject = {
      ...this.state.moveObject,
      [key]: data.target.value,
    };
    this.handleMove(moveObject);
  }

  handleMove(value) {
    const moveObject = {
      ...this.state.moveObject,
      ...value,
    };
    const p = Bezier.getMovePoint(this.state.coordinates, moveObject);
    this.setState({
      coordinates: p,
      moveObject,
    });
    this.performAnimation(moveObject);
  }

  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
  };

  onDragStart(e, key) {
    this.setState({
      xStart: e.x,
      yStart: e.y,
      key,
    }, () => {
      document.addEventListener('mousemove', this.handleMouseMove);
    });
  }

  handleMouseMove = (event) => {
    const { xStart, yStart, key } = this.state;
    const xDiff = xStart - event.pageX;
    const yDiff = yStart - event.pageY;

    const xKey = `x${key}`;
    const yKey = `y${key}`;
    const resultMove = {
      [xKey]: xStart - xDiff,
      [yKey]: yStart - yDiff
    };
    this.handleMove(resultMove);
  };

  render() {
    const { moveObject } = this.state;
    return (
      <div>
        <div className={'coordinates-wrapper'}>
          {COORDINATES.map((coordinate) => (
            <div key={coordinate.key} className={'coordinates'}>
              <span>{coordinate.title}:</span>
              <input
                onChange={value => this.onChange(coordinate.key, value)}
                type="text"
                value={moveObject[coordinate.key]}
              />
            </div>
          ))}
        </div>
        <div>
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%' }} height="1000" id="bezier">
            <path ref={elem => this.elem = elem}></path>
            {
              LINES.map((line, index) => (
                <line
                  key={index}
                  x1={moveObject[line.xStart]}
                  y1={moveObject[line.yStart]}
                  strokeWidth="1"
                  strokeDasharray="6"
                  stroke="white"
                  x2={moveObject[line.xEnd]}
                  y2={moveObject[line.yEnd]}
                />
              ))
            }
            {
              CIRCLES.map((circle) => (
                <Circle
                  key={circle.xKey}
                  handleMouseDown={() => this.onDragStart({ x: moveObject[circle.xKey], y: moveObject[circle.yKey] }, circle.xKey.slice(1))}
                  handleMouseUp={() => this.handleMouseUp()}
                  className={'circle'}
                  cx={moveObject[circle.xKey]}
                  cy={moveObject[circle.yKey]}
                />
              ))
            }
          </svg>
        </div>
      </div>
    );
  }
}

export default Bezier;
