/** 定义控制器层 */
app.controller('addressController', function ($scope, $timeout, $controller,$http, baseService) {


    $controller('userController', {$scope: $scope});
    // 定义json对象
    $scope.loadUsername = function(){
        // 定义重定向URL
        $scope.redirectUrl = window.encodeURIComponent(location.href);
        // 获取登录用户名
        $http.get("/user/showName").then(function(response){
            $scope.loginName = response.data.loginName;
        });
    };


$scope.user.address={};
    $scope.findUserInfo = function () {

        // 发送异步请求 查询用户信息
        baseService.sendGet("/user/findUserInfo").then(function (response) {
            // 获取响应数据
            $scope.user = response.data;
            $scope.user.address = JSON.parse(response.data.address);
        });
    };
    $scope.parseJSON = function (user) {
        $scope.user.address = JSON.parse(JSON.stringify(user));
    };


//更新用户信息
    $scope.saveOrUpdateUser = function () {

        baseService.sendPost("/user/update", $scope.user)
            .then(function (response) {
                // 获取响应数据 true|false
                if (response.data) {
                    // 重新加载数据
                    $scope.findUserInfo();
                } else {
                    alert("操作失败！");
                }
            });
    };

    // $scope.user = {username: '', item.cityId: '', job: ''};
    // $scope.item.address = {provinceId: '', cityId:'', areaId: ''};
    // $scope.item.address = {};
    // 查询所有的省份

    $scope.findProvince = function () {
        baseService.sendGet("/provinces/findAll").then(function(response){
            $scope.provinceList = response.data;
        });
    };


    // 监控省的改变
    $scope.$watch("item.provinceId", function (newVal, oldVal) {
        if (newVal){ // 不是undefined、null
            baseService.sendGet("/provinces/findCity",
                "provinceId=" + newVal).then(function(response){
                $scope.cityList = response.data;
            });
        }else{
            $scope.cityList = [];
        }
    });

    // 监控市的改变
    $scope.$watch("item.cityId", function (newVal, oldVal) {
        if (newVal){ // 不是undefined、null
            baseService.sendGet("/provinces/findArea",
                "cityId=" + newVal).then(function(response){
                $scope.townList = response.data;
            });
        }else{
            $scope.townList = [];
        }
    });

    //图片上传
    $scope.upload = function () {
        baseService.uploadFile().then(function (response) {
            /** 如果上传成功，取出url */
            if (response.data.status == 200) {
                /** 设置图片访问地址 */
                $scope.user.headPic = response.data.url;
            } else {
                alert("上传失败！");
            }
        });
    };



   /* 地址管理*/
    // 获取当前登录用户的收件地址
    $scope.findAddressByUser = function () {
        baseService.sendGet("/address/findAddressByUser").then(function (response) {
            // 获取响应数据
            $scope.addressList = response.data;

            // 获取默认收件地址
            $scope.address = $scope.addressList[0];
        });
    };
// 保存或更新地址
    $scope.saveOrUpdateAddress = function () {
        var url = "save";
        if ($scope.item.id) {
            url = "update";
        }
        baseService.sendPost("/address/" + url, $scope.item)
            .then(function (response) {
                if (response.data) {
                    alert("操作成功!");
                    $scope.findAddressByUser();
                } else {
                    alert("操作失败!");
                }
            });
    };
    // 删除
    $scope.addressDelete = function ($event, id) {
        baseService.deleteById("/address/delete", id)
            .then(function (response) {
                // 获取响应数据 true| false
                if (response.data) {
                    // 重新加载数据
                    $scope.findAddressByUser();
                } else {
                    alert("删除失败！");
                }
            });
    };
    // 回显
    $scope.showAddress = function (item) {
        // 把json对象转化成json字符串
        var jsonStr = JSON.stringify(item);
        // 把json字符串解析成新的json对象
        $scope.item = JSON.parse(jsonStr);
    };
    // 设置默认地址
    $scope.setDefault = function ($event, id) {
        baseService.sendPost("/address/setDefault", id)
            .then(function (response) {
                if (response.data) {
                    $scope.findAddressByUser();
                } else {
                    alert("操作失败！");
                }
            })
    };
});