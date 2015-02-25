/**
 *  Copyright (C) 2014 3D Repo Ltd
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

angular.module('3drepo')
.provider('pageConfig', ['$urlRouterProvider', function pageConfigProvider($urlRouterProvider) {
	var loggedInFunc    = function(Auth) { $state.go('login'); }
	var notLoggedInFunc = function(Auth) { $state.go('login'); }

	this.setStateFuncs = function(newLoggedInFunc, newNotLoggedInFunc) {
		loggedInFunc = newLoggedInFunc;
		notLoggedInFunc = newNotLoggedInFunc;
	};

	this.$get = ["Auth", "$state", function pageConfig(Auth, $state) {
		var obj = {};

		obj.loggedInFunc    = loggedInFunc;
		obj.notLoggedInFunc = notLoggedInFunc;

		// Which state to go to by default
		obj.goDefault = function() {
			Auth.isLoggedIn().then(function _loginGoDefaultSuccess(result) {
				if(result)
					loggedInFunc(Auth, $state);
				else
					notLoggedInFunc(Auth, $state);
			});
		}

		$urlRouterProvider.otherwise(obj.goDefault);

		return obj;
	}];
}]);

