/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var { Cu } = require('chrome');
var pageMod = require('sdk/page-mod');
var self = require('sdk/self');
var tabs = require('sdk/tabs');
var ui = require('sdk/ui');

Cu.import('resource://gre/modules/Sqlite.jsm');
Cu.import('resource://gre/modules/Task.jsm');

/**
 * Used when path to SQLite database is not set.
 * @const {String}
 */
const STATUS_DB_UNDEFINED = {
	get title() { return 'Database file undefined'; },
	get message() { return '<b>Stop-It</b> database file is not defined.'; }
};

/**
 * Used when opening file with SQLite database failed.
 * @const {String}
 */
const STATUS_DB_CONN_FAILED = {
	get title() { return 'Database connection failed'; },
	get message() { return 'Unable to connect <b>Stop-It</b> database.'; }
};

/**
 * Used when error occured during executing some SQL command.
 * @const {String}
 */
const STATUS_DB_ERROR = {
	get title() { return 'Database error'; },
	get message() { return 'Error occured during using the <b>Stop-It</b> database.'; }
};

/**
 * URL to main add-on's page.
 * @var {String} addonPageUrl
 */
const ADDON_PAGE_URL = self.data.url('page.html');

/**
 * Path to SQLite database file.
 * @var {String} databaseFile
 */
var databaseFile = require('sdk/simple-prefs').prefs['databaseFile'];

/**
 * Data of the current data view.
 * @var {Object} dataView
 */
var dataView = {
	count: 25, // Count of rows to display.
	from : 0,  // Index from which ara data displayed.
	to   : 25, // Index to which ara data displayed.
	rows : [], // Array with data self.
	total: 0   // Total count of data items (rows).
};

/**
 * Is TRUE if data view was prepared and at least once refreshed.
 * @var {Boolean} dataViewInitialized
 */
var dataViewInitialized = false;

/**
 * Return date as a string in RFC3339 format (e.g. 2015-06-25T04:33:21+0200).
 * @return {String}
 */
Date.prototype.formatAsRFC3339 = function formatDateAsRFC3339() {
	let y = this.getFullYear();
	let m = this.getMonth() + 1;
	m =  m < 10 ? '0' + m : m;
	let d = this.getDate() < 10 ? '0' + this.getDate() : this.getDate();
	let h = this.getHours() < 10 ? '0' + this.getHours() : this.getHours();
	let min = this.getMinutes() < 10 ? '0' + this.getMinutes() : this.getMinutes();
	let s = this.getSeconds() < 10 ? '0' + this.getSeconds() : this.getSeconds();
	let t = Math.round(this.getTimezoneOffset() / 60);
	t = (t < 0) ? '+' + (Math.abs(t) < 10 ? '0' + Math.abs(t) : Math.abs(t)) + '00' : '-' + t + '00';

	return y + '-' + m + '-' + d + 'T' + h + ':' + min + ':' + s + t;
}; // end formatDateAsRFC3339()

/**
 * Called when preference with path of database file is changed.
 * @param {String} aPrefName
 */
function onDatabaseFileChange(aPrefName) {
	databaseFile = require('sdk/simple-prefs').prefs['databaseFile'];

	if (databaseFile != undefined) {
		MainButton.state('window', {
			'badge': null,
			'badgeColor': null,
			'label': 'Stop-It Administration'
		});
	}
} // end onDatabaseFileChange(aPrefName)

// Attach event listener for changing `databaseFile` preference value.
require('sdk/simple-prefs').on('databaseFile', onDatabaseFileChange);

/**
 * Refresh data view.
 * @param {Worker} aWorker
 */
function refreshDataView(aWorker) {
	Task.spawn(
		function* loadUrls() {
			let conn = yield Sqlite.openConnection({ path: databaseFile }); 
	
			try {
				if (dataView.total == 0) {
					let result = yield conn.execute('SELECT count(Url) FROM Urls');
					dataView.total = parseInt(result[0].getResultByIndex(0));
				}

				let result = yield conn.execute(
					'SELECT * FROM Urls ORDER BY Id ASC LIMIT ?, ? ', 
					[dataView.from, dataView.count]
				);

				dataView.rows = [];
				for (let row of result) {
					dataView.rows.push({
						id: row.getResultByName('Id'),
						url: row.getResultByName('Url'),
						updated: row.getResultByName('Updated')
					});
				}
			} catch(e) {
				console.log(e.message);
			} finally {
				yield conn.close();
			}
		}
	).then(
		function () {
			aWorker.port.emit('refresh', dataView);
			dataViewInitialized = true;
		}
	);
} // end refreshDataView(aWorker)

/**
 * Save new URL.
 * @param {Worker} aWorker
 * @param {String} aUrl
 */
function saveNewUrl(aWorker, aUrl) {
	Task.spawn(
		function* loadUrls() {
			let conn = yield Sqlite.openConnection({ path: databaseFile });

			try {
				let result = yield conn.execute(
					'INSERT INTO Urls (Url, Updated) VALUES (?, ?) ', 
					[aUrl, (new Date()).formatAsRFC3339()]
				);

				dataView.total++;
				aWorker.port.emit('message', 'New URL added');
			} catch(e) {
				aWorker.port.emit('message', 'URL already exist');
			} finally {
				yield conn.close();
			}
		}
	).then(
		function () {
			refreshDataView(aWorker);
		}
	);
} // end saveNewUrl(aUrl)

/**
 * Remove URL(s) with given ID(s) from the database.
 * @param {Worker} aWorker
 * @param {Array} aUrlIds
 */
function deleteUrl(aWorker, aUrlIds) {
	let ids = aUrlIds.join(',');
	Task.spawn(
		function* loadUrls() {
			let conn = yield Sqlite.openConnection({ path: databaseFile });

			try {
				let result = yield conn.execute(
					'DELETE FROM Urls Where Id IN (' + ids + ')'
				);

				dataView.total = dataView.total - aUrlIds.length;
				if (aUrlIds.length > 1) {
					aWorker.port.emit('message', 'URLs were deleted');
				} else {
					aWorker.port.emit('message', 'URL was deleted');
				}
			} catch(e) {
				if (aUrlIds.length > 1) {
					aWorker.port.emit('message', 'URLs were NOT deleted');
				} else {
					aWorker.port.emit('message', 'URL was NOT deleted');
				}
			} finally {
				yield conn.close();
			}
		}
	).then(
		function () {
			refreshDataView(aWorker);
		}
	);
} // end deleteUrl(aUrlIds)

/**
 * Called when add-on's main page is ready.
 * @param {Tab} aTab
 */
function onAddonPageReady(aTab) {
	var worker = aTab.attach({
		contentScriptFile: self.data.url('page.js'),
	});

	// Listen for request for close page (tab).
	worker.port.on('close', function() {
		worker.tab.close();
	});
	
	// Listen for request for refreshing dataview
	worker.port.on('refresh', function() {
		refreshDataView(worker);
	});

	// Listen for changing count of displayed dataview rows.
	worker.port.on('set_rows', function(aRowsCount) {
		// Ensure that this is called after `refreshDataView` was called at least once!
		if (dataViewInitialized !== true) {
			console.log('Can\'t change rows count - dataview is not initialized yet!');
			return;
		}

		dataView.count = aRowsCount;
 
		if ((dataView.from + dataView.count) > dataView.total) {
			dataView.to = dataView.total;
		} else {
			dataView.to = dataView.from + dataView.count;
		}

		refreshDataView(worker);
	});

	// Listen for request of moving on previous dataview's page.
	worker.port.on('move_prev', function() {
		// Ensure that this is called after `refreshDataView` was called at least once!
		if (dataViewInitialized !== true) {
			console.log('Can\'t move to previous page - dataview is not initialized yet!');
			return;
		}

		if (dataView.from - dataView.count >= 0) {
			dataView.from = dataView.from - dataView.count;
			dataView.to = dataView.to - dataView.count;
			refreshDataView(worker);
		} else {
			console.log('Can\'t move to previous page - dataview is already on the first page!');
			return;
		}
	});

	// Listen for request of moving on next dataview's page.
	worker.port.on('move_next', function() {
		// Ensure that this is called after `refreshDataView` was called at least once!
		if (dataViewInitialized !== true) {
			console.log('Can\'t move to next page - dataview is not initialized yet!');
			return;
		}

		if ((dataView.to + dataView.count) <= dataView.total) {
			dataView.from = dataView.from + dataView.count;
			dataView.to = dataView.to + dataView.count;
			refreshDataView(worker);
		} else {
			console.log('Can\'t move to next page - dataview is already on the last page!');
			return;
		}
	});

	// Listen for saving new URL
	worker.port.on('insert', function(aUrl) {
		saveNewUrl(worker, aUrl);
	});

	// Listen for URLs removal request
	worker.port.on('delete', function(aUrlIds) {
		deleteUrl(worker, aUrlIds);
	});

	// Initialize the main content page:
	// 1) Database file is not set
	if (databaseFile === undefined || databaseFile === null || databaseFile === '') {
		worker.port.emit('load', STATUS_DB_UNDEFINED);
		return;
	}

	try {
		// 2) Test connection to database file
		Sqlite.openConnection({ path: databaseFile });
		// 3a) Connection is successfull - load normally
		worker.port.emit('load', null);
	} catch (e) {
		// 3b) Connection failed.
		worker.port.emit('load', STATUS_DB_CONN_FAILED);
	}
} // end onAddonPageReady(aTab)

/**
 * Called when user clicks on our toolbar button.
 */
function onMainButtonClick() {
	// Check if page is already opened - if yes bring it to the foreground.
	for (var i=0; i<tabs.length; i++) {
		if (tabs[i].url == ADDON_PAGE_URL) {
			tabs[i].activate();
			return;
		}
	}

	// Page is not opened yet - open it
	tabs.open({
		url: ADDON_PAGE_URL,
		onReady: onAddonPageReady
	});
} // end onMainButtonClick()

// Main toolbar button.
var MainButton = ui.ActionButton({
	id: 'stopit-admin-btn',
	label: 'Stop-It Administration',
	icon: {
		16: self.data.url('icon-16.png'),
		32: self.data.url('icon-32.png'),
		64: self.data.url('icon-64.png')
	},
	onClick: onMainButtonClick
});

// Display warning badge on toolbar button if `databaseFile` is not set
if (databaseFile == undefined) {
	MainButton.state('window', {
		'badge': '!',
		'badgeColor': '#F44336',
		'label': 'Stop-It Administration: Database file is not selected!'
	});
}
