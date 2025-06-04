---
title: Manage Azure Redis with Azure PowerShell
description: Learn how to create and perform administrative tasks for Azure Redis using Azure PowerShell.
ms.topic: conceptual
ms.date: 05/08/2025
zone_pivot_groups: redis-type
appliesto:
  - ✅ Azure Cache for Redis
  - ✅ Azure Managed Redis
ms.custom:
  - build-2025
---

# Manage Azure Redis with Azure PowerShell

This article shows you how to create, manage, and delete your Azure Redis instances by using Azure PowerShell.

## Prerequisites

- [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]
- Install Azure PowerShell, or use the PowerShell environment in [Azure Cloud Shell](/azure/cloud-shell/overview). For more information, see [Get started with Azure Cloud Shell](/azure/cloud-shell/quickstart).

  [:::image type="icon" source="~/reusable-content/cloud-shell/media/hdi-launch-cloud-shell.png" alt-text="Launch Azure Cloud Shell" :::](https://shell.azure.com)

[!INCLUDE [azure-powershell-requirements-no-header.md](~/reusable-content/azure-powershell/azure-powershell-requirements-no-header.md)]

- Make sure you're signed in to Azure with the subscription you want to create your cache under. To use a different subscription than the one you're signed in with, run `Select-AzSubscription -SubscriptionName <SubscriptionName>`.

::: zone pivot="azure-managed-redis"

>[!NOTE]
>Azure Managed Redis uses the Azure PowerShell [Az.RedisEnterpriseCache](/powershell/module/az.redisenterprisecache) commands.
>
>Azure Cache for Redis uses the `Az.RedisEnterpriseCache` commands for Enterprise tiers and the Azure PowerShell [Az.RedisCache](/powershell/module/az.rediscache) commands for Basic, Standard, and Premium tiers. You can use the following scripts to create and manage Azure Managed Redis or Azure Cache for Redis Enterprise. For Azure Cache for Redis Basic, Standard, and Premium, use the [Azure Cache for Redis](how-to-manage-redis-cache-powershell.md?pivots=azure-cache-redis) scripts.

## Create an Azure Managed Redis cache

You create new Azure Managed Redis instances using the [New-AzRedisEnterpriseCache](/powershell/module/az.redisenterprisecache/new-AzRedisEnterpriseCache) cmdlet. `ResourceGroupName`, `Name`, `Location`, and `Sku` are required parameters. The other parameters are optional and have default values.

Microsoft Entra authentication is enabled by default for all new caches and is recommended for security.

>[!IMPORTANT]
>Use Microsoft Entra ID with managed identities to authorize requests against your cache if possible. Authorization using Microsoft Entra ID and managed identity provides better security and is easier to use than shared access key authorization. For more information about using managed identities with your cache, see [Use Microsoft Entra for cache authentication with Azure Managed Redis](entra-for-authentication.md).

For all Azure Managed Redis PowerShell parameters and properties for `New-AzRedisEnterpriseCache`, see [New-AzRedisEnterpriseCache](/powershell/module/az.redisenterprisecache/new-azredisenterprisecache). To output a list of available parameters and their descriptions, run the following command.

```azurepowershell
Get-Help New-AzRedisEnterpriseCache -detailed
```

> [!NOTE]
> The first time you create an Azure Managed Redis cache in a subscription, Azure registers the `Microsoft.Cache` namespace for you. If prompted, you can use the Azure PowerShell `Register-AzResourceProvider -ProviderNamespace "Microsoft.Cache"` command to register the namespace.

The following example command creates an Azure Managed Redis instance with the specified name, location, resource group, and SKU, using default parameters. The instance is 1 GB in size with the non-SSL port disabled.

```azurepowershell
New-AzRedisEnterpriseCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -Sku Balanced_B1
```

<a name="databases"></a>
### Create and configure databases

You can use the [New-AzRedisEnterpriseCacheDatabase](/powershell/module/az.redisenterprisecache/new-azredisenterprisecachedatabase) cmdlet to create and configure databases for your Azure Managed Redis cache. To see a list of available parameters and their descriptions for `New-AzRedisEnterpriseCacheDatabase`, run the following command.

```azurepowershell
Get-Help New-AzRedisEnterpriseCacheDatabase -detailed
```

If you don't configure databases during cache creation, [New-AzRedisEnterpriseCache](/powershell/module/az.RedisEnterpriseCache/New-azRedisEnterpriseCache) creates one database in the cache named `default` by default, and all cache data goes into this `DB 0` database.

<a name="scale"></a>
## Update an Azure Managed Redis cache

You can update Azure Managed Redis instances using the [Update-AzRedisEnterpriseCache](/powershell/module/az.redisenterprisecache/update-azredisenterprisecache) cmdlet. To see a list of available parameters and their descriptions for `Update-AzRedisEnterpriseCache`, run the following command.

```azurepowershell
Get-Help Update-AzRedisEnterpriseCache -detailed
```

You can use the `Update-AzRedisEnterpriseCache` cmdlet to update properties such as `Sku`, `Tag`, and `MinimumTlsVersion`. The following command updates the minimum Transport Layer Security (TLS) version and adds a tag to the Azure Managed Redis cache named `myCache`.

```azurepowershell
Update-AzRedisEnterpriseCache -Name "myCache" -ResourceGroupName "myGroup" -MinimumTlsVersion "1.2" -Tag @{"tag1" = "value1"}
```

## Get information about an Azure Managed Redis cache

You can retrieve information about a cache using the [Get-AzRedisEnterpriseCache](/powershell/module/az.RedisEnterpriseCache/get-azRedisEnterpriseCache) cmdlet. To see a list of available parameters and their descriptions for `Get-AzRedisEnterpriseCache`, run the following command.

```azurepowershell
Get-Help Get-AzRedisEnterpriseCache -detailed
```

To return information about all caches in the current subscription, run `Get-AzRedisEnterpriseCache` without any parameters.

```azurepowershell
Get-AzRedisEnterpriseCache
```

To return information about all caches in a specific resource group, run `Get-AzRedisEnterpriseCache` with the `ResourceGroupName` parameter.

```azurepowershell
Get-AzRedisEnterpriseCache -ResourceGroupName myGroup
```

To return information about a specific cache, run `Get-AzRedisEnterpriseCache` with the `Name` and `ResourceGroupName` of the cache.

```azurepowershell
Get-AzRedisEnterpriseCache -Name myCache -ResourceGroupName myGroup
```

## Retrieve the access keys for an Azure Managed Redis cache

To retrieve the access keys for your cache, use the [Get-AzRedisEnterpriseCacheKey](/powershell/module/az.RedisEnterpriseCache/Get-azRedisEnterpriseCacheKey) cmdlet. To see a list of available parameters and their descriptions for `Get-AzRedisEnterpriseCacheKey`, run the following command.

```azurepowershell
Get-Help Get-AzRedisEnterpriseCacheKey -detailed
```

To retrieve the keys for your cache, call the `Get-AzRedisEnterpriseCacheKey` cmdlet with the `Name` and `ResourceGroupName` of the cache.

```azurepowershell
Get-AzRedisEnterpriseCacheKey -Name myCache -ResourceGroupName myGroup
```

>[!IMPORTANT]
>The `ListKeys` operation works only when access keys are enabled for the cache. The output of this command might compromise security by showing secrets, and may trigger a sensitive information warning.

## Regenerate access keys for an Azure Managed Redis cache

To regenerate the access keys for your cache, you can use the [New-AzRedisEnterpriseCacheKey](/powershell/module/az.RedisEnterpriseCache/New-azRedisEnterpriseCacheKey) cmdlet. To see a list of available parameters and their descriptions for `New-AzRedisEnterpriseCacheKey`, run the following command.

```azurepowershell
Get-Help New-AzRedisEnterpriseCacheKey -detailed
```

To regenerate the primary or secondary key for your cache, call the `New-AzRedisEnterpriseCacheKey` cmdlet with the cache `Name` and `ResourceGroupName`, and specify either `Primary` or `Secondary` for the `KeyType` parameter. The following example regenerates the secondary access key for a cache.

```azurepowershell
New-AzRedisEnterpriseCacheKey -Name myCache -ResourceGroupName myGroup -KeyType Secondary
```

## Delete an Azure Managed Redis cache

To delete an Azure Managed Redis cache, use the [Remove-AzRedisEnterpriseCache](/powershell/module/az.RedisEnterpriseCache/remove-azRedisEnterpriseCache) cmdlet. To see a list of available parameters and their descriptions for `Remove-AzRedisEnterpriseCache`, run the following command.

```azurepowershell
Get-Help Remove-AzRedisEnterpriseCache -detailed
```

The following example removes the cache named `myCache`.

```azurepowershell
Remove-AzRedisEnterpriseCache -Name myCache -ResourceGroupName myGroup
```

## Import Azure Managed Redis cache data

You can import data into an Azure Managed Redis instance using the `Import-AzRedisEnterpriseCache` cmdlet. To see a list of available parameters and their descriptions for `Import-AzRedisEnterpriseCache`, run the following command.

```azurepowershell
Get-Help Import-AzRedisEnterpriseCache -detailed
```

The cache `Name` and `ResourceGroupName` and the `SasUri` of the blob to import are required. The following command imports data from the blob specified by the SAS URI.

```azurepowershell
Import-AzRedisEnterpriseCache -ClusterName "myCache" -ResourceGroupName "myGroup" -SasUri @("<sas-uri>")
```

## Export Azure Managed Redis cache data

You can export data from an Azure Managed Redis instance using the `Export-AzRedisEnterpriseCache` cmdlet. To see a list of available parameters and their descriptions for `Export-AzRedisEnterpriseCache`, run the following command.

```azurepowershell
Get-Help Export-AzRedisEnterpriseCache -detailed
```

The cache `Name` and `ResourceGroupName` and the `SasUri` of the container to export are required. The following example command exports data from the container specified by the SAS URI.

```azurepowershell
Export-AzRedisEnterpriseCache -Name "myCache" -ResourceGroupName "myGroup" -SasUri "https://mystorageaccount.blob.core.windows.net/mycontainer?sp=signedPermissions&se=signedExpiry&sv=signedVersion&sr=signedResource&sig=signature;mystoragekey"
```

::: zone-end

::: zone pivot="azure-cache-redis"

>[!IMPORTANT]
>Azure Cache for Redis uses the Azure PowerShell [Az.RedisCache](/powershell/module/az.rediscache) commands for Basic, Standard, and Premium tiers, and the Azure PowerShell [Az.RedisEnterpriseCache](/powershell/module/az.redisenterprisecache) commands for Enterprise tiers.
>
>You can use the following scripts to create and manage Azure Cache for Redis Basic, Standard, and Premium. For Azure Cache for Redis Enterprise or Azure Managed Redis, use the [Azure Managed Redis](how-to-manage-redis-cache-powershell.md?pivots=azure-managed-redis) commands.

## Azure Cache for Redis PowerShell properties and parameters

The following tables show Azure PowerShell properties and descriptions for common Azure Cache for Redis parameters. For all Azure PowerShell parameters and properties for `Az.RedisCache`, see [AzRedisCache](/powershell/module/az.rediscache).

| Parameter | Description | Default |
| --- | --- | --- |
| Name |Name of the cache. | |
| Location |Location of the cache. | |
| ResourceGroupName |Resource group name in which to create the cache. | |
| Size |The size of the cache. Valid values are: P1, P2, P3, P4, P5, C0, C1, C2, C3, C4, C5, C6, 250 MB, 1 GB, 2.5 GB, 6 GB, 13 GB, 26 GB, 53 GB. |1 GB |
| ShardCount |The number of shards to create when creating a premium cache with clustering enabled. Valid values are: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. | |
| SKU |The SKU of the cache. Valid values are: Basic, Standard, Premium. |Standard |
| RedisConfiguration |Redis configuration settings. For details on each setting, see the following [RedisConfiguration properties](#properties-for-the-redisconfiguration-parameter) table. | |
| EnableNonSslPort |Whether the non-SSL port is enabled. |False |
| MaxMemoryPolicy |This parameter is deprecated. Use `RedisConfiguration` instead. | |
| StaticIP |When you host your cache in a virtual network, a unique IP address in the subnet for the cache. If not provided, one is chosen for you from the subnet. | |
| Subnet |When you host your cache in a virtual network, the name of the subnet in which to deploy the cache. | |
| VirtualNetwork |When you host your cache in a virtual network, the resource ID of the virtual network in which to deploy the cache. | |
| KeyType |Which access key to regenerate when renewing access keys. Valid values are: Primary, Secondary. | |

### Properties for the RedisConfiguration parameter

| Property | Description | Pricing tiers |
| --- | --- | --- |
| rdb-backup-enabled |Whether [Redis data persistence](../azure-cache-for-redis/cache-how-to-premium-persistence.md) is enabled |Premium only |
| rdb-storage-connection-string |The connection string to the storage account for [Redis data persistence](../azure-cache-for-redis/cache-how-to-premium-persistence.md). |Premium only |
| rdb-backup-frequency |The backup frequency for [Redis data persistence](../azure-cache-for-redis/cache-how-to-premium-persistence.md). |Premium only |
| maxmemory-reserved |[Memory reserved](../azure-cache-for-redis/cache-configure.md#memory-policies) for noncache processes. |Standard and Premium |
| maxmemory-policy |[Eviction policy]/azure-cache-for-redis/cache-configure.md#memory-policies) for the cache. |All pricing tiers |
| notify-keyspace-events |[Keyspace notifications]/azure-cache-for-redis/cache-configure.md#keyspace-notifications-advanced-settings). |Standard and Premium |
| hash-max-ziplist-entries |[Memory optimization](https://redis.io/docs/management/optimization/memory-optimization/) for small aggregate data types. |Standard and Premium |
| hash-max-ziplist-value |[Memory optimization](https://redis.io/docs/management/optimization/memory-optimization/) for small aggregate data types. |Standard and Premium |
| set-max-intset-entries |[Memory optimization](https://redis.io/docs/management/optimization/memory-optimization/) for small aggregate data types. |Standard and Premium |
| zset-max-ziplist-entries |[Memory optimization](https://redis.io/docs/management/optimization/memory-optimization/) for small aggregate data types. |Standard and Premium |
| zset-max-ziplist-value |[Memory optimization](https://redis.io/docs/management/optimization/memory-optimization/) for small aggregate data types. |Standard and Premium |
| databases |Number of databases. This property can be configured only at cache creation. |Standard and Premium |

## Create an Azure Cache for Redis cache

You create new Azure Cache for Redis instances using the [New-AzRedisCache](/powershell/module/az.rediscache/new-AzRedisCache) cmdlet. `ResourceGroupName`, `Name`, and `Location` are required parameters. The other parameters are optional and have default values.

>[!IMPORTANT]
>Microsoft Entra authentication is recommended for security. You can enable Microsoft Entra Authentication during or after cache creation.
>
>Use Microsoft Entra ID with managed identities to authorize requests against your cache if possible. Authorization using Microsoft Entra ID and managed identity provides better security and is easier to use than shared access key authorization. For more information about using managed identities with your cache, see [Use Microsoft Entra ID for cache authentication](../azure-cache-for-redis/cache-azure-active-directory-for-authentication.md).

To see a list of available parameters and their descriptions for [New-AzRedisCache](/powershell/module/az.rediscache/new-AzRedisCache), run the following command:

```azurepowershell
Get-Help New-AzRedisCache -detailed>
```

>[!NOTE]
>The first time you create an Azure Cache for Redis cache in a subscription, Azure registers the `Microsoft.Cache` namespace for you. If prompted, you can use the Azure PowerShell `Register-AzResourceProvider -ProviderNamespace "Microsoft.Cache"` command to register the namespace.

The following example command creates an Azure Cache for Redis instance with the specified name, location, and resource group, using default parameters. The instance is a Standard 1-GB cache with the non-SSL port disabled.

```azurepowershell
New-AzRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US"
```

To specify values for the `RedisConfiguration` parameter, enclose the key-value pairs in curly brackets `{}`. The following example creates a 1-GB cache with `@{"maxmemory-policy" = "allkeys-random", "notify-keyspace-events" = "KEA"}`. For more information, see [Keyspace notifications (advanced settings)](../azure-cache-for-redis/cache-configure.md#keyspace-notifications-advanced-settings) and [Memory policies](../azure-cache-for-redis/cache-configure.md#memory-policies).

```azurepowershell
New-AzRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -RedisConfiguration @{"maxmemory-policy" = "allkeys-random", "notify-keyspace-events" = "KEA"}
```

### Create a Premium cache

To create an  Azure Cache for Redis Premium-tier cache, specify a size of `P1` (6-60 GB), `P2` (13-130 GB), `P3` (26-260 GB), or `P4` (53-530 GB). To enable clustering, specify a shard count using the `ShardCount` parameter.

The following example creates a P1 Premium cache with three shards. A P1 premium cache is 6 GB in size, and with three shards the total size is 18 GB (3 x 6 GB).

```azurepowershell
New-AzRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -Sku Premium -Size P1 -ShardCount 3
```

<a name="databases"></a>
### Configure the databases setting

The `databases` setting in the [New-AzRedisCache](/powershell/module/az.rediscache/New-azRedisCache) cmdlet configures the number of databases in the cache. You can configure `databases` only for Standard and Premium tiers, and only during cache creation using PowerShell or other management clients.

If you don't specify a `databases` setting during cache creation, [New-AzRedisCache](/powershell/module/az.RedisCache/New-AzRedisCache) creates one database named `default`, and all cache data goes into this `DB 0` database. The database limit depends on cache tier and size, but the default setting is 16.

The following example creates a premium P3 (26 GB) cache with 48 databases.

```azurepowershell
New-AzRedisCache -ResourceGroupName myGroup -Name mycache -Location "North Central US" -Sku Premium -Size P3 -RedisConfiguration @{"databases" = "48"}
```
For more information on the `databases` property, see [Default Azure Cache for Redis server configuration](../azure-cache-for-redis/cache-configure.md#default-redis-server-configuration).

## Update an Azure Cache for Redis cache

You update Azure Cache for Redis instances using the [Set-AzRedisCache](/powershell/module/az.rediscache/Set-azRedisCache) cmdlet. To see a list of available parameters and their descriptions for `Set-AzRedisCache`, run the following command.

```azurepowershell
Get-Help Set-AzRedisCache -detailed
```

You can use the `Set-AzRedisCache` cmdlet to update properties such as `Size`, `Sku`, `EnableNonSslPort`, and the `RedisConfiguration` values. The following example command updates the `maxmemory-policy` for the Azure Cache for Redis instance named `myCache`.

```azurepowershell
Set-AzRedisCache -ResourceGroupName "myGroup" -Name "myCache" -RedisConfiguration @{"maxmemory-policy" = "allkeys-random"}
```

<a name="scale"></a>
## Scale an Azure Cache for Redis cache

You can use `Set-AzRedisCache` to scale an Azure Cache for Redis instance when you modify the `Size`, `Sku`, or `ShardCount` properties.

> [!NOTE]
> Scaling a cache using PowerShell has the same limits and guidelines as scaling a cache using the Azure portal. You can scale to a different pricing tier with the following restrictions:
>
> - You can't scale from a higher pricing tier to a lower pricing tier, such as from a Premium cache to a Standard or Basic cache, or from a Standard to a Basic cache.
> - You can scale from a Basic cache to a Standard cache, but you can't change the size at the same time. If you need a different size, you can do another scaling operation to the desired size.
> - You can't scale from a Basic cache directly to a Premium cache. You must scale from Basic to Standard in one scaling operation, and then from Standard to Premium in another operation.
> - You can't scale from a larger size down to the C0 (250 MB) size.
>
> For more information, see [How to scale Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-scale.md).

The following example shows how to scale a cache named `myCache` to a 2.5-GB size. This command works for a Basic or Standard cache.

```azurepowershell
Set-AzRedisCache -ResourceGroupName myGroup -Name myCache -Size 2.5GB
```

After you issue this command, the status of the cache is returned, similar to calling `Get-AzRedisCache`. The `ProvisioningState` is set to `Scaling`.

When the scaling operation is complete, the `ProvisioningState` changes to `Succeeded`. If you need to do another scaling operation, such as changing the size after changing from Basic to Standard, you must wait until the previous operation is complete. Otherwise, you receive an error similar to the following message.

```azurepowershell
Set-AzRedisCache : Conflict: The resource '...' is not in a stable state, and is currently unable to accept the update request.
```

## Get information about an Azure Cache for Redis cache

You can retrieve information about a cache using the [Get-AzRedisCache](/powershell/module/az.rediscache/get-azrediscache) cmdlet. To see a list of available parameters and their descriptions for `Get-AzRedisCache`, run the following command.

```azurepowershell
Get-Help Get-AzRedisCache -detailed
```

To return information about all caches in the current subscription, run `Get-AzRedisCache` without any parameters.

```azurepowershell
Get-AzRedisCache
```

To return information about all caches in a specific resource group, run `Get-AzRedisCache` with the `ResourceGroupName` parameter.

```azurepowershell
Get-AzRedisCache -ResourceGroupName myGroup
```

To return information about a specific cache, run `Get-AzRedisCache` with the cache `Name` and `ResourceGroupName`.

```azurepowershell
Get-AzRedisCache -Name myCache -ResourceGroupName myGroup
```

## Retrieve the access keys for an Azure Cache for Redis cache

To retrieve the access keys for your cache, you can use the [Get-AzRedisCacheKey](/powershell/module/az.rediscache/Get-azRedisCacheKey) cmdlet. To see a list of available parameters and their descriptions for `Get-AzRedisCacheKey`, run the following command.

```azurepowershell
Get-Help Get-AzRedisCacheKey -detailed
```

To retrieve the keys for your cache, call the `Get-AzRedisCacheKey` cmdlet with the cache `Name` and `ResourceGroupName`.

```azurepowershell
Get-AzRedisCacheKey -Name myCache -ResourceGroupName myGroup
```

>[!IMPORTANT]
>The `ListKeys` operation works only when access keys are enabled for the cache. The output of this command might compromise security by showing secrets, and may trigger a sensitive information warning.

## Regenerate access keys for an Azure Cache for Redis cache

To regenerate the access keys for your cache, you can use the [New-AzRedisCacheKey](/powershell/module/az.rediscache/New-azRedisCacheKey) cmdlet. To see a list of available parameters and their descriptions for `New-AzRedisCacheKey`, run the following command.

```azurepowershell
Get-Help New-AzRedisCacheKey -detailed
```

To regenerate the primary or secondary key for your cache, call the `New-AzRedisCacheKey` cmdlet with the cache `Name` and `ResourceGroupName`, and specify either `Primary` or `Secondary` for the `KeyType` parameter. The following example regenerates the secondary access key for a cache.

```azurepowershell
New-AzRedisCacheKey -Name myCache -ResourceGroupName myGroup -KeyType Secondary
```

## Delete an Azure Cache for Redis cache

To delete an Azure Cache for Redis cache, use the [Remove-AzRedisCache](/powershell/module/az.rediscache/remove-azrediscache) cmdlet. To see a list of available parameters and their descriptions for `Remove-AzRedisCache`, run the following command.

```azurepowershell
Get-Help Remove-AzRedisCache -detailed
```

The following example removes the cache named `myCache`.

```azurepowershell
Remove-AzRedisCache -Name myCache -ResourceGroupName myGroup
```

<a name="to-import-an-azure-cache-for-redis"></a>
## Import data into an Azure Cache for Redis cache

You can import data into an Azure Cache for Redis instance using the `Import-AzRedisCache` cmdlet.

> [!IMPORTANT]
> Import is available only for [Premium tier](../azure-cache-for-redis/cache-overview.md#service-tiers) caches. For more information, see [Import and export data in Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-import-export-data.md).

To see a list of available parameters and their descriptions for `Import-AzRedisCache`, run the following command.

```azurepowershell
Get-Help Import-AzRedisCache -detailed
```

The following command imports data from the blob specified by the `Files` parameter into Azure Cache for Redis.

```azurepowershell
Import-AzRedisCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -Files @("https://mystorageaccount.blob.core.windows.net/mycontainername/blobname?sv=signedVersion&sr=signedResource&sig=signature&st=signTime&se=signedExpiry&sp=signedPermissions") -Force
```

<a name="to-export-an-azure-cache-for-redis"></a>
## Export Azure Cache for Redis cache data

You can export data from an Azure Cache for Redis instance using the `Export-AzRedisCache` cmdlet.

> [!IMPORTANT]
> Export is available only for [Premium tier](../azure-cache-for-redis/cache-overview.md#service-tiers) caches. For more information, see [Import and export data in Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-import-export-data.md).
>
To see a list of available parameters and their descriptions for `Export-AzRedisCache`, run the following command.

```azurepowershell
Get-Help Export-AzRedisCache -detailed
```

The following command exports data from an Azure Cache for Redis instance into the container specified by the `Container` parameter.

```azurepowershell
Export-AzRedisCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -Prefix "blobprefix" -Container "https://mystorageaccount.blob.core.windows.net/mycontainer?sv=signedResource&sig=signature&st=signTime&se=signedExpiry&sp=signedPermissions"
```

<a name="to-reboot-an-azure-cache-for-redis"></a>
## Reboot an Azure Cache for Redis cache

You can reboot your Azure Cache for Redis instance using the `Reset-AzRedisCache` cmdlet.

> [!IMPORTANT]
> Reboot is only available for [Basic, Standard, and Premium tier](../azure-cache-for-redis/cache-overview.md#service-tiers) Azure Cache for Redis caches. For more information, see [Cache administration - reboot](../azure-cache-for-redis/cache-administration.md#reboot).

To see a list of available parameters and their descriptions for `Reset-AzRedisCache`, run the following command.

```azurepowershell
Get-Help Reset-AzRedisCache -detailed
```

The following command reboots both nodes of the specified cache.

```azurepowershell
Reset-AzRedisCache -ResourceGroupName "resourceGroupName" -Name "cacheName" -RebootType "AllNodes" -Force
```

::: zone-end

## General Azure PowerShell commands

Run these commands at the Azure PowerShell command prompt.

Check the Azure PowerShell version:

```azurepowershell
Get-Module Az | format-table version
```

Sign in to Azure:

```azurepowershell
Connect-AzAccount
```

See a list of your current subscriptions:

```azurepowershell
Get-AzSubscription | sort SubscriptionName | Select SubscriptionName
```

Specify an Azure subscription to use:

```azurepowershell
Select-AzSubscription -SubscriptionName ContosoSubscription
```

Get detailed help for any cmdlet:

```azurepowershell
Get-Help <cmdlet-name> -Detailed
```

## How to connect to other clouds

By default the Azure environment is `AzureCloud`, which represents the global Azure cloud. To connect to a different cloud instance, use the `Connect-AzAccount` command with the `-Environment` or -`EnvironmentName` command-line switch with the environment or environment name you want.

To see the list of available environments, run `Get-AzEnvironment`.

### Azure Government Cloud

To connect to the Azure Government Cloud, use<br>
`Connect-AzAccount -EnvironmentName AzureUSGovernment`<br>
Or<br>
`Connect-AzAccount -Environment (Get-AzEnvironment -Name AzureUSGovernment)`

To create a cache in the Azure Government Cloud, use the `USGov Virginia` or `USGov Iowa` locations.

For more information about the Azure Government Cloud, see [Microsoft Azure Government](https://azure.microsoft.com/features/gov/) and [Microsoft Azure Government Developer Guide](/azure/azure-government/documentation-government-developer-guide).

### Azure operated by 21Vianet

To connect to the Azure operated by 21Vianet (China) cloud, use<br>
`Connect-AzAccount -EnvironmentName AzureChinaCloud`<br>
Or<br>
`Connect-AzAccount -Environment (Get-AzEnvironment -Name AzureChinaCloud)`

To create a cache in the Azure operated by 21Vianet cloud, use the `China East` or `China North` locations.

### Microsoft Azure Germany

To connect to Microsoft Azure Germany, use<br>
`Connect-AzAccount -EnvironmentName AzureGermanCloud`<br>
Or<br>
`Connect-AzAccount -Environment (Get-AzEnvironment -Name AzureGermanCloud)`

To create a cache in Microsoft Azure Germany, use the `Germany Central` or `Germany Northeast` locations.

For more information about Microsoft Azure Germany, see [Microsoft Azure Germany](https://azure.microsoft.com/overview/clouds/germany/).

## Related content

* [Azure Managed Redis cmdlets](/powershell/module/az.redisenterprisecache)
* [Azure Cache for Redis cmdlets](/powershell/module/az.rediscache)
* [Azure PowerShell cmdlets](/powershell/module/)
* [PowerShell Community blog](https://devblogs.microsoft.com/powershell-community/)
