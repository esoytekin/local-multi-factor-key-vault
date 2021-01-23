angular.module('core.user', ['ngResource']).factory('User', ['$resource', '$httpParamSerializerJQLike', function ($resource, $httpParamSerializerJQLike) {
    // return $resource('components/resources/keys.json')

    return {
        restricted: function (token) {
            return $resource(`${baseUrl}/user/:id`,
                {
                    id: '@id'
                },
                {
                    query: {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Basic ' + token
                        },
                        isArray: false,
                        credentials: true,
                        withCredentials: true
                    }
                }
            );
        }
    };

    function transformUrlEncoded(data) {
        return $httpParamSerializerJQLike(data);
    }
}]);

