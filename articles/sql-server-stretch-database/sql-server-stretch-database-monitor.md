<properties
	pageTitle="Monitor and troubleshoot data migration (Stretch Database) | Microsoft Azure"
	description="Learn how to monitor the status of data migration."
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
	ms.date="06/14/2016"
	ms.author="douglasl"/>

# Monitor and troubleshoot data migration (Stretch Database)

To monitor data migration in Stretch Database Monitor, select **Tasks | Stretch | Monitor** for a database in SQL Server Management Studio .

## Check the status of data migration in the Stretch Database Monitor
Select **Tasks | Stretch | Monitor** for a database in SQL Server Management Studio to open Stretch Database Monitor and monitor data migration.

-   The top portion of the monitor displays general information about both the Stretch\-enabled SQL Server database and the remote Azure database.

-   The bottom portion of the monitor displays the status of data migration for each Stretch\-enabled table in the database.

![Stretch Database Monitor][StretchMonitorImage1]

## <a name="Migration"></a>Check the status of data migration in a dynamic management view
Open the dynamic management view **sys.dm\_db\_rda\_migration\_status** to see how many batches and rows of data have been migrated. For more info, see [sys.dm_db_rda_migration_status (Transact-SQL)](https://msdn.microsoft.com/library/dn935017.aspx).

## <a name="Firewall"></a>Troubleshoot data migration

**Rows from my Stretch-enabled table are not being migrated to Azure. What’s the problem?**

There are several problems that can affect migration. Check the following things.

-   Check network connectivity for the SQL Server computer.

-   Check that the Azure firewall is not blocking your SQL Server from connecting to the remote endpoint.

-   Check the dynamic management view **sys.dm\_db\_rda\_migration\_status** for the status of the latest batch. If an error has occurred, check the error\_number, error\_state, and error\_severity values for the batch.

    -   For more info about the view, see [sys.dm_db_rda_migration_status (Transact-SQL)](https://msdn.microsoft.com/library/dn935017.aspx).

    -   For more info about the content of a SQL Server error message, see [sys.messages (Transact-SQL)](https://msdn.microsoft.com/library/ms187382.aspx).

**The Azure firewall is blocking connections from my local server.**

You may have to add a rule in the Azure firewall settings of the Azure server to let SQL Server communicate with the remote Azure server.

## See Also

[Manage and troubleshoot Stretch Database](sql-server-stretch-database-manage.md)

<!--Image references-->
[StretchMonitorImage1]: ./media/sql-server-stretch-database-monitor/StretchDBMonitor.png
