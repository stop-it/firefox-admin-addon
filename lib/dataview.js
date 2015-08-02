/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


/**
 * Data of the current data view.
 * @var {Object} dataView
 */
let dataView = {
	count: 25, // Count of rows to display.
	from : 0,  // Index from which ara data displayed.
	to   : 25, // Index to which ara data displayed.
	rows : [], // Array with data self.
	total: 0   // Total count of data items (rows).
};

/**
 * Initialize data view.
 * @returns {DataViewPrototype}
 */
function Dataview_Init() {
	dataView = new DataViewPrototype(25, 0, 25, [], 0);

	return dataView;
} // end Dataview_Init()

/**
 * Move to the previous page.
 * @returns {Boolean}
 */
function Dataview_CanMovePrev() {
	return (dataView.from > 0);
} // end Dataview_CanMovePrev()

/**
 * Move to the next page.
 * @returns {Boolean}
 */
function DataView_CanMoveNext() {
	return (dataView.to < dataView.total);
} // end DataView_CanMoveNext()

/**
 * Move to the previous page.
 * @returns {void}
 */
function Dataview_MovePrev() {
	// TODO Set `from`|`to`|`count`!
} // end Dataview_MovePrev()

/**
 * Move to the next page.
 * @returns {void}
 */
function DataView_MoveNext() {
	// TODO Set `from`|`to`|`count`!
} // end DataView_MoveNext()

/**
 * Retrieve current data for the data view.
 * @returns {Array}
 */
function DataView_Retrieve() {
	// TODO Query data from database and return them!
	return dataView.rows;
} // end DataView_Retrieve()

// ==========================================================================

exports.init        = Dataview_Init;
exports.canMovePrev = Dataview_CanMovePrev;
exports.canMoveNext = DataView_CanMoveNext;
exports.movePrev    = Dataview_MovePrev;
exports.moveNext    = DataView_MoveNext;
exports.retrieve    = DataView_Retrieve;