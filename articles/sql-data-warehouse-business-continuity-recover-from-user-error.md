<properties
   pageTitle="Recover a database from user error in SQL Data Warehouse | Microsoft Azure"
   description="Steps for recovering a database from user error in SQL Data Warehouse. "
   services="SQL Data Warehouse"
   documentationCenter="NA"
   authors="sahajs"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/22/2015"
   ms.author="sahajs"/>

# Recover a database from user error in SQL Data Warehouse

SQL Data Warehouse offers two core capabilities for recovering from user error that causes unintentional or incidental data corruption or deletion
- Point In Time Restore (for a live database)
- Restore deleted database
Both of these capabilities restore to a new database on the same logical server.

## Recovery with point in time restore
In the event of user error causing unintended data modification, Point In Time Restore can be used to restore the database to any of the restore points within your databases retention period. The database snapshots for a live database occur every 4 hours and are retained for 7 days to provide a set of 42 restore points.

### PowerShell
Use PowerShell to programmatically perform database restore.

After the restore has completed, you can configure your recovered database to be used by following the [Finalize a recovered database][] guide.

### REST API
Use REST to programmatically perform database restore.
1.	Get the database you want to restore using the Get Database operation.
2.	Get the list of database restore points using the Get Database Restore Points operation.
3.	Begin your restore by using the [Create database restore request][] operation.
4.	Track the status of your restore by using the [Database Operation Status][] operation.
After the restore has completed, you can configure your recovered database to be used by following the [Finalize a Recovered Database][] guide.

## Recover a deleted database
In the event a database is deleted, you can restore the deleted database to the time of deletion. Azure SQL Data Warehouse takes a database snapshot before the database is dropped and retains it for 7 days.

### PowerShell
Use PowerShell to programmatically perform a deleted database restore.

After the restore has completed, you can configure your recovered database to be used by following the [Finalize a Recovered Database][] guide.

### REST API
Use REST to programmatically perform database restore.

1.	List all of your restorable deleted databases by using the [List restorable dropped databases][] operation.
2.	Get the details for the deleted database you want to restore by using the [Get restorable dropped database][] operation.
3.	Begin your restore by using the [Create database restore request][] operation.
4.	Track the status of your restore by using the [Database operation status][] operation.

After the restore has completed, you can configure your recovered database to be used by following the [Finalize a recovered database][] guide.


## Next steps
To learn about the business continuity features of other Azure SQL Database editions, please read the [Azure SQL Database business continuity overview][].


<!--Image references-->

<!--Article references-->
[Azure SQL Database business continuity overview]: ./sql-database-business-continuity/
[Finalize a recovered database]: ./sql-database-recovered-finalize/


<!--MSDN references-->
[Create database restore request]: http://msdn.microsoft.com/library/azure/dn509571.aspx
[Database operation status]: http://msdn.microsoft.com/library/azure/dn720371.aspx
[Get restorable dropped database]: http://msdn.microsoft.com/library/azure/dn509574.aspx
[List restorable dropped databases]: http://msdn.microsoft.com/library/azure/dn509562.aspx




<!--Other Web references-->
