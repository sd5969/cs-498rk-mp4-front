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
	$scope.deleteDisabled = false;
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
		$scope.deleteDisabled = true;
		$event.stopPropagation();
		Database.deleteUser(user).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Deleted user ' + user.name);
			getUsers();
			$scope.deleteDisabled = false;
		})
		.error(function(data) {
			if(data.message) toastr.error('Error: ' + data.message);
			else toastr.error('Unable to delete user ' + user.name);
			$scope.deleteDisabled = false;
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
	$scope.deleteDisabled = false;
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
		task.completed = true;
		Database.updateTask(task).success(function(data) {
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
		$scope.deleteDisabled = true;
		$event.stopPropagation();
		Database.deleteUser(user).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Deleted user ' + user.name);
			$location.path("/users");
			$scope.deleteDisabled = false;
		})
		.error(function(data) {
			if(data.message) toastr.error('Error: ' + data.message);
			else toastr.error('Unable to delete user ' + user.name);
			$scope.deleteDisabled = false;
		});
	}

}]);

mp4Controllers.controller('AddUserController', ['$scope', 'Database', '$location', function($scope, Database, $location) {
	$scope.name;
	$scope.email;
	$scope.addDisabled = false;

	$scope.addUser = function addUser() {
		if(!$scope.name || $scope.name === '') {
			toastr.error('Please enter a user name');
			return;
		}
		else if(!$scope.email || $scope.email === '') {
			toastr.error('Please enter an email');
			return;
		}
		$scope.addDisabled = true;
		var user = {
			name : $scope.name,
			email : $scope.email
		};
		Database.addUser(user).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Added user ' + user.name);
			$location.path("/users");
			$scope.addDisabled = false;
		})
		.error(function(data) {
			if(data.message) toastr.error(data.message);
			else toastr.error('Unable to add user ' + user.name);
			$scope.addDisabled = false;
		});
	}
}]);

mp4Controllers.controller('TasksController', ['$scope', 'Database', '$location', function($scope, Database, $location) {

	$scope.tasks;
	$scope.completed = 'false';
	$scope.sortBy = 'dateCreated';
	$scope.sortUpDown = '1';
	$scope.deleteDisabled = false;
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
		$scope.deleteDisabled = true;
		$event.stopPropagation();
		Database.deleteTask(task).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Deleted task');
			getTasks($scope.completed, $scope.sortBy, $scope.sortUpDown);
			$scope.deleteDisabled = false;
		})
		.error(function(data) {
			if(data.message) toastr.error(data.message);
			else toastr.error('Unable to delete task');
			$scope.deleteDisabled = false;
		});
	}

}]);

mp4Controllers.controller('TaskDetailController', ['$scope', 'Database', '$routeParams', '$location', function($scope, Database, $routeParams, $location) {

	$scope.taskID = $routeParams.task_id;
	$scope.task;
	$scope.deleteDisabled = false;
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
		$scope.deleteDisabled = true;
		$event.stopPropagation();
		Database.deleteTask($scope.task).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Deleted task');
			$location.path("/tasks");
			$scope.deleteDisabled = false;
		})
		.error(function(data) {
			if(data.message) toastr.error(data.message);
			else toastr.error('Unable to delete task');
			$scope.deleteDisabled = false;
		});
	}

	$scope.editTask = function($event) {
		$location.path("/tasks/" + $scope.taskID + "/edit");
	}

	$scope.setTask = function($event) {
		Database.updateTask($scope.task).success(function(data) {

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
	$scope.addDisabled = false;

	function getUsers() {
		Database.getUsers().success(function(data) {
			$scope.users = data.data;
		})
		.error(function(data) {
			toastr.error('Unable to get user list');
		});
	}

	$scope.addTask = function() {
		if(!$scope.name || $scope.name === '') {
			toastr.error('Please enter a task name');
			return;
		}
		else if(!$scope.deadline || $scope.deadline === '') {
			toastr.error('Please enter a task deadline');
			return;
		}
		$scope.addDisabled = true;
		var task = {
			name : $scope.name,
			deadline : new Date($scope.deadline),
			description : $scope.description,
			completed : false,
			assignedUser : ($scope.selectedUser ? $scope.selectedUser._id : ''),
			assignedUserName : ($scope.selectedUser ? $scope.selectedUser.name : 'unassigned')
		};
		Database.addTask(task).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Added task');
			$location.path("/tasks");
			$scope.addDisabled = false;
		})
		.error(function(data) {
			if(data.message) toastr.error(data.message);
			else toastr.error('Unable to add task');
			$scope.addDisabled = false;
		});
	}

}]);

mp4Controllers.controller('EditTaskController', ['$scope', 'Database', '$routeParams', '$location', '$filter', function($scope, Database, $routeParams, $location, $filter) {

	$scope.taskID = $routeParams.task_id;
	$scope.users;
	$scope.originalUser;
	$scope.selectedUser;
	$scope.task;
	$scope.submitDisabled = false;
	getUsers();
	getTask($scope.taskID);

	function getTask(id) {
		Database.getTask(id).success(function(data) {
			$scope.task = data.data;
			$scope.originalUser = $scope.task.assignedUser;
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
		if(!$scope.task.name || $scope.task.name === '') {
			toastr.error('Please enter a task name');
			return;
		}
		else if(!$scope.task.deadline || $scope.task.deadline === '') {
			toastr.error('Please enter a task deadline');
			return;
		}
		$scope.submitDisabled = true;
		var lastUser = $scope.originalUser;
		$scope.updateUser();
		var newUser = $scope.task.assignedUser;

		Database.updateTaskAndUser($scope.task, lastUser, newUser).success(function(data) {
			if(data.message) toastr.success(data.message);
			else toastr.success('Edited task successfully');
			$location.path("/tasks/" + $scope.taskID);
			$scope.submitDisabled = false;
		})
		.error(function(data) {
			if(data.message) toastr.error(data.message);
			else toastr.error('Unable to edit task');
			$scope.submitDisabled = false;
		});
	}
}]);