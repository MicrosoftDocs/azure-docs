---
title: Monitor diagnostic logs with Azure Monitor
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Observe and query diagnostic logs from Azure Cosmos DB for MongoDB vCore using Azure Monitor Log Analytics.
author: sajeetharan
ms.author: sasinnat
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.custom: ignite-2023, devx-track-azurecli
ms.topic: how-to
ms.date: 10/31/2023
# CustomerIntent: As a operations engineer, I want to review diagnostic logs so that I troubleshoot issues as they occur.
---

# Monitor Azure Cosmos DB for MongoDB vCore diagnostics logs with Azure Monitor

[!INCLUDE[MongoDB vCore](../../includes/appliesto-mongodb-vcore.md)]

Azure's diagnostic logs are essential to capture Azure resource logs for an Azure Cosmos DB for MongoDB vCore account. These logs furnish detailed and frequent insights into the operations for resources with the account.

> [!IMPORTANT]
> This feature is not available with `M25` (burstable) or `M30` (free-tier) SKUs.

## Prerequisites

- An existing Azure Cosmos DB for MongoDB vCore cluster.
  - If you don't have an Azure subscription, [create an account for free](https://azure.microsoft.com/free).
  - If you have an existing Azure subscription, [create a new Azure Cosmos DB for MongoDB vCore cluster](quickstart-portal.md).
- An existing Log Analytics workspace or Azure Storage account.

## Create diagnostic settings

Platform metrics and Activity logs are gathered automatically. To collect resource logs and route them externally from Azure Monitor, you must establish a diagnostic setting. When you activate diagnostic settings for Azure Cosmos DB accounts, you must choose to route them to either a Log Analytics workspace or an Azure Storage account.

### [Log Analytics workspace](#tab/log-analytics)

1. Create shell variables for `clusterName` and `resourceGroupName`.

    ```azurecli
    # Variable for API for MongoDB vCore cluster resource
    clusterName="<resource-name>"

    # Variable for resource group
    resourceGroupName="<resource-group-name>"
    ```

1. Create shell variables for `workspaceName` and `diagnosticSettingName`,

    ```azurecli
    # Variable for workspace name
    workspaceName="<storage-account-name>"

    # Variable for diagnostic setting name
    diagnosticSettingName="<diagnostic-setting-name>"
    ```

    > [!NOTE]
    > For example, if the Log Analytics workspace's name is `test-workspace` and the diagnostic settings' name is `test-setting`:
    >
    > ```azurecli
    > workspaceName="test-workspace"
    > diagnosticSettingName:"test-setting"
    > ```
    >

1. Get the resource identifier for the API for MongoDB vCore cluster.

    ```azurecli
    az cosmosdb mongocluster show \
        --resource-group $resourceGroupName \
        --cluster-name $clusterName

    clusterResourceId=$(az cosmosdb mongocluster show \
        --resource-group $resourceGroupName \
        --cluster-name $clusterName \
        --query "id" \
        --output "tsv" \
    )
    ```

1. Get the resource identifier for the Log Analytics workspace.

    ```azurecli
    az monitor log-analytics workspace show \
        --resource-group $resourceGroupName \
        --name $workspaceName

    workspaceResourceId=$(az monitor log-analytics workspace show \
        --resource-group $resourceGroupName \
        --name $workspaceName \
        --query "id" \
        --output "tsv" \
    )
    ```

1. Use `az monitor diagnostic-settings create` to create the setting.

    ```azurecli
    az monitor diagnostic-settings create \
        --resource-group $resourceGroupName \
        --name $diagnosticSettingName \
        --resource $clusterResourceId \
        --export-to-resource-specific true \
        --logs '[{category:vCoreMongoRequests,enabled:true,retention-policy:{enabled:false,days:0}}]' \
        --workspace $workspaceResourceId
    ```

    > [!IMPORTANT]
    > By enabling the `--export-to-resource-specific true` setting, you ensure that the API for MongoDB vCore request log events are efficiently ingested into the `vCoreMongoRequests` table specifically designed with a dedicated schema.
    >
    > In contrast, neglecting to configure `--export-to-resource-specific true` would result in the API for MongoDB vCore request log events being routed to the general `AzureDiagnostics` table.

### [Azure Storage account](#tab/azure-storage)

1. Create shell variables for `clusterName` and `resourceGroupName`.

    ```azurecli
    # Variable for API for MongoDB vCore cluster resource
    clusterName="<resource-name>"

    # Variable for resource group
    resourceGroupName="<resource-group-name>"
    ```

1. Create shell variables for `storageAccountName` and `diagnosticSettingName`,

    ```azurecli
    # Variable for storage account name
    storageAccountName="<storage-account-name>"

    # Variable for diagnostic setting name
    diagnosticSettingName="<diagnostic-setting-name>"
    ```

    > [!NOTE]
    > For example, if the Azure Storage account's name is `teststorageaccount02909` and the diagnostic settings' name is `test-setting`:
    >
    > ```azurecli
    > storageAccountName="teststorageaccount02909"
    > diagnosticSettingName:"test-setting"
    > ```
    >

1. Get the resource identifier for the API for MongoDB vCore cluster.

    ```azurecli
    az cosmosdb mongocluster show \
        --resource-group $resourceGroupName \
        --cluster-name $clusterName

    clusterResourceId=$(az cosmosdb mongocluster show \
        --resource-group $resourceGroupName \
        --cluster-name $clusterName \
        --query "id" \
        --output "tsv" \
    )
    ```

1. Get the resource identifier for the Log Analytics workspace.

    ```azurecli
    az storage account show \
        --resource-group $resourceGroupName \
        --name $storageAccountName

    storageResourceId=$(az storage account show \
        --resource-group $resourceGroupName \
        --name $storageAccountName \
        --query "id" \
        --output "tsv" \
    )
    ```

1. Use `az monitor diagnostic-settings create` to create the setting.

    ```azurecli
    az monitor diagnostic-settings create \
        --resource-group $resourceGroupName \
        --name $diagnosticSettingName \
        --resource $clusterResourceId \
        --logs '[{category:vCoreMongoRequests,enabled:true,retention-policy:{enabled:false,days:0}}]' \
        --storage-account $storageResourceId
    ```

---

## Manage diagnostic settings

Sometimes you need to manage settings by finding or removing them. The `az monitor diagnostic-settings` command group includes subcommands for the management of diagnostic settings.

1. List all diagnostic settings associated with the API for MongoDB vCore cluster.

    ```azurecli
    az monitor diagnostic-settings list \
        --resource-group $resourceGroupName \
        --resource $clusterResourceId
    ```

1. Delete a specific setting using the associated resource and the name of the setting.

    ```azurecli
    az monitor diagnostic-settings delete \
        --resource-group $resourceGroupName \
        --name $diagnosticSettingName \
        --resource $clusterResourceId
    ```

## Use advanced diagnostics queries

Use these resource-specific queries to perform common troubleshooting research in an API for MongoDB vCore cluster.

> [!IMPORTANT]
> This section assumes that you are using a Log Analytics workspace with resource-specific logs.

1. Navigate to **Logs** section of the API for MongoDB vCore cluster. Observe the list of sample queries.

    :::image type="content" source="media/how-to-monitor-diagnostics-logs/sample-queries.png" lightbox="media/how-to-monitor-diagnostics-logs/sample-queries.png" alt-text="Screenshot of the diagnostic queries list of sample queries.":::

1. Run this query to **count the number of failed API for MongoDB vCore requests grouped by error code**.

    ```Kusto
    VCoreMongoRequests
    // Time range filter:  | where TimeGenerated between (StartTime .. EndTime)
    // Resource id filter: | where _ResourceId == "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group-name/providers/microsoft.documentdb/mongoclusters/my-cluster-name"
    | where ErrorCode != 0
    | summarize count() by bin(TimeGenerated, 5m), ErrorCode=tostring(ErrorCode)
    ```

1. Run this query to **get the API for MongoDB vCore requests `P99` runtime duration by operation name**.

    ```Kusto
    // Mongo vCore requests P99 duration by operation 
    // Mongo vCore requests P99 runtime duration by operation name. 
    VCoreMongoRequests
    // Time range filter:  | where TimeGenerated between (StartTime .. EndTime)
    // Resource id filter: | where _ResourceId == "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group-name/providers/microsoft.documentdb/mongoclusters/my-cluster-name"
    | summarize percentile(DurationMs, 99) by bin(TimeGenerated, 1h), OperationName
    ```

1. Run this query to **get the count of API for MongoDB vCore requests grouped by total runtime duration**.

    ```Kusto
    // Mongo vCore requests binned by duration 
    // Count of Mongo vCore requests binned by total runtime duration. 
    VCoreMongoRequests
    // Time range filter:  | where TimeGenerated between (StartTime .. EndTime)
    // Resource id filter: | where _ResourceId == "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group-name/providers/microsoft.documentdb/mongoclusters/my-cluster-name"
    | project TimeGenerated, DurationBin=tostring(bin(DurationMs, 5))
    | summarize count() by bin(TimeGenerated, 1m), tostring(DurationBin)
    ```

1. Run this query to **get the count of API for MongoDB vCore requests by user agent**.

    ```Kusto
    // Mongo vCore requests by user agent 
    // Count of Mongo vCore requests by user agent. 
    VCoreMongoRequests
    // Time range filter:  | where TimeGenerated between (StartTime .. EndTime)
    // Resource id filter: | where _ResourceId == "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/my-resource-group-name/providers/microsoft.documentdb/mongoclusters/my-cluster-name"
    | summarize count() by bin(TimeGenerated, 1h), UserAgent
    ```

## Related content

- Read more about [feature compatibility with MongoDB](compatibility.md).
- Review options for [migrating from MongoDB to Azure Cosmos DB for MongoDB vCore](migration-options.md)
- Get started by [creating an account](quickstart-portal.md).
