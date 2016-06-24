<properties
   pageTitle="Manage tables and indexes in Azure SQL Data Warehouse | Microsoft Azure"
   description="Overview of the considerations, best practices, and tasks for managing tables and indexes in Azure SQL Data Warehouse"
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/02/2016"
   ms.author="jrj;barbkess;sonyama"/>

# Manage tables and indexes in Azure SQL Data Warehouse

Overview of the considerations, best practices, and tasks for managing tables and indexes in SQL Data Warehouse.



| Category                | Task or consideration                           | Description  |
| :-----------------------| :---------------------------------------------- | :----------- |
| Columnstore indexes     | Rebuild indexes after loading or inserting data | By default, SQL Data Warehouse stores each table as a clustered columnstore index. This gives you better performance and data compression, especially for large tables. Depending on how you ingest data into the columnstore index, all of the data might not be stored with columnstore compression. When this happens you might not get the performance that columnstore indexes are designed to provide. <br/><br/>To make sure your columnstore indexes are in a healthy state, see [Manage columnstore indexes][]. |
| Hash distributed tables | Verify data is evenly distributed across the nodes | Hash distributed table are almost always the best way to optimize joins and aggregations on large tables. SQL Data Warehouse distributed the tables based on a specified distribution column. Some columns are good distribution keys and some are not. You want the rows to be evenly distributed. Some amount of unevenness, or data skew, is fine but if you have too much data skew, you will lose the benefits of the massively parallel process (MPP) SQL Data Warehouse is designed to provide.<br/><br/>To make sure your hash distributed tables don't have too much data skew, see [Manage distributed data skew][]. |





## Next Steps

For more management tips head over to the [Management overview][].

<!--Image references-->

<!--Article references-->
[Manage columnstore indexes]: sql-data-warehouse-manage-columnstore-indexes.md
[Manage distributed data skew]: sql-data-warehouse-manage-distributed-data-skew.md
[Management overview]: sql-data-warehouse-overview-manage.md

<!--MSDN references-->


<!--Other Web references-->