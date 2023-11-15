---
title: Add or delete tables and columns in Azure Monitor Logs
description: Create a table with a custom schema to collect logs from any data source. 
author: guywi-ms
ms.author: guywild
ms.reviewer: adi.biran
ms.service: azure-monitor
ms.custom: devx-track-azurepowershell
ms.topic: how-to 
ms.date: 10/23/2023
# Customer intent: As a Log Analytics workspace administrator, I want to create a table with a custom schema to store logs from an Azure or non-Azure data source.
---

# Add or delete tables and columns in Azure Monitor Logs

[Data collection rules](../essentials/data-collection-rule-overview.md) let you [filter and transform log data](../essentials/data-collection-transformations.md) before sending the data to an [Azure table or a custom table](../logs/manage-logs-tables.md#table-type-and-schema). This article explains how to create custom tables and add custom columns to tables in your Log Analytics workspace.  

## Prerequisites

To create a custom table, you need:

- A Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- A [data collection endpoint (DCE)](../essentials/data-collection-endpoint-overview.md).
- A JSON file with the schema of your custom table in the following format:
    ```json
    [
      {
        "TimeGenerated": "supported_datetime_format",
        "<column_name_1>": "<column_name_1_value>",
        "<column_name_2>": "<column_name_2_value>"
      }
    ]
    ``` 
    
    For information about the `TimeGenerated` format, see [supported datetime formats](/azure/data-explorer/kusto/query/scalar-data-types/datetime#supported-formats).

## Create a custom table

Azure tables have predefined schemas. To store log data in a different schema, use data collection rules to define how to collect, transform, and send the data to a custom table in your Log Analytics workspace.

> [!NOTE]
> For information about creating a custom table for logs you ingest with the deprecated Log Analytics agent, also known as MMA or OMS, see [Collect text logs with the Log Analytics agent](../agents/data-sources-custom-logs.md#define-a-custom-log-table).

# [Portal](#tab/azure-portal-1)

To create a custom table in the Azure portal:

1. From the **Log Analytics workspaces** menu, select **Tables**.  

    :::image type="content" source="media/manage-logs-tables/azure-monitor-logs-table-configuration.png" alt-text="Screenshot that shows the Tables screen for a Log Analytics workspace." lightbox="media/manage-logs-tables/azure-monitor-logs-table-configuration.png":::

1. Select **Create** and then **New custom log (DCR-based)**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-custom-log.png" lightbox="media/tutorial-logs-ingestion-portal/new-custom-log.png" alt-text="Screenshot showing new DCR-based custom log.":::

1. Specify a name and, optionally, a description for the table. You don't need to add the *_CL* suffix to the custom table's name - this is added automatically to the name you specify in the portal. 

1. Select an existing data collection rule from the **Data collection rule** dropdown, or select **Create a new data collection rule** and specify the **Subscription**, **Resource group**, and **Name** for the new data collection rule. 

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-data-collection-rule.png" lightbox="media/tutorial-logs-ingestion-portal/new-data-collection-rule.png" alt-text="Screenshot showing new data collection rule.":::

1. Select a [data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-a-data-collection-endpoint) and select **Next**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-table-name.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-table-name.png" alt-text="Screenshot showing custom log table name.":::

1. Select **Browse for files** and locate the JSON file in which you defined the schema of your new table. 

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-browse-files.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-browse-files.png" alt-text="Screenshot showing custom log browse for files.":::

    All log tables in Azure Monitor Logs must have a `TimeGenerated` column populated with the timestamp of the logged event. 

1. If you want to [transform log data before ingestion](../essentials//data-collection-transformations.md) into your table: 

    1. Select **Transformation editor**. 

        The transformation editor lets you create a transformation for the incoming data stream. This is a KQL query that runs against each incoming record. Azure Monitor Logs stores the results of the query in the destination table. 
    
        :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-data-preview.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-data-preview.png" alt-text="Screenshot showing custom log data preview.":::

    1. Select **Run** to view the results. 
    
        :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-query-01.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-query-01.png" alt-text="Screenshot showing initial custom log data query.":::

1. Select **Apply** to save the transformation and view the schema of the table that's about to be created. Select **Next** to proceed.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-final-schema.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-final-schema.png" alt-text="Screenshot showing custom log final schema.":::

1. Verify the final details and select **Create** to save the custom log.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-create.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-create.png" alt-text="Screenshot showing custom log create.":::

# [API](#tab/api-1)

To create a custom table, call the [Tables - Create Or Update API](/rest/api/loganalytics/tables/create-or-update). 

# [CLI](#tab/azure-cli-1)

To create a custom table, run the [az monitor log-analytics workspace table create](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-create) command.
# [PowerShell](#tab/azure-powershell-1)

Use the [Tables - Update PATCH API](/rest/api/loganalytics/tables/update) to create a custom table with the PowerShell code below. This code creates a table called *MyTable_CL* with two columns. Modify this schema to collect a different table. 

> [!IMPORTANT]
> Custom tables have a suffix of *_CL*; for example, *tablename_CL*. The *tablename_CL* in the DataFlows Streams must match the *tablename_CL* name in the Log Analytics workspace.

1. Select the **Cloud Shell** button in the Azure portal and ensure the environment is set to **PowerShell**.

    :::image type="content" source="../logs/media/tutorial-workspace-transformations-api/open-cloud-shell.png" lightbox="../logs/media/tutorial-workspace-transformations-api/open-cloud-shell.png" alt-text="Screenshot of opening Cloud Shell in the Azure portal.":::

1. Copy the following PowerShell code and replace the **Path** parameter with the appropriate values for your workspace in the `Invoke-AzRestMethod` command. Paste it into the Cloud Shell prompt to run it. 

    ```PowerShell
    $tableParams = @'
    {
        "properties": {
            "schema": {
                "name": "MyTable_CL",
                "columns": [
                    {
                        "name": "TimeGenerated",
                        "type": "DateTime"
                    }, 
                    {
                        "name": "RawData",
                        "type": "String"
                    }
                ]
            }
        }
    }
    '@

    Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{workspace}/tables/MyTable_CL?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
    ```

---

## Delete a table

You can delete any table in your Log Analytics workspace that's not an [Azure table](../logs/manage-logs-tables.md#table-type-and-schema). 

> [!NOTE]
> - Deleting a restored table doesn't delete the data in the source table.
> - Azure tables that are part of a solution can be removed from workspace when [deleting the solution](https://learn.microsoft.com/cli/azure/monitor/log-analytics/solution?view=azure-cli-latest#az-monitor-log-analytics-solution-delete). The data remains in workspace for the duration of the retention policy defined for the tables. If the [solution is re-created](https://learn.microsoft.com/cli/azure/monitor/log-analytics/solution?view=azure-cli-latest#az-monitor-log-analytics-solution-create) in the workspace, these tables become visible again.

# [Portal](#tab/azure-portal-2)

To delete a table from the Azure portal:

1. From the Log Analytics workspace menu, select **Tables**.
1. Search for the tables you want to delete by name, or by selecting **Search results** in the **Type** field.
    
    :::image type="content" source="media/search-job/search-results-on-log-analytics-tables-screen.png" alt-text="Screenshot that shows the Tables screen for a Log Analytics workspace with the Filter by name and Type fields highlighted." lightbox="media/search-job/search-results-on-log-analytics-tables-screen.png":::

1. Select the table you want to delete, select the ellipsis ( **...** ) to the right of the table, select **Delete**, and confirm the deletion by typing **yes**.

    :::image type="content" source="media/search-job/delete-table.png" alt-text="Screenshot that shows the Delete Table screen for a table in a Log Analytics workspace." lightbox="media/search-job/delete-table.png":::
    
# [API](#tab/api-2)

To delete a table, call the [Tables - Delete API](/rest/api/loganalytics/tables/delete). 

# [CLI](#tab/azure-cli-2)

To delete a table, run the [az monitor log-analytics workspace table delete](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-delete) command.

# [PowerShell](#tab/azure-powershell-2)

To delete a table using PowerShell:

1. Select the **Cloud Shell** button in the Azure portal and ensure the environment is set to **PowerShell**.

    :::image type="content" source="../logs/media/tutorial-workspace-transformations-api/open-cloud-shell.png" lightbox="../logs/media/tutorial-workspace-transformations-api/open-cloud-shell.png" alt-text="Screenshot of opening Cloud Shell in the Azure portal.":::

1. Copy the following PowerShell code and replace the **Path** parameter with the appropriate values for your workspace in the `Invoke-AzRestMethod` command. Paste it into the Cloud Shell prompt to run it. 


    ```PowerShell
    Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{workspace}/tables/NewCustom_CL?api-version=2021-12-01-preview" -Method DELETE
    ```
    
---
## Add or delete a custom column

You can modify the schema of custom tables and add custom columns to, or delete columns from, a standard table.  

> [!NOTE]
> Column names must start with a letter and can consist of up to 45 alphanumeric characters and underscores (`_`). `_ResourceId`, `id`, `_ResourceId`, `_SubscriptionId`, `TenantId`, `Type`, `UniqueId`, and `Title` are reserved column names. 

# [Portal](#tab/azure-portal-3)

To add a custom column to a table in your Log Analytics workspace, or delete a column:

1. From the **Log Analytics workspaces** menu, select **Tables**.  
1. Select the ellipsis ( **...** ) to the right of the table you want to edit and select **Edit schema**.
    This opens the **Schema Editor** screen.
1. Scroll down to the **Custom Columns** section of the **Schema Editor** screen.
 
    :::image type="content" source="media/create-custom-table/add-or-delete-column-azure-monitor-logs.png" alt-text="Screenshot showing the Schema Editor screen with the Add a column and Delete buttons highlighted." lightbox="media/create-custom-table/add-or-delete-column-azure-monitor-logs.png":::

1. To add a new column: 
    1. Select **Add a column**.
    1. Set the column name and description (optional), and select the expected value type from the **Type** dropdown.
    1. Select **Save** to save the new column.
1. To delete a column, select the **Delete** icon to the left of the column you want to delete.

# [API](#tab/api-3)

To add or delete a custom column, call the [Tables - Create Or Update API](/rest/api/loganalytics/tables/create-or-update). 

# [CLI](#tab/azure-cli-3)

To add or delete a custom column, run the [az monitor log-analytics workspace table update](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-update) command.

# [PowerShell](#tab/azure-powershell-3)

To add a new column to an Azure or custom table, run: 

```powershell
$tableParams = @'
{
    "properties": {
        "schema": {
            "name": "<TableName>",
            "columns": [
                {
                    "name": ""<ColumnName>",
                    "description": "First custom column",
                    "type": "string",
                    "isDefaultDisplay": true,
                    "isHidden": false
                }
            ]
        }
    }
}
'@

Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{workspace}/tables/<TableName>?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
```

The `PUT` call returns the updated table properties, which should include the newly added column.

**Example**

Run this command to add a custom column, called `Custom1_CF`, to the Azure `Heartbeat` table: 

```powershell
$tableParams = @'
{
    "properties": {
        "schema": {
            "name": "Heartbeat",
            "columns": [
                {
                    "name": "Custom1_CF",
                    "description": "The second custom column",
                    "type": "datetime",
                    "isDefaultDisplay": true,
                    "isHidden": false
                }
            ]
        }
    }
}
'@

Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{workspace}/tables/Heartbeat?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
```

Now, to delete the newly added column and add another one instead, run:

```powershell
$tableParams = @'
{
    "properties": {
        "schema": {
            "name": "Heartbeat",
            "columns": [
                {
                    "name": "Custom2_CF",
                    "description": "The second custom column",
                    "type": "datetime",
                    "isDefaultDisplay": true,
                    "isHidden": false
                }
            ]
        }
    }
}
'@

Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{workspace}/tables/Heartbeat?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
```

To delete all custom columns in the table, run:

```powershell
$tableParams = @'
{
    "properties": {
        "schema": {
            "name": "Heartbeat",
            "columns": [
            ]
        }
    }
}
'@

Invoke-AzRestMethod -Path "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/microsoft.operationalinsights/workspaces/{workspace}/tables/Heartbeat?api-version=2021-12-01-preview" -Method PUT -payload $tableParams
```
---

## Next steps

Learn more about:

- [Collecting logs with the Log Ingestion API](../logs/logs-ingestion-api-overview.md)
- [Collecting logs with Azure Monitor Agent](../agents/agents-overview.md)
- [Data collection rules](../essentials/data-collection-endpoint-overview.md)
