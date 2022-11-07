---
title: Add or delete tables and columns in Azure Monitor Logs
description: Create a table with a custom schema to collect logs from any data source. 
author: guywi-ms
ms.author: guywild
ms.reviewer: adi.biran
ms.service: azure-monitor
ms.topic: how-to 
ms.date: 11/09/2022

# Customer intent: As a Log Analytics workspace administrator, I want to create a table with a custom schema to store logs from an Azure or non-Azure data source.
---

# Add or delete tables and columns in Azure Monitor Logs

Azure Monitor Logs lets you [filter and transform log data before ingestion](../essentials/data-collection-transformations.md) and send the data to a standard [Azure table or a custom table](../logs/manage-logs-tables.md#table-type) where you can retain the data you need in the format you choose. This article explains how to create custom tables and add custom columns to tables in your Log Analytics workspace.  

## Prerequisites

To create a custom table, you need:

- A Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- A [data collection endpoint (DCE)](../essentials/data-collection-endpoint-overview.md).
- A JSON file with the schema of your custom table in the following format:
    ```json
    [
      {
        "TimeGenerated": "supported_datetime_format",
        "<column_name_1": "<column_name_1_value>",
        "<column_name_2": "<column_name_2_value>"
      }
    ]
    ``` 
    
    For information about the `TimeGenerated` format, see [supported datetime formats](/azure/data-explorer/kusto/query/scalar-data-types/datetime#supported-formats).
## Create a custom table

When you collect logs using the [Log Ingestion API](../logs/logs-ingestion-api-overview.md), you can send the data to one of the [Azure tables that supports the Log Ingestion API](../logs/logs-ingestion-api-overview.md#built-in-tables), or you can create a custom table to ingest the data into.

> [!NOTE]
> When you [collect logs using Azure Monitor Agent](../agents/agents-overview.md), Azure Monitor Logs creates your custom table automatically when you define your [data collection rule](../agents/agents-overview.md#install-the-agent-and-configure-data-collection). 

### [Portal](#tab/portal-1)

To create a custom table in the Azure portal:

1. From the **Log Analytics workspaces** menu, select **Tables**.  

    :::image type="content" source="media/manage-logs-tables/azure-monitor-logs-table-configuration.png" alt-text="Screenshot that shows the Tables screen for a Log Analytics workspace." lightbox="media/manage-logs-tables/azure-monitor-logs-table-configuration.png":::

1. Select **Create** and then **New custom log (DCR-based)**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-custom-log.png" lightbox="media/tutorial-logs-ingestion-portal/new-custom-log.png" alt-text="Screenshot showing new DCR-based custom log.":::

1. Specify a name and, optionally, a description for the table. You don't need to add the *_CL* suffix to the custom table's name - this is added automatically to the name you specify in the portal. 

1. Select an existing data collection rule from the **Data collection rule** dropdown, or select **Create a new data collection rule** and specify the **Subscription**, **Resource group**, and **Name** for the new data collection rule. 

    :::image type="content" source="media/tutorial-logs-ingestion-portal/new-data-collection-rule.png" lightbox="media/tutorial-logs-ingestion-portal/new-data-collection-rule.png" alt-text="Screenshot showing new data collection rule.":::

4. Select a [data collection endpoint](../essentials/data-collection-endpoint-overview.md#create-data-collection-endpoint) and select **Next**.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-table-name.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-table-name.png" alt-text="Screenshot showing custom log table name.":::

1. Select **Browse for files** and locate the JSON file in which you defined the schema of your new table. 

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-browse-files.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-browse-files.png" alt-text="Screenshot showing custom log browse for files.":::

    All log tables in Azure Monitor Logs must have a `TimeGenerated` column populated with the timestamp of the logged event. 

1. If you want to [transform log data before ingestion](../essentials//data-collection-transformations.md) into your table: 

    1. Select **Transformation editor**. 

        The transformation editor lets you create a transformation for the incoming data stream. This is a KQL query that runs against each incoming record. Azure Monitor Logs stores the results of the query will in the destination table. 
    
        :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-data-preview.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-data-preview.png" alt-text="Screenshot showing custom log data preview.":::

    1. Select **Run** to view the results. 
    
        :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-query-01.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-query-01.png" alt-text="Screenshot showing initial custom log data query.":::

1. Select **Apply** to save the transformation and view the schema of the table that's about to be created. Select **Next** to proceed.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-final-schema.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-final-schema.png" alt-text="Screenshot showing custom log final schema.":::

11. Verify the final details and select **Create** to save the custom log.

    :::image type="content" source="media/tutorial-logs-ingestion-portal/custom-log-create.png" lightbox="media/tutorial-logs-ingestion-portal/custom-log-create.png" alt-text="Screenshot showing custom log create.":::

### [PowerShell](#tab/powershell-1)

Use the [Tables - Update PATCH API](/rest/api/loganalytics/tables/update) to create a custom table with the PowerShell code below. This code creates a table called *MyTable_CL* with two columns. Modify this schema to collect a different table. 

> [!IMPORTANT]
> Custom tables have a suffix of *_CL*; for example, *tablename_CL*. The *tablename_CL* in the DataFlows Streams must match the *tablename_CL* name in the Log Analytics workspace.

1. Click the **Cloud Shell** button in the Azure portal and ensure the environment is set to **PowerShell**.

    :::image type="content" source="../logs/media/tutorial-workspace-transformations-api/open-cloud-shell.png" lightbox="../logs/media/tutorial-workspace-transformations-api/open-cloud-shell.png" alt-text="Screenshot of opening Cloud Shell in the Azure portal.":::

2. Copy the following PowerShell code and replace the **Path** parameter with the appropriate values for your workspace in the `Invoke-AzRestMethod` command. Paste it into the Cloud Shell prompt to run it. 

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

You can delete any table in your Log Analytics workspace that's not an [Azure table](../logs/manage-logs-tables.md#table-type). 

### [Portal](#tab/portal-2)

To delete a table from the Azure portal:

1. From the Log Analytics workspace menu, select **Tables**.
1. Search for the tables you want to delete by name, or by selecting **Search results** in the **Type** field.
    
    :::image type="content" source="media/search-job/search-results-on-log-analytics-tables-screen.png" alt-text="Screenshot that shows the Tables screen for a Log Analytics workspace with the Filter by name and Type fields highlighted." lightbox="media/search-job/search-results-on-log-analytics-tables-screen.png":::

1. Select the table you want to delete, select the ellipsis ( **...** ) to the right of the table, select **Delete**, and confirm the deletion by typing **yes**.

    :::image type="content" source="media/search-job/delete-table.png" alt-text="Screenshot that shows the Delete Table screen for a table in a Log Analytics workspace." lightbox="media/search-job/delete-table.png":::
    
### [API](#tab/api-2)

To delete a table, call the **Tables - Delete** API: 

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}/tables/<TableName>_SRCH?api-version=2021-12-01-preview
```

### [CLI](#tab/cli-2)

To delete a table, run the [az monitor log-analytics workspace table delete](/cli/azure/monitor/log-analytics/workspace/table#az-monitor-log-analytics-workspace-table-delete) command.

For example:

```azurecli
az monitor log-analytics workspace table delete --subscription ContosoSID --resource-group ContosoRG --workspace-name ContosoWorkspace --name HeartbeatByIp_SRCH
```

---
## Add a custom column

To add a custom column to an existing table in your Log Analytics workspace:

1. From the **Log Analytics workspaces** menu, select **Tables**.  
1. Select the ellipsis ( **...** ) to the right of the table you want to edit and select **Edit schema**. 
1. Select **Add column**.
1. Set the column name, description (optional), and expected value type from the **Type** dropdown, and select **Save** to to save the new column.

## Delete a custom column

## Next steps

Learn more about:

- [Log Ingestion API](../logs/logs-ingestion-api-overview.md).
- [Sending custom logs to your Log Analytics workspace using the Azure portal](tutorial-logs-ingestion-portal.md).
- [Sending custom logs o your Log Analytics workspace using Resource Manager templates and REST API](tutorial-logs-ingestion-api.md).
