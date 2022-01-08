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
Archived logs store log data for very long periods of time, up to 7 years, at a reduced cost with limitations on its usage.

Organizations need to keep data for long periods of time. In many cases, this requirement is driven by compliancy and the need to be able to respond when an incident or a legal issue arise. Archived logs are designed to enable these scenarios by removing the cost barrier and the management overhead.

Administrator will be able to configure any table to be archived once its configured retention elapses. This include both tables that were ingested as analytics logs and tables that were ingested as Basic Logs. For Basic Logs the retention is always 8 days and then archive can be added. Analytics logs retention varies between 30 days and 2 years (730 days). Once this retention period ends, data can be archived. Data can be archived to total of 7 years including the initial retention. E.g. if table is configured for 2 years of initial retention, archive can add up to 5 more years. Note that archive is only per-table configuration, it cannot be configured for all tables in the workspace.
Standard queries will not cover archived logs. E.g. if a table contains 90 days of retention, only these 90 days would be accessible for standard queries. 

There are two methods to access archived logs: 

- **Search Jobs**: these are queries that fetch records and make the results available as an analytics log table – allowing the user to use all the richness of Log Analytics. Search jobs run asynchronously and may be used to scan very high volume of data. Use them when there are specific records that are relevant. Search jobs are charged according to the volume of the data they scan.
- **Restore**: this tool allows an admin to restore a whole chunk of a table based on dates. It will make a specific time range of any table available as analytics logs and will allocate additional compute resources to handle their processing. Use restore when there is a temporary need to run many queries on large volume of data. Restore is charge according to the volume of the data and the time it is available.

Other than query, there are also limitations on the usage of purge. 

If data is used for analytics or it is retrieved frequently, it is recommended to keep it with logs retention to enable analytics and troubleshooting. Archive is recommended for data that is less frequently used.

> [!NOTE]
>* Archived logs, search job and restore are offered as a private preview, and will be available for subscriptions that were added to the feature allow-list. Public preview is planned to early 2022. 
>* During private preview archived logs and restore are offered with no charge, while search job is charged only for the search results ingestion.

## Archive your table
Use **Tables - Update** API call to set table retention and table total retention, where archive period is calculated as total-retention.

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2021-07-01-privatepreview
```

### Request Body
|Name | Type | Description |
| --- | --- | --- |
|properties.retentionInDays | integer  | The table's data retention in days, between 7 and 730. In _Basic Logs_ the value is fixed: 8. Setting this property to null will default to the workspace retention.| 
|properties.totalRetentionInDays | integer  | The table's total data retention including archive period. Setting this property to null will default to properties.retentionInDays, with no archive| 

> [!TIP]
>You can use either PUT or PATCH, with the following difference:  
>When calling **PUT**, if retentionInDays\totalRetentionInDays is null or unspecified, their value will be set to default.
>When calling **PATCH**, if retentionInDays\totalRetentionInDays is null or unspecified the existing value will be kept. 
>
>properties.retentionInDays default value is the workspace retention, and properties.totalRetentionInDays default value is table's retention
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