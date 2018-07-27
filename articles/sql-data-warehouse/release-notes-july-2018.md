---
title: Azure SQL Data Warehouse Release Notes June 2018 | Microsoft Docs
description: Release notes for Azure SQL Data Warehouse.
services: sql-data-warehouse
author: twounder
manager: craigg-msft
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 07/23/2018
ms.author: twounder
ms.reviewer: twounder
---

# What's new in Azure SQL Data Warehouse? July 2018
Azure SQL Data Warehouse receives improvements continually. This article describes the new features and changes that have been introduced in July 2018.


## Finer granularity for cross region and server restores
You can now restore across regions and servers using any restore point instead of selecting geo redundant backups that are taken every 24 hours. Cross region and server restore are supported for both user-defined or automatic restore points enabling finer granularity for additional data protection. With more restore points available, you can be assured that your data warehouse will be logically consistent when restoring across regions.

![Restore Command - Azure SQL Data Warehouse](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/6ac23972-9ec0-4502-ab10-7b6bc1a3d947.png)
![Restoration Options - Azure SQL Data Warehouse](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/6c63bd0e-9c52-414d-b4be-d3bd3774ee08.png)

For more information, see the [Accelerated and Flexible Restore Points](https://azure.microsoft.com/blog/accelerated-and-flexible-restore-points-with-sql-data-warehouse/) blog post.

## 20 Minute Restorations
SQL Data Warehouse now offers restoration of any data warehouse is **less than 20 minutes** within the same region regardless of the database size. The restoration time applies whether the restoration is to the same or a different logical server within the same region. In addition, the snapshot process has been improved to reduce the amount of time it takes to create a restore point. In lower performance levels (lower DWU settings), the improvement is a *2x reduction* in time for snapshot creation.

For more information, see the [Accelerated and Flexible Restore Points](https://azure.microsoft.com/blog/accelerated-and-flexible-restore-points-with-sql-data-warehouse/) blog post.

## Custom Restoration Configurations
You can now change your performance level (DWU) when restoring in the Azure portal. You can also restore to an upgraded Gen2 data warehouse. By restoring to a Gen 2 instance, you can now evaluate the impact of Gen2 before [upgrading your Gen1 data warehouse](https://docs.microsoft.com/azure/sql-data-warehouse/upgrade-to-latest-generation).

![Custom Restoration Configuration - Azure SQL Data Warehouse](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/f4c410c7-8515-409c-a983-0976792b8628.png)

## SP_DESCRIBE_UNDECLARED_PARAMETERS
The [sp_describe_undeclared_parameters](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-describe-undeclared-parameters-transact-sql) stored procedure is often used by tools to obtain metadata about parameters in Transact-SQL batch. The procedure returns one row for each parameter in the batch with the deduced type information for that parameter. 

```sql
EXEC sp_describe_undeclared_parameters
    @tsql = 
    N'SELECT
        object_id, name, type_desc
      FROM
        sys.indexes
      WHERE
        object_id = @id;'
```

The resultset includes metadata about the `@id` parameter (partial results shown)
```
parameter_ordinal | name | suggested_system_type_id | suggested_system_type_name
--------------------------------------------------------------------------------
1                 | @id  | 56                       | int
```

## Next steps
Now that you know a bit about SQL Data Warehouse, learn how to quickly [create a SQL Data Warehouse][create a SQL Data Warehouse] and [load sample data][load sample data]. If you are new to Azure, you may find the [Azure glossary][Azure glossary] helpful as you encounter new terminology. Or look at some of these other SQL Data Warehouse Resources.  

* [Customer success stories]
* [Blogs]
* [Feature requests]
* [Videos]
* [Customer Advisory Team blogs]
* [Stack Overflow forum]
* [Twitter]


[Blogs]: https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/
[Customer Advisory Team blogs]: https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/
[Customer success stories]: https://azure.microsoft.com/case-studies/?service=sql-data-warehouse
[Feature requests]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[Stack Overflow forum]: http://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse
