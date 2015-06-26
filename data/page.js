/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Create dialog.
 * @param {String} aType
 * @param {String} aTitle
 * @param {String} aBody
 * @param {String} aBtnLabel
 * @param {String} aBtnCallback
 * @returns {void}
 */
function createDialog(aType, aTitle, aBody, aBtnLabel, aBtnCallback) {
	var errorDlg = document.createElement('div');
	errorDlg.classList.add('dialog');
	errorDlg.classList.add('errorDialog');

	var header = document.createElement('header');
	var h2 = document.createElement('h2');
	h2.appendChild(document.createTextNode('Database connection error'));
	header.appendChild(h2);

	var content = document.createElement('div');
	content.classList.add('content');
	var p = document.createElement('p');
	p.innerHTML = aBody;
	content.appendChild(p);

	var footer = document.createElement('footer');
	var buttonClose = document.createElement('button');
	buttonClose.setAttribute('type', 'button');
	buttonClose.appendChild(document.createTextNode(aBtnLabel));
	buttonClose.addEventListener('click', aBtnCallback);
	footer.appendChild(buttonClose);

	errorDlg.appendChild(header);
	errorDlg.appendChild(content);
	errorDlg.appendChild(footer);

	var pageContent = document.getElementById('content');
	pageContent.appendChild(errorDlg);
} // end createDialog(aType, aTitle, aBody, aBtnLabel, aBtnCallback)

/**
 * Convert datetime string from RFC3339 to readable (and shorter) version.
 * @param {String} aDate
 * @returns {String}
 */
function formatDate(aDate) {
	var d = new Date(aDate);
	return d.getDate() + "." + (d.getMonth() + 1) + " " + d.getFullYear() +
		" " + d.getHours() + ":" + d.getMinutes();
}

/**
 * Create elements for checkbox to looks like checkboxes from Material Design.
 * @param {String} aId
 * @return {DOMElement}
 */
function createCheckbox(aId) {
	var div = document.createElement('div');
	div.classList.add('checkbox-group');

	var input = document.createElement('input');
	input.setAttribute('type', 'checkbox');
	input.setAttribute('id', aId);

	var label = document.createElement('label');
	label.setAttribute('for', aId);

	var ripple = document.createElement('span');
	ripple.classList.add('ripple');
	label.appendChild(ripple);

	var check = document.createElement('span');
	check.classList.add('check');
	label.appendChild(check);

	var box = document.createElement('span');
	box.classList.add('box');
	label.appendChild(box);

	div.appendChild(input);
	div.appendChild(label);

	return div;
}

// Database file undefined.
self.port.on('database_undefined', function() {
	createDialog(
		'error', 'Database undefined',
		'<b>Stop-It</b> database file is not defined. Open add-on ' +
		'preferences and set path to a database file.',
		'Close page', function (event) { self.port.emit('close_page'); }
	);
});

// Database connection failed.
self.port.on('database_connection_failed', function(error) {
	createDialog(
		'error', 'Database connection failed',
		'Unable to connect <b>Stop-It</b> SQLite database. Open add-on ' +
		'preferences and check if path to database file is set correctly.<br>' +
		'<br><code>' + error + '</code>',
		'Close page', function(event) { self.port.emit('close_page'); }
	);
});

// Database statement error.
self.port.on('database_error', function(error) {
	createDialog(
		'error', 'Database error',
		'Error occured during using the <b>Stop-It</b> database. Below ' +
		'is related message:<br><br><code>' + error + '</code>',
		'Close page', function(event) { self.port.emit('close_page'); }
	);
});

// This is triggered before data (URLs) will be sent to this page.
self.port.on('create_data_table', function(data) {
	var table = document.createElement('table');
	table.setAttribute('id', 'table');
	table.classList.add('data');

	var thead = document.createElement('thead');
	var theadRow = document.createElement('tr');

	var thCol1 = document.createElement('th');
	thCol1.setAttribute('scope', 'col');
	thCol1.classList.add('check');
	var thCol1Check = createCheckbox('checkAll');
	thCol1.appendChild(thCol1Check);

	var thCol2 = document.createElement('th');
	thCol2.setAttribute('scope', 'col');
	var thCol2Span = document.createElement('span');
	thCol2Span.classList('label');
	thCol2Span.appendChild(document.createTextNode('URL'));
	thCol2.appendChild(thCol2Span);

	var thCol3 = document.createElement('th');
	thCol3.setAttribute('scope', 'col');
	var thCol3Span = document.createElement('span');
	thCol3Span.classList('label');
	thCol3Span.appendChild(document.createTextNode('Updated'));
	thCol3.appendChild(thCol3Span);

	var thCol4 = document.createElement('th');
	thCol4.setAttribute('scope', 'col');
	thCol4.classList.add('control');
	//thCol4.appendChild(document.createTextNode('&nbsp;'));
	thCol4.innerHTML = '&nbsp;';

	theadRow.appendChild(thCol1);
	theadRow.appendChild(thCol2);
	theadRow.appendChild(thCol3);
	theadRow.appendChild(thCol4);
	thead.appendChild(theadRow);
	table.appendChild(thead);

	var tbody = document.createElement('tbody');
	tbody.setAttribute('id', 'dataTableBody');

	for (var i=0; i<data.length; i++) {
		var row = tbody.insertRow();
		var cell1 = row.insertCell();
		cell1.classList.add('check');

		var check = createCheckbox('url_' + data[i].id);
		cell1.appendChild(check);

		var cell2 = row.insertCell();
		cell2.appendChild(document.createTextNode(data[i].url));

		var cell3 = row.insertCell();
		cell3.appendChild(document.createTextNode(formatDate(data[i].updated)));

		var cell4 = row.insertCell();
		cell4.classList.add('control');
		var span = document.createElement('span');
		span.classList.add('md-icon');
		span.classList.add('dp18');
		span.appendChild(document.createTextNode('edit'));
		cell4.appendChild(span);
	}

	table.appendChild(tbody);

	var pageContent = document.getElementById('content');
	pageContent.appendChild(table);
});