var app =  angular.module('MyApp', ['ngRoute','ngCookies'])
.config(function($routeProvider) {

    $routeProvider
       /*.when('/', {
            templateUrl : 'views/login.html',
            controller  : 'LoginController'
        })*/
        .when('/', {
            templateUrl : 'views/main.html',
            controller  : 'mainController'
        })
        .when('/registro', {
            templateUrl : 'views/registro.html',
            controller  : 'registroController'
        })
        
         .when('/listado', {
            templateUrl : 'views/listado.html',
            controller  : 'GetUsuarios'
        });
    });


/*Bearer*/
/*---------------------CONTROLADOR LOGIN-------------------------*/

app.controller('LoginController', ['$scope','$location','$http','$cookieStore',function($scope,$location,$http,$cookies,$cookieStore){
   $scope.Login = function(valor){  
 };
}]);

/*------------------CONTROLADORES MAIN--------------------------*/
app.controller('mainController', function($scope,$http) {
   //Funcion anonima: entradas
    (function() {
        var EndPoint ="https://pluma-api.herokuapp.com/api/entries";
        $http.get(EndPoint).then(function(resp){

            //TRAE TODOS LOS VALORES
            var respo = resp.data;
            $scope.registrados =  respo; 
            //console.log(respo);

            //CALCULA TODOS LA CANTIDAD DE VALORES ALMACENADOS
            var cantidadActuallog =  respo.length;
            $scope.cantidadActual = cantidadActuallog;
            //console.log(cantidadActuallog);

            //CALCULA LA CANTIDAD RESTANTE DEL TOTAL
            var cantDispoLog =  100 - cantidadActuallog;
            $scope.cantDispo = cantDispoLog;
            //console.log(cantDispoLog);
        
        });
    }());

    (function() {
        var EndPoint ="https://pluma-api.herokuapp.com/api/users";
        $http.get(EndPoint).then(function(resp){
             var total = resp.data;
             $scope.datas = total;
             $scope.Total_usuarios = total.length;

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

      //  function ocultar() { document.getElementById('oculto').style.display = 'none';
        //document.getElementById('oculto2').style.display = 'none'; }
    
    
       // function locaL(){ $location.path('/');}
      
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

});

/*------------------CONTROLADORES USUARIOS--------------------------*/
app.controller('GetUsuarios', function($scope, $http, $routeParams){
  
  (function() {
    var EndPoint = "https://pluma-api.herokuapp.com/api/users/";
        $http.get(EndPoint).then(function(resp){
            $scope.datos = resp.data;
        });
    }());

  $scope.eliminar = function(id){
    var EndPoint = "https://pluma-api.herokuapp.com/api/users/" + id;
    function refrescar(){
    window.location.reload();
    };
    $http.delete(EndPoint).success(function(resp){
        console.log("eliminado");
        refrescar();
    }).error(function(err){
        console.log("no paso");
    });
  };

  //Editar Registros 
  
});

 
    