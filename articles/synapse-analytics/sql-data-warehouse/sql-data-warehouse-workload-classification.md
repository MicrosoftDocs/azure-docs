---
title: Workload classification for dedicated SQL pool
description: Guidance for using classification to manage query concurrency, importance, and compute resources for dedicated SQL pool in Azure Synapse Analytics.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sngun
ms.date: 01/24/2022
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom: azure-synapse
---

# Workload classification for dedicated SQL pool in Azure Synapse Analytics

This article explains the workload classification process of assigning a workload group and importance to incoming requests with dedicated SQL pools in Azure Synapse.

## Classification

> [!Video https://www.youtube.com/embed/QcCRBAhoXpM]

Workload management classification allows workload policies to be applied to requests through assigning [resource classes](resource-classes-for-workload-management.md#what-are-resource-classes) and [importance](sql-data-warehouse-workload-importance.md).

While there are many ways to classify data warehousing workloads, the simplest and most common classification is load and query. You load data with insert, update, and delete statements.  You query the data using selects. A data warehousing solution will often have a workload policy for load activity, such as assigning a higher resource class with more resources. A different workload policy could apply to queries, such as lower importance compared to load activities.

You can also subclassify your load and query workloads. Subclassification gives you more control of your workloads. For example, query workloads can consist of cube refreshes, dashboard queries or ad-hoc queries. You can classify each of these query workloads with different resource classes or importance settings. Load can also benefit from subclassification. Large transformations can be assigned to larger resource classes. Higher importance can be used to ensure key sales data is loader before weather data or a social data feed.

Not all statements are classified as they do not require resources or need importance to influence execution.  DBCC commands, BEGIN, COMMIT, and ROLLBACK TRANSACTION statements are not classified.

## Classification process

Classification for dedicated SQL pool is achieved today by assigning users to a role that has a corresponding resource class assigned to it using [sp_addrolemember](/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true). The ability to characterize requests beyond a login to a resource class is limited with this capability. A richer method for classification is now available with the [CREATE WORKLOAD CLASSIFIER](/sql/t-sql/statements/create-workload-classifier-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) syntax.  With this syntax, dedicated SQL pool users can assign importance and how much system resources are assigned to a request via the `workload_group` parameter.

## Classification weighting

As part of the classification process, weighting is in place to determine which workload group is assigned.  The weighting goes as follows:

|Classifier Parameter |Weight   |
|---------------------|---------|
|MEMBERNAME:USER      |64       |
|MEMBERNAME:ROLE      |32       |
|WLM_LABEL            |16       |
|WLM_CONTEXT          |8        |
|START_TIME/END_TIME  |4        |

The `membername` parameter is mandatory.  However, if the membername specified is a database user instead of a database role, the weighting for user is higher and thus that classifier is chosen.

If a user is a member of multiple roles with different resource classes assigned or matched in multiple classifiers, the user is given the highest resource class assignment.  This behavior is consistent with existing resource class assignment behavior.

> [!NOTE]
> Classifying managed identities (MI) behavior differs between the dedicated SQL pool in Azure Synapse workspaces and the standalone dedicated SQL pool (formerly SQL DW). While the standalone dedicated SQL pool MI maintains the assigned identity, for Azure Synapse workspaces the MI runs as **dbo**. This cannot be changed. The dbo role, by default, is classified to smallrc. Creating a classifier for the dbo role allows for assigning requests to a workload group other than smallrc. If dbo alone is too generic for classification and has broader impacts, consider using label, session or time-based classification in conjunction with the dbo role classification.


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

To simplify troubleshooting misclassification, we recommended you remove resource class role mappings as you create workload classifiers.  The code below returns existing resource class role memberships.  Run [sp_droprolemember](/sql/relational-databases/system-stored-procedures/sp-droprolemember-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) for each member name returned from the corresponding resource class.

```sql
SELECT  r.name AS [Resource Class]
,       m.name AS membername
FROM    sys.database_role_members rm
JOIN    sys.database_principals AS r ON rm.role_principal_id = r.principal_id
JOIN    sys.database_principals AS m ON rm.member_principal_id = m.principal_id
WHERE   r.name IN ('mediumrc','largerc','xlargerc','staticrc10','staticrc20','staticrc30','staticrc40','staticrc50','staticrc60','staticrc70','staticrc80');
```

```sql
--for each row returned run in the previous query
EXEC sp_droprolemember '[Resource Class]', membername;
```

## Next steps

- For more information on creating a classifier, see the [CREATE WORKLOAD CLASSIFIER (Transact-SQL)](/sql/t-sql/statements/create-workload-classifier-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true).  
- See the Quickstart on how to create a workload classifier [Create a workload classifier](quickstart-create-a-workload-classifier-tsql.md).
- See the how-to articles to [Configure Workload Importance](sql-data-warehouse-how-to-configure-workload-importance.md) and how to [manage and monitor Workload Management](sql-data-warehouse-how-to-manage-and-monitor-workload-importance.md).
- See [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) to view queries and the importance assigned.
