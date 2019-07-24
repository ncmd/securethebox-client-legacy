import React, { Component } from 'react';
import { withStyles, Paper, Hidden, Icon, IconButton, Fab, Typography, Stepper, Step, TextField,StepLabel, Grid } from '@material-ui/core';
import { FusePageSimple, FuseScrollbars,
    //  FuseCountdown 
    } from '@fuse';
import withReducer from 'app/store/withReducer';
import connect from 'react-redux/es/connect/connect';
import SwipeableViews from 'react-swipeable-views';
import { green } from '@material-ui/core/colors';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import reducer from '../store/reducers';
import * as Actions from '../store/actions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import OpenButton from '@material-ui/icons/OpenInNew';
import CourseSubmission from './CourseSubmission';
import CourseStart from './CourseStart';
import CourseResources from './CourseResources';
import CourseScenario from './CourseScenario';
import CourseScoring from './CourseScoring';
import CourseGradingCriteria from './CourseGradingCriteria';

const styles = theme => ({
    stepLabel: {
        cursor: 'pointer!important'
    },
    successFab: {
        background: green[500] + '!important',
        color: 'white!important'
    }
});


class Course extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            validUsername: false,
            rows: [
                { id: 1, name: 'splunk', description: 'Security Incident Event Management', url: 'https://splunk-userName.us-west1-a.securethebox.us' },
                { id: 2, name: 'splunk-cloudcmd', description: 'File manager, command-line console, text editor.', url: 'https://splunk-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 3, name: 'splunk-universal-forwarder', description: 'Parses logs in /var/log/challenge1 and indexes data to send to Splunk', url: 'https://splunk-universal-forwarder-userName.us-west1-a.securethebox.us' },
                { id: 4, name: 'splunk-universal-forwarder-cloudcmd', description: 'File manager, command-line console, text editor.', url: 'https://splunk-universal-forwarder-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 5, name: 'nginx-modsecurity', description: 'Web Application Firewall + Vulnerable Application', url: 'https://nginx-modsecurity-userName.us-west1-a.securethebox.us' },
                { id: 6, name: 'nginx-modsecurity-cloudcmd', description: 'File manager, command-line console, text editor.', url: 'https://nginx-modsecurity-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 7, name: 'juice-shop', description: 'Vulnerable Application', url: 'https://juice-shop-userName.us-west1-a.securethebox.us' },
                { id: 8, name: 'juice-shop-cloudcmd', description: 'File manager, command-line console, text editor.', url: 'https://juice-shop-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 9, name: 'wireshark', description: 'Deep Packet Inspection.', url: 'https://wireshark-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 10, name: 'suricata-cloudcmd', description: 'IDS/IPS, File manager, command-line console, text editor.', url: 'https://suricata-userName-cloudcmd.us-west1-a.securethebox.us' },
                { id: 11, name: 'logs location', description: 'All logs are saved to /var/log/challenge1' },
            ]
        };
    }

    componentDidMount() {
        /**
         * Get the Course Data
         */
        this.props.getCourse(this.props.match.params);

        this.setState({
            validUsername: false,
            username: ''
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /**
         * If the course is opened for the first time
         * Change ActiveStep to 1
         */
        if (this.props.course && this.props.course.activeStep === 0) {
            this.props.updateCourse({ activeStep: 1 });
        }
    }

    handleChangeActiveStep = (index) => {
        this.props.updateCourse({ activeStep: index + 1 });
    };

    handleNext = () => {
        this.props.updateCourse({ activeStep: this.props.course.activeStep + 1 });
    };

    handleBack = () => {
        this.props.updateCourse({ activeStep: this.props.course.activeStep - 1 });
    };


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


    renderScopeResources() {
        return (
            <div key={'balah'} className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64" >
                <Paper className="w-full rounded-8 p-16 md:p-24" elevation={1}>
                    <h1>Scope and Resources</h1>
                    <br />
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell padding="dense">Name</TableCell>
                                <TableCell align="left" padding="dense">Description</TableCell>
                                <TableCell align="left" padding="dense">URL</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rows.map(row => (
                                <TableRow key={row.id} >
                                    <TableCell component="th" scope="row" padding="dense">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="left" padding="dense">{row.description}</TableCell>
                                    <TableCell align="left" padding="dense">
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
                            required
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
                            error
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

    renderSubmission() {
        
    }

    render() {
        const { classes, course } = this.props;
        const activeStep = course && course.activeStep !== 0 ? course.activeStep : 1;

        return (
            <FusePageSimple
                classes={{
                    content: "flex flex-col flex-auto overflow-hidden",
                    header: "h-72 min-h-72"
                }}
                header={
                    <div className="flex flex-1 items-center px-16 lg:px-24">
                        <Hidden lgUp>
                            <IconButton
                                onClick={(ev) => this.pageLayout.toggleLeftSidebar()}
                                aria-label="open left sidebar"
                            >
                                <Icon>menu</Icon>
                            </IconButton>
                        </Hidden>
                        <IconButton
                            className="mr-16"
                            to="/apps/academy/courses"
                            component={Link}
                        >
                            <Icon>arrow_back</Icon>
                        </IconButton>
                        {course && (
                            <Typography className="flex-1 text-20">{course.title}</Typography>
                        )}
                    </div>
                }
                content={
                    course && (
                        <div className="flex flex-1 relative overflow-hidden">
                            <FuseScrollbars >
                            {/* <FuseScrollbars className="w-full overflow-auto"> */}
                                <SwipeableViews
                                    className="overflow-hidden"
                                    index={activeStep - 1}
                                    enableMouseEvents={false}
                                    onChangeIndex={this.handleChangeActiveStep}
                                >
                                    {course.steps.map((step, index) => {
                                        if (index === 1) {
                                            return (
                                                <CourseGradingCriteria key={step.id}/>
                                            )
                                        }
                                        if (index === 2) {
                                            return (
                                                <CourseScenario key={step.id}/>
                                            )
                                        }
                                        if (index === 3) {
                                            return (
                                                <CourseStart key={step.id}/>
                                            )
                                        }
                                        if (index === 4) {
                                            return (
                                                <CourseResources key={step.id}/>
                                            )
                                        }
                                        if (index === 5) {
                                            return (
                                                <CourseSubmission key={step.id}/>
                                            )
                                        }
                                        if (index === 6) {
                                            return (
                                                <CourseScoring key={step.id}/>
                                            )

                                        }

                                        else {
                                            return (
                                                <div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64" key={step.id}>
                                                    <Paper className="w-full max-w-lg rounded-8 p-16 md:p-24" elevation={1}>
                                                        <div dangerouslySetInnerHTML={{ __html: step.content }} />
                                                    </Paper>
                                                </div>
                                            )
                                        }

                                    }


                                    )}
                                </SwipeableViews>
                            </FuseScrollbars>

                            <div className="flex justify-center w-full absolute pin-l pin-r pin-b pb-16 md:pb-32">
                                <div className="flex justify-between w-full max-w-xl px-8">
                                    <div>
                                        {activeStep !== 1 && (
                                            <Fab className="" color="secondary" onClick={this.handleBack}>
                                                <Icon>chevron_left</Icon>
                                            </Fab>
                                        )}
                                    </div>
                                    <div>
                                        {activeStep < course.steps.length ? (
                                            <Fab className="" color="secondary" onClick={this.handleNext}>
                                                <Icon>chevron_right</Icon>
                                            </Fab>
                                        ) :
                                            (
                                                <Fab
                                                    className={classes.successFab}
                                                    to="/apps/academy/courses"
                                                    component={Link}
                                                >
                                                    <Icon>check</Icon>
                                                </Fab>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                leftSidebarContent={
                    course && (
                        <Stepper
                            classes={{ root: "bg-transparent" }}
                            activeStep={activeStep - 1}
                            orientation="vertical"
                        >
                            {course.steps.map((step, index) => {
                                return (
                                    <Step
                                        key={step.id}
                                        onClick={() => this.handleChangeActiveStep(index)}
                                    >
                                        <StepLabel classes={{ root: classes.stepLabel }}>{step.title}</StepLabel>
                                    </Step>
                                );
                            })}
                        </Stepper>
                    )
                }
                innerScroll
                onRef={instance => {
                    this.pageLayout = instance;
                }}
            />
        )
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getCourse: Actions.getCourse,
        updateCourse: Actions.updateCourse
    }, dispatch);
}

function mapStateToProps({ manageChallenge,academyApp }) {
    return {
        manageChallenge,
        course: academyApp.course
    }
}

export default withReducer('academyApp', reducer)(withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(Course)));
