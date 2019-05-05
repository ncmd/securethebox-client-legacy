import mock from './../mock';
import _ from '@lodash';
import {amber, blue, blueGrey, green} from '@material-ui/core/colors';

const demoSteps = [
    {
        'id'     : '0',
        'title'  : 'Overview',
        'content': '<h1>Overview</h1>' +
            '</br>This challenge assesses your skills in defending, responding, and preventing attacks against a web application.</li>' +
            '</br></br>'+
            '<ul>'+
            '<li>You will be graded on a Blue Team Incident Response scenario.</li>' +
            '<li>Time to complete this challenge is 2 hours.</li>' +
            '<li>You will not be provided answers after this challenge, but your results will be emailed to you.</li>' +
            '<li>Candidates will demonstrate skill and experience with the following:</li><br/>'+
            '<ul>'+
            '<li>Linux CLI experience</li>'+
            '<li>Web Application Pentesting & Defense</li>'+
            '<li>Fullstack Development (Frontend/Backend/Database)</li>'+
            '<li>Scripting with bash/python/go/ruby/etc. </li>'+
            '<li>Reviewing code</li>'+
            '<li>Working with Web Application Firewalls</li>'+
            '<li>Analyzing log data with Splunk, ELK Stack, or classic Regular Expression techniques.</li>'+
            '<li>Experience with packet inspection</li>'+
            '<li>Creating YARA rules on Network/Host IDS/IPS</li>'+
            '<li>Experience with Operating System/Network Forensics</li>'+
            '</ul>'+
            '</ul>' +
            '<br/>' +   
            '</br>'
    },
    {
        'id'     : '1',
        'title'  : 'Grading Criteria',
        'content': '<h1>Grading Criteria</h1>' +
        '</br><ul>'+
        '<li>Identify asset under attack.</li>'+
        '<li>Stop the attack in progress.</li>'+
        '<li>Cut off the attack vector.</li>'+
        '<li>Identify timeline of attack.</li>'+
        '<li>Identify app vulnerabilities.</li>'+
        '<li>Identify attacker artifacts.</li>'+
        '<li>Apply additional mitigations, </li>'+
        '<li>Apply monitoring solutions.</li>'+
        '<li>Identify compromised data/files/etc.</li>'+
        '<li>Forensic analysis of compromised systems.</li>'+
        '</ul>'
    },
    {
        'id'     : '2',
        'title'  : 'Scenario',
        'content': 
            '<h1>Scenario</h1>' +
            '</br><ul>'+
            '<li>You receive alerts of an attack in progress against a web application from your SIEM (Splunk) and Web Application Firewall (Modsecurity)</li>' +
            '<li>There is an active attacker attempting hack your company\'s web application, detect and prevent them from exfiltrating sensitive customer information!</li>'+
            '<li>If you are not able to stop the attacker, identify artifacts to identify what information was taken'+
            '<li>INCLUDE IMAGE OF ARCHITECTURE HERE</li>'+
            '</ul>'
    },
    {
        'id'     : '3',
        'title'  : 'Start Challenge',
        'content': '<h1>Start Challenge</h1>' +
            '<br>' +
            'When you are ready, click the Start Challenge button to begin.' +
            '<br><br>' +
            '<ul>'+
            '<li>You challenge environment will take 2 minutes to deploy</li>'+
            '<li>A timer will start a countdown</li>' +
            '<li>After your time is over, or you complete the challenge, the environment will be destroyed</li>' +
            '<li>If you\'re stuck, check the resources section for tips.</li>'+
            '</ul>'+
            '<br>' +
            'Good Luck and Have Fun!'
    },
    {
        'id'     : '4',
        'title'  : 'Scope & Resources',
        'content': '<h1>Scope & Resources</h1>' +
        '</br>Here are your resources:'+
        '</br></br>'+
        '<ul>'+
        '<li> <a href="http://traefik.us-west1-a.securethebox.us" target="_blank">Traefik - http://traefik.us-west1-a.securethebox.us</a></li>'+
        '<li> <a href="http://splunk-oppa.us-west1-a.securethebox.us" target="_blank">Splunk - http://splunk-oppa.us-west1-a.securethebox.us</a></li>'+
        '<li> <a href="http://nginx-modsecurity-oppa.us-west1-a.securethebox.us" target="_blank">Web Application Firewall - http://nginx-modsecurity-oppa.us-west1-a.securethebox.us</a></li>'+
        '<li> <a href="http://juice-shop-oppa.us-west1-a.securethebox.us" target="_blank">Vulnerable App - http://app-oppa.us-west1-a.securethebox.us</a></li>'+
        '</ul>' +
        '</br>'
    },
    {
        'id'     : '5',
        'title'  : 'Submission',
        'content': '<h1>Submission</h1>' +
            '<br>' +
            'Submit the answers to the challenge here:' +
            '<br><br>' +
            ''
    },
    {
        'id'     : '6',
        'title'  : 'Congratulations!',
        'content': '<h1>Congratulations</h1>' +
            '<br>' +
            'Congrats on your attempt on the challenge!.' +
            '<br><br>' +
            'Your time has ran out or you finished it early!' +
            '<br><br>' +
            'Results are emailed to you and the company.'
    }
];

const academyDB = {
    categories: [
        {
            'id'   : 0,
            'value': 'web',
            'label': 'Web',
            'color': blue[500]
        },
        {
            'id'   : 1,
            'value': 'firebase',
            'label': 'Firebase',
            'color': amber[500]
        },
        {
            'id'   : 2,
            'value': 'cloud',
            'label': 'Cloud',
            'color': blueGrey[500]
        },
        {
            'id'   : 3,
            'value': 'android',
            'label': 'Android',
            'color': green[500]
        }
    ],
    courses   : [
        {
            'id'         : '15459251a6d6b397565',
            'title'      : 'Challenge 1',
            'slug'       : 'challenge-1',
            'description': 'Defense Scenario',
            'category'   : 'web',
            'length'     : 120,
            'totalSteps' : 11,
            'activeStep' : 0,
            'steps'      : demoSteps
        }
    ]
};

mock.onGet('/api/academy-app/categories').reply(() => {
    return [200, academyDB.categories];
});

mock.onGet('/api/academy-app/courses').reply(() => {
    return [200, academyDB.courses.map((_course) => _.omit(_course, ['steps']))];
});

mock.onGet('/api/academy-app/course').reply((request) => {
    const {courseId} = request.params;
    const response = _.find(academyDB.courses, {id: courseId});
    return [200, response];
});

mock.onPost('/api/academy-app/course/save').reply((request) => {
    const data = JSON.parse(request.data);
    let course = null;

    academyDB.courses = academyDB.courses.map(_course => {
        if ( _course.id === data.id )
        {
            course = data;
            return course
        }
        return _course;
    });

    if ( !course )
    {
        course = data;
        academyDB.courses = [
            ...academyDB.courses,
            course
        ]
    }

    return [200, course];
});

mock.onPost('/api/academy-app/course/update').reply((request) => {
    const data = JSON.parse(request.data);
    academyDB.courses = academyDB.courses.map(_course => {
        if ( _course.id === data.id )
        {
            return _.merge(_course, data);
        }
        return _course;
    });

    return [200, data];
});
