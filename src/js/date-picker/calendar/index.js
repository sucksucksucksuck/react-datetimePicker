/**
 * Created by SUN on 2016/11/29.
 */
import React from 'react';
import { findDOMNode } from 'react-dom'
let date = new Date();
console.log(date,"date3eee")
function propsToState(props) {
  return {
    week: props.week || true,
    year: props.year || date.getFullYear(),
    month: props.month === undefined ? date.getMonth() : props.month,
    active: props.active || {},
    day: [],
    mouseOver: props.mouseOver,
    tag: props.tag,
    shit: props.shit,
   	hour: props.hour || 0,
   	minute: props.minute || 0,
   	showM: props.showM ,
   	showY: props.showY  ,
   	changeYear: props.changeYear || [2016,2017,2018,2019,2020,2021],
   	pos: props.pos || 1
   
  };
}
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = propsToState(props);
    this.calculateDay();
//  console.log("this.state =", this.state);
    console.log("start",this.state)
  }


  componentWillReceiveProps(props,nextProps) {
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
//     console.log("days =", days);
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

  ItemClick(year, month, day) {
       console.log("年 =", year, "月 =", month + 1, "日 =", day);
//     this.setState({active: );
    if (this.props.onSelected) {
      this.props.onSelected({year: year, month: month, day: day, time: new Date(year, month, day).getTime()});
     if(this.state.tag==0){     
     	this.state.shit = day;
     	
       	let { week, year, month, active, tag, shit} = this.state;       	
       console.log("yessss",day,shit,month,year);
       this.setState({
			week: week,
			year: year,
			month: month,
			active: active,
			shit: day,
			tag: tag
		},()=>{
			this.props.onSelected({year: year, month: month, day: day, time: new Date(year, month, day).getTime()},shit,tag);
		})
       }
     else if(this.state.tag==1){
     	this.state.shit = day;
     	
       	let { week, year, month, active, tag, shit} = this.state;       	
       console.log("yessss",day,shit);
       this.setState({
			week: week,
			year: year,
			month: month,
			active: active,
			shit: day,
			tag: tag
		},()=>{
			this.props.onSelected({year: year, month: month, day: day, time: new Date(year, month, day).getTime()},shit,tag);
		})
     }
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
//      this.setState({mouseOver: now});
    }
  }
  
	previousMonth() {
		if(this.state.month&&this.state.month<=11){
		this.state.month--;			
		}
		else if(this.state.month===0){
			this.state.year--;
			this.state.month=11;
		}
		this.state.day=[];
//	this.props.callbackParent(this.state.month)
		let { week, year, month, active, day, tag} = this.state;
		console.log(week,year,month);
		this.setState({
			week: week,
			year: year,
			month: month,
			active: active,
			day: day,
			tag: tag
		},()=>{
			this.props.onPreviousMonth(year,month,tag);
		})

//	this.props.callbackParent(month-1)
		
//		console.log("should",this.props);
	
	}
	
	nextMonth() {
		if(this.state.month<11){
			this.state.month++;			
		}
		else if(this.state.month>=11){
				this.state.year++;
				this.state.month=0;
			}
		this.state.day=[];
		let { week, year, month, active, day, tag} = this.state;		
		console.log(week,year,month);
		this.setState({
			week: week,
			year: year,
			month: month,
			active: active,
			day: day,
			tag: tag
		},()=>{
			this.props.onNextMonth(year,month,tag);
			
		})
	}

shouldComponentUpdate(nextProps,nextState){
	
//	console.log("xxxxx",this.props,nextProps,nextState)
//	console.log(nextState.month)
	
	this.getMaxDate(this.state.year,this.state.month);
	this.getWeek(this.state.year,this.state.month,this.state.day);
	this.getWeekNumber(this.state.year,this.state.month);
	this.calculateDay();
	this.getMaxDiv();
	
//  console.log(this.state);
	return true;
}
historyView(){
	console.log(this.state);
}
selectClick(){
	console.log("click")

}
previousYear(){
	console.log("p Year");
	this.state.year--;
	this.state.day=[];
	let { week, year, month, active, day, tag} = this.state;
		console.log(week,year,month);
	
	this.setState({
			week: week,
			year: year,
			month: month,
			active: active,
			day: day,
			tag: tag
		},()=>{
			this.props.onPreviousMonth(year,month,tag);
		})
}
nextYear(){
	console.log("n Year")
	this.state.year++;
	this.state.day=[];
	let { week, year, month, active, day, tag} = this.state;
		console.log(week,year,month);
	
	this.setState({
			week: week,
			year: year,
			month: month,
			active: active,
			day: day,
			tag: tag
		},()=>{
			this.props.onPreviousMonth(year,month,tag);
		})
}
handleChange(e){
	console.log("xxx",e.target.value);
	this.state.hour = e.target.value;
	let { week, year, month, active, day,hour, tag} = this.state;
//		console.log(week,year,month);
	
	this.setState({
			week: week,
			year: year,
			month: month,
			active: active,
			day: day,
			tag: tag
		},()=>{
			this.props.onTimeChange(hour,tag);
		})
}
showMonth(){
	console.log("show month")
	this.state.showM = !this.state.showM;
	if(this.state.showY){
		this.state.showY = !this.state.showY;
		this.forceUpdate();
	}
	this.forceUpdate();
	
}
changeM(e){
	if(e.target.getAttribute('value')){
		this.state.month = e.target.getAttribute('value')-1;
		let { week, year, month, active, day, tag} = this.state;
		this.setState({
			week: week,
			year: year,
			month: month,
			active: active,
			day: day,
			tag: tag
		},()=>{
			this.props.onPreviousMonth(year,month,tag);
		})
	}
	
	
}
showYear(){
	this.state.showY = !this.state.showY;
		console.log("???",this.state.showY)	
	if(this.state.showM){
		this.state.showM = !this.state.showM;
		this.forceUpdate();
	}
	this.forceUpdate();	
	
}
preY(e){
	for(let i=0;i<this.state.changeYear.length;i++){
		this.state.changeYear[i]=this.state.changeYear[i]-6;
//		this.state.showY = true;
		this.forceUpdate();
		let { week, year, month, active, day, tag, changeYear, showY} = this.state;
	this.setState({
			week: week,
			year: year,
			month: month,
			active: active,
			day: day,
			tag: tag,
			changeYear: changeYear,
			showY: true
		},()=>{
			this.props.onPreviousMonth(year,month,tag,changeYear,showY);
		})
	}
	
}

selectY(e){
	console.log(e.target.getAttribute('value'));
	this.state.year = e.target.getAttribute('value');
	let { week, year, month, active, day, tag, changeYear} = this.state;
	this.setState({
			week: week,
			year: year,
			month: month,
			active: active,
			day: day,
			tag: tag,
			changeYear: changeYear
		},()=>{
			this.props.onPreviousMonth(year,month,tag,changeYear);
		})
}
nextY(){
		for(let i=0;i<this.state.changeYear.length;i++){
		this.state.changeYear[i]=this.state.changeYear[i]+6;
		this.forceUpdate();
		let { week, year, month, active, day, tag, changeYear, showY } = this.state;
	this.setState({
			week: week,
			year: year,
			month: month,
			active: active,
			day: day,
			tag: tag,
			changeYear: changeYear,
			showY: true
		},()=>{
			this.props.onPreviousMonth(year,month,tag,changeYear,showY);
		})
	}
}
time(e){
	let init = this.state.hour;
	if(e.target.value.length>5){
		e.target.value = e.target.value.substr(0,5)
	}
		let reg = /^([01][0-9]|2[0-3])(:[0-5][0-9]){1,2}$/;
			if(reg.test(e.target.value)){
				this.state.hour = e.target.value;
			}else {
				this.state.hour = init; 
			}
        	this.forceUpdate();
        	
}
fo(e){
	console.log(e.target.selectionStart,"start");
	console.log(e.target.selectionEnd,"end");
}
down(e){
	let keynum = String.fromCharCode(e.keyCode);//键盘输入的数字
	let curPos = e.target.selectionStart;
	let time = this.state.hour.split("");//time为数组
	switch(e.target.selectionStart){
		case 0:
//			let timeString = time.join("");//把字符串换为字符串
//			this.state.hour=timeString;
			if(keynum<=2){
			e.target.selectionEnd=1;
			}else if(keynum>2){
				e.target.selectionStart = 1;
				e.target.selectionEnd = 2;
			}
			break;
		case 1:
			e.target.selectionEnd=2;
			break;
		case 2: 
			e.target.selectionStart =3;
			e.target.selectionEnd =3;
			break;
		case 3:
//			console.log(3);
			e.target.selectionEnd=4 ;
			break;
		case 4: 
//			console.log(e.target.value,"123")
			e.target.selectionStart=4;
//			console.log(keynum);
			break;
		case 5:
			e.target.selectionStart=4;
//			console.log(5555555)
			break;
	}
		
}

componentDidUpdate(e) {
	
}
  render() {
    return (
      <div className={"calendar" + (this.state.week ? " week" : "")} onMouseMove={this.onMouseMove.bind(this)}>
      	<div className="history">
      	<p className="side" onClick={this.previousYear.bind(this)}>&lt;&lt;</p>
      	<p className="side" onClick={this.previousMonth.bind(this)}> &lt; </p>
    	<div className="cen">
    	<p className="bind" onClick={this.showYear.bind(this)}>{this.state.year}年</p>
    	{this.state.showY ? <div className="show-year">
    	<p onClick={this.preY.bind(this)}> &lt; </p>
    	<div className="year">
    	{this.state.changeYear.map(function(item,index){
    		return <span key={index} value={item} onClick={this.selectY.bind(this)}>{item}</span>
    	},this)}
    	</div>
    	<p onClick={this.nextY.bind(this)}> &gt; </p>
    	</div>:null}
    	<p className="bind" onClick={this.showMonth.bind(this)}>{this.state.month+1}月</p>
    	{this.state.showM ? <div className="show-month" 
    						onClick={this.changeM.bind(this)}>
    	<span value="1">1月</span>
    	<span value="2">2月</span>
    	<span value="3">3月</span>
    	<span value="4">4月</span>
    	<span value="5">5月</span>
    	<span value="6">6月</span>
    	<span value="7">7月</span>
    	<span value="8">8月</span>
    	<span value="9">9月</span>
    	<span value="10">10月</span>
    	<span value="11">11月</span>
    	<span value="12">12月</span>
    	</div> : null}
    	</div>
    	<p className="side" onClick={this.nextMonth.bind(this)}>&gt;</p>  
    	<p className="side" onClick={this.nextYear.bind(this)}>&gt;&gt;</p>
      	</div>
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
                      onClick={this.ItemClick.bind(this,item.year, item.month, item.day)}>
                <div>{item.day}</div>
              </span>)
            }
            return (
              <div key={index}
                   className={"day-item" + (active ? " active " : " ") + item.className}
                   data-date={JSON.stringify({year: item.year, month: item.month, day: item.day})}
                   onClick={this.ItemClick.bind(this, item.year, item.month, item.day)}>
                <div>{item.day}</div>
                	
              </div>)
          }
        }, this)}
        <div className="timeSelect">
        <input className="timepicker" type='text' 
        value={this.state.hour} 
        onChange={this.time.bind(this)}
       onKeyDown={this.down.bind(this)}
       onFocus={this.fo.bind(this)}
       /> </div>
       <div className="record">
       {this.state.year}年
       {this.state.month+1}月
       	{this.state.shit}日
       	{this.state.hour}
       </div>
        
      </div>
    );
  }
}