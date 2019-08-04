import React from 'react';
import {FuseLoadable} from '@fuse';
import {authRoles} from 'app/auth';

export const ChallengeCreatorAppConfig = {
    settings: {
        layout: {
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: true
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
    auth   : authRoles.user,
    routes  : [
        {
            path     : '/apps/challenge-creator/create',
            component: FuseLoadable({
                loader: () => import('./creator/Create')
            })
        }
    ]
};
