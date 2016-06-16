<properties
   pageTitle="Manage compute power in Azure SQL Data Warehouse (REST) | Microsoft Azure"
   description="Transact-SQL (T-SQL) tasks to scale-out performance by adjusting DWUs. Save costs by scaling back during non-peak times."
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
   ms.date="05/06/2016"
   ms.author="barbkess;sonyama"/>

# Manage compute power in Azure SQL Data Warehouse (T-SQL)

> [AZURE.SELECTOR]
- [Overview](sql-data-warehouse-manage-compute-overview.md)
- [Portal](sql-data-warehouse-manage-compute-portal.md)
- [PowerShell](sql-data-warehouse-manage-compute-powershell.md)
- [REST](sql-data-warehouse-manage-compute-rest-api.md)
- [TSQL](sql-data-warehouse-manage-compute-tsql.md)


Scale performance by scaling out compute resources and memory to meet the changing demands of your workload. Save costs by scaling back resources during non-peak times or pausing compute altogether. 

This collection of tasks uses T-SQL to:

- View current DWU settings
- Change compute resources by adjusting DWUs

To pause or resume a database, choose one of the other platform options at the top of this article.

To learn about this, see [Manage compute power overview][].

<a name="current-dwu-bk"></a>

## View current DWU settings

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

<a name="scale-dwu-bk"></a>
<a name="scale-compute-bk"></a>

## Scale compute

[AZURE.INCLUDE [SQL Data Warehouse scale DWUs description](../../includes/sql-data-warehouse-scale-dwus-description.md)]

To change the DWUs:


1. Connect to the master database associated with your logical SQL Database server.
2. Use the [ALTER DATABASE][] TSQL statement. The following example sets the service level objective to DW1000 for the database MySQLDW. 

```Sql
ALTER DATABASE MySQLDW
MODIFY (SERVICE_OBJECTIVE = 'DW1000')
;
```

<a name="next-steps-bk"></a>

## Next steps

For other management tasks, see [Management overview][].

<!--Image references-->

<!--Article references-->
[Service capacity limits]: ./sql-data-warehouse-service-capacity-limits.md
[Management overview]: ./sql-data-warehouse-overview-manage.md
[Manage compute power overview]: ./sql-data-warehouse-manage-compute-overview.md

<!--MSDN references-->

[ALTER DATABASE]: https://msdn.microsoft.com/library/mt204042.aspx


<!--Other Web references-->

[Azure portal]: http://portal.azure.com/
