/** 定义控制器层 */
app.controller('settingInfoController', function($scope, $timeout, $controller,$http, baseService) {


    // 定义获取登录用户名的方法
    $scope.loadUsername = function () {

        // 对请求URL进行unicode编码
        $scope.redirectUrl = window.encodeURIComponent(location.href);
        // 获取登录用户名
        $http.get("/user/showName").then(function(response){
            $scope.loginName = response.data.loginName;
        });


        $scope.user = {username: '', address:{}, job:''};
        // 发送异步请求
            baseService.sendGet("/user/finduserInfo").then(function(response){
            // 获取响应数据
            $scope.user = response.data;
            $scope.user.address = JSON.parse(response.data.address);
        });
    };



    $scope.parseJson = function (entity) {
        $scope.user.address = JSON.parse(JSON.stringify(entity));
    }

    // 查询所有的省份
    $scope.findProvince = function () {
        baseService.sendGet("/provinces/findAll").then(function(response){
            $scope.provinceList = response.data;
        });
    };


    // 监控省的改变
    $scope.$watch("user.address.province", function (newVal, oldVal) {
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
    $scope.$watch("user.address.city", function (newVal, oldVal) {
        if (newVal){ // 不是undefined、null
            baseService.sendGet("/provinces/findArea",
                "cityId=" + newVal).then(function(response){
                $scope.areaList = response.data;
            });
        }else{
            $scope.areaList = [];
        }
    });

    //定义职业
    $scope.activities =
        [
            "程序员",
            "产品经理",
            "ui设计师"
        ];

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

    //保存用户的详情数据
    $scope.updateDetail = function () {
        baseService.sendPost("/user/update", $scope.user).then(function (response) {
            if (response.data) {
                alert("保存成功！");
            } else {
                alert("保存失败!");
            }
        });
    };
});