import React, { Component } from 'react';
import withReducer from 'app/store/withReducer';
import connect from 'react-redux/es/connect/connect';
// import { bindActionCreators } from 'redux';
import reducer from '../../../../../app/auth/store/reducers';
// import * as Actions from '../../../../../app/auth/store/actions';
import {
    withStyles,
    Paper,
    // Grid,
    // Button,
    IconButton,
    // TextField
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import OpenButton from '@material-ui/icons/OpenInNew';
import OnlineStatus from '@material-ui/icons/CheckCircle';
// import OfflineStatus from '@material-ui/icons/Cancel';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

const styles = theme => ({
    stepLabel: {
        cursor: 'pointer!important'
    },
    successFab: {
        background: 'red',
        color: 'white!important'
    }
});

// const validate = values => {
//     const errors = {};
//     return errors;
// };

class CourseResources extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validUsername: false,
            username: '',
            rows: [
                { id: 1, name: 'splunk', description: 'Security Incident Event Management', status: false, url: 'https://splunk-userName.us-west1-a.securethebox.us' },
                { id: 2, name: 'splunk-cloudcmd', description: 'File manager, command-line console, text editor.', status: false, url: 'https://splunk-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 3, name: 'splunk-universal-forwarder', description: 'Parses logs in /var/log/challenge1 and indexes data to send to Splunk', status: false, url: 'https://splunk-universal-forwarder-userName.us-west1-a.securethebox.us' },
                { id: 4, name: 'splunk-universal-forwarder-cloudcmd', description: 'File manager, command-line console, text editor.', status: false, url: 'https://splunk-universal-forwarder-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 5, name: 'nginx-modsecurity', description: 'Web Application Firewall + Vulnerable Application', status: false, url: 'https://nginx-modsecurity-userName.us-west1-a.securethebox.us' },
                { id: 6, name: 'nginx-modsecurity-cloudcmd', description: 'File manager, command-line console, text editor.', status: false, url: 'https://nginx-modsecurity-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 7, name: 'juice-shop', description: 'Vulnerable Application', status: false, url: 'https://juice-shop-userName.us-west1-a.securethebox.us' },
                { id: 8, name: 'juice-shop-cloudcmd', description: 'File manager, command-line console, text editor.', status: false, url: 'https://juice-shop-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 9, name: 'wireshark', description: 'Deep Packet Inspection.', status: false, url: 'https://wireshark-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 10, name: 'suricata-cloudcmd', description: 'IDS/IPS, File manager, command-line console, text editor.', status: false, url: 'https://suricata-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 11, name: 'logs location', description: 'All logs are saved to /var/log/challenge1' },
            ]
        };
    }

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

            // setInterval(this.getAllResourceStatus(), 100);
            // this.getAllResourceStatus()
            // console.log(this.props.course)
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    
        if (this.props.course && this.props.course.activeStep === 4) {
            // this.props.updateCourse({ activeStep: 4 });
            this.getAllResourceStatus()
        }
    }

    getAllResourceStatus(){
        this.state.rows.map((row, index) => {
            if (row.name === "splunk" || row.name === "splunk-universal-forwarder" || row.name === "nginx-modsecurity" || row.name === "juice-shop") {
                let getstate = this.getResourceStatus(row.name,this.props.user['data'].displayName)
                if (getstate === false){
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

        // this.setState({
        //     serviceName: resourceStatus
        // })
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

    render() {
        return (

            <div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64">
                <Paper className="w-full rounded-8 p-16 md:p-24" elevation={1}>
                    <h1>Resources</h1>
                    <br />
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell padding="dense">Name</TableCell>
                                <TableCell align="left" padding="dense">Description</TableCell>
                                <TableCell align="center" padding="dense">Status</TableCell>
                                <TableCell align="center" padding="dense">URL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rows.map(row => (
                                <TableRow key={row.id} >
                                    <TableCell component="th" scope="row" padding="dense">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="left" padding="dense">{row.description}</TableCell>
                                    
                                    {this.renderStatus(row.name,row.status)}
                                    <TableCell align="center" padding="dense">
                                        <IconButton color="primary" href={row.url} target="_blank" aria-label="Open to new window">
                                            <OpenButton />
                                        </IconButton>
                                    </TableCell>
                                    
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>

        )
    };
}

function mapStateToProps({ auth,academyApp }) {
    return {
        user: auth.user,
        course: academyApp.course
    }
}

export default withReducer('auth', reducer)(withStyles(styles, { withTheme: true })(connect(mapStateToProps)(CourseResources)));
