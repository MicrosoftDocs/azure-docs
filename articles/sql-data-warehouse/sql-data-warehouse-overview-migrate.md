<properties
   pageTitle="Migrate your solution to SQL Data Warehouse | Microsoft Azure"
   description="Migration guidance for bringing your solution to Azure SQL Data Warehouse platform."
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
   ms.date="08/17/2016"
   ms.author="barbkess;jrj;sonyama"/>

# Migrate your solution to SQL Data Warehouse

SQL Data Warehouse is a distributed database system that elastically scales to meet your needs. To maintain both performance and scale, not all features within SQL Server are implemented inside SQL Data Warehouse. The following migration topics touch on some of the key factors for migrating your solution to SQL Data Warehouse. Designing data warehouses for scale introduces different design patterns and so traditional approaches aren't always the best. You may therefore find that adapting your existing solution ensures you take full advantage of the distributed platform provided by SQL Data Warehouse.

It is also important to remember that SQL Data Warehouse is a platform based in Microsoft Azure. Therefore part of your migration may well include transferring your data to the cloud. Data transfer is a subject in its own right and should be carefully considered; especially as volumes increase. Data transfer and data loading are discrete topics.

## Migration guidance
Make sure you have read through these articles to ensure you understand some of the product differences and fundamental concepts before embarking on your migration.

- [Migrate your schema][]
- [Migrate your data][]
- [Migrate your code][]

## Next steps
For additional development tips, see the [development overview][].

You can also view the [Transact-SQL reference][] for even more information.

Finally, check out the [loading overview][]. That article discusses various data loading options and provides step by step guidance.

<!--Image references-->

<!--Article references-->
[Migrate your schema]: sql-data-warehouse-migrate-schema.md
[Migrate your data]: sql-data-warehouse-migrate-data.md
[Migrate your code]: sql-data-warehouse-migrate-code.md

[development overview]: sql-data-warehouse-overview-develop.md
[loading overview]: sql-data-warehouse-overview-load.md
[Transact-SQL reference]: sql-data-warehouse-overview-reference.md

<!--MSDN references-->


<!--Other Web references-->
