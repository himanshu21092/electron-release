POSApp.config(['$stateProvider', '$routeProvider', '$urlRouterProvider', function ($stateProvider, $routeProvider, $urlRouterProvider) {
    $stateProvider
        .state('main', {
            url: '/main',
            cache: false,
            views: {
                'headerView': {
                    templateUrl: 'template/header-footer/common-header.html',
                    controller: 'headerCtrl'
                },
                'footerView': {
                    templateUrl: 'template/header-footer/common-footer.html',
                    controller: 'headerCtrl'
                },
                'contentView': {
                    templateUrl: 'template/views/main.html'
                }
            }
        })
        .state('main.login', {
            url: '/login/',
            cache: false,
            views: {
                'mainView': {
                    templateUrl: 'template/views/register-login.html',
                    controller: 'loginCtrl',
                    title: 'Login'
                }
            }
        }).state('main.signup', {
            url: '/signup/',
            views: {
                'mainView': {
                    templateUrl: 'template/views/register-login.html',
                    controller: 'loginCtrl',
                    title: 'Sign Up'
                }
            }
        })
        .state('main.mainview', {
            url: '/defaultView/',
            cache: true,
            views: {
                'mainView': {
                    templateUrl: 'template/views/mainView.html',
                    controller: 'mainScreenCtrl',
                    title: 'Default View'
                }
            },
            params: {
                'order': "",
                'finalOrder': ""
            }
        })

        .state('main.setting', {
            url: '/setting/',
            views: {
                'mainView': {
                    templateUrl: 'template/views/setting.html',
                    controller: 'mainScreenCtrl',
                    // title: 'Default View'
                }
            }
        })
        .state('main.allOrder', {
            url: '/allOrder/',
            views: {
                'mainView': {
                    templateUrl: 'template/views/allOrder.html',
                    controller: 'allOrderCtrl',
                    // title: 'Default View'
                }
            }
        })
    $urlRouterProvider.otherwise('/main/login/');
}]);
