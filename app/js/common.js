window.common = (function () {
    var common = {};
    common.createDBAndTables = function ($rootScope, $scope, $state, appService, $webSql) {
        /*CREATING Database , TABLES , Opening Database websql*/
        $scope.db = $webSql.openDatabase('poc_db', '1.0', 'POC DB', 2 * 1024 * 1024);

        /*Dropping table  */

        $scope.db.dropTable("users");
        $scope.db.dropTable("merchant");
        $scope.db.dropTable("product_categories");
        $scope.db.dropTable("pickup_location");
        $scope.db.dropTable("store_location");
        $scope.db.dropTable("product");
        $scope.db.dropTable("product_collection");
        $scope.db.dropTable("merchant_location");
        $scope.db.dropTable("orders");


        $scope.db.createTable('orders', {
            "id": {
                "type": "INTEGER",
                "null": "NOT NULL", // default is "NULL" (if not defined)
                "primary": true, // primary
                "auto_increment": true // auto increment
            },
            "created_at": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP" // default value
            },
            "updated_at": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP" // default value
            },
            "amount": {
                "type": "FLOAT(10,6)"
            },
            "cash_on_delivery": {
                "type": "INTEGER"
            },
            "customer": {
                "type": "TEXT"
            },
            "delivery_detail": {
                "type": "INTEGER"
            },
            "dinein": {
                "type": "INTEGER"
            },
            "instore": {
                "type": "INTEGER"
            },
            "marketplace": {
                "type": "INTEGER"
            },
            "merchant_location_id": {
                "type": "INTEGER"
            },
            "name": {
                "type": "TEXT"
            },
            "offline_order_id": {
                "type": "TEXT"
            },
            "open": {
                "type": "INTEGER"
            },
            "order_note": {
                "type": "TEXT"
            },
            "pay_later": {
                "type": "INTEGER"
            },
            "payment_detail": {
                "type": "TEXT"
            },
            "payment_detail_label": {
                "type": "TEXT"
            },
            "payment_method": {
                "type": "TEXT"
            },
            "pickup_detail": {
                "type": "INTEGER"
            },
            "pickup_id": {
                "type": "INTEGER"
            },
            "pos": {
                "type": "INTEGER"
            },
            "shipping_detail": {
                "type": "INTEGER"
            },
            "shipping_details_id": {
                "type": "INTEGER"
            },
            "shipping_status": {
                "type": "INTEGER"
            },
            "transaction_status": {
                "type": "INTEGER"
            },
            "user_id": {
                "type": "INTEGER"
            }
        })

        /*creating "users" table */
        $scope.db.createTable('users', {
            "id": {
                "type": "INTEGER",
                "null": "NOT NULL", // default is "NULL" (if not defined)
                "primary": true, // primary
                "auto_increment": true // auto increment
            },
            "created": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP" // default value
            },
            "name": {
                "type": "TEXT",
                "null": "NOT NULL"
            },
            "currency": {
                "type": "TEXT"
            },
            "country": {
                "type": "TEXT"
            },
            "merchant_category": {
                "type": "TEXT"
            },
            "access_token": {
                "type": "TEXT",
                "null": "NOT NULL"
            },
            "username": {
                "type": "TEXT",
                "null": "NOT NULL"
            },
            "password": {
                "type": "TEXT",
                "null": "NOT NULL"
            }
        })

        /* Creating "Merchant" table */
        $scope.db.createTable('merchant', {
            "id": {
                "type": "INTEGER",
                "null": "NOT NULL", // default is "NULL" (if not defined)
                "primary": true, // primary
                "auto_increment": true // auto increment
            },
            "created": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP" // default value
            },
            "location": {
                "type": "TEXT"
            },
            "qr_code": {
                "type": "TEXT"
            },
            "is_blockable": {
                "type": "TEXT"
            },
            "primary": {
                "type": "TEXT"
            }
        })

        $scope.db.createTable('product_categories', {
            "id": {
                "type": "INTEGER",
                "null": "NOT NULL", // default is "NULL" (if not defined)
                "primary": true, // primary
                "auto_increment": true // auto increment
            },
            "created": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP" // default value
            },
            "name": {
                "type": "TEXT"
            },
            "image": {
                "type": "TEXT"
            },
            "is_collection": {
                "type": "INTEGER"
            },
            "color_code": {
                "type": "TEXT"
            }
        })

        $scope.db.createTable('pickup_location', {
            "id": {
                "type": "INTEGER",
                "null": "NOT NULL", // default is "NULL" (if not defined)
                "primary": true, // primary
                "auto_increment": true // auto increment
            },
            "created": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP" // default value
            },
            "address1": {
                "type": "TEXT"
            },
            "address2": {
                "type": "TEXT"
            },
            "city": {
                "type": "TEXT"
            },
            "email": {
                "type": "TEXT"
            },
            "location": {
                "type": "TEXT"
            },
            "phone_number": {
                "type": "TEXT"
            },
            "state": {
                "type": "TEXT"
            },
            "zip": {
                "type": "TEXT"
            },
            "location_service": {
                "type": "TEXT"
            },
            "location_type": {
                "type": "TEXT"
            }
        })

        $scope.db.createTable('store_location', {
            "id": {
                "type": "INTEGER",
                "null": "NOT NULL", // default is "NULL" (if not defined)
                "primary": true, // primary
                "auto_increment": true // auto increment
            },
            "created": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP" // default value
            },
            "address1": {
                "type": "TEXT"
            },
            "address2": {
                "type": "TEXT"
            },
            "city": {
                "type": "TEXT"
            },
            "email": {
                "type": "TEXT"
            },
            "location": {
                "type": "TEXT"
            },
            "phone_number": {
                "type": "TEXT"
            },
            "state": {
                "type": "TEXT"
            },
            "zip": {
                "type": "TEXT"
            },
            "location_service": {
                "type": "TEXT"
            },
            "location_type": {
                "type": "TEXT"
            }
        })


        $scope.db.createTable('product', {
            "id": {
                "type": "INTEGER",
                "null": "NOT NULL", // default is "NULL" (if not defined)
                "primary": true, // primary
                "auto_increment": true // auto increment
            },
            "created_at": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP" // default value
            },
            "sku": {
                "type": "TEXT"
            },
            "barcode_id": {
                "type": "TEXT"
            },
            "name": {
                "type": "TEXT"
            },
            "short_description": {
                "type": "TEXT"
            },
            "description": {
                "type": "TEXT"
            },
            "specification": {
                "type": "TEXT"
            },
            "vendor_code": {
                "type": "TEXT"
            },
            "vendor_name": {
                "type": "TEXT"
            },
            "price": {
                "type": "INTEGER"
            },
            "cost_price": {
                "type": "INTEGER"
            },
            "discount": {
                "type": "INTEGER"
            },
            "discount_type": {
                "type": "INTEGER"
            },
            "discounted_price": {
                "type": "INTEGER"
            },
            "currency": {
                "type": "TEXT"
            },
            "inventory": {
                "type": "INTEGER"
            },
            "weight": {
                "type": "INTEGER"
            },
            "category_id": {
                "type": "INTEGER"
            },
            "signcatch_category_id": {
                "type": "INTEGER"
            },
            "signcatch_brand_id": {
                "type": "INTEGER"
            },
            "brand_id": {
                "type": "INTEGER"
            },
            "brand_name": {
                "type": "TEXT"
            },
            "unlimited_quantity": {
                "type": "INTEGER"
            },
            "delivery": {
                "type": "INTEGER"
            },
            "international_delivery": {
                "type": "INTEGER"
            },
            "delivery_type_id": {
                "type": "INTEGER"
            },
            "favorite_product": {
                "type": "INTEGER"
            },
            "taxable": {
                "type": "INTEGER"
            },
            "product_thumbnail": {
                "type": "TEXT"
            },
            "product_thumbnail_small": {
                "type": "TEXT"
            },
            "product_type": {
                "type": "INTEGER"
            },
            "ingredients": {
                "type": "INTEGER"
            },
            "product_addon": {
                "type": "INTEGER"
            },
            "review_rating": {
                "type": "INTEGER"
            },
            "review_count": {
                "type": "INTEGER"
            },
            "updated_at": {
                "type": "TIMESTAMP",
                "null": "NOT NULL"
            },
            "is_collection": {
                "type": "INTEGER",
                "default": 0
            },
            "color_code": {
                "type": "TEXT"
            }
        })
        $scope.db.createTable('product_collection', {
            "id": {
                "type": "INTEGER",
                "null": "NOT NULL", // default is "NULL" (if not defined)
                "primary": true, // primary
                "auto_increment": true // auto increment
            },
            "created_at": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP" // default value
            },
            "sku": {
                "type": "TEXT"
            },
            "barcode_id": {
                "type": "TEXT"
            },
            "name": {
                "type": "TEXT"
            },
            "short_description": {
                "type": "TEXT"
            },
            "description": {
                "type": "TEXT"
            },
            "specification": {
                "type": "TEXT"
            },
            "vendor_code": {
                "type": "TEXT"
            },
            "vendor_name": {
                "type": "TEXT"
            },
            "price": {
                "type": "INTEGER"
            },
            "cost_price": {
                "type": "INTEGER"
            },
            "discount": {
                "type": "INTEGER"
            },
            "discount_type": {
                "type": "INTEGER"
            },
            "discounted_price": {
                "type": "INTEGER"
            },
            "currency": {
                "type": "TEXT"
            },
            "inventory": {
                "type": "INTEGER"
            },
            "weight": {
                "type": "INTEGER"
            },
            "category_id": {
                "type": "INTEGER"
            },
            "signcatch_category_id": {
                "type": "INTEGER"
            },
            "signcatch_brand_id": {
                "type": "INTEGER"
            },
            "brand_id": {
                "type": "INTEGER"
            },
            "brand_name": {
                "type": "TEXT"
            },
            "unlimited_quantity": {
                "type": "INTEGER"
            },
            "delivery": {
                "type": "INTEGER"
            },
            "international_delivery": {
                "type": "INTEGER"
            },
            "delivery_type_id": {
                "type": "INTEGER"
            },
            "favorite_product": {
                "type": "INTEGER"
            },
            "taxable": {
                "type": "INTEGER"
            },
            "product_thumbnail": {
                "type": "TEXT"
            },
            "product_thumbnail_small": {
                "type": "TEXT"
            },
            "product_type": {
                "type": "INTEGER"
            },
            "ingredients": {
                "type": "INTEGER"
            },
            "product_addon": {
                "type": "INTEGER"
            },
            "review_rating": {
                "type": "INTEGER"
            },
            "review_count": {
                "type": "INTEGER"
            },
            "updated_at": {
                "type": "TIMESTAMP",
                "null": "NOT NULL"
            },
            "is_collection": {
                "type": "INTEGER",
                "default": 1
            },
            "tax_inclusive": {
                "type": "INTEGER",
                "default": 0
            },
            "pre_tax_amount": {
                "type": "INTEGER",
                "default": 0
            },
            "color_code": {
                "type": "TEXT"
            }
        })
        /* Creating "Merchant" table */
        $scope.db.createTable('merchant_location', {
            "id": {
                "type": "INTEGER",
                "null": "NOT NULL", // default is "NULL" (if not defined)
                "primary": true, // primary
                "auto_increment": true // auto increment
            },
            "created": {
                "type": "TIMESTAMP",
                "null": "NOT NULL",
                "default": "CURRENT_TIMESTAMP" // default value
            },
            "location": {
                "type": "TEXT"
            },
            "qr_reference_id": {
                "type": "INTEGER"
            },
            "is_acknowledgement_sent": {
                "type": "INTEGER"
            },
            "is_blockable": {
                "type": "INTEGER"
            },
            "device_id": {
                "type": "TEXT"
            }
        })
        /*CREATING Database , TABLES , Opening Database websql ends here*/
    }

    common.syncDatabase = function ($rootScope, $scope, $state, appService, $webSql) {
        console.log("inside sync database");
        appService.getCategories().then(function (result) {
            console.log("get categories");
            console.log(result);
            $scope.db.del("product_categories", { "name": 'IS NOT NULL' })
            angular.forEach(result.data, function (value, index) {
                $scope.db.insert('product_categories', { "id": index, "name": value.name, 'image': value.image, 'is_collection': value.is_collection, 'color_code': value.color_code }).then(function (results) {
                })

                /********Getting Products************* */
                var isCollection = value.is_collection;
                if (isCollection == 0) {
                    $scope.getCatProducts = function (index, nextpage) {
                        appService.getCategoryProducts(index, nextpage, 100).then(function (result) {
                            var nextpage = result.data.nextpage;
                            //var nextpage = "https://s1api.signcatch.com/pos/web/v1/products/collection_product/93/2/2";
                            var objCount = Object.keys(result.data.product).length;
                            for (var i = 0; i < objCount; i++) {
                                result.data.product[i].color_code = value.color_code;
                                $scope.db.insert('product', result.data.product[i]).then(function (results) {
                                    console.log("Product Insert has been successful.");
                                }, function () {
                                    console.log("Product Insert failed.");
                                })
                            }
                            if (nextpage != "" && nextpage != undefined) {
                                var nextpage = nextpage.charAt(nextpage.length - 3);
                                //again call service
                                $scope.getCatProducts(index, nextpage);
                            }
                        }, function (error) {
                            alert(error.data[0].message);
                        });
                    }
                    appService.getCategoryProducts(index, 0, 100).then(function (result) {
                        var nextpage = result.data.nextpage;
                        //var nextpage = "https://s1api.signcatch.com/pos/web/v1/products/collection_product/93/2/2";
                        var objCount = Object.keys(result.data.product).length;
                        for (var i = 0; i < objCount; i++) {
                            result.data.product[i].color_code = value.color_code;
                            $scope.db.insert('product', result.data.product[i]).then(function (results) {
                                console.log("Product Insert has been successful.");
                            }, function () {
                                console.log("Product Insert failed.");
                            })
                        }
                        if (nextpage != "" && nextpage != undefined) {
                            //again call service
                            var nextpage = nextpage.charAt(nextpage.length - 3);
                            $scope.getCatProducts(index, nextpage);
                        }
                    }, function (error) {
                        alert(error.data[0].message);
                    });
                } else {
                    $scope.getCollectionProducts = function (index, nextpage) {
                        appService.getCollections(index, nextpage, 100).then(function (result) {
                            var nextpage = result.data.nextpage;
                            //var nextpage = "https://s1api.signcatch.com/pos/web/v1/products/collection_product/93/2/2";
                            var objCount = Object.keys(result.data.product).length;
                            for (var i = 0; i < objCount; i++) {
                                result.data.product[i].color_code = value.color_code;
                                $scope.db.insert('product_collection', result.data.product[i]).then(function (results) {
                                })
                            }
                            if (nextpage != "" && nextpage != undefined) {
                                //again call service
                                var nextpage = nextpage.charAt(nextpage.length - 3);
                                $scope.getCollectionProducts(index, nextpage);
                            }
                        }, function (error) {
                            alert(error.data[0].message);
                        });
                    }

                    appService.getCollections(index, 0, 100).then(function (result) {
                        var nextpage = result.data.nextpage;
                        //  var nextpage = "https://s1api.signcatch.com/pos/web/v1/products/collection_product/93/2/2";
                        var objCount = Object.keys(result.data.product).length;
                        for (var i = 0; i < objCount; i++) {
                            result.data.product[i].color_code = value.color_code;
                            $scope.db.insert('product_collection', result.data.product[i]).then(function (results) {
                                console.log("Insert was successful");
                            }, function (error) {
                                console.log(error);
                                console.log("Insert Failed");
                            });
                        }
                        if (nextpage != "" && nextpage != undefined) {
                            //again call service
                            var nextpage = nextpage.charAt(nextpage.length - 3);
                            $scope.getCollectionProducts(index, nextpage);
                        }
                    }, function (error) {
                        alert(error.data[0].message);
                    });
                }
                /******************ends here****************** */
            })
        }, function (error) {
            alert(error.data[0].message);
        });
        // appService.getAllOrder().then(function (result) {
        //     var objCount = Object.keys(result.data.items).length;
        //     for (var i = 0; i < objCount; i++) {
        //         $scope.db.insert('orders', result.data.items[i]).then(function (results) {
        //             console.log("Order has been inserted successfully.");
        //         }, function () {
        //             console.log("Order insert failed.");
        //         });
        //     }
        // }, function (error) {
        //     alert(error.data[0].message);
        // });

        // appService.getMerchantLoc().then(function (result) {
        //     var objCount = Object.keys(result.data.locations).length;
        //     for (var i = 0; i < objCount; i++) {
        //         $scope.db.insert('merchant_location', result.data.locations[i]).then(function (results) {
        //             console.log("Merchant location has been inserted successfully.");
        //         }, function () {
        //             console.log("Merchant location insert failed.");
        //         })
        //     }
        // }, function (error) {
        //     alert(error.data[0].message);
        // });
    }

    return common;
})();