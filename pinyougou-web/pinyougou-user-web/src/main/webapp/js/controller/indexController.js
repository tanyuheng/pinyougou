/** 定义控制器层 */
app.controller('indexController', function($scope, baseService){

    // 获取登录用户名
    $scope.showName = function () {
        baseService.sendGet("/user/showName").then(function (response) {
            // 获取响应数据
            $scope.loginName = response.data.loginName;
        });
    };

    /** 查询条件对象 */
    $scope.searchEntity = {page:1};
    /** 查询订单  */
    $scope.findOrder = function () {
        baseService.sendGet("/order/findOrder?pageNum="+$scope.searchEntity.page+"&size="+2).then(function (response) {
            $scope.resultMap = response.data;
            initPageNum();
        })
    };


    /** 显示修改 */
    $scope.show = function(entity){
        /** 把json对象转化成一个新的json对象 */
        $scope.entity = JSON.parse(JSON.stringify(entity));
    };



    /** 定义初始化页码方法 */
    var initPageNum = function(){
        /** 定义页码数组 */
        $scope.pageNums = [];
        /** 获取总页数 */
        var totalPages = $scope.resultMap.totalPages;
        /** 开始页码 */
        var firstPage = 1;
        /** 结束页码 */
        var lastPage = totalPages;

        // 前面是否加省略号
        $scope.firstDot = true;
        // 后面是否加省略号
        $scope.lastDot = true;

        /** 如果总页数大于5，显示部分页码 */
        if (totalPages > 5){
            // 如果当前页码处于前面位置
            if ($scope.searchEntity.page <= 3){
                lastPage = 5; // 生成前5页页码
                $scope.firstDot = false;
            }
            // 如果当前页码处于后面位置
            else if ($scope.searchEntity.page >= totalPages - 3){
                firstPage = totalPages - 4;  // 生成后5页页码
                $scope.lastDot = false;
            }else{ // 当前页码处于中间位置
                firstPage = $scope.searchEntity.page - 2;
                lastPage = $scope.searchEntity.page + 2;
            }
        }else{
            $scope.firstDot = false;
            $scope.lastDot = false;
        }
        /** 循环产生页码 */
        for (var i = firstPage; i <= lastPage; i++){
            $scope.pageNums.push(i);
        }
    };
    // 根据页码查询
    $scope.pageSearch = function (page) {
        page = parseInt(page);
        // 判断当前页码的有效性: 页码不能小于1、页码不能大于总页数、页码不能等于当前页码
        if (page >= 1 && page <= $scope.resultMap.totalPages && page != $scope.searchEntity.page){
            // 设置当前页码
            $scope.searchEntity.page = page;
            // 执行搜索
            $scope.findOrder();

        }
    };

    /**  付款 */
    $scope.pay = function (orderId) {
        baseService.sendGet("/order/pay?orderId="+orderId).then(function (response) {
            if (response.data == true){
                // location.href ="../../pay.html?orderId="+orderId;
                location.href= "http://cart.pinyougou.com/order/pay.html"
            }else {
                alert("系统繁忙,请稍后再试!");
            }
        });
    };

    /*用户关闭订单*/
    $scope.closeOrder = function (orderId) {
        if (confirm("确定取消订单吗?")){
            baseService.sendGet("/order/closeOrder?orderId="+orderId).then(function (response) {
                if (response.data == true){
                    alert("取消订单成功!");
                    $scope.findOrder();
                }else {
                    alert("取消订单失败!");
                }
            });
        }
    };
});