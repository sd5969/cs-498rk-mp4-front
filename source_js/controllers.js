var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('ActiveTabController', ['$scope', '$route', function($scope, $route) {
	$scope.$route = $route;
}]);

mp4Controllers.controller('SettingsController', ['$scope', '$window', function($scope, $window) {
	$scope.url = $window.sessionStorage.baseurl;
	$scope.setUrl = function() {
		$window.sessionStorage.baseurl = $scope.url;
		toastr.success('API URL set');
	};

}]);

mp4Controllers.controller('UsersController', ['$scope', 'Database', '$location', function($scope, Database, $location) {

	$scope.users;
	getUsers();

	function getUsers() {
		Database.getUsers().success(function(data) {
			$scope.users = data.data;
			// toastr.success('Loaded user information');
		})
		.error(function(data) {
			toastr.error('Unable to load user information');
		});
	}

	$scope.addUser = function() {
		$location.path("/users/add");
	}

	$scope.deleteUser = function(user, $event) {
		$event.stopPropagation();
		Database.deleteUser(user._id).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Deleted user ' + user.name);
			getUsers();
		})
		.error(function(data) {
			if(data.message) toastr.error('Error: ' + data.message);
			else toastr.error('Unable to delete user ' + user.name);
		});
	}

	$scope.userDetails = function(user, $event) {
		$location.path("/users/" + user._id);
	}

}]);

mp4Controllers.controller('UserDetailController', ['$scope', 'Database', '$routeParams', '$location', function($scope, Database, $routeParams, $location) {

	var userID = $routeParams.user_id;
	$scope.user;
	$scope.tasks;
	$scope.completedTasks;
	$scope.loadedTasks = false;
	getUser(userID);

	function getUser(id) {
		Database.getUser(id).success(function(data) {
			$scope.user = data.data;
			// toastr.success('Loaded user ' + data.data.name + ' information');
			getTasks($scope.user);
		})
		.error(function(data) {
			toastr.error('Unable to load user ' + id + ' information');
		});
	}

	function getTasks(user) {
		Database.getPendingTasksByUser(user).success(function(data) {
			$scope.tasks = data.data;
		})
		.error(function(data) {
			toastr.error('Unable to load user ' + id + ' tasks');
		});
	}

	function getCompletedTasks(user) {
		Database.getCompletedTasksByUser(user).success(function(data) {
			$scope.completedTasks = data.data;
			$scope.loadedTasks = true;
		})
		.error(function(data) {
			toastr.error('Unable to load user ' + id + ' tasks');
		});
	}

	$scope.taskDetails = function(task, $event) {
		$location.path("/tasks/" + task._id);
	}

	$scope.taskComplete = function(task, $event) {
		$event.stopPropagation();
		Database.completeTask(task).success(function(data) {
			toastr.success('Task marked as completed');
			getTasks($scope.user);
			if($scope.loadedTasks) getCompletedTasks($scope.user);
		})
		.error(function(data) {
			toastr.error('Unable to mark task as complete');
		});
	}

	$scope.loadCompletedTasks = function($event) {
		getCompletedTasks($scope.user);
	}

	$scope.deleteUser = function(user, $event) {
		$event.stopPropagation();
		Database.deleteUser(user._id).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Deleted user ' + user.name);
			$location.path("/users");
		})
		.error(function(data) {
			if(data.message) toastr.error('Error: ' + data.message);
			else toastr.error('Unable to delete user ' + user.name);
		});
	}

}]);

mp4Controllers.controller('AddUserController', ['$scope', 'Database', '$location', function($scope, Database, $location) {
	$scope.name;
	$scope.email;

	$scope.addUser = function addUser() {
		var user = {
			name : $scope.name,
			email : $scope.email
		};
		Database.addUser(user).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Added user ' + user.name);
			$location.path("/users");
		})
		.error(function(data) {
			if(data.message) toastr.error(data.message);
			else toastr.error('Unable to add user ' + user.name);
		});
	}
}]);

mp4Controllers.controller('TasksController', ['$scope', 'Database', '$location', function($scope, Database, $location) {

	$scope.tasks;
	$scope.completed = 'false';
	$scope.sortBy = 'dateCreated';
	$scope.sortUpDown = '1';
	getTasks($scope.completed, $scope.sortBy, $scope.sortUpDown);

	function getTasks(pending, sortField, sortOrder) {
		Database.getTasksSpecific(pending, sortField, sortOrder).success(function(data) {
			$scope.tasks = data.data;
			// toastr.success('Loaded task information');
		})
		.error(function(data) {
			toastr.error('Unable to load task information');
		});
	}

	$scope.fetchTasks = function() {
		getTasks($scope.completed, $scope.sortBy, $scope.sortUpDown);
	}

	$scope.addTask = function() {
		$location.path('/tasks/add');
	}

	$scope.taskDetails = function(task, $event) {
		$event.stopPropagation();
		$location.path('/tasks/' + task._id);
	}

	$scope.deleteTask = function(task, $event) {
		$event.stopPropagation();
		Database.deleteTask(task._id).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Deleted task');
			getTasks($scope.completed, $scope.sortBy, $scope.sortUpDown);
		})
		.error(function(data) {
			if(data.message) toastr.error(data.message);
			else toastr.error('Unable to delete task');
		});
	}

}]);

mp4Controllers.controller('TaskDetailController', ['$scope', 'Database', '$routeParams', '$location', function($scope, Database, $routeParams, $location) {

	$scope.taskID = $routeParams.task_id;
	$scope.task;
	getTask($scope.taskID);

	function getTask(id) {
		Database.getTask(id).success(function(data) {
			$scope.task = data.data;
			// toastr.success('Loaded task ID ' + id + ' information');
		})
		.error(function(data) {
			toastr.error('Unable to load task ID ' + id + ' information');
		});
	}

	$scope.deleteTask = function($event) {
		$event.stopPropagation();
		Database.deleteTask($scope.task._id).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Deleted task');
			$location.path("/tasks");
		})
		.error(function(data) {
			if(data.message) toastr.error(data.message);
			else toastr.error('Unable to delete task');
		});
	}

	$scope.editTask = function($event) {
		$location.path("/tasks/" + $scope.taskID + "/edit");
	}

	$scope.setTask = function($event) {
		Database.updateTask($scope.taskID, $scope.task).success(function(data) {

		})
		.error(function(data) {
			if(data.message) toastr.error(data.message);
			else toastr.error('Unable to update task');
		});
	}

}]);

mp4Controllers.controller('AddTaskController', ['$scope', 'Database', '$location', function($scope, Database, $location) {

	$scope.users;
	$scope.name, $scope.deadline, $scope.description, $scope.selectedUser;
	getUsers();

	function getUsers() {
		Database.getUsers().success(function(data) {
			$scope.users = data.data;
		})
		.error(function(data) {
			toastr.error('Unable to get user list');
		});
	}

	$scope.addTask = function() {
		var task = {
			name : $scope.name,
			deadline : new Date($scope.deadline),
			description : $scope.description,
			completed : false,
			assignedUser : $scope.selectedUser._id,
			assignedUserName : $scope.selectedUser.name
		};
		Database.addTask(task).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Added task');
			$location.path("/tasks");
		})
		.error(function(data) {
			if(data.message) toastr.error(data.message);
			else toastr.error('Unable to add task');
		});
	}

}]);

mp4Controllers.controller('EditTaskController', ['$scope', 'Database', '$routeParams', '$location', '$filter', function($scope, Database, $routeParams, $location, $filter) {

	$scope.taskID = $routeParams.task_id;
	$scope.users;
	$scope.selectedUser;
	$scope.task;
	getUsers();
	getTask($scope.taskID);

	function getTask(id) {
		Database.getTask(id).success(function(data) {
			$scope.task = data.data;
			// $scope.selectedUser = $filter('filter')($scope.users, { _id : $scope.task.assignedUser});
			$scope.selectedUser = $scope.task.assignedUser;
			// toastr.success('Loaded task ID ' + id + ' information');
		})
		.error(function(data) {
			toastr.error('Unable to load task ID ' + id + ' information');
		});
	}

	function getUsers() {
		Database.getUsers().success(function(data) {
			$scope.users = data.data;
			$scope.users.push({
				name : 'unassigned',
				_id : ''
			});
		})
		.error(function(data) {
			toastr.error('Unable to get user list');
		});
	}

	$scope.updateUser = function() {
		$scope.task.assignedUser = $scope.selectedUser;
		$scope.task.assignedUserName =
			$scope.selectedUser === '' ? 'unassigned' : $filter('filter')($scope.users, { _id : $scope.task.assignedUser})[0].name;
	}

	$scope.editTask = function() {
		$scope.updateUser();
		Database.updateTask($scope.taskID, $scope.task).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Edited task successfully');
			$location.path("/tasks/" + $scope.taskID);
		})
		.error(function(data) {
			if(data.message) toastr.error(data.message);
			else toastr.error('Unable to edit task');
		});
	}
}]);