---
title: Monitor Azure Cache for Redis data using diagnostic settings
titleSuffix: Azure Cache for Redis
description: Learn how to use diagnostic settings to monitor connected ip addresses to your Azure Cache for Redis.
author: flang-msft
ms.author: franlanglois
ms.service: cache
ms.topic: how-to 
ms.date: 11/3/2021
ms.custom: template-how-to, devx-track-azurecli 
ms.devlang: azurecli
---

# Monitor Azure Cache for Redis data using diagnostic settings

Diagnostic settings in Azure are used to collect resource logs. Azure resource Logs are emitted by a resource and provide rich, frequent data about the operation of that resource. These logs are captured per request and they're also referred to as "data plane logs". The content of these logs varies by resource type.

Azure Cache for Redis uses Azure diagnostic settings to log information on all client connections to your cache. Logging and analyzing this diagnostic setting helps you understand who is connecting to your caches and the timestamp of those connections. The log data could be used to identify the scope of a security breach and for security auditing purposes.

Once configured, your cache starts to log incoming client connections by IP address. It also logs the number of connections originating from each unique IP address. The logs aren't cumulative. They represent point-in-time snapshots taken at 10-second intervals.

You can turn on diagnostic settings for Azure Cache for Redis instances and send resource logs to the following destinations:

- **Log Analytics workspace** - doesn't need to be in the same region as the resource being monitored.
- **Storage account** - must be in the same region as the cache.
- **Event hub** - diagnostic settings can't access event hub resources when virtual networks are enabled. Enable the **Allow trusted Microsoft services to bypass this firewall?** setting in event hubs to grant access to your event hub resources. The event hub must be in the same region as the cache.

For more information on diagnostic requirements, see [diagnostic settings](../azure-monitor/essentials/diagnostic-settings.md?tabs=CMD).

You'll be charged normal data rates for storage account and event hub usage when you send diagnostic logs to either destination. You're billed under Azure Monitor not Azure Cache for Redis. When sending logs to **Log Analytics**, you're only charged for Log Analytics data ingestion.

For more pricing information, [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Create diagnostics settings via the Azure portal

1. Sign into the [Azure portal](https://portal.azure.com).

1. Navigate to your Azure Cache for Redis account. Open the **Diagnostic settings** pane under the **Monitoring section** on the left. Then, select **Add diagnostic setting**.

   :::image type="content" source="media/cache-monitor-diagnostic-settings/cache-monitor-diagnostic-setting.png" alt-text="Select diagnostics":::

1. In the **Diagnostic settings** pane, select **ConnectedClientList** from **Category details**.

   |Category  | Definition  | Key Properties   |
   |---------|---------|---------|
   |ConnectedClientList |  IP addresses and counts of clients connected to the cache, logged at a regular interval. | `connectedClients` and nested within: `ip`, `count`, `privateLinkIpv6` |

   For more detail on other fields, see below [Resource Logs](#resource-logs).

1. Once you select your **Categories details**, send your logs to your preferred destination. Select the information on the right.

    :::image type="content" source="media/cache-monitor-diagnostic-settings/diagnostics-resource-specific.png" alt-text="Select enable resource-specific":::

## Create diagnostic setting via REST API

Use the Azure Monitor REST API for creating a diagnostic setting via the interactive console. For more information, see [Create or update](/rest/api/monitor/diagnostic-settings/create-or-update).

### Request

```http
PUT https://management.azure.com/{resourceUri}/providers/Microsoft.Insights/diagnosticSettings/{name}?api-version=2017-05-01-preview
```

### Headers

   | Parameters/Headers | Value/Description |
   |---------|---------|
   | `name` | The name of your diagnostic setting. |
   | `resourceUri` | subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.Cache/Redis/{CACHE_NAME} |
   | `api-version` | 2017-05-01-preview |
   | `Content-Type` | application/json |

### Body

```json
{
    "properties": {
      "storageAccountId": "/subscriptions/df602c9c-7aa0-407d-a6fb-eb20c8bd1192/resourceGroups/apptest/providers/Microsoft.Storage/storageAccounts/appteststorage1",
      "eventHubAuthorizationRuleId": "/subscriptions/1a66ce04-b633-4a0b-b2bc-a912ec8986a6/resourceGroups/montest/providers/microsoft.eventhub/namespaces/mynamespace/eventhubs/myeventhub/authorizationrules/myrule",
      "eventHubName": "myeventhub",
      "workspaceId": "/subscriptions/4b9e8510-67ab-4e9a-95a9-e2f1e570ea9c/resourceGroups/insights-integration/providers/Microsoft.OperationalInsights/workspaces/myworkspace",
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

Use the `az monitor diagnostic-settings create` command to create a diagnostic setting with the Azure CLI. For more for information on command and parameter descriptions, see [Create diagnostic settings to send platform logs and metrics to different destinations](/cli/azure/monitor/diagnostic-settings#az-monitor-diagnostic-settings-create).

```azurecli
az monitor diagnostic-settings create 
    --resource /subscriptions/1a66ce04-b633-4a0b-b2bc-a912ec8986a6/resourceGroups/montest/providers/Microsoft.Cache/Redis/myname
    --name constoso-setting
    --logs '[{"category": "ConnectedClientList","enabled": true,"retentionPolicy": {"enabled": false,"days": 0}}]'    
    --event-hub MyEventHubName 
    --event-hub-rule /subscriptions/1a66ce04-b633-4a0b-b2bc-a912ec8986a6/resourceGroups/montest/providers/microsoft.eventhub/namespaces/mynamespace/authorizationrules/RootManageSharedAccessKey 
    --storage-account /subscriptions/1a66ce04-b633-4a0b-b2bc-a912ec8986a6/resourceGroups/montest/providers/Microsoft.Storage/storageAccounts/myuserspace
    --workspace /subscriptions/4b9e8510-67ab-4e9a-95a9-e2f1e570ea9c/resourceGroups/insights-integration/providers/Microsoft.OperationalInsights/workspaces/myworkspace
```

## Resource Logs

These fields and properties appear in the `ConnectedClientList` log category. In **Azure Monitor**, logs are collected in the `ACRConnectedClientList` table under the resource provider name of `MICROSOFT.CACHE`.

| Azure Storage field or property | Azure Monitor Logs property | Description |
| --- | --- | --- |
| `time` | `TimeGenerated` | The timestamp of when the log was generated in UTC. |
| `location` | `Location` | The location (region) the Azure Cache for Redis instance was accessed in. |
| `category` | n/a | Available log categories: `ConnectedClientList`. |
| `resourceId` | `_ResourceId` | The Azure Cache for Redis resource for which logs are enabled.|
| `operationName` | `OperationName` | The Redis operation associated with the log record. |
| `properties` | n/a | The contents of this field are described in the rows that follow. |
| `tenant` | `CacheName` | The name of the Azure Cache for Redis instance. |
| `roleInstance` | `RoleInstance` | The role instance that logged the client list. |
| `connectedClients.ip` | `ClientIp` | The Redis client IP address. |
| `connectedClients.privateLinkIpv6` | `PrivateLinkIpv6` | The Redis client private link IPv6 address (if applicable). |
| `connectedClients.count` | `ClientCount` | The number of Redis client connections from the associated IP address. |

### Sample storage account log

If you send your logs to a storage account, the contents of the logs look like this.

```json
{
    "time": "2021-08-05T21:04:58.0466086Z",
    "location": "canadacentral",
    "category": "ConnectedClientList",
    "properties": {
        "tenant": "mycache", 
        "connectedClients": [
            {
                "ip": "192.123.43.36", 
                "count": 86
            },
            {
                "ip": "10.1.1.4",
                "privateLinkIpv6": "fd40:8913:31:6810:6c31:200:a01:104", 
                "count": 1
            }
        ],
        "roleInstance": "1"
    },
    "resourceId": "/SUBSCRIPTIONS/E6761CE7-A7BC-442E-BBAE-950A121933B5/RESOURCEGROUPS/AZURE-CACHE/PROVIDERS/MICROSOFT.CACHE/REDIS/MYCACHE", 
    "Level": 4,
    "operationName": "Microsoft.Cache/ClientList"
}
```

## Log Analytics Queries

Here are some basic queries to use as models.

- Azure Cache for Redis client connections per hour within the specified IP address range:

```kusto
let IpRange = "10.1.1.0/24";
ACRConnectedClientList
// For particular datetime filtering, add '| where TimeGenerated between (StartTime .. EndTime)'
| where ipv4_is_in_range(ClientIp, IpRange)
| summarize ConnectionCount = sum(ClientCount) by TimeRange = bin(TimeGenerated, 1h)
```

- Unique Redis client IP addresses that have connected to the cache:

```kusto
ACRConnectedClientList
| summarize count() by ClientIp
```

## Next steps

For detailed information about how to create a diagnostic setting by using the Azure portal, CLI, or PowerShell, see [create diagnostic setting to collect platform logs and metrics in Azure](../azure-monitor/essentials/diagnostic-settings.md) article.
