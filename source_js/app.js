var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/settings', {
		templateUrl: 'partials/settings.html',
		controller: 'SettingsController',
		activeTab: 'settings'
	}).
	when('/users', {
		templateUrl: 'partials/users.html',
		controller: 'UsersController',
		activeTab: 'users'
	}).
	when('/users/add', {
		templateUrl: 'partials/addUser.html',
		controller: 'AddUserController',
		activeTab: 'users'
	}).
	when('/users/:user_id', {
		templateUrl: 'partials/userDetails.html',
		controller: 'UserDetailController',
		activeTab: 'users'
	}).
	when('/tasks', {
		templateUrl: 'partials/tasks.html',
		controller: 'TasksController',
		activeTab: 'tasks'
	}).
	when('/task/add', {
		templateUrl: 'partials/addTask.html',
		controller: 'AddTaskController',
		activeTab: 'tasks'
	}).
	when('/tasks/:task_id', {
		templateUrl: 'partials/taskDetails.html',
		controller: 'TaskDetailController',
		activeTab: 'tasks'
	}).
	when('/tasks/:task_id/edit', {
		templateUrl: 'partials/editTask.html',
		controller: 'EditTaskController',
		activeTab: 'tasks'
	}).
	otherwise({
		redirectTo: '/settings'
	});
}]);