/** 定义控制器层 */
app.controller('addressController', function ($scope, $timeout, $controller, baseService) {

    $controller('baseController', {$scope: $scope});
    $controller('userController', {$scope: $scope});
    // 定义json对象


    $scope.findUserInfo = function () {
        baseService.sendGet("/user/findUserInfo").then(function (response) {
            // 获取响应数据
            $scope.dataList = response.data;
            $scope.user1 = $scope.dataList[0];
            $scope.headPic = $scope.dataList[0].headPic;
        });
    };

// 保存用户
    $scope.saveOrUpdate = function () {

        baseService.sendPost("/user/update", $scope.entity)
            .then(function (response) {
                // 获取响应数据 true|false
                if (response.data) {
                    // 重新加载数据
                    $scope.reload();
                } else {
                    alert("操作失败！");
                }
            });
    };

    // 修改按钮
    $scope.show = function (entity) {
        // 把json对象转化成json字符串
        var jsonStr = JSON.stringify(entity);
        // 把json字符串解析成新的json对象
        $scope.entity = JSON.parse(jsonStr);
    };

    // 图片上传
    $scope.upload = function () {
        baseService.uploadFile().then(function (response) {
            // 获取响应数据: {status : 200|500, url : ''}
            if (response.data.status == 200) {
                $scope.entity.headPic = response.data.url;
            }
        });
    };
// 性别选择
    $scope.selectStatus = function (event) {
        $scope.entity.sex = event.target.checked ? 1 : 2;
    };

    // 查询省份
    $scope.findProvince = function () {
        baseService.sendGet("/provinces/findAll").then(function (response) {
            // 获取响应数据 [{},{}]
            $scope.provinceList = response.data;
        });
    };
    // 查询市
    $scope.findCitie = function () {
        baseService.sendGet("/cities/findAll").then(function (response) {
            // 获取响应数据 [{},{}]
            $scope.citieList = response.data;
        });
    };
    // 查询区
    $scope.findArea = function () {
        baseService.sendGet("/areas/findAll").then(function (response) {
            // 获取响应数据 [{},{}]
            $scope.areaList = response.data;
        });
    };

    $scope.address = {};

    // 用户选择规格选项
    $scope.selectedAddress = function (addressName, optionName) {
        // 赋值
        $scope.address[addressName] = optionName;

    };
    $scope.isSelected = function (addressName, optionName) {
        // 取值
        return $scope.address[addressName] == optionName;
    };
    // 获取当前登录用户的收件地址
    $scope.findAddressByUser = function () {
        baseService.sendGet("/address/findAddressByUser").then(function (response) {
            // 获取响应数据
            $scope.addressList = response.data;

            // 获取默认收件地址
            $scope.address = $scope.addressList[0];
        });
    };
// 保存或更新
    $scope.saveOrUpdateAddress = function () {
        var url = "save";
        if ($scope.item.id) {
            url = "update";
        }
        baseService.sendPost("/address/" + url, $scope.item)
            .then(function (response) {
                if (response.data) {
                    alert("操作成功!");
                    $scope.reload();
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
                    $scope.reload();
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
    $scope.setDefault = function ($event, id) {
        baseService.sendPost("/address/setDefault", id)
            .then(function (response) {
                if (response.data) {
                    $scope.reload();
                } else {
                    alert("操作失败！");
                }
            })
    };

    /*查询所有省份*/
    $scope.findAllProvince=function () {
        baseService.sendGet("/user/findProvinces").then(function (response) {


            $scope.provincesList=response.data;
        });
    };
    $scope.user.address={};
    $scope.user.job='';
    $scope.user.headPic='';


    $scope.$watch('user.address.provinceId', function(newValue, oldValue){
        if (newValue){
            $scope.findCity(newValue);
        }else{
            $scope.citiesList = [];
        }});


    $scope.$watch('user.address.cityId', function(newValue, oldValue){
        if (newValue){
            $scope.findArea(newValue);
        }else{
            $scope.areaList = [];
        }});




    $scope.findCity=function (provinceId) {
        baseService.sendGet("/user/findCity?provinceId="+provinceId)
            .then(function (response) {
                $scope.citiesList=response.data;
            });
    };


    $scope.findArea=function (cityId) {
        baseService.sendGet("/user/findArea?cityId="+cityId)
            .then(function (response) {
                $scope.areaList=response.data;
            });
    };


    $scope.setUser = {};
});