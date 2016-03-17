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

mp4Controllers.controller('UsersController', ['$scope', 'Database', function($scope, Database) {

	$scope.users;

	getUsers();

	function getUsers() {
		Database.getUsers().success(function(data) {
			$scope.users = data.data;
			toastr.success('Loaded user information');
		})
		.error(function(data) {
			toastr.error('Unable to load user information');
		});
	}

}]);

mp4Controllers.controller('UserDetailController', ['$scope', 'Database', '$routeParams', function($scope, Database, $routeParams) {

	$scope.userID = $routeParams.user_id;

}]);

mp4Controllers.controller('TasksController', ['$scope', 'Database', function($scope, Database) {

	$scope.tasks;

	getTasks();

	function getTasks() {
		Database.getTasks().success(function(data) {
			$scope.tasks = data.data;
			toastr.success('Loaded task information');
		})
		.error(function(data) {
			toastr.error('Unable to load task information');
		});
	}

}]);

mp4Controllers.controller('TaskDetailController', ['$scope', 'Database', '$routeParams', function($scope, Database, $routeParams) {

	$scope.taskID = $routeParams.task_id;

}]);