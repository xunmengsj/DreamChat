angular.module('dreamChatApp').directive('selfHeight', function () {
    function _resizeElement(tElement, hrSelfHeight) {
        if (typeof hrSelfHeight === "number") {
            tElement.height(hrSelfHeight);
        } else {
            tElement.height(eval(hrSelfHeight));
        }
    }

    return {
        priority: 1000,
        compile: function (tElement, tAttrs, transclude) {
            var selfHeight = tAttrs["selfHeight"];
            if (tAttrs["on"] === undefined) {
                $(window).resize(function () {
                    _resizeElement(tElement, selfHeight);
                });
                _resizeElement(tElement, selfHeight);
            }
            return function (scope, element, attrs) {
                if (tAttrs["on"]) {
                    var height = 0;
                    $(window).resize(function () {
                        height = scope.$eval(tAttrs["height"]);
                        _resizeElement(tElement, height);
                    });
                    scope.$watch(tAttrs["on"], function (newValue, oldValue) {
                        setTimeout(function () {
                            height = scope.$eval(tAttrs["height"]);
                            _resizeElement(tElement, height);
                        }, 100);
                    }, true);
                }
            };
        }
    };
});