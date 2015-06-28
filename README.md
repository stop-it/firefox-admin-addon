# Stop-It Administration Add-on

Simple add-on for managing [Stop-It](http://stop-it.be/) database with blocked URLs.

__NOTE__: The database self is __NOT__ included - if you don't have one you have to create it at the first place!

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
