app.directive('powerDatePicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            ngModel: "=",
            dateConfig: "@",//支持my97的参数属性
            onpickedCall: "&",//选择之后回调
            onclearedCall: "&"//清除之后回调
        },
        controller: ['$scope', '$http', '$timeout', '$window', '$location', '$filter', function ($scope, $http, $timeout, $window, $location, $filter) {
            //时间格式化过滤
            $scope.$watch("ngModel", function (newValue, oldValue) {
                $scope.ngModel = $filter('date')(newValue, $scope.dateFmt);
            });
        }],
        link: function (scope, element, attr, ngModel) {
            scope.dateFmt = (attr.datefmt || 'yyyy-MM-dd');
            element.val(ngModel.$viewValue);

            function onpicking(dp) {
                var date = dp.cal.getNewDateStr();
                ngModel.$setViewValue(date);
                if (typeof scope.onpickedCall == 'function') {
                    scope.onpickedCall();
                }
            }

            function oncleared() {
                ngModel.$setViewValue("");
                if (typeof scope.oncleared == 'function') {
                    scope.oncleared();
                }
            }

            element.bind('click', function () {
                init97Date();
            });

            function init97Date() {
                try {
                    //my97 基本数据配置
                    var wdateConfig = {
                        onpicking: onpicking,
                        oncleared: oncleared,
                        dateFmt: scope.dateFmt
                    };
                    var config = "{" + scope.dateConfig + "}";
                    var configObj = (new Function("return " + config))();
                    if (configObj['onpicking']) {
                        delete configObj['onpicking'];
                    }
                    if (configObj['onpicking']) {
                        delete configObj['oncleared'];
                    }
                    //扩展my97属性
                    wdateConfig = $.extend(wdateConfig, configObj);
                    WdatePicker(wdateConfig)
                } catch (e) {
                    if (console) {
                        console.log(e);
                    }
                }
            }
        }
    };
});