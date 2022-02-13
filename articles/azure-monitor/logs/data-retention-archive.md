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

# Configure data retention and archive policies in Azure Monitor Logs (Preview)
Each table in a [Log Analytics workspace](log-analytics-workspace-overview.md) retains data based for a period of time and then removes or archives the data with a reduced retention fee. Set a retention policy, balancing your need to have data available with the cost of data retention. 

This article describes how to configure data retention and archive policies for your workspace or for individual tables.

See [Overview of Log Analytics workspaces](log-analytics-workspace-overview.md) for a description of Log Analytics workspaces and how archived data is related to data plans.

> [!NOTE]
> The archive feature is currently in public preview and can only be set at the table level, not at the workspace level.

:::image type="content" source="media/data-retention-configure/retention-archive.png" alt-text="Overview of data retention and archive periods":::

## Configure the default workspace retention policy
Each workspace has a default retention policy that's applied to all tables, but you can set a different retention policy on individual tables. You set an archive policy (defined by the total retention time) individually on each table.

When you shorten an existing retention policy, there's a grace period of several days before Azure Monitor removes data older than the new retention duration. 

When you set the data retention policy to 30 days, you can trigger an immediate purge of older data using the `immediatePurgeDataOn30Days` parameter, which eliminates the grace period. This might be useful for compliance-related scenarios which require immediate data removal. You can only perform the immediate purge functionality using Azure Resource Manager, not using the Azure portal.

Workspaces with a 30-day retention policy might actually retain data for 31 days. If you need to keep data for only 30 days, use Azure Resource Manager to set the retention to 30 days and set the `immediatePurgeDataOn30Days` parameter.

### Configure the default workspace retention policy in Azure portal
You can set the workspace default retention policy in the Azure portal to 30, 31, 60, 90, 120, 180, 270, 365, 550, and 730 days. To set a different policy, use the Resource Manager configuration method described below. If you're on the *free* tier, you can't modify the data retention period; upgrade to the paid tier to control this setting.

To set the default workspace retention policy:

1. From the **Logs Analytics workspaces** menu in the Azure portal, select your workspace.
1. Select **Usage and estimated costs** in the left pane. 
1. Select **Data Retention** at the top of the page. 
    
    :::image type="content" source="media/manage-cost-storage/manage-cost-change-retention-01.png" alt-text="Change workspace data retention setting":::
 
1. Move the slider to increase or decrease the number of days, and then select **OK**.  

## Set table retention and archive policy with Azure Resource Manager
You can set different retention settings for individual data types from 4 to 730 days (except for workspaces in the legacy Free Trial pricing tier) and an archive period for a total retention time of 2,555 days (7 years). 

> [!NOTE]
> There is currently no option in the Azure portal to configure data retention for individual tables.

Each data type is a sub-resource of the workspace. For example, the SecurityEvent table can be addressed in [Azure Resource Manager](../../azure-resource-manager/management/overview.md) as:

```
/subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent
```

> [!NOTE]
> The `Usage` and `AzureActivity` data types can't be set with custom retention. They take on the maximum of the default workspace retention or 90 days. 

Note that the data type (table) is case-sensitive. To get the current per-data-type retention settings of a particular data type (in this example SecurityEvent), use:

```JSON
GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables/SecurityEvent?api-version=2021-12-01-preview
```

> [!NOTE]
> Retention is only returned for a data type if the retention is explicitly set for it. Data types that don't have retention explicitly set (and thus inherit the workspace retention) don't return anything from this call. 


```JSON
GET /subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/MyResourceGroupName/providers/Microsoft.OperationalInsights/workspaces/MyWorkspaceName/Tables?api-version=2021-12-01-preview
```

## Set table retention and archive policy using UPI

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

## Tables with unique retention policies
By default, the tables of two data types - `Usage` and `AzureActivity` - retain data for a minimum of 90 days at no charge. If you lengthen the workspace retention policy to more than 90 days, the retention policy of these data types also increases. These data types are also free from data ingestion charges. 

Tables related to data types from workspace-based Application Insights resources also retain data for 90 days at no charge by default. You can adjust their retention policies using the retention by data type functionality. 

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

## Data purge
Data is automatically removed from the workspace after the retention or archive period ends. The only way to remove data on demand is to use the [purge feature](personal-data-mgmt.md#how-to-export-and-delete-private-data), which is intended to remove personal data that was accidentally collected. You cannot purge archived logs. 

The Log Analytics [Purge API](/rest/api/loganalytics/workspacepurge/purge) doesn't affect retention billing and is intended to be used for very limited cases. **To reduce your retention bill, the retention period must be reduced either for the workspace or for specific data types.** 


## Next steps
- [Learn more about Log Analytics workspaces and data retention and archive.](log-analytics-workspace-overview.md)
- [Create a search job to retrieve archive data matching particular criteria.](search-jobs.md)
- [Restore archive data within a particular time range.](restore.md)