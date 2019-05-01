import {FuseLoadable} from '@fuse';

export const ComingSoonPageConfig = {
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
            path     : '/pages/coming-soon',
            component: FuseLoadable({
                loader: () => import('./ComingSoonPage')
            })
        }
    ]
};
