/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * Hold identifier(s) of URL(s) to delete.
 * @var {Array}
 */
var deleteUrlIds = [];

/**
 * Create card.
 * @param {String} aTitle
 * @param {String} aBody
 * @returns {void}
 */
function createCard(aTitle, aBody) {
	var card = document.createElement('div');
	card.classList.add('mdl-card');
	card.classList.add('mdl-shadow--2dp');

	var title = document.createElement('div');
	title.classList.add('mdl-card__title');
	title.classList.add('mdl-card--expand');
	var h2 = document.createElement('h2');
	h2.appendChild(document.createTextNode(aTitle));
	h2.classList.add('mdl-card__title-text');
	title.appendChild(h2);

	var content = document.createElement('div');
	content.classList.add('mdl-card__supporting-text');
	var p = document.createElement('p');
	p.innerHTML = aBody;
	content.appendChild(p);

	var actions = document.createElement('div');
	actions.classList.add('mdl-card__actions');
	actions.classList.add('mdl-card--border');
	var closeBtn = document.createElement('a');
	closeBtn.classList.add('mdl-button');
	closeBtn.classList.add('mdl-button--colored');
	closeBtn.classList.add('mdl-js-button');
	closeBtn.classList.add('mdl-js-ripple-effect');
	closeBtn.appendChild(document.createTextNode('Close page'));
	closeBtn.addEventListener('click', onClosePageClick);
	actions.appendChild(closeBtn);

	card.appendChild(title);
	card.appendChild(content);
	card.appendChild(actions);

	var pageContent = document.getElementById('content');
	pageContent.appendChild(card);
} // end createCard(aTitle, aBody)

/**
 * Convert datetime string from RFC3339 to readable (and shorter) version.
 * @param {String} aDate
 * @returns {String}
 */
function formatDate(aDate) {
	var d = new Date(aDate);
	return d.getDate() + '.' + (d.getMonth() + 1) + ' ' + d.getFullYear() +
		' ' + d.getHours() + ':' + d.getMinutes();
} // end formatDate(aDate)

/**
 * Create elements for select that looks like selects from Material Design.
 * @param {String} aId
 * @param {String} aCurrentValue
 * @param {Array} aValues
 * @returns {DOMElement}
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
	span.classList.add('material-icons');
	//span.classList.add('dp24');
	span.appendChild(document.createTextNode('keyboard_arrow_down'));
	span.addEventListener('click', onRowsCountDownIconClick, false);
	div.appendChild(span);

	var ul = document.createElement('ul');
	for (var i=0; i<aValues.length; i++) {
		var li = document.createElement('li');
		li.appendChild(document.createTextNode(aValues[i]));
		ul.appendChild(li);
	}
	ul.addEventListener('click', onRowsCountMenuItemClick, false);
	div.appendChild(ul);

	return div;
} // end createSelect(aId, aCurrentValue, aValues)

/**
 * Create form for adding new URL.
 * @return {HTMLElement}
 */
function createAddUrlPopupDialog() {
	var dlg = document.createElement('div');
	dlg.classList.add('dialog');
	dlg.classList.add('popupDialog');
	dlg.setAttribute('id', 'addNewUrlDialog');

	var header = document.createElement('header');
	var title = document.createElement('h2');
	title.appendChild(document.createTextNode('Add new URL'));
	header.appendChild(title);
	dlg.appendChild(header);

	var content = document.createElement('div');
	content.classList.add('content');

	var form = document.createElement('form');
	form.setAttribute('id', 'addNewUrlForm');

	var formDiv = document.createElement('div');
	formDiv.classList.add('input-group');
	var input = document.createElement('input');
	input.classList.add('text-input');
	input.setAttribute('id', 'newUrlInput');
	input.setAttribute('placeholder', 'Enter new URL or its part');
	input.required = true;
	formDiv.appendChild(input);
	var inputBar = document.createElement('span');
	inputBar.classList.add('bar');
	formDiv.appendChild(inputBar);
	form.appendChild(formDiv);
	content.appendChild(form);
	dlg.appendChild(content);

	var footer = document.createElement('footer');
	var btnCancel = document.createElement('button');
	btnCancel.setAttribute('id', 'addNewUrlCancelBtn');
	btnCancel.appendChild(document.createTextNode('Cancel'));
	footer.appendChild(btnCancel);
	var btnSave = document.createElement('button');
	btnSave.setAttribute('id', 'addNewUrlSaveBtn');
	btnSave.appendChild(document.createTextNode('Save'));
	footer.appendChild(btnSave);
	dlg.appendChild(footer);

	return dlg;
} // end createAddUrlForm()

/**
 * Create dialog for URL(s) removal confirmation dialog.
 */
function createDeleteUrlPopupDialog() {
	var dlg = document.createElement('div');
	dlg.classList.add('dialog');
	dlg.classList.add('popupDialog');
	dlg.setAttribute('id', 'deleteUrlDialog');

	var header = document.createElement('header');
	var title = document.createElement('h2');
	title.appendChild(document.createTextNode('Delete selected URL(s)'));
	header.appendChild(title);
	dlg.appendChild(header);

	var content = document.createElement('div');
	content.classList.add('content');

	var p = document.createElement('p');
	var b = document.createElement('b');
	b.setAttribute('id', 'deleteUrlCountInfo');
	p.appendChild(document.createTextNode('Do you really want to delete '));
	p.appendChild(b);
	p.appendChild(document.createTextNode(' URLs?'));
	content.appendChild(p);
	dlg.appendChild(content);

	var footer = document.createElement('footer');
	var btnCancel = document.createElement('button');
	btnCancel.setAttribute('id', 'deleteUrlCancelBtn');
	btnCancel.appendChild(document.createTextNode('Cancel'));
	footer.appendChild(btnCancel);
	var btnSave = document.createElement('button');
	btnSave.setAttribute('id', 'deleteUrlSubmitBtn');
	btnSave.appendChild(document.createTextNode('Delete'));
	footer.appendChild(btnSave);
	dlg.appendChild(footer);

	return dlg;
} // end createDeleteUrlPopupDialog()

/**
 * Create dataview thead element.
 * @return {HTMLTableSectionElement}
 */
function createDataviewThead(aTable) {
	var thead = document.createElement('thead');

	/*var coloredRow = thead.insertRow();
	coloredRow.classList.add('coloredHeader');
	var thColoredCell = coloredRow.insertCell();
	thColoredCell.setAttribute('colspan', '2');

	var thNav = document.createElement('nav');
	thNav.classList.add('nav');

	var navBtnDelete = document.createElement('span');
	navBtnDelete.classList.add('material-icons');
	//navBtnDelete.classList.add('dp32');
	navBtnDelete.setAttribute('id', 'deleteUrlBtn');
	navBtnDelete.setAttribute('title', 'Delete selected URL(s)');
	navBtnDelete.appendChild(document.createTextNode('delete'));
	navBtnDelete.addEventListener('click', onDeleteUrlBtnClick, false);
	thNav.appendChild(navBtnDelete);

	thColoredCell.appendChild(thNav);

	var formDiv = document.createElement('div');
	formDiv.classList.add('form');
	formDiv.setAttribute('id', 'addNewUrlArea');
	var btnAdd = document.createElement('button');
	btnAdd.classList.add('add');
	btnAdd.setAttribute('id', 'addNewUrlBtn');
	btnAdd.setAttribute('title', 'Add new URL');
	btnAdd.appendChild(document.createTextNode('Add'));
	formDiv.appendChild(btnAdd);

	var addNewUrlDlg = createAddUrlPopupDialog();
	formDiv.appendChild(addNewUrlDlg);

	var deleteUrlDlg = createDeleteUrlPopupDialog();
	thColoredCell.appendChild(deleteUrlDlg);
	thColoredCell.appendChild(formDiv);*/

	var infoRow = thead.insertRow();
	var thCol2 = document.createElement('th');
	thCol2.setAttribute('scope', 'col');
	thCol2.classList.add('mdl-data-table__cell--non-numeric');
	thCol2.appendChild(document.createTextNode('URL'));
	infoRow.appendChild(thCol2);

	var thCol3 = document.createElement('th');
	thCol3.setAttribute('scope', 'col');
	thCol3.classList.add('mdl-data-table__cell--non-numeric');
	thCol3.appendChild(document.createTextNode('Updated'));
	infoRow.appendChild(thCol3);

	return thead;
} // end createDataviewThead()

/**
 * Create dataview tfoot element.
 * @return {HTMLTableSectionElement}
 */
function createDataviewTfoot(aTable) {
	var tfoot = document.createElement('tfoot');
	var tfootTr = tfoot.insertRow();
	tfootTr.insertCell(); // empty cell
	var tfootCell2 = tfootTr.insertCell();

	var tfootSpan1 = document.createElement('span');
	tfootSpan1.classList.add('label'); 
	tfootSpan1.appendChild(document.createTextNode('Rows per page:'));
	tfootCell2.appendChild(tfootSpan1);

	var tfootSelect = createSelect('rowsCount', 25, ['25', '50', '100']);
	tfootCell2.appendChild(tfootSelect);

	var tfootSpan2 = document.createElement('span');
	tfootSpan2.setAttribute('id', 'dataViewRangeInfo');
	tfootSpan2.classList.add('label');
	var dataViewInfo = '0-0 of 0';
	tfootSpan2.appendChild(document.createTextNode(dataViewInfo));
	tfootCell2.appendChild(tfootSpan2);

	var prevBtn = document.createElement('button');
	prevBtn.setAttribute('id', 'moveTableToPrevPage');
	prevBtn.classList.add('mdl-button');
	prevBtn.classList.add('mdl-js-button');
	prevBtn.classList.add('mdl-button--icon');
	prevBtn.addEventListener('click', onPrevPageButtonClick, false);

	var prevBtnIcon = document.createElement('i');
	prevBtnIcon.classList.add('material-icons');
	prevBtnIcon.appendChild(document.createTextNode('navigate_before'));
	prevBtn.appendChild(prevBtnIcon);
	tfootCell2.appendChild(prevBtn);

	var nextBtn = document.createElement('button');
	nextBtn.setAttribute('id', 'moveTableToNextPage');
	nextBtn.classList.add('mdl-button');
	nextBtn.classList.add('mdl-js-button');
	nextBtn.classList.add('mdl-button--icon');
	nextBtn.addEventListener('click', onNextPageButtonClick, false);

	var nextBtnIcon = document.createElement('i');
	nextBtnIcon.classList.add('material-icons');
	nextBtnIcon.appendChild(document.createTextNode('navigate_next'));
	nextBtn.appendChild(nextBtnIcon);
	tfootCell2.appendChild(nextBtn);

	return tfoot;
} // end createDataviewTfoot()

/**
 * Create dataview table element.
 * @return {HTMLTableElement}
 */
function createDataview() {
	var table = document.createElement('table');
	table.setAttribute('id', 'table');
	table.classList.add('mdl-data-table');
	table.classList.add('mdl-js-data-table');
	table.classList.add('mdl-data-table--selectable');
	table.classList.add('mdl-shadow--2dp');

	var thead = createDataviewThead();
	table.appendChild(thead);

	var tbody = document.createElement('tbody');
	tbody.setAttribute('id', 'dataTableBody');

	var row = tbody.insertRow();
	var cell = row.insertCell();
	cell.setAttribute('colspan', '2');
	cell.innerHTML = 'Waiting for data&hellip;';
	cell.classList.add('message');

	table.appendChild(tbody);

	var tfoot = createDataviewTfoot();
	table.appendChild(tfoot);

	return table;
} // end createDataview()

/**
 * Create new snackbar.
 * @param {String} aMessage
 * @todo Solve multiple snackbars problem!
 */
function createSnackbar(aMessage) {
	var div = document.createElement('div');
	div.classList.add('snackbar');

	var p = document.createElement('p');

	p.appendChild(document.createTextNode(aMessage));
	div.appendChild(p);

	document.body.appendChild(div);
	window.setTimeout(function() { document.body.removeChild(div); }, 3500);
} // end createSnackbar(aMessage)

// ==========================================================================
// Below are listeners from events emitted from the add-on main page.

/**
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
		var rowsCount = aEvent.target.innerHTML;
		cont.firstElementChild.value = rowsCount;
		self.port.emit('set_rows', parseInt(rowsCount));
	}

	cont.lastElementChild.style.display = 'none';
} // end onRowsCountMenuItemClick(aEvent)

/**
 * Event handler for moving data view to previous page.
 */
function onPrevPageButtonClick() {
	self.port.emit('move_prev');
} // end onPrevPageButtonClick(aEvent)

/**
 * Event handler for moving data view to next page.
 */
function onNextPageButtonClick() {
	self.port.emit('move_next');
} // end onNextPageButtonClick(aEvent)

/**
 * Event handler for add new URL button click.
 */
function onAddNewUrlBtnClick() {
	var dlg = document.getElementById('addNewUrlDialog');
	var tbl = document.getElementById('table');
	var tblRect = tbl.getBoundingClientRect();
	var contY = tblRect.top - document.body.getBoundingClientRect().top;

	dlg.style.top = contY + 'px';
	dlg.style.left = tblRect.left + 'px';
	dlg.style.display = 'block';
} // end onAddNewUrlBtnClick()

/**
 * Event handler for canceling adding new URL.
 */
function onAddNewUrlCancelBtnClick() {
	var dlg = document.getElementById('addNewUrlDialog');
	var input = document.getElementById('newUrlInput');

	input.value = '';
	dlg.style.display = 'none';
} // end onAddNewUrlCancelBtnClick()

/**
 * Event handler for saving a new URL.
 */
function onAddNewUrlSaveBtnClick() {
	var dlg = document.getElementById('addNewUrlDialog');
	var input = document.getElementById('newUrlInput');
	var url = input.value;
	
	input.value = '';
	dlg.style.display = 'none';

	self.port.emit('save_new_url', url);
} // end onAddNewUrlSaveBtnClick()

/**
 * Event handler for delete URL(s) button.
 */
function onDeleteUrlBtnClick() {
	if (deleteUrlIds.length > 0) {
		// There is a running removal process...
		return;
	}

	// Select all checked checkboxes
	var inputs = document.getElementsByTagName('input');
	for (var i=0; i<inputs.length; i++) {
		var input = inputs[i];
		if (input.getAttribute('type') == 'checkbox') {
			if (input.checked === true && input.getAttribute('id') != 'checkAll') {
				deleteUrlIds.push(input.getAttribute('id').replace('url_', ''));
			}
		}
	}

	// If there are no checked checkboxes show snackbar
	if (deleteUrlIds.length === 0) {
		createSnackbar('No URL selected');
		return;
	}

	// Set count of URL(s) to delete
	var info = document.getElementById('deleteUrlCountInfo');
	info.innerHTML = deleteUrlIds.length.toString();

	// Show removal confirmation dialog
	var dlg = document.getElementById('deleteUrlDialog');
	var tbl = document.getElementById('table');
	var tblRect = tbl.getBoundingClientRect();
	var contY = tblRect.top - document.body.getBoundingClientRect().top;
	dlg.style.top = contY + 'px';
	dlg.style.left = Math.round(tblRect.right) - 600 + 'px';
	dlg.style.display = 'block';
} // end onDeleteUrlBtnClick()

/**
 * Event handler for canceling delete URL(s) dialog.
 */
function onDeleteUrlCancelBtnClick() {
	var dlg = document.getElementById('deleteUrlDialog');

	dlg.style.display = 'none';
} // end onDeleteUrlCancelBtnClick()

/**
 * Event handler for submitting delete URL(s) dialog.
 */
function onDeleteUrlSubmitBtnClick() {
	var dlg = document.getElementById('deleteUrlDialog');
	dlg.style.display = 'none';
	self.port.emit('delete_urls', deleteUrlIds);

	// Clear cache variable
	deleteUrlIds = [];

	// Uncheck all inputs
	var inputs = document.getElementsByTagName('input');
	for (var i=0; i<inputs.length; i++) {
		var input = inputs[i];
		if (input.getAttribute('type') == 'checkbox') {
			if (input.checked === true) {
				input.checked = false;
			}
		}
	}
} // end onDeleteUrlCancelBtnClick()

/**
 * Event handler for close tab request.
 */
function onClosePageClick() {
	self.port.emit('close');
} // end onClosePageClick()

// ==========================================================================
// Listeners for messages from the `index.js`:


// Print message (create snackbar).
self.port.on('message', function(aMessage) {
	createSnackbar(aMessage);
});

// `onLoad` message
self.port.on('load', function(aStatus) {
	if (aStatus !== null) {
		document.getElementById('import-menuitem').setAttribute('disabled', null);
		// TODO document.getElementById('preferences-menuitem').addEventListener(...)
		document.getElementById('close-menuitem').addEventListener('click', onClosePageClick, false);
		createCard(aStatus.title, aStatus.message);
		return;
	}

	var table = createDataview();
	var pageContent = document.getElementById('content');
	pageContent.appendChild(table);

	// Attach event listeners for add new URL form
	//var addNewUrlBtn = document.getElementById('addNewUrlBtn');
	//addNewUrlBtn.addEventListener('click', onAddNewUrlBtnClick, false);

	//var addNewUrlCancelBtn = document.getElementById('addNewUrlCancelBtn');
	//addNewUrlCancelBtn.addEventListener('click', onAddNewUrlCancelBtnClick, false);

	//var addNewUrlSaveBtn = document.getElementById('addNewUrlSaveBtn');
	//addNewUrlSaveBtn.addEventListener('click', onAddNewUrlSaveBtnClick, false);

	// Attach event listeners for URL(s) removal confirmation dialog
	//var deleteUrlCancelBtn = document.getElementById('deleteUrlCancelBtn');
	//deleteUrlCancelBtn.addEventListener('click', onDeleteUrlCancelBtnClick, false);

	//var deleteUrlSubmitBtn = document.getElementById('deleteUrlSubmitBtn');
	//deleteUrlSubmitBtn.addEventListener('click', onDeleteUrlSubmitBtnClick, false);

	// Attach event listeners for checkAll checkbox
	//var checkAllBox = document.getElementById('checkAll').parentElement.lastElementChild.lastElementChild;
	//var checkAllCheck = checkAllBox.previousElementSibling;
	//checkAllBox.addEventListener('click', onCheckAllClick, false);
	//checkAllCheck.addEventListener('click', onCheckAllClick, false);

	// Request refresh of dataview
	self.port.emit('refresh');
});

// Refresh data view.
self.port.on('refresh', function(aDataView) {
	var tbody = document.getElementById('dataTableBody');
	if (tbody == undefined) {
		console.log('Data view table body is undefined!');
		return;
	}

	// Remove all current rows of tbody
	while (tbody.rows.length) {
		tbody.deleteRow(0);
	}

	// Render new tbody rows
	for (var i=0; i<aDataView.rows.length; i++) {
		var row = tbody.insertRow();

		var cell2 = row.insertCell();
		cell2.appendChild(document.createTextNode(aDataView.rows[i].url));
		cell2.classList.add('mdl-data-table__cell--non-numeric');

		var cell3 = row.insertCell();
		cell3.appendChild(document.createTextNode(formatDate(aDataView.rows[i].updated)));
		cell3.classList.add('mdl-data-table__cell--non-numeric');
	}

	// Update table footer
	document.getElementById('rowsCountInput').value = aDataView.count;

	var dataViewInfo = aDataView.from + '-' + aDataView.to + ' of ' + aDataView.total;
	document.getElementById('dataViewRangeInfo').innerHTML = dataViewInfo;

	var canMovePrev = (aDataView.from == 0);
	document.getElementById('moveTableToPrevPage').disabled = canMovePrev;

	var canMoveNext = ((aDataView.to + aDataView.count) >= aDataView.total);
	document.getElementById('moveTableToNextPage').disabled = canMoveNext;
});







/*
function onWindowUnload(aEvent) {
	console.log('[page.js].onWindowUnload()');
	console.log(aEvent);

	// Detach event listeners (if data table exists)
	var table = document.getElementById('table');
	if (table !== undefined) {
		var addNewUrlBtn = document.getElementById('addNewUrlBtn');
		addNewUrlBtn.removeEventListener('click', onAddNewUrlBtnClick, false);

		var addNewUrlCancelBtn = document.getElementById('addNewUrlCancelBtn');
		addNewUrlCancelBtn.removeEventListener('click', onAddNewUrlCancelBtnClick, false);
		var addNewUrlSaveBtn = document.getElementById('addNewUrlSaveBtn');
		addNewUrlSaveBtn.removeEventListener('click', onAddNewUrlSaveBtnClick, false);

		var deleteUrlCancelBtn = document.getElementById('deleteUrlCancelBtn');
		deleteUrlCancelBtn.removeEventListener('click', onDeleteUrlCancelBtnClick, false);

		var deleteUrlSubmitBtn = document.getElementById('deleteUrlSubmitBtn');
		deleteUrlSubmitBtn.removeEventListener('click', onDeleteUrlSubmitBtnClick, false);

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
} // end onWindowUnload(aEvent)
*/