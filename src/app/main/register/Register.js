import React, { Component } from 'react'
import { withStyles, Card, CardContent, Tab, 
    // Tabs, 
    Typography, Button } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { FuseAnimate } from '@fuse';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import * as Actions from 'app/auth/store/actions';
import FirebaseRegisterTab from './tabs/FirebaseRegisterTab';
// import Auth0RegisterTab from './tabs/Auth0RegisterTab';
// import JWTRegisterTab from './tabs/JWTRegisterTab';

const styles = theme => ({
    root: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + darken(theme.palette.primary.dark, 0.5) + ' 100%)',
        color: theme.palette.primary.contrastText
    }
});

class Register extends Component {

    state = {
        tabValue: 0
    };

    handleTabChange = (event, value) => {
        this.setState({ tabValue: value });
    };

    form = React.createRef();

    disableButton = () => {
        this.setState({ canSubmit: false });
    };

    enableButton = () => {
        this.setState({ canSubmit: true });
    };

    onSubmit = (model) => {
        this.props.registerWithFirebase(model);
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.props.login.error && (this.props.login.error.displayName || this.props.login.error.password || this.props.login.error.email)) {
            this.form.updateInputsWithError({
                ...this.props.login.error
            });

            this.props.login.error = null;
            this.disableButton();
        }

        if (this.props.user.role !== 'guest') {
            const pathname = this.props.location.state && this.props.location.state.redirectUrl ? this.props.location.state.redirectUrl : '/';
            this.props.history.push({
                pathname
            });
        }
        return null;
    }

    render() {
        const { classes } = this.props;
        const { tabValue } = this.state;

        return (
            <div className={classNames(classes.root, "flex flex-col flex-auto flex-no-shrink items-center justify-center p-32")}>

                <div className="flex flex-col items-center justify-center w-full">

                    <FuseAnimate animation="transition.expandIn">

                        <Card className="w-full max-w-400 mx-auto m-16 md:m-0">

                            <CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">
                                <Typography variant="h6" className="text-center md:w-full mb-48">CREATE AN ACCOUNT</Typography>


                                <Tab
                                    icon={<img className="h-45" src="assets/images/logos/stb.png" alt="SecureTheBox" />}
                                    className="min-w-0"
                                    label="SecureTheBox"
                                />

                                {/* {tabValue === 0 && <JWTRegisterTab />} */}
                                {tabValue === 0 && <FirebaseRegisterTab />}
                                {/* {tabValue === 2 && <Auth0RegisterTab />} */}

                                <div className="flex flex-col items-center justify-center pt-32 pb-24">
                                    <span className="font-medium" style={{ color: 'black' }}>Already have an account?</span>

                                    <Link style={{ color: 'white' }} className="w-full font-medium mb-16" to="/login">
                                        <Button variant="contained" color="secondary" className="w-full mx-auto mt-16 normal-case">
                                            Log in
                                        </Button>
                                    </Link>

                                </div>

                                <div className="flex flex-col items-center">
                                </div>
                            </CardContent>
                        </Card>
                    </FuseAnimate>
                </div>
            </div>


        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        registerWithFirebase: Actions.registerWithFirebase
    }, dispatch);
}

function mapStateToProps({ auth }) {
    return {
        login: auth.login,
        user: auth.user
    }
}


export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(Register)));
