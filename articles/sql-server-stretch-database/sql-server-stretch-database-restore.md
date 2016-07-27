<properties
	pageTitle="Restore Stretch-enabled databases | Microsoft Azure"
	description="Learn how to restore Stretch\-enabled databases."
	services="sql-server-stretch-database"
	documentationCenter=""
	authors="douglaslMS"
	manager=""
	editor=""/>

<tags
	ms.service="sql-server-stretch-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/06/2016"
	ms.author="douglasl"/>

# Restore Stretch-enabled databases

Restore a backed up database when necessary to recover from many types of failures, errors, and disasters.

For more info about backup, see [Backup Stretch-enabled databases](sql-server-stretch-database-backup.md).

>   [AZURE.NOTE] Backup is only one part of a complete high availability and business continuity solution. For more info about high availability, see [High Availability Solutions](https://msdn.microsoft.com/library/ms190202.aspx).

## Restore your SQL Server data
To recover from hardware failure or corruption, restore the Stretch\-enabled SQL Server database from a backup. You can continue to use the SQL Server restore methods that you currently use. For more info, see [Restore and Recovery Overview](https://msdn.microsoft.com/library/ms191253.aspx).

After you restore the SQL Server database, you have to run the stored procedure **sys.sp_rda_reauthorize_db** to re-establish the connection between the Stretch\-enabled SQL Server database and the remote Azure database. For more info, see [Restore the connection between the SQL Server database and the remote Azure database](#Restore-the-connection-between-the-SQL-Server-database-and-the-remote-Azure-database). 
<!-- Fix Comment: The structure and the reference seeem to be incorrect. Could you check if they are okay? -->

## Restore your remote Azure data

### Recover a live Azure database
The SQL Server Stretch Database service on Azure snapshots all live data at least every 8 hours using Azure Storage Snapshots. These snapshots are maintained for 7 days. This allows you to restore the data to one of at least 21 points in time within the past 7 days up to the time when the last snapshot was taken.

To restore a live Azure database to an earlier point in time by using the Azure portal, do the following things.

1. Log in to the Azure portal.
2. On the left side of the screen select **BROWSE** and then select **SQL Databases**.
3. Navigate to your database and select it.
4. At the top of the database blade, click **Restore**.
5. Specify a new **Database name**, select a **Restore Point** and then click **Create**.
6. The database restore process will begin and can be monitored using **NOTIFICATIONS**.

### Recover a deleted Azure database
The SQL Server Stretch Database service on Azure takes a database snapshot before a database is dropped and retains it for 7 days. After this occurs, it no longer retains snapshots from the live database. This lets you restore a deleted database to the point when it was deleted.

To restore a deleted Azure database to the point when it was deleted by using the Azure portal, do the following things.

1. Log in to the Azure portal.
2. On the left side of the screen select **BROWSE** and then select **SQL Servers**.
3. Navigate to your server and select it.
4. Scroll down to Operations on your server's blade, click the **Deleted Databases** tile.
5. Select the deleted database you want to restore.
5. Specify a new **Database name** and click **Create**.
6. The database restore process will begin and can be monitored using **NOTIFICATIONS**.

## Restore the connection between the SQL Server database and the remote Azure database

1.  If you're going to connect to a restored Azure database with a different name or in a different region, run the stored procedure [sys.sp_rda_deauthorize_db](https://msdn.microsoft.com/library/mt703716.aspx) to disconnect from the previous Azure database.  

2.  Run the stored procedure [sys.sp_rda_reauthorize_db](https://msdn.microsoft.com/library/mt131016.aspx) to reconnect the local Stretch\-enabled database to the Azure database.  

	-   Provide the existing database scoped credential as a sysname or a varchar\(128\) value. \(Don't use varchar\(max\).\) You can look up the credential name in the view **sys.database\_scoped\_credentials**.  

	-   Specify whether to make a copy of the remote data and connect to the copy (recommended).  

    ```tsql  
    USE <Stretch-enabled database name>;
	GO
	EXEC sp_rda_reauthorize_db
	    @credential = N'<existing_database_scoped_credential_name>',
		@with_copy = 1 ;  
	GO
	```  

## See also

[Manage and troubleshoot Stretch Database](sql-server-stretch-database-manage.md)

[sys.sp_rda_reauthorize_db (Transact-SQL)](https://msdn.microsoft.com/library/mt131016.aspx)

[Back Up and Restore of SQL Server Databases](https://msdn.microsoft.com/library/ms187048.aspx)
