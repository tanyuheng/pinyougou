/** 定义控制器层 */
app.controller('userController', function ($scope, $timeout, $controller, baseService) {

    $controller('baseController', {$scope: $scope});
    // 定义json对象
    $scope.user = {}

    // 用户注册
    $scope.save = function () {

        // 判断密码是否一致
        if ($scope.okPassword && $scope.user.password == $scope.okPassword) {
            // 发送异步请求
            baseService.sendPost("/user/save?code=" + $scope.code,
                $scope.user).then(function (response) {
                // 获取响应数据
                if (response.data) {
                    // 跳转到登录页面
                    // 清空表单数据
                    $scope.user = {};
                    $scope.okPassword = "";
                    $scope.code = "";
                } else {
                    alert("注册失败！");
                }
            });
        } else {
            alert("两次密码不一致！");
        }
    };


    // 定义显示文本
    $scope.tipMsg = "获取短信验证码";
    $scope.flag = false;

    // 发送短信验证码
    $scope.sendSmsCode = function () {

        // 判断手机号码的有效性
        if ($scope.user.phone && /^1[3|4|5|7|8|9]\d{9}$/.test($scope.user.phone)) {
            // 发送异步请求
            baseService.sendGet("/user/sendSmsCode?phone="
                + $scope.user.phone).then(function (response) {
                // 获取响应数据
                if (response.data) {
                    // 倒计时 (扩展)
                    $scope.flag = true;
                    // 调用倒计时方法
                    $scope.downcount(90);
                } else {
                    alert("获取短信验证码失败！");
                }
            });
        } else {
            alert("手机号码不正确！");
        }
    };


    // 倒计时方法
    $scope.downcount = function (seconds) {
        if (seconds > 0) {
            seconds--;
            $scope.tipMsg = seconds + "秒，后重新获取";

            // 开启定时器
            $timeout(function () {
                $scope.downcount(seconds);
            }, 1000);
        } else {
            $scope.tipMsg = "获取短信验证码";
            $scope.flag = false;
        }
    };


    /** 查询条件对象 */
    // $scope.searchEntity = {status : '0'};
    /** 分页查询(查询条件) */
    $scope.findUserInfo = function () {
        baseService.sendGet("/user/findUserInfo").then(function (response) {
            // 获取响应数据
            $scope.dataList = response.data;

            $scope.user = $scope.dataList[0];
            $scope.headPic =  $scope.dataList[0].headPic;
        });
    };


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

    $scope.selectStatus = function (event) {
        $scope.entity.sex = event.target.checked ? 1 : 2;
    };

    $scope.findProvince = function () {
        baseService.sendGet("/provinces/findAll").then(function (response) {
            // 获取响应数据 [{},{}]
            $scope.provinceList = response.data;
        });
    };
    $scope.findCitie = function () {
        baseService.sendGet("/cities/findAll").then(function (response) {
            // 获取响应数据 [{},{}]
            $scope.citieList = response.data;
        });
    };
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
});