import React, { Component } from 'react';
import withReducer from 'app/store/withReducer';
import connect from 'react-redux/es/connect/connect';
import reducer from '../../../../../app/auth/store/reducers';
import {
    withStyles,
    Paper,
    Grid,
    Button,
    TextField
} from '@material-ui/core';

class Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validUsername: false,
            username: ''
        };
    }

    componentDidMount() {
    
    }

    render() {
        return (
            <div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64">
                <Paper className="w-full rounded-8 p-16 md:p-24" elevation={1}>
                    <h1>Challenge Creator</h1>
                    <h3>Select Apps</h3>
                    <h1>Add Topology</h1>
                    <h3>Add Questions</h3>
                    <h3>Add Solution</h3>
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

export default withReducer('auth', reducer)((connect(mapStateToProps)(Create)));
