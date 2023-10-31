---
title: Monitor diagnostic logs with Azure Monitor
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Observe and query diagnostic logs from Azure Cosmos DB for MongoDB vCore using Azure Monitor.
author: sajeetharan
ms.author: sasinnat
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: how-to
ms.date: 10/30/2023
# CustomerIntent: As a operations engineer, I want to review diagnostic logs so that I troubleshoot issues as they occur.
---

# Monitor Azure Cosmos DB for MongoDB vCore diagnostics logs with Azure Monitor

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Azure's diagnostic settings are essential for gathering resource logs, enabling the capture of Azure resource Logs. These logs furnish detailed and frequent insights into the resource's operation.

Platform metrics and Activity logs are gathered automatically, but to collect resource logs or route them externally from Azure Monitor, you must establish a diagnostic setting. You have the option to activate diagnostic settings for Azure Cosmos DB accounts and direct resource logs to the destinations listed below

- Log Analytics workspaces
  - Data sent to Log Analytics can be written into **Azure Diagnostics (legacy)** or **Resource-specific (preview)** tables
- Storage Account

## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md).


## Create diagnostic settings

In this guide, we will take you step by step through the process of configuring diagnostic settings for your CosmosDB for MongoDB vCore cluster.

### [Azure CLI](#tab/azure-cli)

#### Create a diagnostic setting for Log Analytics workspace

1. Create shell variables for `diagnosticSettingName`,`subscriptionId`, `resourceName`, `workspaceName` and `resourceGroupName`.

    ```azurecli

    # Variable for subscription id
    subscriptionId="<subscription-id>"

    # Variable for mongo vCore cluster resource
    resourceName="<resource-name>"

    # Variable for resource group name
    resourceGroupName="<workspace-name>"

    # Variable for workspace name
    workspaceName="<workspace-name>"

    # Variable for diagnostic setting name
    diagnosticSettingName="<diagnostic-setting-name>"

    ```

2. Use `az monitor diagnostic-settings create` to create the setting.

    ```azurecli
    az monitor diagnostic-settings create \
    --resource "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.DocumentDb/mongoClusters/$resourceName" \
    --name $diagnosticSettingName \
    --export-to-resource-specific true \
    --logs '[{category:vCoreMongoRequests,enabled:true,retention-policy:{enabled:false,days:0}}]' \
    --workspace "/subscriptions/$subscriptionId/resourcegroups/$resourceGroupName/providers/microsoft.operationalinsights/workspaces/$workspaceName"
    ```


#### Create a diagnostic setting for Azure Storage Account

1. Create shell variables for `storageAccountName`, `diagnosticSettingName`,`subscriptionId`, `resourceName` and `resourceGroupName`.

    ```azurecli

    # Variable for subscription id
    subscriptionId="<subscription-id>"

    # Variable for mongo vCore cluster resource
    resourceName="<resource-name>"

    # Variable for mongo vCore cluster url
    resourceGroupName="<resource-group-name>"

    # Variable for storage account name
    storageAccountName="<storage-account-name>"
    example:"sajopaologgingwestus2"

    # Variable for diagnostic setting name
    diagnosticSettingName="<diagnostic-setting-name>"
    example:"test-setting-law-westus2"
    ```

2. Use `az monitor diagnostic-settings create` to create the setting.

    ```azurecli
     az monitor diagnostic-settings create \
    --resource "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.DocumentDb/mongoClusters/$resourceName" \
    --name $diagnosticSettingName \
    --export-to-resource-specific true \
    --logs '[{category:vCoreMongoRequests,enabled:true,retention-policy:{enabled:false,days:0}}]' \
    --storage-account $storageAccountName
    ```

#### List diagnostic settings for your resource


3. Create shell variables for `subscriptionId`, `resourceName` and `resourceGroupName`.

    ```azurecli

    # Variable for subscription id
    subscriptionId="<subscription-id>"

    # Variable for mongo vCore cluster resource
    resourceName="<resource-name>"

    # Variable for mongo vCore cluster url
    resourceGroupName="<resource-group-name>"
    
    ```

    ```azurecli
    az monitor diagnostic-settings list --resource '/subscriptions/$subscriptionId/resourcegroups/$resourceGroupName/providers/Microsoft.DocumentDB/mongoClusters/$resourceName'
    ```

## Delete a diagnostic setting


4. Create shell variables for `diagnosticSettingName`,`subscriptionId`, `resourceName` and `resourceGroupName`.

    ```azurecli

    # Variable for subscription id
    subscriptionId="<subscription-id>"

    # Variable for mongo vCore cluster resource
    resourceName="<resource-name>"

    # Variable for resource group name
    resourceGroupName="<workspace-name>"

    # Variable for diagnostic setting name
    diagnosticSettingName="<diagnostic-setting-name>"

    ```

    ```azurecli
    az monitor diagnostic-settings delete --name $diagnosticSettingName --resource '/subscriptions/$subscriptionId/resourcegroups/$resourceGroupName/providers/Microsoft.DocumentDB/mongoClusters/$resourceName'
    ```

## Troubleshoot issues with advanced diagnostics queries with Azure Cosmos DB for MongoDB vCore

By enabling the `--export-to-resource-specific true` setting, you ensure that Mongo request log events are efficiently ingested into the vCoreMongoRequests table within Log Analytics  specifically designed with a dedicated schema.  

In contrast, neglecting to configure `--export-to-resource-specific true` would result in Mongo request log events being routed to the general AzureDiagnostics table within Log Analytics.

## Common queries

Common queries are shown in the resource-specific and Azure Diagnostics tables.

You can navigate to Logs blade of the Cosmos DB for MongoDB vCore cluster and you will be able to find some sample queries as listed below.

:::image type="content" source="media/diagnostics/vcore-diagnostics.png" lightbox="media/diagnostics/vcore-diagnostics.png" alt-text="Sreenshot of the diagnostic queries page.":::

### Failed Mongo vCore requests

To count the number of failed Mongo vCore requests by error code.

#### [Resource-specific](#tab/resource-specific)

   ```Kusto
    VCoreMongoRequests
    // Time range filter:  | where TimeGenerated between (StartTime .. EndTime)
    // Resource id filter: | where _ResourceId == "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group-name/providers/microsoft.documentdb/mongoclusters/my-cluster-name"
    | where ErrorCode != 0
    | summarize count() by bin(TimeGenerated, 5m), ErrorCode=tostring(ErrorCode)

   ```
---

### Mongo vCore requests P99 duration by operation

 Get the Mongo vCore requests P99 runtime duration by operation name. 

#### [Resource-specific] 

   ```Kusto
    // Mongo vCore requests P99 duration by operation 
    // Mongo vCore requests P99 runtime duration by operation name. 
    VCoreMongoRequests
    // Time range filter:  | where TimeGenerated between (StartTime .. EndTime)
    // Resource id filter: | where _ResourceId == "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group-name/providers/microsoft.documentdb/mongoclusters/my-cluster-name"
    | summarize percentile(DurationMs, 99) by bin(TimeGenerated, 1h), OperationName
   ```
---


### Mongo vCore requests grouped by duration

 Get the count of Mongo vCore requests grouped by total runtime duration

#### [Resource-specific] 

   ```Kusto
    // Mongo vCore requests binned by duration 
    // Count of Mongo vCore requests binned by total runtime duration. 
    VCoreMongoRequests
    // Time range filter:  | where TimeGenerated between (StartTime .. EndTime)
    // Resource id filter: | where _ResourceId == "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group-name/providers/microsoft.documentdb/mongoclusters/my-cluster-name"
    | project TimeGenerated, DurationBin=tostring(bin(DurationMs, 5))
    | summarize count() by bin(TimeGenerated, 1m), tostring(DurationBin)

   ```
---

### Mongo vCore requests by user agent

 Get the count of Mongo vCore requests by user agent

#### [Resource-specific] 

   ```Kusto
    // Mongo vCore requests by user agent 
    // Count of Mongo vCore requests by user agent. 
    VCoreMongoRequests
    // Time range filter:  | where TimeGenerated between (StartTime .. EndTime)
    // Resource id filter: | where _ResourceId == "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group-name/providers/microsoft.documentdb/mongoclusters/my-cluster-name"
    | summarize count() by bin(TimeGenerated, 1h), UserAgent

   ```
---
## Known Limitations

- This feature cannot be used on M25 (burstable) or M30 (free-tier) SKUs.

## Related content

- Read more about [feature compatibility with MongoDB](compatibility.md).
- Review options for [migrating from MongoDB to Azure Cosmos DB for MongoDB vCore](migration-options.md)
- Get started by [creating an account](quickstart-portal.md).
