---
title: Migrate your solution to SQL Data Warehouse | Microsoft Docs
description: Migration guidance for bringing your solution to Azure SQL Data Warehouse platform.
services: sql-data-warehouse
documentationcenter: NA
author: sqlmojo
manager: jhubbard
editor: ''

ms.assetid: 198365eb-7451-4222-b99c-d1d9ef687f1b
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: migrate
ms.date: 10/31/2016
ms.author: joeyong;barbkess

---
# Migrate your solution to Azure SQL Data Warehouse
This overview explains what is involved in migrating an existing database solution to Azure SQL Data Warehouse. 


## Profile your workload
Before migrating, you want to be certain SQL Data Warehouse is the right solution for your workload. SQL Data Warehouse is a distributed system designed to perform analytics on large data.  Migrating to SQL Data Warehouse requires some design changes which are not too hard to understand but will take some time to implement. The benefits are worth it if your business requires an enterprise-class data warehouse. However, if you don't need the power of SQL Data Warehouse, it will be more more cost-effective for you to use SQL Server or Azure SQL Database.

Consider using SQL Data Warehouse when you:
- Have one or more Terabytes of data
- Want to gain insights quickly by running analytics on large amounts of data
- Need the ability to scale compute and storage 
- Want to save costs by pausing compute resources when you don't need them.

Don't use SQL Data Warehouse for operational (OLTP) workloads that have:
- High frequency reads and writes.
- Large numbers of singleton selects.
- High volumes of single row inserts.
- Row by row processing needs.
- Incompatible formats (JSON, XML).


## Plan the migration

Once you have decided to migrate an existing solution to SQL Data Warehouse, it is important to plan the migration before getting started. 

One goal of planning is to ensure your data, your table schemas, and your code are compatible with SQL Data Warehouse. There are some compatibility differences to workaround between your current system and SQL Data Warehous. Plus, migrating large amounts of data to Azure takes time. Careful planning will expedite getting your data to Azure if it is not there already. 

Another goal of planning is to make design adjustments to ensure your solution takes advantage of the high query performance SQL Data Warehouse is designed to provide. Designing data warehouses for scale introduces different design patterns and so traditional approaches aren't always the best. Although you can make some design adjustments after migration, making changes sooner in the process will save time later.


To perform a successful migration, you need to plan for migrating your table schemas, your code, and your data. For guidance on these migration topics, see:

-  [Migrate your schemas](sql-data-warehouse-migrate-schema.md)
-  [Migrate your code](sql-data-warehouse-migrate-code.md)
-  [Migrate your data](sql-data-warehouse-migrate-data). 

## Perform the migration


## Deploy the solution



## Next steps
The CAT (Customer Advisory Team) also has some great SQL Data Warehouse guidance which they publish through blogs.  Take a look at their article, [Migrating data to Azure SQL Data Warehouse in practice][Migrating data to Azure SQL Data Warehouse in practice] for additional guidance on migration.

<!--Image references-->

<!--Article references-->
[Migrate your schema]: sql-data-warehouse-migrate-schema.md
[Migrate your data]: sql-data-warehouse-migrate-data.md
[Migrate your code]: sql-data-warehouse-migrate-code.md


<!--MSDN references-->


<!--Other Web references-->
[Migrating data to Azure SQL Data Warehouse in practice]: https://blogs.msdn.microsoft.com/sqlcat/2016/08/18/migrating-data-to-azure-sql-data-warehouse-in-practice/
