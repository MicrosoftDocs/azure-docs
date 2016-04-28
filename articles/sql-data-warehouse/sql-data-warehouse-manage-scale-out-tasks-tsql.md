<properties
pageTitle="Performance scalability tasks for Azure SQL Data Warehouse | Microsoft Azure"
   description="TSQL tasks to scale out performance for Azure SQL Data Warehouse. Use TSQL to change compute resources by adjusting DWUs."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="04/27/2016"
   ms.author="barbkess;sonyama"/>

# Performance scalability tasks for Azure SQL Data Warehouse

> [AZURE.SELECTOR]
- [Overview](sql-data-warehouse-overview-scalability.md)
- [Azure portal](sql-data-warehouse-manage-scale-out-tasks.md)
- [PowerShell](sql-data-warehouse-manage-scale-out-tasks-powershell.md)
- [REST](sql-data-warehouse-manage-scale-out-tasks-rest-api.md)
- [TSQL](sql-data-warehouse-manage-scale-out-tasks-tsql.md)


Elastically scale out compute resources and memory to meet the changing demands of your workload, and save costs by scaling back resources during non-peak times. 

This collection of tasks uses TSQL to:

- View current DWU settings
- Change compute resources by adjusting DWUs

To pause or resume a database, choose one of the other platform options at the top of this article.

## Task 1: View current DWU settings

To view the current DWU settings for your databases:

1. Open SQL Server Object Explorer in Visual Studio 2015.
2. Connect to the master database associated with the logical SQL Database server.
2. Select from the sys.database_service_objectives dynamic management view. Here is an example: 

```
SELECT
 db.name [Database],
 ds.edition [Edition],
 ds.service_objective [Service Objective]
FROM
 sys.database_service_objectives ds
 JOIN sys.databases db ON ds.database_id = db.database_id
```

## Task 2: Scale DWUs

[AZURE.INCLUDE [SQL Data Warehouse scale DWUs description](../../includes/sql-data-warehouse-scale-dwus-description.md)]

To change the DWUs:


1. Connect to the master database associated with your logical SQL Database server.
2. Use the [ALTER DATABASE][] TSQL statement. The following example sets the service level objective to DW1000 for the database MySQLDW. 

```Sql
ALTER DATABASE MySQLDW
MODIFY (SERVICE_OBJECTIVE = 'DW1000')
;
```

## Next steps

For other management tasks, see [Management overview][].

<!--Image references-->

<!--Article references-->
[Service capacity limits]: ./sql-data-warehouse-service-capacity-limits.md
[Management overview]: ./sql-data-warehouse-overview-manage.md
[Performance scalability overview]: ./sql-data-warehouse-overview-scalability.md

<!--MSDN references-->

[ALTER DATABASE]: https://msdn.microsoft.com/library/mt204042.aspx


<!--Other Web references-->

[Azure portal]: http://portal.azure.com/
