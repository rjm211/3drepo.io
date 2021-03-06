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

(function() {
	"use strict";

	angular.module("3drepo")
		.service("DialogService", DialogService);
		
	DialogService.$inject = [
		"$mdDialog"
	];

	function DialogService(
		$mdDialog
	) {

		var expiredDialogOpen = false;
		var disconnectedDialogOpen = false;
		var disconnectDialogLastOpen;
		var muteNotifications = false;
		var thirtySeconds = 30 * 1000; /* ms */

		var service = {
			text: text,
			html: html,
			showDialog: showDialog,
			closeDialog: closeDialog,
			sessionExpired: sessionExpired,
			newUpdate: newUpdate,
			disconnected: disconnected
		};

		return service;

		////////

		function disconnected() {

			var greaterThanThirtySeconds = true;

			if (disconnectDialogLastOpen !== undefined) {
				greaterThanThirtySeconds = ((Date.now()) - disconnectDialogLastOpen) > thirtySeconds;
			}

			if (greaterThanThirtySeconds === false) {
				console.log("Notifications - greaterThanThirtySeconds", greaterThanThirtySeconds);
				return;
			}

			if (muteNotifications === true) {
				console.log("Notifications - muteNotifications", muteNotifications);
				return;
			}

			if (disconnectedDialogOpen === true) {
				console.debug("Notifications - Disconnect dialog currently open");
				return;
			}

			var title = "Notification Service Disconnected";
			var content = "Your connection to the 3D Repo's notification service has dropped. " + 
			"3D Repo may not behave as expected when commenting and changing issues. Try refreshing the page" +
			" to reconnect.";
			var escapable = true;

			// Opening the dialog
			disconnectedDialogOpen = true;
			disconnectDialogLastOpen = Date.now();

			return $mdDialog.show( 
				$mdDialog.confirm()
					.clickOutsideToClose(escapable)
					.escapeToClose(escapable)
					.title(title)
					.htmlContent(content)
					.ariaLabel(title)
					.ok("Continue")
					.cancel("Mute Notifications")
			)
				.then(function(){
					disconnectedDialogOpen = false;
				})
				.catch(function(){
					console.log("Notifications - Muting notifications");
					disconnectedDialogOpen = false;
					muteNotifications = true;
				}); 

		}

		function showDialog(
			dialogTemplate, scope, event, clickOutsideToClose, parent, fullscreen, closeTo
		) {
			
			// Allow the dialog to have cancel ability
			scope.utilsRemoveDialog = scope.utilsRemoveDialog || function () {
				$mdDialog.cancel();
			};

			// Set up and show dialog
			var data = {
				controller: function () {},
				templateUrl: "/templates/" + dialogTemplate,
				onRemoving: function () {
					$mdDialog.cancel();
				}
			};

			data.parent = angular.element(angular.isDefined(parent) ? parent : document.body);

			data.scope = (angular.isDefined(scope)) ? scope : null;
			data.preserveScope = (data.scope !== null);
			data.targetEvent = (angular.isDefined(event)) ? event : null;
			data.clickOutsideToClose = (angular.isDefined(clickOutsideToClose)) ? clickOutsideToClose : true;
			data.fullscreen = (angular.isDefined(fullscreen)) ? fullscreen : false;
			data.closeTo = (angular.isDefined(closeTo)) ? closeTo : false;
			$mdDialog.show(data);
		}

		/**
         * close a dialog
         */
		function closeDialog() {
			$mdDialog.cancel();
		}

		function sessionExpired() {

			if (!expiredDialogOpen) {

				expiredDialogOpen = true;
				var content = "You have been logged out as your session has expired.";
				return $mdDialog.show( 
					$mdDialog.alert()
						.clickOutsideToClose(false)
						.escapeToClose(false)
						.title("Session Expired")
						.textContent(content)
						.ariaLabel("Session Expired")
						.ok("OK")
				).then(function(){
					expiredDialogOpen = false;
				});
						
			} else {
				return Promise.resolve();
			}

		}

		function text(title, content, escapable) {

			if (!expiredDialogOpen) {

				if (escapable === undefined) {
					escapable = true;
				}
	
				return $mdDialog.show( 
					$mdDialog.alert()
						.clickOutsideToClose(escapable)
						.escapeToClose(escapable)
						.title(title)
						.textContent(content)
						.ariaLabel(title)
						.ok("OK")
				);

			} else {
				return Promise.resolve();
			}
			
		}

		function html(title, content, escapable) {
			
			if (!expiredDialogOpen) {
				
				if (escapable === undefined) {
					escapable = true;
				}

				return $mdDialog.show( 
					$mdDialog.alert()
						.clickOutsideToClose(escapable)
						.escapeToClose(escapable)
						.title(title)
						.htmlContent(content)
						.ariaLabel(title)
						.ok("OK")
				);
			} else {
				return Promise.resolve();
			}

		}

		function newUpdate() {

			var title = "Update Available";
			var content = "A new version of 3D Repo is available! <br> <br> " +
				"Please reload the page for the latest version. See the latest changelog " +
				"<a href='https://github.com/3drepo/3drepo.io/releases/latest'>here</a>.";
			var escapable = false;

			if (escapable === undefined) {
				escapable = true;
			}

			return $mdDialog.show( 
				$mdDialog.confirm()
					.clickOutsideToClose(escapable)
					.escapeToClose(escapable)
					.title(title)
					.htmlContent(content)
					.ariaLabel(title)
					.ok("Reload")
					.cancel("I'll reload in a moment")
			)
				.then(function(){
					window.location.reload();
				})
				.catch(function(){
					console.log("User didn't reload");
				});
		
		}

	}	
			
})();




		