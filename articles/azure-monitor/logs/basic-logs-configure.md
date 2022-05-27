---
title: Configure Basic Logs in Azure Monitor (Preview)
description: Configure a table for Basic Logs in Azure Monitor.
ms.topic: conceptual
ms.custom: event-tier1-build-2022
ms.date: 05/15/2022
---

# Configure Basic Logs in Azure Monitor (Preview)

Setting a table's [log data plan](log-analytics-workspace-overview.md#log-data-plans-preview) to *Basic Logs* lets you save on the cost of storing high-volume verbose logs you use for debugging, troubleshooting and auditing, but not for analytics and alerts. This article describes how to configure Basic Logs for a particular table in your Log Analytics workspace.

> [!IMPORTANT]
> You can switch a table's plan once a week. The Basic Logs feature is not available for workspaces in [legacy pricing tiers](cost-logs.md#legacy-pricing-tiers).

## Which tables support Basic Logs?
All tables in your Log Analytics are Analytics tables, by default. You can configure particular tables to use Basic Logs. You can't configure a table for Basic Logs if Azure Monitor relies on that table for specific features.

You can currently configure the following tables for Basic Logs:

- All tables created with the [Data Collection Rule (DCR)-based custom logs API.](custom-logs-overview.md) 
- [ContainerLogV2](/azure/azure-monitor/reference/tables/containerlogv2), which [Container Insights](../containers/container-insights-overview.md) uses and which include verbose text-based log records.
- [AppTraces](/azure/azure-monitor/reference/tables/apptraces), which contains freeform log records for application traces in Application Insights.

> [!NOTE]
> Tables created with the [Data Collector API](data-collector-api.md) do not support Basic Logs.


## Set table configuration
# [API](#tab/api-1)

To configure a table for Basic Logs or Analytics Logs, call the **Tables - Update** API:

```http
PATCH https://management.azure.com/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/Microsoft.OperationalInsights/workspaces/<workspaceName>/tables/<tableName>?api-version=2021-12-01-preview
```
> [!IMPORTANT]
> Use the Bearer token for authentication. Read more about [using Bearer tokens](https://social.technet.microsoft.com/wiki/contents/articles/51140.azure-rest-management-api-the-quickest-way-to-get-your-bearer-token.aspx).

**Request body**

|Name | Type | Description |
| --- | --- | --- |
|properties.plan | string  | The table plan. Possible values are *Analytics* and *Basic*.|

**Example**

This example configures the `ContainerLogV2` table for Basic Logs.

Container Insights uses ContainerLog by default, to switch to using ContainerLogV2, please follow these [instructions](../containers/container-insights-logging-v2.md) before attempting to convert the table to Basic Logs.

**Sample request**

```http
PATCH https://management.azure.com/subscriptions/ContosoSID/resourcegroups/ContosoRG/providers/Microsoft.OperationalInsights/workspaces/ContosoWorkspace/tables/ContainerLogV2?api-version=2021-12-01-preview
```

Use this request body to change to Basic Logs:

```http
{
    "properties": {
        "plan": "Basic"
    }
}
```

Use this request body to change to Analytics Logs:

```http
{
    "properties": {
        "plan": "Analytics"
    }
}
```

**Sample response**

This is the response for a table changed to Basic Logs.

Status code: 200

```http
{
    "properties": {
        "retentionInDays": 8,
        "totalRetentionInDays": 30,
        "archiveRetentionInDays": 22,
        "plan": "Basic",
        "lastPlanModifiedDate": "2022-01-01T14:34:04.37",
        "schema": {...}        
    },
    "id": "subscriptions/ContosoSID/resourcegroups/ContosoRG/providers/Microsoft.OperationalInsights/workspaces/ContosoWorkspace",
    "name": "ContainerLogV2"
}
```

# [CLI](#tab/cli-1)

To configure a table for Basic Logs or Analytics Logs, run the [az monitor log-analytics workspace table update](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-update) command and set the `--plan` parameter to `Basic` or `Analytics`.

For example:

- To set Basic Logs:

    ```azurecli
    az monitor log-analytics workspace table update --subscription ContosoSID --resource-group ContosoRG  --workspace-name ContosoWorkspace --name ContainerLogV2  --plan Basic
    ```

- To set Analytics Logs:

    ```azurecli
    az monitor log-analytics workspace table update --subscription ContosoSID --resource-group ContosoRG  --workspace-name ContosoWorkspace --name ContainerLogV2  --plan Analytics
    ```
   
---

## Check table configuration
# [Portal](#tab/portal-1)

To check the configuration of a table in the Azure portal: 

1. From the **Azure Monitor** menu, select **Logs** and select your workspace for the [scope](scope.md). See [Log Analytics tutorial](log-analytics-tutorial.md#view-table-information) for a walkthrough.
1. Open the **Tables** tab, which lists all tables in the workspace. 

    Basic Logs tables have a unique icon: 
    
    ![Screenshot of the Basic Logs table icon in the table list.](./media/basic-logs-configure/table-icon.png#lightbox)

    You can also hover over a table name for the table information view. This will specify that the table is configured as Basic Logs:
    
    ![Screenshot of the Basic Logs table indicator in the table details.](./media/basic-logs-configure/table-info.png#lightbox)

# [API](#tab/api-2)

To check the configuration of a table, call the **Tables - Get** API:

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2021-12-01-preview
```

**Response Body**

|Name | Type | Description |
| --- | --- | --- |
|properties.plan | string  | The table plan. Either "Analytics" or "Basic". |
|properties.retentionInDays | integer  | The table's data retention in days. In _Basic Logs_, the value is 8 days, fixed. In _Analytics Logs_, between 7 and 730.| 
|properties.totalRetentionInDays | integer  | The table's data retention including Archive period|
|properties.archiveRetentionInDays|integer|The table's archive period (read-only, calculated).|
|properties.lastPlanModifiedDate|String|Last time when plan was set for this table. Null if no change was ever done from the default settings (read-only) 

**Sample Request**

```http
GET https://management.azure.com/subscriptions/ContosoSID/resourcegroups/ContosoRG/providers/Microsoft.OperationalInsights/workspaces/ContosoWorkspace/tables/ContainerLogV2?api-version=2021-12-01-preview
```


**Sample Response**
 
Status code: 200
```http
{
    "properties": {
        "retentionInDays": 8,
        "totalRetentionInDays": 8,
        "archiveRetentionInDays": 0,
        "plan": "Basic",
        "lastPlanModifiedDate": "2022-01-01T14:34:04.37",
        "schema": {...},
        "provisioningState": "Succeeded"        
    },
    "id": "subscriptions/ContosoSID/resourcegroups/ContosoRG/providers/Microsoft.OperationalInsights/workspaces/ContosoWorkspace",
    "name": "ContainerLogV2"
}
```

# [CLI](#tab/cli-2)

To check the configuration of a table, run the [az monitor log-analytics workspace table show](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-show) command.

For example:

```azurecli
az monitor log-analytics workspace table show --subscription ContosoSID --resource-group ContosoRG --workspace-name ContosoWorkspace --name Syslog --output table  
```

---

## Retention and archiving of Basic Logs

Analytics tables retain data based on a [retention and archive policy](data-retention-archive.md) you set.

Basic Logs tables retain data for eight days. When you change an existing table's plan to Basic Logs, Azure archives data that is more than eight days old but still within the table's original retention period.

## Next steps

- [Learn more about the different log plans.](log-analytics-workspace-overview.md#log-data-plans-preview)
- [Query data in Basic Logs.](basic-logs-query.md)
