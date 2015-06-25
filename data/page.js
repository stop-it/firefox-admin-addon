/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Database file undefined.
self.port.on('database_undefined', function(type) {
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
		self.port.emit('close_page');
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
});

// Database connection failed.
self.port.on('database_connection_failed', function() {
	// TODO Print error dialog!
});

// This is triggered before data (URLs) will be sent to this page.
self.port.on('prepare_data_table', function() {
	var table = document.createElement('table');
	table.setAttribute('id', 'table');
	table.classList.add('data');

	var thead = document.createElement('thead');
	var theadRow = document.createElement('tr');

	var thCol1 = document.createElement('th');
	thCol1.setAttribute('scope', 'col');
	thCol1.classList.add('check');
	var thCol1Check = document.createElement('input');
	thCol1Check.setAttribute('type', 'checkbox');
	thCol1.appendChild(thCol1Check);

	var thCol2 = document.createElement('th');
	thCol2.setAttribute('scope', 'col');
	thCol2.innerHTML = 'URL';

	var thCol3 = document.createElement('th');
	thCol3.setAttribute('scope', 'col');
	thCol3.innerHTML = 'Updated';

	var thCol4 = document.createElement('th');
	thCol4.setAttribute('scope', 'col');
	thCol4.classList.add('control');
	thCol4.innerHTML = '&nbsp;';

	theadRow.appendChild(thCol1);
	theadRow.appendChild(thCol2);
	theadRow.appendChild(thCol3);
	theadRow.appendChild(thCol4);
	thead.appendChild(theadRow);
	table.appendChild(thead);

	var tbody = document.createElement('tbody');
	var tbodyRow = document.createElement('tr');

	var td = document.createElement('td');
	td.setAttribute('colspan', '3');
	td.classList.add('messageCol');
	td.innerHTML = 'Please wait - loading data&hellip;';

	tbodyRow.appendChild(td);
	tbody.appendChild(tbodyRow);
	table.appendChild(tbody);

	var pageContent = document.getElementById('content');
	pageContent.appendChild(table);
});