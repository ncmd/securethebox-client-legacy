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
import ConsoleButton from '@material-ui/icons/Computer';
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
                { 
                    id: 0, 
                    name: 'juice-shop' , 
                    credsUser: "admin@someemail.com", 
                    credsPass: "admin123", 
                    references:[
                        {title:'Juice-Shop Source Code Repository', url:'https://github.com/bkimminich/juice-shop'},
                        {title:'About Juice-Shop',url:'https://www.owasp.org/index.php/OWASP_Juice_Shop_Project'},
                        {title:'Juice-Shop Attack Solutions',url:'https://github.com/bkimminich/pwning-juice-shop/blob/master/appendix/solutions.md'},
                        {title:'Juice-Shop Scoreboard', url:'http://juice-shop-charles.us-west1-a.securethebox.us/#/score-board'},
                        {title:'RCE Bug',url:'https://opsecx.com/index.php/2017/02/08/exploiting-node-js-deserialization-bug-for-remote-code-execution/'},
                        {title:'Node-Vault node library',url:'https://github.com/kr1sp1n/node-vault'},
                        {title:'CSurf node library',url:'https://github.com/expressjs/csurf'}
                    ], 
                    tipData: [
                        {image:'', detail:'Frontend/Client = Angular.js'},
                        {image:'', detail:'Backend/Server = Node.js+Express'},
                        {image:'', detail:'Authentication = SQL+JWT'},
                        {image:'', detail:'Change default passwords'},
                        {image:'', detail:'Patch code in gitlab repository to fix vulnerabilities'},
                        {image:'', detail:'Use Node-Vault library to request for secrets'},
                        {image:'', detail:'Use CSurf middleware to add csrf token to requests'},
                        {image:'', detail:'https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Content_Security_Policy_Cheat_Sheet.md'},
                    ], 
                    description: 'Main Application and most Valueable service. Keep this service up at all times apply your knowledge of security.', 
                    status: false, 
                    url: 'http://juice-shop-userName.us-west1-a.securethebox.us',
                    shell: 'http://juice-shop-userName-cloudcmd.us-west1-a.securethebox.us'
                },
                { 
                    id: 1, 
                    name: 'splunk', 
                    credsUser: "admin", 
                    credsPass: "Changeme", 
                    references:[
                        {title:'Splunk Cheat Sheet',url:'https://lzone.de/cheat-sheet/Splunk'}
                    ], 
                    tipData: [
                        {image:'', detail:'source="/var/log/challenge1/nginx-charles.log"'}, 
                        {image:'', detail:'source="/var/log/challenge1/modsecurity-charles.log"'},
                        {image:'', detail:'Set time frame of search to REAL-TIME 1 hour window.'},
                        {image:'', detail:'Adjust to Verbose Mode search'},
                        {image:'', detail:'Consider the fields: status, http_method, uri_path, uri_query, http_user_agent, and http_referrer'},
                    ], 
                    description: 'Security Incident Event Management', 
                    status: false, 
                    url: 'http://splunk-charles.us-west1-a.securethebox.us:8000/en-US/app/search/search',
                    shell: 'http://splunk-userName-cloudcmd.us-west1-a.securethebox.us',
                },
                { 
                    id: 2, 
                    name: 'nginx-modsecurity',
                    references:[
                        {title:'Splunk Cheat Sheet',url:'https://lzone.de/cheat-sheet/Splunk'}
                    ], 
                    tipData: [
                        {image:'', detail:'source="/var/log/challenge1/nginx-charles.log"'}, 
                        {image:'', detail:'source="/var/log/challenge1/modsecurity-charles.log"'},
                        {image:'', detail:'Set time frame of search to REAL-TIME 1 hour window.'},
                        {image:'', detail:'Adjust to Verbose Mode search'},
                        {image:'', detail:'Consider the fields: status, http_method, uri_path, uri_query, http_user_agent, and http_referrer'},
                    ],
                    description: 'Load Balancer + Web Application Firewall', 
                    status: false, 
                    url: 'http://nginx-modsecurity-userName.us-west1-a.securethebox.us',
                    shell: 'http://nginx-modsecurity-userName-cloudcmd.us-west1-a.securethebox.us'
                },
                { 
                    id: 4, 
                    name: 'hashicorp-vault',
                    credsUser: "root_token:", 
                    credsPass: "keys:", 
                    references: [
                        {title:'Setting up PKI with Hashicorp Vault', url:'https://www.vaultproject.io/docs/secrets/pki/index.html'},
                        {title:'Vault Hardening', url:'https://learn.hashicorp.com/vault/day-one/production-hardening'},
                        {title:'Node-Vault node library', url:'https://github.com/kr1sp1n/node-vault'},
                        {title:'Adopting Vault', url:'https://www.hashicorp.com/resources/adopting-hashicorp-vault'},
                    ],
                    tipData: [
                        {image:'', detail:'Use Jenkins to Create Secrets'},
                        {image:'', detail:'Use Node-Vault to get Secrets'},
                        {image:'', detail:'Create policies for read/write'}
                    ], 
                    description: 'Secrets and Public Key Infrastructure Management', 
                    status: false, 
                    url: 'http://hashicorp-vault-userName.us-west1-a.securethebox.us',
                    shell: 'http://hashicorp-vault-userName-cloudcmd.us-west1-a.securethebox.us', 
                },
                { 
                    id: 5, 
                    name: 'hashicorp-consul',
                    credsUser: "no authentication", 
                    credsPass: "", 
                    references: [
                        {title:'Setting up PKI with Hashicorp Vault', url:'https://www.vaultproject.io/docs/secrets/pki/index.html'},
                        {title:'Vault Hardening', url:'https://learn.hashicorp.com/vault/day-one/production-hardening'},
                        {title:'Node-Vault node library', url:'https://github.com/kr1sp1n/node-vault'},
                        {title:'Adopting Vault', url:'https://www.hashicorp.com/resources/adopting-hashicorp-vault'},
                    ],
                    tipData: [
                        {image:'', detail:'Use Jenkins to Create Secrets'},
                        {image:'', detail:'Use Node-Vault to get Secrets'},
                        {image:'', detail:'Create policies for read/write'}
                    ], 
                    description: 'Persistant Key-Value Store', 
                    status: false, 
                    url: 'http://hashicorp-vault-userName.us-west1-a.securethebox.us',
                    shell: 'http://hashicorp-vault-userName-cloudcmd.us-west1-a.securethebox.us', 
                },
                { 
                    id: 6, 
                    name: 'gitlab',
                    credsUser: "root", 
                    credsPass: "Changeme", 
                    references: [
                        {title:'Gitlab Git Cheatsheet', url:'https://about.gitlab.com/images/press/git-cheat-sheet.pdf'},
                        {title:'Github Security Best Practices Cheat Sheet',url:'https://snyk.io/blog/ten-git-hub-security-best-practices/'}
                    ],
                    tipData: [
                        {image:'', detail:'You can edit code directly from the Repository'},
                        {image:'', detail:'Use Node-Vault to get Secrets'},
                        {image:'', detail:'Create policies for read/write'}
                    ], 
                    description: 'Source Code Respository',
                    status: false, 
                    url: 'http://gitlab-userName.us-west1-a.securethebox.us',
                    shell: 'http://gitlab-userName-cloudcmd.us-west1-a.securethebox.us',
                },
                { 
                    id: 7, 
                    name: 'jenkins',
                    credsUser: "no authentication", 
                    credsPass: "", 
                    references: [
                        {title:'Jenkins Cheatsheet', url:'https://www.edureka.co/blog/cheatsheets/jenkins-cheat-sheet/'},
                    ],
                    tipData: [
                        {image:'', detail:'When a changes happens in github project, jenkins run "git pull" command on juice-shop docker container to update changes to app'},
                        {image:'', detail:'Update and Replace Credentials'},
                        {image:'', detail:'Edit the "deploy-to-kubernetes" job'},
                        {image:'', detail:'Run "Setup Security" to add authentication '},
                        {image:'', detail:'You do not need to "build" a docker image or "deploy" (takes too much cpu sorry...)'}
                    ], 
                    description: 'Continuous Integration & Continuous Deployment Server', 
                    status: false, 
                    url: 'http://jenkins-userName.us-west1-a.securethebox.us',
                    shell: 'http://jenkins-userName-cloudcmd.us-west1-a.securethebox.us',
                },
                { 
                    id: 8, 
                    name: 'wazuh-manager [UNAVAILABLE]', 
                    description: 'Manager of Wazuh Agent, Endpoint Protection (OSSEC)', 
                    status: false, 
                    url: 'http://wazuh-manager-userName.us-west1-a.securethebox.us',
                    shell: 'http://wazuh-manager-userName-cloudcmd.us-west1-a.securethebox.us' 
                },
                { 
                    id: 9, 
                    name: 'suricata [UNAVAILABLE]', 
                    description: 'IDS/IPS, File manager, command-line console, text editor.', 
                    status: false, 
                    url: 'http://suricata-userName.us-west1-a.securethebox.us',
                    shell: 'http://suricata-userName-cloudcmd.us-west1-a.securethebox.us' 
                },
                { 
                    id: 10, 
                    name: 'kolide-osquery [UNAVAILABLE]', 
                    description: 'Query Endpoints for information', 
                    status: false, 
                    url: 'http://kolide-osquery-userName.us-west1-a.securethebox.us',
                    shell: 'http://kolide-osquery-userName-cloudcmd.us-west1-a.securethebox.us' 
                }
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
                const oldShellURL = prevRows[index].shell
                console.log(String(oldURL))
                const newURL = String(oldURL).replace("userName", this.props.user['data'].displayName);
                const newShellURL = String(oldShellURL).replace("userName", this.props.user['data'].displayName);
                console.log(String(newURL))
                prevRows[index].url = newURL
                prevRows[index].shell = newShellURL
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
                                Header: "SHELL",
                                accessor: "shell",
                                maxWidth: 90,
                                Cell: row => (
                                    <IconButton onClick={() => window.open(row.value, "_blank")} >
                                        <ConsoleButton />
                                    </IconButton>
                                )

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
