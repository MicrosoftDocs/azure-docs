---
title: Monitor Azure Cache for Redis connections using Azure diagnostic settings
titleSuffix: Azure Cache for Redis
description: Learn how to use Azure diagnostic settings to monitor connected ip addresses to your Azure Cache for Redis.
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
Diagnostic settings in Azure are used to collect resource logs. Azure resource Logs are emitted by a resource and provide rich, frequent data about the operation of that resource. These logs are captured per request and they are also referred to as "data plane logs".

Platform metrics and the Activity logs are collected automatically, whereas you must create a diagnostic setting to collect resource logs or forward them outside of Azure Monitor.

Log data that is collected: Customers can see logs of all clients (IP address and counts) connected to their cache (snapshots taken at 10 sec intervals).

You can turn on diagnostic setting for Azure Cache for Redis accounts and send resource logs to the following sources:

- Event hub
- Storage Account

<!--  Prerequisites 
Optional. If you need prerequisites, make them your first H2 in a how-to guide. 
Use clear and unambiguous language and use a list format.
-->

## Prerequisites

<!-- 
Jeffrey are there any pre-reqs 
-->

## Create diagnostics settings via the Azure portal

1. Sign into the [Azure portal](https://portal.azure.com).

1. Navigate to your Azure Cache for Redis account. Open the **Diagnostic settings** pane under the **Monitoring section**, and then select **Add diagnostic setting** option.

   :::image type="content" source="media/cache-monitor-resource-logs/cache-monitor-diagnostic-setting.png" alt-text="Select diagnostics":::

1. In the **Diagnostic settings** pane, fill the form with your preferred categories.

### Choose log categories

   |Category  |API   | Definition  | Key Properties   |
   |---------|---------|---------|---------|
   |ConnectedClientList |  All APIs        |     IP addresses and counts of clients connected to the cache at regular intervals.   |   `connectedClients` and nested within `ip`, `count`, `privateLinkIpv6`    |
  
1. Once you select your **Categories details**, then send your Logs to your preferred destination. If you're sending Logs to a **Log Analytics Workspace**, make sure to select **Resource specific** as the Destination table.

    <!-- :::image type="content" source="./media/monitor-cosmos-db/diagnostics-resource-specific.png" alt-text="Select enable resource-specific"::: -->

## Create diagnostic setting via REST API

Use the Azure Monitor REST API for creating a diagnostic setting via the interactive console.

### Request

```HTTP
PUT https://management.azure.com/{resourceUri}/providers/Microsoft.Insights/diagnosticSettings/{name}?api-version=2017-05-01-preview
```

### Headers

   |Parameters/Headers  | Value/Description  |
   |---------|---------|
   |name     |  The name of your Diagnostic setting.      |
   |resourceUri     |  subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.Cache/Redis/{CACHE_NAME}       |
   |api-version     |    2017-05-01-preview  |
   |Content-Type     |    application/json     |

<!-- {resourceUri} is something like: subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.Cache/Redis/{CACHE_NAME} -->

### Body

```json
{
    "properties": {
      "storageAccountId": "/subscriptions/df602c9c-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/apptest/providers/Microsoft.Storage/storageAccounts/appteststorage1",
      "eventHubAuthorizationRuleId": "/subscriptions/1a66ce04-b633-4a0b-b2bc-a912ec8986a6/resourceGroups/montest/providers/microsoft.eventhub/namespaces/mynamespace/eventhubs/myeventhub/authorizationrules/myrule",
      "eventHubName": "myeventhub",
      "logs": [
        {
          "category": "ConnectedClientList",
          "enabled": true,
          "retentionPolicy": {
            "enabled": false,
            "days": 0
          }
        }
      ]
    }
}
```

## Create diagnostic setting via Azure CLI

Use the `az monitor diagnostic-settings create` command to create a diagnostic setting with the Azure CLI. See the documentation for this command for descriptions of its parameters.

```azurecli
az monitor diagnostic-settings create --resource /subscriptions/13c7d7df-f56e-4645-91b5-c08688d518e5/resourceGroups/Jeffrey/providers/Microsoft.Cache/Redis/jc-cs --name clitest --logs '[{"category": "ConnectedClientList","enabled": true,"retentionPolicy": {"enabled": false,"days": 0}}]' --event-hub MyEventHubName --event-hub-rule /subscriptions/13c7d7df-f56e-4645-91b5-c08688d518e5/resourceGroups/jeffrey/providers/Microsoft.EventHub/namespaces/jc-eventhub/authorizationrules/RootManageSharedAccessKey --storage-account /subscriptions/13c7d7df-f56e-4645-91b5-c08688d518e5/resourceGroups/jeffrey/providers/Microsoft.Storage/storageAccounts/jceaup
```
<!-- Clean-up the command to remove user data. -->

## Private Link Clients

For clients that connect over private link, their actual IPv4 address is reported in addition to the special encoded private link IPv6 address. Because this is private, the IPv4 address is decoded in proprietary way from the IPv6 address. The IPv4 address is reported in the logs.

This address is exposed because when customers run the `MONITOR` command or `CLIENT LIST` command, they will not see the `ip` value but instead see the `privateLinkIpv6` value. Exposing both helps customer map these addresses in case they need to identify clients.

## Runner IP addresses

Customers might notice  monitoring "runner" IP addresses show up in the logs, which may cause some confusion.

There is some work going on to shut these down but in the meantime we should document these IPs somewhere. See Lavanya/Alfan for these IP

## Enable full-text query for logging query text

> [!Note]
> Enabling this feature may result in additional logging costs, for pricing details visit [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/). It is recommended to disable this feature after troubleshooting.

Azure Cache for Redis provides advanced logging for detailed troubleshooting. By enabling full-text query, you’ll be able to view the deobfuscated query for all requests within your Azure Cache for Redis account.  You’ll also give permission for Azure Cache for Redis to access and surface this data in your logs.

1. To enable this feature, navigate to the `Features` blade in your Cosmos DB account.

   <!-- :::image type="content" source="./media/monitor-cosmos-db/full-text-query-features.png" alt-text="Navigate to Features blade"::: -->

2. Select `Enable`, this setting will then be applied in the within the next few minutes. All newly ingested logs will have the full-text or PIICommand text for each request.
    <!-- :::image type="content" source="./media/monitor-cosmos-db/select-enable-full-text.png" alt-text="Select enable full-text"::: -->

## Next steps

<!-- 5. Next steps
Required. Provide at least one next step and no more than three. Include some 
context so the customer can determine why they would click the link.
-->

- For more information on how to query resource-specific tables see .

- For more information on how to query AzureDiagnostics tables see .

- For detailed information about how to create a diagnostic setting by using the Azure portal, CLI, or PowerShell, see [create diagnostic setting to collect platform logs and metrics in Azure](../azure-monitor/essentials/diagnostic-settings.md) article.
