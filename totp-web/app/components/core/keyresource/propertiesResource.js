angular.module('core.properties', ['ngResource']).factory('Properties', ['$resource',function ($resource) {
    return $resource('components/resources/properties.json')
}]);
