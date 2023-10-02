---
title: Run search jobs in Azure Monitor
description: Search jobs are asynchronous log queries in Azure Monitor that make results available as a table for further analytics.
ms.topic: conceptual
ms.date: 10/01/2022
ms.custom: references_regions 
#customer-intent: As a data scientist or workspace administrator, I want an efficient way to search through large volumes of data in a table, including archived and basic logs.
---

# Run search jobs in Azure Monitor

Search jobs are asynchronous queries that fetch records into a new search table within your workspace for further analytics. The search job uses parallel processing and can run for hours across large datasets. This article describes how to create a search job and how to query its resulting data.

> [!NOTE]
> The search job feature is currently not supported for workspaces with [customer-managed keys](customer-managed-keys.md). 

## Permissions

To run a search job, you need `Microsoft.OperationalInsights/workspaces/tables/write` and `Microsoft.OperationalInsights/workspaces/searchJobs/write` permissions to the Log Analytics workspace, for example, as provided by the [Log Analytics Contributor built-in role](../logs/manage-access.md#built-in-roles).

## When to use search jobs

Use a search job when the log query timeout of 10 minutes isn't sufficient to search through large volumes of data or if you're running a slow query.

Search jobs also let you retrieve records from [Archived Logs](data-retention-archive.md) and [Basic Logs](basic-logs-configure.md) tables into a new log table you can use for queries. In this way, running a search job can be an alternative to:

- [Restoring data from Archived Logs](restore.md) for a specific time range.<br/>
    Use restore when you have a temporary need to run many queries on a large volume of data. 

- Querying Basic Logs directly and paying for each query.<br/>
    To determine which alternative is more cost-effective, compare the cost of querying Basic Logs with the cost of running a search job and storing the search job results.

## What does a search job do?

A search job sends its results to a new table in the same workspace as the source data. The results table is available as soon as the search job begins, but it may take time for results to begin to appear. 

The search job results table is an [Analytics table](../logs/basic-logs-configure.md) that is available for log queries and other Azure Monitor features that use tables in a workspace. The table uses the [retention value](data-retention-archive.md) set for the workspace, but you can modify this value after the table is created.

The search results table schema is based on the source table schema and the specified query. The following other columns help you track the source records:

| Column | Value |
|:---|:---|
| _OriginalType          | *Type* value from source table. |
| _OriginalItemId        | *_ItemID* value from source table. |
| _OriginalTimeGenerated | *TimeGenerated* value from source table. |
| TimeGenerated          | Time at which the search job ran. |

Queries on the results table appear in [log query auditing](query-audit.md) but not the initial search job.

## Run a search job

Run a search job to fetch records from large datasets into a new search results table in your workspace.

> [!TIP] 
> You incur charges for running a search job. Therefore, write and optimize your query in interactive query mode before running the search job.  

### [Portal](#tab/portal-1)

To run a search job, in the Azure portal:

1. From the **Log Analytics workspace** menu, select **Logs**. 
1. Select the ellipsis menu on the right-hand side of the screen and toggle **Search job mode** on. 

    :::image type="content" source="media/search-job/switch-to-search-job-mode.png" alt-text="Screenshot of the Logs screen with the Search job mode switch highlighted." lightbox="media/search-job/switch-to-search-job-mode.png":::

    Azure Monitor Logs intellisense supports [KQL query limitations in search job mode](#kql-query-limitations) to help you write your search job query. 

1. Specify the search job date range using the time picker.
1. Type the search job query and select the **Search Job** button.

    Azure Monitor Logs prompts you to provide a name for the result set table and informs you that the search job is subject to billing.
    
    :::image type="content" source="media/search-job/run-search-job.png" alt-text="Screenshot that shows the Azure Monitor Logs prompt to provide a name for the search job results table." lightbox="media/search-job/run-search-job.png":::

1. Enter a name for the search job result table and select **Run a search job**.

    Azure Monitor Logs runs the search job and creates a new table in your workspace for your search job results. 

    :::image type="content" source="media/search-job/search-job-execution-1.png" alt-text="Screenshot that shows an Azure Monitor Logs message that the search job is running and the search job results table will be available shortly." lightbox="media/search-job/search-job-execution-1.png":::

1. When the new table is ready, select **View tablename_SRCH** to view the table in Log Analytics.

    :::image type="content" source="media/search-job/search-job-execution-2.png" alt-text="Screenshot that shows an Azure Monitor Logs message that the search job results table is available to view." lightbox="media/search-job/search-job-execution-2.png":::

    You can see the search job results as they begin flowing into the newly created search job results table.

    :::image type="content" source="media/search-job/search-job-execution-3.png" alt-text="Screenshot that shows search job results table with data." lightbox="media/search-job/search-job-execution-3.png":::

    Azure Monitor Logs shows a **Search job is done** message at the end of the search job. The results table is now ready with all the records that match the search query. 

    :::image type="content" source="media/search-job/search-job-done.png" alt-text="Screenshot that shows an Azure Monitor Logs message that the search job is done." lightbox="media/search-job/search-job-done.png":::

### [API](#tab/api-1)
To run a search job, call the **Tables - Create or Update** API. The call includes the name of the results table to be created. The name of the results table must end with *_SRCH*.
 
```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/<TableName>_SRCH?api-version=2021-12-01-preview
```

**Request body**

Include the following values in the body of the request:

|Name | Type | Description |
| --- | --- | --- |
|properties.searchResults.query | string  | Log query written in KQL to retrieve data. |
|properties.searchResults.limit | integer  | Maximum number of records in the result set, up to one million records. (Optional)|
|properties.searchResults.startSearchTime | string  |Start of the time range to search. |
|properties.searchResults.endSearchTime | string  | End of the time range to search. |


**Sample request**

This example creates a table called *Syslog_suspected_SRCH* with the results of a query that searches for particular records in the *Syslog* table.

**Request**

```http
PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/Syslog_suspected_SRCH?api-version=2021-12-01-preview
```

**Request body**

```json
{
    "properties": { 
        "searchResults": {
                "query": "Syslog | where * has 'suspected.exe'",
                "limit": 1000,
                "startSearchTime": "2020-01-01T00:00:00Z",
                "endSearchTime": "2020-01-31T00:00:00Z"
            }
    }
}
```

**Response**

Status code: 202 accepted.

### [CLI](#tab/cli-1)

To run a search job, run the [az monitor log-analytics workspace table search-job create](/cli/azure/monitor/log-analytics/workspace/table/search-job#az-monitor-log-analytics-workspace-table-search-job-create) command. The name of the results table, which you set using the `--name` parameter, must end with *_SRCH*.

For example:

```azurecli
az monitor log-analytics workspace table search-job create --subscription ContosoSID --resource-group ContosoRG  --workspace-name ContosoWorkspace --name HeartbeatByIp_SRCH --search-query 'Heartbeat | where ComputerIP has "00.000.00.000"' --limit 1500 --start-search-time "2022-01-01T00:00:00.000Z" --end-search-time "2022-01-08T00:00:00.000Z" --no-wait
```

---

## Get search job status and details
### [Portal](#tab/portal-2)
1. From the **Log Analytics workspace** menu, select **Logs**. 
1. From the Tables tab, select **Search results** to view all search job results tables. 

    The icon on the search job results table displays an update indication until the search job is completed.  
    
    :::image type="content" source="media/search-job/search-results-tables.png" alt-text="Screenshot that shows the Tables tab on Logs screen in the Azure portal with the search results tables listed under Search results." lightbox="media/search-job/search-results-tables.png":::

### [API](#tab/api-2)

Call the **Tables - Get** API to get the status and details of a search job:
```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/<TableName>_SRCH?api-version=2021-12-01-preview
```

**Table status**<br>

Each search job table has a property called *provisioningState*, which can have one of the following values:

| Status | Description |
|:---|:---|
| Updating | Populating the table and its schema. |
| InProgress | Search job is running, fetching data. |
| Succeeded | Search job completed. |
| Deleting | Deleting the search job table. |


**Sample request**

This example retrieves the table status for the search job in the previous example.

**Request**

```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/Syslog_SRCH?api-version=2021-12-01-preview
```

**Response**

```json
{
        "properties": {
        "retentionInDays": 30,
        "totalRetentionInDays": 30,
        "archiveRetentionInDays": 0,
        "plan": "Analytics",
        "lastPlanModifiedDate": "Mon, 01 Nov 2021 16:38:01 GMT",
        "schema": {
            "name": "Syslog_SRCH",
            "tableType": "SearchResults",
            "description": "This table was created using a Search Job with the following query: 'Syslog | where * has 'suspected.exe'.'",
            "columns": [...],
            "standardColumns": [...],
            "solutions": [
                "LogManagement"
            ],
            "searchResults": {
                "query": "Syslog | where * has 'suspected.exe'",
                "limit": 1000,
                "startSearchTime": "Wed, 01 Jan 2020 00:00:00 GMT",
                "endSearchTime": "Fri, 31 Jan 2020 00:00:00 GMT",
                "sourceTable": "Syslog"
            }
        },
        "provisioningState": "Succeeded"
    },
    "id": "subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/Syslog_SRCH",
    "name": "Syslog_SRCH"
}
```

### [CLI](#tab/cli-2)

To check the status and details of a search job table, run the [az monitor log-analytics workspace table show](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-show) command.

For example:

```azurecli
az monitor log-analytics workspace table show --subscription ContosoSID --resource-group ContosoRG --workspace-name ContosoWorkspace --name HeartbeatByIp_SRCH --output table \
```

---

## Delete a search job table
We recommend you [delete the search job table](../logs/create-custom-table.md#delete-a-table) when you're done querying the table. This reduces workspace clutter and extra charges for data retention. 

## Limitations
Search jobs are subject to the following limitations:

- Optimized to query one table at a time.
- Search date range is up to one year.
- Supports long running searches up to a 24-hour time-out.
- Results are limited to one million records in the record set.
- Concurrent execution is limited to five search jobs per workspace.
- Limited to 100 search results tables per workspace.
- Limited to 100 search job executions per day per workspace. 

When you reach the record limit, Azure aborts the job with a status of *partial success*, and the table will contain only records ingested up to that point. 

### KQL query limitations

Search jobs are intended to scan large volumes of data in a specific table. Therefore, search job queries must always start with a table name. To enable asynchronous execution using distribution and segmentation, the query supports a subset of KQL, including the operators: 

- [where](/azure/data-explorer/kusto/query/whereoperator)
- [extend](/azure/data-explorer/kusto/query/extendoperator)
- [project](/azure/data-explorer/kusto/query/projectoperator)
- [project-away](/azure/data-explorer/kusto/query/projectawayoperator)
- [project-keep](/azure/data-explorer/kusto/query/project-keep-operator)
- [project-rename](/azure/data-explorer/kusto/query/projectrenameoperator)
- [project-reorder](/azure/data-explorer/kusto/query/projectreorderoperator)
- [parse](/azure/data-explorer/kusto/query/whereoperator)
- [parse-where](/azure/data-explorer/kusto/query/whereoperator)

You can use all functions and binary operators within these operators.

## Pricing model
The charge for a search job is based on: 

- Search job execution - the amount of data the search job scans.
- Search job results - the amount of data the search job finds and is ingested into the results table, based on the regular log data ingestion prices.

For example, if your table holds 500 GB per day, for a search over 30 days, you'll be charged for 15,000 GB of scanned data. 
If the search job finds 1,000 records that match the search query, you'll be charged for ingesting these 1,000 records into the results table. 

For more information, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Next steps

- [Learn more about data retention and archiving data.](data-retention-archive.md)
- [Learn about restoring data, which is another method for retrieving archived data.](restore.md)
- [Learn about directly querying Basic Logs.](basic-logs-query.md)
