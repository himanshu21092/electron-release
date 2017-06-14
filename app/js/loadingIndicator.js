
(function () {
    'use strict';
    angular
        .module('POSApp')
        .controller('loadingIndicatorCtrl', loadingIndicatorCtrl);

    loadingIndicatorCtrl.$inject = ['$rootScope', '$timeout', '$state'];

    function loadingIndicatorCtrl($rootScope, $state) {
        $rootScope.showLoading = function () {
            $('.loader-back').show();
        };
        $rootScope.hideLoading = function () {
            $('.loader-back').hide();
        };
    }
})();
