var app =  angular.module('MyApp', ['ngRoute'])
app.config(function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl : 'views/login.html',
            controller  : 'LoginController'
        })
        .when('/Inicio', {
            templateUrl : 'views/main.html',
            controller  : 'mainController'
        })
        .when('/registro', {
            templateUrl : 'views/registro.html',
            controller  : 'registroController'
        })
        
         .when('/listado', {
            templateUrl : 'views/listado.html',
            controller  : 'GetEstaciomanentos'
        })
});


/*Bearer*/
/*---------------------CONTROLADOR LOGIN-------------------------*/

app.controller('LoginController', function($scope,$location,$http){
    $scope.Login = function(){
     var EndPoint = "https://pluma-api.herokuapp.com/api/administrators";
     var datos = {
        "email": $scope.email,
        "password": $scope.Contraseña
     };

    function refrescar(){window.location.reload(); };

     $http.post(EndPoint, datos).success(function(resp){
        console.log("paso");
        $location.path('/Inicio');
        document.getElementById('barraNavegacion').style.display = 'block';
     }).error(function(error){
        console.log("No paso");
        refrescar();
     });
 };
});

/*------------------CONTROLADORES MAIN--------------------------*/
app.controller('mainController', function($scope,$http) {
   //Funcion anonima: entradas
    (function() {
        var EndPoint ="https://pluma-api.herokuapp.com/api/entries";
        $http.get(EndPoint).then(function(resp){

            //TRAE TODOS LOS VALORES
            var respo = $scope.registrados = resp.data;  
            //console.log(respo);

            //CALCULA TODOS LA CANTIDAD DE VALORES ALMACENADOS
            var cantidadActuallog = $scope.cantidadActual = respo.length;
            console.log(cantidadActuallog);

            //CALCULA LA CANTIDAD RESTANTE DEL TOTAL
            var cantDispoLog = $scope.cantDispo = 100 - cantidadActuallog;
            console.log(cantDispoLog);
        });
    }());

});

/*------------------CONTROLADORES DE REGISTRO--------------------------*/

app.controller('registroController', function($scope, $http, $location) {
    var EndPoint = "https://pluma-api.herokuapp.com/api/users";
    $scope.registro = function() {
        //var EndPoint = "https://pluma-api.herokuapp.com/api/users";
        var regis = {
            "name": $scope.name,
            "lastName": $scope.lastName,
            "email": $scope.email,
            "credit": $scope.credit,
            "password": $scope.password,
            "active": true
        };
        var pase, pase2;

        function ocultar() { document.getElementById('oculto').style.display = 'none';
        document.getElementById('oculto2').style.display = 'none'; }
        
        function locaL(){ $location.path('/');}
      
        $http.post(EndPoint, regis).success(function(resp) {
            console.log(regis);
            document.getElementById('oculto2').style.display = 'block';
            setInterval(ocultar,3000);
            setInterval($location.path('/'),5000);

        }).error(function(error){
            console.log("No funciono");
            document.getElementById('oculto').style.display = 'block';
            setInterval(ocultar,3000);
        });
    };

    $scope.eliminar = function() {
        var datos = {
            "id": id
        };
        $http.delete(EndPoint, datos).success(function(resp){
            console.log(resp);
        }).error(function(error){
            console.log(error);
        });
    };

});

/*------------------CONTROLADORES USUARIOS--------------------------*/
app.controller('GetEstaciomanentos', function($scope, $http, $routeParams){
  var EndPoint = "https://pluma-api.herokuapp.com/api/users";
  (function() {
        $http.get(EndPoint).then(function(resp){
            $scope.datos = resp.data;
        });
    }());

  //Editar Registros 
  
});

 
    