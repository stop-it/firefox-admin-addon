# Documentation

## Messages `index.js` &ndash;&gt; `data/page.js`

Here is a list of available messages that can be send from the add-on to the content script:

 Name   | Description
--------|-------------
message | Show user message.
load    | Initialize content-page.
refresh | Refresh data view.

### Message `message`

#### Arguments

 Name    | Type | Description
---------|------|-------------
aMessage | _String_ | String with message self.

#### Description

Used to display user message ([snackbar](www.google.com/design/spec/components/snackbars-toasts.html)) from the main script.

#### Example

```JavaScript
worker.port.emit('message', 'I\'m the message...');
```

### Message `load`

#### Arguments

 Name   | Type | Description
--------|------|-------------
aStatus | _Object_ | Loading status (_Optional_).

#### Description

Used as a _onLoad_ method when the content-page is ready.

#### Examples

Normally is used just this:

```JavaScript
// Initialize page and prepare data view. 
worker.port.emit('load');
```

But when error during add-on loading is occured then show just status [card](http://www.getmdl.io/components/index.html#cards-section):

```JavaScript
// Initialize page and show status card (so page is initialized without 
// data view and with some commands disabled).
worker.port.emit('load', STATUS_DB_UNDEFINED);
```

Status is just a simple object:

```JavaScript
/**
 * Used when path to SQLite database is not set.
 * @const {String}
 */
const STATUS_DB_UNDEFINED = {
	get title() { return 'Database undefined'; },
	get message() { return '<b>Stop-It</b> database file is not defined.'; }
};
```

### Message `refresh`

#### Arguments

 Name     | Type     | Description
----------|----------|-------------
aDataView | _Object_ | Data view object.

#### Description

Refresh data view with the given data.

#### Example

Usage is simple:

```JavaScript
worker.port.emit('refresh', {
	count: 25, // Count of rows to display.
	from : 0,  // Index from which ara data displayed.
	to   : 25, // Index to which ara data displayed.
	rows : [], // Array with data self.
	total: 0   // Total count of data items (rows).
});
```


## Messages `data/page.js`  &ndash;&gt; `index.js`

Here is a list of available messages that can be send from the content script to the add-on:

 Name     | Description
----------|-------------
close     | Request for close page.
refresh   | Request for refresh data view.
set_rows  | Request for change visible lines.
move_prev | Request for previous data view's page.
move_next | Request for next data view's page.
insert    | Request for saving URL(s) to database.
delete    | Request for deleting URL(s) from database.

### Message `close`

#### Description

Request for close tab with the main content-page.

#### Example

```JavaScript
self.emit('close');
```

### Message `refresh`

#### Description

....

#### Example

```JavaScript
// ....
```

### Message `set_rows`

#### Description

....

#### Example

```JavaScript
// ....
```


### Message `move_prev`

#### Description

....

#### Example

```JavaScript
// ....
```

### Message `move_next`

#### Description

....

#### Example

```JavaScript
// ....
```

### Message `insert`

#### Description

....

#### Example

```JavaScript
// ....
```

### Message `delete`

#### Description

....

#### Example

```JavaScript
// ....
```
