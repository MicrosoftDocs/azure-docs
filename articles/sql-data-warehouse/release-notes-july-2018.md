---
title: Azure SQL Data Warehouse Release Notes July 2018 | Microsoft Docs
description: Release notes for Azure SQL Data Warehouse.
services: sql-data-warehouse
author: twounder
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 08/06/2018
ms.author: twounder
ms.reviewer: twounder
---

# What's new in Azure SQL Data Warehouse? July 2018
Azure SQL Data Warehouse receives improvements continually. This article describes the new features and changes that have been introduced in July 2018.

## Lightning fast query performance
[Azure SQL Data Warehouse](https://aka.ms/sqldw) sets new performance benchmarks with the introduction of Instant Data Access that improves shuffle operations. Instant Data Access reduces the overhead for data movement operations by using direct SQL Server to SQL Server native data operations. The integration with the SQL Server engine directly for data movement means that SQL Data Warehouse is now **67% faster than Amazon Redshift** using a workload derived from the well-recognized industry standard [TPC Benchmark™ H (TPC-H)](http://www.tpc.org/tpch/).

![Azure SQL Data Warehouse is faster and cheaper than Amazon Redshift](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/eb3b908a-464d-4847-b384-9f296083a737.png)
<sub>Source: [Gigaom Research Analyst Report: Data Warehouse in the Cloud Benchmark](https://gigaom.com/report/data-warehouse-in-the-cloud-benchmark/)</sub>

Beyond runtime performance, the [Gigaom Research](https://gigaom.com/report/data-warehouse-in-the-cloud-benchmark/) report also measured the price-performance ratio to quantify the USD cost of specific workloads. SQL Data Warehouse was **at least 23 percent less expensive** than Redshift for 30TB workloads. With SQL Data Warehouse’s ability to scale compute elastically as well as pause and resume workloads, customers pay only when the service is in use, further decreasing their costs.
![Azure SQL Data Warehouse is faster and cheaper than Amazon Redshift](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/cb76447e-621e-414b-861e-732ffee5345a.png)
<sub>Source: [Gigaom Research Analyst Report: Data Warehouse in the Cloud Benchmark](https://gigaom.com/report/data-warehouse-in-the-cloud-benchmark/)</sub>

### Query concurrency
SQL Data Warehouse also ensures that data is accessible across your organizations. Microsoft has enhanced the service to support 128 concurrent queries so that more users can query the same database and not get blocked by other requests. In comparison, Amazon Redshift restricts maximum concurrent queries to 50, limiting data access within the organization.

SQL Data Warehouse delivers these query performance and query concurrency gains without any price increase and building upon its unique architecture with decoupled storage and compute.

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
## SP_REFRESHSQLMODULE
The [sp_refreshsqlmodule](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-refreshsqlmodule-transact-sql) stored procedure updates the metadata for a database object if the underlying metadata has become outdated due to changes of the underlying objects. This can occur if the base tables for a view are altered and the view hasn't been recreated. This saves you the step of dropping and recreating dependent objects.

The example below shows a view that becomes stale due to the underlying table change. You'll notice that the data is correct for the first column change (1 to Mollie) but the column name is invalid and the second column is not present. 
```sql
CREATE TABLE base_table (Id INT);
GO

INSERT INTO base_table (Id) VALUES (1);
GO

CREATE VIEW base_view AS SELECT * FROM base_table;
GO

SELECT * FROM base_view;
GO

-- Id
-- ----
-- 1

DROP TABLE base_table;
GO

CREATE TABLE base_table (fname VARCHAR(10), lname VARCHAR(10));
GO

INSERT INTO base_table (fname, lname) VALUES ('Mollie', 'Gallegos');
GO

SELECT * FROM base_view;
GO

-- Id
-- ----------
-- Mollie

EXEC sp_refreshsqlmodule @Name = 'base_view';
GO

SELECT * FROM base_view;
GO

-- fname     | lname
-- ---------- ----------
-- Mollie    | Gallegos
```

## Next steps
Now that you know a bit about SQL Data Warehouse, learn how to quickly [create a SQL Data Warehouse][create a SQL Data Warehouse]. If you are new to Azure, you may find the [Azure glossary][Azure glossary] helpful as you encounter new terminology. Or look at some of these other SQL Data Warehouse Resources.  

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
[create a SQL Data Warehouse]: ./create-data-warehouse-portal.md
[Azure glossary]: ../azure-glossary-cloud-terminology.md
