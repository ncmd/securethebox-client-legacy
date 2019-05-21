import React, { Component } from 'react';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import * as Actions from '../store/actions';
import {
    withStyles,
    Paper,
} from '@material-ui/core';
import ScoringServiceChart from './ScoringServiceChart';

const styles = theme => ({
    stepLabel: {
        cursor: 'pointer!important'
    },
    successFab: {
        background: 'red',
        color: 'white!important'
    }
});

class CourseScoring extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }

    // Check Service is up with POST requests
    checkServiceUp(serviceName, userName) {
        
    }


    render() {
        return (
            <div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64">
                <Paper className="w-full rounded-8 p-16 md:p-24" elevation={1}>
                <h1>Application Health</h1>
                <h3>Backend (Express) </h3>
                <ul>
                    <li>Online</li>
                    <li>APIs</li>
                </ul>
                <ul>
                    <li>frequency of checks</li>
                    <li>success critera</li>
                    <li>success critera</li>
                    <li>uptime (Frontend, Database, Backend)</li>
                    <li>availability (Cache)</li>
                    <li>connection speed (ms)</li>
                    <li>business logic working</li>
                </ul>
                <h1>Scoring</h1>
                <ScoringServiceChart/>
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
