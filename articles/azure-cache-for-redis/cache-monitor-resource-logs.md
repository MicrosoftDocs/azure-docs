---
title: Monitor Azure Cache for Redis data by using Azure Diagnostic settings
description: Learn how to use Azure diagnostic settings to monitor the performance and availability of data stored in Azure Cache for Redis
author: curib
ms.author: cauribeg
ms.service: cache
ms.topic: how-to 
ms.date: 09/30/2021
ms.custom: template-how-to 
---

# Monitor Azure Cache for Redis data by using diagnostic settings in Azure

<!-- Introductory paragraph 
Required. Lead with a light intro that describes, in customer-friendly language, 
what the customer will learn, or do, or accomplish. Answer the fundamental “why 
would I want to do this?” question. Keep it short.
-->
Diagnostic settings in Azure are used to collect resource logs. Azure resource Logs are emitted by a resource and provide rich, frequent data about the operation of that resource. These logs are captured per request and they are also referred to as "data plane logs". Some examples of the data plane operations include delete, insert, and readFeed. The content of these logs varies by resource type.

Platform metrics and the Activity logs are collected automatically, whereas you must create a diagnostic setting to collect resource logs or forward them outside of Azure Monitor. You can turn on diagnostic setting for Azure Cache for Redis accounts and send resource logs to the following sources:

- Log Analytics workspaces
  - Data sent to Log Analytics can be written into **Azure Diagnostics (legacy)** or **Resource-specific (preview)** tables
- Event hub
- Storage Account


<!--  Prerequisites 
Optional. If you need prerequisites, make them your first H2 in a how-to guide. 
Use clear and unambiguous language and use a list format.
-->
## Prerequisites

<!-- 
Jeffrey are there any pre-reqs 
- prerequisite 1
- prerequisite 2
- prerequisite n
-->

## Create diagnostics settings via the Azure portal

1. Sign into the [Azure portal](https://portal.azure.com).

2. Navigate to your Azure Cache for Redis account. Open the **Diagnostic settings** pane under the **Monitoring section**, and then select **Add diagnostic setting** option.

   <!-- :::image type="content" source="./media/monitor-cosmos-db/diagnostics-settings-selection.png" alt-text="Select diagnostics"::: -->


3. In the **Diagnostic settings** pane, fill the form with your preferred categories.

### Choose log categories

   |Category  |API   | Definition  | Key Properties   |
   |---------|---------|---------|---------|
   |DataPlaneRequests     |  All APIs        |     Logs back-end requests as data plane operations which are requests executed to create, update, delete or retrieve data within the account.   |   `Requestcharge`, `statusCode`, `clientIPaddress`, `partitionID`, `resourceTokenPermissionId` `resourceTokenPermissionMode`      |
  
4. Once you select your **Categories details**, then send your Logs to your preferred destination. If you're sending Logs to a **Log Analytics Workspace**, make sure to select **Resource specific** as the Destination table.

    <!-- :::image type="content" source="./media/monitor-cosmos-db/diagnostics-resource-specific.png" alt-text="Select enable resource-specific"::: -->

## Create diagnostic setting via REST API
<!-- Is this part of the AzCforR feature too? The Cosmos DB has this section -->

Use the [Azure Monitor REST API](/rest/api/monitor/diagnosticsettings/createorupdate) for creating a diagnostic setting via the interactive console.
> [!Note]
> We recommend setting the **logAnalyticsDestinationType** property to **Dedicated** for enabling resource specific tables.


### Request

   ```HTTP
   PUT
   https://management.azure.com/{resource-id}/providers/microsoft.insights/diagnosticSettings/service?api-version={api-version}
   ```

### Headers

   |Parameters/Headers  | Value/Description  |
   |---------|---------|
   |name     |  The name of your Diagnostic setting.      |
   |resourceUri     |   subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.DocumentDb/databaseAccounts/{ACCOUNT_NAME}/providers/microsoft.insights/diagnosticSettings/{DIAGNOSTIC_SETTING_NAME}      |
   |api-version     |    2017-05-01-preview     |
   |Content-Type     |    application/json     |

### Body

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

## Create diagnostic setting via Azure CLI
Use the [az monitor diagnostic-settings create](/cli/azure/monitor/diagnostic-settings#az_monitor_diagnostic_settings_create) command to create a diagnostic setting with the Azure CLI. See the documentation for this command for descriptions of its parameters.

`
## Enable full-text query for logging query text

> [!Note]
> Enabling this feature may result in additional logging costs, for pricing details visit [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/). It is recommended to disable this feature after troubleshooting.

Azure Cache for Redis provides advanced logging for detailed troubleshooting. By enabling full-text query, you’ll be able to view the deobfuscated query for all requests within your Azure Cache for Redis account.  You’ll also give permission for Azure Cache for Redis to access and surface this data in your logs. 

1. To enable this feature, navigate to the `Features` blade in your Cosmos DB account.
   
   <!-- :::image type="content" source="./media/monitor-cosmos-db/full-text-query-features.png" alt-text="Navigate to Features blade"::: -->

2. Select `Enable`, this setting will then be applied in the within the next few minutes. All newly ingested logs will have the full-text or PIICommand text for each request.
   
    <!-- :::image type="content" source="./media/monitor-cosmos-db/select-enable-full-text.png" alt-text="Select enable full-text"::: -->

To learn how to query using this newly enabled feature visit [advanced queries](cosmos-db-advanced-queries.md).







## Next steps
<!-- 5. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

- For more information on how to query resource-specific tables see .
 
- For more information on how to query AzureDiagnostics tables see .

- For detailed information about how to create a diagnostic setting by using the Azure portal, CLI, or PowerShell, see [create diagnostic setting to collect platform logs and metrics in Azure](../azure-monitor/essentials/diagnostic-settings.md) article.

<!--
Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

