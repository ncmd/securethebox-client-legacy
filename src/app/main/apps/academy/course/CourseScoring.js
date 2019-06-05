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
const dateToString = datenow.toString()
const thistimerange = new TimeRange(new Date(dateIsoString), new Date(datenow2.toISOString()))

class CourseScoring extends Component {

    constructor(props) {
        super(props);
        this.state = {
            charts:[],
            appStatus:"offline",
            authenticationStatus:"failed",
            outageEvents: [],
            comboOutageEvents: [],
            apiOutageEvents: [],
            user_count: 0,
            user_active:0,
            lineActiveEvents: [],
            lineEvents: [],
            lineData:[],
            series: new TimeSeries(),
            lineseries: new TimeSeries(),
            lineactiveseries: new TimeSeries(),
            response: [],
            status:"Disconnected",
            endpoint: "https://localhost:6600",
            tracker:"",
            timerange: thistimerange,
            apitimerange: thistimerange,
            latesttime: dateToString
        }
    }

    componentDidMount() {

        setInterval(
            () =>
            {
                console.log("OUTAGE EVENTS -- ",this.state.outageEvents)
                // if (this.state.outageEvents == [] || this.state.outageEvents.length == 0){
                //     let prevOutageEvents = this.state.outageEvents
                //     const datenow = new Date()
                //     const datenow2 = new Date()
                //     datenow2.setSeconds( datenow2.getSeconds() - 1 );
                //     // datenow2.setHours( datenow2.getHours() + 1 );
                //     const date1IsoString = datenow.toISOString().split('.')[0]
                //     const date2IsoString = datenow2.toISOString().split('.')[0] 
                //     console.log(date1IsoString,date2IsoString)

                //     prevOutageEvents.push({
                //         "startTime":date2IsoString,
                //         "endTime":date1IsoString,
                //         'app_status':'offline',
                //         'api_user_login':"failed",
                //         'basket_result':"failed", 
                //         'checkout_results':"failed", 
                //         'user_count': 0,
                //         'user_active':0,
                //         'title':'up'
                //     })
                //     this.setState({
                //         outageEvents: prevOutageEvents
                //     })
                // }
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
                    const user_count = val['user_count'];
                    if (prevLineEvents.length > 7199){
                        prevLineEvents.shift()
                        prevLineEvents.push([timestamp.toDate().getTime(), user_count]);
                    } else {
                        prevLineEvents.push([timestamp.toDate().getTime(), user_count]);
                    }
                });

                const prevLineActiveEvents = []
                _.each(this.state.lineData, val => {
                    const timestamp = moment(new Date(val["time"]));
                    const user_active = val['user_active'];
                    if (prevLineActiveEvents.length > 7199){
                        prevLineActiveEvents.shift()
                        prevLineActiveEvents.push([timestamp.toDate().getTime(), user_active]);
                    } else {
                        prevLineActiveEvents.push([timestamp.toDate().getTime(), user_active]);
                    }
                    // prevLineActiveEvents.push([timestamp.toDate().getTime(), user_active]);
                });


                this.setState({
                    lineActiveEvents: prevLineActiveEvents,
                    lineEvents: prevLineEvents
                })

                const prevLineSeries = new TimeSeries({ 
                    name: "user_count", 
                    columns: ["time","user_count"], 
                    points: this.state.lineEvents
                })
                const prevLineActiveSeries = new TimeSeries({ 
                    name: "user_active", 
                    columns: ["time","user_active"], 
                    points: this.state.lineActiveEvents
                })
                this.setState({
                    lineseries: prevLineSeries,
                    lineactiveseries: prevLineActiveSeries
                })

                if (this.state.outageEvents.length > 0){
                    const firstTime = this.state.outageEvents[0]
                    const lastTime = this.state.outageEvents[this.state.outageEvents.length - 1]
                    const newTimeRange = new TimeRange(new Date(firstTime.startTime), new Date(lastTime.endTime))
                    this.setState({
                        series: new TimeSeries({ name: "outages", events }),
                        timerange: newTimeRange
                    })
                }
            }, 1000
        );
        
        
        const socket = io("http://localhost:6600");
        socket.on("disconnect", () => {
            console.log("SCORING SERVER DISCONNECTED!")
        });
        socket.on('my_response', (data) => {
            let prevOutageEvents = this.state.outageEvents
            let prevComboOutageEvents = this.state.comboOutageEvents

            const newDate = new Date()
            this.setState({
                latesttime: newDate.toString()
            })
            // get trend of 5 ; get if all 5 or less is offline, then convert all to onlinec  
            if (prevComboOutageEvents.length > 24){
                prevComboOutageEvents.shift()
                prevComboOutageEvents.push(data.app_status)
                console.log(prevComboOutageEvents)
                this.setState({
                    comboOutageEvents: prevComboOutageEvents
                })
            } else {
                prevComboOutageEvents.push(data.app_status)
                console.log(prevComboOutageEvents)
                this.setState({
                    comboOutageEvents: prevComboOutageEvents
                })
            }
           
            let offlineCount = 0
            // converta all failed to success
            if (this.state.comboOutageEvents.length > 0){
                
                this.state.comboOutageEvents.map((value) => {
                    if (value == "offline"){
                        offlineCount+=1
                    }
                })
                console.log("OFFLINE COUNT:",offlineCount)
                // console.log("OUTAGE EVENTS:",this.state.outageEvents)
                // // if offline count is greater that 3, and if online for next events, then activate
                // if (offlineCount > 3 && offlineCount < 15 && this.state.appStatus == "online"){
                //     console.log("GREATER THAN 3; less than 15, app status is online....")
                //     let prevOutageEventsEdit = this.state.series
                //     console.log("SERIES:",this.state.series)
                //     for (var i = 0; i < 5; i++) {
                //         prevOutageEventsEdit[prevOutageEventsEdit.length - i].app_status = "online"
                //         prevOutageEventsEdit[prevOutageEventsEdit.length - i].api_user_login = "success"
                //         prevOutageEventsEdit[prevOutageEventsEdit.length - i].basket_result = "success"
                //         prevOutageEventsEdit[prevOutageEventsEdit.length - i].checkout_results = "success"
                //         this.setState({
                //             outageEvents: prevOutageEventsEdit,
                //             comboOutageEvents: []
                //         })
                //         // reset offline count
                //         console.log("RESET COUNT TO 0")
                //         offlineCount = 0
                //     }
                // }
            }
            

            this.recursiveLineData(data.user_count,data.user_active,data)

            this.setState({
                authenticationStatus: data.api_user_login
            })

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

                if (offlineCount > 15){
                    this.setState({appStatus: "offline"})
                    prevOutageEvents.push(data)
                    this.setState({
                        outageEvents: prevOutageEvents
                    }, () => {
                        // console.log("Outage Events:",this.state.outageEvents)
                    }
                    )
                } else {
                    console.log("MODIFYING OFFLINE...")
                    this.setState({appStatus: "online"})
                    let prevData = data
                    prevData.app_status = "online"
                    prevData.api_user_login = "success"
                    prevData.basket_result = "success"
                    prevData.checkout_results = "success"
                    prevOutageEvents[prevOutageEvents.length - 1].endTime = data.endTime
                    prevOutageEvents.push(prevData)                    
                    this.setState({
                        outageEvents: prevOutageEvents
                    }, () => {
                        // console.log("Outage Events:",this.state.outageEvents)
                    }
                    )
                }


                
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

    recursiveLineData(user_count, user_active, data){
        // 0 fix this shit
        let user_count_counter = user_count
        let user_active_counter = user_active
        let prevLineData = this.state.lineData
        if (prevLineData.length > 0 && prevLineData[prevLineData.length - user_count_counter]!== undefined && prevLineData[prevLineData.length - user_active_counter]!== undefined){
            console.log("POINTER COUNTER:",user_count_counter,"USER COUNT:",prevLineData[prevLineData.length - user_count_counter].user_count)
            console.log("POINTER COUNTER:",user_active_counter,"USER ACTIVE:",prevLineData[prevLineData.length - user_active_counter].user_active)
        }
        
        if ((prevLineData.length > 0 && prevLineData[prevLineData.length - user_count_counter] !== undefined && prevLineData[prevLineData.length - user_active_counter] !== undefined) && data.user_count == 0 && data.user_active == 0){
            if (prevLineData[prevLineData.length - user_count_counter].user_count > 0 && prevLineData[prevLineData.length - user_active_counter].user_active > 0 ){
                // prevLineData.push({ "time": data.startTime,"user_count": prevLineData[user_count_counter].user_count})
                prevLineData.push({ "time": data.startTime,"user_count": prevLineData[user_count_counter].user_count,"user_active": prevLineData[user_active_counter].user_active})
                this.setState({
                    user_count:prevLineData[user_count_counter].user_count,
                    user_active:prevLineData[user_active_counter].user_active,
                    lineData: prevLineData
                })
            } else {
                user_count_counter += 1
                user_active_counter += 1
                this.recursiveLineData(user_count_counter,user_active_counter,data)
            }
        } else if (user_count_counter > 0 && data.user_count > 0 && user_active_counter > 0 && data.user_active > 0)  {
            // prevLineData.push({ "time": data.startTime,"user_count": data.user_count})
            prevLineData.push({ "time": data.startTime,"user_count": data.user_count, "user_active":data.user_active})
            this.setState({
                user_count: data.user_count,
                user_active: data.user_active,
                lineData: prevLineData
            })
        } else {
            if (prevLineData.length > 0 && user_count_counter < 5 && user_active_counter < 5){
                user_count_counter += 1
                user_active_counter += 1
                this.recursiveLineData(user_count_counter,user_active_counter,data)
            }
        }
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
            { key: "user_active", color: "#0091ea", width: 5 },
            { key: "time", color: "#ffffff", width: 5 },
        ]);
        const legend = [
            {
                key: "user_count",
                label: "Registered Users: "+this.state.user_count
            },
            {
                key: "user_active",
                label: "Active Users: "+this.state.user_active
            },
            {
                key: "time",
                label: this.state.latesttime
            }
        ];

        const dateStyle = {
            fontSize: 12,
            color: "#AAA",
            borderWidth: 1,
            borderColor: "#F4F4F4"
        };

        return (
            <div className="row">
                <div className="col-md-12">
                    <Legend
                        type="swatch"
                        style={linestyle}
                        categories={legend}
                    />
                </div>
            </div>
        )
    }

    renderLineChart(){
        const linestyle = styler([
            { key: "user_count", color: "#2ca02c", width: 3 },
            { key: "user_active", color: "#0091ea", width: 3 }
        ]);
        if (this.state.lineEvents.length > 0){
            return (
                <Resizable>
                        <ChartContainer
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
                            <ChartRow height="200">
                                <YAxis
                                    id="user_count"
                                    showGrid
                                    hideAxisLine
                                    transition={100}
                                    min={0}
                                    max={Math.ceil(this.state.user_count/10)*10}
                                    format=",.0f"
                                    width="1"
                                    type="linear"
                                />
                                <Charts>
                                    <LineChart key="user_count" axis="user_count" style={linestyle} columns={["user_count"]} series={this.state.lineseries} />
                                    <LineChart key="user_active" axis="user_count" style={linestyle} columns={["user_active"]} series={this.state.lineactiveseries} />
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

    renderOutageChart(){
        if (this.state.outageEvents.length > 0){
            return (
                <div>
                    Available Status: {this.state.appStatus}
                    <Resizable>
                        <ChartContainer
                            timeRange={this.state.timerange}
                            enablePanZoom={false}
                            onTimeRangeChanged={ (date) => this.handleTimeRangeChange(date)}
                            paddingLeft="10"
                            paddingRight="10"
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
                            paddingLeft="10"
                            paddingRight="10"
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
                            paddingLeft="10"
                            paddingRight="10"
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
                            paddingLeft="10"
                            paddingRight="10"
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
                </div>
            )
        } else {
            return (
                <div>Still Loading...</div>
            )
        }
        
    }


    render() {
        
        return (
            <div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64">
                <Paper className="w-full rounded-8 p-16 md:p-24" elevation={1}>
                <h1>Application Health</h1>
                {this.renderOutageChart()}
                <h2>Users Status</h2>
                {this.renderLineChartLegend()}
                {this.renderLineChart()}
            Depends in which team, Prod sec vs Corp sec, etc. 
            In general, know SSL / TLS, PKI, practical encryption, OWASP Top 10, strong Linux skills (including bash pipelines for text processing), strong scripting skills (e.g. Python), secure architecture. If a prod sec position add code auditing and some real SWE experience. If Corp sec add MDM, DLP, EDR, and infrastructure experience.
                <h2>General Knowledge</h2>
                <ul>
                    <li>SSL</li>
                    <li>TLS</li>
                    <li>PKI</li>
                    <li>Practical Encryption</li>
                    <ul>
                        <li>HSM</li>
                        <li>Bcrypt</li>
                    </ul>
                    <li>OWASP TOP 10</li>
                        <ul>
                            <li>INJECTION</li>
                            <ul>
                                <li>Escaping</li>
                                <li>Sanitization</li>
                                <li>Prepared Statements</li>
                                <li>Input Validation - server side</li>
                                <li>Use LIMIT within SQL queries</li>
                                <li>In order to prevent, must edit the /routes/login.js file - https://snyk.io/blog/sql-injection-orm-vulnerabilities/</li>
                                <li>https://medium.com/@tkssharma/node-js-with-sequelize-orm-tutorials-9cf8235de9ab</li>
                                <li>Answer: </li>
                                {/* Line 49? - models.sequelize.query('SELECT * FROM Users WHERE email = ? AND password = \'' + insecurity.hash(req.body.password || '') + '\'', { model: models.User, plain: true, logging: console.log, replacements: [req.body.email], type: models.sequelize.QueryTypes.SELECT }) */}
                            </ul>
                            <li>BROKEN AUTHENTICATION</li>
                            <ul>
                                <li>Multi-Factor</li>
                                <li>Change Default Credentials</li>
                                <li>Password Complexity</li>
                                <li>Session ID not in URL</li>
                            </ul>
                            <li>XSS</li>
                            <ul>
                                <li>'http-only' and 'secure' flag added to cookie/session in nginx by using proxy_cookie_path - https://geekflare.com/httponly-secure-cookie-nginx/</li>
                                <li>Content Security Policy</li>
                                <ul>
                                    <li>can be in nginx 'add_header' - https://gist.github.com/plentz/6737338</li>
                                    <li>can be in express/backend helmetjs framework - https://github.com/helmetjs/csp</li>
                                    <li>more about helmet csp - https://helmetjs.github.io/docs/csp/</li>
                                    <li>In order to prevent, edit the "server.js" file in juice-shop app</li>
                                </ul>
                            </ul>
                            <li>CSRF</li>
                            <ul>
                                <li>nonces</li>
                                <li>forcing re-authentication</li>
                            </ul>
                        </ul>
                    <li>Linux Skills</li>
                    <ul>
                        <li>Bash</li>
                        <li>Pipelines for Text Processing</li>
                    </ul>
                    <li>Scripting Skills</li>
                    <ul>
                        <li>Python</li>
                        <li></li>
                    </ul>
                </ul>

                <h2>Database Status</h2>
                    - queries
                <h2>Data Security Status</h2>
                <ul>
                    <li>PII</li>
                    <li>CIA</li>
                    <li>Business Impact</li>
                </ul>
                <h3>Scoring Requirements</h3>
                <ul>
                    <li>Service (online ; frontend/backend) done</li>
                    <li>APIs (making orders work) done</li>
                    <li>Authentication (keep out unauthenticated users, allow users to login) almost</li>
                    <li>PII (confidentiality & integrity of user passwords and user information)</li>
                </ul>
                <h1>Scoring</h1>
                <h2>Application Security</h2>
                <ul>
                    <li>SDLC</li>
                    <li>Bug Bounty</li>
                    <li>OWASP TOP 10</li>
                        <ul>
                            <li>INJECTION</li>
                            <ul>
                                <li>Escaping</li>
                                <li>Sanitization</li>
                                <li>Prepared Statements</li>
                                <li>Input Validation - server side</li>
                                <li>Use LIMIT within SQL queries</li>
                            </ul>
                            <li>BROKEN AUTHENTICATION</li>
                            <ul>
                                <li>Multi-Factor</li>
                                <li>Change Default Credentials</li>
                                <li>Password Complexity</li>
                                <li>Session ID not in URL</li>
                            </ul>
                            <li>XSS</li>
                            <ul>
                                <li>http-only</li>
                                <li>Content Security Policy</li>
                            </ul>
                            <li>CSRF</li>
                            <ul>
                                <li>nonces</li>
                                <li>forcing re-authentication</li>
                            </ul>
                        </ul>
                    <li>Code Review</li>
                        <ul>
                            <li>Authorization</li>
                            <li>JWT</li>
                            <li>CSRF</li>
                        </ul>
                </ul>
                <h2>Blue Team</h2>
                <ul>
                    <li>Monitoring</li>
                        <ul>
                            <li>Dashboards</li>
                            <li>Correlation</li>
                            <li>Alerts</li>
                        </ul>
                    <li>Packet Capture Analysis</li>
                        <ul>
                            <li>Malware Traffic Analysis</li>
                        </ul>
                    <li>Log Searching</li>
                    <li>Detection & Prevention</li>
                    <ul>
                        <li>WAF Rule Creation (On Mod Security)</li>
                        <li>YARA Rules (On Yara Guardian)</li>
                        <li>Wazuh </li>
                        <li>DNS Record Blacklisting</li>
                    </ul>
                </ul>
                <h2>Risk: Business Impact</h2>
                <ul>
                    <li>PKI</li>
                    <li>TLS/SSL</li>
                    <li>Overall Risk (out of 100%)</li>
                </ul>
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
