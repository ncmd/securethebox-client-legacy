import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions';
import {
    withStyles,
    Paper,
} from '@material-ui/core';
import io from "socket.io-client";
import { defaults } from 'react-chartjs-2';
import { TimeSeries, TimeRangeEvent, TimeRange } from "pondjs";
import { ChartContainer, ChartRow, Charts, EventChart, Resizable} from "react-timeseries-charts";

defaults.global.animation = false;

const styles = theme => ({
    stepLabel: {
        cursor: 'pointer!important'
    },
    successFab: {
        background: 'red',
        color: 'white!important'
    }
});

const datenow = new Date()
const datenow2 = new Date()
datenow2.setMinutes( datenow2.getMinutes() + 5 );
// datenow2.setHours( datenow2.getHours() + 1 );
const dateIsoString = datenow.toISOString()
const thistimerange = new TimeRange(new Date(dateIsoString), new Date(datenow2.toISOString()))

class CourseScoring extends Component {

    constructor(props) {
        super(props);
        this.state = {
            appStatus:"offline",
            authenticationStatus:"failed",
            outageEvents: [],
            apiOutageEvents: [],
            series: new TimeSeries(),
            apiseries: new TimeSeries(),
            response: [],
            datapool: [],
            status:"Disconnected",
            endpoint: "https://localhost:6600",
            tracker:"",
            timerange: thistimerange,
            apitimerange: thistimerange,
        }
    }

    componentDidMount() {

        // interval every 1 second
        setInterval(
            () =>
            {
                const events = this.state.outageEvents.map(
                    ({ startTime, endTime, ...data }) =>
                        new TimeRangeEvent(new TimeRange(new Date(startTime), new Date(endTime)), data)
                );
                if (this.state.outageEvents.length > 0){
                    const firstTime = this.state.outageEvents[0]
                    const lastTime = this.state.outageEvents[this.state.outageEvents.length - 1]
                    const newTimeRange = new TimeRange(new Date(firstTime.startTime), new Date(lastTime.endTime))
                    // console.log("TIME RANGE:",firstTime.startTime,lastTime.endTime)
                    this.setState({
                        series: new TimeSeries({ name: "outages", events }),
                        timerange: newTimeRange
                    })
                }
            }, 1000
        );
        
        
        const socket = io("http://localhost:6600");
        socket.on('my_response', (data) => {
            let prevOutageEvents = this.state.outageEvents
            console.log("DATA -- ",data)
            this.setState({
                authenticationStatus: data.api_user_login
            })
           
            // prevOutageEvents.push(data)
            // if current status matches incoming status... modify outageEvent time
            if (data.app_status === "online" && this.state.appStatus != "online") {
                this.setState({appStatus: "online"})
                prevOutageEvents.push(data)
                this.setState({
                    outageEvents: prevOutageEvents
                }, () => {
                    // console.log("Outage Events:",this.state.outageEvents)
                }
                )
            } else if (data.app_status === "offline" && this.state.appStatus != "offline") {
                this.setState({appStatus: "offline"})
                prevOutageEvents.push(data)
                this.setState({
                    outageEvents: prevOutageEvents
                }, () => {
                    // console.log("Outage Events:",this.state.outageEvents)
                }
                )
            } else if (data.app_status === "online" && this.state.appStatus == "online") {
                this.setState({appStatus: "online"})
                prevOutageEvents[this.state.outageEvents.length - 1].endTime = data.endTime
                this.setState({
                    outageEvents: prevOutageEvents
                }, () => {
                    // console.log("Outage Events:",this.state.outageEvents)
                }
                )
            } else if (data.app_status === "offline" && this.state.appStatus == "offline") {
                this.setState({appStatus: "offline"})
                if (typeof data.endTime !== 'undefined' && typeof data.endTime !== undefined && this.state.outageEvents.length > 0 ){
                    prevOutageEvents[this.state.outageEvents.length - 1].endTime = data.endTime
                    this.setState({
                        outageEvents: prevOutageEvents
                    }, () => {
                        // console.log("Outage Events:",this.state.outageEvents)
                    }
                    )
                }
            }        
        })
    }

    handleTrackerChanged(tracker) {
        this.setState({ tracker });
    }
    handleTimeRangeChange(timerange) {
        this.setState({ timerange });
    }

    outageEventStyleFunc(event, state) {
        const color = event.get("app_status") === "online" ? "#28a745" : "#ff5858";
        switch (state) {
            case "normal":
                return {
                    fill: color
                };
            case "hover":
                return {
                    fill: color,
                    opacity: 0.4
                };
            case "selected":
                return {
                    fill: color
                };
            default:
            //pass
        }
    }

    apiOutageEventStyleFunc(event, state) {
        const color = event.get("api_user_login") === "success" ? "#28a745" : "#ff5858";
        switch (state) {
            case "normal":
                return {
                    fill: color
                };
            case "hover":
                return {
                    fill: color,
                    opacity: 0.4
                };
            case "selected":
                return {
                    fill: color
                };
            default:
            //pass
        }
    }

    render() {
        
        return (
            <div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64">
                <Paper className="w-full rounded-8 p-16 md:p-24" elevation={1}>
                <h1>Application Health</h1>
                <h2>Available Status: {this.state.appStatus}</h2>
                <Resizable>
                    <ChartContainer
                        timeRange={this.state.timerange}
                        enablePanZoom={false}
                        onTimeRangeChanged={ (date) => this.handleTimeRangeChange(date)}
                    >
                        <ChartRow height="30">
                            <Charts>
                                <EventChart
                                    series={this.state.series}
                                    size={30}
                                    style={this.outageEventStyleFunc}
                                    // label={e => e.get("title")}
                                />
                            </Charts>
                        </ChartRow>
                    </ChartContainer>
                </Resizable>
                <h2>API Status </h2>
                /rest/user/login - {this.state.authenticationStatus}
                <Resizable>
                    <ChartContainer
                        timeRange={this.state.timerange}
                        enablePanZoom={false}
                        onTimeRangeChanged={ (date) => this.handleTimeRangeChange(date)}
                    >
                        <ChartRow height="15">
                            <Charts>
                                <EventChart
                                    series={this.state.series}
                                    size={30}
                                    style={this.apiOutageEventStyleFunc}
                                    // label={e => e.get("title")}
                                />
                            </Charts>
                        </ChartRow>
                    </ChartContainer>
                </Resizable>
                <h3>Scoring Requirements</h3>
                <ul>
                    <li>Service (online ; frontend/backend)</li>
                    <li>APIs (making orders work)</li>
                    <li>Authentication (keep out unauthenticated users, allow users to login)</li>
                    <li>PII (confidentiality & integrity of user passwords and user information)</li>
                    <li>Performance (500 ms maximum load time)</li>
                </ul>
                {/* <RealTimeChart/> */}
                <h3>Backend (Express) </h3>
                <ul>
                    <li>Online</li>
                    <li>APIs</li>
                </ul>
                <ul>
                    <li>frequency of checks</li>
                    <li>success critera</li>
                    <li>uptime (Frontend, Database, Backend)</li>
                    <li>availability (Cache)</li>
                    <li>connection speed (ms)</li>
                    <li>business logic working</li>
                </ul>
                <h1>Scoring</h1>
                {/* <ScoringServiceChart/> */}
                <h2>Application Security</h2>
                <ul>
                    <li>OWASP TOP 10</li>
                    <li>Code Review</li>
                    <li>Code Review</li>
                </ul>
                <h2>Blue Team</h2>
                <ul>
                    <li>Monitoring</li>
                    <li>Packet Capture Analysis</li>
                    <li>Log Searching</li>
                    <li>Detection</li>
                    - WAF Rule Creation
                    - static-signature<br/>
                    - reversing<br/>
                    <li>Prevention</li>
                    - static-signature<br/>
                    - reversing<br/>
                </ul>
                <h2>Risk: Business Impact</h2>
                - Overall Risk (out of 100%)<br/>
                <ul>
                    <li>Financial 25%</li>
                    - revenue (gained / lost) per minute<br/>
                    - service uptime = revenue per minute<br/>
                    - operational costs (expense increases per violation)<br/>
                    - failure = bankrupt company<br/>
                    <li>Reputation 25%</li>
                    - brand awareness (good / bad)<br/>
                    - brand awareness (good / bad)<br/>
                    <li>Non-Compliance 25%</li>
                    - integriy of data<br/>
                    - passing audit<br/>
                    <li>Privacy Violation 25%</li>
                    - number of pii records discovered<br/>
                    - sensitive information exposed<br/>
                    - 
                </ul>
                </Paper>
            </div>
        )
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateFormState: Actions.updateFormState
    }, dispatch);
}

function mapStateToProps({ auth }) {
    return {
        user: auth.user
    }
}

export default (withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(CourseScoring)));
