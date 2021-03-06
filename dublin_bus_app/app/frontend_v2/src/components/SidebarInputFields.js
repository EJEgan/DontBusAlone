import React from 'react'
import { useState } from 'react'
import * as FaIcons from "react-icons/fa"
import * as FiIcons from "react-icons/fi"
import * as AiIcons from "react-icons/ai"
import * as IoIcons from "react-icons/io"
import Button from './Button'
// import DateTimePicker from "react-datetime-picker"
import { MuiPickersUtilsProvider, TimePicker, DateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { addDays, format } from 'date-fns';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import { setOrigin } from '../redux/origin';
import { setDestination } from '../redux/destination';
import { setDirectionsRenderBoolean } from '../redux/directionsRenderBool'
import { setDirectionsResponseBoolean } from '../redux/directionsResponseBool'
import { setShowAllStopsBoolean } from '../redux/showAllStopsBool';
import { setJourneyDate } from '../redux/journeyDate';
import { setTotalPredictedSeconds } from "../redux/totalPredictedSeconds";
import { setJourneyDateString } from '../redux/journeyDateString';
import { setLoading } from '../redux/loading';


const SidebarInputFields = ({stopData}) => {
    // Local variables which the user amends thorough selecting
    const [date, setDate] = useState(new Date());
    const [beginSelected, setBeginSelected] = useState(null);
    const [endSelected, setEndSelected] = useState(null);
    const [chosenDate, setChosenDate] = useState(new Date())
    const today = new Date()
    const [chosenTime, setChosenTime] = useState(today.getHours() + ':' + today.getMinutes());
    const [formattedDate, setFormattedDate] = useState()
    const options = stopData.map(stop => {
        return {value: stop.Latitude + ", " + stop.Longitude, 
                label: stop.ShortCommonName_en + " | " + stop.PlateCode}
    })

    // Redux global variables which are changed when user clicks to start journey planner process
    const { directionsRenderBoolean } = useSelector((state) => state.directionsRenderBoolean)
    console.log("render is currently set to ", directionsRenderBoolean)
    const { showAllStopsBoolean } = useSelector((state) => state.showAllStopsBoolean)
    const { origin } = useSelector((state) => state.origin)
    const { destination } = useSelector((state) => state.destination)
    const { journeyDate } = useSelector((state) => state.journeyDate)
    const dispatch = useDispatch();
    dispatch(setJourneyDate(format(date, 'yyyy-MM-dd')));

    // Journey start stop
    const changeBegin = (selected) => {
        setBeginSelected(selected.value);
        console.log(beginSelected, "is new origin");
    };

    //Journey end stop
    const changeEnd = (selected) => {
        setEndSelected(selected.value);
        console.log(endSelected, "is new origin");
    };

    // Departure time select
    const changeDate = (selected) => {
        setChosenDate(selected);
        console.log("DATE AS STRING_________________________", selected.toString())
        setFormattedDate(format(selected, 'yyyy-MM-dd'))
        dispatch(setJourneyDateString(selected.toString()))
        console.log(chosenDate, "is the chosen date")
    }

    const changeTime = (value) => {
        setChosenTime(value);
        console.log("CHOSEN TIME________________________", value);
    }

    // Global redux variable setting
    const setJourney = () => {
        if (beginSelected == null && endSelected == null){
            alert("Please select an Origin and Destination stop")
        } else if (beginSelected==null){
            alert("Please select an Origin stop")
        } else if (endSelected==null){
            alert("Please select a Destination stop")
        } else {
        dispatch(setOrigin(beginSelected));
        dispatch(setDestination(endSelected));
        dispatch(setDirectionsRenderBoolean(true));
        dispatch(setShowAllStopsBoolean(false));
        dispatch(setDirectionsResponseBoolean(true));
        dispatch(setJourneyDate(formattedDate));
        dispatch(setTotalPredictedSeconds(0));
        dispatch(setLoading(true));
        console.log(formattedDate, "is THE date WE should ALL see");
        }
    };

    return (
        <div>
            {console.log("In sidebar", stopData)}
            <h2><FiIcons.FiMapPin/> Origin</h2><br/>
            <Select options = {options} onChange={changeBegin}/><br/>
            <h2><FiIcons.FiMapPin/> Destination</h2><br/>
            <Select options = {options} onChange={changeEnd}/><br/>
            <h2><FaIcons.FaRegClock/> Departure</h2>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker format={"HH:mm, dd/MM/y"} minDate={new Date()} maxDate={addDays(new Date(), 13)} onChange={changeDate} value={chosenDate}/>
            </MuiPickersUtilsProvider>
            <Button text="Find Route" onClick={setJourney} />
                    <br/>
        </div>
    )
}

export default SidebarInputFields
