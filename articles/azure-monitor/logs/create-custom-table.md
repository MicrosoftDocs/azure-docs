---
title: Create custom tables and columns in Azure Monitor Logs
description: Create a table with a custom schema to collect logs from any data source. 
author: guywi-ms
ms.author: guywild
ms.reviewer: adi.biran
ms.service: azure-monitor
ms.topic: how-to 
ms.date: 11/09/2022

# Customer intent:  As a Log Analytics workspace administrator, I want to create a table with a custom schema to store logs from an Azure or non-Azure data source.
---

# Create custom tables and columns in Azure Monitor Logs

Azure Monitor Logs lets you [filter and transform log data before ingestion](../essentials/data-collection-transformations.md) and send the data to a standard [Azure table or a custom table](../logs/manage-logs-tables.md#table-type) in which you can retain the data you need in the format you choose. This article explains how to create custom tables and add custom columns to tables in your Log Analytics workspace.  

> [!NOTE]
> When you [collect logs using Azure Monitor Agent](../agents/agents-overview.md), Azure Monitor Logs creates your custom table automatically when you define the [data collection rule](../agents/agents-overview.md#install-the-agent-and-configure-data-collection) you use to collect logs from the data source. 

## Prerequisites

To create a custom table, you need:

- A Log Analytics workspace where you have at least [contributor rights](../logs/manage-access.md#azure-rbac).
- A [data collection endpoint (DCE)](../essentials/data-collection-endpoint-overview.md).
- A [data collection rule (DCR)](../logs/tutorial-logs-ingestion-api.md#create-data-collection-rule).
  
## Create a custom table

When you create a custom table, you need to set the table schema and the [data collection rule (DCR)](../essentials/data-collection-rule-overview.md) that defines which data to collect, how to transform that data, and where to send that data.

## [Portal](#tab/portal-1)

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

## [PowerShell](#tab/powershell-1)

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
## Create or edit a custom column

<!-- Introduction paragraph -->
1. <!-- Step 1 -->
1. <!-- Step 2 -->
1. <!-- Step n -->

## Delete a custom table

## Next steps
<!-- Add a context sentence for the following links -->
- [Write how-to guides](contribute-how-to-write-howto.md)
- [Links](links-how-to.md)
