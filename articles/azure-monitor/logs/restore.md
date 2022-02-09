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
> Restore is one method for accessing archived data. Use restore to run queries against a set of data in a particular time range. Use [Search jobs](search-jobs.md) to access data based on specific criteria.

## What does restore do?
When you restore data, you specify the source table that contains the archived data and a destination table to store the restored data. This table is in the same workspace as the source table and provides a view of the underlying source data. You can then use regular [log queries](log-query-overview.md) to retrieve data from the restored table. 

The restored table has no retention setting, and you must explicitly [delete the table](#delete-restored-table) when you no longer require it. 

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
Call the **Tables - Create** or **Tables - Update** API to restore archived data:

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_RST?api-version=2021-12-01-preview
```
### Request Body
The body of the request must include the following values:

|Name | Type | Description |
|:---|:---|:---|
|properties.restoredLogs.sourceTable | string  | Table with the archived data to restore. |
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

## Delete restored table

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