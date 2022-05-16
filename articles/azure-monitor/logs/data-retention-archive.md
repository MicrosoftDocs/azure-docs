---
title: Configure data retention and archive in Azure Monitor Logs (Preview)
description: Configure archive settings for a table in a Log Analytics workspace in Azure Monitor.
ms.reviewer: osalzberg
ms.topic: conceptual
ms.date: 01/27/2022
# Customer intent: As an Azure account administrator, I want to set data retention and archive policies to save retention costs.
---

# Configure data retention and archive policies in Azure Monitor Logs (Preview)
Retention policies define when to remove or archive data in a [Log Analytics workspace](log-analytics-workspace-overview.md). Archiving lets you keep older, less used data in your workspace at a reduced cost. 

This article describes how to configure data retention and archiving.

## How retention and archiving work
Each workspace has a default retention policy that's applied to all tables. You can set a different retention policy on individual tables.

:::image type="content" source="media/data-retention-configure/retention-archive.png" alt-text="Overview of data retention and archive periods":::

During the interactive retention period, data is available for monitoring, troubleshooting and analytics. When you no longer use the logs, but still need to keep the data for compliance or occasional investigation, archive the logs to save costs. You can access archived data by [running a search job](search-jobs.md) or [restoring archived logs](restore.md). 

> [!NOTE]
> The archive feature is currently in public preview and can only be set at the table level, not at the workspace level.

## Configure the default workspace retention policy
You can set the workspace default retention policy in the Azure portal to 30, 31, 60, 90, 120, 180, 270, 365, 550, and 730 days. To set a different policy, use the Resource Manager configuration method described below. If you're on the *free* tier, you need to upgrade to the paid tier to change the data retention period.

To set the default workspace retention policy:

1. From the **Logs Analytics workspaces** menu in the Azure portal, select your workspace.
1. Select **Usage and estimated costs** in the left pane. 
1. Select **Data Retention** at the top of the page. 
    
    :::image type="content" source="media/manage-cost-storage/manage-cost-change-retention-01.png" alt-text="Change workspace data retention setting":::
 
1. Move the slider to increase or decrease the number of days, and then select **OK**.  

## Set retention and archive policy by table

You can set retention policies for individual tables, except for workspaces in the legacy Free Trial pricing tier, using Azure Resource Manager APIs. You can’t currently configure data retention for individual tables in the Azure portal.

You can keep data in interactive retention between 4 and 730 days. You can set the archive period for a total retention time of up to 2,555 days (seven years). 

Each table is a subresource of the workspace it's in. For example, you can address the `SecurityEvent` table in [Azure Resource Manager](../../azure-resource-manager/management/overview.md) as:

```
/subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent
```

The table name is case-sensitive. 

# [API](#tab/api-1)

To set the retention and archive duration for a table, call the **Tables - Update** API: 

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2021-12-01-preview
```

> [!NOTE]
> You don't explicitly specify the archive duration in the API call. Instead, you set the total retention, which specifies the retention plus the archive duration.


You can use either PUT or PATCH, with the following difference: 

- The **PUT** API sets *retentionInDays* and *totalRetentionInDays* to the default value if you don't set non-null values.
- The **PATCH** API doesn't change the *retentionInDays* or *totalRetentionInDays* values if you don't specify values. 

**Request body**

The request body includes the values in the following table.

|Name | Type | Description |
| --- | --- | --- |
|properties.retentionInDays | integer  | The table's data retention in days. This value can be between 4 and 730; or 1095, 1460, 1826, 2191, or 2556. <br/>Setting this property to null will default to the workspace retention. For a Basic Logs table, the value is always 8. | 
|properties.totalRetentionInDays | integer  | The table's total data retention including archive period. Set this property to null if you don't want to archive data.  | 

**Example**

This example sets the table's interactive retention to the workspace default of 30 days, and the total retention to two years. This means the archive duration is 23 months.

**Request**

```http
PATCH https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/CustomLog_CL?api-version=2021-12-01-preview
```

**Request body**
```http
{
    "properties": {
        "retentionInDays": null,
        "totalRetentionInDays": 730
    }
}
```

**Response**

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

# [CLI](#tab/cli-1)

To set the retention and archive duration for a table, run the [az monitor log-analytics workspace table update](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-update) command and pass the `--retention-time` and `--total-retention-time` parameters.

This example sets table's interactive retention to 30 days, and the total retention to two years. This means the archive duration is 23 months:

```azurecli
az monitor log-analytics workspace table update --subscription ContosoSID --resource-group ContosoRG --workspace-name ContosoWorkspace --name AzureMetrics --retention-time 30 --total-retention-time 730
```

To reapply the workspace's default interactive retention value to the table and reset its total retention to 0, run the [az monitor log-analytics workspace table update](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-update) command with the `--retention-time` and `--total-retention-time` parameters set to `-1`.

For example:

```azurecli
az monitor log-analytics workspace table update --subscription ContosoSID --resource-group ContosoRG --workspace-name ContosoWorkspace --name Syslog --retention-time -1 --total-retention-time -1
```

---
 
## Get retention and archive policy by table

# [API](#tab/api-2)

To get the retention policy of a particular table (in this example, `SecurityEvent`), call the **Tables - Get** API:

```JSON
GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent?api-version=2021-12-01-preview
```

To get all table-level retention policies in your workspace, don't set a table name; for example:

```JSON
GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables?api-version=2021-12-01-preview
```

# [CLI](#tab/cli-2)

To get the retention policy of a particular table, run the [az monitor log-analytics workspace table show](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-show) command.

For example:

```azurecli
az monitor log-analytics workspace table show --subscription ContosoSID --resource-group ContosoRG --workspace-name ContosoWorkspace --name SecurityEvent
``` 

---

## Purge retained data
When you shorten an existing retention policy, it takes several days for Azure Monitor to remove data that you no longer want to keep. 

If you set the data retention policy to 30 days, you can purge older data immediately using the `immediatePurgeDataOn30Days` parameter in Azure Resource Manager. The purge functionality is useful when you need to remove personal data immediately. The immediate purge functionality isn't available through the Azure portal. 
 
Note that workspaces with a 30-day retention policy might actually keep data for 31 days if you don't set the `immediatePurgeDataOn30Days` parameter.

You can also purge data from a workspace using the [purge feature](personal-data-mgmt.md#how-to-export-and-delete-private-data), which removes personal data. You can’t purge data from archived logs. 

The Log Analytics [Purge API](/rest/api/loganalytics/workspacepurge/purge) doesn't affect retention billing. **To lower retention costs, decrease the retention period for the workspace or for specific tables.** 

## Tables with unique retention policies
By default, two data types - `Usage` and `AzureActivity` - keep data for at least 90 days at no charge. When you increase the workspace retention to more than 90 days, you also increase the retention of these data types, and you'll be charged for retaining this data beyond the 90-day period. These tables are also free from data ingestion charges. 

Tables related to Application Insights resources also keep data for 90 days at no charge. You can adjust the retention policy of each of these tables individually. 

- `AppAvailabilityResults`
- `AppBrowserTimings`
- `AppDependencies`
- `AppExceptions`
- `AppEvents`
- `AppMetrics`
- `AppPageViews`
- `AppPerformanceCounters`, 
- `AppRequests`
- `AppSystemEvents`
- `AppTraces`

## Pricing model

You'll be charged for each day you retain data. The cost of retaining data for part of a day is the same as for a full day.

For more information, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Classic Application Insights resources
Data workspace-based Application Insights resources is stored in a Log Analytics workspace, so it's included in the data retention and archive settings for the workspace. Classic Application Insights resources though, have separate retention settings.

The default retention for Application Insights resources is 90 days. Different retention periods can be selected for each Application Insights resource. The full set of available retention periods is 30, 60, 90, 120, 180, 270, 365, 550 or 730 days. 

To change the retention, from your Application Insights resource, go to the **Usage and Estimated Costs** page and select the **Data Retention** option:

![Screenshot that shows where to change the data retention period.](../app/media/pricing/pricing-005.png)

A several-day grace period begins when the retention is lowered before the oldest data is removed.

The retention can also be [set programatically using PowerShell](../app/powershell.md#set-the-data-retention) using the `retentionInDays` parameter. If you set the data retention to 30 days, you can trigger an immediate purge of older data using the `immediatePurgeDataOn30Days` parameter, which may be useful for compliance-related scenarios. This purge functionality is only exposed via Azure Resource Manager and should be used with extreme care. The daily reset time for the data volume cap can be configured using Azure Resource Manager to set the `dailyQuotaResetTime` parameter.

## Next steps
- [Learn more about Log Analytics workspaces and data retention and archive.](log-analytics-workspace-overview.md)
- [Create a search job to retrieve archive data matching particular criteria.](search-jobs.md)
- [Restore archive data within a particular time range.](restore.md)