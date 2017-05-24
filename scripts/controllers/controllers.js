'use strict';

var app =  angular.module('MyApp', ['ngRoute','ngCookies'])
.config(function($routeProvider) {

    $routeProvider
       /* .when('/', {
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
        .when('/usuarios', {
            templateUrl : 'views/usuarios.html',
            controller  : 'userController'
        })
        .when('/esta_open', {
            templateUrl : 'views/Estacionamientos_Open.html',
            controller  : 'EstacionamientoOpenController'
        });



        
    });


/*---------------------CONTROLADOR LOGIN-------------------------*/

app.controller('LoginController', ['$scope','$location','$http','$cookies',function($scope,$location,$http,$cookies){
   
    var EndPoint = "https://pluma-api.herokuapp.com/api/users?desc";
    var newArrayEmail= [];
    var newArrayPass = []; 

    $scope.Login = function(){
        var i;
         $http.get(EndPoint).then(function(resp){
            var tamArray = resp.data.length;
            console.log(resp.data);
            for (i = 0; i < tamArray; i++) {
                newArrayEmail.push(resp.data[i].email);
                newArrayPass.push(resp.data[i].password);
                 if (emailInput.value == newArrayEmail[i] && passInput.value  == newArrayPass[i]) {
                  $location.path('/main');
                  document.getElementById('barraNavegacion').style.display = 'block';
                } 

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
        var EndPoint ="https://pluma-api.herokuapp.com/api/users?count=3";
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

    $scope.Mostrar = function(){
        document.getElementById('oculto').style.display = 'block';
    };



    $scope.actualizar = function (id){
      //  document.getElementById('oculto').style.display = 'block'; 
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

});

app.controller('parkingController', function($scope, $http){

    var EndPoint = "https://pluma-api.herokuapp.com/api/parkings?order=id";

    $http.get(EndPoint).then(function(resp){

        var tamArray = resp.data.length;
        //console.log(tamArray);
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

app.controller('userController', function($scope, $http){

    var EndPoint = "https://pluma-api.herokuapp.com/api/users?order=id";

    $http.get(EndPoint).then(function(resp){

        var tamArray = resp.data.length;
        //console.log(tamArray);
        var newArrayData = [];
        var newArrayNames = []; 
        var newArrayColors = [];
        var numRandom = Math.floor((Math.random() * 300) + 1);

        for (var i = 0; i < tamArray; i++) {
            newArrayData.push(resp.data[i].createdAt);
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

app.controller('EstacionamientoOpenController', function($scope, $http){

    var EndPoint = "https://pluma-api.herokuapp.com/api/parkings?order=id";
    $http.get(EndPoint).then(function(resp){
        var dato = resp.data;
        $scope.datos = resp.data;
        //var tamArray = resp.data.length;
       // var newArrarDatos = [];
        $scope.claseBtn='verde';
        $scope.claseFn = (b)=>{return (b)?'verde':'rojo';}
        

        $scope.actualizar = function(b,id){
            var url = "https://pluma-api.herokuapp.com/api/parkings/" + id
            var datos = {"open":!b }; 
            $http.put(url,datos).then(()=>{
            });
        };
        

        /*for (var i = 0; i < tamArray; i++) {
            console.log(resp.data[i].open);
        }*/

    });

});




 
        