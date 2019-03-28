/** 定义控制器层 */
app.controller('userController', function($scope, $timeout, baseService){
//判断短信验证码并进入修改手机号页面
    $scope.next=function () {
            if ($scope.smsCode == undefined){
                alert("请输入短信验证码!")
            }
        baseService.sendPost("/user/next?smsCode="+$scope.smsCode,$scope.user).then(function (response) {
            if (response.data) {
                alert("判断成功,你可以修改手机号码!");
                location.href = "http://user.pinyougou.com/home-setting-address-phone.html"
            } else {
                alert("验证失败!")
            }
        })
    };
        $scope.user={};
    //查询当前手机号
    $scope.phoneNum=function () {
        baseService.sendGet("/user/phone").then(function (response) {
            $scope.phone = response.data.phone;
            var  phoneNumPre = $scope.phone.substring(0,3);
            var  phoneNumSuf = $scope.phone.substring(7);
            var midle = "****";
            $scope.phoneNumber=phoneNumPre+midle+phoneNumSuf;
            $scope.user=  response.data;
        })
};
    //更改手机号,验证码判断和发送短信验证码
    $scope.newuser={};
    $scope.selectNewCode =function () {
        if($scope.code ==undefined){
            alert("请输入验证码!")
        }else {
            baseService.sendGet("/user/code?code="+$scope.code).then(function (response) {
                if (response.data){
                    // 发送短信
                    $scope.sm=function () {
                        baseService.sendGet("/user/sms?phone="+$scope.newuser.phone).then(function (response) {
                            alert(response.data?"发送成功!":"发送失败!");
                        });
                    };
                }else {
                    alert("验证码错误!")
                }

            })}
    };


    //更改 判断短信验证码并进入修改成功页面
    $scope.nextNew=function () {
        if ($scope.smsCode == undefined){
            alert("请输入短信验证码!")
        }
        baseService.sendPost("/user/nextNew?smsCode="+$scope.smsCode,$scope.newuser).then(function (response) {
            if (response.data) {
                alert("你已成功修改手机号码!");
                location.href = "http://user.pinyougou.com/home-setting-address-complete.html"
            } else {
                alert("验证失败!")
            }
        })
    };


    // 判断验证码

    $scope.selectCode =function () {
        if($scope.code ==undefined){
            alert("请输入验证码!")
        }else {
        baseService.sendGet("/user/code?code="+$scope.code).then(function (response) {
     if (response.data){
         // 发送短信
         $scope.sms=function () {
             baseService.sendGet("/user/sms?phone="+$scope.phone).then(function (response) {
                 alert(response.data?"发送成功!":"发送失败!");
             });
         };
     }else {
         alert("验证码错误!")
     }

        })}
    };


    //定义json对象
    $scope.safe={}
    //判断密码
    $scope.updatePassword = function () {
        if ($scope.password != $scope.safe.password) {
            alert("两次密码不相同!");
            return true;
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




    //判断是否为当前登录用户名
    $scope.ifUsername= function () {
        if ($scope.loginName != $scope.safe.username) {
            alert("请输入当前登录用户名!")
        }
    };



    // 定义json对象
    $scope.user = {};

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