---
title: Restore logs in Azure Monitor
description: Restore a specific time range of data in a Log Analytics workspace for high-performance queries.
ms.topic: conceptual
ms.date: 10/01/2022

---

# Restore logs in Azure Monitor
The restore operation makes a specific time range of data in a table available in the hot cache for high-performance queries. This article describes how to restore data, query that data, and then dismiss the data when you're done.

## Permissions

To restore data from an archived table, you need `Microsoft.OperationalInsights/workspaces/tables/write` and `Microsoft.OperationalInsights/workspaces/restoreLogs/write` permissions to the Log Analytics workspace, for example, as provided by the [Log Analytics Contributor built-in role](../logs/manage-access.md#built-in-roles).

## When to restore logs
Use the restore operation to query data in [Archived Logs](data-retention-archive.md). You can also use the restore operation to run powerful queries within a specific time range on any Analytics table when the log queries you run on the source table can't complete within the log query timeout of 10 minutes.

> [!NOTE]
> Restore is one method for accessing archived data. Use restore to run queries against a set of data within a particular time range. Use [Search jobs](search-jobs.md) to access data based on specific criteria.

## What does restore do?
When you restore data, you specify the source table that contains the data you want to query and the name of the new destination table to be created. 

The restore operation creates the restore table and allocates additional compute resources for querying the restored data using high-performance queries that support full KQL.

The destination table provides a view of the underlying source data, but doesn't affect it in any way. The table has no retention setting, and you must explicitly [dismiss the restored data](#dismiss-restored-data) when you no longer need it. 

## Restore data

# [API](#tab/api-1)
To restore data from a table, call the **Tables - Create or Update** API. The name of the destination table must end with *_RST*.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{user defined name}_RST?api-version=2021-12-01-preview
```

**Request body**

The body of the request must include the following values:

|Name | Type | Description |
|:---|:---|:---|
|properties.restoredLogs.sourceTable | string  | Table with the data to restore. |
|properties.restoredLogs.startRestoreTime | string  | Start of the time range to restore. |
|properties.restoredLogs.endRestoreTime | string  | End of the time range to restore. |

**Restore table status**

The **provisioningState** property indicates the current state of the restore table operation. The API returns this property when you start the restore, and you can retrieve this property later using a GET operation on the table. The **provisioningState** property has one of the following values:

| Value | Description 
|:---|:---|
| Updating | Restore operation in progress. |
| Succeeded | Restore operation completed. |
| Deleting | Deleting the restored table. |

**Sample request**

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
# [CLI](#tab/cli-1)

To restore data from a table, run the [az monitor log-analytics workspace table restore create](/cli/azure/monitor/log-analytics/workspace/table/restore#az-monitor-log-analytics-workspace-table-restore-create) command.

For example:

```azurecli
az monitor log-analytics workspace table restore create --subscription ContosoSID --resource-group ContosoRG  --workspace-name ContosoWorkspace --name Heartbeat_RST --restore-source-table Heartbeat --start-restore-time "2022-01-01T00:00:00.000Z" --end-restore-time "2022-01-08T00:00:00.000Z" --no-wait
```

---

## Query restored data

Restored logs retain their original timestamps. When you run a query on restored logs, set the query time range based on when the data was originally generated.

Set the query time range by either: 

- Selecting **Custom** in the **Time range** dropdown at the top of the query editor and setting **From** and **To** values.<br>  
    or 
- Specifying the time range in the query. For example:

    ```kusto
    let startTime =datetime(01/01/2022 8:00:00 PM);
    let endTime =datetime(01/05/2022 8:00:00 PM);
    TableName_RST
    | where TimeGenerated between(startTime .. endTime)
    ```

## Dismiss restored data

To save costs, we recommend you [delete the restored table](../logs/create-custom-table.md#delete-a-table) to dismiss restored data when you no longer need it.

Deleting the restored table doesn't delete the data in the source table.

> [!NOTE]
> Restored data is available as long as the underlying source data is available. When you delete the source table from the workspace or when the source table's retention period ends, the data is dismissed from the restored table. However, the empty table will remain if you do not delete it explicitly. 

## Limitations
Restore is subject to the following limitations. 

You can: 

- Restore data for a minimum of two days.
- Restore up to 60 TB.
- Run up to two restore processes in a workspace concurrently.
- Run only one active restore on a specific table at a given time. Executing a second restore on a table that already has an active restore will fail. 
- Perform up to four restores per table per week. 

## Pricing model
The charge for restored logs is based on the volume of data you restore, in GB, and the duration for which you keep the restored data. 
- Charges are subject to a minimum restored data volume.
- Charges are prorated hourly and subject to a minimum restore duration.
- For more information, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

For example, if your table holds 500 GB a day and you restore 10 days of data, you'll be charged for 5000 GB a day until you [dismiss the restored data](#dismiss-restored-data).

> [!NOTE]
> There is no charge for querying restored logs.

## Next steps

- [Learn more about data retention and archiving data.](data-retention-archive.md)
- [Learn about Search jobs, which is another method for retrieving archived data.](search-jobs.md)
