---
title: Migrate your solution to SQL Data Warehouse | Microsoft Docs
description: Migration guidance for bringing your solution to Azure SQL Data Warehouse platform.
services: sql-data-warehouse
author: jrowlandjones
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: implement
ms.date: 04/17/2018
ms.author: jrj
ms.reviewer: igorstan
---

# Migrate your solution to Azure SQL Data Warehouse
See what's involved in migrating an existing database solution to Azure SQL Data Warehouse. 

## Profile your workload
Before migrating, you want to be certain SQL Data Warehouse is the right solution for your workload. SQL Data Warehouse is a distributed system designed to perform analytics on large data.  Migrating to SQL Data Warehouse requires some design changes that are not too hard to understand but might take some time to implement. If your business requires an enterprise-class data warehouse, the benefits are worth the effort. However, if you don't need the power of SQL Data Warehouse, it is more cost-effective to use SQL Server or Azure SQL Database.

Consider using SQL Data Warehouse when you:
- Have one or more Terabytes of data
- Plan to run analytics on large amounts of data
- Need the ability to scale compute and storage 
- Want to save costs by pausing compute resources when you don't need them.

Don't use SQL Data Warehouse for operational (OLTP) workloads that have:
- High frequency reads and writes
- Large numbers of singleton selects
- High volumes of single row inserts
- Row by row processing needs
- Incompatible formats (JSON, XML)


## Plan the migration

Once you have decided to migrate an existing solution to SQL Data Warehouse, it is important to plan the migration before getting started. 

One goal of planning is to ensure your data, your table schemas, and your code are compatible with SQL Data Warehouse. There are some compatibility differences to work around between your current system and SQL Data Warehouse. Plus, migrating large amounts of data to Azure takes time. Careful planning expedites getting your data to Azure. 

Another goal of planning is to make design adjustments to ensure your solution takes advantage of the high query performance SQL Data Warehouse is designed to provide. Designing data warehouses for scale introduces different design patterns and so traditional approaches aren't always the best. Although you can make some design adjustments after migration, making changes sooner in the process will save time later.

To perform a successful migration, you need to migrate your table schemas, your code, and your data. For guidance on these migration topics, see:

-  [Migrate your schemas](sql-data-warehouse-migrate-schema.md)
-  [Migrate your code](sql-data-warehouse-migrate-code.md)
-  [Migrate your data](sql-data-warehouse-migrate-data.md). 

<!--
## Perform the migration


## Deploy the solution


## Validate the migration

-->

## Next steps
The CAT (Customer Advisory Team) also has some great SQL Data Warehouse guidance, which they publish through blogs.  Take a look at their article, [Migrating data to Azure SQL Data Warehouse in practice][Migrating data to Azure SQL Data Warehouse in practice] for additional guidance on migration.

<!--Image references-->

<!--Article references-->

<!--MSDN references-->

<!--Other Web references-->
[Migrating data to Azure SQL Data Warehouse in practice]: https://blogs.msdn.microsoft.com/sqlcat/2016/08/18/migrating-data-to-azure-sql-data-warehouse-in-practice/
