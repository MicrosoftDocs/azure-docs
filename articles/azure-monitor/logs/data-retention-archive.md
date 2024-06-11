---
title: Data retention and archive in Azure Monitor Logs
description: Configure archive settings for a table in a Log Analytics workspace in Azure Monitor.
ms.reviewer: adi.biran
ms.topic: conceptual
ms.date: 6/28/2023
# Customer intent: As an Azure account administrator, I want to set data retention and archive policies to save retention costs.
---

# Data retention and archive in Azure Monitor Logs

Azure Monitor Logs retains data in two states:

* **Interactive retention**: Lets you retain Analytics logs for [interactive queries](../logs/get-started-queries.md) of up to 2 years.
* **Archive**: Lets you keep older, less used data in your workspace at a reduced cost. You can access data in the archived state by using [search jobs](../logs/search-jobs.md) and [restore](../logs/restore.md). You can keep data in archived state for up to 12 years. 

This article describes how to configure data retention and archiving.

## How retention and archiving work

Each workspace has a default retention setting that's applied to all tables. You can configure a different retention setting on individual tables.

:::image type="content" source="media/data-retention-configure/retention-archive.png" lightbox="media/data-retention-configure/retention-archive.png" alt-text="Diagram that shows an overview of data retention and archive periods.":::

During the interactive retention period, data is available for monitoring, troubleshooting, and analytics. When you no longer use the logs, but still need to keep the data for compliance or occasional investigation, archive the logs to save costs.

Archived data stays in the same table, alongside the data that's available for interactive queries. When you set a total retention period that's longer than the interactive retention period, Log Analytics automatically archives the relevant data immediately at the end of the retention period.

You can access archived data by [running a search job](search-jobs.md) or [restoring archived logs](restore.md).

> [!NOTE]
> The archive period can only be set at the table level, not at the workspace level.

### Adjustments to retention and archive settings

When you shorten an existing retention setting, Azure Monitor waits 30 days before removing the data, so you can revert the change and avoid data loss in the event of an error in configuration. You can [purge data](../logs/personal-data-mgmt.md#delete) immediately when required. 

When you increase the retention setting, the new retention period applies to all data that's already been ingested into the table and hasn't yet been purged or removed.   

If you change the archive settings on a table with existing data, the relevant data in the table is also affected immediately. For example, you might have an existing table with 180 days of interactive retention and no archive period. You decide to change the retention setting to 90 days of interactive retention without changing the total retention period of 180 days. Log Analytics immediately archives any data that's older than 90 days and none of the data is deleted.

### What happens to data when you delete a table in a Log Analytics workspace

A Log Analytics workspace can contain several [types of tables](../logs/manage-logs-tables.md#table-type-and-schema). What happens when you delete the table is different for each:

|Table type|Data retention|Recommendations|
|-|-|-|
|Azure table |An Azure table holds logs from an Azure resource or data required by an Azure service or solution and cannot be deleted. When you stop streaming data from the resource, service, or solution, data remains in the workspace until the end of the retention period defined for the table or for the default workspace retention, if you do not define table-level retention. |To minimize charges, set [table-level retention](#configure-retention-and-archive-at-the-table-level) to four days before you stop streaming logs to the table.|
|[Restored table](./restore.md) `(table_RST`)| Deletes the hot cache provisioned for the restore, but source table data isn't deleted.||
|[Search results table](./search-jobs.md) (`table_SRCH`)| Deletes the table and data immediately and permanently.||
|[Custom log table](./create-custom-table.md#create-a-custom-table) (`table_CL`)| Soft deletes the table until the end of the table-level retention or default workspace retention period. During the soft delete period, you continue to pay for data retention and can recreate the table and access the data by setting up a table with the same name and schema. Fourteen days after you delete a custom table, Azure Monitor removes the table-level retention configuration and applies the default workspace retention.|To minimize charges, set [table-level retention](#configure-retention-and-archive-at-the-table-level) to four days before you delete the table.|

## Permissions required

| Action | Permissions required |
|:-------|:---------------------|
| Configure data retention and archive policies for a Log Analytics workspace | `Microsoft.OperationalInsights/workspaces/write` and `microsoft.operationalinsights/workspaces/tables/write` permissions to the Log Analytics workspace, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example |
| Get the retention and archive policy by table for a Log Analytics workspace | `Microsoft.OperationalInsights/workspaces/tables/read` permissions to the Log Analytics workspace, as provided by the [Log Analytics Reader built-in role](./manage-access.md#log-analytics-reader), for example |
| Purge data from a Log Analytics workspace | `Microsoft.OperationalInsights/workspaces/purge/action` permissions to the Log Analytics workspace, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example |
## Configure the default workspace retention

You can set a Log Analytics workspace's default retention in the Azure portal to 30, 31, 60, 90, 120, 180, 270, 365, 550, and 730 days. You can apply a different setting to specific tables by [configuring retention and archive at the table level](#configure-retention-and-archive-at-the-table-level). If you're on the *free* tier, you need to upgrade to the paid tier to change the data retention period.

> [!IMPORTANT]
> Workspaces with a 30-day retention might keep data for 31 days. If you need to retain data for 30 days only to comply with a privacy policy, configure the default workspace retention to 30 days using the API and update the `immediatePurgeDataOn30Days` workspace property to `true`. This operation is currently only supported using the [Workspaces - Update API](/rest/api/loganalytics/workspaces/update).

# [Portal](#tab/portal-3)

To set the default workspace retention:

1. From the **Log Analytics workspaces** menu in the Azure portal, select your workspace.
1. Select **Usage and estimated costs** in the left pane.
1. Select **Data Retention** at the top of the page.
    
    :::image type="content" source="media/manage-cost-storage/manage-cost-change-retention-01.png" lightbox="media/manage-cost-storage/manage-cost-change-retention-01.png" alt-text="Screenshot that shows changing the workspace data retention setting.":::

1. Move the slider to increase or decrease the number of days, and then select **OK**.

# [API](#tab/api-3)

To set the retention and archive duration for a table, call the [Workspaces - Create Or Update API](/rest/api/loganalytics/workspaces/create-or-update):

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}?api-version=2023-09-01
```

**Request body**

The request body includes the values in the following table.

|Name | Type | Description |
| --- | --- | --- |
|`properties.retentionInDays` | integer  | The workspace data retention in days. Allowed values are per pricing plan. See pricing tiers documentation for details. |
|`location`|string| The geo-location of the resource.|
|`immediatePurgeDataOn30Days`|boolean|Flag that indicates whether data is immediately removed after 30 days and is non-recoverable. Applicable only when workspace retention is set to 30 days.|


**Example**

This example sets the workspace's retention to the workspace default of 30 days and ensures that data is immediately removed after 30 days and is non-recoverable.

**Request**

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}?api-version=2023-09-01

{
  "properties": {
    "retentionInDays": 30,
    "features": {"immediatePurgeDataOn30Days": true}
    },
"location": "australiasoutheast"
}

**Response**

Status code: 200

```http
{
  "properties": {
    ...
    "retentionInDays": 30,
    "features": {
      "legacy": 0,
      "searchVersion": 1,
      "immediatePurgeDataOn30Days": true,
      ...
    },
    ...
```


# [CLI](#tab/cli-3)

To set the retention and archive duration for a table, run the [az monitor log-analytics workspace update](/cli/azure/monitor/log-analytics/workspace/#az-monitor-log-analytics-workspace-update) command and pass the `--retention-time` parameter.

This example sets the table's interactive retention to 30 days, and the total retention to two years, which means that the archive duration is 23 months:

```azurecli
az monitor log-analytics workspace update --resource-group myresourcegroup --retention-time 30 --workspace-name myworkspace
```

# [PowerShell](#tab/PowerShell-3)

Use the [Set-AzOperationalInsightsWorkspace](/powershell/module/az.operationalinsights/Set-AzOperationalInsightsWorkspace) cmdlet to set the retention for a workspace. This example sets the workspace's retention to 30 days:

```powershell
Set-AzOperationalInsightsWorkspace -ResourceGroupName "myResourceGroup" -Name "MyWorkspace" -RetentionInDays 30
```
---

## Configure retention and archive at the table level

By default, all tables in your workspace inherit the workspace's interactive retention setting and have no archive. You can modify the retention and archive settings of individual tables, except for workspaces in the legacy Free Trial pricing tier.

The Analytics log data plan includes 31 days of interactive retention for workspaces in current-generation pricing tiers (Pay-as-you-go and Commitment Tiers as well as the legacy Standalone and Per Node tiers). You can increase the interactive retention period to up to 730 days at an [additional cost](https://azure.microsoft.com/pricing/details/monitor/). If needed, you can reduce the interactive retention period to as little as four days using the API or CLI. However, since 31 days of interactive retention are included in the ingestion price, lowering the retention period below 31 days doesn't reduce costs. You can set the archive period to a total retention time of up to 4,383 days (12 years).

> [!NOTE]
> Currently, you can set total retention to up to 12 years through the Azure portal and API. CLI and PowerShell are limited to seven years; support for 12 years will follow.

# [Portal](#tab/portal-1)

To set the retention and archive duration for a table in the Azure portal:

1. From the **Log Analytics workspaces** menu, select **Tables**.

    The **Tables** screen lists all the tables in the workspace.

1. Select the context menu for the table you want to configure and select **Manage table**.

    :::image type="content" source="media/basic-logs-configure/log-analytics-table-configuration.png" lightbox="media/basic-logs-configure/log-analytics-table-configuration.png" alt-text="Screenshot that shows the Manage table button for one of the tables in a workspace.":::

1. Configure the retention and archive duration in the **Data retention settings** section of the table configuration screen.

    :::image type="content" source="media/data-retention-configure/log-analytics-configure-table-retention-archive.png" lightbox="media/data-retention-configure/log-analytics-configure-table-retention-archive.png" alt-text="Screenshot that shows the data retention settings on the table configuration screen.":::

# [API](#tab/api-1)

To set the retention and archive duration for a table, call the [Tables - Update API](/rest/api/loganalytics/tables/update):

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2022-10-01
```

> [!NOTE]
> You don't explicitly specify the archive duration in the API call. Instead, you set the total retention, which is the sum of the interactive retention plus the archive duration.

You can use either PUT or PATCH, with the following difference:

- The **PUT** API sets `retentionInDays` and `totalRetentionInDays` to the default value if you don't set non-null values.
- The **PATCH** API doesn't change the `retentionInDays` or `totalRetentionInDays` values if you don't specify values.

**Request body**

The request body includes the values in the following table.

|Name | Type | Description |
| --- | --- | --- |
|properties.retentionInDays | integer  | The table's data retention in days. This value can be between 4 and 730. <br/>Setting this property to null applies the workspace retention period. For a Basic Logs table, the value is always 8. |
|properties.totalRetentionInDays | integer  | The table's total data retention including archive period. This value can be between 4 and 730; or 1095, 1460, 1826, 2191, 2556, 2922, 3288, 3653, 4018, or 4383. Set this property to null if you don't want to archive data.  |

**Example**

This example sets the table's interactive retention to the workspace default of 30 days, and the total retention to two years, which means that the archive duration is 23 months.

**Request**

```http
PATCH https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/CustomLog_CL?api-version=2022-10-01
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

This example sets the table's interactive retention to 30 days, and the total retention to two years, which means that the archive duration is 23 months:

```azurecli
az monitor log-analytics workspace table update --subscription ContosoSID --resource-group ContosoRG --workspace-name ContosoWorkspace --name AzureMetrics --retention-time 30 --total-retention-time 730
```

To reapply the workspace's default interactive retention value to the table and reset its total retention to 0, run the [az monitor log-analytics workspace table update](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-update) command with the `--retention-time` and `--total-retention-time` parameters set to `-1`.

For example:

```azurecli
az monitor log-analytics workspace table update --subscription ContosoSID --resource-group ContosoRG --workspace-name ContosoWorkspace --name Syslog --retention-time -1 --total-retention-time -1
```

# [PowerShell](#tab/PowerShell-1)

Use the [Update-AzOperationalInsightsTable](/powershell/module/az.operationalinsights/Update-AzOperationalInsightsTable) cmdlet to set the retention and archive duration for a table. This example sets the table's interactive retention to 30 days, and the total retention to two years, which means that the archive duration is 23 months:

```powershell
Update-AzOperationalInsightsTable -ResourceGroupName ContosoRG -WorkspaceName ContosoWorkspace -TableName AzureMetrics -RetentionInDays 30 -TotalRetentionInDays 730
```

To reapply the workspace's default interactive retention value to the table and reset its total retention to 0, run the [Update-AzOperationalInsightsTable](/powershell/module/az.operationalinsights/Update-AzOperationalInsightsTable) cmdlet with the `-RetentionInDays` and `-TotalRetentionInDays` parameters set to `-1`.

For example:

```powershell
Update-AzOperationalInsightsTable -ResourceGroupName ContosoRG -WorkspaceName ContosoWorkspace -TableName Syslog -RetentionInDays -1 -TotalRetentionInDays -1
```


---

## Get retention and archive settings by table

# [Portal](#tab/portal-2)

To view the retention and archive duration for a table in the Azure portal, from the **Log Analytics workspaces** menu, select **Tables**.

The **Tables** screen shows the interactive retention and archive period for all the tables in the workspace.

:::image type="content" source="media/data-retention-configure/log-analytics-view-table-retention-archive.png" lightbox="media/data-retention-configure/log-analytics-view-table-retention-archive.png" alt-text="Screenshot that shows the Manage table button for one of the tables in a workspace.":::



# [API](#tab/api-2)

To get the retention setting of a particular table (in this example, `SecurityEvent`), call the **Tables - Get** API:

```JSON
GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent?api-version=2022-10-01
```

To get all table-level retention settings in your workspace, don't set a table name. 

For example:

```JSON
GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables?api-version=2022-10-01
```

# [CLI](#tab/cli-2)

To get the retention setting of a particular table, run the [az monitor log-analytics workspace table show](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-show) command.

For example:

```azurecli
az monitor log-analytics workspace table show --subscription ContosoSID --resource-group ContosoRG --workspace-name ContosoWorkspace --name SecurityEvent
``` 

# [PowerShell](#tab/PowerShell-2)

To get the retention setting of a particular table, run the [Get-AzOperationalInsightsTable](/powershell/module/az.operationalinsights/get-azoperationalinsightstable) cmdlet.

For example:

```powershell
Get-AzOperationalInsightsTable -ResourceGroupName ContosoRG -WorkspaceName ContosoWorkspace -tableName SecurityEvent
``` 


---


## Tables with unique retention periods

By default, two data types, `Usage` and `AzureActivity`, keep data for at least 90 days at no charge. When you increase the workspace retention to more than 90 days, you also increase the retention of these data types. These tables are also free from data ingestion charges.

Tables related to Application Insights resources also keep data for 90 days at no charge. You can adjust the retention of each of these tables individually:

- `AppAvailabilityResults`
- `AppBrowserTimings`
- `AppDependencies`
- `AppExceptions`
- `AppEvents`
- `AppMetrics`
- `AppPageViews`
- `AppPerformanceCounters`
- `AppRequests`
- `AppSystemEvents`
- `AppTraces`

## Pricing model

The charge for maintaining archived logs is calculated based on the volume of data you archive, in GB, and the number or days for which you archive the data. Log data that has `_IsBillable == false` is not subject to retention or archive charges. 

For more information, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Next steps

Learn more about:

- [Managing personal data in Azure Monitor Logs](../logs/personal-data-mgmt.md)
- [Creating a search job to retrieve archive data matching particular criteria](search-jobs.md)
- [Restore archive data within a particular time range](restore.md)
