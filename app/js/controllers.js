POSApp.controller('headerCtrl', function ($rootScope, $scope, $state) {
    $rootScope.apply = function () {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }
});
POSApp.controller('loginCtrl', function ($rootScope, $scope, $state, appService, $webSql, HTTP_RESPONSE, ERROR_MESSAGES, userSettings) {

    console.log(__dirname);

    $scope.inputType = "password";

    $scope.hideShowPassword = function () {
        if ($scope.inputType == 'password') {
            $scope.inputType = 'text';
        }
        else {
            $scope.inputType = 'password';
        }
        console.log($scope.inputType);
    }

    $scope.islogging = false;
    $scope.loginErr = "";


    localStorage.clear();

    var open = require('open');

    $scope.openJoinNow = function () {
        open("http://www.signcatch.com/signup.php");
    }

    $scope.openForgotPassword = function () {
        open("http://signcatch.com/forgot-password.php");
    }

    common.createDBAndTables($rootScope, $scope, $state, appService, $webSql);

    //$scope.db = $webSql.dropDatabase('mydb');

    $scope.login = function (loginData) {
        $scope.islogging = true;
        $scope.loginErr = "";
        $scope.db.select("users", {
            "username": loginData.username
        }).then(function (results) {
            if (results.rows.length > 0) {

                // $scope.categoryn = {};
                // for (i = 0; i < results.rows.length; i++) {
                //     $scope.categoryn = results.rows[i];
                // }
                // $scope.categoryn = $scope.categoryn;
                // $scope.db.selectAll("merchant", {
                // }).then(function (results) {
                //     if (results.rows.length > 0) {
                //         for (i = 0; i < results.rows.length; i++) {
                //             $scope.categoryn[i] = results.rows[i];
                //         }
                //         $scope.categoryn['merchant'] = $scope.categoryn;
                //     }
                // });

                // $scope.db.selectAll("pickup_location", {
                // }).then(function (results) {
                //     if (results.rows.length > 0) {
                //         for (i = 0; i < results.rows.length; i++) {
                //             $scope.categoryn[i] = results.rows[i];
                //         }
                //         $scope.categoryn['pickup_location'] = $scope.categoryn;
                //     }
                // });

                // $scope.db.selectAll("store_location", {
                // }).then(function (results) {
                //     if (results.rows.length > 0) {
                //         for (i = 0; i < results.rows.length; i++) {
                //             $scope.categoryn[i] = results.rows[i];
                //         }
                //         $scope.categoryn['store_location'] = $scope.categoryn;
                //     }
                // });
                // console.log($scope.categoryn);
                // localStorage.setItem("userInfo", JSON.stringify($scope.categoryn));
                // $scope.islogging = false;
                // $state.go("main.mainview");

            } else {
                $scope.loginService(loginData);
                //$scope.merchantLoc();
            }


        });

    }


    /*$scope.orders = function () {
        $scope.db.selectAll("orders", {
        }).then(function (results) {
            if (results.rows.length > 0) {
            } else {
                appService.getAllOrder().then(function (result) {
                    $scope.webSqlData = [];
                    $scope.webSqlData = result.data.items;
                    var objCount = Object.keys($scope.webSqlData).length;
                    for (var i = 0; i < objCount; i++) {
                        $scope.db.insert('orders', $scope.webSqlData[i]).then(function (results) {
                        })
                    }
                }, function (error) {
                    alert(error.data[0].message);
                });
            }
        })
    }


    $scope.merchantLoc = function () {
        $scope.db.selectAll("merchant_location", {
        }).then(function (results) {
            if (results.rows.length > 0) {
            } else {
                appService.getMerchantLoc().then(function (result) {
                    $scope.webSqlData = [];
                    $scope.webSqlData = result.data.locations;
                    var objCount = Object.keys($scope.webSqlData).length;
                    for (var i = 0; i < objCount; i++) {
                        $scope.db.insert('merchant_location', $scope.webSqlData[i]).then(function (results) {
                        })
                    }
                }, function (error) {
                    alert(error.data[0].message);
                });
            }

        })
    }*/

    $scope.loginService = function (data) {
        appService.loginUser(data).then(function (result) {
            localStorage.setItem("userInfo", JSON.stringify(result.data));

            userSettings.hasUserSetting("userInfo")
                .then(function (success) {
                    console.log("Here 4");
                    console.log("Record Exists");
                }, function (failed) {
                    console.log("Here 5");
                    console.log("Record doesn't exist");
                })

            userSettings.setUserSetting("userInfo", result.data)
                .then(function (success) {
                    console.log("Success");
                }, function (error) {
                    console.log("Fail");
                })

            /* Inserting / Updating response into websql starts here*/
            $scope.db.select("users", {
                "id": result.data.id
            }).then(function (results) {
                if (results.rows.length > 0) {
                    $scope.db.update("users", { "name": result.data.name, 'currency': result.data.currency, 'country': result.data.country, 'access_token': result.data.access_token, 'merchant_category': result.data.merchant_category }, { 'id': result.data.id });
                    console.log("users update successful.");
                } else {
                    $scope.db.insert('users', { "username": data.username, "password": data.password, "id": result.data.id, "name": result.data.name, 'currency': result.data.currency, 'country': result.data.country, 'access_token': result.data.access_token, 'merchant_category': result.data.merchant_category }).then(function (results) {
                        console.log("users insert successful.");
                    }, function () {
                        console.log("users insert failed.");
                    })
                }
            })

            $scope.webSqlData = [];
            $scope.webSqlData = result.data.merchant_qr;
            var objCount = Object.keys($scope.webSqlData).length;
            for (var i = 0; i < objCount; i++) {
                $scope.db.insert('merchant', $scope.webSqlData[i]).then(function (results) {
                    console.log("Merchant Insert has been successful.");
                }, function () {
                    console.log("Merchant Insert failed.");
                })
            }

            // $scope.webSqlData = [];
            // $scope.webSqlData = result.data.pickup_location;
            // var objCount = Object.keys($scope.webSqlData).length;
            // for (var i = 0; i < objCount; i++) {
            //     $scope.db.insert('pickup_location', $scope.webSqlData[i]).then(function (results) {
            //         console.log("Pickup location has been successful.");
            //     }, function () {
            //         console.log("Pickup location failed");
            //     })
            // }

            // $scope.webSqlData = [];
            // $scope.webSqlData = result.data.store_location;

            // var objCount = Object.keys($scope.webSqlData).length;
            // for (var i = 0; i < objCount; i++) {
            //     $scope.db.insert('store_location', $scope.webSqlData[i]).then(function (results) {
            //         console.log("Store location insert has been successful.");
            //     }, function () {
            //         console.log("Store location failed.");
            //     })
            // }

            //common.syncDatabase($rootScope, $scope, $state, appService, $webSql);

            /* Inserting / Updating response into websql ends here*/

            $scope.islogging = false;
            $state.go("main.mainview");
        }, function (error) {
            if (error == HTTP_RESPONSE.VALIDATION_ERROR) {
                $scope.loginErr = ERROR_MESSAGES.LOGIN_VALIDATION_ERROR;
            }
            else if (error == HTTP_RESPONSE.TIMEOUT) {
                $scope.loginErr = ERROR_MESSAGES.TIMEOUT;
            }
            else if (error == HTTP_RESPONSE.SERVER_ERROR) {
                $scope.loginErr = ERROR_MESSAGES.SERVER_ERROR;
            }
            else {
                $scope.loginErr = ERROR_MESSAGES.OTHER;
            }
            $scope.islogging = false;
        });
    }
});
POSApp.controller('mainScreenCtrl', function ($rootScope, $scope, $state, appService, printService, $webSql, $window, $stateParams, $interval, HTTP_RESPONSE, $timeout, ERROR_MESSAGES, userSettings) {

    console.log($stateParams);
    $scope.profileLoadText = "Loading";
    $scope.countryCode = '+91';
    $scope.phoneNumber = "";
    var disableKeyboardInput = false;
    var store_id = "";

    if (JSON.parse(localStorage.getItem("userInfo")).store_location.length == 1) {
        store_id = JSON.parse(localStorage.getItem("userInfo")).store_location[0].id;
    }
    else {
        store_id = 1
    }

    $scope.selectedPickUpLocation = -1;

    $scope.setKeyboardInputOption = function (value) {
        disableKeyboardInput = value;
    }

    $scope.calCashBalance = function () {
        console.log($scope.cashAmountPaid);
        console.log($scope.orderTotal);
        return $scope.cashAmountPaid - $scope.orderTotal;
    }

    $scope.getGeoLocation = function (pincode) {
        console.log(pincode);
        if (pincode.length != 6) {
            // Handle Error
        }
        else {
            appService.getGeoLocation(pincode)
                .then(function (response) {

                    $timeout(function () {
                        $scope.finalOrder.order.address.state = response.data.Data[0].State.charAt(0).toUpperCase() + response.data.Data[0].State.slice(1).toLowerCase();
                        $scope.finalOrder.order.address.city = response.data.Data[0].City;
                    })
                })
                .finally(function () {
                    console.log("Inside Finally block");
                    $timeout(function () {
                        $scope.finalOrder.order.address.country = 'IN';
                    })
                })
        }
    }

    $scope.allowAlphabetsOnly = function (e) {
        let keyPressed = e.keyCode;

        if (!((keyPressed > 64 && keyPressed < 91) || (keyPressed > 96 && keyPressed < 123) || keyPressed == 32)) {
            e.preventDefault();
        }
    }

    $scope.selectPickUpLocation = function (location) {
        console.log(location.id);
        $scope.selectedPickUpLocation = location.id;
        $scope.finalOrder.order.pickup_id = location.id;
    }

    $scope.saveDeliveryOrder = function () {
        $scope.saveOrder();
    }

    $scope.merchantProfile = '';
    $scope.profileEditMode = false;

    $scope.turnOnEditMode = function () {
        $scope.profileEditMode = true;
    }

    $scope.turnOffEditMode = function () {
        $scope.profileEditMode = false;
    }

    $scope.allowNumbersOnly = function (e) {
        let keyPressed = e.keyCode;

        if (keyPressed < 48 || keyPressed > 57) {
            e.preventDefault();
        }
    }

    $scope.updateMerchantProfile = function () {
        $rootScope.showLoading();
        appService.updateMerchantProfile($scope.merchantProfile.profile)
            .then(function (response) {
                $scope.turnOffEditMode();
                $rootScope.hideLoading();
            }, function (error) {
                console.log(error);
                $timeout(function () {
                    $scope.merchantProfile.profile = merchantProfileBackup;
                })
                if (error == HTTP_RESPONSE.VALIDATION_ERROR) {
                    $scope.showAlertBox(ERROR_MESSAGES.PROFILE_UPDATE_ERROR);
                }
                else if (error == HTTP_RESPONSE.TIMEOUT) {
                    $scope.showAlertBox(ERROR_MESSAGES.TIMEOUT);
                }
                else if (error == HTTP_RESPONSE.SERVER_ERROR) {
                    $scope.showAlertBox(ERROR_MESSAGES.SERVER_ERROR);
                }
                else {
                    $scope.showAlertBox(ERROR_MESSAGES.OTHER);
                }
                $scope.turnOffEditMode();
                $rootScope.hideLoading();
            })
    }

    var activate = function () {

        merchantInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log(merchantInfo);
        $scope.pickUpLocations = merchantInfo.pickup_location;

        if ($state.current.name == 'main.setting') {
            $rootScope.showLoading();
            getProfile = appService.getMerchantProfile();
            getBankProfile = appService.getMerchantBankProfile();
            var merchantProfile = {
            };

            Promise.all([getProfile, getBankProfile])
                .then(function (response) {
                    merchantProfile.profile = response[0].data;
                    merchantProfileBackup = jQuery.extend(true, {}, merchantProfile.profile);
                    merchantProfile.bank = response[1].data;
                    console.log(merchantProfile);
                    $scope.$apply(function () {
                        $scope.merchantProfile = merchantProfile;
                    });
                    $rootScope.hideLoading();
                }, function (error) {
                    console.log(error);
                    $scope.profileLoadText = "N.A.";
                    $rootScope.hideLoading();
                    if (error == HTTP_RESPONSE.TIMEOUT) {
                        $scope.showAlertBox(ERROR_MESSAGES.TIMEOUT + " Could not load profile.");
                    }
                    else if (error == HTTP_RESPONSE.SERVER_ERROR) {
                        $scope.showAlertBox(ERROR_MESSAGES.SERVER_ERROR + " Could not load profile.");
                    }
                    else {
                        $scope.showAlertBox(ERROR_MESSAGES.OTHER + " Could not load profile.");
                    }
                })
        }
    }

    activate();

    $scope.search = {};
    $scope.transactionCancelled = false;
    $scope.progressText = "Payment is in progress. Please complete the process in EDC…";
    $scope.progressBtnText = "Cancel Transaction";
    $scope.categories = [];
    $scope.selectedMainCatgory = null;
    $scope.subCategories = {};
    $scope.showProduct = false;
    $scope.selectedProduct = null;
    var lastSavedOrderId = null;
    $scope.showSave = true;
    $scope.showCustomerProfile = false;
    $scope.showSearchError = false;
    $scope.cashAmountPaid = "";

    $scope.merchant_location = [];

    $scope.showAlertBox = function (alertText) {
        $scope.alertText = alertText;
        $('#alertBox').modal('show');
    }

    var searchProduct = function (query) {
        $scope.showSearchError = false;
        console.log("Inside Product Search");
        $rootScope.showLoading();
        appService.searchProduct(query)
            .then(function (response) {
                console.log(response);
                if (response.data.length == 0) {
                    // handle errors in this block
                    $scope.showSearchError = true;
                    $scope.searchedProductList = [];
                    console.log("Inside Error Bandhu");
                }
                else {
                    console.log(response);
                    $scope.searchedProductList = response.data;
                }
                $rootScope.hideLoading();
            }, function (error) {
                $scope.showSearchError = true;
                $scope.searchedProductList = [];
                $rootScope.hideLoading();
                if (error == HTTP_RESPONSE.TIMEOUT) {
                    $scope.showAlertBox(ERROR_MESSAGES.TIMEOUT);
                }
                else if (error == HTTP_RESPONSE.SERVER_ERROR) {
                    $scope.showAlertBox(ERROR_MESSAGES.SERVER_ERROR);
                }
                else {
                    $scope.showAlertBox(ERROR_MESSAGES.OTHER);
                }
            });
    }

    $scope.onSubmitQuery = function (query) {
        console.log(query)
        if (query == "" || query == undefined) {
            return ""
        }
        else {
            searchProduct(query);
        }
    }



    $(document).scannerDetection({
        onComplete: function (barcode, qty) {
            if ($scope.selectedTab == 4) {
                var numberPattern = /\d+/g;
                barcode = barcode.match(numberPattern)[0];
                $scope.search.query = barcode;
                searchProduct(barcode);
            }
        }
    })

    $scope.cancelTransaction = function () {
        if (!$scope.transactionCancelled) {
            $rootScope.cancelTransaction();
        }
    }

    $scope.sendTransactionToEdc = function () {
        console.log($rootScope.connection);
        if ($rootScope.connection) {
            $scope.$on('transactionCancelled', function () {
                console.log("Transaction has been cancelled");
                $scope.$apply(function () {
                    $scope.transactionCancelled = true;
                    $scope.progressText = "Payment is cancelled.";
                    $scope.progressBtnText = "Close"
                })
            })

            $scope.$on('busy', function () {
                console.log("EDC is busy right now");
            })

            $scope.$on('transactionComplete', function () {
                console.log("Transaction has been completed");
                $('#creditDebitOption').modal('hide');
                $scope.createNewOrder();
                $('#successOrder').modal('show');
                $scope.$apply(function () {
                    $scope.transactionCancelled = false;
                    $scope.progressText = "Payment is in progress. Please complete the process in EDC…";
                    $scope.progressBtnText = "Cancel Transaction";
                })
            })

            console.log("Transaction request is sent to EDC");
            $("#creditDebitOption").modal({ backdrop: 'static', keyboard: false });

            $scope.transactionInProcess = true;
            $scope.transactionCancelled = false;
            $scope.progressText = "Payment is in progress. Please complete the process in EDC…";
            $scope.progressBtnText = "Cancel Transaction";
            $rootScope.sendTransactionToEdc(lastSavedOrderId, $scope.orderTotal, $scope.finalOrder.order.customer_name, $scope.finalOrder.order.customer_phone_no);
        }
        else {
            console.log("EDC is not connected");
            $scope.showAlertBox('EDC is not connected.');
        }

    }

    userInfo = localStorage.getItem("userInfo");
    $scope.username = JSON.parse(userInfo).name;



    $('body').on('shown.bs.modal', function (e) {
        disableKeyboardInput = true;
    })

    $('body').on('hidden.bs.modal', function (e) {
        disableKeyboardInput = false;
    })

    $(document).keydown(function (e) {
        keyPressed = e.key;

        if (!disableKeyboardInput) {
            if (parseInt(keyPressed) < 10) {
                $scope.$apply(function () {
                    $scope.inputCalFunction(keyPressed);
                });
            }
            else if (keyPressed == '*' || keyPressed == 'x' || keyPressed == 'X') {
                $scope.$apply(function () {
                    $scope.inputCalFunction('X', true);
                });
            }
            else if (keyPressed == 'Backspace') {
                $scope.$apply(function () {
                    $scope.inputCalFunction('back', true)
                });
            }
            else if (keyPressed == 'c' || keyPressed == 'C') {
                $scope.$apply(function () {
                    $scope.inputCalFunction('C', true)
                });
            }
            else if (keyPressed == '.') {
                $scope.$apply(function () {
                    $scope.inputCalFunction('.');
                });
            }
            else if (keyPressed == '+') {
                $scope.$apply(function () {
                    $scope.inputCalFunction('+', true);
                });
            }
        }


    });

    $scope.selectOrderType = function (index) {
        console.log(index);
        $scope.selectedOrderType = index;
        $scope.showSave = true;

        if (index == 0) {
            console.log("Retail Order");
            $scope.finalOrder.order.instore = "1";
            $scope.finalOrder.order.dinein = "0";
            $scope.finalOrder.order.pickup_id = "0";
            $scope.finalOrder.order.delivery = "0";
        }
        else if (index == 1) {
            console.log("DineIn Order");
            $scope.finalOrder.order.instore = "0";
            $scope.finalOrder.order.dinein = "1";
            $scope.finalOrder.order.pickup_id = "0";
            $scope.finalOrder.order.delivery = "0";
        }
        else if (index == 2) {
            console.log("Pick Up Order");
            $scope.finalOrder.order.instore = "0";
            $scope.finalOrder.order.dinein = "0";
            $scope.finalOrder.order.pickup_id = "0";
            $scope.finalOrder.order.delivery = "0";
        }
        else {
            console.log("Delivery Order");
            $scope.finalOrder.order.instore = "0";
            $scope.finalOrder.order.dinein = "0";
            $scope.finalOrder.order.pickup_id = "0";
            $scope.finalOrder.order.delivery = "1";
        }


    };

    /*CREATING Database , TABLES , Opening Database websql*/
    $scope.db = $webSql.openDatabase('poc_db', '1.0', 'POC DB', 2 * 1024 * 1024);


    console.log(merchantInfo.pickup_location);

    $scope.orderTypeOptions = [
        {
            src: "assets/img/grocery.png",
            aSrc: "assets/img/grocery_white.png",
            type: 0
        }, {
            src: "assets/img/dinein.png",
            aSrc: "assets/img/dinein_white.png",
            type: 1
        }, {
            src: "assets/img/pickup.png",
            aSrc: "assets/img/pickup_white.png",
            type: 2
        }, {
            src: "assets/img/delivery.png",
            aSrc: "assets/img/delivery_white.png",
            type: 3
        }
    ];

    $scope.isRetailType = false;
    if (merchantInfo.merchant_category == "Modern Type Retail" || merchantInfo.merchant_category == "General Merchandise") {

        if (merchantInfo.merchant_category == "Modern Type Retail") {
            $scope.isRetailType = true;
        }


        if (merchantInfo.pickup_location.length == 0) {
            $scope.orderTypeOptions = [
                {
                    src: "assets/img/grocery.png",
                    aSrc: "assets/img/grocery_white.png",
                    type: 0
                }, {
                    src: "assets/img/delivery.png",
                    aSrc: "assets/img/delivery_white.png",
                    type: 3
                }
            ];
        }

        else {
            $scope.orderTypeOptions = [
                {
                    src: "assets/img/grocery.png",
                    aSrc: "assets/img/grocery_white.png",
                    type: 0
                }, {
                    src: "assets/img/pickup.png",
                    aSrc: "assets/img/pickup_white.png",
                    type: 2
                }, {
                    src: "assets/img/delivery.png",
                    aSrc: "assets/img/delivery_white.png",
                    type: 3
                }
            ];
        }

    }


    $scope.isSaveClicked = 0;
    $scope.operation = null;
    $scope.selectedOpt = 0;
    $scope.selectedOrderType = 0;
    $scope.selectedViewType = 0;
    $scope.selectedTab = 0;
    $scope.calVal = "";
    $scope.price = "";
    $scope.quantity = "";
    $scope.isCalRequired = false;
    $scope.oprators = ["+", "X"];
    $scope.currentOrderName = "Miscellaneous"
    $scope.orderTotal = "0.00";

    if (($stateParams.order == "" || $stateParams.order == undefined) && ($stateParams.finalOrder == "" || $stateParams.finalOrder == undefined)) {
        $scope.finalOrder = {
            "order": {
                discount: "",
                name: "",
                order_note: "",
                store_id: store_id,
                instore: "1",
                miscellaneous: [],
                discount_percentage: "",
                discount_amount: "",
                product: [],
                tax: [],
                cash_order: "",
                customer_name: "",
                customer_email: "",
                customer_phone_no: "",
                location_id: "",
                dinein: "",
                pickup_id: "",
                delivery: "",
                address: {
                    'zip': "",
                    'contact_number': "",
                    'first_name': "",
                    'address1': "",
                    'address2': "",
                    'state': "",
                    'city': "",
                    'country': ""
                }
            },
        };
        $scope.miscellaneousCount = 1;
    }
    else if ($stateParams.finalOrder) {
        console.log($stateParams.finalOrder);
        $scope.finalOrder = $stateParams.finalOrder;
        $scope.miscellaneousCount = $stateParams.finalOrder.order.miscellaneous.length + 1;
        $scope.orderTotal = $stateParams.finalOrder.orderTotal;
        lastSavedOrderId = $stateParams.finalOrder.lastSavedOrderId;
        $scope.selectedOrderType = $stateParams.finalOrder.selectedOrderType;
        $scope.phoneNumber = $stateParams.finalOrder.phoneNumber;
        $scope.finalOrder.order.pickup_id = $stateParams.finalOrder.order.pickup_id;
        $scope.selectedPickUpLocation = $stateParams.finalOrder.order.pickup_id;
        $rootScope.savedOrder = null;
        $scope.showSave = !$stateParams.finalOrder.isSaved;

        if ($stateParams.finalOrder.order.customer_name) {
            $scope.showCustomerProfile = true;
        }

    }
    else {
        miscellaneous = [];
        products = [];
        $rootScope.savedOrder = null;
        $stateParams.order.miscellaneousProducts.forEach(function (item) {
            miscellaneousProduct = {};
            miscellaneousProduct.amount = item.total_amount;
            miscellaneousProduct.price = item.amount;
            miscellaneousProduct.quantity = item.quantity;
            miscellaneousProduct.name = item.name;

            miscellaneous.push(miscellaneousProduct);
        }, this);

        $scope.miscellaneousCount = $stateParams.order.miscellaneousProducts.length + 1;

        $stateParams.order.products.forEach(function (item) {
            product = {};
            product.amount = item.amount;
            product.price = item.price;
            product.quantity = item.quantity;
            product.quantity_unit = item.quantity_unit;
            product.name = item.product_name;
            product.product_id = item.product_id;
            product.product_type_id = item.product_type_id;
            product.pre_tax_amount = item.pre_tax_amount,
                product.sku = item.sku,
                product.batch_no = item.batch_no,
                product.barcode = item.barcode,
                product.quantity_unit = item.quantity_unit
            products.push(product);
        }, this);

        if ($stateParams.order.customer_phone_no) {
            $scope.phoneNumber = $stateParams.order.customer_phone_no.slice(3);
        }


        $scope.finalOrder = {
            "order": {
                discount: "",
                name: $stateParams.order.name,
                order_note: $stateParams.order.order_note,
                store_id: store_id,
                instore: "1",
                discount_amount: $stateParams.order.discount_amount,
                discount_percentage: $stateParams.order.discount_percentage,
                miscellaneous: miscellaneous,
                product: products,
                tax: [],
                cash_order: "",
                customer_name: $stateParams.order.customer_name,
                customer_email: $stateParams.order.customer_email,
                customer_phone_no: "",
                location_id: ""
            }
        };

        if ($stateParams.order.customer_name) {
            $scope.showCustomerProfile = true;
        }

        lastSavedOrderId = $stateParams.order.id;
        $scope.orderTotal = $stateParams.order.amount;


        if ($stateParams.order.instore == 1) {
            $scope.selectOrderType(0);
        }
        else if ($stateParams.order.dinein == 1) {
            $scope.selectOrderType(1);
        }
        else if ($stateParams.order.pickup_detail == 1) {
            $scope.selectOrderType(2);
            $scope.finalOrder.order.pickup_id = $stateParams.order.pickup_id;
            $scope.selectedPickUpLocation = $stateParams.order.pickup_id;
        }
        else {
            $scope.finalOrder.order.address = $stateParams.order.deliveryDetail.detail;
            $scope.selectOrderType(3);
        }
        $scope.showSave = false;
        console.log($scope.finalOrder);
    }

    //$scope.finalOrder.order.orderName = $scope.currentOrderName + " " + $scope.miscellaneousCount;
    $scope.finalOrder.order.orderName = "";

    $scope.selectedFromProduct = {
        quantity: 1
    }

    $scope.getAllProducts = function () {
        var categoryn = {
            product: []
        };
        $scope.db.selectAll("product", {
        }).then(function (results) {
            if (results.rows.length > 0) {
                for (i = 0; i < results.rows.length; i++) {
                    categoryn.product.push(results.rows[i]);
                }
            }
        });
        $scope.db.selectAll("product_collection", {
        }).then(function (results) {
            if (results.rows.length > 0) {
                for (i = 0; i < results.rows.length; i++) {
                    categoryn.product.push(results.rows[i]);
                }
            }
        });
        $scope.subCategories = categoryn;

    }
    $scope.getAllFav = function () {
        var categoryn = {
            product: []
        };
        $scope.db.select("product", {
            "favorite_product": '1'
        }).then(function (results) {
            if (results.rows.length > 0) {
                for (i = 0; i < results.rows.length; i++) {
                    categoryn.product.push(results.rows[i]);
                }
            }
        });
        $scope.db.select("product_collection", {
            "favorite_product": '1'
        }).then(function (results) {
            if (results.rows.length > 0) {
                for (i = 0; i < results.rows.length; i++) {
                    categoryn.product.push(results.rows[i]);
                }
            }
        });
        console.log($scope.subCategories)
        $scope.subCategories = categoryn;
        console.log($scope.subCategories)
    }
    $scope.getCategories = function () {
        $scope.db.select("product_categories", {
            "name": 'IS NOT NULL'
        }).then(function (results) {
            if (results.rows.length > 0) {
                $scope.categoryn = {};
                for (i = 0; i < results.rows.length; i++) {
                    $scope.categoryn[results.rows[i].id] = results.rows[i];
                }
                $scope.categories = $scope.categoryn;
            } else {
                if ($scope.categories.length > 0) {
                    return;
                }
                appService.getCategories().then(function (result) {
                    $scope.categories = result.data;
                }, function (error) {
                    alert(error.data[0].message);
                });
            }
        })
    }


    $scope.selectedTabAction = function (index) {
        $scope.searchedProductList = [];
        $scope.showSearchError = false;
        disableKeyboardInput = true;
        $scope.search.query = '';
        $('.search-btn').removeClass('tab-btn-active');
        $('.tab-btn').removeClass('tab-btn-active');
        $("#tab" + index).addClass('tab-btn-active');
        $scope.selectedTab = index;
        if (index == 0) {
            disableKeyboardInput = false;
        }
        if (index == 1) {
            $scope.subCategories = [];
            $scope.selectedMainCatgory = null;
            $scope.getCategories();
        } else if (index == 2) {
            $scope.subCategories.product = [];
            $scope.selectedMainCatgory = null;
            $scope.getAllProducts();
        } else if (index == 3) {
            $scope.subCategories.product = [];
            $scope.selectedMainCatgory = null;
            $scope.getAllFav();
        }
    }
    $scope.updateTotal = function () {
        var total = 0;
        for (var i = 0; i < $scope.finalOrder.order.miscellaneous.length; i++) {
            total += Number($scope.finalOrder.order.miscellaneous[i].amount);
        }
        for (var i = 0; i < $scope.finalOrder.order.product.length; i++) {
            total += Number($scope.finalOrder.order.product[i].amount);
        }

        if ($scope.finalOrder.order.discount_percentage) {
            console.log(total);
            console.log($scope.finalOrder.order.discount_percentage);
            $scope.finalOrder.order.discount_amount = (total * $scope.finalOrder.order.discount_percentage) / 100;
            $scope.finalOrder.order.discount_amount = $scope.finalOrder.order.discount_amount.toFixed(2);
            total = total - $scope.finalOrder.order.discount_amount;
        }
        $scope.orderTotal = total.toFixed(2);
        $scope.showSave = true;
    }
    $scope.calculate = function (val) {
        $scope.isCalRequired = false;
        val = String(val);
        var n = val.match(/X/g);
        if (n != null) {
            var calArr = val.split("X");
            var valA = Number(calArr[0]);
            var valB = Number(calArr[1]);
            var result = valA * valB;
            console.log("return from here");
            return result.toFixed(2);
        } else {
            if ($scope.quantity === 0 || val == 0) {
                $scope.quantity = "";
                return "";
            }

            var baseName = $scope.currentOrderName + " " + $scope.miscellaneousCount
            var name = $scope.currentOrderName + " " + $scope.miscellaneousCount
            // if ($('#orderNameId').text() != name) {
            //     name = $('#orderNameId').text();
            // } else {
            //     $scope.miscellaneousCount++;
            // }
            if ($scope.finalOrder.order.orderName != "") {
                name = $scope.finalOrder.order.orderName;
            } else {
                $scope.miscellaneousCount++;
            }
            var currentOrder = {
                name: name,
                quantity: ($scope.quantity == "") ? 1 : $scope.quantity,
                amount: ($scope.quantity == "") ? val : val * $scope.quantity,
                price: Number(val).toFixed(2)
            }
            currentOrder.amount = Number(currentOrder.amount).toFixed(2);
            $scope.finalOrder.order.orderName = "";
            //$scope.finalOrder.order.orderName = $scope.currentOrderName + " " + $scope.miscellaneousCount;
            // name = $('#orderNameId').text($scope.orderName);
            name = $scope.finalOrder.order.orderName;
            $scope.finalOrder.order.miscellaneous.push(currentOrder);
            console.log($scope.finalOrder.order.miscellaneous);
            $scope.updateTotal();
        }
        $scope.quantity = '';
        return "";
    }
    $scope.addProductInOrder = function (selectedProduct, addProductInOrder) {
        console.log(selectedProduct);
        console.log(addProductInOrder);
        var currentOrder = {
            product_id: selectedProduct.id,
            product_type_id: selectedProduct.product_type,
            name: selectedProduct.name,
            quantity: addProductInOrder.quantity,
            amount: Number(selectedProduct.discounted_price) * Number(addProductInOrder.quantity),
            price: selectedProduct.discounted_price,
            pre_tax_amount: selectedProduct.pre_tax_amount || "",
            sku: selectedProduct.sku || "",
            batch_no: selectedProduct.batch_no || "",
            barcode: $scope.search.query,
            quantity_unit: selectedProduct.weight_unit || "",
            is_dynamic: selectedProduct.is_dynamic || ""
        }

        if (selectedProduct.is_dynamic == 1) {
            currentOrder.quantity = selectedProduct.weight;
            currentOrder.amount = selectedProduct.discounted_price;
        }

        $scope.finalOrder.order.product.forEach(function (item, index) {
            if (item.product_id == currentOrder.product_id) {

                // Check for non-weight based products
                if (item.is_dynamic == "0") {
                    // If they have same price
                    if (item.price == currentOrder.price) {
                        currentOrder.quantity = Number(currentOrder.quantity) + Number(item.quantity);
                        currentOrder.amount = Number(selectedProduct.discounted_price) * Number(currentOrder.quantity);
                        $scope.finalOrder.order.product.splice(index, 1);
                    }
                }
            }
        })

        $scope.finalOrder.order.product.push(currentOrder);
        $scope.updateTotal();
        $scope.closeProductDetails();
        $rootScope.apply();
        console.log($scope.finalOrder);
    }
    $scope.inputCalFunction = function (val, operator) {
        if ($scope.calVal == "" && operator == undefined) {
            if (val == 0 || val == ".") {
                return;
            }
            $scope.calVal = val.toString();
        } else if ($scope.calVal != "" && operator == true) {
            if (val == "C") {
                $scope.calVal = "";
                $scope.quantity = '';
                $scope.isCalRequired = false;
            } else if (val == "back") {
                var str = '';
                if ($scope.quantity != "") {
                    str = $scope.quantity;
                    str = str.slice(0, -1);
                    $scope.quantity = str;
                } else {
                    str = $scope.calVal;
                    str = str.slice(0, -1);
                    $scope.isCalRequired = false;
                    $scope.calVal = str;
                }
            } else if (val == "X") {
                $scope.calVal = String($scope.calVal);
                $scope.isCalRequired = true;
            } else {
                $scope.calVal = $scope.calculate($scope.calVal);
            }
        } else {
            if (operator == undefined && !$scope.isCalRequired) {

                if (isNaN($scope.calVal)) {
                    console.log($scope.calVal);
                    console.log($scope.calVal.length);
                    $scope.calVal = $scope.calVal.substr(0, $scope.calVal.length - 1);
                }

                if (String($scope.calVal).length >= 6) {
                    return ""
                }
                $scope.calVal = String($scope.calVal) + String(val);
            } else if (operator == undefined && $scope.isCalRequired) {
                if ($scope.quantity == "" && val.toString() == "0") {
                    return "";
                }
                if (String($scope.quantity).length >= 4 || val == ".") {
                    return "";
                }
                $scope.quantity = String($scope.quantity) + String(val);
            } else {

            }
        }
    }

    $scope.deleteOrder = function () {
        if (lastSavedOrderId) {
            $rootScope.showLoading();
            appService.deleteOrder(lastSavedOrderId)
                .then(function (response) {
                    $scope.createNewOrder();
                    $rootScope.hideLoading();
                }, function (error) {
                    $rootScope.hideLoading();
                    if (error == HTTP_RESPONSE.TIMEOUT) {
                        $scope.showAlertBox(ERROR_MESSAGES.TIMEOUT);
                    }
                    else if (error == HTTP_RESPONSE.SERVER_ERROR) {
                        $scope.showAlertBox(ERROR_MESSAGES.SERVER_ERROR);
                    }
                    else {
                        $scope.showAlertBox(ERROR_MESSAGES.OTHER);
                    }
                })
        }
        else {
            $scope.createNewOrder();
        }
    }

    $scope.deleteOrderItem = function (index, type) {

        if ($scope.finalOrder.order.product.length + $scope.finalOrder.order.miscellaneous.length == 1) {
            $scope.createNewOrder();
        }
        if (type == 1) {
            $scope.finalOrder.order.miscellaneous.splice(index, 1);
            if ($scope.finalOrder.order.miscellaneous.length == 0) {
                $scope.currentOrderName = "Miscellaneous"
                $scope.miscellaneousCount = 1;
                $scope.finalOrder.order.orderName = $scope.currentOrderName + " " + $scope.miscellaneousCount;
                // $('#orderNameId').text($scope.orderName);
                $scope.finalOrder.order.order_note = "";
            }
        } else {
            $scope.finalOrder.order.product.splice(index, 1);
        }
        $scope.updateTotal();
    }

    $scope.clearCustomerProfile = function () {
        $scope.showCustomerProfile = false;
        $scope.finalOrder.order.customer_name = "";
        $scope.phoneNumber = "";
        $scope.finalOrder.order.customer_email = "";
    }

    $scope.saveOrder = function () {
        $rootScope.showLoading();

        if ($scope.phoneNumber) {
            $scope.finalOrder.order.customer_phone_no = $scope.countryCode + $scope.phoneNumber;
        }
        appService.saveOrder($scope.finalOrder).then(function (result) {
            $scope.showSave = false;
            lastSavedOrderId = result.data.orderInfo.id;
            $scope.finalOrder.order.discount_percentage = result.data.orderInfo.discount_percentage;
            $scope.finalOrder.order.discount_amount = result.data.orderInfo.discount_amount;
            $scope.orderTotal = result.data.orderInfo.amount;
            console.log(lastSavedOrderId);
            $rootScope.hideLoading();
            if ($scope.operation == 0 && $scope.selectedOrderType == 0) {
                $("#paymentOptions").modal('show');
            }
        }, function (error) {
            $rootScope.hideLoading();
            if (error == HTTP_RESPONSE.TIMEOUT) {
                $scope.showAlertBox(ERROR_MESSAGES.TIMEOUT);
            }
            else if (error == HTTP_RESPONSE.SERVER_ERROR) {
                $scope.showAlertBox(ERROR_MESSAGES.SERVER_ERROR);
            }
            else {
                $scope.showAlertBox(ERROR_MESSAGES.OTHER);
            }
        });
    }

    $scope.saveOrderValidation = function () {
        if ($scope.selectedOrderType == 0) {
            if ($scope.phoneNumber == "") {
                return true;
            }
        }
        if ($scope.selectedOrderType == 2 || $scope.selectedOrderType == 3) {
            if ($scope.phoneNumber == "" || $scope.finalOrder.order.customer_name == "" || $scope.finalOrder.order.customer_name == undefined) {
                return true;
            }
        }
        if ($scope.finalOrder.order.customer_email != "") {
            var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
            return !re.test($scope.finalOrder.order.customer_email);
        }
        return false;
    }

    $scope.saveCurrentOrder = function () {
        //$scope.finalOrder.order.miscellaneous = $scope.finalOrder.order.miscellaneous;

        if ($scope.finalOrder.order.customer_name == "" && $scope.phoneNumber == "") {
            $scope.showCustomerProfile = false;
        }
        else {
            $scope.showCustomerProfile = true;
        }

        if (lastSavedOrderId) {
            console.log("Order ID ", lastSavedOrderId);
            $scope.finalOrder.order_id = lastSavedOrderId;
        }

        if ($scope.operation == 2) {
            return;
        }

        if ($scope.selectedOrderType == 2) {
            $('#pickUpOrder').modal('show');
            return;
        }

        if ($scope.selectedOrderType == 3) {
            $('#deliveryAddress').modal('show');
            return;
        }

        $scope.saveOrder();
    }

    $scope.createNewOrder = function () {
        $scope.showSave = true;
        $scope.finalOrder = {
            "order": {
                discount: "",
                name: "",
                order_note: "",
                store_id: store_id,
                instore: "1",
                miscellaneous: [],
                product: [],
                tax: [],
                cash_order: "",
                customer_name: "",
                customer_email: "",
                customer_phone_no: "",
                location_id: ""
            },
        };
        lastSavedOrderId = null;
        $scope.currentOrderName = "Miscellaneous";
        $scope.miscellaneousCount = 1;
        $scope.orderTotal = 0;
        $scope.finalOrder.order.orderName = $scope.currentOrderName + " " + $scope.miscellaneousCount;
        $scope.cashAmountPaid = "";
        // $('#orderNameId').text($scope.orderName);
        $scope.clearCustomerProfile();
        $scope.selectOrderType($scope.selectedOrderType);
        $scope.phoneNumber = "";
        $rootScope.savedOrder = null;
        $scope.selectOrderType(0);
    }

    $scope.paymentOption = function (paymentType, paymentDetail) {
        $scope.checkout(lastSavedOrderId, paymentType, paymentDetail);
    }

    $scope.changeViewType = function (type) {
        $scope.selectedViewType = type;
    }

    //$scope.getCategories();


    $scope.checkout = function (lastSavedOrderId, orderType, paymentDetail) {
        var data = {};
        if (orderType == "cash") {
            data = {
                order_id: lastSavedOrderId,
                transaction_status: 3,
                payment_type: 1,
                payment_detail: paymentDetail
            }
        } else if (orderType == "otherPay") {
            data = {
                order_id: lastSavedOrderId,
                transaction_status: 3,
                payment_type: 4,
                payment_detail: paymentDetail
            }
        }
        appService.checkOut(data).then(function (result) {
            $scope.createNewOrder();
            $("#successOrder").modal('show');
        }, function (error) {
            alert(error.data[0].message);
        });
    }
    $scope.openCategory = function (id, category) {
        $scope.selectedMainCatgory = category;
        var isCollection = Number(category.is_collection);
        if (isCollection == 0) {
            $scope.db.select("product", {
                "category_id": id
            }).then(function (results) {
                if (results.rows.length > 0) {
                    $scope.categoryn = {};
                    for (i = 0; i < results.rows.length; i++) {
                        $scope.categoryn[i] = results.rows[i];
                    }
                    $scope.subCategories['product'] = $scope.categoryn;
                } else {
                    appService.getCategoryProducts(id, 0, 10).then(function (result) {
                        $scope.subCategories = result.data;
                    }, function (error) {
                        alert(error.data[0].message);
                    });
                }
            });
        } else {
            //alert(id);
            //var id = 568;
            $scope.db.selectAll("product_collection", {
                //"category_id": id
            }).then(function (results) {
                if (results.rows.length > 0) {
                    $scope.categoryn = {};
                    for (i = 0; i < results.rows.length; i++) {
                        $scope.categoryn[i] = results.rows[i];
                    }
                    $scope.subCategories['product'] = $scope.categoryn;
                } else {
                    appService.getCollections(id, 0, 10).then(function (result) {
                        $scope.subCategories = result.data;
                    }, function (error) {
                        alert(error.data[0].message);
                    });
                }
            });
        }
    }
    $scope.showSelectedProduct = function (category) {
        $scope.showProduct = true;
        $scope.selectedProduct = category;
        console.log($scope.selectedProduct)
        console.log($scope.selectedProduct);
        // $rootScope.apply();
    }
    $scope.closeProductDetails = function () {
        $scope.showProduct = false;
        $scope.selectedFromProduct = {
            quantity: 1
        }
        //$scope.selectedTabAction($scope.selectedTab);
        $scope.slectedSize('pro-size-full');
        //$rootScope.apply();
    }
    $scope.decreaseQuality = function (quantity) {
        if (quantity > 1) {
            quantity--;
        }
        $scope.selectedFromProduct.quantity = quantity;
    }
    $scope.increaseQuality = function (quantity) {
        quantity++;
        $scope.selectedFromProduct.quantity = quantity;
    }
    $scope.slectedSize = function (id) {
        $('.pro-size-val').removeClass('pro-size-val-active');
        $('#' + id).addClass('pro-size-val-active');
    }
    $scope.addTofavorite = function (product) {
        appService.addToFavorite(product.id).then(function (result) {
            $scope.selectedProduct.favorite_product = 1;
            if (product.is_collection == 0) {
                $scope.db.update("product", { "favorite_product": 1 }, { 'id': product.id })
            } else {
                $scope.db.update("product_collection", { "favorite_product": 1 }, { 'id': product.id })
            }
        }, function (error) {
            alert(error.data[0].message);
        });
    }
    $scope.removeTofavorite = function (product) {
        appService.removeToFavorite(product.id).then(function (result) {
            $scope.selectedProduct.favorite_product = 0;
            if (product.is_collection == 0) {
                $scope.db.update("product", { "favorite_product": 0 }, { 'id': product.id })
            } else {
                $scope.db.update("product_collection", { "favorite_product": 0 }, { 'id': product.id })
            }
        }, function (error) {
            alert(error.data[0].message);
        });
    }

    $scope.selectedScanNPay = function (index, is_blockable, selectedTable) {
        $("#scanNPay").removeClass("fade").addClass("show");
        if ($scope.selectedOpt != 0) {
            var resetSel = $("#pType" + $scope.selectedOpt).attr('data-mainimg');
            $("#pType" + $scope.selectedOpt).attr('src', resetSel);
        }
        if (is_blockable == 0) {
            $("#pType" + index).attr('src', 'assets/img/selected_table.png');

        } else {
            $("#pType" + index).attr('src', 'assets/img/main_counter_selected.png');

        }
        $scope.selectedOpt = index;
        $scope.finalOrder.order.location_id = selectedTable.id;
        $scope.finalOrder.order.dinein = 1;
    };
    $scope.getMerchantLoc = function () {
        //alert("here we go ");
        $scope.db.selectAll("merchant_location", {
        }).then(function (results) {
            $scope.categoryn = {};
            if (results.rows.length > 0) {
                for (i = 0; i < results.rows.length; i++) {
                    $scope.categoryn[i] = results.rows[i];
                }
                $scope.merchant_location = $scope.categoryn;
            } else {
                appService.getMerchantLoc().then(function (result) {
                    $scope.merchant_location = result.data.locations;
                    $scope.webSqlData = [];
                    $scope.webSqlData = result.data.locations;
                    var objCount = Object.keys($scope.webSqlData).length;
                    for (var i = 0; i < objCount; i++) {
                        $scope.db.insert('merchant_location', $scope.webSqlData[i]).then(function (results) {
                        })
                    }
                }, function (error) {
                    alert(error.data[0].message);
                });
            }
        })
        console.log($scope.merchant_location);
    }
    $scope.closeScanNPayModel = function () {
        $("#scanNPay").removeClass("show").addClass("fade");
    }
    $scope.chargebtnScanNPay = function (isSaveClicked) {
        $scope.saveCurrentOrder();
        $("#scanNPay").removeClass("show").addClass("fade");
        if (isSaveClicked != 1) {
            $("#paymentOptions").modal('show');
        }
    }
    $scope.onChargeHandler = function (operation) {
        $scope.operation = operation;

        // If Customer Lookup is clicked, then set the operation to LookUp and open saveOrder modal
        if (operation == 2) {
            $('#saveOrder').modal('show');
            return;
        }

        if (!$scope.saveOrderValidation()) {
            $scope.saveCurrentOrder();
        }
        else {
            $("#saveOrder").modal('show');
        }
    };

    $scope.calBalanceleft = function (orderTotal, cashAmountPaid) {
        if (cashAmountPaid == undefined) {
            cashAmountPaid = 0;
        }
        return (cashAmountPaid - orderTotal).toFixed(2);
    }

    $scope.onSettingsBack = function () {
        console.log($rootScope.savedOrder);
        $state.go("main.mainview", { finalOrder: $rootScope.savedOrder });
    }
    $rootScope.checkOpen = "openProfile";

    $scope.openSetting = function () {
        if ($scope.finalOrder.order.product.length == 0 && $scope.finalOrder.order.miscellaneous.length == 0) {
            $rootScope.savedOrder = null;
        }
        else {
            $rootScope.savedOrder = $scope.finalOrder;
            $rootScope.savedOrder.orderTotal = $scope.orderTotal;
            $rootScope.savedOrder.lastSavedOrderId = lastSavedOrderId;
            $rootScope.savedOrder.selectedOrderType = $scope.selectedOrderType;
            $rootScope.savedOrder.phoneNumber = $scope.phoneNumber;
            $rootScope.savedOrder.isSaved = !$scope.showSave;
        }
        $state.go("main.setting");

    }
    $scope.openAllOrder = function () {
        if ($scope.finalOrder.order.product.length == 0 && $scope.finalOrder.order.miscellaneous.length == 0) {
            $rootScope.savedOrder = null;
        }
        else {
            $rootScope.savedOrder = $scope.finalOrder;
            $rootScope.savedOrder.orderTotal = $scope.orderTotal;
            $rootScope.savedOrder.lastSavedOrderId = lastSavedOrderId;
            $rootScope.savedOrder.selectedOrderType = $scope.selectedOrderType;
            $rootScope.savedOrder.phoneNumber = $scope.phoneNumber;
            $rootScope.savedOrder.isSaved = !$scope.showSave;
        }
        $state.go("main.allOrder");
    }

    // $scope.getMerchantProfile = function () {
    //     appService.getMerchantProfile()
    //         .then(function (response) {
    //             console.log(response);
    //             $scope.$apply(function () {
    //                 $scope.merchantProfile = response.data;
    //             })
    //         })
    // }

    // $scope.getMerchantProfile();

    $scope.openDevices = function () {
        $rootScope.checkOpen = "Devices";
    }

    $scope.openVoidTransaction = function () {
        $rootScope.checkOpen = "Transaction";
    }

    $scope.openThemeSelection = function () {
    }

    $scope.openProfile = function () {
        $rootScope.checkOpen = "openProfile";
    }

    $scope.selectFilter = function (index) {
        $(".search-filter").removeClass('selected');
        $("#filter-" + index).addClass('selected');
    }

    $scope.openPrinters = function () {
        $rootScope.checkOpen = 'Printers';
    }

    $scope.openEdc = function () {
        $rootScope.checkOpen = 'Edc';
    }

    $scope.availPrinters = printService.getAllPrinters();

    $scope.selectedPrinterIndex = -1;

    userSettings.getUserSetting("connectedPrinter")
        .then(function (connectedPrinter) {
            console.log("Printer is found.");
            console.log("connectedPrinter", connectedPrinter);
            $scope.availPrinters.forEach(function (printer, index) {
                if (printer == connectedPrinter) {
                    $timeout(function () {
                        $scope.selectedPrinterIndex = index;
                    });
                }
            })

        }, function (fail) {
            console.log("Printer is not found.");
        })

    // if (localStorage.getItem("connectedPrinter")) {
    //     $scope.availPrinters.forEach(function (printer, index) {
    //         if (printer == localStorage.getItem("connectedPrinter")) {
    //             $scope.selectedPrinterIndex = index;
    //         }
    //     })
    // }

    $scope.selectPrinter = function (index) {
        $scope.selectedPrinterIndex = index;
        $scope.selectedPrinter = $scope.availPrinters[index];
        localStorage.setItem("connectedPrinter", $scope.selectedPrinter);

        userSettings.setUserSetting("connectedPrinter", $scope.selectedPrinter)
            .then(function (success) {
                console.log("Printer name persisted");
            }, function (fail) {
                console.log("Could not save printer");
            })
    };


});

POSApp.controller('edcCtrl', function ($scope, $rootScope, $interval, userSettings) {

    var bonjour = require('bonjour')();
    var WebSocketClient = require('websocket').client;
    $scope.nearbyEdc = [];


    var client = new WebSocketClient();

    var browser = bonjour.find({ type: 'http' });

    browser.start();

    var interval = $interval(function () {
        browser.update();
    }, 500)

    browser.on('up', function (service) {
        if (service.name.substr(0, 4) == 'EDC-') {
            service.alias = service.name.split(',')[0];
            $scope.$apply(function () {
                $scope.nearbyEdc.push(service);
            });
        }

        if ($rootScope.connection) {
            $scope.nearbyEdc.forEach(function (edc, index) {
                if ($rootScope.connection.edcName == edc.name) {
                    $scope.selectedEdcIndex = index;
                }
            })
        }


    });

    browser.on('down', function (service) {
        $scope.$apply(function () {
            $scope.nearbyEdc.forEach(function (edc, index) {
                if (edc.name == service.name) {
                    $scope.nearbyEdc.splice(index, 1);
                }
            })
        });
    });


    $scope.selectedEdcIndex = -1;

    userSettings.getUserSetting("selectedEdc")
        .then(function (success) {
            $scope.getSelectedEdc($scope.selectedEdc);
            console.log("Edc data is found.");
        }, function (fail) {
            console.log("Edc data is not found.");
        })

    $scope.selectEdc = function (index) {
        $scope.selectedEdcIndex = index;
        $scope.selectedEdc = $scope.nearbyEdc[index];
        localStorage.setItem("selectedEdc", JSON.stringify($scope.selectedEdc));
        userSettings.setUserSetting("selectedEdc", $scope.selectedEdc)
            .then(function (success) {
                console.log("Edc data is persisted.");
            }, function (fail) {
                console.log("Edc data is not persisted.");
            })
        $rootScope.connectEdc($scope.selectedEdc.name, $scope.selectedEdc.referer.address, $scope.selectedEdc.port);
    };

    $scope.$on('$destroy', function () {
        $interval.cancel(interval);
        browser.stop();
    })


})

POSApp.controller('allOrderCtrl', function ($rootScope, $scope, $state, appService, printService, $webSql, $window, $filter, $http, $timeout, HTTP_RESPONSE, ERROR_MESSAGES) {
    // $scope.db = $webSql.openDatabase('poc_db', '1.0', 'POC DB', 2 * 1024 * 1024);
    $scope.showSelectedOrder = false;
    $scope.allOrders = [];
    $scope.selindex = -1;
    $scope.grocery = 0;
    $scope.dinein = 0;
    $scope.pickup = 0;
    $scope.delivery = 0;
    $scope.is_filter = 0;
    $scope.disableDelete = true;
    $scope.filters = [0, 0, 0, 0];
    $scope.paymentMethod = {
        cardNumber: "",
        referenceId: "",
        cashAmountPaid: ""
    }
    $scope.searchQuery = "";
    $scope.showLoadMoreBtn = false;
    $scope.searchText = "Search Results :";

    $scope.showAlertBox = function (alertText) {
        $scope.alertText = alertText;
        $('#alertBox').modal('show');
    }
    // $rootScope.showLoading();
    $scope.showSearchBar = function () {
        $(".search-order").show();
    }

    $scope.hideSearchBar = function () {
        $scope.searchQuery = "";
        $(".search-order").hide();
    }


    $scope.searchOrder = function (e) {
        $scope.showLoadMoreBtn = false;
        $scope.selOrderType = 'All';
        if (e.keyCode == 13) {
            $rootScope.showLoading();
            $scope.showSelectedOrder = false;
            appService.searchOrder($scope.searchQuery)
                .then(function (response) {
                    $scope.allOrders = [];
                    if (response.data.length == 0) {
                        // Handle error 
                        $('#searchResults').show();
                        $scope.searchText = "No Search Results Found.";
                    }
                    else {
                        // Success callback
                        $scope.searchText = "Search Results :";
                        $('#searchResults').show();
                        $scope.selOrderType = "";
                        $scope.allOrders = response.data;
                        $('.all-order-main').animate({
                            scrollTop: 0
                        }, 'slow');
                    }
                    $rootScope.hideLoading();
                }, function (error) {
                    $scope.allOrders = [];
                    $scope.selOrderType = "";
                    $rootScope.hideLoading();

                    if (error == HTTP_RESPONSE.TIMEOUT) {
                        $scope.showAlertBox(ERROR_MESSAGES.TIMEOUT);
                    }
                    else if (error == HTTP_RESPONSE.SERVER_ERROR) {
                        $scope.showAlertBox(ERROR_MESSAGES.SERVER_ERROR);
                    }
                    else {
                        $scope.showAlertBox(ERROR_MESSAGES.OTHER);
                    }
                })
        }
    }

    $scope.selOrderType = 'All';
    // $scope.db.selectAll("orders", {
    // }).then(function (results) {
    //     console.log("Inside WebSQL db");
    //     console.log(results);
    //     $scope.orderslist = {};
    //     if (results.rows.length > 0) {
    //         for (i = 0; i < results.rows.length; i++) {
    //             $scope.orderslist[i] = results.rows[i];
    //         }
    //         $scope.allOrders = $scope.orderslist;
    //         $scope.selOrder = $scope.allOrders[0];
    //         $scope.showSelectedOrder = true;
    //     } else {
    //         appService.getAllOrder().then(function (result) {
    //             console.log("Inside API all orders");
    //             console.log(result);
    //             $scope.allOrders = result.data.items;
    //             $scope.selOrder = $scope.allOrders[0];
    //             $scope.showSelectedOrder = true;
    //         }, function (error) {
    //             alert(error.data[0].message);
    //         });
    //     }
    // })

    $scope.editOrder = function (order) {
        console.log($rootScope.savedOrder);

        if ($rootScope.savedOrder) {
            if ($rootScope.savedOrder.isSaved) {
                $state.go("main.mainview", { order: order });
            }
            else {
                $scope.showAlertBox(ERROR_MESSAGES.ONGOING_ORDER);
            }
        }
        else {
            $state.go("main.mainview", { order: order });
        }
    }

    $scope.printOrder = function (order) {


        if (localStorage.getItem("connectedPrinter")) {
            console.log(printService.printOrder(order));
        }
        else {
            $scope.showAlertBox('Printer is not connected.')
        }
    }

    $scope.deleteOrder = function (orderId) {
        $rootScope.showLoading();
        appService.deleteOrder(orderId)
            .then(function (response) {
                $scope.showSelectedOrder = false;
                $scope.openOrders.forEach(function (order, index) {
                    if (order.id == orderId) {
                        $scope.openOrders.splice(index, 1);
                        $scope.allOrders = $scope.openOrders;
                    }
                })
                $rootScope.hideLoading();
            }, function (error) {
                console.log("INside error callback")
                if (error == HTTP_RESPONSE.TIMEOUT) {
                    $scope.showAlertBox(ERROR_MESSAGES.TIMEOUT);
                }
                else if (error == HTTP_RESPONSE.SERVER_ERROR) {
                    $scope.showAlertBox(ERROR_MESSAGES.SERVER_ERROR);
                }
                else {
                    $scope.showAlertBox(ERROR_MESSAGES.OTHER);
                }
                $rootScope.hideLoading();
            })
    }

    $scope.allowNumbersOnly = function (e) {
        let keyPressed = e.keyCode;
        if (keyPressed == 13) {
            return;
        }

        if (keyPressed < 48 || keyPressed > 57) {
            e.preventDefault();
        }
    }

    $scope.markAsCompleteAction = function (paymentMode) {
        $('#markAsComplete').modal('hide');
        $rootScope.showLoading();
        data = {
            payment_type: "",
            order_id: $scope.selOrder.id,
            payment_detail: ""
        }

        $scope.markError = "";

        if (paymentMode == 1) {
            //CARD
            data.payment_type = 3;

            if ($scope.paymentMethod.cardNumber) {
                data.payment_detail = "XXXX-XXXX-XXXX-" + $scope.paymentMethod.cardNumber;
            }
            else {
                data.payment_detail = ""
            }
        }
        if (paymentMode == 2) {
            //CASH
            data.payment_type = 1;
            data.payment_detail = "";
        }
        if (paymentMode == 3) {
            //OTHER
            data.payment_type = 4;
            data.payment_detail = $scope.paymentMethod.referenceId;
        }

        appService.markAsComplete(data)
            .then(function () {
                $('#markAsComplete').modal('hide');
                $scope.showSelectedOrder = false;
                $scope.openOrders.forEach(function (order, index) {
                    if (order.id == $scope.selOrder.id) {
                        $scope.openOrders.splice(index, 1);
                        $scope.allOrders = $scope.openOrders;
                    }
                    $scope.paymentMethod = {
                        cardNumber: "",
                        referenceId: "",
                        cashAmountPaid: ""
                    }
                    $scope.selectedPaymentMode = 1;
                    $rootScope.hideLoading();
                    $rootScope.savedOrder = null;
                })
            }, function (error) {
                console.log(error);
                if (error == HTTP_RESPONSE.TIMEOUT) {
                    $scope.markError = ERROR_MESSAGES.TIMEOUT;
                }
                else if (error == HTTP_RESPONSE.SERVER_ERROR) {
                    $scope.markError = ERROR_MESSAGES.SERVER_ERROR;
                }
                else {
                    $scope.markError = ERROR_MESSAGES.OTHER;
                }
                $rootScope.hideLoading();
            })

    }

    // $scope.calBalanceleft = function (orderTotal, cashAmountPaid) {
    //     // if (cashAmountPaid == undefined) {
    //     //     cashAmountPaid = 0;
    //     // }
    //     // if (orderTotal > cashAmountPaid) {
    //     //     return 0;
    //     // } else {
    //     //     return (cashAmountPaid - orderTotal).toFixed(2);
    //     // }

    // }

    $scope.calBalanceleft = function (orderTotal, cashAmountPaid) {
        if (cashAmountPaid == undefined) {
            cashAmountPaid = 0;
        }
        return (cashAmountPaid - orderTotal).toFixed(2);
    }

    $scope.disableChargeCash = function (orderTotal, cashAmountPaid) {
        if (cashAmountPaid == "") {
            console.log("khali hai");
            return false;
        }
        else {
            return $scope.calBalanceleft(orderTotal, cashAmountPaid) < 0;
        }
    }

    $scope.getOrderBasedOnType = function (type) {

        $('.all-order-main').animate({
            scrollTop: 0
        }, 'slow');

        $('#searchResults').hide();




        $scope.selindex = -1;
        $scope.showLoadMoreBtn = false;
        if (type == 0) {
            $scope.selOrderType = 'Completed';
            $scope.allOrders = $scope.completedOrders;
            if ($scope.openOrderHasNext) {
                $scope.showLoadMoreBtn = true;
            }
        } else {
            $scope.selOrderType = 'Open';
            $scope.allOrders = $scope.openOrders;
            if ($scope.completedOrderHasNext) {
                $scope.showLoadMoreBtn = true;
            }
        }
        $scope.showSelectedOrder = false;


        if ($scope.filters[0] + $scope.filters[1] + $scope.filters[2] + $scope.filters[3] != 0) {
            $scope.showLoadMoreBtn = false;
        }
        //$scope.allOrders = [];
        // $scope.db.select("orders", {
        //     "open": type
        // }).then(function (results) {
        //     $scope.orderslist = {};
        //     if (results.rows.length > 0) {
        //         for (i = 0; i < results.rows.length; i++) {
        //             $scope.orderslist[i] = results.rows[i];
        //         }
        //         $scope.allOrders = $scope.orderslist;
        //         $scope.selOrder = $scope.allOrders[0];
        //         $scope.showSelectedOrder = true;
        //     } else {
        //         appService.getOrderBasedOnType(type).then(function (result) {
        //             //console.log(result);
        //             $scope.allOrders = result.data.items;
        //             $scope.selOrder = $scope.allOrders[0];
        //             $scope.showSelectedOrder = true;
        //         }, function (error) {
        //             alert(error.data[0].message);
        //         });
        //     }
        // });
    }

    $scope.getAllOrders = function () {
        $scope.allOrders = [];
        $scope.showSelectedOrder = false;
        $rootScope.showLoading();
        $scope.selOrderType = 'Open';
        completedOrdersRequest = appService.getOrderBasedOnType(0);
        openOrdersRequest = appService.getOrderBasedOnType(1);

        Promise.all([completedOrdersRequest, openOrdersRequest])
            .then(function (response) {
                console.log(response);
                $scope.openOrders = response[1].data.items;
                $scope.openOrderHasNext = response[1].data._links.next;
                $scope.completedOrders = response[0].data.items;
                $scope.completedOrderHasNext = response[0].data._links.next;
                $scope.$apply(function () {
                    $scope.allOrders = $scope.openOrders;
                    $scope.showSelectedOrder = false;
                    if ($scope.openOrderHasNext) {
                        $scope.showLoadMoreBtn = true;
                    }
                })
                $rootScope.hideLoading();
            }, function (error) {
                if (error == HTTP_RESPONSE.TIMEOUT) {
                    $scope.showAlertBox(ERROR_MESSAGES.TIMEOUT);
                }
                else if (error == HTTP_RESPONSE.SERVER_ERROR) {
                    $scope.showAlertBox(ERROR_MESSAGES.SERVER_ERROR);
                }
                else {
                    $scope.showAlertBox(ERROR_MESSAGES.OTHER);
                }
                $rootScope.hideLoading();
            })
    }

    $scope.loadMoreOrders = function () {
        if ($scope.selOrderType == "Completed") {
            $rootScope.showLoading();
            $http({
                method: 'GET',
                url: $scope.completedOrderHasNext.href
            }).then(function (response) {
                console.log(response);
                $timeout(function () {
                    $scope.completedOrders = $scope.completedOrders.concat(response.data.items);
                    $scope.completedOrderHasNext = response.data._links.next;
                    $scope.allOrders = $scope.completedOrders;
                    if ($scope.completedOrderHasNext) {
                        $scope.showLoadMoreBtn = true;
                    }
                    $rootScope.hideLoading();
                }, 0)
            })
        }
        else {
            $rootScope.showLoading();
            $http({
                method: 'GET',
                url: $scope.openOrderHasNext.href
            }).then(function (response) {
                console.log(response);
                $timeout(function () {
                    $scope.openOrders = $scope.openOrders.concat(response.data.items);
                    $scope.openOrderHasNext = response.data._links.next;
                    $scope.allOrders = $scope.openOrders;
                    if ($scope.openOrderHasNext) {
                        $scope.showLoadMoreBtn = true;
                    }
                    $rootScope.hideLoading();
                }, 0)
            })
        }
    }

    $scope.selOrderDetails = function (selectedItem) {
        $scope.disableDelete = true;
        if ($rootScope.savedOrder) {
            if ($rootScope.savedOrder.lastSavedOrderId == selectedItem.id)
                $scope.disableDelete = false;
        }

        $rootScope.showLoading();
        $scope.selindex = selectedItem.id;
        appService.getOrderDetails(selectedItem.id)
            .then(function (response) {
                $scope.selOrder = response.data;
                $scope.showSelectedOrder = true;
                $rootScope.hideLoading();
            }, function (error) {
                if (error == HTTP_RESPONSE.TIMEOUT) {
                    $scope.showAlertBox(ERROR_MESSAGES.TIMEOUT);
                }
                else if (error == HTTP_RESPONSE.SERVER_ERROR) {
                    $scope.showAlertBox(ERROR_MESSAGES.SERVER_ERROR);
                }
                else {
                    $scope.showAlertBox(ERROR_MESSAGES.OTHER);
                }
                $rootScope.hideLoading();
            })
    }
    $scope.onSettingsBack = function () {
        console.log($rootScope.savedOrder)
        $state.go("main.mainview", { finalOrder: $rootScope.savedOrder });
    }

    $scope.getOrderBasedOnFilter = function (filter) {
        if ($scope.filters[filter] == 0) {
            $scope.filters[filter] = 1;
        }
        else {
            $scope.filters[filter] = 0;
        }

        if ($scope.filters[0] + $scope.filters[1] + $scope.filters[2] + $scope.filters[3] != 0) {
            $scope.showLoadMoreBtn = false;
        }

        // if ($scope[filter] == 1) {
        //     $scope[filter] = 0;
        //     $scope.is_filter = $scope.is_filter - 1;
        // } else {
        //     $scope[filter] = 1;
        //     $scope.is_filter = $scope.is_filter + 1;
        // }
        // if ($scope.selOrderType == 'Completed') {
        //     var seltype = 0;
        // } else {
        //     var seltype = 1;
        // }
        // if ($scope.is_filter == 0) {
        //     if ($scope.selOrderType == 'All') {
        //         $scope.getAllOrders();
        //     } else {
        //         $scope.getOrderBasedOnType(seltype);
        //     }
        // } else {
        //     $scope.showSelectedOrder = false;
        //     $scope.allOrders = [];
        //     if ($scope.selOrderType == 'All') {
        //         $scope.db.select("orders", {
        //             "instore": {
        //                 "value": $scope.grocery,
        //                 "union": 'AND'
        //             },
        //             "dinein": {
        //                 "value": $scope.dinein,
        //                 "union": 'AND'
        //             },
        //             "pay_later": {
        //                 "value": $scope.pickup,
        //                 "union": 'AND'
        //             },
        //             "marketplace": $scope.delivery
        //         }).then(function (results) {
        //             $scope.orderslist = {};
        //             if (results.rows.length > 0) {
        //                 for (i = 0; i < results.rows.length; i++) {
        //                     $scope.orderslist[i] = results.rows[i];
        //                 }
        //                 $scope.allOrders = $scope.orderslist;
        //                 $scope.selOrder = $scope.allOrders[0];
        //                 $scope.showSelectedOrder = true;
        //             } else {
        //                 var filters = "&dinein=" + $scope.dinein + "&pay_later=" + $scope.pickup + "&instore=" + $scope.grocery + "&marketplace=" + $scope.delivery;
        //                 appService.getOrderBasedOnFilter(filters).then(function (result) {
        //                     //console.log(result);
        //                     $scope.allOrders = result.data.items;
        //                     $scope.selOrder = $scope.allOrders[0];
        //                     $scope.showSelectedOrder = true;
        //                 }, function (error) {
        //                     alert(error.data[0].message);
        //                 });
        //             }
        //         });
        //     } else {
        //         $scope.db.select("orders", {
        //             "instore": {
        //                 "value": $scope.grocery,
        //                 "union": 'AND'
        //             },
        //             "dinein": {
        //                 "value": $scope.dinein,
        //                 "union": 'AND'
        //             },
        //             "pay_later": {
        //                 "value": $scope.pickup,
        //                 "union": 'AND'
        //             },
        //             "marketplace": {
        //                 "value": $scope.delivery,
        //                 "union": 'AND'
        //             },
        //             "open": seltype
        //         }).then(function (results) {
        //             $scope.orderslist = {};
        //             if (results.rows.length > 0) {
        //                 for (i = 0; i < results.rows.length; i++) {
        //                     $scope.orderslist[i] = results.rows[i];
        //                 }
        //                 $scope.allOrders = $scope.orderslist;
        //                 $scope.selOrder = $scope.allOrders[0];
        //                 $scope.showSelectedOrder = true;
        //             } else {
        //                 if ($scope.selOrderType == 'All') {
        //                     var filters = "&dinein=" + $scope.dinein + "&pay_later=" + $scope.pickup + "&instore=" + $scope.grocery + "&marketplace=" + $scope.delivery;
        //                 } else {
        //                     var filters = "open=" + seltype + "&dinein=" + $scope.dinein + "&pay_later=" + $scope.pickup + "&instore=" + $scope.grocery + "&marketplace=" + $scope.delivery;

        //                 }
        //                 appService.getOrderBasedOnFilter(filters).then(function (result) {
        //                     //console.log(result);
        //                     $scope.allOrders = result.data.items;
        //                     $scope.selOrder = $scope.allOrders[0];
        //                     $scope.showSelectedOrder = true;
        //                 }, function (error) {
        //                     alert(error.data[0].message);
        //                 });
        //             }
        //         });
        //     }
        // }
    }

    $scope.convertDateFormat = function (date_time) {
        if (date_time != "") {
            var localTime = moment(date_time).format('MMM Do YYYY, h:mm A');
            return localTime;
        } else {
            return "";
        }

    }

    $scope.getAllOrders();
});