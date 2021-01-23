/**
 * Created by emrahsoytekin on 24.10.2017.
 */
angular.module('core.authentication', ['ngResource']).factory('Authentication', ['$resource', '$httpParamSerializerJQLike', function ($resource, $httpParamSerializerJQLike) {
    // return $resource('components/resources/keys.json')

    return $resource(`${baseUrl}/login`,
        {},
        {
            create: {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                },
                transformRequest: transformUrlEncoded,
                withCredentials: true
            }
        }
    );

    function transformUrlEncoded(data) {
        return $httpParamSerializerJQLike(data);
    }
}]);
