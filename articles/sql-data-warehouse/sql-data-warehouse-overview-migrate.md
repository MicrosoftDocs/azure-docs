---
title: Migrate your solution to SQL Data Warehouse | Microsoft Docs
description: Migration guidance for bringing your solution to Azure SQL Data Warehouse platform.
services: sql-data-warehouse
documentationcenter: NA
author: barbkess
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
ms.author: jrj;barbkess

---
# Migrate your solution to SQL Data Warehouse
SQL Data Warehouse is a distributed database system that elastically scales to meet your needs. To maintain both performance and scale, not all features within SQL Server are implemented inside SQL Data Warehouse. The following migration topics touch on some of the key factors for migrating your solution to SQL Data Warehouse. Designing data warehouses for scale introduces different design patterns and so traditional approaches aren't always the best. You may therefore find that adapting your existing solution ensures you take full advantage of the distributed platform provided by SQL Data Warehouse.

It is also important to remember that SQL Data Warehouse is a platform based in Microsoft Azure. Therefore part of your migration may well include transferring your data to the cloud. Data transfer is a subject in its own right and should be carefully considered; especially as volumes increase. Data transfer and data loading are discrete topics.

## Migration guidance
Make sure you have read through these articles to ensure you understand some of the product differences and fundamental concepts before embarking on your migration.

* [Migrate your schema][Migrate your schema]
* [Migrate your data][Migrate your data]
* [Migrate your code][Migrate your code]

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
