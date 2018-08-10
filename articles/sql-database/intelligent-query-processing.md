---
title: "Intelligent query processing in Microsoft SQL databases | Microsoft Docs"
description: "Intelligent query processing features to improve query performance in SQL Server and Azure SQL Database."
ms.custom: ""
ms.date: "07/25/2018"
ms.prod: 
services: sql-database
ms.service: sql-database
ms.prod_service: "database-engine, sql-database"
ms.reviewer: "carlrab"
ms.suite: "sql"
ms.technology: 
ms.tgt_pltfrm: ""
ms.topic: conceptual
helpviewer_keywords: 
ms.assetid: 
author: "joesackmsft"
ms.author: "josack"
manager: craigg
monikerRange: "=azuresqldb-current||=sqlallproducts-allversions||
---
# Intelligent query processing in SQL databases

The **Intelligent query processing** feature family includes features with broad impact that improve the performance of existing workloads with minimal implementation effort.

![Intelligent Query Processing Features](./intelligent-query-processing/1_IQPFeatureFamily.png)

## Adaptive Query Processing
The adaptive query processing feature family includes query processing improvements that adapt optimization strategies to your application workload’s runtime conditions. These improvements included: batch mode adaptive joins, memory grant feedback, and interleaved execution for multi-statement table-valued functions.

### Batch mode adaptive joins
This feature allows your plan to dynamically switch to a better join strategy during execution using a single cached plan.

### Row and batch mode memory grant feedback
This feature recalculates the actual memory required for a query and then updates the grant value for the cached plan, reducing excessive memory grants that impact concurrency and fixing underestimated memory grants that cause expensive spills to disk.

### Interleaved execution for multi-statement table-valued functions (MSTVFs)
With interleaved execution, the actual row counts from the function are used to make better-informed downstream query plan decisions. 

For more information, see [Adaptive query processing in SQL databases](https://docs.microsoft.com/sql/relational-databases/performance/adaptive-query-processing).

## Table variable deferred compilation
Table variable deferred compilation improves plan quality and overall performance for queries referencing table variables. During optimization and initial compilation, this feature will propagate cardinality estimates that are based on actual table variable row counts.  This accurate row count information will be used for optimizing downstream plan operations.

With table variable deferred compilation, compilation of a statement that references a table variable is deferred until the first actual execution of the statement. This deferred compilation behavior is identical to the behavior of temporary tables, and this change results in the use of actual cardinality instead of the original one-row guess. To enable the public preview of table variable deferred compilation in Azure SQL Database, enable database compatibility level 150 for the database you are connected to when executing the query.

For more information, see [Table variable deferred compilation](https://docs.microsoft.com/sql/t-sql/data-types/table-transact-sql.md#table-variable-deferred-compilation ).

## Approximate query processing
Approximate query processing is a new family of features that are designed to provide aggregations across large data sets where responsiveness is more critical than absolute precision.  An example might be calculating a COUNT(DISTINCT()) across 10 billion rows, for display on a dashboard.  In this case, absolute precision is not important, but responsiveness is critical. The new APPROX_COUNT_DISTINCT aggregate function returns the approximate number of unique non-null values in a group.

For more information, see [APPROX_COUNT_DISTINCT (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/functions/approx-count-distinct-transact-sql.md).

## See also
[Performance Center for SQL Server Database Engine and Azure SQL Database](https://docs.microsoft.com/sql/relational-databases/performance/performance-center-for-sql-server-database-engine-and-azure-sql-database.md)     
[Query Processing Architecture Guide](https://docs.microsoft.com/sql/relational-databases/query-processing-architecture-guide.md)    
[Showplan Logical and Physical Operators Reference](https://docs.microsoft.com/sql/relational-databases/showplan-logical-and-physical-operators-reference.md)    
[Joins](https://docs.microsoft.com/sql/relational-databases/performance/joins.md)    
[Demonstrating Adaptive Query Processing](https://github.com/joesackmsft/Conferences/blob/master/Data_AMP_Detroit_2017/Demos/AQP_Demo_ReadMe.md)        
