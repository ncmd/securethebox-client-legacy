import React, { Component } from 'react';
import withReducer from 'app/store/withReducer';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import reducer from '../../../../../app/auth/store/reducers';
import * as Actions from '../../../../../app/auth/store/actions';
import {
    withStyles,
    Paper,
    Grid,
    Button,
    IconButton,
    TextField
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import OpenButton from '@material-ui/icons/OpenInNew';
import OnlineStatus from '@material-ui/icons/CheckCircle';
import OfflineStatus from '@material-ui/icons/Cancel';
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
                { id: 1, name: 'splunk', description: 'Security Incident Event Management', status: true, url: 'https://splunk-userName.us-west1-a.securethebox.us' },
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
            })
            this.setState({
                rows: prevRows
            })
        }
    }

    render() {
        return (

            <div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64">
                <Paper className="w-full rounded-8 p-16 md:p-24" elevation={1}>
                    <h1>Scope and Resources</h1>
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
                                    <TableCell align="center" padding="dense">
                                        {row.status ?
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

function mapStateToProps({ auth }) {
    return {
        user: auth.user
    }
}

export default withReducer('auth', reducer)(withStyles(styles, { withTheme: true })(connect(mapStateToProps)(CourseResources)));
