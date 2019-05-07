import React, { Component } from 'react';
import withReducer from 'app/store/withReducer';
import connect from 'react-redux/es/connect/connect';
import { bindActionCreators } from 'redux';
import reducer from '../store/reducers';
import * as Actions from '../store/actions';
import { Form, Field } from 'react-final-form';
import {
    withStyles,
    Paper,
    Grid,
    Button,
    TextField
} from '@material-ui/core';
import axios from 'axios';
import FormStateToRedux from './FormStateToRedux'
import FormStateFromRedux from './FormStateFromRedux'
import store from "./store";
import { Provider } from "react-redux";
import firebaseService from '../../../../../app/services/firebaseService';
// import firebaseService from 'app/services/firebaseService';


const TextFieldWrapper = ({ input: { name, onChange, value, ...restInput }, meta, ...rest }) => {
    const showError = ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) && meta.touched;
    return (
        <TextField
            fullWidth
            {...rest}
            name={name}
            helperText={showError ? meta.error || meta.submitError : undefined}
            error={showError}
            inputProps={restInput}
            onChange={onChange}
            value={value}
            variant='outlined'
        />
    );
};

const styles = theme => ({
    stepLabel: {
        cursor: 'pointer!important'
    },
    successFab: {
        background: 'red',
        color: 'white!important'
    }
});

const validate = values => {
    const errors = {};
    return errors;
};

// const onSubmit = async values => {
//     const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
//     await sleep(300);
//     // window.alert(JSON.stringify(values, 0, 2));
//     this.props.sendAnswers(values)
// }

class CourseSubmission extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: 'test'
        };
    }

    componentDidMount() {
        // firebaseService.testAdd()
        // if (this.props.user.loading === true){
        //     console.log("LOADING:",this.props.user['data'].displayName)
        //     this.setState({
        //         username:this.props.user['data'].displayName
        //     })

           
        // }
    }

    iterateQuestions(object) {
        var savedRender = []
        for (var key in object) {
            if (!key.includes("_Answer")) {
                // console.log(key, object[key]);
                savedRender.push(
                    <div key={key}>
                        {object[key]}
                        <Field
                            fullWidth
                            required
                            name={key + '_Answer'}
                            component={TextFieldWrapper}
                            type="text"
                        />
                    </div>
                )
            }
        }
        return savedRender
    }

    submitAnswers(initialValues) {
        // var data = {solutionData: initialValues}
        console.log("PROPS:",this.props)
        // if (this.props.user.loading === true){
        //     console.log("LOADING:",this.props.user['data'].displayName)
        //     var data = {
        //         username: this.props.user['data'].displayName,
        //         challenge: 1,
        //         answers: initialValues
        //     }
        //     // axios.post('http://localhost:5000/api/solutions/challenges/1', initialValues);
        //     firebaseService.addSubmission(data)
            
        //     }
        // else{
        //     console.log("User not logged in")
        // }
        
       
    }

    render() {
        return (
            <Provider store={store}>
                <div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64">
                    <Form
                        onSubmit={this.submitAnswers}
                        initialValues={{
                            "1_Question": "What is the Source IP address that is attacking the Vulnerable Application?",
                            "2_Question": "What are the URLs of the resources the attacker successfully made attacks against?",
                        }}
                        validate={validate}
                        render={({ handleSubmit, form, submitting, pristine, values }) => (
                            <form onSubmit={handleSubmit} noValidate>
                                <FormStateToRedux form="example" />
                                <Paper style={{ padding: 16 }}>
                                    <Grid container alignItems="flex-start" spacing={8}>
                                        <Grid item xs={12}>
                                            {this.iterateQuestions(values)}
                                        </Grid>
                                        <Grid item style={{ marginTop: 16 }}>
                                            <Button
                                                type="button"
                                                variant="contained"
                                                onClick={form.reset}
                                                disabled={submitting || pristine}
                                            >
                                                Reset
                                        </Button>
                                        </Grid>
                                        <Grid item style={{ marginTop: 16 }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                disabled={submitting}
                                            >
                                                Submit
                                        </Button>
                                        </Grid>
                                    </Grid>
                                </Paper>
                                <Paper style={{marginTop:20}}>
                                    {/* <pre style={{ padding: 20 }}>{JSON.stringify(values, 0, 4)}</pre> */}
                                    <pre style={{padding:20}}>
                                        <FormStateFromRedux form="example" />
                                    </pre>
                                </Paper>
                            </form>
                        )}
                    />
                </div>
            </Provider>
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

export default withReducer('auth', reducer)(withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(CourseSubmission)));
