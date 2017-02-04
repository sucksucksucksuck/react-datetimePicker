import React from 'react'
import Calendar from './calendar';

export default class  extends React.Component {

  constructor(props) {
    super(props);
    this.state = {calendar: [{year: 2016, month: 11}, {year: 2017, month: 0}], active: {}, mouseOver: false}
  }

  onSelected(date) {
    this.setState({active: date});
  }

  onMouseOver(date) {
    this.setState({mouseOver: date});
  }

  render() {
    return (
      <div className="multi">
        {this.state.calendar.map(function (c, index) {
          return (<Calendar key={index} {...c}
                            active={this.state.active}
                            mouseOver={this.state.mouseOver}
                            onSelected={this.onSelected.bind(this)}
                            onMouseOver={this.onMouseOver.bind(this)}
          />)
        }, this)}
      </div>
    )
  }
}
