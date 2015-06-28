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
	return d.getDate() + '.' + (d.getMonth() + 1) + ' ' + d.getFullYear() +
		' ' + d.getHours() + ':' + d.getMinutes();
}

/**
 * Create elements for checkbox that looks like checkboxes from Material Design.
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

/**
 * Create elements for select that looks like selects from Material Design.
 * @param {String} aId
 * @param {String} aCurrentValue
 * @param {Array} aValues
 * @return {DOMElement}
 */
function createSelect(aId, aCurrentValue, aValues) {
	var div = document.createElement('div');
	div.setAttribute('id', aId);
	div.classList.add('select-group');

	var input = document.createElement('input');
	input.setAttribute('id', aId + 'Input');
	input.setAttribute('value', aCurrentValue);
	input.readonly = true;
	div.appendChild(input);

	var span = document.createElement('span');
	span.classList.add('md-icon');
	span.classList.add('dp24');
	span.appendChild(document.createTextNode('keyboard_arrow_down'));
	div.appendChild(span);

	var ul = document.createElement('ul');
	for (var i=0; i<aValues.length; i++) {
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(aValues[i]));
		ul.appendChild(li);
	}
	div.appendChild(ul);

	return div;
}/**
 * Event handler for `checkAll` checkbox.
 */
function onCheckAllClick() {
	var checkAll = document.getElementById('checkAll');
	var checked = !checkAll.checked;

	var tdChecksAll = document.getElementsByClassName('check');
	var tdChecks = Array.prototype.filter.call(tdChecksAll, function(tdCheck) {
		return tdCheck.nodeName === 'TD';
	});

	for (var i=0; i<tdChecks.length; i++) {
		var elm = tdChecks[i].lastElementChild.firstElementChild;
		if (elm.nodeName === 'INPUT') {
			elm.checked = checked;
		}
	}
} // end onCheckAllClick()

/**
 * Event handler for displaying rows count selector menu.
 */
function onRowsCountDownIconClick() {
	var cont = document.getElementById('rowsCount');
	var contRect = cont.getBoundingClientRect();
	var menu = cont.lastElementChild;
	var contY = contRect.top - document.body.getBoundingClientRect().top;

	switch (cont.firstElementChild.value) {
		case '25' : menu.style.top = (contY + 4) + 'px'; break;
		case '50' : menu.style.top = (contY - 26) + 'px'; break;
		case '100': menu.style.top = (contY - 56) + 'px'; break;
	}

	menu.style.left = contRect.left + 'px';
	menu.style.display = 'block';
} // end onRowsCountDownIconClick()

/**
 * Event handler for selecting rows count from the selector menu.
 * @param {DOMEvent} aEvent
 */
function onRowsCountMenuItemClick(aEvent) {
	var cont = document.getElementById('rowsCount');

	if (aEvent.target.nodeName === 'LI') {
		cont.firstElementChild.value = aEvent.target.innerHTML;
	}

	cont.lastElementChild.style.display = 'none';
} // end onRowsCountMenuItemClick(aEvent)

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
	thCol2Span.classList.add('label');
	thCol2Span.appendChild(document.createTextNode('URL'));
	thCol2.appendChild(thCol2Span);

	var thCol3 = document.createElement('th');
	thCol3.setAttribute('scope', 'col');
	var thCol3Span = document.createElement('span');
	thCol3Span.classList.add('label');
	thCol3Span.appendChild(document.createTextNode('Updated'));
	thCol3.appendChild(thCol3Span);

	theadRow.appendChild(thCol1);
	theadRow.appendChild(thCol2);
	theadRow.appendChild(thCol3);
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
	}

	table.appendChild(tbody);

	var tfoot = document.createElement('tfoot');
	var tfootTr = tfoot.insertRow();
	var tfootCell = tfootTr.insertCell();
	tfootCell.setAttribute('colspan', '3');

	var tfootSpan1 = document.createElement('span');
	tfootSpan1.classList.add('label'); 
	tfootSpan1.appendChild(document.createTextNode('Rows per page:'));
	tfootCell.appendChild(tfootSpan1);

	// TODO Set correct `rowsCount`!
	var tfootSelect = createSelect('rowsCount', '25', ['25', '50', '100']);
	tfootCell.appendChild(tfootSelect);

	var tfootSpan2 = document.createElement('span');
	tfootSpan2.classList.add('label'); 
	// TODO Set correct `rowsFrom`! 
	// TODO Set correct `rowsTo`! 
	// TODO Set correct `rowsTotal`!
	tfootSpan2.appendChild(document.createTextNode('1-25 of 37800'));
	tfootCell.appendChild(tfootSpan2);

	var tfootSpan3 = document.createElement('span');
	tfootSpan3.setAttribute('id', 'moveTableToPrevPage');
	tfootSpan3.classList.add('md-icon');
	tfootSpan3.classList.add('dp24');
	tfootSpan3.classList.add('disabled');
	tfootSpan3.appendChild(document.createTextNode('navigate_before'));
	tfootCell.appendChild(tfootSpan3);

	var tfootSpan4 = document.createElement('span');
	tfootSpan4.setAttribute('id', 'moveTableToNextPage');
	tfootSpan4.classList.add('md-icon');
	tfootSpan4.classList.add('dp24');
	tfootSpan4.appendChild(document.createTextNode('navigate_next'));
	tfootCell.appendChild(tfootSpan4);

	table.appendChild(tfoot);

	var pageContent = document.getElementById('content');
	pageContent.appendChild(table);

	// Attach event listeners
	var checkAllBox = document.getElementById('checkAll').parentElement.lastElementChild.lastElementChild;
	var checkAllCheck = checkAllBox.previousElementSibling;
	checkAllBox.addEventListener('click', onCheckAllClick, false);
	checkAllCheck.addEventListener('click', onCheckAllClick, false);

	var rowsCountCont = document.getElementById('rowsCount');
	var rowsCountDown = rowsCountCont.firstElementChild.nextElementSibling;
	var rowsCountMenu = rowsCountCont.lastElementChild;
	rowsCountDown.addEventListener('click', onRowsCountDownIconClick, false);
	rowsCountMenu.addEventListener('click', onRowsCountMenuItemClick, false);
});

// This is triggered when the page is loaded.
self.port.on('page_load', function() {
	console.log('[page.js].onLoad');
});

// This is triggered when the page is going to be unloaded.
self.port.on('page_onload', function() {
	console.log('[page.js].onLoad');

	// Detach event listeners (if data table exists)
	var table = document.getElementById('table');
	if (table !== undefined) {
		var checkAllBox = document.getElementById('checkAll').parentElement.lastElementChild.lastElementChild;
		var checkAllCheck = checkAllBox.previousElementSibling;
		checkAllBox.removeEventListener('click', onCheckAllClick, false);
		checkAllCheck.removeEventListener('click', onCheckAllClick, false);
	
		var rowsCountCont = document.getElementById('rowsCount');
		var rowsCountDown = rowsCountCont.firstElementChild.nextElementSibling;
		var rowsCountMenu = rowsCountCont.lastElementChild;
		rowsCountDown.removeEventListener('click', onRowsCountDownIconClick, false);
		rowsCountMenu.removeEventListener('click', onRowsCountMenuItemClick, false);
	}
});
