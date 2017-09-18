--
title: Elastic Query Concepts with SQL Data Warehouse | Microsoft Docs
description: 'Elastic Query concepts with SQL Data Warehouse '
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
editor: ''

ms.assetid: e2dc8f3f-10e3-4589-a4e2-50c67dfcf67f
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: integrate
ms.date: 09/18/2017
ms.author: elbutter

--

# Elastic Query Concepts with SQL Data Warehouse



Elastic Query with Azure SQL Data Warehouse allows you to write Transact-SQL in a SQL Database that is sent remotely to a Azure SQL Data Warehouse instance through the use of external tables. A remote external table definition is created in a SQL database instance which points to a table in the SQL database warehouse.

When you use a query that uses an external table, the portion of the query query referring to the external table is sent to the SQL data warehouse instance to be processed. Once the query has completed, the result set is sent back to the calling SQL database instance. For a brief tutorial of 





This feature enables two primary scenarios:

1. Domain isolation
2. Remote query execution

### Domain isolation

Domain isolation refers to the classic data mart scenario. In certain cases, one may want to provide a logical domain of data to downstream users which are isolated from the rest of the data warehouse.  This can occur for a variety of reasons including but not limited to:

1. Resource Isolation - SQL database is optimized to serve a large base of concurrent users serving slightly different workloads than the large analytical queries that the data warehouse is reserved for. Isolation ensures the right workloads are served by the right tools.
2. Security isolation - to separate an authorized data subset selectively via certain schemas.
3. Sandboxing - provide a sample set of data as a "playground" to explore production queries etc.

Elastic query can provide the ability to easily select subsets of SQL data warehouse data and move it into a SQL database instance. Furthermore this isolation does not preclude the ability to also enable Remote query execution allowing for more interesting "cache" scenarios.

### Remote query execution

Elastic query allows for remote query execution on a SQL data warehouse instance. This means that you can get the best of both SQL database and SQL data warehouse by separating your hot and cold data between the two databases. Users can keep more recent years of data within a SQL database which can serve reports and large numbers of average business users. However, when more data or computation is needed, a user can offload part of the query to a SQL data warehouse instance where large scale aggregates can be processed much faster and more efficiently.

 

## Best Practices

### General

- When using remote query execution, ensure you're only selecting necessary columns and applying the right filters. Not only does this increase the compute necessary, but it also increases the size of the result set and therefore the amount of data that need to be moved between the two instances.
- ​



<!--Image references-->

<!--Article references-->

[SQL Data Warehouse development overview]: ./sql-data-warehouse-overview-develop/
[SQL Data Warehouse integration overview]: ./sql-data-warehouse-overview-integration/

<!--MSDN references-->

<!--Other Web references-->