---
title: Restore logs in Azure Monitor (preview) 
description: Restore a specific time range of data in a Log Analytics workspace for high-performance queries.
author: bwren
ms.author: bwren
ms.topic: conceptual
ms.date: 01/19/2022

---

# Restore logs in Azure Monitor (preview)
The restore operation makes a specific time range of data in a table available for high-performance queries. This article describes how to restore data, query that data, and then dismiss the data when you're done.

## When to restore logs
Use the restore operation to query data in [Archived Logs](data-retention-archive.md). You can also use the restore operation to run powerful queries within a specific time range on any table when the log queries you run on the table source table cannot complete within the log query timeout of 10 minutes.

> [!NOTE]
> Restore is one method for accessing archived data. Use restore to run queries against a set of data within a particular time range. Use [Search jobs](search-jobs.md) to access data based on specific criteria.

## What does restore do?
When you restore data, you specify the source table that contains the data you want to query and a destination table, which is created in the same workspace and provides a view of the data in the source table. 

The restore operation also allocates additional compute resources for querying the restored data using [log queries](log-query-overview.md).

The destination table provides a view of the underlying source data, but does not affect it in any way. The table has no retention setting, and you must explicitly [dismiss the restored data](#dismiss-restored-data) when you no longer require it. 

## Cost
The charge for the restore operation is based on the volume of the data restored and the amount of time the data is available. 

> [!NOTE]
> There is no charge for restored data during the preview period.

## Limits
Restore is subject to the following limitations. 

You can: 

- Restore data for a minimum of two days.
- Restore data more than 14 days old.
- Restore up to 60TB.
- Perform up to four restores per workspace per week. 
- Run up to two restore processes in a workspace concurrently.
- Run only one active restore on a specific table at a given time. Executing a second restore on a table that already has an active restore will fail. 

## Restore data using API
Call the **Tables - Create** or **Tables - Update** API to restore data from a table:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_RST?api-version=2021-12-01-preview
```
### Request Body
The body of the request must include the following values:

|Name | Type | Description |
|:---|:---|:---|
|properties.restoredLogs.sourceTable | string  | Table with the data to restore. |
|properties.restoredLogs.startRestoreTime | string  | Start of the time range to restore. |
|properties.restoredLogs.endRestoreTime | string  | End of the time range to restore. |

### Restore table status
The **provisioningState** property indicates the current state of the restore table operation. The API returns this property when you start the restore, and you can retrieve this property later using a GET operation on the table. The **provisioningState** property has one of the following values:

| Value | Description 
|:---|:---|
| Updating | Restore operation in progress. |
| Succeeded | Restore operation completed. |
| Deleting | Deleting the restored table. |

#### Sample Request
This sample restores data from the month of January 2020 from the *Usage* table to a table called *Usage_RST*. 

**Request**

```http
PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/Usage_RST?api-version=2021-12-01-preview
```

**Request body:**
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

We recommend deleting a restored table when you're done querying the table. This reduces workspace clutter and additional charges for data retention. 

Deleting the restored table does not delete the source table.

> [!NOTE]
> Restored data is available as long as the underlying source data is available. Restored data is deleted when you delete the source table from the workspace or when the source table's retention period ends. However, the empty table will remain if you do not delete it explicitly.   

Call the **Tables - Delete** API to delete the (logical) restore table.

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_RST?api-version=2021-12-01-preview
```

## Next steps

- [Learn more about data retention and archiving data.](data-retention-archive.md)
- [Learn about Search jobs, which is another method for retrieving archived data.](search-jobs.md)