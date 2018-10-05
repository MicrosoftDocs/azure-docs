---
title: SQL Data Warehouse Recommendations - Concepts | Microsoft Docs
description: Learn about SQL Data Warehouse recommendations and how they are generated
services: sql-data-warehouse
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 07/27/2018
ms.author: kevin
ms.reviewer: igorstan
---

# SQL Data Warehouse Recommendations

This article describes the recommendations served by SQL Data Warehouse through Azure Advisor.  

SQL Data Warehouse provides recommendations to ensure your data warehouse is consistently optimized for performance. Data warehouse recommendations are tightly integrated with [Azure Advisor](https://docs.microsoft.com/azure/advisor/advisor-performance-recommendations) to provide you with best practices directly within the [Azure portal](https://aka.ms/Azureadvisor). SQL Data Warehouse analyzes the current state of your data warehouse, collects telemetry, and surfaces recommendations for your active workload on a daily cadence. The supported data warehouse recommendation scenarios are outlined below along with how to apply recommended actions.

If you have any feedback on the SQL Data Warehouse Advisor or run into any issues, reach out to [sqldwadvisor@service.microsoft.com](mailto:sqldwadvisor@service.microsoft.com).   

Click [here](https://aka.ms/Azureadvisor) to check your recommendations today! Currently this feature is applicable to Gen2 data warehouses only. 

## Data Skew

Data skew can cause additional data movement or resource bottlenecks when running your workload. The following documentation describes show to identify data skew and prevent it from happening by selecting an optimal distribution key.

- [Identify and remove skew](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-tables-distribute#how-to-tell-if-your-distribution-column-is-a-good-choice) 

## No or Outdated Statistics

Having suboptimal statistics can severely impact query performance as it can cause the SQL Data Warehouse query optimizer to generate suboptimal query plans. The following documentation describes the best practices around creating and updating statistics:

- [Creating and updating table statistics](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-tables-statistics)

To see the list of impacted tables by these recommendations, run the following [T-SQL script](https://github.com/Microsoft/sql-data-warehouse-samples/blob/master/samples/sqlops/MonitoringScripts/ImpactedTables). The advisor continuously runs the same T-SQL script to generate these recommendations.
