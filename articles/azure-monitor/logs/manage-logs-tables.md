---
title: Manage tables in a Log Analytics workspace 
description: Learn how to manage table settings in a Log Analytics workspace based on your data analysis and cost management needs.
ms.author: guywild
ms.reviewer: adi.biran
ms.topic: conceptual
ms.date: 11/09/2022
# Customer intent: As a Log Analytics workspace administrator, I want to understand how table properties work and how to view and manage table properties so that I can manage the data and costs related to a Log Analytics workspace effectively.

---

# Manage tables in a Log Analytics workspace

A Log Analytics workspace lets you collect logs from Azure and non-Azure resources into one space for data analysis, use by other services, such as [Sentinel](../../../articles/sentinel/overview.md), and to trigger alerts and actions, for example, using [Azure Logic Apps](../../connectors/connectors-azure-monitor-logs.md). The Log Analytics workspace consists of tables, which you can configure to manage your data model and log-related costs. This article explains the table configuration options in Azure Monitor Logs and how to set table properties based on your data analysis and cost management needs.

## Permissions required

You must have `microsoft.operationalinsights/workspaces/tables/write` permissions to the Log Analytics workspaces you manage, as provided by the [Log Analytics Contributor built-in role](./manage-access.md#log-analytics-contributor), for example.

## Table properties

This diagram provides an overview of the table configuration options in Azure Monitor Logs:

:::image type="content" source="media/manage-logs-tables/azure-monitor-logs-table-management.png" alt-text="Diagram that shows table configuration options, including table type, table schema, table plan, and retention and archive." lightbox="media/manage-logs-tables/azure-monitor-logs-table-management.png":::

### Table type and schema

A table's schema is the set of columns that make up the table, into which Azure Monitor Logs collects log data from one or more data sources.

Your Log Analytics workspace can contain the following types of tables:

| Table type     | Data source                                                            | Schema                                                                                                                                                                                      |
|-----------------|-------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Azure table    | Logs from Azure resources or required by Azure services and solutions. | Azure Monitor Logs creates Azure tables automatically based on Azure services you use and [diagnostic settings](../essentials/diagnostic-settings.md) you configure for specific resources. Each Azure table has a predefined schema. You can [add columns to an Azure table](../logs/create-custom-table.md#add-or-delete-a-custom-column) to store transformed log data or enrich data in the Azure table with data from another source.|
| Custom table   | Non-Azure resources and any other data source, such as file-based logs. | You can [define a custom table's schema](../logs/create-custom-table.md) based on how you want to store data you collect from a given data source.                                                                                                                                      |
| Search results | All data stored in a Log Analytics workspace.                                             | The schema of a search results table is based on the query you define when you [run the search job](../logs/search-jobs.md). You can't edit the schema of existing search results tables.                                                                                        |
| Restored logs  | Archived logs.                                                         | A restored logs table has the same schema as the table from which you [restore logs](../logs/restore.md). You can't edit the schema of existing restored logs tables.                                                                                          |

### Log data plan

[Configure a table's log data plan](../logs/basic-logs-configure.md) based on how often you access the data in the table: 
- The **Analytics** plan makes log data available for interactive queries and use by features and services. 
- The **Basic** log data plan provides a low-cost way to ingest and retain logs for troubleshooting, debugging, auditing, and compliance. 

### Retention and archive

Archiving is a low-cost solution for keeping data that you no longer use regularly in your workspace for compliance or occasional investigation. [Set table-level retention](../logs/data-retention-archive.md) to override the default workspace retention and to archive data within your workspace. 

To access archived data, [run a search job](../logs/search-jobs.md) or [restore data for a specific time range](../logs/restore.md).

### Ingestion-time transformations

Reduce costs and analysis effort by using data collection rules to [filter out and transform data before ingestion](../essentials/data-collection-transformations.md) based on the schema you define for your custom table.    

## View table properties

> [!NOTE]
> The table name is case sensitive.

# [Portal](#tab/azure-portal)

To view and set table properties in the Azure portal:

1. From your Log Analytics workspace, select **Tables**.   

    The **Tables** screen presents table configuration information for all tables in your Log Analytics workspace. 

    :::image type="content" source="media/manage-logs-tables/azure-monitor-logs-table-configuration.png" alt-text="Screenshot that shows the Tables screen for a Log Analytics workspace." lightbox="media/manage-logs-tables/azure-monitor-logs-table-configuration.png":::

1. Select the ellipsis (**...**) to the right of a table to open the table management menu.

    The available table management options vary based on the table type. 

    1. Select **Manage table** to edit the table properties.
    
    1. Select **Edit schema** to view and edit the table schema.

# [API](#tab/api)

To view table properties, call the [Tables - Get API](/rest/api/loganalytics/tables/get):

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/{tableName}?api-version=2021-12-01-preview
```

**Response body**

|Name | Type | Description |
| --- | --- | --- |
|properties.plan | string  | The table plan. Either `Analytics` or `Basic`. |
|properties.retentionInDays | integer  | The table's data retention in days. In `Basic Logs`, the value is eight days, fixed. In `Analytics Logs`, the value is between four and 730 days.|
|properties.totalRetentionInDays | integer  | The table's data retention that also includes the archive period.|
|properties.archiveRetentionInDays|integer|The table's archive period (read-only, calculated).|
|properties.lastPlanModifiedDate|String|Last time when the plan was set for this table. Null if no change was ever done from the default settings (read-only).

**Sample request**

```http
GET https://management.azure.com/subscriptions/ContosoSID/resourcegroups/ContosoRG/providers/Microsoft.OperationalInsights/workspaces/ContosoWorkspace/tables/ContainerLogV2?api-version=2021-12-01-preview
```

**Sample response**
 
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

To set table properties, call the [Tables - Create Or Update API](/rest/api/loganalytics/tables/create-or-update). 

# [Azure CLI](#tab/azure-cli)

To view table properties using Azure CLI, run the [az monitor log-analytics workspace table show](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-show) command.

For example:

```azurecli 
az monitor log-analytics workspace table show --subscription ContosoSID --resource-group ContosoRG --workspace-name ContosoWorkspace --name Syslog --output table  
```

To set table properties using Azure CLI, run the [az monitor log-analytics workspace table update](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-update) command.

# [PowerShell](#tab/azure-powershell)

To view table properties using PowerShell, run:

```powershell
Invoke-AzRestMethod -Path "/subscriptions/ContosoSID/resourcegroups/ContosoRG/providers/microsoft.operationalinsights/workspaces/ContosoWorkspace/tables/Heartbeat?api-version=2021-12-01-preview" -Method GET 
```

**Sample response**

```json
{
  "properties": {
    "totalRetentionInDays": 30,
    "archiveRetentionInDays": 0,
    "plan": "Analytics",
    "retentionInDaysAsDefault": true,
    "totalRetentionInDaysAsDefault": true,
    "schema": {
      "tableSubType": "Any",
      "name": "Heartbeat",
      "tableType": "Microsoft",
      "standardColumns": [
        {
          "name": "TenantId",
          "type": "guid",
          "description": "ID of the workspace that stores this record.",
          "isDefaultDisplay": true,
          "isHidden": true
        },
        {
          "name": "SourceSystem",
          "type": "string",
          "description": "Type of agent the data was collected from. Possible values are OpsManager (Windows agent) or Linux.",
          "isDefaultDisplay": true,
          "isHidden": false
        },
        {
          "name": "TimeGenerated",
          "type": "datetime",
          "description": "Date and time the record was created.",
          "isDefaultDisplay": true,
          "isHidden": false
        },
        <OMITTED>
        {
          "name": "ComputerPrivateIPs",
          "type": "dynamic",
          "description": "The list of private IP addresses of the computer.",
          "isDefaultDisplay": true,
          "isHidden": false
        }
      ],
      "solutions": [
        "LogManagement"
      ],
      "isTroubleshootingAllowed": false
    },
    "provisioningState": "Succeeded",
    "retentionInDays": 30
  },
  "id": "/subscriptions/{guid}/resourceGroups/{rg name}/providers/Microsoft.OperationalInsights/workspaces/{ws id}/tables/Heartbeat",
  "name": "Heartbeat"
}
```

Use the [Update-AzOperationalInsightsTable](/powershell/module/az.operationalinsights/Update-AzOperationalInsightsTable) cmdlet to set table properties.

---

## Next steps

Learn how to:

- [Set a table's log data plan](../logs/basic-logs-configure.md)
- [Add custom tables and columns](../logs/create-custom-table.md)
- [Set retention and archive](../logs/data-retention-archive.md)
- [Design a workspace architecture](../logs/workspace-design.md)
