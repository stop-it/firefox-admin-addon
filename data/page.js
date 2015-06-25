/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// This is triggered when error is occured.
self.port.on('error', function(type) {
	// Database connection is not established.
	if (type == 'database_connection_undefined') {
		var errorDlg = document.createElement('div');
		errorDlg.classList.add('dialog');
		errorDlg.classList.add('errorDialog');

		var header = document.createElement('header');
		var h2 = document.createElement('h2');
		h2.innerHTML = 'Database connection error';
		header.appendChild(h2);

		var content = document.createElement('div');
		content.classList.add('content');
		var p = document.createElement('p');
		p.innerHTML = 'Unable to connect <b>Stop-It</b> SQLite database. ' + 
			'Open add-on preferences and check if path to database file ' + 
			'is set correctly.';
		content.appendChild(p);

		var footer = document.createElement('footer');
		var buttonClose = document.createElement('button');
		buttonClose.setAttribute('type', 'button');
		buttonClose.innerHTML = 'Close page';
		buttonClose.addEventListener('click', function(event) {
			self.port.emit('closePage');
		});
		footer.appendChild(buttonClose);

		//var buttonPrefs = document.createElement('button');
		//buttonPrefs.setAttribute('type', 'button');
		//buttonPrefs.innerHTML = 'Open preferences';
		//footer.appendChild(buttonPrefs);

		errorDlg.appendChild(header);
		errorDlg.appendChild(content);
		errorDlg.appendChild(footer);

		var pageContent = document.getElementById('content');
		pageContent.appendChild(errorDlg);
	}
});
