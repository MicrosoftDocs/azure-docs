
<!--
includes/sql-data-warehouse-backup-retention-policies.md

Latest Freshness check:  2016-05-05 , barbkess.

As of circa 2016-04-22, the following topics might include this include:
articles/sql-data-warehouse/sql-data-warehouse-overview-expectations.md
articles/sql-data-warehouse/sql-data-warehouse-overview-backup-and-restore.md
-->
SQL Data Warehouse snapshots all live data at least every 8 hours using Azure Storage Snapshots. These snapshots are maintained for 7 days. This allows you to restore the data to one of at least 21 points in time within the past 7 days up to the time when the last snapshot was taken. 

SQL Data Warehouse takes a database snapshot before a database is dropped and retains it for 7 days. When this occurs, it no longer retains snapshots from the live database. This allows you to restore a deleted database to the point when it was deleted.

SQL Data Warehouse copies snapshots asynchronously to a different geographical Azure region for added recoverability in case of a regional failure. If you cannot access your database because of a failure in an Azure region, you can restore your database to one of the geo-redundant snapshots.
