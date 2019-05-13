import React, { Component } from 'react';
import withReducer from 'app/store/withReducer';
import connect from 'react-redux/es/connect/connect';
// import { bindActionCreators } from 'redux';
import reducer from '../../../../../app/auth/store/reducers';
// import * as Actions from '../../../../../app/auth/store/actions';
import {
    withStyles,
    Paper,
    Grid,
    Button,
    TextField
} from '@material-ui/core';

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

class CourseStart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            validUsername: false,
            username: ''
        };
    }

    componentDidMount() {
        if (typeof this.props.user['data'] != "undefined") {
            this.setState({
                username: this.props.user['data'].displayName,
                validUsername: true
            })
        }
    }

    handleChangeUsername = username => event => {
        this.setState({
            [username]: event.target.value,
        }, () => {
            this.handleVerifyUsername(this.state.username)
        });
    };


    handleVerifyUsername = (username) => {
        const usernameRegex = /[^a-zA-Z0-9]/
        if (!usernameRegex.test(username) && username.length > 0 && this.state.username !== '') {
            this.setState({ validUsername: true })
        } else {
            this.setState({ validUsername: false })
        }
    }

    manageChallenge(clusterName, userName, action) {
        let data = { clusterName: clusterName, userName: userName, action: action }
        axios.post('http://localhost:5000/api/kubernetes/challenges/1', data);
    }

    renderUsernameTextField() {
        return (
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
            >
                <Grid item xs>
                    {this.state.validUsername ?
                        <TextField
                            disabled
                            helperText="Enter a unique name for your challenge environment"
                            id="outlined-required"
                            label="username"
                            placeholder="nomadhacker"
                            margin="normal"
                            variant="outlined"
                            value={this.state.username}
                            onChange={this.handleChangeUsername('username')}
                        />
                        :
                        <TextField
                            disabled
                            helperText="No spaces and special characters"
                            id="outlined-required"
                            label="username"
                            placeholder="nomadhacker"
                            margin="normal"
                            variant="outlined"
                            value={this.state.username}
                            onChange={this.handleChangeUsername('username')}
                        />

                    }

                </Grid>
            </Grid>
        )
    }

    render() {
        return (

            <div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64">
                <Paper className="w-full max-w-lg rounded-8 p-16 md:p-24" elevation={1}>
                    <h1>Start Challenge</h1>
                    <br />
                    <ul>
                        <li>When you are ready, click the "Start Challenge" button to begin.</li>
                        <li>You challenge environment will take 2 minutes to deploy.</li>
                        <li>When the environment is ready, a timer will start a 2 hour countdown.</li>
                        <li>The next page "Scope & Resources" will contain all the information you need for this challenge.</li>
                        <li>After your time is over, or you complete the challenge, the environment will be analyzed and destroyed.</li>
                        <li>If you're stuck, review the "Scope & Resources" page for tips.</li>
                        <li>If you would like to end the challenge and destroy the environment, click on "End Challenge" button.</li>
                    </ul>
                    <br />
                    {this.renderUsernameTextField()}
                    <Grid
                        container
                        direction="row"
                        justify="center"
                        alignItems="center"

                    >
                        <Grid item xs>
                            <Grid
                                container
                                direction="column"
                                justify="center"
                                alignItems="center"

                            >
                                <Grid item xs>
                                    {this.state.validUsername ?
                                        <Button
                                            variant="contained" color="secondary"
                                            onClick={() => this.manageChallenge('us-west1-a', this.state.username, 'apply')}
                                        >
                                            Start Challenge
                                        </Button>
                                        :

                                        <Button
                                            disabled
                                            variant="contained" color="secondary"
                                        >
                                            Start Challenge
                                        </Button>
                                    }

                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid item xs>
                            <Grid
                                container
                                direction="column"
                                justify="center"
                                alignItems="center"
                            >
                                <Grid item xs>
                                    {this.state.validUsername ?
                                        <Button
                                            variant="outlined" color="secondary"
                                            onClick={() => this.manageChallenge('us-west1-a', this.state.username, 'delete')}
                                        >
                                            End Challenge
                                                                        </Button>
                                        :

                                        <Button
                                            disabled
                                            variant="outlined" color="secondary"
                                        >
                                            End Challenge
                                                                        </Button>
                                    }
                                </Grid>

                            </Grid>

                        </Grid>

                    </Grid>
                    <br />
                    <br />
                    <Grid
                        container
                        direction="column"
                        justify="center"
                        alignItems="center"

                    >
                        <Grid item xs>
                            <h2>Good Luck and Have Fun!</h2>
                        </Grid>
                    </Grid>

                </Paper>
            </div>

        )
    };
}

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({
//         updateFormState: Actions.updateFormState
//     }, dispatch);
// }

function mapStateToProps({ auth }) {
    return {
        user: auth.user
    }
}

export default withReducer('auth', reducer)(withStyles(styles, { withTheme: true })(connect(mapStateToProps)(CourseStart)));
