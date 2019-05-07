import React from 'react';
import {FuseLoadable} from '@fuse';
import {Redirect} from 'react-router-dom';
import {authRoles} from 'app/auth';

export const AcademyAppConfig = {
    settings: {
        layout: {
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: false
                },
                footer        : {
                    display: false
                },
                leftSidePanel : {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    // settings:{
    //     layout: {}
    // },
    auth    : authRoles.user,
    routes  : [
        {
            path     : '/apps/academy/courses/:courseId/:courseHandle?',
            component: FuseLoadable({
                loader: () => import('./course/Course')
            })
        },
        {
            path     : '/apps/academy/courses',
            component: FuseLoadable({
                loader: () => import('./courses/Courses')
            })
        },
        {
            path     : '/apps/academy',
            component: () => <Redirect to="/apps/academy/courses"/>
        }
    ]
};
