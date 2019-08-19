---
title: Azure SQL Data Warehouse classification | Microsoft Docs
description: Guidance for using classification to manage concurrency, importance, and compute resources for queries in Azure SQL Data Warehouse.
services: sql-data-warehouse
author: ronortloff
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.subservice: workload-management
ms.date: 05/01/2019
ms.author: rortloff
ms.reviewer: jrasnick
---

# Azure SQL Data Warehouse workload classification

This article explains the SQL Data Warehouse workload classification process of assigning a resource class and importance to incoming requests.

## Classification

> [!Video https://www.youtube.com/embed/QcCRBAhoXpM]

Workload management classification allows workload policies to be applied to requests through assigning [resource classes](resource-classes-for-workload-management.md#what-are-resource-classes) and [importance](sql-data-warehouse-workload-importance.md).

While there are many ways to classify data warehousing workloads, the simplest and most common classification is load and query. You load data with insert, update, and delete statements.  You query the data using selects. A data warehousing solution will often have a workload policy for load activity, such as assigning a higher resource class with more resources. A different workload policy could apply to queries, such as lower importance compared to load activities.

You can also subclassify your load and query workloads. Subclassification gives you more control of your workloads. For example, query workloads can consist of cube refreshes, dashboard queries or ad-hoc queries. You can classify each of these query workloads with different resource classes or importance settings. Load can also benefit from subclassification. Large transformations can be assigned to larger resource classes. Higher importance can be used to ensure key sales data is loader before weather data or a social data feed.

Not all statements are classified as they do not require resources or need importance to influence execution.  DBCC commands, BEGIN, COMMIT, and ROLLBACK TRANSACTION statements are not classified.

## Classification process

Classification in SQL Data Warehouse is achieved today by assigning users to a role that has a corresponding resource class assigned to it using [sp_addrolemember](/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql). The ability to characterize requests beyond a login to a resource class is limited with this capability. A richer method for classification is now available with the [CREATE WORKLOAD CLASSIFIER](/sql/t-sql/statements/create-workload-classifier-transact-sql) syntax.  With this syntax, SQL Data Warehouse users can assign importance and a resource class to requests.  

> [!NOTE]
> Classification is evaluated on a per request basis. Multiple requests in a single session can be classified differently.

## Classification precedence

As part of the classification process, precedence is in place to determine which resource class is assigned. Classification based on a database user takes precedence over role membership. If you create a classifier that maps the UserA database user to the mediumrc resource class. Then, map the RoleA database role (of which UserA is a member) to the largerc resource class. The classifier that maps the database user to the mediumrc resource class will take precedence over the classifier that maps the RoleA database role to the largerc resource class.

If a user is a member of multiple roles with different resource classes assigned or matched in multiple classifiers, the user is given the highest resource class assignment.  This behavior is consistent with existing resource class assignment behavior.

## System classifiers

Workload classification has system workload classifiers. The system classifiers map existing resource class role memberships to resource class resource allocations with normal importance. System classifiers can't be dropped. To view system classifiers, you can run the below query:

```sql
SELECT * FROM sys.workload_management_workload_classifiers where classifier_id <= 12
```

## Mixing resource class assignments with classifiers

System classifiers created on your behalf provide an easy path to migrate to workload classification. Using resource class role mappings with classification precedence, can lead to misclassification as you start to create new classifiers with importance.

Consider the following scenario:

- An existing data warehouse has a database user DBAUser assigned to the largerc resource class role. The resource class assignment was done with sp_addrolemember.
- The data warehouse is now updated with workload management.
- To test the new classification syntax, the database role DBARole (which DBAUser is a member of), has a classifier created for them mapping them to mediumrc and high importance.
- When DBAUser logs in and runs a query, the query will be assigned to largerc. Because a user takes precedence over a role membership.

To simplify troubleshooting misclassification, we recommended you remove resource class role mappings as you create workload classifiers.  The code below returns existing resource class role memberships.  Run [sp_droprolemember](/sql/relational-databases/system-stored-procedures/sp-droprolemember-transact-sql) for each member name returned from the corresponding resource class.

```sql
SELECT  r.name AS [Resource Class]
,       m.name AS membername
FROM    sys.database_role_members rm
JOIN    sys.database_principals AS r ON rm.role_principal_id = r.principal_id
JOIN    sys.database_principals AS m ON rm.member_principal_id = m.principal_id
WHERE   r.name IN ('mediumrc','largerc','xlargerc','staticrc10','staticrc20','staticrc30','staticrc40','staticrc50','staticrc60','staticrc70','staticrc80');

--for each row returned run
sp_droprolemember ‘[Resource Class]’, membername
```

## Next steps

- For more information on creating a classifier, see the [CREATE WORKLOAD CLASSIFIER (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/statements/create-workload-classifier-transact-sql).  
- See the Quickstart on how to create a workload classifier [Create a workload classifier](quickstart-create-a-workload-classifier-tsql.md).
- See the how-to articles to [Configure Workload Importance](sql-data-warehouse-how-to-configure-workload-importance.md) and how to [manage and monitor Workload Management](sql-data-warehouse-how-to-manage-and-monitor-workload-importance.md).
- See [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql) to view queries and the importance assigned.