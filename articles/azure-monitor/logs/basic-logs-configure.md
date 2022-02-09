---
title: Configure Basic Logs in Azure Monitor (Preview)
description: Configure a table for Basic Logs in Azure Monitor.
author: bwren
ms.author: bwren
ms.subservice: logs
ms.topic: conceptual
ms.date: 01/13/2022

---

# Configure Basic Logs in Azure Monitor (Preview)
[Basic Logs](log-analytics-workspace-overview.md#log-data-plans-preview) in Azure Monitor reduce the cost for high-value verbose logs that don’t require analytics and alerts. This article describes how to configure Basic Logs for a particular table in your Log Analytics workspace.

> [!IMPORTANT]
> Switching between plans is limited to once a week.

## Tables that support Basic Logs
You configure particular tables your Log Analytics workspace to use Basic Logs. This does not affect other tables in the workspace. Not all tables can be configured for Basic Logs since other Azure Monitor features may rely on these tables.

The following tables can currently be configured as Basic Logs.

- All [custom logs](custom-logs-overview.md) created with direct ingestion. Basic Logs is not supported for tables created with [Data Collector API](data-collector-api.md).
-	[ContainerLog](/azure/azure-monitor/reference/tables/containerlog) and [ContainerLogV2](/azure/azure-monitor/reference/tables/containerlogv2), which are tables used by [Container Insights](../containers/container-insights-overview.md) and include cases verbose text-based log records.
- [AppTraces](/azure/azure-monitor/reference/tables/apptraces), which contains freeform log records for application traces in Application Insights.

## Existing data
Retention for tables configured for Basic Logs is essentials/ays. If you have existing data over 8 days old in a table that you configure for Basic Logs, that data will be moved to [Archived Logs](data-retention-archive.md).


## Configure with REST API
Use **Tables - Update** API call to configure the plan for a table. You can configure the table for Basic Logs or Analytics Logs:

> [!IMPORTANT]
> Use PUT instead of PATCH in the first update of table properties to create the table entity.


```http
PATCH https://management.azure.com/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/tables/<tableName>?api-version=2021-07-01-privatepreview
```

### Request Body
|Name | Type | Description |
| --- | --- | --- |
|properties.plan | string  | The table plan. Possible values are *Analytics* and *Basic*.|



## Example
The following example configures the `ContainerLog` table for Basic Logs.
### Sample Request

```http
PUT https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/ContainerLog?api-version=2021-07-01-privatepreview
```

Use the following request body to change to Basic Logs:

```http
{
    "properties": {
        "plan": "Basic"
    }
}
```

Use the following request body to change to Analytics Logs:

```http
{
    "properties": {
        "plan": "Analytics"
    }
}
```

### Sample Response
The following response is for a table changed to Basic Logs.

Status code: 200

```http
{
    "properties": {
        "retentionInDays": 8,
        "totalRetentionInDays": 30,
        "archiveRetentionInDays": 22,
        "plan": "Basic",
        "lastPlanModifiedDate": "Mon, 01 Nov 2021 15:04:54 GMT",
        "schema": {...}        
    },
    "id": "subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/ContainerLog",
    "name": "ContainerLog"
}
```


## Check configuration
You can check the configuration for a particular table from Log Analytics in the Azure portal. From the **Azure Monitor** menu, select **Logs** and then make sure that your workspace is selected for the [scope](scope.md). Open the **Tables** tab, which lists all the tables in the workspace. See [Log Analytics tutorial](log-analytics-tutorial.md#view-table-information) for a walkthrough.

When browsing the list of tables, Basic Logs tables are identified with a unique icon: 

![Screenshot of the Basic Logs table icon in the table list.](./media/basic-logs-configure/table-icon.png)

You can also hover over a table name for the table information view. This will specify that the table is configured as Basic Logs:

![Screenshot of the Basic Logs table indicator in the table details.](./media/basic-logs-configure/table-info.png)

You can also use **Tables - Get** API call to check whether the table is configured as _Basic Logs_ or _Analytics Logs_.

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2021-07-01-privatepreview
```

### Response Body
|Name | Type | Description |
| --- | --- | --- |
|properties.plan | string  | The table plan. Either "Analytics" or "Basic". |
|properties.retentionInDays | integer  | The table's data retention in days. In _Basic Logs_, the value is 8 days, fixed. In _Analytics Logs_, between 7 and 730.| 
|properties.totalRetentionInDays | integer  | The table's data retention including Archive period|
|properties.archiveRetentionInDays|integer|The table's archive period (read-only, calculated).|
|properties.lastPlanModifiedDate|String|Last time when plan was set for this table. Null if no change was ever done from the default settings (read-only) 

### Sample Request
```http
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/ContainerLog?api-version=2021-07-01-privatepreview
```


### Sample Response 
Status code: 200
```http
{
    "properties": {
        "retentionInDays": 8,
        "totalRetentionInDays": 8,
        "archiveRetentionInDays": 0,
        "plan": "Basic",
        "lastPlanModifiedDate": "Mon, 01 Nov 2021 15:04:54 GMT",
        "schema": {...},
        "provisioningState": "Succeeded"        
    },
    "id": "subscriptions/00000000-0000-0000-0000-00000000000/resourcegroups/testRG/providers/Microsoft.OperationalInsights/workspaces/testWS/tables/ContainerLog",
    "name": "ContainerLog"
}
```

> You need to use the Bearer token for authentication. [Read More](https://social.technet.microsoft.com/wiki/contents/articles/51140.azure-rest-management-api-the-quickest-way-to-get-your-bearer-token.aspx)

## Next steps

- [Learn more about the different log plans.](log-analytics-workspace-overview.md#log-data-plans-preview)
- [Query data in Basic Logs.](basic-logs-query.md).