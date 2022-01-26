---
title: Search jobs in Azure Monitor (preview)
description: Search jobs are asynchronous log queries in Azure Monitor that make results available as a table for further analytics.
author: bwren
ms.author: bwren
ms.topic: conceptual
ms.date: 01/19/2022

---

# Search jobs in Azure Monitor (preview)
Search jobs are asynchronous log queries in Azure Monitor that make results available as a  [Analytics Logs table](log-analytics-overview.md) you can use for log queries. Use search jobs to retrieve data matching particular require from [Archived Logs](archived-logs-overview.md) and [Basic Logs](basic-logs-overview.md). This article describes how to create a search job and how to query its resulting data. 

## When to use search jobs
Search jobs are one method that you can use to analyze Archived Logs and Basic Logs. Use [restore](restore.md) to make a specific time range of archived data in a table available for querying. You can query Basic Logs directly, but there is a cost for each query. Depending on how many queries you need to perform, you should balance the cost for querying Basic Logs against the cost to perform the search job and store the resulting data.

## Basic operation
A search job sends its results to a custom log table created in the same workspace. This is an [Analytics Logs]() table that is available for log queries or any other features of Azure Monitor that use tables in a workspace. The table uses the [retention value]() set for the workspace, but you can later modify the retention of the table.

The results table is created as soon as the search job is started, and the first batch of results appear in the table at least 10 minutes after the job execution started. Additional data is ingested as its located by the query. The Search job execution is audited via the [activity log](../essentials/activity-log.md) as table write operation, and will not appear in [log query auditing](query-audit.md).  



## Cost
Search jobs charged by the amount of data they scan. 

> [!NOTE]
> There is no charge for search jobs during the public preview.

## Limits
Search jobs are subject to the following limitations:

- Date range of up to 1 year
- Execution of up to 24 hours
- 1 million records in the result set
- Concurrent execution of up to 5 search jobs per workspace
- 100 search job execution per day per workspace
- 100 existing search results tables per workspace

When the record limit is reached, the job is aborted with a status of *partial success*,  and the table will contain only records that were ingested up to that point. 


## KQL limitations
Log queries in a search job are intended for simple data retrieval and use a subset of the KQL language to help the user find the right records that hold relevant data. Queries are limited to the following operators: 

- [where](/azure/data-explorer/kusto/query/whereoperator)
- [extend](/azure/data-explorer/kusto/query/extendoperator)
- [project](/azure/data-explorer/kusto/query/projectoperator)
- [project-away](/azure/data-explorer/kusto/query/projectawayoperator)
- [project-keep](/azure/data-explorer/kusto/query/projectkeepoperator)
- [project-rename](/azure/data-explorer/kusto/query/projectrenameoperator)
- [project-reorder](/azure/data-explorer/kusto/query/projectreorderoperator)
- [parse](/azure/data-explorer/kusto/query/whereoperator)
- [parse-where](/azure/data-explorer/kusto/query/whereoperator)

All functions and binary operators are supported when used within these operators.


## Search job table Schema
The search job table schema will include the columns output from the specified log query in addition to the columns in the following table.

| Column | Value |
|:---|:---|
| _OriginalType          | *Type* value from source table |
| _OriginalItemId        | *_ItemID* value from source table |
| _OriginalTimeGenerated | *TimeGenerated* value from source table |
| TimeGenerated          | Time that the record was retrieved from the original table using the search job |

## Create a search job using API

> [!NOTE]
> The only current option to create a restore is using the **Tables** API.
 
Use **Tables - Update** API call to create a search job:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_SRCH?api-version=2021-07-01-privatepreview
```

This call includes the name of the results table to be created from the results. The name of this table must end with _SRCH.

### Request Body
The body of the request must include the following values:

|Name | Type | Description |
| --- | --- | --- |
|properties.searchResults.query | string  | Log query written in KQL to retrieve data. |
|properties.searchResults.limit | integer  | Maximum number of records in the result set. This has a maximum of one million records. |
|properties.searchResults.startSearchTime | string  |Start of the time range to restore. |
|properties.searchResults.endSearchTime | string  | End of the time range to restore. |



### Example
The following example creates a table called *Syslog_SRCH* with a query that searches for particular records in the *Syslog* table.

**Request**
```http
PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/Syslog_SRCH?api-version=2021-07-01-privatepreview
```

**Request body**
```http
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
Status code: 202 accepted


## Get search job status and details
Use **Tables - Get** API call to get the status and details of a search job table:
```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_SRCH?api-version=2021-07-01-privatepreview
```

### Table status
Each search job table has a property called *provisioningState* that can have one of the following values:

- Updating - the table and its schema are populated.
- InProgress - search job is running, and fetching data.
- Succeeded - search job completed. 


### Example
The following example 
#### Request
```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/Syslog_SRCH?2021-07-01-privatepreview
```

#### Response
```json
{
    {
    "properties": {
        "retentionInDays": 30
        "totalRetentionInDays": 30,
        "archiveRetentionInDays": 0,
        "plan": "Analytics",
        "lastPlanModifiedDate": "Mon, 01 Nov 2021 16:38:01 GMT",
        "schema": {
            "name": "Syslog_SRCH",
            "tableType": "SearchResults",
            "description": "This table was created using a Search Job with the following query: 'Syslog | where * has "suspected.exe'.",
            "columns": [...],
            "standardColumns": [...],
            "solutions": [
                "LogManagement"
            ],
            "searchResults": {
                "query": "Syslog | where * has "suspected.exe",
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


### Delete Search Job table
The only current method to delete a search job results table is a REST API call using **Tables - Delete**.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_SRCH?api-version=2021-07-01-privatepreview
```

If the table provisioning status is *InProgress* this call will terminate the search job execution.




## Next steps

- Learn more about data retention and archiving data.
- Learn about Search jobs which is another method for retrieving archived data.