---
title: Monitor data by using Azure Diagnostic settings
titleSuffix: Azure Cosmos DB
description: Learn how to use Azure diagnostic settings to monitor the performance and availability of data stored in Azure Cosmos DB
author: seesharprun
ms.author: sidandrews
ms.reviewer: esarroyo
ms.service: cosmos-db
ms.topic: how-to
ms.date: 04/26/2023
ms.custom: ignite-2022, devx-track-azurecli
---

# Monitor Azure Cosmos DB data by using diagnostic settings in Azure

[!INCLUDE[NoSQL, MongoDB, Cassandra, Gremlin, Table](includes/appliesto-nosql-mongodb-cassandra-gremlin-table.md)]

Diagnostic settings in Azure are used to collect resource logs. Resources emit Azure resource Logs and provide rich, frequent data about the operation of that resource. These logs are captured per request and they're also referred to as "data plane logs." Some examples of the data plane operations include delete, insert, and readFeed. The content of these logs varies by resource type.

Platform metrics and the Activity logs are collected automatically, whereas you must create a diagnostic setting to collect resource logs or forward them outside of Azure Monitor. You can turn on diagnostic setting for Azure Cosmos DB accounts and send resource logs to the following sources:

- Log Analytics workspaces
  - Data sent to Log Analytics can be written into **Azure Diagnostics (legacy)** or **Resource-specific (preview)** tables
- Event hub
- Storage Account
  
> [!NOTE]
> We recommend creating the diagnostic setting in resource-specific mode (for all APIs except API for Table) [following our instructions for creating diagnostics setting via REST API](monitor-resource-logs.md). This option provides additional cost-optimizations with an improved view for handling data.

## Prerequisites

- An existing Azure Cosmos DB account.
  - If you have an Azure subscription, [create a new account](nosql/how-to-create-account.md?tabs=azure-portal).
  - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  - Alternatively, you can [try Azure Cosmos DB free](try-free.md) before you commit.

## Create diagnostic settings

Here, we walk through the process of creating diagnostic settings for your account.

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Azure Cosmos DB account. Open the **Diagnostic settings** pane under the **Monitoring section** and then select the **Add diagnostic setting** option.

    :::image type="content" source="media/monitor/diagnostics-settings-selection.png" lightbox="media/monitor/diagnostics-settings-selection.png" alt-text="Sreenshot of the diagnostics selection page.":::

    > [!IMPORTANT]
    > You might see a prompt to "enable full-text query \[...\] for more detailed logging" if the **full-text query** feature is not enabled in your account. You can safely ignore this warning if you do not wish to enable this feature. For more information, see [enable full-text query](monitor-resource-logs.md#enable-full-text-query-for-logging-query-text).

1. In the **Diagnostic settings** pane, fill the form with your preferred categories. Included here's a list of log categories.

    | Category | API | Definition | Key Properties |
    | --- | --- | --- | --- |
    | **DataPlaneRequests** | All APIs | Logs back-end requests as data plane operations, which are requests executed to create, update, delete or retrieve data within the account. | `Requestcharge`, `statusCode`, `clientIPaddress`, `partitionID`, `resourceTokenPermissionId` `resourceTokenPermissionMode` |
    | **MongoRequests** | API for MongoDB | Logs user-initiated requests from the front end to serve requests to Azure Cosmos DB for MongoDB. When you enable this category, make sure to disable DataPlaneRequests. | `Requestcharge`, `opCode`, `retryCount`, `piiCommandText` |
    | **CassandraRequests** | API for Apache Cassandra | Logs user-initiated requests from the front end to serve requests to Azure Cosmos DB for Cassandra. When you enable this category, make sure to disable DataPlaneRequests. | `operationName`, `requestCharge`, `piiCommandText` |
    | **GremlinRequests** | API for Apache Gremlin | Logs user-initiated requests from the front end to serve requests to Azure Cosmos DB for Gremlin. When you enable this category, make sure to disable DataPlaneRequests. | `operationName`, `requestCharge`, `piiCommandText`, `retriedDueToRateLimiting` |
    | **QueryRuntimeStatistics** | API for NoSQL | This table details query operations executed against an API for NoSQL account. By default, the query text and its parameters are obfuscated to avoid logging personal data with full text query logging available by request. | `databasename`, `partitionkeyrangeid`, `querytext` |
    | **PartitionKeyStatistics** | All APIs | Logs the statistics of logical partition keys by representing the estimated storage size (KB) of the partition keys. This table is useful when troubleshooting storage skews. This PartitionKeyStatistics log is only emitted if the following conditions are true: 1. At least 1% of the documents in the physical partition have same logical partition key. 2. Out of all the keys in the physical partition, the PartitionKeyStatistics log captures the top three keys with largest storage size. </li></ul> If the previous conditions aren't met, the partition key statistics data isn't available. It's okay if the above conditions aren't met for your account, which typically indicates you have no logical partition storage skew. **Note**: The estimated size of the partition keys is calculated using a sampling approach that assumes the documents in the physical partition are roughly the same size. If the document sizes aren't uniform in the physical partition, the estimated partition key size might not be accurate. | `subscriptionId`, `regionName`, `partitionKey`, `sizeKB` |
    | **PartitionKeyRUConsumption** | API for NoSQL or API for Apache Gremlin | Logs the aggregated per-second RU/s consumption of partition keys. This table is useful for troubleshooting hot partitions. Currently, Azure Cosmos DB reports partition keys for API for NoSQL accounts only and for point read/write, query, and stored procedure operations. | `subscriptionId`, `regionName`, `partitionKey`, `requestCharge`, `partitionKeyRangeId` |
    | **ControlPlaneRequests** | All APIs | Logs details on control plane operations, which include, creating an account, adding or removing a region, updating account replication settings etc. | `operationName`, `httpstatusCode`, `httpMethod`, `region` |
    | **TableApiRequests** | API for Table | Logs user-initiated requests from the front end to serve requests to Azure Cosmos DB for Table. When you enable this category, make sure to disable DataPlaneRequests. | `operationName`, `requestCharge`, `piiCommandText` |

1. Once you select your **Categories details**, then send your Logs to your preferred destination. If you're sending Logs to a **Log Analytics Workspace**, make sure to select **Resource specific** as the Destination table.

    :::image type="content" source="media/monitor/diagnostics-resource-specific.png" alt-text="Screenshot of the option to enable resource-specific diagnostics.":::

### [Azure CLI](#tab/azure-cli)

Use the [az monitor diagnostic-settings create](/cli/azure/monitor/diagnostic-settings#az-monitor-diagnostic-settings-create) command to create a diagnostic setting with the Azure CLI. See the documentation for this command for descriptions of its parameters.

> [!NOTE]
> If you are using API for NoSQL, we recommend setting the **export-to-resource-specific** property to **true**.

1. Create shell variables for `subscriptionId`, `diagnosticSettingName`, `workspaceName` and `resourceGroupName`.

    ```azurecli
    # Variable for subscription id
    subscriptionId="<subscription-id>"

    # Variable for resource group name
    resourceGroupName="<resource-group-name>"
    
    # Variable for workspace name
    workspaceName="<workspace-name>"

    # Variable for diagnostic setting name
    diagnosticSettingName="<diagnostic-setting-name>"
    ```

1. Use `az monitor diagnostic-settings create` to create the setting.

    ```azurecli
    az monitor diagnostic-settings create \
        --resource "/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.DocumentDb/databaseAccounts/" \
        --name $diagnosticSettingName \
        --export-to-resource-specific true \
        --logs '[{"category": "QueryRuntimeStatistics","categoryGroup": null,"enabled": true,"retentionPolicy": {"enabled": false,"days": 0}}]' \
        --workspace "/subscriptions/$subscriptionId/resourcegroups/$resourceGroupName/providers/microsoft.operationalinsights/workspaces/$workspaceName"
    ```

### [REST API](#tab/rest-api)

Use the [Azure Monitor REST API](/rest/api/monitor/diagnosticsettings/createorupdate) for creating a diagnostic setting via the interactive console.

> [!NOTE]
> We recommend setting the **logAnalyticsDestinationType** property to **Dedicated** for enabling resource specific tables.

1. Create an HTTP `PUT` request.

    ```HTTP
    PUT
    https://management.azure.com/{resource-id}/providers/microsoft.insights/diagnosticSettings/service?api-version={api-version}
    ```

1. Use these headers with the request.

    | Parameters/Headers | Value/Description |
    | --- | --- |
    | **name** | The name of your diagnostic setting. |
    | **resourceUri** | Microsoft Insights subresource URI for Azure Cosmos DB account. |
    | **api-version** | `2017-05-01-preview` |
    | **Content-Type** | `application/json` |

    > [!NOTE]
    > The URI for the Microsoft Insights subresource is in this format: `subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.DocumentDb/databaseAccounts/{ACCOUNT_NAME}/providers/microsoft.insights/diagnosticSettings/{DIAGNOSTIC_SETTING_NAME}`. For more information about Azure Cosmos DB resource URIs, see [resource URI syntax for Azure Cosmos DB REST API](/rest/api/cosmos-db/cosmosdb-resource-uri-syntax-for-rest).

1. Set the body of the request to this JSON payload.

    ```json
    {
        "id": "/subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.DocumentDb/databaseAccounts/{ACCOUNT_NAME}/providers/microsoft.insights/diagnosticSettings/{DIAGNOSTIC_SETTING_NAME}",
        "type": "Microsoft.Insights/diagnosticSettings",
        "name": "name",
        "location": null,
        "kind": null,
        "tags": null,
        "properties": {
            "storageAccountId": null,
            "serviceBusRuleId": null,
            "workspaceId": "/subscriptions/{SUBSCRIPTION_ID}/resourcegroups/{RESOURCE_GROUP}/providers/microsoft.operationalinsights/workspaces/{WORKSPACE_NAME}",
            "eventHubAuthorizationRuleId": null,
            "eventHubName": null,
            "logs": [
                {
                    "category": "DataPlaneRequests",
                    "categoryGroup": null,
                    "enabled": true,
                    "retentionPolicy": {
                        "enabled": false,
                        "days": 0
                    }
                },
                {
                    "category": "QueryRuntimeStatistics",
                    "categoryGroup": null,
                    "enabled": true,
                    "retentionPolicy": {
                        "enabled": false,
                        "days": 0
                    }
                },
                {
                    "category": "PartitionKeyStatistics",
                    "categoryGroup": null,
                    "enabled": true,
                    "retentionPolicy": {
                        "enabled": false,
                        "days": 0
                    }
                },
                {
                    "category": "PartitionKeyRUConsumption",
                    "categoryGroup": null,
                    "enabled": true,
                    "retentionPolicy": {
                        "enabled": false,
                        "days": 0
                    }
                },
                {
                    "category": "ControlPlaneRequests",
                    "categoryGroup": null,
                    "enabled": true,
                    "retentionPolicy": {
                        "enabled": false,
                        "days": 0
                    }
                }
            ],
            "logAnalyticsDestinationType": "Dedicated"
        },
        "identity": null
    }
    ```

### [ARM Template](#tab/azure-resource-manager-template)

Here, use an [Azure Resource Manager (ARM) template](../azure-resource-manager/templates/index.yml) to create a diagnostic setting.

> [!NOTE]
> Set the **logAnalyticsDestinationType** property to **Dedicated** to enable resource-specific tables.

1. Create the following JSON template file to deploy diagnostic settings for your Azure Cosmos DB resource.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "settingName": {
          "type": "string",
          "metadata": {
            "description": "The name of the diagnostic setting."
          }
        },
        "dbName": {
          "type": "string",
          "metadata": {
            "description": "The name of the database."
          }
        },
        "workspaceId": {
          "type": "string",
          "metadata": {
            "description": "The resource Id of the workspace."
          }
        },
        "storageAccountId": {
          "type": "string",
          "metadata": {
            "description": "The resource Id of the storage account."
          }
        },
        "eventHubAuthorizationRuleId": {
          "type": "string",
          "metadata": {
            "description": "The resource Id of the event hub authorization rule."
          }
        },
        "eventHubName": {
          "type": "string",
          "metadata": {
            "description": "The name of the event hub."
          }
        }
      },
      "resources": [
        {
          "type": "Microsoft.Insights/diagnosticSettings",
          "apiVersion": "2021-05-01-preview",
          "scope": "[format('Microsoft.DocumentDB/databaseAccounts/{0}', parameters('dbName'))]",
          "name": "[parameters('settingName')]",
          "properties": {
            "workspaceId": "[parameters('workspaceId')]",
            "storageAccountId": "[parameters('storageAccountId')]",
            "eventHubAuthorizationRuleId": "[parameters('eventHubAuthorizationRuleId')]",
            "eventHubName": "[parameters('eventHubName')]",
            "logAnalyticsDestinationType": "[parameters('logAnalyticsDestinationType')]",
            "logs": [
              {
                "category": "DataPlaneRequests",
                "categoryGroup": null,
                "enabled": true,
                "retentionPolicy": {
                  "days": 0,
                  "enabled": false
                }
              },
              {
                "category": "MongoRequests",
                "categoryGroup": null,
                "enabled": false,
                "retentionPolicy": {
                  "days": 0,
                  "enabled": false
                }
              },
              {
                "category": "QueryRuntimeStatistics",
                "categoryGroup": null,
                "enabled": true,
                "retentionPolicy": {
                  "days": 0,
                  "enabled": false
                }
              },
              {
                "category": "PartitionKeyStatistics",
                "categoryGroup": null,
                "enabled": true,
                "retentionPolicy": {
                  "days": 0,
                  "enabled": false
                }
              },
              {
                "category": "PartitionKeyRUConsumption",
                "categoryGroup": null,
                "enabled": true,
                "retentionPolicy": {
                  "days": 0,
                  "enabled": false
                }
              },
              {
                "category": "ControlPlaneRequests",
                "categoryGroup": null,
                "enabled": true,
                "retentionPolicy": {
                  "days": 0,
                  "enabled": false
                }
              },
              {
                "category": "CassandraRequests",
                "categoryGroup": null,
                "enabled": false,
                "retentionPolicy": {
                  "days": 0,
                  "enabled": false
                }
              },
              {
                "category": "GremlinRequests",
                "categoryGroup": null,
                "enabled": false,
                "retentionPolicy": {
                  "days": 0,
                  "enabled": false
                }
              },
              {
                "category": "TableApiRequests",
                "categoryGroup": null,
                "enabled": false,
                "retentionPolicy": {
                  "days": 0,
                  "enabled": false
                }
              }
            ],
            "metrics": [
              {
                "timeGrain": null,
                "enabled": false,
                "retentionPolicy": {
                  "days": 0,
                  "enabled": false
                },
                "category": "Requests"
              }
            ]
          }
        }
      ]
    }
    ```

1. Create the following JSON parameter file with settings appropriate for your Azure Cosmos DB resource.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "settingName": {
          "value": "{DIAGNOSTIC_SETTING_NAME}"
        },
        "dbName": {
          "value": "{ACCOUNT_NAME}"
        },
        "workspaceId": {
          "value": "/subscriptions/{SUBSCRIPTION_ID}/resourcegroups/{RESOURCE_GROUP}/providers/microsoft.operationalinsights/workspaces/{WORKSPACE_NAME}"
        },
        "storageAccountId": {
          "value": "/subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.Storage/storageAccounts/{STORAGE_ACCOUNT_NAME}"
        },
        "eventHubAuthorizationRuleId": {
          "value": "/subscriptions/{SUBSCRIPTION_ID}/resourcegroups{RESOURCE_GROUP}/providers/Microsoft.EventHub/namespaces/{EVENTHUB_NAMESPACE}/authorizationrules/{EVENTHUB_POLICY_NAME}"
        },
        "eventHubName": {
          "value": "{EVENTHUB_NAME}"
        },
        "logAnalyticsDestinationType": {
          "value": "Dedicated"
        }
      }
    }
    ```

1. Deploy the template using [`az deployment group create`](/cli/azure/deployment/group#az-deployment-group-create).

    ```azurecli
    az deployment group create \
        --resource-group <resource-group-name> \
        --template-file <path-to-template>.json \
        --parameters @<parameters-file-name>.json
    ```

---

## Enable full-text query for logging query text

> [!NOTE]
> Enabling this feature may result in additional logging costs, for pricing details visit [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/). It is recommended to disable this feature after troubleshooting.

Azure Cosmos DB provides advanced logging for detailed troubleshooting. By enabling full-text query, you're able to view the deobfuscated query for all requests within your Azure Cosmos DB account.  You also give permission for Azure Cosmos DB to access and surface this data in your logs.

### [Azure portal](#tab/azure-portal)

1. To enable this feature, navigate to the `Features` page in your Azure Cosmos DB account.

    :::image type="content" source="media/monitor/full-text-query-features.png" lightbox="media/monitor/full-text-query-features.png" alt-text="Screenshot of the navigation process to the Features page.":::

2. Select `Enable`. This setting is applied within a few minutes. All newly ingested logs have the full-text or PIICommand text for each request.

    :::image type="content" source="media/monitor/select-enable-full-text.png" alt-text="Screenshot of the full-text feature being enabled.":::

### [Azure CLI / REST API / ARM template](#tab/azure-cli+rest-api+azure-resource-manager-template)

1. Ensure you're logged in to the Azure CLI. For more information, see [sign in with Azure CLI](/cli/azure/authenticate-azure-cli). Optionally, ensure that you've configured the active subscription for your CLI. For more information, see [change the active Azure CLI subscription](/cli/azure/manage-azure-subscriptions-azure-cli#change-the-active-subscription).

1. Create shell variables for `accountName` and `resourceGroupName`.

    ```azurecli
    # Variable for resource group name
    resourceGroupName="<resource-group-name>"
    
    # Variable for account name
    accountName="<account-name>"
    ```

1. Get the unique identifier for your existing account using [`az show`](/cli/azure/cosmosdb#az-cosmosdb-show).

    ```azurecli
    az cosmosdb show \
        --resource-group $resourceGroupName \
        --name $accountName \
        --query id
    ```

    Store the unique identifier in a shell variable named `$uri`.

    ```azurecli
    uri=$(
        az cosmosdb show \
            --resource-group $resourceGroupName \
            --name $accountName \
            --query id \
            --output tsv
    )
    ```

1. Query the resource using the REST API and [`az rest`](/cli/azure/reference-index#az-rest) with an HTTP `GET` verb to check if full-text query is already enabled.

    ```azurecli
    az rest \
        --method GET \
        --uri "https://management.azure.com/$uri/?api-version=2021-05-01-preview" \
        --query "{accountName:name,fullTextQuery:{state:properties.diagnosticLogSettings.enableFullTextQuery}}"
    ```

    If full-text query isn't enabled, the output would be similar to this example.

    ```json
    {
      "accountName": "<account-name>",
      "fullTextQuery": {
        "state": "None"
      }
    }
    ```

1. If full-text query isn't already enabled, enable it using `az rest` again with an HTTP `PATCH` verb and a JSON payload.

    ```azurecli
    az rest \
        --method PATCH \
        --uri "https://management.azure.com/$uri/?api-version=2021-05-01-preview" \
        --body '{"properties": {"diagnosticLogSettings": {"enableFullTextQuery": "True"}}}'
    ```

    > [!NOTE]
    > If you are using Azure CLI within a PowerShell prompt, you will need to escape the double-quotes using a backslash (`\`) character.

1. Wait a few minutes for the operation to complete. Check the status of full-text query by using `az rest` again.

    ```azurecli
    az rest \
        --method GET \
        --uri "https://management.azure.com/$uri/?api-version=2021-05-01-preview" \
        --query "{accountName:name,fullTextQuery:{state:properties.diagnosticLogSettings.enableFullTextQuery}}"
    ```

    The output should be similar to this example.

    ```json
    {
      "accountName": "<account-name>",
      "fullTextQuery": {
        "state": "True"
      }
    }
    ```

---

## Query data

To learn how to query using these newly enabled features, see:

- [API for NoSQL](nosql/diagnostic-queries.md)
- [API for MongoDB](mongodb/diagnostic-queries.md)
- [API for Apache Cassandra](cassandra/diagnostic-queries.md)
- [API for Apache Gremlin](gremlin/diagnostic-queries.md)

## Next steps

> [!div class="nextstepaction"]
> [Monitoring Azure Cosmos DB data reference](monitor-reference.md#resource-logs)
