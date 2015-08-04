var myApp = angular.module('myApp', ['ngSanitize']);

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

myApp.controller('GreetingController', ['$scope', function ($scope) {
    $scope.greeting1 = 'Hello';
    $scope.greeting2 = 'World!';
    $scope.myHTML =
        'I am an <code>HTML</code>string with ' +
        '<a href="#">links!</a> and other <em>stuff</em>';
    lodashPractice();
    //injectorPractice($scope);

}]);

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
function write(str) {
    console.log(str);
}

