/** 定义控制器层 */
app.controller('indexController', function($scope, baseService){

    // 获取登录用户名
    $scope.showName = function () {
        baseService.sendGet("/user/showName").then(function (response) {
            // 获取响应数据
            $scope.loginName = response.data.loginName;
        });
    };

    /** 查询订单  */
    $scope.findOrder = function () {
        baseService.sendGet("/order/findOrder").then(function (response) {
            $scope.orderItems = response.data.orderItems;
            $scope.orders = response.data.orders;
        })
    }

});