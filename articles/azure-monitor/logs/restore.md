---
title: Restore archived logs in Azure Monitor (preview) 
description: Restore a specific time range of archived data in a Log Analytics workspace.
author: bwren
ms.author: bwren
ms.topic: conceptual
ms.date: 01/19/2022

---

# Restore archived logs in Azure Monitor (preview)
[Archived Logs](data-retention-archive.md) are stored for up to seven years in a Log Analytics workspace at a reduced cost, but you can't directly access them. Restore makes a specific time range of archived data in a table available for querying and allocates additional compute resources to handle their processing. This article describes how to restore archived data, query that data, and then dismiss it when you're done with it. 

> [!NOTE]
> Restore is one method for accessing archived data. Use restore when you want to run queries against a set of data in a particular time range. Use [Search jobs](search-jobs.md) to access data that fits a certain criteria.

## Basic operation
When you restore data, you specify the source table that contains the archived data and a destination table to store the restored data. This table is in the same workspace as the source table and provides a view of the underlying source data. You can then use regular [log queries](log-query-overview.md) to retrieve data from the restored table. The restored table has no retention setting, and you must explicitly release it when you no longer require it. 

## Cost
Restore is charge according to the volume of the data restored and the time it is available. 

> [!NOTE]
> There is no charge for restored data during the preview period.

## Limits
Restore is subject to the following limitations: 

- You can perform up to 4 restores per workspace per week. 
- Up to 2 restore processes in a workspace can be concurrently running.
- A single table can have only one active restore. Executing a second restore on a table that has already active restore will fail. 

## Restore data using API
Use **Tables - Update** API call to restore archived data:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_RST?api-version=2021-07-01-privatepreview
```
### Request Body
The body of the request must include the following values:

|Name | Type | Description |
|:---|:---|:---|
|properties.restoredLogs.sourceTable | string  | Table with the archived data to restore. Must end with _RST. |
|properties.restoredLogs.startRestoreTime | string  | Start of the time range to restore. |
|properties.restoredLogs.endRestoreTime | string  | End of the time range to restore. |

### Restore table status
You can get the current state of the restore table from a property called **provisioningState**. This property will be returned when you start the restore, and you can retrieve it later using a GET operation on the table. The **provisioningState** property will have one of the following value:

| Value | Description 
|:---|:---|
| Updating | The table was created and is being populated. |
| Succeeded | Restore has completed. |

#### Sample Request
The following sample restores data from the month of January 2020 from the *Usage* table to a table called *Usage_RST*.

```http
PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/Usage_RST?api-version=2021-07-01-privatepreview
```

Request body:
```http
{
    "properties":  {
    "restoredLogs":  {
                      "startRestoreTime":  "2020-01-01T00:00:00Z",
                      "endRestoreTime":  "2020-01-31T00:00:00Z",
                      "sourceTable":  "Usage"
    }
  }
}
```

## Dismiss restored data
You should dismiss restored data as soon as your done with it since you're charged according to how long the data is available.  To release the data from restore you should delete the restored table - this action will not affect the underlying source table.

> [!NOTE]
> Removing the table from the workspace will also remove any restores for that table. You can only remove custom tables and not built-in tables.

Use **Tables - Delete** API call to delete the (logical) restore table.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_RST?api-version=2021-07-01-privatepreview
```

## Next steps

- [Learn more about data retention and archiving data.](data-retention-archive.md)
- [Learn about Search jobs which is another method for retrieving archived data.](search-jobs.md)