var mp4Services = angular.module('mp4Services', []);

// http://weblogs.asp.net/dwahlin/using-an-angularjs-factory-to-interact-with-a-restful-service

mp4Services.factory('Database', ['$http', '$window', function($http, $window) {
	var database = {};

	function baseURL() {
		return $window.sessionStorage.baseurl;
	}
	
	database.getUsers = function() {
		return $http.get(baseURL() + "users");
	}

	database.getUser = function(id) {
		return $http.get(baseURL() + "users/" + id);
	}

	/*

	database.addUser = function(name, email) {
		return $http.post(baseURL() + "users", {name: name, email: email});
	}

	database.editUser = function(id, name, email) {
		return $http.put(baseURL() + "users/" + id, {name: name, email: email});
	}

	*/

	database.addUser = function(data) {
		return $http.post(baseURL() + "users", data);
	}

	database.updateUser = function(id, data) {
		return $http.put(baseURL() + "users/" + id, data);
	}

	database.deleteUser = function(id) {
		return $http.delete(baseURL() + "users/" + id);
	}

	database.getTasks = function() {
		return $http.get(baseURL() + "tasks");
	}

	database.getTask = function(id) {
		return $http.get(baseURL() + "tasks/" + id);
	}

	/*

	database.addTask = function(name, deadline, assignedUserName, assignedUser, completed, description) {
		return $http.post(baseURL() + "users", {name: name, deadline: deadline, assignedUserName : assignedUserName,
			assignedUser : assignedUser, completed: completed, description: description});
	}

	database.editTask = function(id, name, deadline, assignedUserName, assignedUser, completed, description) {
		return $http.put(baseURL() + "users/" + id, {name: name, deadline: deadline, assignedUserName : assignedUserName,
			assignedUser : assignedUser, completed: completed, description: description});
	}

	*/

	database.addTask = function(data) {
		return $http.post(baseURL() + "tasks", data);
	}

	database.updateTask = function(id, data) {
		return $http.put(baseURL() + "tasks/" + id, data);
	}

	database.deleteTask = function(id) {
		return $http.delete(baseURL() + "tasks/" + id);
	}

	return database;
}]);