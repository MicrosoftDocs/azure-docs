---
title: Pause, resume, scale with T-SQL in Azure SQL Data Warehouse | Microsoft Docs
description: Transact-SQL (T-SQL) tasks to scale-out performance by adjusting DWUs. Save costs by scaling back during non-peak times.
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: jhubbard
editor: ''

ms.assetid: a970d939-2adf-4856-8a78-d4fe8ab2cceb
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.date: 03/30/2017
ms.author: elbutter;barbkess

---
# Manage compute power in Azure SQL Data Warehouse (T-SQL)
> [!div class="op_single_selector"]
> * [Overview](sql-data-warehouse-manage-compute-overview.md)
> * [Portal](sql-data-warehouse-manage-compute-portal.md)
> * [PowerShell](sql-data-warehouse-manage-compute-powershell.md)
> * [REST](sql-data-warehouse-manage-compute-rest-api.md)
> * [TSQL](sql-data-warehouse-manage-compute-tsql.md)
>
>

<a name="current-dwu-bk"></a>

## View current DWU settings
To view the current DWU settings for your databases:

1. Open SQL Server Object Explorer in Visual Studio.
2. Connect to the master database associated with the logical SQL Database server.
3. Select from the sys.database_service_objectives dynamic management view. Here is an example: 

```sql
SELECT
	db.name [Database]
,	ds.edition [Edition]
,	ds.service_objective [Service Objective]
FROM
 	sys.database_service_objectives ds
JOIN
	sys.databases db ON ds.database_id = db.database_id
```

<a name="scale-dwu-bk"></a>
<a name="scale-compute-bk"></a>

## Scale compute
[!INCLUDE [SQL Data Warehouse scale DWUs description](../../includes/sql-data-warehouse-scale-dwus-description.md)]

To change the DWUs:

1. Connect to the master database associated with your logical SQL Database server.
2. Use the [ALTER DATABASE][ALTER DATABASE] TSQL statement. The following example sets the service level objective to DW1000 for the database MySQLDW. 

```Sql
ALTER DATABASE MySQLDW
MODIFY (SERVICE_OBJECTIVE = 'DW1000')
;
```

<a name="check-database-state-bk"></a>

## Check database state and operation progress

1. Connect to the master database associated with your logical SQL Database server.
2. Submit query to check database state

```sql
SELECT *
FROM
sys.databases
```

3. Submit query to check status of operation

```sql
SELECT *
FROM
	sys.dm_operation_status
WHERE
	resource_type_desc = 'Database'
AND 
	major_resource_id = 'MySQLDW'
```

This DMV will return information about various management operations on your SQL Data Warehouse such as the operation and the state of the operation, which will either be IN_PROGRESS or COMPLETED.



<a name="next-steps-bk"></a>

## Next steps
For other management tasks, see [Management overview][Management overview].

<!--Image references-->

<!--Article references-->
[Service capacity limits]: ./sql-data-warehouse-service-capacity-limits.md
[Management overview]: ./sql-data-warehouse-overview-manage.md
[Manage compute power overview]: ./sql-data-warehouse-manage-compute-overview.md

<!--MSDN references-->

[ALTER DATABASE]: https://msdn.microsoft.com/library/mt204042.aspx


<!--Other Web references-->

[Azure portal]: http://portal.azure.com/
