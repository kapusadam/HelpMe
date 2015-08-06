var myApp = angular.module('myApp', ['ngSanitize', 'ui.bootstrap']);

myApp.config(function($provide) {
    $provide.provider('greeting', function() {
        this.$get = function() {
            return function(name) {
                alert("Hello, " + name);
            };
        };
    });
    $provide.factory('greeting2', function() {
        return function(name) {
            alert("Hello, " + name);
        };
    });
});

myApp.controller('GreetingController', ['$scope', '$modal', '$timeout', function ($scope,  $modal, $timeout) {
    $scope.greeting1 = 'Hello';
    $scope.greeting2 = 'World!';
    $scope.myHTML =
        'I am an <code>HTML</code>string with ' +
        '<a href="#">links!</a> and other <em>stuff</em>';
    //lodashPractice();
    //injectorPractice($scope);
    //memoPractice();
    //watchPractice($scope, $timeout);

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function (size) {
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'cm_modal.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };


}]);

myApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {
    $scope.items = items;
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.ok = function () {
        $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

myApp.directive("myDir", function ($compile, greeting) {
    return {
        restrict: "E",
        scope: {},
        link: function (scope, element, attrs) {
            scope.label = attrs.title;
            var template = "<button ng-click='doSomething()'>{{label}}</button>";
            var linkFn = $compile(template);
            var content = linkFn(scope);
            element.append(content);
        },
        controller:function($scope) {
            $scope.doSomething = function() {
                greeting("Hello World")
            }
        }
    }
});

myApp.directive("cmCarousel", function() {
    return {
        restrict: "E",
        templateUrl:"cm_carousel.html",
        scope: {},
        controller: function($scope) {
            $scope.myInterval = 5000;
            $scope.noWrapSlides = false;
            var slides = $scope.slides = [];
            $scope.addSlide = function() {
                var newWidth = 600 + slides.length + 1;
                slides.push({
                    image: '//placekitten.com/' + newWidth + '/300',
                    text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
                    ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
                });
            };
            for (var i=0; i<4; i++) {
                $scope.addSlide();
            }
        }
    };
});

myApp.directive("cmRating", function(){
    return {
        restrict: "E",
        templateUrl:"rating.html",
        replace:true,
        scope: {},
        controller: function($scope) {
            $scope.rate = 7;
            $scope.max = 10;
            $scope.isReadonly = false;

            $scope.hoveringOver = function(value) {
                $scope.overStar = value;
                $scope.percent = 100 * (value / $scope.max);
            };

            $scope.ratingStates = [
                {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
                {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
                {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
                {stateOn: 'glyphicon-heart'},
                {stateOff: 'glyphicon-off'}
            ];
        }
    }
})

myApp.directive("cmProgressBar", function() {
    return {
        restrict: "E",
        templateUrl:"cm_progressBar.html",

        scope: {},
        controller: function($scope) {
            $scope.max = 200;

            $scope.random = function() {
                var value = Math.floor((Math.random() * 100) + 1);
                var type;

                if (value < 25) {
                    type = 'success';
                } else if (value < 50) {
                    type = 'info';
                } else if (value < 75) {
                    type = 'warning';
                } else {
                    type = 'danger';
                }

                $scope.showWarning = (type === 'danger' || type === 'warning');

                $scope.dynamic = value;
                $scope.type = type;
            };
            $scope.random();

            $scope.randomStacked = function() {
                $scope.stacked = [];
                var types = ['success', 'info', 'warning', 'danger'];

                for (var i = 0, n = Math.floor((Math.random() * 4) + 1); i < n; i++) {
                    var index = Math.floor((Math.random() * 4));
                    $scope.stacked.push({
                        value: Math.floor((Math.random() * 30) + 1),
                        type: types[index]
                    });
                }
            };
            $scope.randomStacked();
        }
    }
})

function injectorPractice($scope) {
    var myInjector = angular.injector(["ng"]);
    var $q = myInjector.get('$q');
    var promise2 = myInjector.invoke(doSomething2, $scope);

    $q.all([myInjector.invoke(doSomething, $scope, {a: 1}), promise2]).then(function (promises) {
        console.log(promises[0].glossary.extra);
        console.log(promises[1].glossary.extra)
    });
}

function doSomething($http, $q, a) {
    var def = $q.defer();
    if ($http) {
        $http.get('data/data.json').
            success(function (data, status, headers, config) {
                data.glossary.extra = a;
                def.resolve(data);
            }).
            error(function (data, status, headers, config) {
                def.reject("hiba1")
            });
    } else {
        def.reject("hiba2");
    }
    return def.promise;
}

function doSomething2($http, $q) {
    var def = $q.defer();
    if ($http) {
        $http.get('data/data.json').
            success(function (data, status, headers, config) {
                def.resolve(data);
            }).
            error(function (data, status, headers, config) {
                def.reject("hiba1")
            });
    } else {
        def.reject("hiba2");
    }
    return def.promise;
}

function lodashPractice() {
    write(_.assign({'a': 1}, {'a': 2}, {'c': 3}));
    write(_.map([1, 2, 3], function (n) {
        return n * 3;
    }));
    write(_.chunk(['a', 'b', 'c', 'd'], 2));

    var users = [
        {'user': 'barney', 'age': 36},
        {'user': 'fred', 'age': 40},
        {'user': 'pebbles', 'age': 1}
    ];

    var youngest = _.chain(users)
        .sortBy('age')
        .map(function (chr) {
            return chr.user + ' is ' + chr.age;
        })
        .first()
        .value();
    write(youngest);

}

function memoPractice() {
//    var getNames = memoize(function() {
//            return $filter('orderBy')(
//                $scope.names,
//                $scope.orderBy, $scope.reverseList
//            );
//        },
//        function() {
//// Resolver function returns a string that
//// represents the cache key
//            return $scope.orderBy + '-' + $scope.reverseList;
//        });



    var upperCase = _.memoize(function(string) {
        return string.toUpperCase();
    });

    write(upperCase('fred'));
// ? 'FRED'

// modifying the result cache
    upperCase.cache.set('fred', 'BARNEY');
    write(upperCase('fred'));
// ? 'BARNEY'

// replacing `_.memoize.Cache`
    var object = { 'user': 'fred' };
    var other = { 'user': 'barney' };
    var identity = _.memoize(_.identity);

    write(identity(object));
// ? { 'user': 'fred' }
    write(identity(other));
// ? { 'user': 'fred' }

    _.memoize.Cache = WeakMap;
    identity = _.memoize(_.identity);

    write(identity(object));
// ? { 'user': 'fred' }
    write(identity(other));
// ? { 'user': 'barney' }

}

function write(str) {
    console.log(str);
}

function watchPractice($scope, $timeout) {
    $timeout(function(){
        $scope.someValue = 'a';
        $scope.counter = 0;
        $scope.$watch(
            function(scope) {
                return scope.someValue;
            },
            function(newValue, oldValue, scope) {
                scope.counter++;
            }
        );
        console.log($scope.counter);//0
        $scope.$digest();
        console.log($scope.counter);//1
        $scope.$digest();
        console.log($scope.counter);//1
        $scope.someValue = 'b';
        console.log($scope.counter);//1
        $scope.$digest();
        console.log($scope.counter);//2
    })
}
