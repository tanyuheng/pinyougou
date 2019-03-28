/** 定义购物车控制器 */
app.controller('cartController', function ($scope, $controller, baseService) {

    // 指定继承baseController
    $controller('baseController', {$scope:$scope});

    /** 查询购物车数据 */
    $scope.findCart = function (aa) {
        baseService.sendGet("/cart/findCart", "prefix="+aa).then(function (response) {
            $scope.carts = response.data;

            // 定义总计对象
            $scope.totalEntity = {totalNum : 0, totalMoney : 0};
            $scope.dataNum = 0;
            for (var i = 0; i < $scope.carts.length; i++) {
                $scope.cart = $scope.carts[i];
                angular.forEach($scope.cart.orderItems, function (orderItem, i) {
                    $scope.dataNum ++;
                });
            }
            for (var i = 0; i < $scope.carts.length; i++) {
                var cart = $scope.carts[i];
                for (var j = 0; j < cart.orderItems.length; j++) {
                    var orderItem = cart.orderItems[j];
                    if ($scope.selectedIds.indexOf(orderItem.itemId) > -1) {
                        $scope.totalEntity.totalNum += orderItem.num;
                        $scope.totalEntity.totalMoney += orderItem.totalFee;
                    }
                }
            }
        });
    };


    // 初始化商品全选按钮
    $scope.ckAll = false;
    // 初始化部分商家选中数组
    $scope.selectShopAll = [];
    // 初始化选中商品数组
    $scope.selectedIds = [];


    // 页面初始化
    $scope.initPage = function () {
        for (var i = 0; i < $scope.carts.length; i++) {
            $scope.cart = $scope.carts[i];
            angular.forEach($scope.cart.orderItems, function (orderItem, i) {
                $scope.dataNum ++;
                $scope.selectedIds.push(orderItem.itemId);
                $scope.selectShopAll[i] = true;
                $scope.totalEntity.totalMoney += orderItem.totalFee;
                $scope.totalEntity.totalNum += orderItem.num;
            });
        }
    };

    /** 添加SKU商品到购物车 */
    $scope.addCart = function (itemId, num) {
        baseService.sendGet("/cart/addCart", "itemId=" + itemId + "&num=" + num)
            .then(function (response) {
                if (response.data) {
                    $scope.findCart("cart_");
                }
            });
    };



    //部分商家全选
    $scope.changeShopAll = function (cart, $event, index) {
        //遍历该商家下的每个商品
        angular.forEach(cart.orderItems, function (value, i) {
            if ($event.target.checked) {
                $scope.selectShopAll[index] = true;
                if ($scope.selectedIds.indexOf(value.itemId) < 0) {
                    $scope.selectedIds.push(value.itemId);
                }

            } else {
                $scope.selectShopAll[index] = false;
                while ($scope.selectedIds.indexOf(value.itemId) > -1) {
                    var idx = $scope.selectedIds.indexOf(value.itemId);
                    $scope.selectedIds.splice(idx, 1);
                }
            }
            $scope.ckAll = $scope.selectedIds.length == $scope.dataNum;
            $scope.findCart("cart_");

        });
    };

    // 商品选中
    $scope.updateSelected = function ($event, cart, orderItem) {

        if ($event.target.checked) {
            $scope.selectedIds.push(orderItem.itemId);
        } else {
            var idx = $scope.selectedIds.indexOf(orderItem.itemId);
            $scope.selectedIds.splice(idx, 1);
        }
        $scope.selectShopAll[$scope.carts.indexOf(cart)] = true;

        for (var i = 0; i < cart.orderItems.length; i++) {
            if ($scope.selectedIds.indexOf(cart.orderItems[i].itemId) < 0) {
                $scope.selectShopAll[$scope.carts.indexOf(cart)] = false;
            }
        }
        $scope.ckAll = $scope.selectedIds.length == $scope.dataNum;
        $scope.findCart("cart_");

    };

    // 全选
    $scope.selectAll = function ($event) {
        $scope.selectedIds = [];
        $scope.selectShopAll = [];
        for (var i = 0; i < $scope.carts.length; i++) {
            var cart = $scope.carts[i];
            angular.forEach(cart.orderItems, function (value, index) {
                if ($event.target.checked) {
                    $scope.selectShopAll[i] = true;
                    $scope.selectedIds.push(value.itemId);
                } else {
                    $scope.selectShopAll[i] = false;
                }
            });
        }
        $scope.findCart("cart_");
    };

    // 生成订单方法, 将勾选的itemId传到订单页面
    $scope.generateOrder = function () {
        if ($scope.selectedIds != null && $scope.selectedIds.length > 0){
            baseService.sendGet("/cart/generateOrderItemList?itemIds=" + $scope.selectedIds).then(
                function (response) {
                    if (response.data) {
                        location.href = "/order/getOrderInfo.html";
                    }
                }
            )
        } else {
            alert("请选择要结算的商品！");
        }
    };

});