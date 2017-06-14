POSApp.directive('toggleClass', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                element.toggleClass(attrs.toggleClass);
            });
        }
    };
});
POSApp.filter('unsafe', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
});

POSApp.filter('orderType', function ($filter) {
    return function (allOrders, filters) {

        var output = [];

        var merchantInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (filters[0] == 0 && filters[1] == 0 && filters[2] == 0 && filters[3] == 0) {
            return allOrders;
        }
        if (filters[0] == 1 && filters[1] == 1 && filters[2] == 1 && filters[3] == 1) {
            return allOrders;
        }
        if (filters[0]) {
            output = output.concat($filter('filter')(allOrders, { instore: 1 }));
        }
        if (filters[1]) {
            output = output.concat($filter('filter')(allOrders, { dinein: 1 }));
        }
        if (filters[2]) {
            output = output.concat($filter('filter')(allOrders, { pickup_detail: 1 }));
        }
        if (filters[3]) {
            // Handle filter carefully here, not completed

            if (merchantInfo.merchant_category == "Restaurant") {
                output = output.concat($filter('filter')(allOrders, { delivery_detail: 1 }));
            }
            else {
                output = output.concat($filter('filter')(allOrders, { shipping_detail: 1 }));
            }
        }
        return output;
    };
});

POSApp.service('appService', function ($http, $rootScope, $q) {
    var baseUrl = "https://s1api.signcatch.com/pos/web/v2/";
    var loginServiceFactory = {};

    var getAccessToken = function () {
        userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo != null) {
            access_token = userInfo.access_token;
        }
        return access_token;
    }

    var getLoginType = function () {
        userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo != null) {
            access_token = userInfo.access_token;
        }
        if (userInfo.merchant_id == undefined) {
            loginType = 0;
        }
        else {
            loginType = 1;
        }
        return loginType;
    }

    var _loginUser = function (data) {
        var form_data = new FormData();
        for (var key in data) {
            form_data.append(key, data[key]);
        }
        return $http({
            url: baseUrl + 'login',
            "method": "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param(data),
            timeout: 10000
        }).then(function (response) {
            return response;
        }, function (error) {
            console.log(error);
            return $q.reject(error.status);
        });
    };
    var _saveOrder = function (data) {
        console.log(data);
        let url;

        if (data.order_id) {
            url = baseUrl + 'order/create-order/' + data.order_id + '?access-token=' + getAccessToken() + '&type=' + getLoginType()
        }
        else {
            url = baseUrl + 'order/create-order?access-token=' + getAccessToken() + '&type=' + getLoginType()
        }
        return $http({
            url: url,
            "method": "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param(data),
            timeout: 10000
        }).then(function (response) {
            console.log(response);
            return response;
        }, function (error) {
            return $q.reject(error.status);
        });
    };

    var _markAsComplete = function (data) {
        return $http({
            url: baseUrl + 'order/mark-complete?access-token=' + access_token + '&type=' + getLoginType(),
            "method": "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param(data),
            timeout: 10000
        }).then(function (response) {
            return response;
        }, function (error) {
            return $q.reject(error.status);
        });
    };

    var _deleteOrder = function (orderId) {
        console.log(orderId);
        return $http({
            url: baseUrl + 'order/delete-order/' + orderId + '?access-token=' + access_token + '&type=' + getLoginType(),
            "method": "DELETE",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000
        }).then(function (response) {
            return response.status;
        }, function (error) {
            return $q.reject(error.status);
        });
    };


    var _checkOut = function (data) {
        console.log(data);
        return $http({
            url: baseUrl + 'order/on-checkout-success?access-token=' + access_token + '&type=' + getLoginType(),
            "method": "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param(data),
            timeout: 10000
        }).then(function (response) {
            return response;
        });
    };


    var _registerUser = function (data) {
        return $http({
            method: 'POST',
            url: baseUrl + 'signup',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param(data),
            timeout: 10000
        }).then(function (response) {
            return response;
        });
    };
    var _getCategories = function () {
        return $http({
            method: 'GET',
            url: baseUrl + 'categories?access-token=' + getAccessToken() + '&type=' + getLoginType(),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000
        }).then(function (response) {
            return response;
        });
    };

    var _getCollections = function (id, fromPage, toPage) {
        var req = id + "/" + fromPage + "/" + toPage;
        return $http({
            method: 'GET',
            url: baseUrl + 'products/collection-product/' + req + '?access-token=' + getAccessToken() + '&type=' + getLoginType(),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000
        }).then(function (response) {
            return response;
        });
    };
    var _getCategoryProducts = function (id, fromPage, toPage) {
        var req = id + "/" + fromPage + "/" + toPage;
        console.log(req);
        return $http({
            method: 'GET',
            url: baseUrl + 'products/category-product/' + req + '?access-token=' + getAccessToken() + '&type=' + getLoginType(),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000
        }).then(function (response) {
            return response;
        });
    };

    var _addToFav = function (data) {
        //console.log(data);
        return $http({
            url: baseUrl + 'products/add-favorite-product/' + data + '?access-token=' + getAccessToken() + '&type=' + getLoginType(),
            "method": "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000
            //data: $.param(data),
        }).then(function (response) {
            return response;
        });
    };

    var _removeToFav = function (data) {
        //console.log(data);
        return $http({
            url: baseUrl + 'products/remove-favorite-product/' + data + '?access-token=' + getAccessToken() + '&type=' + getLoginType(),
            "method": "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000
            //data: $.param(data),
        }).then(function (response) {
            return response;
        });
    };

    var _getMerchantLoc = function () {
        return $http({
            method: 'GET',
            url: baseUrl + 'merchant/locations-status?access-token=' + getAccessToken() + '&type=' + getLoginType(),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000
        }).then(function (response) {
            return response;
        });
    };
    var _getAllOrder = function () {
        return $http({
            method: 'GET',
            url: baseUrl + 'order/order-list?access-token=' + getAccessToken() + '&type=' + getLoginType(),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000
        }).then(function (response) {
            return response;
        });
    };

    var _getOrderBasedOnType = function (Type) {
        return $http({
            method: 'GET',
            url: baseUrl + 'order/order-list?access-token=' + getAccessToken() + '&open=' + Type + '&type=' + getLoginType(),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000
        }).then(function (response) {
            return response;
        }, function (error) {
            return $q.reject(error.status);
        });
    };

    var _getOrderBasedOnFilter = function (filters) {
        return $http({
            method: 'GET',
            url: baseUrl + 'order/order-list?access-token=' + getAccessToken() + filters + '&type=' + getLoginType(),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000
        }).then(function (response) {
            return response;
        });
    };

    var _searchProduct = function (query) {
        console.log(baseUrl + 'merchant/search/product/' + query + '?access-token=' + getAccessToken() + '&type=' + getLoginType());
        return $http({
            method: 'GET',
            url: baseUrl + 'merchant/search/product/' + query + '?access-token=' + getAccessToken() + '&type=' + getLoginType(),
            timeout: 20000
        }).then(function (response) {
            console.log(response);
            return response;
        }, function (error) {
            return $q.reject(error.status);
        })
    }

    var _searchOrder = function (query) {
        console.log(query);
        return $http({
            method: 'GET',
            url: baseUrl + 'merchant/search/order/' + query + '?access-token=' + getAccessToken() + '&type=' + getLoginType(),
            timeout: 10000
        }).then(function (response) {
            console.log(response);
            return response;
        })
    }

    var _getOrderDetails = function (orderId) {
        return $http({
            method: 'GET',
            url: baseUrl + 'order/' + orderId + '?expand=products,miscellaneousProducts,taxes,deliveryDetail&access-token=' + getAccessToken() + '&type=' + getLoginType(),
            timeout: 10000
        }).then(function (response) {
            console.log(response);
            return response;
        }, function (error) {
            console.log(error);
            return $q.reject(error.status);
        })
    }

    var _getMerchantProfile = function () {
        return $http({
            method: 'GET',
            url: baseUrl + 'merchant/profile?access-token=' + getAccessToken() + '&type' + getLoginType(),
            timeout: 10000
        }).then(function (response) {
            return response;
        }, function (error) {
            return $q.reject(error.status);
        })
    }

    var _getMerchantBankProfile = function () {
        return $http({
            method: 'GET',
            url: baseUrl + 'merchant/bank-info?access-token=' + getAccessToken() + '&type' + getLoginType(),
            timeout: 10000
        }).then(function (response) {
            return response;
        }, function (error) {
            console.log(error)
            return $q.reject(error.status);
        })
    }

    var _updateMerchantProfile = function (updatedProfile) {
        console.log(updatedProfile);
        return $http({
            method: 'POST',
            url: baseUrl + 'merchant/profile?access-token=' + getAccessToken() + '&type' + getLoginType(),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: $.param(updatedProfile),
            timeout: 10000
        }).then(function (response) {
            return response;
        }, function (error) {
            return $q.reject(error.status);
        })
    }

    var _getGeoLocation = function (pincode) {
        return $http({
            method: 'GET',
            url: "https://www.whizapi.com/api/v2/util/ui/in/indian-city-by-postal-code?pin=" + pincode + "&project-app-key=d2fiytb5mhokvkoyp1zuvask",
            timeout: 10000
        }).then(function (response) {
            return response;
        }, function (error) {
            return error.status;
        })
    }

    loginServiceFactory.deleteOrder = _deleteOrder;

    //POST

    loginServiceFactory.loginUser = _loginUser;
    loginServiceFactory.registerUser = _registerUser;
    loginServiceFactory.saveOrder = _saveOrder;
    loginServiceFactory.checkOut = _checkOut;
    loginServiceFactory.addToFavorite = _addToFav;
    loginServiceFactory.removeToFavorite = _removeToFav;
    loginServiceFactory.markAsComplete = _markAsComplete;
    loginServiceFactory.updateMerchantProfile = _updateMerchantProfile;


    //GET

    loginServiceFactory.getMerchantLoc = _getMerchantLoc;
    loginServiceFactory.getCategories = _getCategories;
    loginServiceFactory.getCollections = _getCollections
    loginServiceFactory.getCategoryProducts = _getCategoryProducts;
    loginServiceFactory.getAllOrder = _getAllOrder;
    loginServiceFactory.getOrderBasedOnType = _getOrderBasedOnType;
    loginServiceFactory.getOrderBasedOnFilter = _getOrderBasedOnFilter;
    loginServiceFactory.searchProduct = _searchProduct;
    loginServiceFactory.searchOrder = _searchOrder;
    loginServiceFactory.getOrderDetails = _getOrderDetails;
    loginServiceFactory.getMerchantProfile = _getMerchantProfile;
    loginServiceFactory.getMerchantBankProfile = _getMerchantBankProfile;
    loginServiceFactory.getGeoLocation = _getGeoLocation;
    return loginServiceFactory;
});

POSApp.service('printService', function ($http, $rootScope) {
    var printServiceFactory = {};
    var Printer = require(__dirname + '/js/escpos_printing.js');
    Printer.ESCPOS_INIT();

    var space = function (number) {
        let rowLen = new Array(number);
        rowLen.fill(" ");
        return rowLen.join("");
    }

    var _getAllPrinters = function () {
        return Printer.ESCPOS_PRINTERLIST;
    }

    var _printOrder = function (order) {
        console.log(order);

        console.log(JSON.parse(localStorage.getItem("userInfo")));

        Printer.append(Printer.ESCPOS_CMD.RESET);
        Printer.append(Printer.ESCPOS_CMD.CENTER);
        Printer.append("MODERN BAZAAR DEPT. STORE PVT. LTD\n");
        Printer.append("EAST OF KAILASH\n");
        Printer.append("NEW DELHI - 110056\n");
        Printer.append("Ph :- 011-4163306, 4173306\n");
        Printer.append("TIN N0. 789765465465468\n");
        Printer.append("CIN NO. 66545646465465465\n");
        Printer.append("Retail Invoice\n");

        Printer.append(Printer.ESCPOS_CMD.LEFT);

        Printer.append("------------------------------------------------\n");
        Printer.append("Bill : 147234" + " Counter : SmartStation\n");
        Printer.append("User: Bhasker\n");
        Printer.append("Date : 12/02/2016 18:05:32\n")
        Printer.append("------------------------------------------------\n");
        Printer.append("Description\n");
        Printer.append("Code" + space(14) + "Rate" + space(6) + "Qty/Wt" + space(8) + "Amount\n");
        Printer.append("------------------------------------------------\n");

        order.products.forEach(function (element) {
            Printer.append(element.product_name + '\n');
            if (element.quantity_unit == "unit") {
                Printer.append(element.sku + space(12 - element.sku.toString().length) + space(2) +space(8 - element.price.toString.length) + element.price + space(5) + space(7 - element.quantity.toString().length) + element.quantity + space(4) + space(10 - element.amount.toString().length) + element.amount + "\n");
            }
            else {
                Printer.append(element.sku + space(12 - element.sku.toString().length) + space(8 - element.price.toString.length) + element.price + space(5) + space(7 - (element.quantity.toString().length + element.quantity_unit.length + 1)) + element.quantity + " " + element.quantity_unit + space(4) + space(10 - element.amount.toString().length) + element.amount + "\n");
            }
        });

        order.miscellaneousProducts.forEach(function (element) {
            Printer.append(element.name + '\n');
            Printer.append(space(14) + space(8 - element.amount.toString.length) + element.amount + space(5) + space(7 - element.quantity.toString().length) + element.quantity + space(4) + space(10 - element.total_amount.toString().length) + element.total_amount + "\n");
        });


        Printer.append(Printer.ESCPOS_CMD.RESET);
        Printer.append(Printer.ESCPOS_CMD.FEEDCUT_PARTIAL(100));

        var success = Printer.ESCPOS_PRINT(localStorage.getItem('connectedPrinter'));
        if (!success) {
            alert(Printer.ESCPOS_LASTERROR);
            return 0;
        }

        return 1;
    }



    printServiceFactory.getAllPrinters = _getAllPrinters;
    printServiceFactory.printOrder = _printOrder;

    return printServiceFactory;
});


POSApp.service('userSettings', function () {
    var userSettingsService = {};
    const storage = require('electron-json-storage');


    var _setUserSetting = function (key, value) {
        return new Promise(function (resolve, reject) {
            storage.set(key, value, function (error) {
                if (error) {
                    console.log(error);
                    reject(false)
                }
                resolve(true)
            })
        })
    }

    var _getUserSetting = function (key) {
        return new Promise(function (resolve, reject) {
            storage.get(key, function (error, data) {
                if (angular.equals(data, {})) {
                    reject(false);
                }
                if (error) {
                    console.log(error);
                    reject(false)
                }
                resolve(data);
            })
        })
    }

    var _hasUserSetting = function (key) {
        return new Promise(function (resolve, reject) {
            storage.has(key, function (error, hasKey) {
                if (hasKey) {
                    resolve(true);
                }
                if (error) {
                    console.log(error);
                }
                reject(false);
            })
        })
    }


    userSettingsService.setUserSetting = _setUserSetting;
    userSettingsService.getUserSetting = _getUserSetting;
    userSettingsService.hasUserSetting = _hasUserSetting;

    return userSettingsService;
});

