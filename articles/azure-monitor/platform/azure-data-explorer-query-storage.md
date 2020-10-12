---
title: 'Query exported data in Azure Storage Account with Azure Data Explorer (Preview)'
description: 'Query data in Azure Storage Account using Azure Data Explorer external tables'
ms.subservice: logs
author: orens
ms.author: bwren
ms.reviewer: bwren
ms.topic: conceptual
ms.date: 07/19/2020

#Customer intent: I want to query data in Azure Data Explorer that was exported from Azure Monitor by creating an ExternalTable
---

# Query exported data from Azure Monitor using Azure Data Explorer

Exporting Data from Azure Monitor enables low-cost retention and the ability to reallocate logs to different regions.
Use Azure Data Explorer to query data that was exported from your Log Analytics workspaces. Once configured, supported data types (tables) that are sent from your workspaces to a Storage Account will be available as a data source for Azure Data Explorer.

The process flow: 

:::image type="content" source="media/azure-data-explorer-query-storage/exported-data-query.png" alt-text="Azure Data Explorer exported data querying flow.":::

1.	Set data export from Log Analytics Workspace to Azure Storage Account
2.	Create External Table in your Azure Data Explorer Cluster and mapping for the data types
3.	Query Data from Azure Data Explorer

## Prerequisites

- Azure Monitor logs can continuously be exported to an Azure Storage Account.
- Not all data types are supported for export initially. See [Data export article](https://docs.microsoft.com/azure/data-explorer/kusto/query/schema-entities/replace!) for supported types.

> [!TIP]
> There is the ability to use an existing Azure Data Explorer cluster or creating a new dedicated cluster with the needed configurations.

## Set up Azure Data Explorer External Tables

To link Azure Data Explorer to an Azure Storage Account, use [External-Tables](https://docs.microsoft.com/azure/data-explorer/kusto/query/schema-entities/externaltables).

An external table is a Kusto schema entity that references data stored outside Kusto database.
Like tables, an external table has a well-defined schema (an ordered list of column name and data type pairs). Unlike tables, data is stored and managed outside of Kusto Cluster.
The exported data from the previous section is saved in JSON lines.

## Create an external table located in Azure Blob Storage

During this process, we need to create a reference between Azure Data Explorer and the Azure Storage Account.
To create an External Table, we need the Json Schema.

To create a reference, we will create an external table and map the parameters.
In the Log Analytics workspace, we will query the relevant table for “getschema” to get all the columns and their data types.

:::image type="content" source="media\azure-data-explorer-query-storage\exported-data-map-schema.jpg" alt-text="Log Analytics table schema.":::

From the output, we can now create the Kusto query for building the external table.
Following the [article](https://docs.microsoft.com/azure/data-explorer/kusto/management/external-tables-azurestorage-azuredatalake), create an external table in a JSON format – run the query from your Azure Data Explorer database.

>[!NOTE]
>The external table creation is built from two processes, first one is creating the external table, and the second one is creating the mapping.

The following PowerShell script will create the “create” commands for the table and the mapping.

```powershell
PARAM(
    $resourcegroupname, #The name of the Azure resource group
    $TableName, # The log lanlyics table you wish to convert to external table
    $MapName, # The name of the map
    $subscriptionId, #The ID of the subscription
    $WorkspaceId, # The log lanlyics WorkspaceId
    $WorkspaceName, # The log lanlyics workspace name
    $BlobURL, # The Blob URL where to save
    $ContainerAccessKey, # The blob container Access Key (Option to add a SAS url)
    $ExternalTableName = $null # The External Table name, null to use the same name
)

if($null -eq $ExternalTableName) {
    $ExternalTableName = $TableName
}

$query = $TableName + ' | getschema | project ColumnName, DataType'

$output = (Invoke-AzOperationalInsightsQuery -WorkspaceId $WorkspaceId -Query $query).Results

$FirstCommand = @()
$SecondCommand = @()

foreach ($record in $output) {
    if ($record.DataType -eq 'System.DateTime') {
        $dataType = 'datetime'
    } else {
        $dataType = 'string'
    }
    $FirstCommand += $record.ColumnName + ":" + "$dataType" + ","
    $SecondCommand += "{`"column`":" + "`"" + $record.ColumnName + "`"," + "`"datatype`":`"$dataType`",`"path`":`"$." + $record.ColumnName + "`"},"
}

$schema = ($FirstCommand -join '') -replace ',$'
$mapping = ($SecondCommand -join '') -replace ',$'

$CreateExternal = @'
.create external table {0} ({1})
kind=blob
partition by (TimeGeneratedPartition:datetime = bin(TimeGenerated, 1min))
pathformat = (datetime_pattern("'y='yyyy'/m='MM'/d='dd'/h='HH'/m='mm", TimeGeneratedPartition))
dataformat=multijson
(
   h@'{2}/subscriptions/{4}/resourcegroups/{6}/providers/microsoft.operationalinsights/workspaces/{5};{3}'

)
with
(
   docstring = "Docs",
   folder = "ExternalTables"
)
'@ -f $TableName, $schema, $BlobURL, $ContainerAccessKey, $subscriptionId, $WorkspaceName, $resourcegroupname

$createMapping = @'
.create external table {0} json mapping "{1}" '[{2}]'
'@ -f $ExternalTableName, $MapName, $mapping

Write-Host -ForegroundColor Red 'Copy and run the following commands (one by one), on your Azure Data Explorer cluster query window to create the external table and mappings:'
write-host -ForegroundColor Green $CreateExternal
Write-Host -ForegroundColor Green $createMapping
```
An output example

:::image type="content" source="media/azure-data-explorer-query-storage/external-table-create-command-output.png" alt-text="ExternalTable create command output.":::

>[!TIP]
>* Copy, paste and run the output of the script in your Azure Data Explorer client tool to create the table and mapping.

### Write a query in Azure Data Explorer to analyze the exported data

After configuring the mapping, we can go ahead and query the Log Analytics exported data from Azure Data Explorer.

:::image type="content" source="media/azure-data-explorer-query-storage/external-table-query.png" alt-text="Query Log Analytics exported data.":::

## Next steps

[Write queries](https://docs.microsoft.com/azure/data-explorer/write-queries)