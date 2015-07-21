# Stop-It Administration Add-on

Simple [Mozilla Firefox](https://www.mozilla.org/firefox) add-on for managing [Stop-It](http://stop-it.be/) database with blocked URLs.

__NOTE__: The database self is __NOT__ included - if you don't have one you have to create it at the first place!

__NOTE__: Because of using latest features of [Mozilla Add-on SDK](https://developer.mozilla.org/en-US/Add-ons/SDK) you need to use development version of [Mozilla Firefox](https://www.mozilla.org/firefox/developer/) - tested on __40.0a2__.

## Database schema

You can create new __Stop-It__ database using [SQLite CLI Shell](http://sqlite.org/cli.html):

```bash
$ sqlite3 stop-it.sqlite
SQLite version 3.8.2 2013-12-06 14:53:30
Enter ".help" for instructions
Enter SQL statements terminated with a ";"
sqlite> CREATE TABLE Urls (Id INTEGER PRIMARY KEY, Url TEXT NOT NULL UNIQUE, Updated TEXT NOT NULL);
sqlite> PRAGMA user_version = 1;
sqlite> .exit
```

## Using add-on

1. Download add-on and install it into the [Mozilla Firefox](https://www.mozilla.org/firefox)
2. Open Firefox's __Add-ons Manager__ and open __Stop-It__ preferences: ![](https://github.com/stop-it/firefox-admin-addon/blob/master/doc/using-admin-screen1.png)
3. Select database file: ![](https://github.com/stop-it/firefox-admin-addon/blob/master/doc/using-admin-screen2.png)
4. After selecting database file should disapper exclamation badge on the add-on's toolbar button and you are ready to use it: ![](https://github.com/stop-it/firefox-admin-addon/blob/master/doc/using-admin-screen3.png)
