---
title: Configure workload importance in Azure SQL Data Warehouse | Microsoft Docs
description: Learn how to set request level importance.
services: sql-data-warehouse
author: ronortloff
manager: craigg
ms.service: sql-data-warehouse
ms.subservice: workload-management
ms.topic: conceptual
ms.date: 05/20/2019
ms.author: rortloff
ms.reviewer: igorstan
---

# Configure workload importance in Azure SQL Data Warehouse

Setting importance in the SQL Data Warehouse allows you to influence the scheduling of queries. Queries with higher importance will be scheduled to run before queries with lower importance. To assign importance to queries, you need to create a workload classifier.

## Create a Workload Classifier with Importance

Often in a data warehouse scenario you have users who need their queries to run quickly.  The user could be executives of the company who need to run reports or the user could be an analyst running an adhoc query. You create a workload classifier to assign importance to a query.  The examples below use the new [create workload classifier](/sql/t-sql/statements/create-workload-classifier-transact-sql?view=azure-sqldw-latest) syntax to create two classifiers.  Membername can be a single user or a group. Individual user classifications take precedence over role classifications. To find existing data warehouse users, run:

```sql
Select name from sys.sysusers
```

To create a workload classifier, for a user with higher importance run:

```sql
CREATE WORKLOAD CLASSIFIER ExecReportsClassifier  
    WITH (WORKLOAD_GROUP = 'xlargerc'
                   ,MEMBERNAME        = 'name'  
                   ,IMPORTANCE        =  above_normal);  

```

To create a workload classifier for a user running adhoc queries with lower importance run:  

```sql
CREATE WORKLOAD CLASSIFIER AdhocClassifier  
    WITH (WORKLOAD_GROUP = 'xlargerc'
                   ,MEMBERNAME        = 'name'  
                   ,IMPORTANCE        =  below_normal);  
```

## Next Steps
- For more information about workload management, see [Workload Classification](sql-data-warehouse-workload-classification.md)
- For more information on Importance, see [Workload Importance](sql-data-warehouse-workload-importance.md)

> [!div class="nextstepaction"]
> [Go to Manage and monitor Workload Importance](sql-data-warehouse-how-to-manage-and-monitor-workload-importance.md)
