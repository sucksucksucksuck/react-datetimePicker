import React from 'react'
import Calendar from './calendar';

export default class  extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    	calendar: [
    	{year: 2016, 
    		month: 11,
    		hour:"00:00", 
    		day:[],
    		tag:0,
    		shit:1,
    		showM: false,
   		showY: false,
   		changeYear:[2016,2017,2018,2019,2020,2021]
    	},
    	{year: 2017, 
    		month: 2, 
    	hour:"00:00", 
    		pos:0,
    		day:[],
    		tag:1,
    		shit:3,
    		showM: false,
   		showY: false,
   		changeYear:[2016,2017,2018,2019,2020,2021]
    	}
    	],
   		active: {}, 
   		mouseOver: false,
    }
  }
	
	

  onSelected(date,shit,tag) {
  	console.log("!!!!!",shit,tag);
  	let stateCopy = Object.assign({},this.state);
		stateCopy.calendar = stateCopy.calendar.slice();
		stateCopy.calendar[tag] = Object.assign({},stateCopy.calendar[tag]);
		stateCopy.calendar[tag].shit = shit;	
		this.setState(stateCopy);
    this.setState({active: date});
   	
  }
 
  onMouseOver(date) {
    this.setState({mouseOver: date});
  }

	previousMonth(year,month,tag,changeYear,showY){
		let stateCopy = Object.assign({},this.state);
		stateCopy.calendar = stateCopy.calendar.slice();
		stateCopy.calendar[tag] = Object.assign({},stateCopy.calendar[tag]);
		stateCopy.calendar[tag].year = year;
		stateCopy.calendar[tag].month = month;
		stateCopy.calendar[tag].changeYear = changeYear;
		stateCopy.calendar[tag].showY = showY;
		this.setState(stateCopy);
	}
	
	nextMonth(year,month,tag){
		let stateCopy = Object.assign({},this.state);
		stateCopy.calendar = stateCopy.calendar.slice();
		stateCopy.calendar[tag] = Object.assign({},stateCopy.calendar[tag]);
		stateCopy.calendar[tag].year = year;
		stateCopy.calendar[tag].month = month;
		this.setState(stateCopy);
	}
timeChange(hour,tag){
	let stateCopy = Object.assign({},this.state);
		stateCopy.calendar = stateCopy.calendar.slice();
		stateCopy.calendar[tag] = Object.assign({},stateCopy.calendar[tag]);
		stateCopy.calendar[tag].hour = hour;
		this.setState(stateCopy);
}

	
  render() {
    return (
      <div className="multi">
        {this.state.calendar.map(function (c, index) {
         //key是必要的，在组件中用到了map的都要设定不同的key
         return (<Calendar key={index}
          									{...c}
                            active={this.state.active}
                            mouseOver={this.state.mouseOver}
                            onSelected={this.onSelected.bind(this)}
                            onMouseOver={this.onMouseOver.bind(this)}
         										onPreviousMonth={this.previousMonth.bind(this)}
         										onNextMonth={this.nextMonth.bind(this)}
         										onTimeChange={this.timeChange.bind(this)}
        />)
        }, this)}
        
      
      
      </div>
    )
  }
}

//<input value={this.state.valu} onChange={(e)=>{
//	
// let d=	e.currentTarget.value;
//	this.state.valu="10:00:00";
//this.forceUpdate()
//	
//}} />