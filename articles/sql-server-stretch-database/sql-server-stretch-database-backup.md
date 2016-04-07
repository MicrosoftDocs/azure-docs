<properties
	pageTitle="Backup and restore Stretch-enabled databases | Microsoft Azure"
	description="Learn how to back up and restore Stretch\-enabled databases."
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
	ms.date="02/26/2016"
	ms.author="douglasl"/>


# Backup and restore Stretch-enabled databases

To back up and restore Stretch\-enabled databases, you can continue to use  the methods that you currently use. For more info about SQL Server backup and restore, see [Back Up and Restore of SQL Server Databases](https://msdn.microsoft.com/library/ms187048.aspx).

A backup of a Stretch\-enabled database is a shallow backup that does not include the data migrated to the remote server.

Stretch Database provides full support for point in time restore. After you restore your SQL Server database to a point in time and reauthorize the connection to Azure, Stretch Database reconciles the remote data to the same point in time. For more info about point in time restore in SQL Server, see [Restore a SQL Server Database to a Point in Time (Full Recovery Model)](https://msdn.microsoft.com/library/ms179451.aspx). For info about the stored procedure that you have to run after a restore to reauthorize the connection to Azure, see [sys.sp_rda_reauthorize_db (Transact-SQL)](https://msdn.microsoft.com/library/mt131016.aspx).

## <a name="Reconnect"></a>Restore a Stretch\-enabled database from a backup

1.  Restore the database from a backup.

2.  Create a database master key for the Stretch\-enabled database. For more info, see [CREATE MASTER KEY (Transact-SQL)](https://msdn.microsoft.com/library/ms174382.aspx)

3.  Create a database scoped credential for the Stretch\-enabled database. For more info, see [CREATE DATABASE SCOPED CREDENTIAL (Transact-SQL)](https://msdn.microsoft.com/library/mt270260.aspx).

4.  Run the stored procedure [sys.sp_rda_reauthorize_db (Transact-SQL)](https://msdn.microsoft.com/library/mt131016.aspx) to reconnect the local Stretch\-enabled database to Azure. Provide the database scoped credential created in a previous step as a sysname or a varchar(128) value. (Don't use varchar(max).)

    ```tsql
    Declare @credentialName nvarchar(128);
    SET @credentialName = N’<database_scoped_credential_name_created_previously>’;
    EXEC sp_rda_reauthorize_db @credentialName;
    ```

## <a name="MoreInfo"></a>More info about backup and restore
Backups on a database with Stretch Database enabled contain only local data and eligible data at the point in time when the backup runs. These backups also contain information about the remote endpoint where the database’s remote data resides. This is known as a "shallow backup". Deep backups that contain all data in the database, both local and remote, are not supported.

![Stretch Database backup diagram][StretchBackupImage1]

When you restore a backup of a database with Stretch Database enabled, this operation restores the local data and eligible data to the database as expected. (Eligible data is data that has not yet been moved, but will be moved to Azure based on the Stretch Database configuration of the tables.) After the restore operation runs, the database contains local and eligible data from the point when the backup ran, but it does not have the required credentials and artifacts to connect to the remote endpoint.

![Stretch Database after backup][StretchBackupImage2]

You have to run the stored procedure **sys.sp\_rda\_reauthorize\_db** to re\-establish the connection between the local database and its remote endpoint. Only a db\_owner can perform this operation. This stored procedure also requires the remote endpoint’s administrator user name and password. This means that you have to provide the administrator login and password for the target Azure server.

![Stretch Database after backup][StretchBackupImage3]

After you re\-establish the connection, Stretch Database attempts to reconcile eligible data in the local database with remote data by creating a copy of the remote data on the remote endpoint and linking it with the local database. This process is automatic and requires no user intervention. After this reconciliation runs, the local database and the remote endpoint are in a consistent state.

![Stretch Database after backup][StretchBackupImage4]

## See also

[Manage and troubleshoot Stretch Database](sql-server-stretch-database-manage.md)

[sys.sp_rda_reauthorize_db (Transact-SQL)](https://msdn.microsoft.com/library/mt131016.aspx)

[Back Up and Restore of SQL Server Databases](https://msdn.microsoft.com/library/ms187048.aspx)

<!--Image references-->
[StretchBackupImage1]: ./media/sql-server-stretch-database-backup/StretchDBBackup1.png
[StretchBackupImage2]: ./media/sql-server-stretch-database-backup/StretchDBBackup2.png
[StretchBackupImage3]: ./media/sql-server-stretch-database-backup/StretchDBBackup3.png
[StretchBackupImage4]: ./media/sql-server-stretch-database-backup/StretchDBBackup4.png
