---
title: How to configure Azure Managed Redis (preview)
description: Understand the default Redis configuration for Azure Managed Redis and learn how to configure your Azure Managed Redis instances.


ms.service: azure-managed-redis
ms.topic: conceptual
ms.date: 11/15/2024
ms.custom: engagement-fy23, ignite-2024
---

# How to configure Azure Managed Redis (preview)

This article describes the configurations available for your Azure Managed Redis (preview) instances. This article also covers the [default Redis server configuration](#default-redis-server-configuration) for Azure Managed Redis instances.


## Configure Azure Managed Redis settings

You can view and configure the following settings using the **Resource Menu**.

- [Overview](#overview)
- [Activity log](#activity-log)
- [Access control (IAM)](#access-control-iam)
- [Tags](#tags)
- [Diagnose and solve problems](#diagnose-and-solve-problems)
- [Redis console](#redis-console)
- [Move to a new subscription](#move-your-cache-to-a-new-subscription)
- [Settings](#settings)
  - [Authentication](#authentication)
  - [Advanced settings](#advanced-settings)
	- [Access Ports](#access-ports)
	- [Memory policies](#memory-policies)
	- [Keyspace notifications](#keyspace-notifications)
	- [Data persistence](#data-persistence)
  - [Encryption](#encryption)
  - [Active geo-replication](#active-geo-replication)
  - [Scale](#scale)
  - [Schedule updates](#schedule-updates)
  - [Properties](#properties)
  - [Locks](#locks)
- [Administration](#administration)
  - [Import data](#importexport)
  - [Export data](#importexport)
  - [Private Endpoint](#private-endpoint)
- [Monitoring](#monitoring)
  - [Alerts](#alerts)
  - [Metrics](#metrics)
  - [Advisor recommendations](#advisor-recommendations)
  - [Diagnostic Settings - Metrics](#diagnostic-settings-metrics)
  - [Diagnostic Settings - Auditing](#diagnostic-settings-auditing)
- Automation
  - [Tasks (preview)](#tasks)
  - [Export template](#export-template)
- Help
  - [Resource health](#resource-health)
  - [Support + Troubleshooting](#support-and-troubleshooting)

## Overview

The **Overview** section provides you with basic information about your instance, such as name, endpoint, pricing tier, modules, geo-replication status, and selected cache metrics.

### Activity log

Select **Activity log** to view actions done to your cache. You can also use filtering to expand this view to include other resources. For more information on working with audit logs, see [Audit operations with Resource Manager](/azure/azure-monitor/essentials/activity-log). For more information on monitoring the activity log, see [Activity log](../monitor-cache.md#azure-activity-log).

### Access control (IAM)

The **Access control (IAM)** section provides support for Azure role-based access control (Azure RBAC) in the Azure portal. This configuration helps organizations meet their access management requirements simply and precisely. For more information, see [Azure role-based access control in the Azure portal](/azure/role-based-access-control/role-assignments-portal).

### Tags

The **Tags** section helps you organize your resources. For more information, see [Using tags to organize your Azure resources](/azure/azure-resource-manager/management/tag-resources).

### Diagnose and solve problems

Select **Diagnose and solve problems** to be provided with common issues and strategies for resolving them.

## Redis console

Direct access to the Redis console is not yet supported in Azure Managed Redis. Instead, consider using the [Redis CLI](managed-redis-how-to-redis-cli-tool.md) or a tool like [Redis Insight](https://redis.io/insight/).

## Move your cache to a new subscription

You can move your cache to a new subscription by selecting **Move**.

:::image type="content" source="media/managed-redis-configure/redis-cache-move.png" alt-text="Move Azure Managed Redis":::

For information on moving resources from one resource group to another, and from one subscription to another, see [Move resources to new resource group or subscription](/azure/azure-resource-manager/management/move-resource-group-and-subscription).

## Settings

The **Settings** section allows you to access and configure the following settings for your cache.

- [Authentication](#authentication)
- [Advanced settings](#advanced-settings)
- [Encryption](#encryption)
- [Active geo-replication](#active-geo-replication)
- [Scale](#scale)
- [Properties](#properties)
- [Locks](#locks)

### Authentication

You have two options for authentication: access keys and [Microsoft Entra Authentication](managed-redis-entra-for-authentication.md). Using Microsoft Entra Authentication is recommended because it is more secure. 

#### [Access keys](#tab/access-keys)

Select **Access keys** to view or regenerate the access keys for your cache. These keys are used by the clients connecting to your cache.

:::image type="content" source="media/managed-redis-configure/redis-cache-manage-keys.png" alt-text="Screenshot showing Authentication selected in the Resource menu and access Keys in the working pane.":::

#### [Microsoft Entra Authentication](#tab/entra)

Select **Microsoft Entra Authentication** to  a password-free authentication mechanism by integrating with Microsoft Entra ID.

:::image type="content" source="media/managed-redis-configure/managed-redis-microsoft-entra.png" alt-text="Screenshot showing Authentication selected in the Resource menu and Microsoft Entra ID in the working pane.":::

---

### Advanced settings

The following settings are configured on the **Advanced settings** on the left.

- [Access Ports](#access-ports)
- [Memory policies](#memory-policies)
- [Keyspace notifications](#keyspace-notifications)
- [Data persistence](#data-persistence)

#### Access Ports

By default, only TLS access is enabled for new caches. To enable non-TLS access, Select **Enable** for **Non-TLS access only** and then Select **Save**.

> [!NOTE]
> Azure Managed Redis supports TLS 1.2 and 1.3. See [What are the configuration settings for the TLS protocol?](managed-redis-tls-configuration.md) for more details.
>

#### Memory policies

When you create a cache, approximately 20% of the instance memory is reserved as a memory buffer for replication and other system processes. This helps the instance operate more effectively. 

**Eviction policy** configures the eviction policy for the cache and allows you to choose from the following eviction policies:

- `volatile-lru`: The default eviction policy. It removes the least recently used key out of all the keys with an expiration set.
- `allkeys-lru`: Removes the least recently used key.
- `volatile-random`: Removes a random key that has an expiration set.
- `allkeys-random`: Removes a random key.
- `volatile-ttl`: Removes the key with the shortest time to live based on the expiration set for it.
- `noeviction`: No eviction policy. Returns an error message if you attempt to insert data.
- `volatile-lfu`: Evicts the least frequently used keys out of all keys with an expire field set.
- `allkeys-lfu`: Evicts the least frequently used keys out of all keys.

For more information, see [Eviction policies](https://redis.io/topics/lru-cache#eviction-policies).


#### Keyspace notifications 

Redis keyspace notifications are configured using the **notify-keyspace-events** box. Keyspace notifications allow clients to receive notifications when certain events occur. 
Keyspace notifications can be used to [trigger Azure Functions](../cache-tutorial-functions-getting-started.md) based on activity on your Redis instance.  

For more information, see [Redis Keyspace Notifications](https://redis.io/topics/notifications).

#### Data persistence

**Data persistence** allows you to enable, disable, or configure data persistence for your Redis instance. Azure Managed Redis offers Redis persistence using either RDB persistence or AOF persistence.

For more information, see [Configure data persistence for an Azure Managed Redis instance](managed-redis-how-to-persistence.md).

### Encryption
Select **Encryption** to encrypt any data stored on disk, such as data persistence files or files being exported from the instance. 
For more information, see [Configure disk encryption for Azure Managed Redis instances using customer managed keys](managed-redis-how-to-encryption.md)

### Active geo-replication

**Active geo-replication**, on the Resource menu, provides a mechanism for linking up to five Azure Managed Redis instances in an active-active configuration.
This functionality can be used to replicate a cache across Azure regions, providing greater data durability and availability.
For more information, see [Configure active geo-replication for Azure Managed Redis instances](managed-redis-how-to-active-geo-replication.md)

### Scale

Select **Scale** to view or change the size and performance tier of your Redis instance. For more information on scaling, see [How to Scale Azure Managed Redis](managed-redis-how-to-scale.md).

### Schedule updates

Scheduled updates are not yet available in Azure Managed Redis. 

<!--
The **Schedule updates** section allows you to choose a maintenance window for Redis server updates for your cache.


> [!IMPORTANT]
> The maintenance window applies only to Redis server updates, and not to any Azure updates or updates to the operating system of the VMs that host the cache.

:::image type="content" source="media/managed-redis-configure/redis-schedule-updates.png" alt-text="Schedule updates":::

To specify a maintenance window, check the days you want. Then, specify the maintenance window start hour for each day, and select **OK**. The maintenance window time is in UTC.

For more information and instructions, see [Update channel and Schedule updates](managed-redis-administration.md#update-channel-and-schedule-updates).
-->

### Properties

Select **Properties** to view information about your instance, including the endpoint, Redis DB version, and clustering policy.

<!--
:::image type="content" source="media/managed-redis-configure/redis-cache-properties.png" alt-text="Azure Managed Redis Properties":::
-->

### Locks

The **Locks** section allows you to lock a subscription, resource group, or resource to prevent other users in your organization from accidentally deleting or modifying critical resources. 
For more information, see [Lock resources with Azure Resource Manager](/azure/azure-resource-manager/management/lock-resources).

## Administration

The **Administration** section allows you to access and configure the following settings for your Redis instance:

<!--
:::image type="content" source="media/managed-redis-configure/redis-cache-administration.png" alt-text="Administration":::
-->

- [Import data](#importexport)
- [Export data](#importexport)
- [Private endpoint](#private-endpoint)


### Import/Export

Import/Export is an Azure Managed Redis data management operation that allows you to import and export data to/from the Redis instance. 
You can import and export a Redis Database (RDB) snapshot to/from an Azure Storage Account. 
Use Import/Export to migrate between different Azure Managed Redis instances or populate the cache with data before use.

You can use import with Redis-compatible RDB files from any Redis server running in virtually any cloud or environment including:

- Redis running on VMs or containers
- cloud providers such as Amazon Web Services or others

Importing data is an easy way to create a cache with prepopulated data. During the import process, Azure Managed Redis loads the RDB files from Azure storage into memory, and then inserts the keys into the cache.

Export allows you to export the data stored in Azure Managed Redis to Redis compatible RDB files. You can use this feature to move data from one Azure Managed Redis instance to another or to another Redis server.
During the export process, a temporary file is created on the VM that hosts the Azure Managed Redis instance. The temporary file is uploaded to the designated storage account. When the export operation completes with either a status of success or failure, the temporary file is deleted.

For more information and instructions, see [Import and Export data in Azure Managed Redis](managed-redis-how-to-import-export-data.md).

### Private endpoint

The **Private Endpoint** section allows you to configure the private endpoint settings for your instance. 
We recommend using private endpoints for all production workloads. 

For more information, see [Azure Cache for Redis with Azure Private Link](managed-redis-private-link.md).

## Monitoring

The **Monitoring** section allows you to configure diagnostics and monitoring for your Azure Managed Redis instance.

- For more information on Azure Managed Redis monitoring and diagnostics, see [Monitor Azure Managed Redis](../monitor-cache.md).
- For a list of metrics used in Azure Managed Redis, see [Azure Managed Redis monitoring data reference](../monitor-cache-reference.md).

<!--
:::image type="content" source="media/managed-redis-configure/redis-cache-diagnostics.png" alt-text="Diagnostics":::
-->

### Alerts

Select **Alerts** to configure alerts based on Azure Managed Redis metrics. For more information, see [Create alerts](../monitor-cache.md#create-alerts).

### Metrics

Select **Metrics** to create your own custom chart to track the metrics you want to see for your cache. For more information, see [Create your own metrics](../monitor-cache.md#create-your-own-metrics).

### Advisor recommendations

The **Advisor recommendations** displays recommendations for your cache. During normal operations, no recommendations are displayed.

<!--Fran, I'm keeping the screenshots in this section because they're kind of necessary. But they should be updated at some point -->

:::image type="content" source="media/managed-redis-configure/redis-cache-no-recommendations.png" alt-text="Screenshot that shows where the Advisor recommendations are displayed but there are no current ones.":::

If any conditions occur during the operations of your cache such as imminent changes, high memory usage, network bandwidth, or server load, an alert is displayed in the **Overview** of the Resource menu.

:::image type="content" source="media/managed-redis-configure/redis-cache-recommendations-alert.png" alt-text="Screenshot that shows where alerts are displayed in when Overview is selected in the Resource menu.":::

Further information can be found on the **Recommendations** in the working pane of the Azure portal.

:::image type="content" source="media/managed-redis-configure/redis-cache-recommendations.png" alt-text="Screenshot that shows Advisor recommendations":::


### Diagnostic Settings Metrics

By default, cache metrics in Azure Monitor are [stored for 30 days](/azure/azure-monitor/essentials/data-platform-metrics) and then deleted. 
To persist your cache metrics for longer than 30 days, select **Diagnostics Settings - Metrics** to [configure the storage account](../monitor-cache.md#data-storage) used to store cache diagnostics.

>[!NOTE]
>In addition to archiving your cache metrics to storage, you can also [stream them to an Event hub or send them to Azure Monitor logs](/azure/azure-monitor/essentials/stream-monitoring-data-event-hubs).
>

### Diagnostic Settings Auditing

Use **Diagnostic Settings - Auditing** to log connections made to the Azure Managed Redis instance, including both successful and unsuccessful connection attempts. 
For more information, see [Monitor Azure Managed Redis data using diagnostic settings](managed-redis-monitor-diagnostic-settings.md)

## Automation

Azure Automation delivers a cloud-based automation, operating system updates, and configuration service that supports consistent management across your Azure and non-Azure environments.

### Tasks

Select **Tasks** to  help you manage Azure Managed Redis resources more easily. These tasks vary in number and availability, based on the resource type. Presently, you can only use the **Send monthly cost for resource** template to create a task while in preview.

For more information, see [Manage Azure resources and monitor costs by creating automation tasks](/azure/logic-apps/create-automation-tasks-azure-resources).

### Export template

Select **Export template** to build and export a template of your deployed resources for future deployments. For more information about working with templates, see [Deploy resources with Azure Resource Manager templates](/azure/azure-resource-manager/templates/deploy-powershell).

## Help

The settings in the **Help** section provide you with options for resolving issues with your cache.

<!--
:::image type="content" source="media/managed-redis-configure/redis-cache-support-troubleshooting.png" alt-text="Support and troubleshooting":::
-->

- [Resource health](#resource-health)
- [Support + Troubleshooting](#support-and-troubleshooting)

### Resource health

**Resource health** watches your resource and tells you if it's running as expected. Resource health is not yet supported for Azure Managed Redis.
For more information about the Azure Resource health service, see [Azure Resource health overview](/azure/service-health/resource-health-overview).

### Support and Troubleshooting

Select **Support + Troubleshooting** to open a support request for your cache.

## Other configuration information

### Default Redis server configuration

New Azure Managed Redis instances are configured with the following default Redis configuration values:

| Setting | Default value | Description |
| --- | --- | --- |
| `maxclients` |Depends on the pricing tier<sup>2</sup> |This value is the maximum number of connected clients allowed at the same time. Once the limit is reached Redis closes all the new connections, returning a 'max number of clients reached' error. |
| `maxmemory-reserved` | 20% of `maxmemory` | 20% of memory is reserved for replication buffers and other system processes. This parameter cannot be changed.|
| `maxmemory-policy` |`noeviction` | Maxmemory policy is the setting used by the Redis server to select what to remove when `maxmemory` (the size of the cache that you selected when you created the cache) is reached. With Azure Managed Redis, the default setting is `noeviction`. This setting returns an error message if you attempt to insert data into a full Redis instance. This setting can be configured in the Azure portal. For more information, see [Memory policies](#memory-policies). |
| `maxmemory-samples` |3 |To save memory, LRU and minimal TTL algorithms are approximated algorithms instead of precise algorithms. By default Redis checks three keys and picks the one that was used less recently. |
| `lua-time-limit` |5,000 |Max execution time of a Lua script in milliseconds. If the maximum execution time is reached, Redis logs that a script is still in execution after the maximum allowed time, and starts to reply to queries with an error. |
| `lua-event-limit` |500 |Max size of script event queue. |
| `client-output-buffer-limit normal` / `client-output-buffer-limit pubsub` |`0 0 0` / `32mb 8mb 60` |The client output buffer limits can be used to force disconnection of clients that aren't reading data from the server fast enough for some reason. A common reason is that a Pub/Sub client can't consume messages as fast as the publisher can produce them. For more information, see [https://redis.io/topics/clients](https://redis.io/topics/clients). |

> [!NOTE]
> Azure Managed Redis only supports a subset of Redis configuration settings. Some of the most commonly used configuration settings, such as such as **max-memory-policy**, are configurable through the Azure portal or command-line management tools such as Azure CLI or PowerShell.
> Other values may be configured using the `CONFIG SET` command. See [Compatibility with Redis Community Edition configuration settings](https://redis.io/docs/latest/operate/rs/references/compatibility/config-settings/) for more information.
>

### Databases

Currently, Azure Managed Redis only supports a single database per instance. 

### Maximum number of clients

The `maxclients` property is different for each Azure Managed Redis SKU.

See the [Azure Managed Redis pricing page](https://aka.ms/amrpricing) for more information about the connection limits per SKU.  


> [!NOTE]
> While each size of cache allows *up to* a certain number of connections, each connection to Redis has overhead associated with it. An example of such overhead would be CPU and memory usage as a result of TLS/SSL encryption. The maximum connection limit for a given cache size assumes a lightly loaded cache. If load from connection overhead *plus* load from client operations exceeds capacity for the system, the cache can experience capacity issues even if you have not exceeded the connection limit for the current cache size.
>

### Redis commands not supported in Azure Managed Redis

Configuration and management of Azure Managed Redis instances is managed by Microsoft, which disables several commands in order to ensure safe and consistent operation of the service. 
If you try to invoke them, you receive an error message similar to `"(error) ERR unknown command"`.

Blocked commands include:

- BGREWRITEAOF
- BGSAVE
- CLUSTER - Cluster write commands are disabled, but read-only cluster commands are permitted.
- MODULE LOAD
- MOVE
- PSYNC
- REPLICAOF
- REPLCONF - Azure Managed Redis instances don't allow customers to add external replicas. This [command](https://redis.io/commands/replconf/) is normally only sent by servers.
- SAVE
- SHUTDOWN
- SELECT
- SYNC

For a full list of blocked commands, see [Compatibility with Redis Community Edition commands](https://redis.io/docs/latest/operate/rs/references/compatibility/commands/)

For cache instances using active geo-replication, the following commands are also blocked to prevent accidental data loss:

- FLUSHALL
- FLUSHDB

Instead, use the [control plane flush operation](managed-redis-how-to-active-geo-replication.md#flush-operation) through the portal, PowerShell, or CLI. 

## Related content

- [How can I run Redis commands?](managed-redis-development-faq.yml#how-can-i-run-redis-commands-)
- [Monitor Azure Cache for Redis](../monitor-cache.md)
