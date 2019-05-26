import React from "react";
import Ring from "ringjs";

import {
    TimeSeries,
    TimeRange,
    TimeEvent,
    Pipeline as pipeline,
    Stream,
    EventOut,
    percentile
} from "pondjs";
import io from "socket.io-client";
import { ChartContainer, ChartRow, Charts, YAxis, BarChart, ScatterChart, LineChart, Resizable, Legend, styler } from "react-timeseries-charts";

const sec = 1000;
const minute = 60 * sec;
const hours = 60 * minute;
const rate = 80;

class RealTimeChart extends React.Component {
    static displayName = "AggregatorDemo";

    state = {
        time: new Date(2019, 5, 22, 14, 32),
        events: new Ring(200),
        percentile50Out: new Ring(100),
        percentile90Out: new Ring(100),
        // endpoint: "http://127.0.0.1:3000",
        endpoint: "http://juice-shop-charles.us-west1-a.securethebox.us:3000",
        memory: {
            animation: false,
            labels:[],
            datasets: [
                {
                    data: []
                }
            ]
        }
    };

    getNewEvent = t => {
        const base = Math.sin(t.getTime() / 10000000) * 350 + 500;
        return new TimeEvent(t, parseInt(base + Math.random() * 1000, 10));
    };

    componentDidMount() {
        //
        // Setup our aggregation pipelines
        //

        const socket = io(this.state.endpoint);

        this.stream = new Stream();

        pipeline()
            .from(this.stream)
            .windowBy("5m")
            .emitOn("discard")
            .aggregate({
                value: { value: percentile(90) }
            })
            .to(EventOut, event => {
                const events = this.state.percentile90Out;
                events.push(event);
                this.setState({ percentile90Out: events });
            });

        pipeline()
            .from(this.stream)
            .windowBy("5m")
            .emitOn("discard")
            .aggregate({
                value: { value: percentile(50) }
            })
            .to(EventOut, event => {
                const events = this.state.percentile50Out;
                events.push(event);
                this.setState({ percentile50Out: events });
            });

        socket.on("esm_stats", (data) => {
            const t = new Date(this.state.time.getTime() + 60000);
            var memory = data['os'].memory ;
            try {
                const e = new TimeEvent(t,memory)
                // Raw events
                const newEvents = this.state.events;
                newEvents.push(e);
                
                this.setState({ time: t, events: newEvents });

                // Let our aggregators process the event
                this.stream.addEvent(e);
            }
            catch (error){
                console.log(error)
            }
            
            }
        );


        //
        // Setup our interval to advance the time and generate raw events
        //

        

        // const increment = minute;
        // this.interval = setInterval(() => {

            
        //     // const t = new Date(this.state.time.getTime() + increment);
        //     // // console.log("T:",t)
        //     // const event = this.getNewEvent(t);

        //     // // Raw events
        //     // const newEvents = this.state.events;
        //     // newEvents.push(event);
        //     // // console.log("NEW EVENT:",event)
        //     // this.setState({ time: t, events: newEvents });

        //     // // Let our aggregators process the event
        //     // this.stream.addEvent(event);
        // }, rate);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const latestTime = `${this.state.time}`;

        const fiveMinuteStyle = {
            value: {
                normal: { fill: "#619F3A", opacity: 0.2 },
                highlight: { fill: "619F3A", opacity: 0.5 },
                selected: { fill: "619F3A", opacity: 0.5 }
            }
        };

        const scatterStyle = {
            value: {
                normal: {
                    fill: "steelblue",
                    opacity: 0.5
                }
            }
        };

        //
        // Create a TimeSeries for our raw, 5min and hourly events
        //

        const eventSeries = new TimeSeries({
            name: "raw",
            events: this.state.events.toArray()
        });

        const perc50Series = new TimeSeries({
            name: "five minute perc50",
            events: this.state.percentile50Out.toArray()
        });

        const perc90Series = new TimeSeries({
            name: "five minute perc90",
            events: this.state.percentile90Out.toArray()
        });

        // Timerange for the chart axis
        const initialBeginTime = new Date(2019, 5, 22, 14, 32);
        const timeWindow = 2 * hours;

        let beginTime;
        const endTime = new Date(this.state.time.getTime() + minute);
        if (endTime.getTime() - timeWindow < initialBeginTime.getTime()) {
            beginTime = initialBeginTime;
        } else {
            beginTime = new Date(endTime.getTime() - timeWindow);
        }
        const timeRange = new TimeRange(beginTime, endTime);

        // Charts (after a certain amount of time, just show hourly rollup)
        const charts = (
            <Charts>
                <LineChart axis="y" series={eventSeries} style={scatterStyle} />
            </Charts>
        );

        const dateStyle = {
            fontSize: 12,
            color: "#AAA",
            borderWidth: 1,
            borderColor: "#F4F4F4"
        };

        const style = styler([
            { key: "perc50", color: "#C5DCB7", width: 1, dashed: true },
            { key: "perc90", color: "#DFECD7", width: 2 }
        ]);

        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <Legend
                            type="swatch"
                            style={style}
                            categories={[
                                {
                                    key: "perc50",
                                    label: "50th Percentile",
                                    style: { fill: "#C5DCB7" }
                                },
                                {
                                    key: "perc90",
                                    label: "90th Percentile",
                                    style: { fill: "#DFECD7" }
                                }
                            ]}
                        />
                    </div>
                    <div className="col-md-8">
                        <span style={dateStyle}>{latestTime}</span>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer timeRange={timeRange}>
                                <ChartRow height="150">
                                    <YAxis
                                        id="y"
                                        label="Value"
                                        min={0}
                                        max={100}
                                        width="70"
                                        type="linear"
                                    />
                                    {charts}
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
            </div>
        );
    }
}

// Export example
export default RealTimeChart;