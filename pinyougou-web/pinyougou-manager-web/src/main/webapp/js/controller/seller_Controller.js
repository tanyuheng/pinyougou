/** 定义控制器层 */
app.controller('seller_Controller', function($scope, $controller, baseService){

    /** 指定继承baseController */
    $controller('baseController',{$scope:$scope});

    /** 查询条件对象 */
    $scope.searchEntity = {status : '1'};
    /** 分页查询(查询条件) */
    $scope.search = function(page, rows){
        baseService.findByPage("/seller/findByPage", page,
            rows, $scope.searchEntity)
            .then(function(response){
                /** 获取分页查询结果 */
                $scope.dataList = response.data.rows;
                /** 更新分页总记录数 */
                $scope.paginationConf.totalItems = response.data.total;
            });
    };
});