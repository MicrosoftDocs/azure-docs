---
title: Identify queries running beyond workload group query execution timeout
description: Identify queries that are running beyond the workload groups query execution timeout value.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: wiassaf
ms.date: 06/13/2022
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: how-to
ms.custom: template-how-to
---

# Identify queries running beyond workload group query execution timeout

This article covers guidance on how to identify queries that are running beyond the query_execution_timeout_sec value configured for the workload group. 

Azure Synapse Analytics provides the ability to [create workload groups for isolating resources](sql-data-warehouse-workload-isolation.md) and [classify workloads to the appropriate workload group](sql-data-warehouse-workload-classification.md). As part of the workload group definition, query_execution_timeout_sec can be configured to set the maximum execution time, in seconds, allowed before the query is canceled. However, to prevent the return of partial results, queries will not be canceled once they have reached the return phase of execution.

If these queries should be stopped, you can manually kill the session, associated with the query. This article covers guidance on identifying these queries.

## Basic troubleshooting information

To find queries that are running longer than the configured execution timeout and are in the return step phase:

- View the [workload groups configuration](#view-workload-groups-configuration)
- Find workload group [queries running beyond a specific time](#find-queries-running-beyond-specific-time)
- Check [query's current execution step](#check-query-execution-step) to see if it is in the return operation step

Alternatively, a [combined query](#find-all-queries-running-beyond-workload-group-execution-time) is provided below that finds all requests, in the return step phase, that are running longer than the set max execution time for the workload group to which they are classified.

Once the queries have been identified, they can [manually be terminated with the KILL command](#manually-terminate-queries).


### View workload groups configuration

#### Azure portal

To view the execution timeout configured for a workload group in the Azure portal:

1. Go to the Azure Synapse workspace under which the dedicated SQL Pool of interest has been created.
2. On the left side pane, all pool types created under the workspace are listed. Select **SQL Pools** under **Analytical Pools** section.
3. Select the dedicated SQL pool of interest.
4. In the left side pane, select **Workload management** under **Settings**.
5. Under **Workload groups** section, find the workload group of interest.
6. Click on the context menu, (...) button on the far right, and select **Settings**

:::image type="content" source="./media/sql-data-warehouse-how-to-find-queries-running-beyond-wlm-elapsed-timeout/portal-wlg-execution-timeout.png" alt-text="Workload Group Settings" lightbox="./media/sql-data-warehouse-how-to-find-queries-running-beyond-wlm-elapsed-timeout/portal-wlg-execution-timeout.png":::

#### T-SQL

To view workload groups using T-SQL, [connect to the dedicated SQL Pool using SQL Server Management Studio (SSMS)](../sql/get-started-ssms.md) and issue following query:
 
```sql
SELECT * FROM sys.workload_management_workload_groups;
```

For more information, see [sys.workload_management_workload_groups](/sql/relational-databases/system-catalog-views/sys-workload-management-workload-groups-transact-sql).


### Find queries running beyond specific time

#### T-SQL

To view queries running longer than the configured execution timeout, using the timeout value from the workload group above, issue the following query:

```sql
DECLARE @GROUP_NAME varchar(128);
DECLARE @TIMEOUT_VALUE_MS INT;

SET @GROUP_NAME = '<group_name>';
SET @TIMEOUT_VALUE_MS = '<execution_timeout_ms>';

SELECT  *
FROM    sys.dm_pdw_exec_requests
WHERE group_name = @GROUP_NAME AND status = 'Running' AND total_elapsed_time > @TIMEOUT_VALUE_MS
```

For more information, see [sys.dm_pdw_exec_requests](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-exec-requests-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true).

### Check query execution step

To check if the query is in the return operation step using the request ID from the prior step, issue the following query:

```sql
DECLARE @REQUEST_ID varchar(20);
SET @REQUEST_ID = '<request_id>';

SELECT * FROM sys.dm_pdw_request_steps
WHERE request_id = @REQUEST_ID AND status = 'Running' AND operation_type = 'ReturnOperation'
ORDER BY step_index;
```

For more information, see [sys.dm_pdw_request_steps](/sql/relational-databases/system-dynamic-management-views/sys-dm-pdw-request-steps-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true).

### Find all queries running beyond workload group execution time

To find all the requests that are in the return step phase and are running longer than their workload group’s configured execution timeout, issue the following query:

```sql
SELECT DISTINCT ExecRequests.request_id, ExecRequests.session_id, ExecRequests.total_elapsed_time, 
       ExecRequests.group_name, (WorkloadGroups.query_execution_timeout_sec * 1000) AS GroupQueryExecutionTimeoutMs      
FROM sys.dm_pdw_exec_requests AS ExecRequests
JOIN sys.workload_management_workload_groups AS WorkloadGroups ON WorkloadGroups.name = ExecRequests.group_name
JOIN sys.dm_pdw_request_steps AS RequestSteps ON ExecRequests.request_id = RequestSteps.request_id
WHERE ExecRequests.status = 'Running' AND ExecRequests.total_elapsed_time > (WorkloadGroups.query_execution_timeout_sec * 1000)
       AND RequestSteps.status = 'Running' AND RequestSteps.operation_type = 'ReturnOperation'
```

### Manually terminate queries

If you would manually like to terminate these queries, you can use the KILL command for the session(s) identified above.

```sql
KILL '<session-id>'
```

For more information, see [KILL (Transact SQL)](/sql/t-sql/language-elements/kill-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true).

## Next steps
- For more information on workload classification, see [Workload Classification](sql-data-warehouse-workload-classification.md).
- For more information on workload importance, see [Workload Importance](sql-data-warehouse-workload-importance.md)
 
