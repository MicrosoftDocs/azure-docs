---
title: Archive a table in Azure Monitor
description: Configure archive settings for a table in a Log Analytics workspace in Azure Monitor.
author: bwren
ms.author: bwren
ms.reviewer: osalzberg
ms.subservice: logs
ms.topic: conceptual
ms.date: 01/12/2022

---

# Archive a table in Azure Monitor (Preview)
Archived Logs is a feature of Azure Monitor that allows you to archive data from a Log Analytics workspace for an extended period of time (up to 7 years) at a reduced cost with limitations on its usage. This is typically data that you must retain for compliance that must be access when an incident or a legal issue arises. This article describes how to configure archive settings for a table.

There is currently no option in the Azure portal to configure archive, so the only option currently included her eis the REST API.

## REST API
Use the **Tables - Update** API to set the retention and archive duration for a table. You don't specify the archive duration directly but instead set a total retention that specifies the retention plus the archive duration.

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

##### Request
Set table retention to workspace default of 30 days, and total of 2 years. This means that the archive duration would be 23 months.

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
##### Response

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