/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Triggered when page is loaded.
addon.port.on('load', function onShow() {
	console.log('[page].onLoad');
});

// Triggered when page is going to be unloaded.
addon.port.on('unload', function onHide() {
	console.log('[page].onUnload');
});
