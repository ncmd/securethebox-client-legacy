import Landing from './Landing';

export const LandingConfig = {
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
    routes  : [
        {
            path     : '/landing',
            component: Landing
        }
    ]
};

/**
 * Lazy load Landing
 */
/*
import FuseLoadable from '@fuse/components/FuseLoadable/FuseLoadable';

export const LandingConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/landing',
            component: FuseLoadable({
                loader: () => import('./Landing')
            })
        }
    ]
};
*/
