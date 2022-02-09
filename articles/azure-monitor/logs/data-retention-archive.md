---
title: Configure data retention and archive in Azure Monitor Logs (Preview)
description: Configure archive settings for a table in a Log Analytics workspace in Azure Monitor.
author: bwren
ms.author: bwren
ms.reviewer: osalzberg
ms.subservice: logs
ms.topic: conceptual
ms.date: 01/27/2022

---

# Configure data retention and archive in Azure Monitor Logs (Preview)
Each table in a [Log Analytics workspace](log-analytics-workspace-overview.md) retains data for a specified period of time, after which the data is removed or archived the data with a reduced retention fee. 

Set the retention time to balance your requirement for having data available with reducing your cost for data retention. This article describes the detailed operation of data retention and archive and how to configure it for your workspace or for individual tables.

See [Overview of Log Analytics workspaces](log-analytics-workspace-overview.md) for a description of Log Analytics workspaces and how archived data is related to the different data plans.

> [!NOTE]
> The archive feature is currently in public preview and can only be set at the table level, not at the workspace level.

:::image type="content" source="media/data-retention-configure/retention-archive.png" alt-text="Overview of data retention and archive periods":::

## Data purge
Data is automatically removed from the workspace after the retention or archive period ends. The only way to remove data on demand is to use the [purge feature](personal-data-mgmt.md#how-to-export-and-delete-private-data), which is intended to remove personal data that was accidentally collected. You cannot purge archived logs. 

The Log Analytics [Purge API](/rest/api/loganalytics/workspacepurge/purge) doesn't affect retention billing and is intended to be used for very limited cases. **To reduce your retention bill, the retention period must be reduced either for the workspace or for specific data types.** 

## Workspace default retention
Each workspace has a default retention that's applied to all tables unless they have their own retention set. You cannot define a default archive period (defined by the total retention time) for the workspace but must instead set that value for each table.

If you lower the retention, there's a grace period of several days before the data older than the new retention setting is removed. When you set the data retention to 30 days, you can trigger an immediate purge of older data using the `immediatePurgeDataOn30Days` parameter which eliminates the grace period. This might be useful for compliance-related scenarios where immediate data removal is imperative. You can only perform the immediate purge functionality using Azure Resource Manager, not using the Azure portal.



### Set workspace default retention
You can set the workspace default retention in the Azure portal to distinct periods of 30, 31, 60, 90, 120, 180, 270, 365, 550, and 730 days. If you require another setting, then use the Resource Manager configuration method described below. If you're on the *free* tier, you can't modify the data retention period; you need to upgrade to the paid tier to control this setting.

Workspaces with 30 days retention might actually retain data for 31 days. If it's imperative that data be kept for only 30 days, use Azure Resource Manager to set the retention to 30 days and with the `immediatePurgeDataOn30Days` parameter.


> [!NOTE]
> There is currently no option in the Azure portal to configure data retention for individual tables.

From the **Logs Analytics workspaces** menu in the Azure portal, select your workspace and then **Usage and estimated costs** in the left pane. Select **Data Retention** at the top of the page. Move the slider to increase or decrease the number of days, and then select **OK**.  

:::image type="content" source="media/manage-cost-storage/manage-cost-change-retention-01.png" alt-text="Change workspace data retention setting":::

> [!NOTE]
> When the retention is lowered, there's a grace period of several days before the data older than the new retention setting is removed. 

## Tables with unique cost
By default, two data types - `Usage` and `AzureActivity` - are retained for a minimum of 90 days at no charge. If the workspace retention is increased to more than 90 days, the retention of these data types is also increased. These data types are also free from data ingestion charges. 

The following data types from workspace-based Application Insights resources are also retained for 90 days at no charge by default. Their retention can be adjusted using the retention by data type functionality. 

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


## Retention and archive by table
You can set different retention settings for individual data types from 4 to 730 days (except for workspaces in the legacy Free Trial pricing tier) and an archive period for a total retention time of 2,555 days (7 years). 

> [!NOTE]
> The `Usage` and `AzureActivity` data types can't be set with custom retention. They take on the maximum of the default workspace retention or 90 days. 

Each data type is a sub-resource of the workspace. For example, the SecurityEvent table can be addressed in [Azure Resource Manager](../../azure-resource-manager/management/overview.md) as:

```
/subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent
```

Note that the data type (table) is case-sensitive. To get the current per-data-type retention settings of a particular data type (in this example SecurityEvent), use:

```JSON
GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent?api-version=2021-12-01-preview
```

> [!NOTE]
> Retention is only returned for a data type if the retention is explicitly set for it. Data types that don't have retention explicitly set (and thus inherit the workspace retention) don't return anything from this call. 


```JSON
GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables?api-version=2021-12-01-preview
```

## Set retention and archive duration with the REST API

Use the **Tables - Update** API to set the retention and archive duration for a table. You don't specify the archive duration directly but instead set a total retention that specifies the retention plus the archive duration.

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2021-12-01-preview
```

You can use either PUT or PATCH, with the following difference: 

- With **PUT**, if *retentionInDays* or *totalRetentionInDays* is null or unspecified, its value will be set to default.
- With **PATCH**, if *retentionInDays* or *totalRetentionInDays* is null or unspecified, the existing value will be kept. 


### Request Body
The request body includes the values in the following table.

|Name | Type | Description |
| --- | --- | --- |
|properties.retentionInDays | integer  | The table's data retention in days. This value can be between 4 and 730; or 1095, 1460, 1826, 2191, or 2556. <br/>Setting this property to null will default to the workspace retention. For a Basic Logs table, the value 8 is always. | 
|properties.totalRetentionInDays | integer  | The table's total data retention including archive period. Setting this property to null will default to the properties.retentionInDays value with no archive. | 



### Example
The following table sets table retention to workspace default of 30 days, and total of 2 years. This means that the archive duration would be 23 months.
##### Request

```http
PATCH https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/CustomLog_CL?api-version=2021-12-01-preview
```

### Request body
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

## Next steps
- [Learn more about Log Analytics workspaces and data retention and archive.](log-analytics-workspace-overview.md)
- [Create a search job to retrieve archive data matching particular criteria.](search-jobs.md)
- [Restore archive data within a particular time range.](restore.md)