---
title: Azure Monitor Archived Logs
description: Use Azure Monitor Basic Logs to quickly, or periodically investigate issues, troubleshoot code or configuration problems or address support cases.
author: MeirMen, adiBiran
ms.author: meirm, adbiran
ms.reviewer: osalzberg
ms.subservice: logs
ms.topic: conceptual
ms.date: 10/31/2021

---

# Azure Monitor Archived Logs (Preview)
Archived Logs is a feature of Azure Monitor that allows you to archive data from a Log Analytics workspace for an extended period of time (up to 7 years) at a reduced cost with limitations on its usage. This is typically data that you must retain for compliance that must be access when an incident or a legal issue arises.

## Basic operation
Configure any table in your Log Analytics workspace to be archived once its configured retention elapses. This includes tables that are configured as Basic Logs. For standard tables, the retention can be configured from 30 days to 2 years (730 days). If archive is added to the table, then data is archived once this period is reached. If archive is added to a table configured as Basic Logs then data is archived after 8 days.

Archive must be added to each table in a workspace. You can't configure a workspace for all tables to be archived.

Data can be archived to total of 7 years including the initial retention. For example, if a table is configured for 2 years of initial retention, archive can add up to 5 more years. 

## Accessing archived logs
Standard log queries can't access log data after it's been archived For example, if a table is configured for 90 days of retention before archiving, only the most recent 90 days of data would be accessible for standard queries. 

There are two methods to access archived logs: 

- **Search Jobs** are log queries that run asynchronously and make their results available as a standard log table that you can use with standard log queries. Search jobs are charged according to the volume of data they scan. Use a search job when you need access to a specific set of records in your archived data.
- **Restore** is a tool that allows you to temporarily make all data from an archived table within a particular time range available as a standard table and allocates additional compute resources to handle its processing. Restore is charge according to the volume of the data it retrieves and the duration that data is made available. Use restore when you have a temporary need to run a number of queries on large volume of data. 


> [!NOTE]
> During public preview there is no charge for archived logs and restore. The only charge for search jobs is for the ingestion of the search results.

## Archive a table
There is currently no option in the Azure portal to configure archive. Use the **Tables - Update** API to set the retention and archive duration for a table. You don't specify the archive duration directly but instead set a total retention that specifies the retention plus the archive duration.

You can use either PUT or PATCH, with the following difference:  

- With **PUT**, if *retentionInDays* or *totalRetentionInDays* is null or unspecified, its value will be set to default.
- With **PATCH**, if *retentionInDays* or *totalRetentionInDays* is null or unspecified, the existing value will be kept. 

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2021-07-01-privatepreview
```

### Request Body
|Name | Type | Description |
| --- | --- | --- |
|properties.retentionInDays | integer  | The table's data retention in days, between 7 and 730. Setting this property to null will default to the workspace retention. For a table configured as Basic Logs, the value 8 will always be used. | 
|properties.totalRetentionInDays | integer  | The table's total data retention including archive period. Setting this property to null will default to the properties.retentionInDays value with no archive. | 



### Examples
##### Sample Request
Set table retention to workspace default of 30 days, and total of 2 years.
```http
PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/CustomLog_CL?api-version=2021-07-01-privatepreview
```

Request body
```http
{
    "properties": {
        "retentionInDays": null,
        "totalRetentionInDays": 730
    }
}
```
##### Sample Response
Status code: 200
```http
{
    "properties": {
        "retentionInDays": 30,
        "totalRetentionInDays": 730,
        "archiveRetentionInDays": 700,
        ...        
    },
   ...
}
```