---
title: Azure Monitor Basic Logs
description: Use Azure Monitor Basic Logs to quickly, or periodically investigate issues, troubleshoot code or configuration problems or address support cases.
author: MeirMen, adiBiran
ms.author: meirm, adbiran
ms.reviewer: osalzberg
ms.subservice: logs
ms.topic: conceptual
ms.date: 10/31/2021

---

# Search jobs in Azure Monitor (preview)
Search jobs are asynchronous log queries in Azure Monitor that make results available as a table for further analytics. Use search jobs with [Archived Logs](archived-logs.md) and [Basic logs](basic-logs.md) when you need to query specific records.

## Basic operation
Once a search job is executing, a custom log table is created in the same workspace to contain the results. It is a standard log table that is available for analytics or any other use. Search job results table is created with workspace default retention value. The admin can later set the table's retention values, or delete it, as any other table.
Search job execution is audited via the activity logs as table write operation, and will not appear in query auditing. 
During the job execution, when results are found they are ingested into the results table. For that reason, in most cases, the first batch of results appear in the table at least 10 minutes after the job execution started.

Search job results table is created as analytics table with workspace default retention value. The admin can later set the table's retention values, as any other analytics table.

## Charges
Search jobs charged by the amount of data they scan. For more details on billing, see **TODO:** add link to billing page.

## Limits

A single search job is limited to: 

- Date range of up to 1 year
- Execution of up to 24 hours
- 1 million records in the result set
- Concurrent execution of up to 5 search jobs per workspace
- 100 search job execution per day per workspace
- 100 existing search results tables per workspace

When the record limit is reached, the job is aborted with a status of *partial success*,  and the table will contain only records that were ingested up to this point. 


## KQL limitations
Search jobs are designed to use the best of KQL language to help the user find the right records that hold relevant data. The following table operators are supported when running a search job: 

- where
- extend
- project – including all its variants (project-away, project-rename, etc.)
- parse and parse-where

All functions and binary operators are supported when used within these operators.



## Create a search job
The only current method to create a search job is a REST API call using **Tables - Update**.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_SRCH?api-version=2021-07-01-privatepreview
```

> [!NOTE]
> Table name must end with _SRCH postfix.

### Request Body

|Name | Type | Description |
| --- | --- | --- |
|properties.searchResults.query | string  | Query that is optimized for record fetching|
|properties.searchResults.limit | integer  | Records limits in the results set, maximum of 1M records| 
|properties.searchResults.startSearchTime | string  | Date and time to start the search from|
|properties.searchResults.endSearchTime | string  | Date and time to end the search by. Search job date range is limited to 1 year|


### Search job table status
Each search job table has a property called *provisioningState* that can have one of the following values:

- Updating - the table and its schema are populated.
- InProgress - search job is running, and fetching data.
- Succeeded - search job completed. 

### Search job table Schema
The search job table schema will include the columns output from the specified log query in addition to the columns in the following table.

| Column | Value |
|:---|:---|
| _OriginalType          | *Type* value from source table |
| _OriginalItemId        | *_ItemID* value from source table |
| _OriginalTimeGenerated | *TimeGenerated* value from source table |
| TimeGenerated          | Time that the record was retrieved from the original table using the search job |

### Sample

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


### Delete Search Job table
The only current method to delete a search job results table is a REST API call using **Tables - Delete**.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_SRCH?api-version=2021-07-01-privatepreview
```

If the table provisioning status is *InProgress* this call will terminate the search job execution.



## Get Search Job table results
Use **Tables - Get** API call to get a Search Job results table.
```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_SRCH?api-version=2021-07-01-privatepreview
```

#### Examples
##### Sample Request
```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/Syslog_SRCH?2021-07-01-privatepreview
```

##### Sample Response
```http
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
