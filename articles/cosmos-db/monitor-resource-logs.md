---
title: Monitor data using diagnostic settings
titleSuffix: Azure Cosmos DB
description: Learn how to use Azure diagnostic settings to monitor the performance and availability of data stored in Azure Cosmos DB
author: stefarroyo
ms.author: esarroyo
ms.service: cosmos-db
ms.topic: how-to
ms.date: 06/27/2024
ms.custom: devx-track-azurecli
#Customer Intent: As an operations user, I want to monitor metrics using Azure Monitor, so that I can use a Log Analytics workspace to perform complex analysis.
---

# Monitor Azure Cosmos DB data using Azure Monitor Log Analytics diagnostic settings

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Diagnostic settings in Azure are used to collect resource logs. Resources emit Azure resource Logs and provide rich, frequent data about the operation of that resource. These logs are captured per request and they're also referred to as *data plane logs*. Some examples of the data plane operations include delete, insert, and readFeed. The content of these logs varies by resource type.

To learn more about diagnostic settings, see [Diagnostic settings in Azure Monitor](/azure/azure-monitor/essentials/diagnostic-settings).
  
> [!NOTE]
> We recommend creating the diagnostic setting in resource-specific mode (for all APIs except API for Table) following the instructions in the *REST API* tab. This option provides additional cost-optimizations with an improved view for handling data.

## Prerequisites

- An existing Azure Cosmos DB account.
  - If you have an Azure subscription, [create a new account](nosql/how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](try-free.md) before you commit.
- An existing Azure Monitor Log Analytics workspace.

> [!WARNING]
> If you need to delete a resource, rename, or move a resource, or migrate it across resource groups or subscriptions, first delete its diagnostic settings. Otherwise, if you recreate this resource, the diagnostic settings for the deleted resource could be included with the new resource, depending on the resource configuration for each resource. If the diagnostics settings are included with the new resource, this resumes the collection of resource logs as defined in the diagnostic setting and sends the applicable metric and log data to the previously configured destination. 
>
> Also, it's a good practice to delete the diagnostic settings for a resource you're going to delete and don't plan on using again to keep your environment clean.

## Create diagnostic settings

Here, we walk through the process of creating diagnostic settings for your account.

> [!NOTE]
> The metric to logs export as a category is not currently supported.

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your existing Azure Cosmos DB account.

1. In the **Monitoring** section of the resource menu, select **Diagnostic settings**. Then, select the **Add diagnostic setting** option.

    :::image type="content" source="media/monitor-resource-logs/add-diagnostic-setting.png" lightbox="media/monitor-resource-logs/add-diagnostic-setting.png" alt-text="Screenshot of the list of diagnostic settings with options to create new ones or edit existing ones.":::

    > [!IMPORTANT]
    > You might see a prompt to "enable full-text query \[...\] for more detailed logging" if the **full-text query** feature is not enabled in your account. You can safely ignore this warning if you do not wish to enable this feature. For more information, see [enable full-text query](monitor-resource-logs.md#enable-full-text-query-for-logging-query-text).

1. In the **Diagnostic settings** pane, name the setting **example-setting** and then select the **QueryRuntimeStatistics** category. Send the logs to a **Log Analytics Workspace** selecting your existing workspace. Finally, select **Resource specific** as the destination option.

    :::image type="content" source="media/monitor-resource-logs/configure-diagnostic-setting.png" alt-text="Screenshot of the various options to configure a diagnostic setting.":::

### [Azure CLI](#tab/azure-cli)

Use the [`az monitor diagnostic-settings create`](/cli/azure/monitor/diagnostic-settings#az-monitor-diagnostic-settings-create) command to create a diagnostic setting with the Azure CLI. See the documentation for this command for descriptions of its parameters.

1. Ensure you logged in to the Azure CLI. For more information, see [sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

1. Use `az monitor diagnostic-settings create` to create the setting.

    ```azurecli-interactive
    az monitor diagnostic-settings create \
      --resource $(az cosmosdb show \
        --resource-group "<resource-group-name>" \
        --name "<account-name>" \
        --query "id" \
        --output "tsv" \
      ) \
      --workspace $(az monitor log-analytics workspace show \
        --resource-group "<resource-group-name>" \
        --name "<account-name>" \
        --query "id" \
        --output "tsv" \
      ) \
      --name "example-setting" \
      --export-to-resource-specific true \
      --logs '[
        {
          "category": "QueryRuntimeStatistics",
          "enabled": true
        }
      ]'
    ```

    > [!IMPORTANT]
    > This sample uses the `--export-to-resource-specific` argument to enable resource-specific tables.

1. Review the results of creating your new setting using `az monitor diagnostics-settings show`.

    ```azurecli-interactive
    az monitor diagnostic-settings show \
      --name "example-setting" \
      --resource $(az cosmosdb show \
        --resource-group "<resource-group-name>" \
        --name "<account-name>" \
        --query "id" \
        --output "tsv" \
      )
    ```

### [REST API](#tab/rest-api)

Use the [Azure Monitor REST API](/rest/api/monitor/diagnosticsettings/createorupdate) for creating a diagnostic setting via the interactive console.

1. Ensure you logged in to the Azure CLI. For more information, see [sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

1. Create the diagnostic setting for your Azure Cosmos DB resource using an HTTP `PUT` request and [`az rest`](/cli/azure/reference-index#az-rest).

    ```azurecli-interactive
    diagnosticSettingName="example-setting"

    resourceId=$(az cosmosdb show \
      --resource-group "<resource-group-name>" \
      --name "<account-name>" \
      --query "id" \
      --output "tsv" \
    )

    workspaceId=$(az monitor log-analytics workspace show \
      --resource-group "<resource-group-name>" \
      --name "<account-name>" \
      --query "id" \
      --output "tsv" \
    )
    
    az rest \
      --method "PUT" \
      --url "$resourceId/providers/Microsoft.Insights/diagnosticSettings/$diagnosticSettingName" \
      --url-parameters "api-version=2021-05-01-preview" \
      --body '{
        "properties": {
          "workspaceId": "'"$workspaceId"'",
          "logs": [
            {
              "category": "QueryRuntimeStatistics",
              "enabled": true
            }
          ],
          "logAnalyticsDestinationType": "Dedicated"
        }
      }'
    ```

    > [!IMPORTANT]
    > This sample sets the `logAnalyticsDestinationType` property to `Dedicated` to enable resource-specific tables.

1. Use `az rest` again with an HTTP `GET` verb to get the properties of the diagnostic setting.

    ```azurecli-interactive
    diagnosticSettingName="example-setting"

    resourceId=$(az cosmosdb show \
      --resource-group "<resource-group-name>" \
      --name "<account-name>" \
      --query "id" \
      --output "tsv" \
    )
    
    az rest \
      --method "GET" \
      --url "$resourceId/providers/Microsoft.Insights/diagnosticSettings/$diagnosticSettingName" \
      --url-parameters "api-version=2021-05-01-preview"
    ```

### [Bicep](#tab/bicep)

Use an [Bicep template](../azure-resource-manager/bicep/overview.md) to create the diagnostic setting.

1. Ensure you logged in to the Azure CLI. For more information, see [sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

1. Create a new file named `diagnosticSetting.bicep`.

1. Enter the following Bicep template content that deploys the diagnostic setting for your Azure Cosmos DB resource.

    ```bicep
    @description('The name of the diagnostic setting to create.')
    param diagnosticSettingName string = 'example-setting'
    
    @description('The name of the Azure Cosmos DB account to monitor.')
    param azureCosmosDbAccountName string
    
    @description('The name of the Azure Monitor Log Analytics workspace to use.')
    param logAnalyticsWorkspaceName string
    
    resource azureCosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2021-06-15' existing = {
      name: azureCosmosDbAccountName
    }
    
    resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' existing = {
      name: logAnalyticsWorkspaceName
    }
    
    resource diagnosticSetting 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
      name: diagnosticSettingName
      scope: azureCosmosDbAccount
      properties: {
        workspaceId: logAnalyticsWorkspace.id
        logAnalyticsDestinationType: 'Dedicated'
        logs: [
          {
            category: 'QueryRuntimeStatistics'
            enabled: true
          }
        ]
      }
    }    
    ```

    > [!IMPORTANT]
    > This sample sets the `logAnalyticsDestinationType` property to `Dedicated` to enable resource-specific tables.

1. Deploy the template using [`az deployment group create`](/cli/azure/deployment/group#az-deployment-group-create).

    ```azurecli-interactive
    az deployment group create \
        --resource-group "<resource-group-name>" \
        --template-file diagnosticSetting.bicep \
        --parameters \
          azureCosmosDbAccountName="<azure-cosmos-db-account-name>" \
          logAnalyticsWorkspaceName="<log-analytics-workspace-name>"
    ```

    > [!TIP]
    > Use the [`az bicep build`](/cli/azure/bicep#az-bicep-build) command to convert the Bicep template to an Azure Resource Manager template.

### [ARM Template](#tab/azure-resource-manager-template)

Use an [Azure Resource Manager template](../azure-resource-manager/templates/overview.md) to create the diagnostic setting.

1. Ensure you logged in to the Azure CLI. For more information, see [sign in with Azure CLI](/cli/azure/authenticate-azure-cli).

1. Create a new file named `diagnosticSetting.bicep`.

1. Enter the following Azure Resource Manager template content that deploys the diagnostic setting for your Azure Cosmos DB resource.

    ```json
    {
      "$schema": "<https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#>",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "diagnosticSettingName": {
          "type": "string",
          "defaultValue": "example-setting",
          "metadata": {
            "description": "The name of the diagnostic setting to create."
          }
        },
        "azureCosmosDbAccountName": {
          "type": "string",
          "metadata": {
            "description": "The name of the Azure Cosmos DB account to monitor."
          }
        },
        "logAnalyticsWorkspaceName": {
          "type": "string",
          "metadata": {
            "description": "The name of the Azure Monitor Log Analytics workspace to use."
          }
        }
      },
      "resources": [
        {
          "type": "Microsoft.Insights/diagnosticSettings",
          "apiVersion": "2021-05-01-preview",
          "scope": "[format('Microsoft.DocumentDB/databaseAccounts/{0}', parameters('azureCosmosDbAccountName'))]",
          "name": "[parameters('diagnosticSettingName')]",
          "properties": {
            "workspaceId": "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('logAnalyticsWorkspaceName'))]",
            "logAnalyticsDestinationType": "Dedicated",
            "logs": [
              {
                "category": "QueryRuntimeStatistics",
                "enabled": true
              }
            ]
          }
        }
      ]
    }
    ```

    > [!IMPORTANT]
    > This sample sets the `logAnalyticsDestinationType` property to `Dedicated` to enable resource-specific tables.

1. Deploy the template using [`az deployment group create`](/cli/azure/deployment/group#az-deployment-group-create).

    ```azurecli-interactive
    az deployment group create \
        --resource-group "<resource-group-name>" \
        --template-file azuredeploy.json \
        --parameters \
          azureCosmosDbAccountName="<azure-cosmos-db-account-name>" \
          logAnalyticsWorkspaceName="<log-analytics-workspace-name>"
    ```

    > [!TIP]
    > Use the [`az bicep decompile`](/cli/azure/bicep#az-bicep-decompile) command to convert the Azure Resource Manager template to a Bicep template.

---

## Enable full-text query for logging query text

Azure Cosmos DB provides advanced logging for detailed troubleshooting. By enabling full-text query, you're able to view the deobfuscated query for all requests within your Azure Cosmos DB account. You also give permission for Azure Cosmos DB to access and surface this data in your logs.

> [!WARNING]
> Enabling this feature may result in additional logging costs, for pricing details visit [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/). It is recommended to disable this feature after troubleshooting.

### [Azure portal](#tab/azure-portal)

1. On the existing Azure Cosmos DB account page, select the **Features** option within the **Settings** section of the resource menu. Then, select the **Diagnostics full-text query** feature.

    :::image type="content" source="media/monitor-resource-logs/enable-account-features.png" lightbox="media/monitor-resource-logs/enable-account-features.png" alt-text="Screenshot of the available features for an Azure Cosmos DB account.":::

2. In the dialog, select `Enable`. This setting is applied within a few minutes. All newly ingested logs now have the full-text or PIICommand text for each request.

    :::image type="content" source="media/monitor-resource-logs/enable-diagnostics-full-text-query.png" alt-text="Screenshot of the diagnostics full-text query feature being enabled for an Azure Cosmos DB account.":::

### [Azure CLI / REST API / Bicep / ARM Template](#tab/azure-cli+rest-api+bicep+azure-resource-manager-template)

Use the Azure CLI to enable full-text query for your Azure Cosmos DB account.

1. Enable full-text query using `az rest` again with an HTTP `PATCH` verb and a JSON payload.

    ```azurecli-interactive
    az rest \
      --method "PATCH" \
      --url $(az cosmosdb show \
        --resource-group "<resource-group-name>" \
        --name "<account-name>" \
        --query "id" \
        --output "tsv" \
      ) \
      --url-parameters "api-version=2021-05-01-preview" \
      --body '{
        "properties": {
          "diagnosticLogSettings": {
            "enableFullTextQuery": "True"
          }
        }
      }'
    ```

1. Wait a few minutes for the operation to complete. Check the status of full-text query by using `az rest` again with HTTP `GET`.

    ```azurecli-interactive
    az rest \
      --method "GET" \
      --url $(az cosmosdb show \
        --resource-group "<resource-group-name>" \
        --name "<account-name>" \
        --query "id" \
        --output "tsv" \
      ) \
      --url-parameters "api-version=2021-05-01-preview" \
      --query "{accountName:name,fullTextQueryEnabled:properties.diagnosticLogSettings.enableFullTextQuery}"
    ```

    The output should be similar to this example.

    ```json
    {
      "accountName": "<account-name>",
      "fullTextQueryEnabled": "True"
    }
    ```

---

## Related content

- [Diagnostic queries in API for NoSQL](nosql/diagnostic-queries.md)
- [Diagnostic queries in API for MongoDB](mongodb/diagnostic-queries.md)
- [Diagnostic queries in API for Apache Cassandra](cassandra/diagnostic-queries.md)
