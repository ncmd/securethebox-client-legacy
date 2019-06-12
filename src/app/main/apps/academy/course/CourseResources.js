import React, { Component } from 'react';
import withReducer from 'app/store/withReducer';
import connect from 'react-redux/es/connect/connect';
import reducer from '../../../../../app/auth/store/reducers';
import {
    withStyles,
    Paper,
    IconButton,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import OpenButton from '@material-ui/icons/OpenInNew';
import OnlineStatus from '@material-ui/icons/CheckCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import ReactTable from "react-table";
import "react-table/react-table.css";


const styles = theme => ({
    stepLabel: {
        cursor: 'pointer!important'
    },
    successFab: {
        background: 'red',
        color: 'white!important'
    }
});


class CourseResources extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validUsername: false,
            username: '',
            rows: [
                { id: 1, name: 'splunk', credsUser: "admin", credsPass: "changeme", 
                references:[
                    {title:'Splunk Cheat Sheet',url:'https://lzone.de/cheat-sheet/Splunk'}
                ], 
                tipData: [
                    {image:'', detail:'source="/var/log/challenge1/nginx-charles.log"'}, 
                    {image:'', detail:'source="/var/log/challenge1/modsecurity-charles.log"'},
                    {image:'', detail:'Set time frame of search to REAL-TIME 1 hour window.'},
                    {image:'', detail:'Adjust to Verbose Mode search'},
                    {image:'', detail:'Consider the fields: status, http_method, uri_path, uri_query, http_user_agent, and http_referrer'},
                ], description: 'Security Incident Event Management', status: false, url: 'http://splunk-charles.us-west1-a.securethebox.us:8000/en-US/app/search/search', },
                { id: 2, name: 'nginx-modsecurity', description: 'Web Application Firewall + Vulnerable Application', status: false, url: 'http://nginx-modsecurity-userName.us-west1-a.securethebox.us' },
                { id: 3, name: 'nginx-modsecurity-cloudcmd', description: 'File manager, command-line console, text editor.', status: false, url: 'http://nginx-modsecurity-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 4, name: 'juice-shop' , credsUser: "admin", credsPass: "changeme", 
                references:[
                    {title:'Juice-Shop Source Code Repository', url:'https://github.com/bkimminich/juice-shop'},
                    {title:'About Juice-Shop',url:'https://www.owasp.org/index.php/OWASP_Juice_Shop_Project'},
                    {title:'Juice-Shop Attack Solutions',url:'https://github.com/bkimminich/pwning-juice-shop/blob/master/appendix/solutions.md'},
                    {title:'Juice-Shop Scoreboard', url:'http://juice-shop-charles.us-west1-a.securethebox.us/#/score-board'},
                    {title:'RCE Bug',url:'https://opsecx.com/index.php/2017/02/08/exploiting-node-js-deserialization-bug-for-remote-code-execution/'}
                ], 
                tipData: [
                    {image:'', detail:'Frontend/Client = Angular.js'},
                    {image:'', detail:'Backend/Server = Node.js+Express'},
                    {image:'', detail:'Authentication = SQL+JWT'},
                    {image:'', detail:'Change default passwords'},
                    {image:'', detail:'Patch code to prevent attacks'}
                ], description: 'Vulnerable  Application', status: false, url: 'http://juice-shop-userName.us-west1-a.securethebox.us' },
                { id: 5, name: 'juice-shop-cloudcmd', description: 'File manager, command-line console, text editor.', status: false, url: 'https://juice-shop-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 6, name: 'hashicorp-vault', 
                references: [
                    {title:'Setting up PKI with Hashicorp Vault', url:'https://www.vaultproject.io/docs/secrets/pki/index.html'}
                ],description: 'Public Key Infrastructure Management', status: false, url: 'http://hashicorp-vault-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 7, name: 'gitlab', description: 'Private source code respository', status: false, url: 'http://gitlab-userName.us-west1-a.securethebox.us' },
                { id: 7, name: 'jenkins', description: 'Continuous Integration & Continuous Deployment Server', status: false, url: 'http://jenkins-userName.us-west1-a.securethebox.us' },
                { id: 7, name: 'wazuh-manager', description: 'Manager of Wazuh Agent, Endpoint Protection (OSSEC)', status: false, url: 'http://wazuh-manager-userName.us-west1-a.securethebox.us' },
                { id: 8, name: 'suricata-cloudcmd', description: 'IDS/IPS, File manager, command-line console, text editor.', status: false, url: 'http://suricata-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 9, name: 'kolide-osquery', description: 'Query Endpoints for information', status: false, url: 'http://suricata-userName-cloudcmd.us-west1-a.securethebox.us' }
            ]
        };
    }
    // https://www.vaultproject.io/docs/secrets/pki/index.html

    componentDidMount() {

        if (typeof this.props.user['data'] != "undefined") {
            console.log("Loaded User data")
            var prevRows = this.state.rows

            this.state.rows.map((row, index) => {
                const oldURL = prevRows[index].url
                console.log(String(oldURL))
                const newURL = String(oldURL).replace("userName", this.props.user['data'].displayName);
                console.log(String(newURL))
                prevRows[index].url = newURL
                return null
            })
            this.setState({
                rows: prevRows
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.course && this.props.course.activeStep === 5) {
            // this.props.updateCourse({ activeStep: 4 });
            // this.getAllResourceStatus()
        }
    }


    getResourceStatusNew = async (serviceName, userName) => {
        let resourceStatus = await axios.get('http://' + serviceName + '&userName=' + userName)
        console.log(await resourceStatus['data'])
        let newData = await resourceStatus['data']
        var prevRows = this.state.rows
        this.state.rows.map((row, index) => {
            if (row.name === serviceName) {
                const oldStatus = prevRows[index].status
                console.log(String(oldStatus))
                const newStatus = newData
                console.log(String(newStatus))
                prevRows[index].status = newStatus
            }
            return null
        })
        this.setState({
            rows: prevRows
        })
    }


    getAllResourceStatus() {
        this.state.rows.map((row, index) => {
            if (row.name === "splunk" || row.name === "splunk-universal-forwarder" || row.name === "nginx-modsecurity" || row.name === "juice-shop") {
                let getstate = this.getResourceStatus(row.name, this.props.user['data'].displayName)
                if (getstate === false) {
                    this.getAllResourceStatus()
                }
            }
            return null
        })
    }

    getResourceStatus = async (serviceName, userName) => {
        // let data = { serviceName: serviceName, userName: userName }
        let resourceStatus = await axios.get('http://localhost:5000/api/kubernetes/challenges/1?serviceName=' + serviceName + '&userName=' + userName)
        // let { data } = await resourceStatus['data']
        console.log(await resourceStatus['data'])
        let newData = await resourceStatus['data']
        var prevRows = this.state.rows
        this.state.rows.map((row, index) => {
            if (row.name === serviceName) {
                const oldStatus = prevRows[index].status
                console.log(String(oldStatus))
                const newStatus = newData
                console.log(String(newStatus))
                prevRows[index].status = newStatus
            }
            return null
        })
        this.setState({
            rows: prevRows
        })
    }

    renderStatus(serviceName, status) {
        if (serviceName === "splunk" || serviceName === "splunk-universal-forwarder" || serviceName === "nginx-modsecurity" || serviceName === "juice-shop") {
            return (
                <TableCell align="center" padding="dense">
                    {status ?
                        <IconButton color="secondary" >
                            <OnlineStatus />
                        </IconButton>
                        :
                        <IconButton color="secondary" >
                            <CircularProgress
                                size={20}
                                thickness={4}
                            />
                        </IconButton>
                    }
                </TableCell>
            )
        } else {
            return (
                <TableCell align="center" padding="dense">
                    <IconButton color="secondary" >
                        <OnlineStatus />
                    </IconButton>
                </TableCell>
            )
        }
    }

    renderCredentials(user, password) {
        return (
            <div>
                <h2>Credentials:</h2>
                <ul>
                    <li>Username: {user}<br /></li>
                    <li>Password: {password}</li>
                </ul>
            </div>
        )
    }

    renderReferences(referenceData){
        return (
            <div>
                <h2>References:</h2>
                <ul>
                {
                    referenceData.references.map((value,index) => {
                        return (
                            <li key={index}>
                                {value.title}: <a href={value.url} target="_blank" >{value.url}</a>
                            </li>
                        )
                    })
                }
                </ul>
                
            </div>   
        )
    }

    renderTips(tipData) {
        return (
            <div>
                <h2>Tips:</h2>
                <ul>
                {
                    tipData.tipData.map((value,index) => {
                        return (
                            <li key={index}>
                                {value.detail}
                            </li>
                        )
                    })
                }
                </ul>
                
            </div>   
        )
    }


    renderReactTable() {
        return (
            <ReactTable
                data={this.state.rows}
                columns={[
                    {
                        Header: "Assets",
                        columns: [
                            {
                                Header: "Status",
                                accessor: "status",
                                maxWidth: 70,
                                Cell: row => (
                                    <span>
                                        <span style={{
                                            color: row.status === true ? '#ff2e00'
                                                : row.status === false ? '#ffbf00'
                                                    : '#57d500',
                                            transition: 'all .3s ease'
                                        }}>
                                            &#x25cf;
                                  </span> {
                                            row.status === true ? 'Online'
                                                : row.status === false ? 'Loading...'
                                                    : 'Online'
                                        }
                                    </span>
                                )
                            },
                            {
                                Header: "Name",
                                accessor: "name",
                                maxWidth: 250,
                            },
                            {
                                Header: "Description",
                                accessor: "description"
                            },
                            {
                                Header: "URL",
                                accessor: "url",
                                maxWidth: 60,
                                Cell: row => (
                                    <IconButton onClick={() => window.open(row.value, "_blank")} >
                                        <OpenButton />
                                    </IconButton>
                                )

                            }
                        ]
                    }
                ]}
                defaultPageSize={10}
                className="-striped -highlight"
                SubComponent={row =>
                    <div style={{ padding: '10px' }}>
                        {console.log(row.original)}
                        {this.renderCredentials(row.original.credsUser, row.original.credsPass)}
                        {this.renderReferences(row.original)}
                        {this.renderTips(row.original)}
                    </div>
                }
            />
        )
    }

    render() {
        return (

            <div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64">
                <Paper className="w-full rounded-8 p-16 md:p-24" elevation={1}>
                    <h1>Resources</h1>
                    <br />
                    Expand the row for details containing Credentials and Tips of each resource.<br/>
                    Click on URL button to view Resource.
                    <br />
                    {this.renderReactTable()}
                </Paper>
            </div>

        )
    };
}

function mapStateToProps({ auth, academyApp }) {
    return {
        user: auth.user,
        course: academyApp.course
    }
}

export default withReducer('auth', reducer)(withStyles(styles, { withTheme: true })(connect(mapStateToProps)(CourseResources)));
