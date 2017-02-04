/**
 * Created by SUN on 2016/11/29.
 */
import React from 'react';
let date = new Date();
function propsToState(props) {
  return {
    week: props.week || true,
    year: props.year || date.getFullYear(),
    month: props.month === undefined ? date.getMonth() : props.month,
    active: props.active || {},
    day: [],
    mouseOver: props.mouseOver
  };
}
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = propsToState(props);
    this.calculateDay();
    //console.log("this.state =", this.state);
  }

  componentWillReceiveProps(props) {
    this.state = propsToState(props);
    this.calculateDay();
    this.forceUpdate();
  }

  getMaxDate(year, month) {
    if (month === undefined) {
      month = this.state.month;
    }
    return new Date(year || this.state.year, month + 1, 0).getDate();
  }

  getWeek(year, month) {
    if (month === undefined) {
      month = this.state.month;
    }
    return new Date(year || this.state.year, month, 1).getDay();
  }

  getWeekNumber(year, month, day) {
    if (month === undefined) {
      month = this.state.month;
    }
    let days = day || 1;
    // console.log("days =", days);
    //那一天是那一年中的第多少天
    for (let i = 0; i < month; i++) {
      // var d = this.getMaxDate(year || this.state.year, i);
      // console.log("d =", d, i);
      days += this.getMaxDate(year || this.state.year, i);
    }
    // var week = 0;
    // var yearFirstDay = new Date(year || this.state.year, 0, 1).getDay();
    // if (yearFirstDay == 0) {
    //   week = 0;
    // }
    // console.log("getWeekNumber =", year, month, day, week, days);
    return Math.ceil(days / 7);
  }

  getMaxDiv() {
    let row = 7;
    if (this.state.week) {
      row += 1;
    }
    return 6 * row;
  }

  onItemClick(year, month, day) {
    // console.log("年 =", year, "月 =", month + 1, "日 =", day);
    // this.setState({active: );
    if (this.props.onSelected) {
      this.props.onSelected({year: year, month: month, day: day, time: new Date(year, month, day).getTime()});
    }
  }

  calculateDay() {
    let nowDay = this.getMaxDate(this.state.year, this.state.month);
    let upDay = this.getMaxDate(this.state.year, this.state.month - 1);
    let firstWeek = this.getWeek();
    for (let index = 0; index < this.getMaxDiv(); index++) {
      let day = index;
      let month = this.state.month - 1;
      let year = this.state.year;
      if (month < 0) {
        month = 11;
        year -= 1;
      }
      if (this.state.week) {
        day = index - Math.floor(index / 8);
        if (index <= firstWeek) {
          day = upDay - firstWeek + day;
        } else if (day - firstWeek > nowDay) {
          day -= nowDay + firstWeek;
          month += 2;
        } else {
          month += 1;
          day = day - firstWeek;
        }
        if (index % 8 == 0) {
          let now = new Date(year, month, day + 1);
          let nowWeek = this.getWeekNumber(now.getFullYear(), now.getMonth(), now.getDate());
          //console.log("day =", day, nowWeek);
          this.state.day.push({
            week: nowWeek,
            className: now.getFullYear() == this.props.year && now.getMonth() == this.props.month ? "current" : "non"
          });
          continue;
        }
      } else {
        if (index < firstWeek) {
          day = upDay - firstWeek + day + 1;
        } else if (day - firstWeek >= nowDay) {
          month += 2;
          day -= nowDay + firstWeek - 1;
        } else {
          day = day - firstWeek + 1;
          month += 1;
        }
      }
      if (month > 11) {
        month %= 12;
        year++;
      }
      //console.log("date =", {year: year, month: month, day: day});
      this.state.day.push({
        year: year,
        month: month,
        day: day,
        time: new Date(year, month, day).getTime(),
        className: year == this.props.year && month == this.props.month ? "current" : "non"
      });
    }
  }

  onMouseMove(e) {
    if (e.target.dataset.date && this.state.active.day) {
      let d = JSON.parse(e.target.dataset.date);
      let now = new Date(d.year, d.month, d.day).getTime();
      if (this.props.onMouseOver) {
        this.props.onMouseOver(now);
      }
      //this.setState({mouseOver: now});
    }
  }

  render() {
    return (
      <div className={"calendar" + (this.state.week ? " week" : "")} onMouseMove={this.onMouseMove.bind(this)}>
        {this.state.week ? <div className="week-head">周</div> : null}
        <div className="day-head">周日</div>
        <div className="day-head">周一</div>
        <div className="day-head">周二</div>
        <div className="day-head">周三</div>
        <div className="day-head">周四</div>
        <div className="day-head">周五</div>
        <div className="day-head">周六</div>
        {this.state.day.map(function (item, index) {
          if (item.week) {
            return <div key={index} className={"week-item " + item.className}>{item.week}</div>;
          } else {
            let active = false;
            if (this.state.active.year == item.year && this.state.active.month == item.month && this.state.active.day == item.day) {
              active = true;
            }
            if (this.state.mouseOver && ((item.time >= this.state.mouseOver && item.time <= this.state.active.time) || (item.time >= this.state.active.time && item.time <= this.state.mouseOver))) {
              let isHead = item.time == this.state.active.time || item.time == this.state.mouseOver;
              return (
                <span key={index}
                      className={"day-item" + (active ? " active" : "") + (isHead ? " head " : " ") + item.className}
                      data-date={JSON.stringify({year: item.year, month: item.month, day: item.day})}
                      onClick={this.onItemClick.bind(this, item.year, item.month, item.day)}>
                <div>{item.day}</div>
              </span>)
            }
            return (
              <div key={index}
                   className={"day-item" + (active ? " active " : " ") + item.className}
                   data-date={JSON.stringify({year: item.year, month: item.month, day: item.day})}
                   onClick={this.onItemClick.bind(this, item.year, item.month, item.day)}>
                <div>{item.day}</div>
              </div>)
          }
        }, this)}
      </div>
    );
  }
}