'use strict';

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
        })
        .when('/Estacionamientos', {
            templateUrl : 'views/Estacionamientos.html',
            controller  : 'parkingController'
        })
        .when('/Costos', {
            templateUrl : 'views/Costos.html',
            controller  : ''
        });
    });


/*Bearer*/
/*---------------------CONTROLADOR LOGIN-------------------------*/

app.controller('LoginController', ['$scope','$location','$http','$cookies',function($scope,$location,$http,$cookies){
    var EndPoint = "https://pluma-api.herokuapp.com/api/administrators";
    var datosSesion = { "email": $scope.email, "password": $scope.pass };
    $scope.Login = function(){

        $http.post(EndPoint).then(function(resp){
             alert(resp.data);
            if (resp.data.errorMessage != "Wrong password" && resp.data.errorMessage != "The email doesn't exist") {
                //console.log(resp.data);
                alert("Entre!!>D");
                 $location.path('/main');
            } else {
                alert("soy else");
                console.log(resp.data.errorMessage);
            }
        }); 
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
    $scope.registro = function() {
        var EndPoint = "https://pluma-api.herokuapp.com/api/users";
        var regis = {
            "name": $scope.name,
            "lastName": $scope.lastName,
            "email": $scope.email,
            "credit": $scope.credit,
            "password": $scope.password,
            "active": true
        };

      //  function ocultar() { document.getElementById('oculto').style.display = 'none';
        //document.getElementById('oculto2').style.display = 'none'; }
        //document.getElementById('oculto2').style.display = 'block';
    
        function limpia(){nompreInput.value = '';apellidosInput.value='';emailInput.value='';passInput.value='';creditInput.value='';}

         if (nompreInput.value == '' | apellidosInput.value==''| emailInput.value=='' | passInput.value=='' | creditInput.value=='') {
                alert('llena todo');
            } else {
                alert('entr al eslee');
                $http.post(EndPoint, regis).then(function(resp) {
                    console.log(resp);
                    limpia();
                })
            }
       
    }

});

/*------------------CONTROLADORES USUARIOS--------------------------*/
app.controller('GetUsuarios', function($scope, $http, $routeParams){
  
  var dato;
  function refrescar(){  window.location.reload(); };


    (function() {
        var EndPoint = "https://pluma-api.herokuapp.com/api/users?order=id";
            $http.get(EndPoint).then(function(resp){
                $scope.datos = resp.data;
                dato = resp.data.id;
            });
        }());

    $scope.eliminar = function(id){
        var EndPoint = "https://pluma-api.herokuapp.com/api/users/" + id;

        $http.delete(EndPoint).success(function(resp){
            console.log("eliminado");
            refrescar();
        }).error(function(err){
            console.log("no paso");
        });
      };

    

    $scope.actualizar = function (id){
        document.getElementById('oculto').style.display = 'block'; 
        var EndPoint = "https://pluma-api.herokuapp.com/api/users/"+ id;
        var datos = {
            "id": id,
            "name": $scope.name,
            "lastName": $scope.lastName,
            "email": $scope.email,
            "credit": $scope.credit,
            "password": $scope.password,
            "active": true
        };

        if (nameInput.value == '' && lastnameInput.value == '' 
            && emailInput.value == '' && creditInput.value == '' 
            && passwordInput.value == ''){
            alert("debe llenar todo");
            console.log(id)
        } else {
             $http.put(EndPoint, datos).then(function(resp){
                console.log(resp)
             });
        }
    };

    $scope.editar = function(id){
   
     $scope.dataId = dato; //Almacena el ID que enviamos desde formulario
     var nmbre = dato;
     console.log(nmbre);
     

    if (nameInput.value == '' && lastnameInput.value == '' 
        && emailInput.value == '' && creditInput.value == '' 
        && passwordInput.value == '') {
        alert("debe llenar todo");

    } else {
        $http.put(EndPoint, datos).success(function(resp){
            //nsole.log(resp);
        }).error(function(err){
            alert('buuu');
        });
    }
 };


   /* 
    */



});

app.controller('parkingController', function($scope, $http){

    var EndPoint = "https://pluma-api.herokuapp.com/api/parkings?order=id";

    $http.get(EndPoint).then(function(resp){

        var tamArray = resp.data.length;
        var newArrayData = [];
        var newArrayNames = []; 
        var newArrayColors = [];
        var numRandom = Math.floor((Math.random() * 300) + 1);
        for (var i = 0; i < tamArray; i++) {
            newArrayData.push(resp.data[i].currentlyOccupied);
            newArrayNames.push(resp.data[i].name);
            newArrayColors.push('rgba('+ numRandom +', 99, 132, 0.7)');
        }
        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: newArrayNames,
                datasets: [{
                    label: ["# of Cars"],
                    data: newArrayData,
                    backgroundColor: newArrayColors,
                     borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:false
                        }
                    }]
                }
            }
        });

    });

});

 
        