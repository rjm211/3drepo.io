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
.factory('Readme', ['$http', '$q', 'serverConfig', function($http, $q, serverConfig){
	var o = {};

	o.defaultReadme = "[Missing Readme]";

	o.refresh = function(account, project, branch, revision) {
		var self = this;

		self.text		= "";

		var deferred = $q.defer();

		$http.get(serverConfig.apiUrl(account + '/' + project + '/revision/' + branch + '/' + revision + '/readme.json'))
		.then(function(json) {
			self.text = json.data.readme;

			deferred.resolve();
		}, function(json) {
			self.text	= self.defaultReadme;
			deferred.resolve();
		});

		return deferred.promise;
	};

	return o;
}]);

