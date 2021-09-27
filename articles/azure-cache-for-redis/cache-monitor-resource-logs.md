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

Azure Cache for Redis uses Azure diagnostic settings log client connections to your cache. Logging and then analyzing this diagnostic setting helps you understand who is connecting to your caches and the time of those connections. This data could be used to identify the scope of a security breach, for example.

You can see a log of all connections to your cache including IP addresses and count of connections. The log snapshots are taken at 10-second intervals.

You turn on diagnostic setting for Azure Cache for Redis accounts and send resource logs to destinations. Any destinations for the diagnostic setting must be created before creating the diagnostic settings. Here are the current destinations supported:

- Event hub
- Storage Account

## Create diagnostics settings via the Azure portal

1. Sign into the [Azure portal](https://portal.azure.com).

1. Navigate to your Azure Cache for Redis account. Open the **Diagnostic settings** pane under the **Monitoring section** on the left.Then, select **Add diagnostic setting**.

   :::image type="content" source="media/cache-monitor-resource-logs/cache-monitor-diagnostic-setting.png" alt-text="Select diagnostics":::

1. In the **Diagnostic settings** pane, select **ConnectedClientList** from **Category details**.

   |Category  | Definition  | Key Properties   |
   |---------|---------|---------|---------|
   |ConnectedClientList |  IP addresses and counts of clients connected to the cache, logged at a regular interval. | `connectedClients` and nested within: `ip`, `count`, `privateLinkIpv6` |
  
1. Once you select your **Categories details**, then send your logs to your preferred destination.

    :::image type="content" source="media/cache-monitor-resource-logs/diagnostics-resource-specific-2.png" alt-text="Select enable resource-specific":::

## Create diagnostic setting via REST API

Use the Azure Monitor REST API for creating a diagnostic setting via the interactive console.

### Request

```http
PUT https://management.azure.com/{resourceUri}/providers/Microsoft.Insights/diagnosticSettings/{name}?api-version=2017-05-01-preview
```

### Headers

   | Parameters/Headers | Value/Description |
   |---------|---------|
   | name |The name of your diagnostic setting. |
   | resourceUri | subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.Cache/Redis/{CACHE_NAME} |
   | api-version | 2017-05-01-preview |
   | Content-Type | application/json |

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

Use the `az monitor diagnostic-settings create` command to create a diagnostic setting with the Azure CLI. For more for information on this command and parameter descriptions, see [create diagnostic setting to collect platform logs and metrics in Azure](/azure/azure-monitor/essentials/diagnostic-settings).

```azurecli

az monitor diagnostic-settings create 
    --resource /subscriptions/1a66ce04-b633-4a0b-b2bc-a912ec8986a6/resourceGroups/montest/providers/Microsoft.Cache/Redis/myname
    --name clitest 
    --logs '[{"category": "ConnectedClientList","enabled": true,"retentionPolicy": {"enabled": false,"days": 0}}]'    
    --event-hub MyEventHubName 
    --event-hub-rule /subscriptions/1a66ce04-b633-4a0b-b2bc-a912ec8986a6/resourceGroups/montest/providers/microsoft.eventhub/namespaces/mynamespace/authorizationrules/RootManageSharedAccessKey 
    --storage-account /subscriptions/1a66ce04-b633-4a0b-b2bc-a912ec8986a6/resourceGroups/montest/providers/Microsoft.Storage/storageAccounts/myuserspace


```

## Private Link Clients

For clients that connect over private link, their actual IPv4 address is reported in addition to the special encoded private link IPv6 address. The IPv4 address is decoded in proprietary way from the IPv6 address. The IPv4 address is reported in the logs.

This address is exposed because when you run the `MONITOR` command or `CLIENT LIST` command on your Azure Cache for Redis. You don't see the `ip` value but instead see the `privateLinkIpv6` value. Showing both helps you map these addresses in case you need to identify client connections.

## Runner IP addresses

You might notice *runner* IP addresses in the logs. *Runner* IP addresses are used internally by Azure Cache for Redis for administrative tasks. These IP addresses aren't actual client connections. The *runner* IP addresses should be ignored in your client analysis.

<!-- See Lavanya/Alfan for these IP -->

## Next steps

- For detailed information about how to create a diagnostic setting by using the Azure portal, CLI, or PowerShell, see [create diagnostic setting to collect platform logs and metrics in Azure](/azure/azure-monitor/essentials/diagnostic-settings) article.
