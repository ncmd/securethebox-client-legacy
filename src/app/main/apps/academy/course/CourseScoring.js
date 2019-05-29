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
import { ChartContainer, ChartRow, Charts, EventChart, Resizable,YAxis, LineChart, styler, Legend} from "react-timeseries-charts";
import moment from "moment";
import _ from "underscore";

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
            charts:[],
            appStatus:"offline",
            authenticationStatus:"failed",
            outageEvents: [],
            apiOutageEvents: [],
            lineEvents: [],
            lineData:[],
            series: new TimeSeries(),
            lineseries: new TimeSeries(),
            response: [],
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

                // const lineEvents = this.state.lineEvents.map(
                //     ({ startTime, endTime, ...data }) =>
                //     new TimeRangeEvent(new TimeRange(new Date(startTime), new Date(endTime)), data)
                // )

                const prevLineEvents = []
                _.each(this.state.lineData, val => {
                    const timestamp = moment(new Date(val["time"]));
                    const user_count = val["user_count"];
                    prevLineEvents.push([timestamp.toDate().getTime(), user_count]);
                });
                this.setState({
                    lineEvents: prevLineEvents
                })

                const prevLineSeries = new TimeSeries({ 
                    name: "user_count", 
                    columns: ["time","user_count"], 
                    points: this.state.lineEvents
                })
                this.setState({
                    lineseries: prevLineSeries
                })
                console.log("PREV LINE EVENTS -- ",prevLineEvents)
                console.log("LINE EVENTS -- ",this.state.lineEvents)
                console.log("LINE DATA -- ",this.state.lineData)
                console.log("LINE SERIES -- ",this.state.lineseries)

                // if (this.state.lineEvents.length > 0){
                //     let prevLineSeries = new TimeSeries({ 
                //         name: "user_count", 
                //         columns: ["startTime","user_count"], 
                //         points: lineEvents
                //     })
                //     // console.log("LINE EVENTS -- ",lineEvents)
                //     this.setState({
                //         lineseries: prevLineSeries
                //     })
                // }

                if (this.state.outageEvents.length > 0){
                    const firstTime = this.state.outageEvents[0]
                    const lastTime = this.state.outageEvents[this.state.outageEvents.length - 1]
                    const newTimeRange = new TimeRange(new Date(firstTime.startTime), new Date(lastTime.endTime))
                    this.setState({
                        series: new TimeSeries({ name: "outages", events }),
                        timerange: newTimeRange
                    })
                } 
            }, 5000
        );
        
        
        const socket = io("http://localhost:6600");
        socket.on('my_response', (data) => {
            let prevOutageEvents = this.state.outageEvents
            let prevLineData = this.state.lineData
            let starttimestamp = moment(new Date(data.startTime))
            let endtimestamp = moment(new Date(data.endTime))
            prevLineData.push({ "time": data.startTime,"user_count": data.user_count})
            
            this.setState({
                lineData: prevLineData,
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

    apiBasketOutageEventStyleFunc(event, state) {
        const color = event.get("basket_result") === "success" ? "#28a745" : "#ff5858";
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
    renderLineChartLegend(){
        const linestyle = styler([
            { key: "user_count", color: "#2ca02c", width: 5 },
            { key: "user_active", color: "#000000", width: 5 },
        ]);
        const legend = [
            {
                key: "user_count",
                label: "Registered Users"
            },
            {
                key: "user_active",
                label: "Active Users"
            }
        ];

        return (
            <div className="row">
                    <div className="col-md-12">
                        <Legend
                            type="line"
                            style={linestyle}
                            categories={legend}
                        />
                    </div>
                </div>
        )
    }

    renderLineChart(){
        const linestyle = styler([
            { key: "user_count", color: "#2ca02c", width: 3 }
        ]);
        if (this.state.lineEvents.length > 0){
            return (
                <Resizable>
                        <ChartContainer
                            title="Registered vs Active"
                            style={{
                                background: "#ffffff",
                                borderRadius: 8,
                                borderStyle: "solid",
                                borderWidth: 0,
                                borderColor: "#000000"
                            }}
                            titleStyle={{
                                color: "#EEE",
                                fontWeight: 500
                            }}
                            padding={20}
                            paddingTop={5}
                            paddingBottom={0}
                            timeRange={this.state.timerange}
                        >
                            <ChartRow height="300">
                                <YAxis
                                    id="user_count"
                                    label="users_registered"
                                    showGrid
                                    hideAxisLine
                                    transition={300}
                                    labelOffset={-10}
                                    min={0}
                                    max={50}
                                    format=",.0f"
                                    width="60"
                                    type="linear"
                                />
                                <Charts>
                                    <LineChart key="user_count" axis="user_count" style={linestyle} columns={["user_count"]} series={this.state.lineseries} />
                                </Charts>
                            </ChartRow>
                        </ChartContainer>
                    </Resizable>
            )
        } else {
            return (
                <div>Still Loading Events...</div>
            )
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
                /api/BasketItems - {this.state.authenticationStatus}
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
                                    style={this.apiBasketOutageEventStyleFunc}
                                    // label={e => e.get("title")}
                                />
                            </Charts>
                        </ChartRow>
                    </ChartContainer>
                </Resizable>
                /rest/basket/basket_id/checkout - {this.state.authenticationStatus}
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
                                    style={this.apiBasketOutageEventStyleFunc}
                                    // label={e => e.get("title")}
                                />
                            </Charts>
                        </ChartRow>
                    </ChartContainer>
                </Resizable>
                <h2>Users Status</h2>
                Registered
                Online
                {this.renderLineChartLegend()}
                {this.renderLineChart()}
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
