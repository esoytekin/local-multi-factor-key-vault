angular.module('core.keys', ['ngResource']).factory('Keys', ['$resource', '$httpParamSerializerJQLike','Properties', function ($resource, $httpParamSerializerJQLike, Properties) {

    return {
        restricted: function (token) {
            return $resource(`${baseUrl}/totp/:id`,
                {
                    id: '@id'
                },
                {
                    create: {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Authorization' : 'Basic ' + token
                        },
                        withCredentials: true,
                        transformRequest: transformUrlEncoded
                    },
                    query: {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Basic ' + token
                        },
                        isArray: true,
                        credentials: true,
                        withCredentials: true
                    },
                    delete: {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Authorization' : 'Basic ' + token
                        },
                        credentials: true,
                        withCredentials: true
                    },
                    put: {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Authorization' : 'Basic ' + token
                        },
                        credentials: true,
                        withCredentials: true,
                        isArray: true
                    }
                }
            );
        }
    };

    function transformUrlEncoded(data) {
        return $httpParamSerializerJQLike(data);
    }
}]);

