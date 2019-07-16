---
title: Manage and monitor workload importance in Azure SQL Data Warehouse | Microsoft Docs
description: Learn how to manage and monitor request level importance.
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

# Manage and monitor workload importance in Azure SQL Data Warehouse

Manage and monitor request level importance in Azure SQL Data Warehouse using DMVs and catalog views.

## Monitor importance

Monitor importance using the new importance column in the [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?view=azure-sqldw-latest) dynamic management view.
The below monitoring query shows submit time and start time for queries. Review the submit time and start time along with importance to see how importance influenced scheduling.

```sql
SELECT s.login_name, r.status, r.importance, r.submit_time, r.start_time
  FROM sys.dm_pdw_exec_sessions s
  JOIN sys.dm_pdw_exec_requests r ON s.session_id = r.session_id
  WHERE r.resource_class is not null
ORDER BY r.start_time
```

To look further into how queries are being schedule, use the catalog views.

## Manage importance with catalog views

The sys.workload_management_workload_classifiers catalog view contains information on classifiers in your Azure SQL Data Warehouse instance. To exclude the system-defined classifiers that map to resource classes execute the following code:

```sql
SELECT *
  FROM sys.workload_management_workload_classifiers
  WHERE classifier_id > 12
```

The catalog view, [sys.workload_management_workload_classifier_details](/sql/relational-databases/system-catalog-views/sys-workload-management-workload-classifier-details-transact-sql?view=azure-sqldw-latest), contains information on the parameters used in creation of the classifier.  The below query shows that ExecReportsClassifier was created on the ```membername``` parameter for values with ExecutiveReports:

```sql
SELECT c.name,cd.classifier_type, classifier_value
  FROM sys.workload_management_workload_classifiers c
  JOIN sys.workload_management_workload_classifier_details cd
    ON cd.classifier_id = c.classifier_id
  WHERE c.name = 'ExecReportsClassifier'
```

![query results](./media/sql-data-warehouse-how-to-manage-and-monitor-workload-importance/wlm-query-results.png)

To simplify troubleshooting misclassification, we recommended you remove resource class role mappings as you create workload classifiers. The code below returns existing resource class role memberships. Run sp_droprolemember for each ```membername``` returned from the corresponding resource class.
Below is an example of checking for existence before dropping a workload classifier:

```sql
IF EXISTS (SELECT 1 FROM sys.workload_management_workload_classifiers WHERE name = 'ExecReportsClassifier')
  DROP WORKLOAD CLASSIFIER ExecReportsClassifier;
GO
```

## Next steps
- For more information on Classification, see [Workload Classification](sql-data-warehouse-workload-classification.md).
- For more information on Importance, see [Workload Importance](sql-data-warehouse-workload-importance.md)

> [!div class="nextstepaction"]
> [Go to Configure Workload Importance](sql-data-warehouse-how-to-configure-workload-importance.md)
