/** 定义控制器层 */
app.controller('userController', function($scope, $timeout, baseService){
//判断短信验证码
    $scope.next=function () {
        baseService.sendPost("/user/next?smsCode="+$scope.smsCode).then(function (response) {
            if(response.data){
                alert("验证成功!")
            }else {
                alert("验证失败!")
            }
        })
    };

    //查询当前手机号
    $scope.phoneNum=function () {
        baseService.sendGet("/user/phone").then(function (response) {
            $scope.phone = response.data.phone;
        })
    };

    // 判断验证码
    $scope.selectCode =function () {
        baseService.sendGet("/user/code?code="+$scope.code).then(function (response) {
           if ( response.data){

           }else {
               alert("验证码不正确!")
           }

        })
    };
    // 发送短信

    $scope.sms=function () {
        baseService.sendGet("/user/sms?phone="+$scope.phone).then(function (response) {
            if (response.data){
                alert("发送成功!")
            }else {
                alert("验证码不正确!")
            }
        })
    };
    
    //定义json对象
    $scope.safe={}
    //判断密码
    $scope.updatePassword = function () {
        if ($scope.password != $scope.safe.password) {
            alert("两次密码不相同!");
            return;
        }
        if ($scope.loginName != $scope.safe.username) {
            alert("请输入当前登录用户名!")
        }
            if ($scope.safe.username && /^[a-zA-Z0-9]{6,15}$/.test($scope.safe.username)) {
                baseService.sendPost("/user/safe" ,$scope.safe).then(function (response) {
                    if (response.data) {
                        $scope.safe = {};
                        $scope.password = "";
                        alert("修改成功,请重新登录!");
                        location.href="logout";

                    } else {
                        alert("注册失败!")
                    }
                })
            } else {
                alert("请输入6-15位字母或数字!")
            }

       };




    // 定义json对象
    $scope.user = {}

    // 用户注册
    $scope.save = function () {

        // 判断密码是否一致
        if ($scope.okPassword && $scope.user.password == $scope.okPassword){
            // 发送异步请求
            baseService.sendPost("/user/save?code=" + $scope.code,
                $scope.user).then(function(response){
                // 获取响应数据
                if (response.data){
                    // 跳转到登录页面
                    // 清空表单数据
                    $scope.user = {};
                    $scope.okPassword = "";
                    $scope.code = "";
                }else{
                    alert("注册失败！");
                }
            });
        }else{
            alert("两次密码不一致！");
        }
    };




    // 定义显示文本
    $scope.tipMsg = "获取短信验证码";
    $scope.flag = false;

    // 发送短信验证码
    $scope.sendSmsCode = function () {

        // 判断手机号码的有效性
        if ($scope.user.phone && /^1[3|4|5|7|8|9]\d{9}$/.test($scope.user.phone)){
            // 发送异步请求
            baseService.sendGet("/user/sendSmsCode?phone="
                + $scope.user.phone).then(function(response){
                    // 获取响应数据
                    if (response.data){
                        // 倒计时 (扩展)
                        $scope.flag = true;
                        // 调用倒计时方法
                        $scope.downcount(90);
                    }else{
                        alert("获取短信验证码失败！");
                    }
            });
        }else{
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
        }else{
            $scope.tipMsg = "获取短信验证码";
            $scope.flag = false;
        }
    };
    // 获取登录用户名
    $scope.showName = function () {
        baseService.sendGet("/user/showName").then(function (response) {
            // 获取响应数据
            $scope.loginName = response.data.loginName;
        });
    };

});