/**
 * Created by sun_3211 on 2017/2/4.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Calendar from './date-picker/multi-month-view';

window.addEventListener("load", function () {
    ReactDOM.render(
        <Calendar/>,
        document.getElementById("app_main")
    );
}, true);