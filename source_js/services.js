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

	database.deleteUser = function(user) {
		var pendingTasks = user.pendingTasks;
		for(var i = 0; i < pendingTasks.length; i++) {
			database.getTask(pendingTasks[i]).success(function(data) {
				var task;
				task = data.data;
				task.assignedUser = '';
				task.assignedUserName = 'unassigned';
				database.updateTask(task);
			});
		}
		return $http.delete(baseURL() + "users/" + user._id);
	}

	database.getTasks = function() {
		return $http.get(baseURL() + "tasks");
	}

	database.getTasksByUser = function(user) {
		var params = {
			where : '{"assignedUserName" : "' + user.name + '"}'
		};
		return $http.get(baseURL() + "tasks", {params : params});
	}

	database.getPendingTasksByUser = function(user) {
		var params = {
			where : '{"assignedUserName" : "' + user.name + '", "completed" : false}'
		};
		return $http.get(baseURL() + "tasks", {params : params});
	}

	database.getCompletedTasksByUser = function(user) {
		var params = {
			where : '{"assignedUserName" : "' + user.name + '", "completed" : true}'
		};
		return $http.get(baseURL() + "tasks", {params : params});
	}

	database.getTasksSpecific = function(pending, sortBy, sortOrder) {
		if(pending === '') {
			var params = {
				sort : '{"' + sortBy + '" : ' + sortOrder + '}'
			};
			return $http.get(baseURL() + "tasks", {params : params});
		}
		else {
			var params = {
				where : '{"completed" : ' + pending + '}',
				sort : '{"' + sortBy + '" : ' + sortOrder + '}'
			};
			return $http.get(baseURL() + "tasks", {params : params});
		}
	}

	database.getTask = function(id) {
		return $http.get(baseURL() + "tasks/" + id);
	}

	database.addTask = function(task) {

		return $http.post(baseURL() + "tasks", task).success(function(data) {
			var newTask = data.data;
			if(newTask.assignedUser) {
				var user;
				database.getUser(newTask.assignedUser).success(function(data) {
					user = data.data;
					if(user.name) {
						user.pendingTasks.push(newTask._id);
						database.updateUser(user._id, user);
					}
				});
			}
		});

	}

	database.updateTask = function(task) {

		return $http.put(baseURL() + "tasks/" + task._id, task).success(function(data) {
			if(task.assignedUser) {
				if(task.completed) {
					var user;
					database.getUser(task.assignedUser).success(function(data) {
						user = data.data;
						if(user.name) {
							var taskIndex = user.pendingTasks ? user.pendingTasks.indexOf(task._id) : -1;
							if(taskIndex >= 0) {
								user.pendingTasks.splice(taskIndex, 1);
								database.updateUser(user._id, user);
							}
						}
					});
				}
				else {
					var user;
					database.getUser(task.assignedUser).success(function(data) {
						user = data.data;
						if(user.name) {
							var taskIndex = user.pendingTasks ? user.pendingTasks.indexOf(task._id) : -1;
							if(taskIndex < 0) {
								user.pendingTasks.push(task._id);
								database.updateUser(user._id, user);
							}
						}
					});
				}
			}
		});

	}

	database.updateTaskAndUser = function(task, oldUser, newUser) {
		if(oldUser === newUser) return database.updateTask(task);
		database.getUser(oldUser).success(function(data) {
			var user;
			user = data.data;
			if(user.name) {
				var taskIndex = user.pendingTasks ? user.pendingTasks.indexOf(task._id) : -1;
				if(taskIndex >= 0) {
					user.pendingTasks.splice(taskIndex, 1);
					database.updateUser(user._id, user);
				}
			}
		});
		if(task.completed) {
			database.getUser(newUser).success(function(data) {
				var user;
				user = data.data;
				if(user.name) {
					var taskIndex = user.pendingTasks ? user.pendingTasks.indexOf(task._id) : -1;
					if(taskIndex >= 0) {
						user.pendingTasks.splice(taskIndex, 1);
						database.updateUser(user._id, user);
					}
				}
			});
		}
		else {
			database.getUser(newUser).success(function(data) {
				var user;
				user = data.data;
				if(user.name) {
					var taskIndex = user.pendingTasks ? user.pendingTasks.indexOf(task._id) : -1;
					if(taskIndex < 0) {
						user.pendingTasks.push(task._id);
						database.updateUser(user._id, user);
					}
				}
			});
		}
		return database.updateTask(task);
	}

	database.deleteTask = function(task) {
		
		return $http.delete(baseURL() + "tasks/" + task._id).success(function(data) {
			if(task.assignedUser) {
				var user;
				database.getUser(task.assignedUser).success(function(data) {
					user = data.data;
					if(user.name) {
						var taskIndex = user.pendingTasks ? user.pendingTasks.indexOf(task._id) : -1;
						if(taskIndex >= 0) {
							user.pendingTasks.splice(taskIndex, 1);
							database.updateUser(user._id, user);
						}
					}
				});
			}
		});

	}

	return database;

}]);