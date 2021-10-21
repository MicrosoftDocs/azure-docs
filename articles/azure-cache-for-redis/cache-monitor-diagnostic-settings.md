---
title: Monitor Azure Cache for Redis data using diagnostic settings
titleSuffix: Azure Cache for Redis
description: Learn how to use diagnostic settings to monitor connected ip addresses to your Azure Cache for Redis.
author: curib
ms.author: cauribeg
ms.service: cache
ms.topic: how-to 
ms.date: 09/30/2021
ms.custom: template-how-to 
---

# Monitor Azure Cache for Redis data using diagnostic settings

Diagnostic settings in Azure are used to collect resource logs. Azure resource Logs are emitted by a resource and provide rich, frequent data about the operation of that resource. These logs are captured per request and they're also referred to as "data plane logs". The content of these logs varies by resource type.

Azure Cache for Redis uses Azure diagnostic settings to log information on all client connections to your cache. Logging and then analyzing this diagnostic setting helps you understand who is connecting to your caches and the timestamp of those connections. This data could be used to identify the scope of a security breach and for security auditing purposes.

Once configured, your cache starts to log incoming client connections by IP address. It also logs the number of connections originating from each unique IP address. The logs aren't cumulative. They represent point-in-time snapshots taken at 10-second intervals.

You can turn on diagnostic settings for Azure Cache for Redis instances and send resource logs to the following destinations:

- **Event hub** - diagnostic settings can't access event hub resources when virtual networks are enabled. Enable the **Allow trusted Microsoft services to bypass this firewall?** setting in event hubs to grant access to your event hub resources. The event hub must be in the same region as the cache.
- **Storage account** - must be in the same region as the cache.

For more information on diagnostic requirements, see [diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings?tabs=CMD).

You'll be charged normal data rates for storage account and event hub usage when you send diagnostic logs to either destination. You're billed under Azure Monitor not Azure Cache for Redis.
For more pricing information, [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Create diagnostics settings via the Azure portal

1. Sign into the [Azure portal](https://portal.azure.com).

1. Navigate to your Azure Cache for Redis account. Open the **Diagnostic settings** pane under the **Monitoring section** on the left. Then, select **Add diagnostic setting**.

   :::image type="content" source="media/cache-monitor-diagnostic-settings/cache-monitor-diagnostic-setting.png" alt-text="Select diagnostics":::

1. In the **Diagnostic settings** pane, select **ConnectedClientList** from **Category details**.

   |Category  | Definition  | Key Properties   |
   |---------|---------|---------|
   |ConnectedClientList |  IP addresses and counts of clients connected to the cache, logged at a regular interval. | `connectedClients` and nested within: `ip`, `count`, `privateLinkIpv6` |
  
1. Once you select your **Categories details**, send your logs to your preferred destination. Select the information on the right.

    :::image type="content" source="media/cache-monitor-diagnostic-settings/diagnostics-resource-specific.png" alt-text="Select enable resource-specific":::

## Create diagnostic setting via REST API

Use the Azure Monitor REST API for creating a diagnostic setting via the interactive console. For more information, see [Create or update](/rest/api/monitor/diagnostic-settings/create-or-update.md).

### Request

```http
PUT https://management.azure.com/{resourceUri}/providers/Microsoft.Insights/diagnosticSettings/{name}?api-version=2017-05-01-preview
```

### Headers

   | Parameters/Headers | Value/Description |
   |---------|---------|
   | name | The name of your diagnostic setting. |
   | resourceUri | subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.Cache/Redis/{CACHE_NAME} |
   | api-version | 2017-05-01-preview |
   | Content-Type | application/json |

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

Use the `az monitor diagnostic-settings create` command to create a diagnostic setting with the Azure CLI. For more for information on this command and parameter descriptions, see [Create diagnostic settings to send platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md).

```azurecli

az monitor diagnostic-settings create 
    --resource /subscriptions/1a66ce04-b633-4a0b-b2bc-a912ec8986a6/resourceGroups/montest/providers/Microsoft.Cache/Redis/myname
    --name constoso-setting
    --logs '[{"category": "ConnectedClientList","enabled": true,"retentionPolicy": {"enabled": false,"days": 0}}]'    
    --event-hub MyEventHubName 
    --event-hub-rule /subscriptions/1a66ce04-b633-4a0b-b2bc-a912ec8986a6/resourceGroups/montest/providers/microsoft.eventhub/namespaces/mynamespace/authorizationrules/RootManageSharedAccessKey 
    --storage-account /subscriptions/1a66ce04-b633-4a0b-b2bc-a912ec8986a6/resourceGroups/montest/providers/Microsoft.Storage/storageAccounts/myuserspace


```

## Next steps

For detailed information about how to create a diagnostic setting by using the Azure portal, CLI, or PowerShell, see [create diagnostic setting to collect platform logs and metrics in Azure](../azure-monitor/essentials/diagnostic-settings.md) article.
