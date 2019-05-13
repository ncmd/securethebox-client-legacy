import React, { Component } from 'react'
import { withStyles, Card, CardContent, Typography,
    //  Tabs, 
     Tab, Button } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { FuseAnimate } from '@fuse';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import FirebaseLoginTab from './tabs/FirebaseLoginTab';

const styles = theme => ({
    root: {
        background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + darken(theme.palette.primary.dark, 0.5) + ' 100%)',
        color: theme.palette.primary.contrastText
    }
});

class Login extends Component {

    state = {
        tabValue: 0,
    };


    componentDidMount() {
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

                                <Typography variant="h6" className="text-center md:w-full mb-48">LOGIN TO YOUR ACCOUNT</Typography>

                                <Tab
                                    icon={<img className="h-45"  src="assets/images/logos/stb.png" alt="SecureTheBox"/>}
                                    className="min-w-0"
                                    label="SecureTheBox"
                                />
                                {tabValue === 0 && <FirebaseLoginTab />}
                                <div className="flex flex-col items-center justify-center pt-32 pb-24">
                                    <span className="font-medium" style={{ color: 'black' }}>Don't have an account?</span>

                                    {/* <Link className="font-medium mt-8" to="/">Back to Dashboard</Link> */}

                                    <Link style={{ color: 'white' }} className="font-medium" to="/register">
                                        <Button variant="contained" color="secondary" className="w-full mx-auto mt-16 normal-case">
                                            Create an account
                                    </Button>
                                    </Link>

                                </div>

                            </CardContent>
                        </Card>
                    </FuseAnimate>
                </div>
            </div>


        )
    }
}

export default withStyles(styles, { withTheme: true })(withRouter(Login));
